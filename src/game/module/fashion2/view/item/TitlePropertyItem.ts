class TitlePropertyItem extends ListRenderer {
	private txt_attr:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.txt_attr = this.getChild("txt_attr").asRichTextField;
	}
	public setData(data:any):void {
		this._data = data;
		this.txt_attr.text = GameDef.EJewelName[data[0]][0] + "：" + HtmlUtil.html(data[1] + "", Color.Color_8);
	}
}