class BossHomeRewardConfig extends BaseConfig {
	public constructor() {
		super("t_mg_new_boss_home_reward","floor");
	}

	public getFloorRewardList():any[] {
		let dict:any = this.getDict();
		let list:any[] = [];
		for(let floor in dict) {
			list.push(dict[floor]);
		}
		return list;
	}
}