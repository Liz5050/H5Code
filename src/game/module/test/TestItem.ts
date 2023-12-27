class TestItem extends ListRenderer {
	private typeTxt: fairygui.GTextField;
	private nameTxt: fairygui.GTextField;
	private descTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.typeTxt = this.getChild("txt_type").asTextField;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.descTxt = this.getChild("txt_desc").asTextField;
	}

	public setData(data: any): void {
		this.typeTxt.text = data.type + "";
		this.nameTxt.text = data.typeName;
		this.descTxt.text = data.typeParamDesc;
	}
}