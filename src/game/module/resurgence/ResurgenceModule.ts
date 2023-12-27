class ResurgenceModule extends BaseModule{

	public constructor(moduleId:ModuleEnum) {
		super(moduleId, PackNameEnum.Resurgence);
	}

	public initOptUI():void{
		this.getGObject("btn_revive").addClickListener(this.revive,this);
		this.x = (fairygui.GRoot.inst.width - this.view.width)/2;
		this.y = (fairygui.GRoot.inst.height - this.view.height)/2;
	}

	public updateAll():void{

	}

	/**复活 */
	private revive():void{
		EventManager.dispatch(LocalEventEnum.Revive);
	}
}