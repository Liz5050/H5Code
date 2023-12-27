class NewServerLimitBuyPanel extends ActivityBaseTabPanel {
	private listItem:List;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypeNewServerLimitBuy;
	}

	public initOptUI():void {
		super.initOptUI();
		this.listItem = new List(this.getGObject("list_item").asList);
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.listItem.data = info.rewardInfos;
		this.listItem.scrollToView(0);
	}

	public updateRewardGetInfo():void {
		this.listItem.data = this.activityInfo.rewardInfos;
	}
}