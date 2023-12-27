class TitleCategoryItem extends ListRenderer {
	private titleTxt:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
	}

	public setData(data: any): void {
		this._data = data;
		this.title = data.name;
	}
}