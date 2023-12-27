/**
 * 合成材料item
 * @author zhh
 * @time 2018-10-09 11:53:44
 */
class SmeltMaterialsItem extends ListRenderer {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private baseItem:BaseItem;
    private txtCount:fairygui.GTextField;
	private img_eq:fairygui.GImage;
	private _viewW:number = 229;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
		this.img_eq = this.getChild("img_eq").asImage;
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.txtCount = this.getChild("txt_count").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.baseItem.itemData = this._data.item;
		this.c1.setSelectedIndex(this._data.idx);
		let tIdx:number = this._data.tIdx;
		if(this._data.idx==1){ //X号
			// tIdx = 0;
			this.baseItem.updateNum("");
			this.txtCount.text = "" + this.baseItem.itemData.getItemAmount();
		}
		this.c2.setSelectedIndex(tIdx);
		let isGray:boolean = !this._data.isItemOK;
		this.baseItem.grayed = isGray;
		this.baseItem.setColorMcGrayed(isGray);
		this.grayed = isGray; 		

	}
	public get width():number{
		return this.getW();
	}
	public getW():number{
		if(!this.img_eq){
			return this._viewW;
		}
		return this.img_eq.x + this.img_eq.width; 
	}


}