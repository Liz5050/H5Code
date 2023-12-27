abstract class BaseWindow extends BaseGUIView {
	protected frame: fairygui.GComponent;
	protected closeObj: fairygui.GObject;
	protected moduleId: ModuleEnum;
	protected closeTipTxt: fairygui.GObject;
	protected txtTitle:fairygui.GTextField;
	protected windowTitleLoader:GLoader;
	protected isForceCloseObj:boolean = false;
	protected isShowCloseObj:boolean = false;
	public constructor(pkgName: string, contentName: string, moduleId: ModuleEnum = null, $parent: fairygui.GComponent = LayerManager.UI_Popup) {
		super($parent);
		this.packageName = pkgName;
		this.viewName = contentName;
		this.moduleId = moduleId;
		this.modal = true;
		this.isCenter = true;
		this.isPopup = true;
		this.isAnimateShow = true;
		this.isDestroyOnHide = true;
	}

	/**
	 * 初始化可操作UI组件。与UI编辑器中命名的组件对应。
	 */
	abstract initOptUI(): void;

	/**
	 * 界面打开时自动调用。根据缓存更新所有
	 */
	public updateAll(data: any = null): void {

	}

	public initUI(): void {
		super.initUI();

		let frame: fairygui.GObject = this.getGObject("frame", false);//为了兼容老窗口
		if (frame != null) {
			this.frame = frame.asCom;
					
		}
		if (this.frame != null) {
			this.windowTitleLoader = <GLoader>this.frame.getChild("icon");
			this.closeObj = this.frame.getChild("closeButton");
			this.closeTipTxt = this.frame.getChild("txt_closeTip");
			let gobj:fairygui.GObject = this.frame.getChild("title");
			if(gobj){
				this.txtTitle = gobj.asTextField;
			}
		} else {
			this.closeObj = this.getGObject("btn_close", false);
			this.closeTipTxt = this.getGObject("txt_closeTip", false);
		}
		if(this.isForceCloseObj){ //强制根据 btn_close 得到关闭按钮
			this.closeObj = this.getGObject("btn_close", false);
		}

		if (this.closeObj != null) {
			this.closeObj.addClickListener(this.onCloseHandler, this);
			this.closeObj.visible = this.isShowCloseObj;
		}
		this.initOptUI();
	}

	/**
	 * 设置标题
	 */
	public set title(title: string) {
		if (this.txtTitle) {
			this.txtTitle.text = title;
		}
	}
	/**设置图片标题 */
	public set titleIcon(iconName:string){
		if(this.windowTitleLoader){
			this.windowTitleLoader.load(URLManager.getTitleUrl(iconName));
		}
		
	}

	public onShow(param: any = null): void {
		if (this.closeTipTxt != null) {
			this.closeTipTxt.visible = this.isPopup;
		}
		this.updateAll(param);//在onShow前updateAll。因为updateAll里会改变组件大小
		super.onShow();
	}

	public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
		if(this.moduleId) {
			EventManager.dispatch(UIEventEnum.ModuleClose,this.moduleId);
		}
	}

    protected onCloseHandler() {
        if (this.moduleId != null) {
            EventManager.dispatch(UIEventEnum.ModuleClose, this.moduleId);
        } else {
            this.hide();
        }
    }

	public onHide(data: any = null): void {
		super.onHide(data);
		// this.destroyView();
	}
}