/**
 * UI基类
 */
class BaseGUIView extends BaseUIView {
    public view: fairygui.GComponent;
    /**父级 */
    protected thisParent: fairygui.GComponent;
    protected defParent: fairygui.GComponent;
    /**遮罩层颜色 */
    protected modalColor: number = 0x000000;
    /**遮罩层透明度 */
    protected modalAlpha: number = 0.7;
    /**遮罩层 */
    protected _modalLayer: fairygui.GGraph;
    /**popup 点击空白区域关闭 */
    protected _isPopup: boolean;
    /**点击时是否关闭 */
    protected isCloseOnClick: boolean = false;
    /**是否关闭时销毁界面资源 */
    protected isDestroyOnHide: boolean = false;
    /**是否显示遮罩 */
    private _modal: boolean = false;
    /**视图组件名称 */
    private _viewName: string;

    private _listen: BaseListen;

    /**是否已初始化 */
    protected _isInit: boolean = false;
    /**是否在显示状态也重新加载 */
    protected _isForceLoad: boolean = false;
    protected costDict: { [name: string]: number } = {};
    /**显示调用时传入的参数 */
    protected _onShowParam: any;
    /**是否动画显示/隐藏 */
    protected isAnimateShow: boolean;
    /**是否在显示中 */
    private _isShow: boolean = false;
    /**是否居中显示 */
    private _isCenter: boolean = false;
    /**包中的资源个数 */
    //private _pkgResNum: number;
    /**显示成功回调 */
    private _onShowcallBack: CallBack;
    /**关闭成功回调 */
    private _onHidecallBack: CallBack;
    /**资源是否在加载中 */
    private _isLoading: boolean;
    /**是否需要显示 */
    private _isNeedShow: boolean;

    public constructor(thisParent: fairygui.GComponent = LayerManager.UI_Main) {
        super();
        this._listen = new BaseListen();
        this.thisParent = thisParent;
        this.defParent = thisParent;
        this.addClickListener(this.onThisClick, this);
    }

    /**
     * 显示
     * @param param 参数
     * @param callBack 显示成功后的回调
     */
    public show(param: any = null, callBack: CallBack = null): void {
        this._isNeedShow = true;
        this._onShowParam = param;
        this._onShowcallBack = callBack;
        if (param != null && param.parent != null && param.parent != this.thisParent) {
            //改变了父级
            this.thisParent = param.parent;
            this.removeFromParent();
            this._isShow = false;
        }
        if (this.isShow && !this._isForceLoad) {
            this.onShow(param);
            if (callBack != null) {
                callBack.fun.call(callBack.caller, callBack.param);
            }
            this.onStageResize();//已显示的，重置
            return;
        } else {
            if (!this.isInit) {
                ResourceManager.load(this.packageName, UIManager.getPackNum(this.packageName), new CallBack(this.onLoadComplete, this));
                this._isLoading = true;
            } else {
                if (!ResourceManager.isPackageLoaded(this.packageName)) {
                    ResourceManager.load(this.packageName, UIManager.getPackNum(this.packageName), new CallBack(() => {
                        this.showModal(true);
                        this.thisParent.addChild(this);
                        this._isShow = true;
                        this.onShow(param);
                        if (callBack != null) {
                            callBack.fun.call(callBack.caller, callBack.param);
                        }
                        FuiUtil.renderGComponent(this.view, this.packageName);
                        if (this instanceof BaseTabModule) {
                            let tabViews: { [type: number]: BaseTabView } = this.getTabViews()
                            for (let type in tabViews) {//多个tab使用的资源包和模块包一样，加载模块包的时候，所有标签页需要重新渲染
                                let tabView: BaseTabView = tabViews[type];
                                if (tabView.packageName == this.packageName) {
                                    FuiUtil.renderGComponent(tabView, this.packageName);
                                }
                            }
                        }
                    }, this));
                } else {
                    let isDestroyed: boolean = PackageDestroyManager.instance.isDestroyed(this);
                    this.showModal(true);
                    this.thisParent.addChild(this);
                    this._isShow = true;
                    this.onShow(param);
                    if (callBack != null) {
                        callBack.fun.call(callBack.caller, callBack.param);
                    }
                    if (isDestroyed) {
                        FuiUtil.renderGComponent(this, this.packageName);
                    }
                }
            }
        }
    }

    /**
     * 根据特定的 pkgName 和 contentName显示UI
     */
    public showByPkgContent(param: any = null, callBack: CallBack = null, pkgName: string = "", contentName: string = ""): void {
        if (pkgName) {
            this.packageName = pkgName;
            this._isInit = false;
        }
        if (contentName) {
            this.viewName = contentName;
            this._isInit = false;
        }
        this.show(param, callBack);
    }

    public showByXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.isCenter = false;
        this.show();
    }

    public killShowCall(): void {
        this._isNeedShow = false;
    }

    /**
     * 关闭
     * @param param 参数
     * @param callBack 关闭成功后的回调
     */
    public hide(param: any = null, callBack: CallBack = null): void {
        this._isNeedShow = false;
        this._onHidecallBack = callBack;
        this.thisParent = this.defParent;
        if (this.isAnimateShow) {
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 200).call(() => {
                this.removeFromParent();
                // if (callBack != null) {
                //     callBack.fun.call(callBack.caller, callBack.param);
                // }
                // this._isShow = false;
                // this.onHide();
            });
        } else {
            this.removeFromParent();
            // if (callBack != null) {
            //     callBack.fun.call(callBack.caller, callBack.param);
            // }
            // this._isShow = false;
            // this.onHide();
        }

        if (callBack != null) {
            callBack.fun.call(callBack.caller, callBack.param);
        }
        this._isShow = false;
        this.onHide();
    }
    /**
     * 模块显示时开启的监听
     * 这里只能使用this.addListen1()函数进行事件监听
     */
    protected addListenerOnShow(): void {
        //for override
    }

    protected onClickParent(e: egret.TouchEvent): void {
        if (e.target instanceof egret.DisplayObject) {
            let b: boolean = PopupManager.checkClickOutRange(this, this.thisParent, e.stageX, e.stageY);
            if (b) {
                e.stopImmediatePropagation();
            }

        }
    }

    public onShow(data: any = null): void {
        this.addListenerOnShow();
        if (this.isCenter) {
            this.center();
        }
        if (this._isPopup) {
            this.thisParent.displayObject.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickParent, this);
        }

        App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);

        if (this.isAnimateShow) {
            this.setSize(this.view.width, this.view.height);
            this.addRelation(this.view, fairygui.RelationType.Size);
            this.setPivot(0.5, 0.5, true);
            this.setXY(fairygui.GRoot.inst.width / 2, fairygui.GRoot.inst.height / 2);
            this.setScale(0, 0);
            egret.Tween.removeTweens(this);
            egret.Tween.get(this)
                .to({ scaleX: 1.05, scaleY: 1.05 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                    // EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
                    this.dispatchViewOpened();
                }, egret.Ease.backInOut);
        } else {
            this.setSize(0, 0);
            this.removeRelation(this.view);
            this.setPivot(0, 0, true);
            // EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
            this.dispatchViewOpened();
        }

        if (this.isDestroyOnHide) {
            PackageDestroyManager.instance.onViewShowOrHide(this, true);
        }
    }

    public onHide(data: any = null): void {
        this._listen.hide();
        this.showModal(false);
        if (this._isPopup) {
            this.thisParent.displayObject.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickParent, this);
        }
        App.StageUtils.getStage().removeEventListener(egret.Event.RESIZE, this.onStageResize, this);
        EventManager.dispatch(UIEventEnum.ViewClosed, this["__class__"]);
        if (this.isDestroyOnHide) {
            PackageDestroyManager.instance.onViewShowOrHide(this, false);
        }
    }

    /**
     * 增加监听，界面关闭时会移除监听
     */
    protected addListen1(name: any, listener: Function, caller: any): void {
        this._listen.add(name, 1, listener, caller);
    }

    /**
     * 主动移除指定监听
     */
    protected removeListener(name: any, listener: Function, caller: any): void {
        this._listen.remove(name, listener, caller);
    }

    /**
     * 视图名称，默认为Main
     */
    public set viewName(viewName: string) {
        this._viewName = viewName;
    }

    public get isShow(): boolean {
        return this._isShow;
    }

    public get isNeedShow(): boolean {
        return this._isNeedShow;
    }

    public set isInit(isInit: boolean) {
        this._isInit = isInit;
    }

    public get isInit(): boolean {
        return this._isInit;
    }

    public get modal(): boolean {
        return this._modal;
    }

    public set modal(val: boolean) {
        this._modal = val;
    }

    public set isCenter(isCenter: boolean) {
        this._isCenter = isCenter;
    }

    public get isCenter(): boolean {
        return this._isCenter;
    }

    public set isPopup(value: boolean) {
        this._isPopup = value;
    }

    public get isPopup(): boolean {
        return this._isPopup;
    }

    /**
     * 根据名称获取子组件
     */
    public getGObject(name: string, isNeedLog: boolean = true): fairygui.GObject {
        let obj = this.view.getChild(name);
        if (obj == null) {
            if (isNeedLog) {
                Log.trace(Log.UI, "找不到组件：", this.packageName + ":" + name);
            }
        }
        return obj;
    }

    /**
     * 根据名称获取控制器
     */
    public getController(name: string = null): fairygui.Controller {
        let obj = this.view.getController(name)
        return obj;
    }

    /**
     * 打开指定标签页
     */
    public gotoTab(index: number, cName: string = "c1"): void {
        let tabController: fairygui.Controller = this.getController(cName);
        if (tabController != null) {
            if (tabController.selectedIndex == 0 && index == 0) {
                tabController.setSelectedIndex(-1);
            }
            tabController.selectedIndex = index;
        }
    }

    public initUI(): void {
        if (this.packageName != null && !this._isInit) {
            this.costDict["init"] = Date.now();
            this.view = FuiUtil.createComponent(this.packageName, this._viewName).asCom;
            this.addChild(this.view);
        }
        this._isInit = true;

    }

    public center(): void {
        if (this.isAnimateShow) {
            this.setXY(Math.round(fairygui.GRoot.inst.width / 2), Math.round(fairygui.GRoot.inst.height / 2));
        } else {
            this.setXY(Math.round((fairygui.GRoot.inst.width - this.width) / 2), Math.round((fairygui.GRoot.inst.height - this.height) / 2));
        }
    }

    public get width(): number {
        if (this.view == null) {
            return 0;
        }
        return this.view.width;
    }

    public get height(): number {
        if (this.view == null) {
            return 0;
        }
        return this.view.height;
    }

    public removeView(): void {
        if (this.view != null) {
            this.view.removeFromParent();
        }
    }

    /**
     * 资源加载完成
     */
    private onLoadComplete(): void {
        this._isLoading = false;
        this._isForceLoad = false;
        if (!this._isNeedShow) {
            return;
        }
        let framExc: FrameExecutor = new FrameExecutor(2);
        framExc.regist(() => {
            if (!this._isNeedShow) { //分帧过程中执行了hide 或者杀死了加载回调
                return;
            }
            this.initUI();
        }, this);

        framExc.regist(() => {
            if (!this._isNeedShow) { //分帧过程中执行了hide 或者杀死了加载回调
                return;
            }
            this.showModal(true);
            this.thisParent.addChild(this);
            if (this.isAnimateShow) {
                egret.Tween.removeTweens(this);
                egret.Tween.get(this).to({ scaleX: 0, scaleY: 0 }).to({ scaleX: 1.05, scaleY: 1.05 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                }, egret.Ease.backInOut);
            }

            this._isShow = true;
            this.onShow(this._onShowParam);

            if (this._onShowcallBack != null) {
                this._onShowcallBack.fun.call(this._onShowcallBack.caller, this._onShowcallBack.param);
            }
        }, this);
        framExc.execute();
    }

    /**
     * 显示遮罩层
     */
    public showModal(isShow: boolean): void {
        if (isShow && this.modal) {
            if (this._modalLayer == null) {
                this._modalLayer = new fairygui.GGraph();
                this._modalLayer.touchable = true;
            }
            this._modalLayer.clearGraphics();
            this._modalLayer.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            this._modalLayer.drawRect(0, 0, 0, this.modalColor, this.modalAlpha);
            // this._modalLayer.addRelation(this, fairygui.RelationType.Size);不需要关联，遮罩层大小始终为root大小
            this.thisParent.addChild(this._modalLayer);
        } else {
            if (this._modalLayer != null) {
                this._modalLayer.removeFromParent();
            }
        }
    }

    protected onThisClick(): void {
        if (this.isCloseOnClick) {
            this.hide();
        }
    }

    protected onStageResize(): void {
        if (this.isShow) {
            if (this.isCenter) {
                this.center();
            }
            if (this.modal) {
                this._modalLayer.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                this._modalLayer.clearGraphics();
                this._modalLayer.drawRect(0, 0, 0, this.modalColor, this.modalAlpha);
            }
        }
    }

    public dispose(): void {
        if (this.view) {
            this.view.dispose();
            this.view = null;
            this.isInit = false;
        }
        super.dispose();
    }

    public destroyView(): void {
        if (!this.isInit)
            return;
        if (this.view) {
            this.view.dispose();
            this.view = null;
        }
        this.isInit = false;
        if (ResourceManager.isPackageLoaded(this.packageName)) {
            ResourceManager.removePackage(this.packageName);
            RES.destroyRes(this.packageName + "@atlas0_png");
            RES.destroyRes(this.packageName + "_fui");
        }
    }

    protected dispatchViewOpened(thisView: fairygui.GComponent = null): void {
        if (thisView == null) {
            thisView = this;
        }
        App.TimerManager.doDelay(200, () => {//延迟是为了先执行完标签页隐藏。否则指引时用到的标签页位置不对。
            EventManager.dispatch(UIEventEnum.ViewOpened, thisView["__class__"]);
        }, this);
    }

}