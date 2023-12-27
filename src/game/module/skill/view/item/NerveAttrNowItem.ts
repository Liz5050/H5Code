class NerveAttrNowItem extends ListRenderer{
	private attTxt:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
		this.attTxt = this.getChild("txt_num").asRichTextField;
	}

	public setData(data:any):void {
		this.attTxt.text = data.name + "+" + data.value;//HtmlUtil.html(data.value + "","#f2e1c0");
	}
}