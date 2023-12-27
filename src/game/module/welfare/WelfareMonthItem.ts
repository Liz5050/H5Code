class WelfareMonthItem extends ListRenderer{
	private baseItem: BaseItem;
	private daysTxt: fairygui.GTextField;
	private statusController: fairygui.Controller;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseitem");
		this.daysTxt = this.getChild("txt_days").asTextField;
		this.statusController = this.getController("c1");
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this._data = data;
		let str: Array<string> = data.rewardStr.split("#");
		let itemData: ItemData = RewardUtil.getReward(str[0]);
		this.baseItem.itemData = itemData;
		this.baseItem.showBind();
		this.baseItem.touchable = true;
		this.daysTxt.text = `签到${data.accDay}天`;
		this.statusController.selectedIndex = CacheManager.welfare.getMonthSignStatus(data);
		if(this.statusController.selectedIndex == 1){
			this.baseItem.touchable = false;
		}
	}

	private click(): void{
		if(this.statusController.selectedIndex == 1){
			ProxyManager.welfare.accumulateSignReward(this._data.accDay, CacheManager.vip.vipLevel > 0);
		}
	}
}