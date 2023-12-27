class GuildBattleOwnerReward extends BaseWindow {
	private list_reward:List;
	public constructor() {
		super(PackNameEnum.GuildBattle,"GuildBattleOwnerReward");
	}

	public initOptUI():void {
		this.list_reward = new List(this.getGObject("list_reward").asList,{showGoldEffect:true});
		let cfg:any = ConfigManager.guildBattle.getStaticCfg();
		this.list_reward.data = RewardUtil.getStandeRewards(cfg.winLeaderReward);
	}

	public updateAll():void {
	}
}