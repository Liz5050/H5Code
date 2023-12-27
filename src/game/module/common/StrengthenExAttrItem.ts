class StrengthenExAttrItem extends ListRenderer {
	private nameTxt: fairygui.GTextField;
	private valueTxt: fairygui.GTextField;
	private addValueTxt: fairygui.GTextField;
	private arrowImg: fairygui.GImage;

	private attrInfo: AttrInfo;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.valueTxt = this.getChild("txt_value").asTextField;
		this.addValueTxt = this.getChild("txt_addValue").asTextField;
		this.arrowImg = this.getChild("img_arrow").asImage;
	}

	public setData(data: any, index: number): void {
		this._data = data;
		this.itemIndex = index;
		this.attrInfo = data;
		if (this.attrInfo != null) {
			let addValue: number = this.attrInfo.addValue;
			this.nameTxt.text = this.attrInfo.name;
			this.valueTxt.text = "+" + this.attrInfo.value;
			this.addValueTxt.text = addValue == 0 ? "" : this.attrInfo.nextValue + "";
			this.arrowImg.visible = addValue > 0;
		}
	}
}