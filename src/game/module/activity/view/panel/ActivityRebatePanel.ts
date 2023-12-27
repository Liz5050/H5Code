class ActivityRebatePanel extends ActivityBaseTabPanel {
	private c1:fairygui.Controller;
	private goldItem:BaseItem;
	private list_preview:List;
	// private list_preview2:List;
	private list_reward:List;

	private rebateInfo:any;
	private exRewardCodes:number[];

	private exReward1:number[];
	// private exReward2:any[];
	private allRewards:any[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.desTitleStr = "";
		this.goldItem = this.getGObject("gold_item") as BaseItem;
		this.list_preview = new List(this.getGObject("list_preview").asList);
		// this.list_preview2 = new List(this.getGObject("list_preview2").asList);
		this.list_reward = new List(this.getGObject("list_reward").asList);
	}

	public updateAll():void {
		super.updateAll();
		this.rebateInfo = CacheManager.activity.rebateInfo;
		if(!this.rebateInfo) return;

		this.exRewardCodes = ConfigManager.rechargeRebate.exRewardCodes;
		if(!this.exReward1) {
			this.exReward1 = [];
			for(let i:number = 0; i < this.exRewardCodes.length; i++) {
				let codeCfgs:any[] = ConfigManager.rechargeRebate.getExRewardsByCode(this.exRewardCodes[0]);
				for(let k:number = 0; k < codeCfgs.length; k++) {
					if(this.rebateInfo.rewardRound == codeCfgs[k].round) {
						this.exReward1.push(this.exRewardCodes[i]);
						break;
					}
				}
			}
		}
		this.list_preview.data = this.exReward1;
		// this.list_preview2.setVirtual(this.exReward2);
		// this.list_preview2.scrollToView(0);

		this.allRewards = ConfigManager.rechargeRebate.getAllRewardsByRound(this.rebateInfo.rewardRound);
		let gold:number = 0;
		for(let i:number = 0; i < this.allRewards.length; i++) {
			let rewardStr:string[] = this.allRewards[i].rewards.split("#")[0].split(",");
			if(Number(rewardStr[1]) == ItemCodeConst.GoldOfShop) {
				gold += Number(rewardStr[2]);
			}
		}
		
		let goldData:ItemData = new ItemData(ItemCodeConst.GoldOfShop);
		goldData.itemAmount = gold;
		this.goldItem.itemData = goldData;

		this.allRewards.sort(this.sortRewards);
		this.list_reward.setVirtual(this.allRewards);
		this.list_reward.scrollToView(0);
		this.checkHadAllGet();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
	}

	public updateRewardGetInfo():void {
		this.list_preview.data = this.exReward1;
		this.allRewards.sort(this.sortRewards);
		// this.list_preview2.list.refreshVirtualList();
		this.list_reward.list.refreshVirtualList();
		this.checkHadAllGet();
	}

	private checkHadAllGet():void {
		let info:any = CacheManager.activity.rebateInfo;
		this.c1.selectedIndex = info.rechargeDayNum >= this.allRewards.length && info.canGetRewardIdList.data_I.length == 0 ? 1 : 0;
	}

	private sortRewards(value1:any,value2:any):number {
		let info:any = CacheManager.activity.rebateInfo;
		let canGetList:number[] = info.canGetRewardIdList.data_I;
		let canGet1:boolean = info.rechargeDayNum >= value1.rechargeDay && canGetList.indexOf(value1.id) != -1;
		let canGet2:boolean = info.rechargeDayNum >= value2.rechargeDay && canGetList.indexOf(value2.id) != -1;
		if(canGet1 && !canGet2) return -1;
		if(!canGet1 && canGet2) return 1;
		let hadGet1:boolean = info.rechargeDayNum >= value1.rechargeDay && canGetList.indexOf(value1.id) == -1;
		let hadGet2:boolean = info.rechargeDayNum >= value2.rechargeDay && canGetList.indexOf(value2.id) == -1;
		if(!hadGet1 && hadGet2) return -1;
		if(hadGet1 && !hadGet2) return 1;
		return value1.id - value2.id;
	}
}