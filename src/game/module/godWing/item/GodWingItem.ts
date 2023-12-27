/**
 * 合成类型的item
 * @author zhh
 * @time 2018-08-13 10:54:46
 */
class GodWingItem extends ListRenderer {
   private btnStatus:fairygui.GButton;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.btnStatus = this.getChild("btn_status").asButton;      

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		//this.itemIndex = index;
		this.btnStatus.text = (<ItemData>this._data).getName();
	}
	
	public set selected(value:boolean){
		this.btnStatus.selected = value;
	}


}