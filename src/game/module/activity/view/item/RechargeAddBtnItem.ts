class RechargeAddBtnItem extends ListRenderer {
	private btn:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.btn = this.getChild("btn_tab").asButton;
	}

	public setData(data:ActivityRewardInfo):void {
		this._data = data;
		this.btn.title = Math.floor(data.conds[2] / 100) + "元礼包";
	}

	public set btnSelected(value:boolean) {
		this.selected = value;
		this.btn.selected = value;
	}
}