/**
 * 神羽装备界面的item
 * @author zhh
 * @time 2018-08-13 14:44:56
 */
class GodWingEquipItem extends ListRenderer {
    private baseItem:BaseItem;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.enableToolTip = false;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let isTip:boolean = false;
		let type:number = this._data.type;
		let item:ItemData = this._data.item;
		this.baseItem.itemData = item;
		if(!item){			
			this.baseItem.icoUrl = URLManager.getModuleImgUrl(`type${type}.png`,PackNameEnum.GodWing);
		}
		let packItem:ItemData = CacheManager.godWing.getPackEquipGodWing(this._data.roleIndex,type);
		isTip = packItem!=null || CacheManager.godWing.isTypeCanSmelt(this._data.roleIndex,type);
		CommonUtils.setBtnTips(this,isTip,78,6);
	}

	

}