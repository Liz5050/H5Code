class ToplistActiveDetailConfig extends BaseConfig{
	private toplistCfgs:{[toplist:number]:any[]};
	public constructor() {
		super("t_toplist_active_detail", "toplist,idx");
	}

	private parseTopList():void {
		this.toplistCfgs = {};
		let dict:any = this.getDict();
		for(let key in dict) {
			let list:any[] = this.toplistCfgs[dict[key].toplist];
			if(!list) {
				list = [];
				this.toplistCfgs[dict[key].toplist] = list;
			}
			list.push(dict[key]);
		}
	}

	/**
	 * 获取冲榜详细配置
	 */
	public getTopListDetailCfgByType(type:EToplistType):any[] {
		if(!this.toplistCfgs) {
			this.parseTopList();
		}
		return this.toplistCfgs[type];
	}

	public getTopListDetailRewardCfg(type:EToplistType,rank:number):any {
		let list:any[] = this.getTopListDetailCfgByType(type);
		for(let i:number = 0; i < list.length; i++) {
			if(rank >= list[i].rankStart && rank <= list[i].rankEnd) {
				return list[i];
			}
		}
		return null;
	}
}