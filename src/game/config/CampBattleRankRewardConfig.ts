class CampBattleRankRewardConfig extends BaseConfig {
	private allRewards:any[];
	public constructor() {
		super("t_battle_bich_rank_reward","rankStart,rankEnd");
	}

	public getRankAllRewards():any[] {
		if(!this.allRewards) {
			this.allRewards = [];
			let dict:any = this.getDict();
			for(let key in dict) {
				this.allRewards.push(dict[key]);
			}
		}
		return this.allRewards;
	}

	/**
	 * 获取排名奖励配置
	 */
	public getRankRewardCfg(rank:number):any {
		let dict:any = this.getDict();
		for(let key in dict) {
			let cfg:any = dict[key];
			if(cfg.rankStart <= rank && cfg.rankEnd >= rank) {
				return cfg;
			}
		}
		return null;
	}
}