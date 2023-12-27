class ActivityInvestConfig extends BaseConfig {
	private rewardCfgs:any[];
	public constructor() {
		super("t_mg_invest_active_reward","day");
	}

	public getInvestRewardCfgs():any[] {
		if(!this.rewardCfgs) {
			this.rewardCfgs = [];
			let dict:any = this.getDict();
			for(let day in dict) {
				this.rewardCfgs.push(dict[day]);
			}
		}
		return this.rewardCfgs;
	}
}