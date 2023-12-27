class GuildBattleRankWindow extends BaseWindow {
    private c1:fairygui.Controller;
    private guildRank:GuildRankView;
    private playerRank:PlayerRankView;
    private guildReward:GuildRewardView;
    private playerReward:PlayerRewardView;

	public constructor() {
		super(PackNameEnum.GuildBattle,"GuildBattleRankWindow")

	}
	public initOptUI():void{
        this.c1 = this.getController("c1");
        this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onSelectIndexChange, this);
        this.guildRank = new GuildRankView(this.getGObject("guild_rank").asCom);
        this.playerRank = new PlayerRankView(this.getGObject("player_rank").asCom);
        this.guildReward = new GuildRewardView(this.getGObject("guild_reward").asCom);
        this.playerReward = new PlayerRewardView(this.getGObject("player_reward").asCom);
	}

	public updateAll(data?:any):void{
        this.c1.selectedIndex = 0;
        this.onSelectIndexChange();
	}

    public updateGuildRanks():void {
        this.guildRank.updateAll();
    }

    public updatePlayerRanks():void {
        this.playerRank.updateAll();
    }
    
    private onSelectIndexChange():void{
        let index:number = this.c1.selectedIndex;
        switch(index) {
            case 0:
                // this.guildRank.updateAll();
                ProxyManager.guildBattle.getRankList(EMgNewGuildWarRank.EMgNewGuildWarRankGuild);
                break;
            case 1:
                // this.playerRank.updateAll();
                ProxyManager.guildBattle.getRankList(EMgNewGuildWarRank.EMgNewGuildWarRankPlayer);
                break;
            case 2:
                this.guildReward.updateAll();
                break;
            case 3:
                this.playerReward.updateAll();
                break;
        }
    }
}
