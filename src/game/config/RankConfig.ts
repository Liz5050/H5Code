class RankConfig extends BaseConfig {
	private rankCfgList:any[];
	public constructor() {
		super("t_toplist_type","type");
	}

	public get rankConfigs():any[] {
		if(!this.rankCfgList) {
			this.rankCfgList = [];
			let dict:any = this.getDict();
			for(let type in dict) {
				this.rankCfgList.push(dict[type]);
			}
		}
		return this.rankCfgList;
	}
}