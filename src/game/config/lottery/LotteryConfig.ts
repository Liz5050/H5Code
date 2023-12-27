class LotteryConfig extends BaseConfig {
	private typeDict:{[type:number]:any};
	public constructor() {
		super("t_lottery_config","type,amount");
	}

	private parseTypeDict():void {
		this.typeDict = {};
		let dict:any = this.getDict();
		for(let key in dict) {
			let list:any[] = this.typeDict[dict[key].type];
			if(!list) {
				list = [];
				this.typeDict[dict[key].type] = list;
			}
			list.push(dict[key]);
		}
	}

	public getLotteryTypeList(type:number):any[] {
		if(!this.typeDict) {
			this.parseTypeDict();
		}
		return this.typeDict[type];
	}
}