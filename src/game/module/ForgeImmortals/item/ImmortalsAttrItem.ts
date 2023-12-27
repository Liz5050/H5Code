/**
 * 属性item
 * @author zhh
 * @time 2018-08-20 20:25:21
 */
class ImmortalsAttrItem extends ListRenderer {
    private txtAttr:fairygui.GRichTextField;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtAttr = this.getChild("txt_attr").asRichTextField;
        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;		
		this.txtAttr.text = CommonUtils.getAttrName(this._data[0])+"+"+this._data[1];
	}


}