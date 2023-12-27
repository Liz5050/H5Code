class BaseResultRewardWin extends BaseWindow  {
	private _tempData:any;
	public constructor(pkgName: string, contentName: string, moduleId: ModuleEnum = null,$parent: fairygui.GComponent = LayerManager.UI_Popup) {
		super(pkgName,contentName,moduleId,$parent);
	}	
	public initOptUI():void{

	}

	public show(param: any = null, callBack: CallBack = null):void{
		super.show(param,callBack);
		EventManager.dispatch(LocalEventEnum.PackHookGetTips,this.getTempData(true));
	}

	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		EventManager.dispatch(LocalEventEnum.PackHookGetTips,this.getTempData(false));
	}

	private getTempData(isHook:boolean):any{
		if(!this._tempData){
			this._tempData = {};
		}
		this._tempData.isHook = isHook;
		return this._tempData;
	}

}