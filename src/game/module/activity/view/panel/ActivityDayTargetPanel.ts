/**
 * 冲榜达标
 */
class ActivityDayTargetPanel extends ActivityBaseTabPanel {
	private list_item:List;
	private txt_myValue:fairygui.GRichTextField;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeReachGoal;
		// this.isDestroyOnHide = false;
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txt_myValue = this.getGObject("txt_myValue").asRichTextField;
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		rewards.sort(this.sortRewardInfos);
		this.list_item.data = rewards;
		let values:any[] = info.rewardInfos[0].getTargetValues();
		this.txt_myValue.text = values[2];
	}

	/**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
		this.activityInfo.rewardInfos.sort(this.sortRewardInfos);
		this.list_item.data = this.activityInfo.rewardInfos;
	}

	private sortRewardInfos(value1:ActivityRewardInfo,value2:ActivityRewardInfo):number {
		let hadGetCount1:number = value1.hadGetCount;
		let hadGetCount2:number = value2.hadGetCount;
		if(hadGetCount1 <= 0 && hadGetCount2 > 0) return -1;
		if(hadGetCount1 > 0 && hadGetCount2 <= 0) return 1;
		return value1.conds[0] - value2.conds[0];
	}
}