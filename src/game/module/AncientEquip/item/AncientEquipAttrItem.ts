class AncientEquipAttrItem extends ListRenderer {
	private txtName:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----        
        this.txtName = this.getChild("txt_name").asTextField;
        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txtName.text = CommonUtils.getAttrName(this._data[0])+"    "+HtmlUtil.html("+"+this._data[1],Color.Color_8);
	}
	
}