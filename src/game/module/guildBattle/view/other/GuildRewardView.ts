class GuildRewardView extends BaseView{
    private list_ownerReward:List;
    private list_rankReward:List;

	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	public initOptUI():void{
        this.list_ownerReward = new List(this.getGObject("list_ownerReward").asList,{showGoldEffect:true});
        this.list_rankReward = new List(this.getGObject("list_rankReward").asList);
	}

	public updateAll(data?:any):void{
		this.list_ownerReward.data = ConfigManager.guildBattle.getGuildBattleWinReward();
		this.list_rankReward.data = ConfigManager.guildBattle.getRankAllRewards(EMgNewGuildWarRank.EMgNewGuildWarRankGuild);
		this.list_rankReward.scrollToView(0);
	}
}