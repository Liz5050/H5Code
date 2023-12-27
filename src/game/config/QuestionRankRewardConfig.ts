class QuestionRankRewardConfig extends BaseConfig {
	private allRewards:any[];
	public constructor() {
		super("t_question_rank_reward", "maxRank,minRank");
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
}