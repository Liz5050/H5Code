class PrivilegeSetBtn extends fairygui.GComponent {
	private btn_privilege:fairygui.GButton;
	private _fromCode:number = 0;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.btn_privilege = this.getChild("btn_privilege").asButton;
		this.btn_privilege.icon = URLManager.getModuleImgUrl("privilegeSetBtn.png",PackNameEnum.Welfare2);
		this.btn_privilege.addClickListener(this.onClickHandler,this);
	}

	public set fromCode(value:number) {
		this._fromCode = value;
	}

	private onClickHandler():void {
		EventManager.dispatch(LocalEventEnum.PrivilegeCopySetOpen,this._fromCode);
	}
}