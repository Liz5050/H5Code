class PropertyText extends ListRenderer {
	protected txt_type:fairygui.GTextField;
	protected txt_number:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.txt_type = this.getChild("txt_type").asTextField;
		this.txt_number = this.getChild("txt_number").asTextField;
	}
	public setData(data:any):void{
		this._data = data;
		var attrs:string[] = CommonUtils.configStrToArr(this._data,false,",");		
		this.txt_type.text = CommonUtils.getAttrName(Number(attrs[0]));
		this.txt_number.text = attrs[1];
		 
	}
}