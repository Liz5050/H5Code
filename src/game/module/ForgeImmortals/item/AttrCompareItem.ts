/**
 * 属性item
 * @author zhh
 * @time 2018-08-20 22:28:02
 */
class AttrCompareItem extends ListRenderer {
    private txtName:fairygui.GTextField;
    private txtValue:fairygui.GTextField;
    private txtValue2:fairygui.GTextField;
	private imgArrow:fairygui.GImage;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtValue = this.getChild("txt_value").asTextField;
        this.txtValue2 = this.getChild("txt_value2").asTextField;
		this.imgArrow = this.getChild("img_arrow").asImage;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txtName.text = CommonUtils.getAttrName(this._data[0]);
		this.txtValue.text = ""+this._data[1];
		if(this._data[2]){
			this.txtValue2.text = this._data[2]+"";
			this.imgArrow.visible = true;
		}else{
			this.txtValue2.text = "";
			this.imgArrow.visible = false;
		}

	}


}