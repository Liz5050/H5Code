/**
 * 穹苍副本排行榜界面item
 * @author zhh
 * @time 2018-10-08 20:13:31
 */
class QCCopyFloorRewardItem extends ListRenderer {
    private baseItem:BaseItem;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.baseItem = <BaseItem>this.getChild("baseItem");
        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.baseItem.itemData = this._data;
		if(this.itemIndex==1){			
			this.baseItem.setNameText(this.baseItem.itemData.getColorString("S首通奖励"));
		} 
	}


}