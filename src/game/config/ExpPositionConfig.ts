class ExpPositionConfig extends BaseConfig {
	private rankRewardCfg:BaseConfig;
	public constructor() {
		super("t_position_config","posId");
		this.rankRewardCfg = new BaseConfig("t_position_rank_reward","minRank,maxRank");
	}

	/**获取排名奖励 */
	public getRankReward(rank:number):any {
		let dict:any = this.rankRewardCfg.getDict();
		for(let key in dict) {
			if(rank >= dict[key].minRank && rank <= dict[key].maxRank) {
				return dict[key];
			}
		}
		return null;
	}
}