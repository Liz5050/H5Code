class LotteryShowConfig extends BaseConfig {
	private typeItems:{[type:number]:any[]};
	public constructor() {
		super("t_lottery_show","id");
	}

	private parseTypeItems():void {
		this.typeItems = {};
		let dict:any = this.getDict();
		for(let id in dict) {
			let list:any[] = this.typeItems[dict[id].type];
			if(!list) {
				list = [];
				this.typeItems[dict[id].type] = list;
			}
			list.push(dict[id]);
		}
	}

	public getItemsByLotteryType(category:LotteryCategoryEnum):any[] {
		let typeCfg:any = ConfigManager.lotteryType.getCurrentTypeConfig(category);
		if(!typeCfg) return null;
		if(!this.typeItems) {
			this.parseTypeItems();
		}
		return this.typeItems[typeCfg.type];
	}

	public getItemsByLotteryTypeToProb(type : number) : any[] {
		let dict:any = this.getDict();
		let list:any[] = [];
		for(let id in dict) {
			var item = dict[id];
			if(item.type == type) {
				if(item.rate) {
					list.push(item);
				}
			}
		}
		return list;
	}

	public isSpecialRewardItem(type:number,code:number):boolean {
		if(!this.typeItems) {
			this.parseTypeItems();
		}
		let cfgs:any[] = this.typeItems[type];
		if(!cfgs) {
			return false;
		}
		for(let i:number = 0; i < cfgs.length; i++) {
			if(cfgs[i].item == code) {
				if(cfgs[i].specialEffect) {
					return true;
				}
				return false;
			}
		}
	}
}