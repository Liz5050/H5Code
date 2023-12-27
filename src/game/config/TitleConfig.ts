class TitleConfig extends BaseConfig {
	private typeList:{[type:number]:any[]} = {};
	private rankRewards:{[rankType:number]:any[]};
	private allList:any[];
	public constructor() {
		super("t_title_config", "code");
		this.parseTypeList();
	}

	private parseTypeList():void
	{
		let dict:any = this.getDict();
		for(let code in dict)
		{
			let titleCfg:any = dict[code];
			if(!titleCfg.showArea) continue;
			let list:any[] = this.typeList[titleCfg.showArea];
			if(!list)
			{
				list = [];
				this.typeList[titleCfg.showArea] = list;
			}
			list.push(titleCfg);
		}
	}

	/**
	 * 根据称号种类获取称号列表配置
	 */
	public getTitlesByCategory(category:number):any[]
	{
		return this.typeList[category];
	}

	/**
	 * 获取排行榜的称号奖励列表
	 */
	public getRankRewardTitles(rankType:EToplistType):any[] {
		if(!this.rankRewards) {
			this.rankRewards = {};
			let titles:any[] = this.getAllList();
			for(let i:number = 0; i < titles.length; i++) {
				let type:EToplistType = titles[i].type;
				if(!type) continue;
				let list:any[] = this.rankRewards[type];
				if(!list) {
					list = [];
					this.rankRewards[type] = list;
				}
				list.push(titles[i]);
			}
		}
		return this.rankRewards[rankType];
	}

	/**
	 * 根据排名获取某个榜的称号奖励
	 */
	public getRankRewardTitleByRank(rankType:EToplistType,rank:number = 1):any {
		let rewardTitles:any[] = this.getRankRewardTitles(rankType);
		if(!rewardTitles) return null;
		for(let i:number = 0; i < rewardTitles.length; i++) {
			let range:string[] = rewardTitles[i].condition.split(",");
			let min:number = Number(range[0]);
			let max:number = Number(range[1]);
			if(rank >= min && rank <= max) {
				return rewardTitles[i];
			}
		}
		return null;
	}

	public getAllList():any[] {
		if(!this.allList) {
			this.allList = [];
			let dict:any = this.getDict();
			for(let code in dict) {
				this.allList.push(dict[code]);
			}
		}
		this.allList.sort(titleSort);
		function titleSort(value1:any,value2:any):number {
			let isActive1:boolean = CacheManager.title.isActive(value1.code);
			let isActive2:boolean = CacheManager.title.isActive(value2.code);
			// if(isActive1 && isActive2) {
			// 	let roleIndex:number = CacheManager.title.operationIndex;
			// 	let inUse1:boolean = CacheManager.title.isInUse(value1.code,roleIndex);
			// 	let inUse2:boolean = CacheManager.title.isInUse(value2.code,roleIndex);
			// 	if(inUse1 && !inUse2) return -1;
			// 	if(!inUse1 && inUse2) return 1;
			// }
			if(isActive1 && !isActive2) return -1;
			if(!isActive1 && isActive2) return 1;
			return value1.code - value2.code;
		}
		return this.allList;
	}
}