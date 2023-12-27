/**
 * 圣物合成材料列表
 * @author zhh
 * @time 2018-10-29 20:06:29
 */
class QCSmeltItem extends ListRenderer {
    private c1:fairygui.Controller;
    private txtName:fairygui.GTextField;
	private _isProd:boolean = false;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.txtName = this.getChild("txt_name").asTextField;
        //---- script make end ----
	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let itemData:ItemData = <ItemData>this._data;
		let idx:number = 0;
		if(itemData){
			idx = 1;
			this.setNameText(itemData.getName(true));
		}else {
			if(this._isProd){
				idx = 2;
			}
			this.setNameText("");
		}
		this.c1.setSelectedIndex(idx);
	}
	public setNameText(value:string):void{
		this.txtName.text = value;
	}
	public set isProd(value:boolean){
		this._isProd = value;
	}

}