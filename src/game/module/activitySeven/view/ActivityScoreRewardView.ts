class ActivityScoreRewardView extends BaseWindow {
	private list_item:List;
	public constructor() {
		super(PackNameEnum.ActivitySeven,"ActivityScoreRewardView");
	}

	public initOptUI():void {
		this.list_item = new List(this.getGObject("list_item").asList);
		this.list_item.data = ConfigManager.activitySeven.getScoreRewardCfgs();
	}

	public updateAll():void {

	}
}