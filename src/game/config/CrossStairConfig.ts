class CrossStairConfig extends BaseConfig {
	private rankReward:BaseConfig;

	private floorCfgs:any[];
	private rankRewardCfg:{[moduleId:number]:any[]} = {};
	public constructor() {
		super("t_cross_stair","floor");
		this.rankReward = new BaseConfig("t_rank_reward","id");//通用排名奖励配置
	}

	public getAllRankCfgs(moduleId:number):any[] {
		if(!this.rankRewardCfg[moduleId]) {
			this.rankRewardCfg[moduleId] = [];
			let dict:any = this.rankReward.getDict();
			for(let key in dict) {
				let list:any[] = this.rankRewardCfg[dict[key].moduleId];
				if(!list) {
					list = [];
					this.rankRewardCfg[dict[key].moduleId] = list;
				}
				list.push(dict[key]);
			}
		}
		return this.rankRewardCfg[moduleId];
	}

	public getRankRewardCfg(rank:number,moduleId:number):any {
		let rewards:any[] = this.getAllRankCfgs(moduleId);
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i].minRank <= rank && rewards[i].maxRank >= rank) {
				return rewards[i];
			}
		}
		return null;
	}

	public getFloorCfgs():any[] {
		if(!this.floorCfgs){
			this.floorCfgs = [];
			let dict:any = this.getDict();
			for(let floor in dict) {
				dict[floor].isFloor = true;
				this.floorCfgs.push(dict[floor]);
			}
		}
		return this.floorCfgs;
	}

	/**
	 * 获取当前奖励进度配置
	 * （根据已领取过滤）
	 */
	public getCurFloorRewardCfg():any {
		let dict:any = this.getDict();
		let minFloor:number = 9999999;
		for(let floor in dict) {
			if(!CacheManager.crossStair.hadGet(Number(floor))) {
				if(minFloor > Number(floor)) {
					minFloor = Number(floor);
				}
			}
		}
		return this.getByPk(minFloor);
	}
}