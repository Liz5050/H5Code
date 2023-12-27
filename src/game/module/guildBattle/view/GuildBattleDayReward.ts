class GuildBattleDayReward extends BaseWindow {
	private list_reward:List;
	private btn_get:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.GuildBattle,"GuildBattleDayReward");
	}

	public initOptUI():void {
		this.list_reward = new List(this.getGObject("list_reward").asList);
		this.list_reward.data = ConfigManager.guildBattle.getDayReward();
		this.btn_get = this.getGObject("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
	}

	public updateAll():void {
		let canGet:boolean = CacheManager.guildBattle.checkTips();
		this.btn_get.title = LangActivity.LANG2;
		if(canGet) {
			App.DisplayUtils.grayButton(this.btn_get, false, false);
		}
		else {
			if(CacheManager.guildBattle.dayRewardGet == 1) {
				this.btn_get.title = LangActivity.LANG9;
			}
			App.DisplayUtils.grayButton(this.btn_get, true, true);
		}
	}

	private onGetRewardHandler():void {
		if(!CacheManager.guildBattle.isWiner) {
			Tip.showRollTip("胜利仙盟才能领取每日奖励");
			return;
		}
		this.hide();
		ProxyManager.guildBattle.getDailyReward();
		MoveMotionUtil.itemListMoveToBag(this.list_reward.list._children);
	}
}