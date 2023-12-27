/**
 * Controller基类
 */
class BaseController {
    /**模块唯一标识 */
    protected moduleId: ModuleEnum;
    /**
     * 模块视图
     */
    protected _view: BaseGUIView;

    /**视图所处层 */
    private _viewIndex: number = ViewIndex.One;
    /**第一次设置的index */
    protected _dfViewIndex: number = -1;
    private _isCustomIdx: boolean = false;
    /**
     * 消息列表
     */
    private _messages: any;

    /**
     * 该模块使用的实体类
     */
    private _model: BaseModel;

    private _listen: BaseListen;

    /**
     * 构造函数
     * @param moduleId {ModuleEnum} 模块标识
     */
    public constructor(moduleId: ModuleEnum) {
        this.moduleId = moduleId;
        this._messages = {};
        this._listen = new BaseListen();
        this.addListenerOnInit();
        this.addListen0(UIEventEnum.ModuleOpen, this.onModuleOpenHandler, this);
        this.addListen0(UIEventEnum.ModuleClose, this.onModuleCloseHandler, this);
        this.addListen0(UIEventEnum.ModuleToggle, this.onModuleToggleHandler, this);
        this._dfViewIndex = this._viewIndex;
    }

    /**
     * 显示模块
     */
    public show(data?: any): void {
        let callBack: CallBack = new CallBack(this.onShowedCall, this);
        callBack.param = data;
        this.getView().show(data, callBack);
    }

    private onShowedCall(data?: any): void {
        if(!this.isShow) {
            return;
        }
        this.addListenerOnShow();
        this.afterModuleShow(data);
        UIManager.addToShow(this.moduleId);
        //打开事件中添加的回调
        let callBack: CallBack;
        if (data != null && data.callBack instanceof CallBack) {
            callBack = data.callBack;
            callBack.fun.call(callBack.caller, callBack.param);
        }
    }

    /**
     * 关闭模块
     */
    public hide(data?: any): void {
        this._listen.hide();
        if (this.isShow) {
            this._view.hide();
        } else {
            UIManager.removeFromShow(this.moduleId);
        }
        if (this._view) { //模块还在在加载的过程执行了Hide方法 ,加载完成不能执行显示回调
            this._view.killShowCall();
        }
        this.afterModuleHide();
        if (this._viewIndex != this._dfViewIndex) {
            this.viewIndex = this._dfViewIndex;
        }
        // if(this._viewIndex == 2){
        //     this._viewIndex = 1;
        // }
        // UIManager.removeFromShow(this.moduleId);
    }

    /**
     * 销毁模块
     */
    public destroy(...params: any[]): void {
        if (!this._view) {
            return;
        }
        this._listen.destroy();
        this._view = null;
    }

    public get isShow(): boolean {
        return this._view && this._view.isShow;
    }

    /**
     * 获取模块视图
     */
    public getView(): BaseGUIView {
        if (!this._view) {
            this._view = this.initView();
        }
        UIManager.register(this.moduleId, this._view, this._viewIndex);
        return this._view;
    }

    public set viewIndex(viewIndex: number) {
        this._viewIndex = viewIndex;
        if (!this._isCustomIdx) {
            this._isCustomIdx = true;
            this._dfViewIndex = this._viewIndex;
        }
    }

    public get viewIndex(): number {
        return this._viewIndex;
    }

    /**
     * 根据名称获取对象
     */
    public getGObject(name: string, ...param): fairygui.GObject {
        return null;
    }

    /**
     * 初始化模块视图
     */
    protected initView(): any {
        return null;
    }

    /**类初始化时开启的监听 */
    protected addListenerOnInit(): void {

    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {

    }

    /**
     * 增加监听。一直会存在的监听
     */
    protected addListen0(name: any, listener: Function, caller: any): void {
        this._listen.add(name, 0, listener, caller);
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
     * 注册本模块消息
     * @param key 唯一标识
     * @param callbackFunc 侦听函数
     * @param callbackObj 侦听函数所属对象
     */
    public registerFunc(key: any, callbackFunc: Function, callbackObj: any): void {
        this._messages[key] = [callbackFunc, callbackObj];
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    public applyFunc(key: any, ...param: any[]): any {
        var listen: any = this._messages[key];
        if (listen) {
            return listen[0].apply(listen[1], param);
        } else {
            Log.trace(Log.MODULE, "消息" + key + "不存在侦听");
            return null;
        }
    }

    /**
     * 设置该模块使用的Model对象
     * @param model
     */
    public setModel(model: BaseModel): void {
        this._model = model;
    }

    /**
     * 添加服务器消息监听
     */
    protected addMsgListener(type: string, listener: Function, listenerObj: any): void {
        App.MessageCenter.addListener(type, listener, listenerObj);
    }

    protected afterModuleShow(data?: any): void {
        if (data != null && data["tabIndex"] != null) {
            this.getView().gotoTab(data["tabIndex"], data["cName"]);
            if (data["tabIndex2"] != null) {
                this.getView().gotoTab(data["tabIndex2"], data["cName2"]);
            }
        }

        if (data && data.tabType != null) {
            let view: BaseGUIView = this.getView();
            if (view && view instanceof BaseTabModule) {
                view.setIndex(data.tabType, data);
            }
        }
    }

    protected afterModuleHide(data?: any): void {

    }

    private onModuleOpenHandler(moduleId: any, data: any = {}, viewIndex: number = -1): void {
        if (this.moduleId == moduleId) {
            let isOk:boolean = HomeUtil.isModuleOpen(moduleId, data); //判断功能开启
            if (isOk) {
                if (viewIndex > -1) { //这里只是临时设置 关闭后会设回默认的
                    this._viewIndex = viewIndex; //这里不能调用set方法 即 this.viewIndex 设置属性 
                }
                this.show(data);                
            }
            if(data && data.cbFn && data.caller){
                data.cbFn.call(data.caller,isOk);
            }

        }
    }

    private onModuleCloseHandler(moduleId: any, data?: any): void {
        if (this.moduleId == moduleId) {
            this.hide(data);
        }
    }

    private onModuleToggleHandler(moduleId: any, param: any = {}): void {
        if (this.moduleId == moduleId) {
            if (this.isShow) {
                this.hide(param);
            } else {
                if (!HomeUtil.isModuleOpen(moduleId, param)) {
                    return;
                }
                this.show(param);
            }
        }
    }

    public sendSocketMsg(cmd: any, data: any): void {
        if (typeof cmd == 'number') {
            cmd = ECmdGame[cmd];
        }
        App.Socket.send({ cmd: cmd, body: data });
    }
}
