class DayRechargeTabButton extends ListRenderer {
	private btn_page:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.btn_page = this.getChild("btn_page").asButton;
	}

	public setData(data:any):void {
		this._data = data;
		this.btn_page.text = data.num + "元宝";
	}

	public set btnSelected(value:boolean) {
		this.btn_page.selected = value;
		this.selected = value;
	}
}