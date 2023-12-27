class GuildCopyCache extends ActivityWarfareCache {
	private _rankInfos:any[];//仙盟组队副本仙盟排名
	private _getGuildId:number = 0;//领取奖励时所在的仙盟ID
	private _canGetReward:boolean = false;//是否参加过仙盟组队副本(领奖前提要参加过活动)
	public constructor() {
		super();
		this.iconId = IconResId.GuildTeam;
	}

	/**
	 * 更新排行榜信息
	 */
	public updateRankInfo(data:any):void {
		this._rankInfos = data.seqRank.data;
		if(this._getGuildId != data.getGuildId_I) {
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildNew,CacheManager.guildNew.checkTips());
		}
		this._getGuildId = data.getGuildId_I;
		this._canGetReward = data.canGet_B;
	}

	/**
	 * 我的仙盟排名
	 */
	public get myGuildRank():number {
		if(!this._rankInfos) return 0;
		for(let i:number = 0; i < this._rankInfos.length; i++) {
			if(CacheManager.guildNew.isMyGuild(this._rankInfos[i].guildId_I)) {
				return i + 1;
			}
		}
		return 0;
	}

	/**
	 * 领取奖励时所在仙盟的排名
	 */
	public get rewardGuildRank():number {
		if(!this._rankInfos || this._getGuildId == 0) return 0;
		for(let i:number = 0; i < this._rankInfos.length; i++) {
			if(this._rankInfos[i].guildId_I == this._getGuildId) {
				return i + 1;
			}
		}
		return 0;
	}

	/**
	 * 领取排名奖励时所在的仙盟id
	 * 0代表未领奖
	 */
	public getRewardGuildId():number {
		return this._getGuildId;
	}

	public get rankInfos():any[] {
		return this._rankInfos;
	}

	/**是否参加过仙盟组队副本 */
	public get canGetReward():boolean {
		return this._canGetReward;
	}

	public checkTips():boolean {
		return false;
		/*
		//暂时屏蔽仙盟boss 2019年1月17日11:08:44
		if(!this.canGetReward) {
			//未参加过不能领奖
			return;
		}
		let rewards:any[] = ConfigManager.team.getGuildRankRewards();
		if(this.getRewardGuildId() > 0 || this.isOpen) {
			//已领取、活动中不可领取
			return false;
		}
		let myGuildRank:number = this.myGuildRank;
		for(let i:number = 0; i < rewards.length; i++) {
			if(myGuildRank >= rewards[i].rankStart && myGuildRank <= rewards[i].rankEnd) {
				return true;
			}
		}
		return false;
		*/
	}

	public clear():void {
		super.clear();
		this._canGetReward = false;
		this._getGuildId = 0;
		this._rankInfos = null;
	}
}