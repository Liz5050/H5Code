class ToplistActiveConfig extends BaseConfig{
	public constructor() {
		super("t_toplist_active", "id");
	}

	/**
	 * 根据开服天数，获取当前开启的冲榜活动
	 */
	public getCurRankCfg():any {
		let dict:any = this.getDict();
		let openDay:number = CacheManager.serverTime.serverOpenDay;
		for(let id in dict) {
			if(openDay >= dict[id].showStartDate && openDay <= dict[id].endDate) {
				return dict[id];
			}
		}
		return null;
	}
}