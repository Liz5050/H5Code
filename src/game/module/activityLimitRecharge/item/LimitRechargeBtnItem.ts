class LimitRechargeBtnItem extends ListRenderer {
	private btn:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.btn = this.getChild("btn_tab").asButton;
	}

	public setData(data:ActivityRewardInfo):void {
		this._data = data;
		let needRecharge:number = Math.floor(data.conds[0] / 100);
		this.btn.title = App.StringUtils.substitude(LangActivity.L12,needRecharge);
	}

	public set btnSelected(value:boolean) {
		this.selected = value;
		this.btn.selected = value;
	}
}