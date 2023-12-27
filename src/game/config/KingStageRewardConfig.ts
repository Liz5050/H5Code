class KingStageRewardConfig extends BaseConfig {
	public constructor() {
		super("t_mg_king_stife_stage_reward","stage");
	}

	/**获取段位奖励列表 */
	public getStageRewards():ItemData[] {
		let list:any = this.getDict();
		let rewards:ItemData[] = [];
		for(let stage in list) {
			let rewardsArr:string[] = list[stage].rewards.split("#")[0].split(",");
			let itemData:ItemData = new ItemData(Number(rewardsArr[1]));
			itemData.itemAmount = Number(rewardsArr[2]);
			rewards.push(itemData);
			if(rewards.length >= 4) break;
		}
		return rewards;
	}
}