class ActivityHolidayRechargeBtn extends ListRenderer {
	private btn:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.btn = this.getChild("btn").asButton;
	}

	public setData(data:any):void {
		this._data = data;
		this.btn.title = "充值" + (data/100) + "元"
	}

	public setSelected(value:boolean):void {
		this.btn.selected = value;
	}
}