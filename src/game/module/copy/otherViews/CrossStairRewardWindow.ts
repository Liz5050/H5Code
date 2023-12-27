class CrossStairRewardWindow extends BaseWindow {
	private c1:fairygui.Controller;
	private list_reward:List;
	private list_rank:List;
	public constructor() {
		super(PackNameEnum.Copy,"CrossStairRewardWindow");
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onSelectedChange,this);
		this.list_reward = new List(this.getGObject("list_reward").asList);
		this.list_rank = new List(this.getGObject("rank_view").asCom.getChild("list_rank").asList);
	}

	public updateAll(index:number = 0):void {
		this.c1.selectedIndex = index;
		this.updateRankInfo();
	}

	private updateReward():void {
		let list:any[];
		if(this.c1.selectedIndex == 1) {
			//闯关奖励
			list = ConfigManager.crossStair.getFloorCfgs();
		}
		else if(this.c1.selectedIndex == 2){
			//排名奖励
			list = ConfigManager.crossStair.getAllRankCfgs(1);
		}
		this.list_reward.data = list;
	}

	private onSelectedChange():void {
		if(this.c1.selectedIndex == 0) {
			this.updateRankInfo();
		}
		else {
			this.updateReward();
			this.list_reward.scrollToView(0);
		}
	}

	public updateRankInfo():void {
		if(this.c1.selectedIndex != 0) return;
		let ranks:any[] = CacheManager.crossStair.rankInfos;
		this.list_rank.data = ranks;
	}
}