class PlayerRewardView extends BaseView{
    private list_rankReward:List;
    private list_scoreReward:List;

	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	public initOptUI():void{
        this.list_rankReward = new List(this.getGObject("list_rankReward").asList);
        this.list_scoreReward = new List(this.getGObject("list_scoreReward").asList);
	}
	public updateAll(data?:any):void{
		this.list_rankReward.data = ConfigManager.guildBattle.getRankAllRewards(EMgNewGuildWarRank.EMgNewGuildWarRankPlayer);
		this.list_scoreReward.data = ConfigManager.guildBattle.getScoreAllRewards();
		this.list_rankReward.scrollToView(0);
		this.list_scoreReward.scrollToView(0);
	}
}