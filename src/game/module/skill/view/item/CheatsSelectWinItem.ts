/**
 * 秘境选中界面的item
 * @author zhh
 * @time 2018-09-04 17:59:00
 */
class CheatsSelectWinItem extends ListRenderer {
    private baseItem:BaseItem;
    private txtTips:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.txtTips = this.getChild("txt_tips").asTextField;
		this.baseItem.enableToolTip = false;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let item:ItemData = data.item;
		this.baseItem.itemData = item;
		this.txtTips.visible = CacheManager.cheats.isEmbed(this._data.roleIndex,item.getType(),item.getColor());		
	}

	public set selected(value:boolean){
		this.baseItem.setSelectStatus(value);
	}


}