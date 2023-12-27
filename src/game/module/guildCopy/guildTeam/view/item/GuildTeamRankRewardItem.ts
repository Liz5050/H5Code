class GuildTeamRankRewardItem extends ListRenderer {
	private c1:fairygui.Controller;
	private baseItem:BaseItem;
	private txt_rank:fairygui.GTextField;
	private btn_get:fairygui.GGraph;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.btn_get = this.getChild("btn_get").asGraph;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.baseItem.setData(RewardUtil.getStandeRewards(data.rewards)[0]);
		let rewardGuildId:number = CacheManager.guildCopy.getRewardGuildId();
		this.c1.selectedIndex = 0;
		if(rewardGuildId > 0) {
			//已领取
			let rewardGuildRank:number = CacheManager.guildCopy.rewardGuildRank;
			if(rewardGuildRank >= data.rankStart && rewardGuildRank <= data.rankEnd) {
				this.c1.selectedIndex = 2;
			}
		}
		else {
			let myGuildRank:number = CacheManager.guildCopy.myGuildRank;
			if(CacheManager.guildCopy.isOpen || !CacheManager.guildCopy.canGetReward) {
				//活动进行中，或者未参加过活动，不可领
				this.c1.selectedIndex = 0;
			}
			else if(myGuildRank >= data.rankStart && myGuildRank <= data.rankEnd) {
				//可领取奖励
				this.c1.selectedIndex = 1;
			}
		}
		if(data.rankStart == data.rankEnd) {
			this.txt_rank.text = "第" + data.rankStart + "名";
		}
		else {
			this.txt_rank.text = "参与奖";
		}
	}

	/**
	 * 领取奖励
	 */
	private onGetRewardHandler():void {
		ProxyManager.team2.getGuildTeamRankReward();
		this.c1.selectedIndex = 2;
	}
}