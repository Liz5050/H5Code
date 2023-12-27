class LotteryCache implements ICache {
	/**寻宝记录服务端推的配置表类型 */
	private records:{[type:number]:any[]} = {};

	/**转化后统一大类 如100 101 102都属于装备寻宝大类  整除100*/
	private lotteryRecords:{[category:number]:any[]} = {};

	/**寻宝信息服务端推的寻宝大类LotteryCategoryEnum*/
	private lotteryInfos:{[category:number]:any} = {};

	/**是否点击过 */
	public isClick:{[category:number]:boolean} = {};
	public constructor() {
	}

	/**
	 * 寻宝信息更新
	 */
	public updateLotteryInfo(infos:any[]):void {
		for(let i:number = 0; i < infos.length; i++) {
			this.lotteryInfos[infos[i].type] = infos[i];
		}
	}

	/**
	 * 获取寻宝信息
	 */
	public getLotteryInfo(category:LotteryCategoryEnum):any {
		return this.lotteryInfos[category];
	}

	/**
	 * 寻宝记录更新
	 */
	public updateRecords(data:any):void {
		this.lotteryRecords[data.type] = data.records.data;
		// this.records[data.type] = data.records.data;
		// for(let type in this.records) {
		// 	let category:LotteryCategoryEnum = Math.floor(Number(type) / 100);
		// 	let list:any[] = [];
		// 	list = list.concat(this.records[type]);
		// 	this.lotteryRecords[category] = list;
		// }
	}

	public addRecords(data:any):void {
		let list:any[] = this.lotteryRecords[data.type];
		if(!list) {
			list = [];
			this.lotteryRecords[data.type] = list;
		}
		list.unshift(data.record);
		// if(!this.records[data.type]) {
		// 	this.records[data.type] = [data.record];
		// }
		// else {
		// 	this.records[data.type].push(data.record);
		// }
		// let category:LotteryCategoryEnum = Math.floor(Number(data.type) / 100);
		// if(!this.lotteryRecords[category]) {
		// 	this.lotteryRecords[category] = [];
		// }
		// this.lotteryRecords[category].push(data.record);
	}

	public getLotteryRecords(category:LotteryCategoryEnum):any[] {
		return this.lotteryRecords[category];
	}

	public checkAllTips():boolean {
		return this.checkLotteryTips(LotteryCategoryEnum.LotteryEquip)
			|| this.checkLotteryTips(LotteryCategoryEnum.LotteryRune)
			/*|| this.checkLotteryTips(LotteryCategoryEnum.LotteryAncient)*/;
	}

	/**
	 * 检测某个寻宝类型红点
	 */
	public checkLotteryTips(category:LotteryCategoryEnum):boolean {
		if(!ConfigManager.mgOpen.isOpenedByKey(LotteryCategoryEnum[category],false)) return false;
		let packCache:PackBaseCache;
		if(category == LotteryCategoryEnum.LotteryEquip) {
			packCache = CacheManager.pack.lotteryEquipPack
		}
		else if(category == LotteryCategoryEnum.LotteryRune) {
			if(this.checkTimesReward(category) || CacheManager.runeShop.checkExchangeTips()) {
				return true;
			}
			packCache = CacheManager.pack.lotteryRunePack;
		}
		else if(category == LotteryCategoryEnum.LotteryAncient) {
			if(this.checkTimesReward(category)) {
				return true;
			}
			packCache = CacheManager.pack.lotteryAncientPack;
		}
		if(packCache && packCache.getHadTrueItem()) return true;
        let info:any = this.getLotteryInfo(category);
		if (info && info.freeTime > 0) return true;
		// if(this.isClick[category]) return false;
		let curTypeCfg:any = ConfigManager.lotteryType.getCurrentTypeConfig(category);
		if(!curTypeCfg) return false;
		let lotteryCfg:any[] = ConfigManager.lottery.getLotteryTypeList(curTypeCfg.type);
		for(let i:number = 0; i < lotteryCfg.length; i++) {
			let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(lotteryCfg[i].propCode);
			if(bagCount >= lotteryCfg[i].propNum) {
				return true;
			}
		}
		return false;
	}

	private checkTimesReward(category:LotteryCategoryEnum):boolean {
		let rewardCfgs:any[] = ConfigManager.lotteryReward.getRewardByLotteryCategory(category);
		let info:any = this.getLotteryInfo(category);
		let hadGetList:number[] = [];
		let times:number = 0;
		if(info) {
			hadGetList = info.hadGetRewards.data_I;
			times = info.times;
		}
		for(let i:number = 0; i < rewardCfgs.length; i++) {
			if(hadGetList.indexOf(rewardCfgs[i].lotteryTimes) == -1 && times >= rewardCfgs[i].lotteryTimes) {
				return true;
			}
		}
		return false;
	}

	public clear():void {

	}
}