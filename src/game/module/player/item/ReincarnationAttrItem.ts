class ReincarnationAttrItem extends ListRenderer{
	private txt_attr:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.txt_attr = this.getChild("txt_attr").asRichTextField;
	}

	public setData(data:any):void {
		this._data = data;
		if(data == "") {
			this.txt_attr.text = "";
			return;
		}
		let attr:string[] = String(data).split(",");
		this.txt_attr.text = HtmlUtil.html(CommonUtils.getAttrName(Number(attr[0])) + "：" + attr[1],Color.Green2);
	}
}