class NerveAttrNextItem extends ListRenderer{
	private attTxt:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
		this.attTxt = this.getChild("txt_num").asRichTextField;
	}

	public setData(data:any):void {
		this.attTxt.text = data.name + HtmlUtil.html("+" + data.value,Color.Green2);
	}
}