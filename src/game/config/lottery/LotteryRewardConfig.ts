/**
 * 累积抽奖次数奖励表
 */
class LotteryRewardConfig extends BaseConfig {
	private rewardDict:{[categroy:number]:any[]};
	public constructor() {
		super("t_lottery_reward","type,lotteryTimes");
	}

	public parseRewardDict():void {
		this.rewardDict = {};
		let dict:any = this.getDict();
		for(let key in dict) {
			let list:any[] = this.rewardDict[dict[key].type];
			if(!list) {
				list = [];
				this.rewardDict[dict[key].type] = list;
			}
			list.push(dict[key]);
		}
	}

	/**
	 * 根据寻宝大类获取累计次数奖励列表配置
	 */
	public getRewardByLotteryCategory(category:LotteryCategoryEnum):any[] {
		if(!this.rewardDict) {
			this.parseRewardDict();
		}
		return this.rewardDict[category];
	}
}