/**
 * 福利
 */

class WelfareController extends BaseController{
	private module: WelfareModule;
	public constructor() {
		super(ModuleEnum.Welfare);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseGUIView{
		this.module = new WelfareModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
		// this.addMsgListener(EGateCommand[EGateCommand.ECmdGateLevelReward], this.onLevelReward, this);
        // this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicLevelRewardNumInfo], this.onLevelRewardNumInfo, this);
		// this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicLevelRewardNumUpdate], this.onLevelRewardNumInfo, this);
		// this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSignRewardsInfo], this.onSignRewardsInfo, this);
    }

	/**
	 * 冲级豪礼玩家领取记录登录推送和领取后的更新推送
	 * @param data SLevelReward
	 */
	// private onLevelReward(data: any): void{
	// 	let levels: Array<any> = data.levels.data_I;
	// 	let dict: any = {};
	// 	for(let d of levels){
	// 		dict[d] = true;
	// 	}
	// 	CacheManager.welfare.levelReward = dict;
	// 	if(this.isShow){
	// 		this.module.updateUpgradeList();
	// 	}
	// 	EventManager.dispatch(LocalEventEnum.WelfareUpdate);
	// }

	/**
	 * 冲级豪礼全服已领取记录登录推送/冲级豪礼领取后全服已领取记录更新推送
	 * @param data SDictIntInt
	 */
	// private onLevelRewardNumInfo(data: any): void{
	// 	let dict: any = CacheManager.welfare.levelRewardNum;
	// 	let key: Array<any> = data.intIntDict.key_I;
	// 	let value: Array<any> = data.intIntDict.value_I;
	// 	for(let i = 0; i < key.length; i++){
	// 		dict[key[i]] = value[i];
	// 	}
	// 	CacheManager.welfare.levelRewardNum = dict;
	// 	if(this.isShow){
	// 		this.module.updateUpgradeList();
	// 	}
	// 	EventManager.dispatch(LocalEventEnum.WelfareUpdate);
	// }

	/**
	 * 每日签到登录和领取奖励后推送
	 * @param data SDailySignRewardInfo
	 */
	private onSignRewardsInfo(data: any): void{
		let dayDict: any = {};
		let monthDict: any = {};
		let date: Date = new Date(data.severDt_DT*1000);
		let dayArr: Array<any> = data.signedDays.data_I;
		let monthArr: Array<any> = data.alreadyGiveRewards.data_I;
		for(let d of dayArr){
			dayDict[d] = true;
		}
		for(let d of monthArr){
			monthDict[d] = true;
		}
		CacheManager.welfare.dailySign = dayDict;
		CacheManager.welfare.monthReward = monthDict;
		CacheManager.welfare.signDays = dayArr.length;
		CacheManager.welfare.date = date;
		if(this.isShow){
			this.module.updateDayList();
		}
		EventManager.dispatch(LocalEventEnum.WelfareUpdate);
	}
}