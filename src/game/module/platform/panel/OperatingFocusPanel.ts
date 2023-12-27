class OperatingFocusPanel extends OperatingBgPanel{
	public constructor() {
		super();
		this.rewardType = EShareRewardType.EShareRewardTypeCare;
	}
	public updateAll(data?:any):void{
		super.updateAll(data);
		this.c1.setSelectedIndex(1);
	}
}