class TitleNameItem extends ListRenderer {
	private controller:fairygui.Controller;
	private nameTxt1: fairygui.GTextField;
	private nameTxt2: fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.nameTxt1 = this.getChild("txt_title1").asTextField;
		this.nameTxt2 = this.getChild("txt_title2").asTextField;
	}

	public setData(data: any): void {
		this._data = data;
		if(CacheManager.title.isInUse(data.code)) this.controller.selectedIndex = 1;
		else this.controller.selectedIndex = 0;
		let nameStr: string = data.name;
		if (nameStr.length > 4) {
			this.nameTxt1.x = 19;
			this.nameTxt1.text = nameStr.slice(0, 4);
			this.nameTxt2.text = nameStr.slice(4);
		}
		else {
			this.nameTxt1.x = 37;
			this.nameTxt1.text = nameStr;
			this.nameTxt2.text = "";
		}
	}

	public set inUse(value:boolean) {
		this.controller.selectedIndex = value ? 1 : 0;
	}	
}