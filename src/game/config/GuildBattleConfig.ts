class GuildBattleConfig {
	private rankReward:BaseConfig;//排名奖励
	private scoreReward:BaseConfig;//积分奖励
	private revive:BaseConfig;//复活时间
	private warStatic:BaseConfig;

	private scoreRewardArr:any[];
	private rankRewardDict:{[type:number]:any[]};//1伤害排名 2个人积分排名 3仙盟积分排名

	//胜利仙盟盟主奖励
	private ownerReward:ItemData[];
	//每日奖励
	private dayReward:ItemData[];
	public constructor() {
		this.rankReward = new BaseConfig("t_mg_guild_war_rank","type,rankStart,rankEnd");
		this.scoreReward = new BaseConfig("t_mg_guild_war_score","score");
		this.revive = new BaseConfig("t_mg_guild_war_revive","scoreMin,scoreMax");
		this.warStatic = new BaseConfig("t_mg_guild_war_static","id");
	}

	private parseRankReward():void {
		this.rankRewardDict = {};
		let dict:any = this.rankReward.getDict();
		for(let key in dict) {
			let type:number = dict[key].type;
			let list:any[] = this.rankRewardDict[type];
			if(!list) {
				list = [];
				this.rankRewardDict[type] = list;
			}
			list.push(dict[key]);
		}
	}

	/**
	 * 积分奖励配置
	 */
	public getScoreAllRewards():any[] {
		if(!this.scoreRewardArr) {
			this.scoreRewardArr = [];
			let dict:any = this.scoreReward.getDict();
			for(let key in dict) {
				this.scoreRewardArr.push(dict[key]);
			}
		}
		return this.scoreRewardArr;
	}

	/**
	 * 排名奖励配置
	 * @param type 1伤害排名 2个人积分排名 3仙盟积分排名
	 */
	public getRankAllRewards(type:EMgNewGuildWarRank):any[] {
		if(!this.rankRewardDict) {
			this.parseRankReward();
		}
		return this.rankRewardDict[type];
	}

	/**
	 * 获取排名奖励
	 */
	public getRankRewardCfg(rank:number,type:EMgNewGuildWarRank):any {
		if(!this.rankRewardDict) {
			this.parseRankReward();
		}
		let list:any[] = this.rankRewardDict[type];
		for(let i:number = 0; i < list.length; i++) {
			if(list[i].rankStart <= rank && list[i].rankEnd >= rank) {
				return list[i];
			}
		}
		return null;
	}

	/**
	 * 获取当前档的积分奖励配置
	 * （根据已领取过滤）
	 */
	public getCurScoreRewardCfg():any {
		let dict:any = this.scoreReward.getDict();
		let minScore:number = 9999999;
		for(let key in dict) {
			let score:number = Number(key);
			if(!CacheManager.guildBattle.hadGet(score)) {
				if(minScore > score) {
					minScore = score;
				}
			}
		}
		return this.scoreReward.getByPk(minScore);
	}

	/**
	 * 仙盟战胜利仙盟盟主奖励
	 */
	public getGuildBattleWinReward():ItemData[] {
		if(!this.ownerReward) {
			let dict:any = this.warStatic.getDict();
			this.ownerReward = [];
			for(let key in dict) {
				let rewardStr:string[] = dict[key].winLeaderReward.split("#");
				for(let i:number = 0; i < rewardStr.length; i++) {
					if(rewardStr[i] == "") continue;
					this.ownerReward.push(RewardUtil.getReward(rewardStr[i]));
				}
				break;
			}
		}
		return this.ownerReward;
	}
	
	/**
	 * 每日奖励
	 */
	public getDayReward():ItemData[] {
		if(!this.dayReward) {
			this.dayReward = [];
			let dict:any = this.warStatic.getDict();
			for(let key in dict) {
				let rewardStr:string[] = dict[key].dailyRewards.split("#");
				for(let i:number = 0; i < rewardStr.length; i++) {
					if(rewardStr[i] == "") continue;
					this.dayReward.push(RewardUtil.getReward(rewardStr[i]));
				}
				break;
			}
		}
		return this.dayReward;
	}

	/**
	 * 根据当前积分获取复活时间
	 */
	public get reviveTime():number {
		let dict:any = this.revive.getDict();
		let myScore:number = CacheManager.guildBattle.myScore;
		for(let key in dict) {
			let reviveCfg:any = dict[key];
			let scoreMin:number = reviveCfg.scoreMin > 0 ? reviveCfg.scoreMin : 0;
			if(!reviveCfg.scoreMax && myScore >= scoreMin) {
				return reviveCfg.reviveTime;
			}
			if(myScore >= scoreMin && myScore <= reviveCfg.scoreMax) {
				return reviveCfg.reviveTime
			}
		}
		return -1;
	}

	public getStaticCfg():any {
		let dict:any = this.warStatic.getDict();
		for(let key in dict) {
			return dict[key];
		}
		return null;
	}

	public getCollectBossCfg():any {
		let bossCode:number = this.getStaticCfg().templeBossCode;
		return ConfigManager.boss.getByPk(bossCode);
	}

	/**
	 * 根据自己积分获取所有达标的积分奖励
	 */
	public getHadGetScoreRewardCfgs():any[] {
		let dict:any = this.scoreReward.getDict();
		let itemDatas:ItemData[] = [];
		let myScore:number = CacheManager.guildBattle.myScore;
		for(let key in dict) {
			let score:number = Number(key);
			if(myScore >= score) {
				itemDatas.push(RewardUtil.getReward(dict[key].rewardStr));
			}
		}
		return itemDatas;
	}
}