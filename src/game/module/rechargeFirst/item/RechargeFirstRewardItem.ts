/**
 * 首充奖励
 * @author zhh
 * @time 2018-09-04 10:23:15
 */
class RechargeFirstRewardItem extends ListRenderer {
    private c1:fairygui.Controller;
    private baseItem:BaseItem;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.isShowName = false;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let itemData:ItemData = <ItemData>data;
		this.baseItem.itemData = data;
		let lblType:number = ConfigManager.rechargeFirst.getLabelType(itemData.getCfgCode());
		this.c1.setSelectedIndex(lblType);
		
	}


}