/**
 * 每日签到项
 */

class WelfareDailyItem extends ListRenderer{
	private baseItem: BaseItem;
	private statusController: fairygui.Controller;
	private vipController: fairygui.Controller;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseitem");
		this.statusController = this.getController("c2");
		this.vipController = this.getController("c1");
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this._data = data;
		let str: Array<string> = data.rewardStr.split("#");
		let itemData: ItemData = RewardUtil.getReward(str[0]);
		this.baseItem.itemData = itemData;
		this.baseItem.showBind();
		this.baseItem.touchable = true;
		this.statusController.selectedIndex = CacheManager.welfare.getDailySignStatus(data);
		if(this.statusController.selectedIndex == 1){
			this.baseItem.touchable = false;
		}
		if(!data.doubleVipLevel){
			this.vipController.selectedIndex = 0;
		}else{
			this.vipController.selectedIndex = data.doubleVipLevel - 1;
		}
	}

	private click(): void{
		if(this.statusController.selectedIndex == 1){
			ProxyManager.welfare.dailySignReward(CacheManager.vip.vipLevel > 0, this._data.day);
		}
	}
}