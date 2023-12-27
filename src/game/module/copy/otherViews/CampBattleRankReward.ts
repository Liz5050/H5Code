class CampBattleRankReward extends BaseView {
	private list_rank:List;
	private list_score:List;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	public initOptUI():void {
		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.list_rank.data = ConfigManager.campBattleRankCfg.getRankAllRewards();
		this.list_score = new List(this.getGObject("list_score").asList);
	}

	public updateAll():void {
		this.list_score.data = ConfigManager.campBattleScoreCfg.getScoreAllRewards();
		this.list_score.scrollToView(0);
		this.list_rank.scrollToView(0);
	}
}