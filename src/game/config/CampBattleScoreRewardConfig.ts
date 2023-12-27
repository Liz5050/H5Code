class CampBattleScoreRewardConfig extends BaseConfig {
	private allRewards:any[];
	public constructor() {
		super("t_battle_bich_score_reward","score");
	}

	public getScoreAllRewards():any[] {
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
	 * 获取当前档的积分奖励配置
	 * （根据已领取过滤）
	 */
	public getCurScoreRewardCfg():any {
		let dict:any = this.getDict();
		let minScore:number = 9999999;
		for(let key in dict) {
			let score:number = Number(key);
			if(!CacheManager.campBattle.hadGet(score)) {
				if(minScore > score) {
					minScore = score;
				}
			}
		}
		return this.getByPk(minScore);
	}
}