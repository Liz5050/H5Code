class ActivityCache implements ICache {
	private timeIndex:number = -1;
	private activityInfos:{[code:number]:ActivityInfo} = {};
	private categoryInfos:{[category:number]:ActivityInfo[]} = {};
	/**所有活动图标信息 */
	private _activityIconInfos:ActivityInfo[] = [];
	/**活动领奖信息 */
	private rewardGetInfos:{[code:number]:number[]} = {};
	/**所有活动code */
	private allCodes:number[];
	/**活动奖励全服已领取数量 */
	private rewardGetNums:{[code:number]:any} = {};

	/**连续充值活动充值天数 */
	public rechargeDay:number = 0;
	/**累计充值活动充值额度 */
	public addRechargeNum:number = 0;
	/**限时充值活动期间充值额度 */
	public limitRechargeNum:number = 0;
	/**开服冲榜活动期间充值额度 */
	public rankRechargeNum:number = 0;

	/**天天返利活动信息 */
	private _rebateInfo:any;
	/**全民boss信息 */
	private _bossInfos:any[];
	private _currentPage:number = 0;
	/**本次登陆是否第一次打开全民boss */
	// public isFirstShowBoss:boolean = true;
	/**冲榜活动排行数据 */
	private rankInfos:{[type:number]:any};
	/**boss积分兑换 */
	private _bossScoreExcInfo:any;
	/**累充返利信息 */
	private _rechargeInfo:any;
	/**投资计划信息 */
	private _investInfo:any;
	/**连充返利（3月初充值活动信息） */
	private holidayRechargeInfo:any;

	public isShowed:{[tabType:number]:boolean} = {};//本次登陆是否打开过一次的页签界面
	private showEffect:PanelTabType[] = [];//每次登陆需要显示光圈特效的活动
	public gotoActivityType:ESpecialConditonType = -1;//是否通过开服冲榜跳转到另一活动界面，关闭时要重新回到开服冲榜
	public backRankView:boolean = false;//是否跳转到开服冲榜界面
	public constructor() {
		this._bossScoreExcInfo = {score:0,info:{}};
	}

	/**
	 * 活动列表更新
	 */
	public updateActivityInfos(data:any):void {
		this.allCodes = [];
		for(let i:number = 0; i < data.length; i++) {
			let code:number = data[i].code_I;
			if(this.allCodes.indexOf(code) == -1) {
				this.allCodes.push(code);
			}
			let info:ActivityInfo = this.activityInfos[code];
			if(!info) {
				info = new ActivityInfo();
				this.activityInfos[code] = info;
			}
			info.parseData(data[i]);
		}
		this.parseActivityCategory();
		this.addActivityCheck();
		// console.log("活动列表更新,分类列表",this.categoryInfos,"总列表 ： ",this.activityInfos);
		EventManager.dispatch(NetEventEnum.ActivityInfoListUpdate);
	}

	/**
	 * 活动数据更新
	 */
	public activityChangeUpdate(data:any):void {
		for(let i:number = 0; i < data.length; i++) {
			let code:number = data[i].code_I;
			this.activityInfos[code].parseData(data[i]);
		}
		EventManager.dispatch(NetEventEnum.ActivityInfoListUpdate);
	}
	/**
	 * 积分兑换 SAttribute
	 * value字段传的是已有的积分， valueStr 传的是已兑换的字符串，{“index”： 次数}
	 */
	public setBossScoreExcInfo(data:any):void{		 
		this._bossScoreExcInfo.score = data.value_I;
		this._bossScoreExcInfo.info = data.valueStr_S?JSON.parse(data.valueStr_S):{};
	}

	/**
	 * 获取boss积分兑换 已兑换的次数
	 */
	public getBossExcNum(index:number):number{
		let num:number = 0;
		if(this._bossScoreExcInfo && this._bossScoreExcInfo.info){
			num = this._bossScoreExcInfo.info[index]?this._bossScoreExcInfo.info[index]:0;
		}
		return num;
	}
	/**我拥有的boss积分 */
	public get myBossScore():number{
		let score:number = 0;
		if(this._bossScoreExcInfo && this._bossScoreExcInfo.score){
			score = this._bossScoreExcInfo.score;
		}
		return score;
	}

	/**
	 * 活动列表发生变化，重新分类数据
	 */
	private parseActivityCategory():void {
		for(let code in this.activityInfos) {
			let info:ActivityInfo = this.activityInfos[code];
			if(this.allCodes.indexOf(Number(code)) == -1 || info.isOverTime) {
				this.removeActivity(info,true);
			}	
		}

		let categorys:number[] = [];
		for(let category in this.categoryInfos) {
			categorys.push(Number(category));
		}
		this.categoryInfos = {};
		this._activityIconInfos = [];
		for(let code in this.activityInfos) {
			let info:ActivityInfo = this.activityInfos[code];
			let isOverTime:boolean = info.isOverTime;
			if(info.type == ESpecialConditonType.ESpecialConditonTypeShowIcon) {
				if(!isOverTime) {
					this._activityIconInfos.push(info);
					if(info.isOpen) {
						info.iconInit = true;
						EventManager.dispatch(LocalEventEnum.AddHomeIcon,info.iconId);
					}
				}
				else {
					this.removeActivity(info);
				}
			}
			else if(!isOverTime){
				let list:ActivityInfo[] = this.categoryInfos[info.category];
				if(!list) {
					list = [];
					this.categoryInfos[info.category] = list;
				}
				list.push(info);
			}
		}
		for(let category in this.categoryInfos) {
			if(categorys.indexOf(Number(category)) == -1) {
				//新增的活动，检测红点
				let list:ActivityInfo[] = this.categoryInfos[category];
				if(list.length > 0) {
					EventManager.dispatch(LocalEventEnum.HomeIconSetTip,list[0].iconId,this.checkActivityTips(Number(category)));
				}
			}
		}
	}

	/**
	 * 更新活动已领奖信息
	 */
	public updateGetRewardInfo(data:any):void {
		let codes:number[] = data.key_I;
		for(let i:number = 0; i < codes.length; i++) {
			this.rewardGetInfos[codes[i]] = data.value[i].seq.data_I;
			let info:ActivityInfo = this.activityInfos[codes[i]];
			if(this.isComplete(info)) {
				this.removeActivity(info);//已完成该活动所有奖励，移除活动
				let list:ActivityInfo[] = this.getActivityListByCategory(info.category);
				if(!list || list.length == 0) {
					EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,info.iconId);
				}
			}
		}
		EventManager.dispatch(NetEventEnum.ActivityRewardInfoUpdate);
	}

	/**
	 * 更新获得奖励全服已领取份数
	 */
	public updateRewardNumList(data:any[]):void {
		for(let i:number = 0; i < data.length; i++) {
			let getInfo:any = data[i].dict;
			let code:number = data[i].code_I;
			for(let j:number = 0; j < getInfo.key_I.length; j++) {
				let key:string = code + "_" + getInfo.key_I[j];
				this.rewardGetNums[key] = getInfo.value_I[j];
			}
		}
	}

	/**
	 * 更新累充返利活动信息
	 * S2C_SPushComposeRechargeActiveInfo
	 */
	public updateDayAndSevenRechargeInfo(data:any):void {
		this._rechargeInfo = data;
	}

	/**
	 * S2C_SPushComposeRechargeActiveInfo
	 */
	public get rechargeInfo():any {
		return this._rechargeInfo;
	}

	/**
	 * 获取全服奖励已领取份数
	 */
	public getActivityRewardGetNum(code:number,index:number):number {
		let key:string = code + "_" + index;
		if(!this.rewardGetNums[key]) return 0;
		return this.rewardGetNums[key];
	}

	/**
	 * 天天返利活动信息更新
	 */
	public updateRechargeRebateInfo(data:any):void {
		this._rebateInfo = data;
	}

	/**
	 * 天天返利活动信息
	 * int32 rechargeDayNum = 1;	    //累计充值天数
	 * int32 rewardRound = 2;	    //奖励轮数
	 * Protocol_Public.SeqInt canGetRewardIdList = 3;	    //可以领取的奖励 id 列表
	 */
	public get rebateInfo():any {
		return this._rebateInfo;
	}

	/**
	 * 全民boss信息更新
	 */
	public updateActivityBossInfo(data:any):void {
		this._bossInfos = data.info.targetInfos.data;
		this._currentPage = data.info.currentPage_I;
	}

	public get currentPage():number {
		return this._currentPage;
	}

	public get bossInfos():any[]{
		return this._bossInfos;
	}

	/**
	 * 更新冲榜排名信息
	 */
	public updateActivityRankInfos(infos:any[]):void {
		this.rankInfos = {};
		for(let i:number = 0; i < infos.length; i++) {
			let type:EToplistType = infos[i].toplist_I;
			let list:any[] = this.rankInfos[type];
			if(!list) {
				list = [];
				this.rankInfos[type] = list;
			}
			list.push(infos[i]);
		}
	}

	/**
	 * 获取冲榜排名信息
	 */
	public getRankListByType(type:EToplistType):any {
		return this.rankInfos[type];
	}

	/**
	 * 投资计划活动信息更新
	 * SInvestActive 
	 * int32 investDay_DT = 1;投资时间戳
	 * int32 dayNum_I = 2;
	 * SSeqInt hasGet = 2;已领取列表
	 */
	public updateInvestInfo(data:any):void {
		this._investInfo = data;
	}

	/**是否已参加投资计划 */
	public get hasInvested():boolean {
		return this._investInfo != null;
	}

	/**获取当前投资进行第几天 */
	public get investDay():number {
		if(!this.hasInvested) return 0;
		return this._investInfo.dayNum_I;
	}

	/**投资奖励是否已领取 */
	public investHadGet(day:number):boolean {
		if(!this.hasInvested) return false;
		return this._investInfo.hasGet.intSeq.data_I.indexOf(day) != -1;
	}

	/**更新连充返利活动信息 */
	public updateHolidayRechargeInfo(data:any):void {
		this.holidayRechargeInfo = data;
	}

	/**
	 * 获取领奖状态
	 * 0不可领取，1可领取，2已领取，3已过期
	 */
	public holidayRechargeGetState(activityCode:number,id:number):number {
		if(!this.holidayRechargeInfo) return 0;
		if(this.holidayRechargeHadGet(activityCode,id)) return 2;
		let cfg:any = ConfigManager.rechargeRebate.getHolidayRechargeCfg(activityCode,id);
		if(!cfg) return 0;
		let rechargeInfo:any = this.holidayRechargeInfo.rechargeDayInfo;
		if(cfg.type == 1) {
			let activityInfo:ActivityInfo = this.getActivityInfoByCode(activityCode);
			let isOverTime:boolean = activityInfo.openedDay > cfg.day;
			let rechargeIdx:number = rechargeInfo.key_I.indexOf(cfg.day);
			if(rechargeIdx != -1 && rechargeInfo.value_I[rechargeIdx] >= cfg.rechargeAmount) return 1;
			else {
				return isOverTime ? 3 : 0;
			}
		}
		else if(cfg.type == 2){
			if(rechargeInfo.key_I.length < cfg.rechargeDays) return 0;
			let rechargeDay:number = 0;//符合条件的累积充值天数
			for(let i:number = 0; i < rechargeInfo.key_I.length; i++) {
				if(rechargeInfo.value_I[i] >= cfg.rechargeAmount){
					rechargeDay++;
				}
			}
			return rechargeDay >= cfg.rechargeDays ? 1 : 0;
		}
		return 0;
	}

	/**已累计充值天数 */
	public getHolidayRechargeDay(needRechargeNum:number):number {
		if(!this.holidayRechargeInfo) return 0;
		let rechargeNums:number[] = this.holidayRechargeInfo.rechargeDayInfo.value_I;
		let day:number = 0;
		for(let i:number = 0; i < rechargeNums.length; i++) {
			if(rechargeNums[i] >= needRechargeNum) {
				day ++;
			}
		}
		return day;
	}

	/**今日累计充值额度 */
	public getHolidayTodayRechargeNum(activityCode:number):number {
		if(!this.holidayRechargeInfo || activityCode != this.holidayRechargeInfo.code_I) return 0;
		let info:ActivityInfo = this.getActivityInfoByCode(activityCode);
		if(!info) return 0;
		let index:number = this.holidayRechargeInfo.rechargeDayInfo.key_I.indexOf(info.openedDay);
		if(index == -1) return 0;
		return this.holidayRechargeInfo.rechargeDayInfo.value_I[index];
	}

	/**是否已领取 */
	public holidayRechargeHadGet(activityCode:number,id:number):boolean {
		if(!this.holidayRechargeInfo || this.holidayRechargeInfo.code_I != activityCode) return false;
		return this.holidayRechargeInfo.getRewardInfos.data_I.indexOf(id) >= 0;
	}

	/**
	 * 添加定时器检测
	 */
	private addActivityCheck():void {
		if(this.allCodes.length == 0) return;
		if(this.timeIndex == -1) {
			this.timeIndex = egret.setInterval(this.onTimerUpdate,this,10000);
		}
	}

	private addActivity(info:ActivityInfo):void {
		if(info.type == ESpecialConditonType.ESpecialConditonTypeShowIcon) {
			if(!info.iconInit) {
				info.iconInit = true;
				EventManager.dispatch(LocalEventEnum.AddHomeIcon,info.iconId);
				EventManager.dispatch(LocalEventEnum.HomeIconSetTip,info.iconId,this.checkActivityTips(info.category));
			}
		}
		else {
			if(!info.iconInit) {
				info.iconInit = true;
				EventManager.dispatch(LocalEventEnum.ActivityAdd,info);
			}
		}
	}

	private removeActivity(info:ActivityInfo,isDelete:boolean = false):void {
		let isOverTime:boolean = info.isOverTime;
		let index:number = -1;
		if(info.type == ESpecialConditonType.ESpecialConditonTypeShowIcon) {
			if(info.iconInit || info.category == ActivityCategoryEnum.ActivityInvest) {
				//一般活动过期移除服务端不会推数据过来，客户端的数据还是旧数据，init标志不会被重置
				//有特殊活动时间配了很长，通过奖励领取状态，或者其他特殊标识判断过期移除，活动信息更新会重置init标志导致移除图标失败
				EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,info.iconId);
			}

			if(isOverTime || isDelete) {
				index = this._activityIconInfos.indexOf(info);
				if(index != -1) {
					this._activityIconInfos[index] = null;
					this._activityIconInfos.splice(index,1);
				}
			}
		}
		if(isOverTime || isDelete) {
			let list:ActivityInfo[] = this.categoryInfos[info.category];
			if(list && list.length > 0) {
				index = list.indexOf(info);
				if(index != -1)  {
					list[index] = null;
					list.splice(index,1);
				}
			}
			index = this.allCodes.indexOf(info.code);
			if(index != -1) this.allCodes.splice(index,1);
			this.activityInfos[info.code] = null;
			delete this.activityInfos[info.code];
		}
		if(info.iconInit || info.category == ActivityCategoryEnum.ActivityInvest) {
			EventManager.dispatch(LocalEventEnum.ActivityRemove,info);
		}
		info.iconInit = false;
		// console.log("活动数据删除",info);
	}

	private onTimerUpdate():void {
		let needTimer:boolean = false;
		for(let code in this.activityInfos) {
			let info:ActivityInfo = this.activityInfos[code];
			let isOverTime:boolean = info.isOverTime;
			if(isOverTime || (info.iconInit && !info.isOpen)) {
				this.removeActivity(info);
			}
			else if(!info.iconInit && info.isOpen) {
				this.addActivity(info);
			}
			if(!needTimer) {
				if(!isOverTime && info.leftTime < 5184000 || info.category == ActivityCategoryEnum.ActivityInvest) {
					//剩余时间小于2个月的未过期活动，需要开启定时器
					needTimer = true;
				}
			}			
		}
		if(this.allCodes.length == 0 || !needTimer) {
			if(this.timeIndex != -1) {
				egret.clearInterval(this.timeIndex);
				this.timeIndex = -1;
			}
		}
	}

	/**
	 * 获取活动已领奖信息
	 */
	public getActivityGetRewardInfo(code:number):number[] {
		return this.rewardGetInfos[code];
	}

	/**
	 * 获取活动数据
	 */
	public getActivityInfoByCode(code:number):ActivityInfo {
		return this.activityInfos[code];
	}

	/**
	 * 获取某个分类下所有子活动数据
	 */
	public getActivityListByCategory(category:ActivityCategoryEnum):ActivityInfo[] {
		return this.categoryInfos[category];
	}

	/**
	 * 根据类型获取活动归属分类
	 */
	public getActivityCategoryByType(type:ESpecialConditonType):ActivityCategoryEnum {
		for(let code in this.activityInfos) {
			if(this.activityInfos[code].type == type && this.activityInfos[code].isOpenByTime()) return this.activityInfos[code].category;
		}
		return null;
	}

	public getActivityInfoByType(type:ESpecialConditonType):ActivityInfo {
		for(let code in this.activityInfos) {
			if(this.activityInfos[code].type == type) {
				if(this.activityInfos[code].isOpenByTime()) {
					return this.activityInfos[code];
				}
			}
		}
		return null;
	}
	/**获取团购的奖励周期 */
	public getGroupBuyIndexByInfo(actInfo:ActivityInfo):number{
		let idx:number = 0; //获取不到活动信息 默认返回0 大于等于1才有效
        if(actInfo){ 
            for(let info of actInfo.rewardInfos){
                if(info.conds[0]){
                    idx = info.conds[0];
                    break;
                }
            }
        }
		return idx;
	}
	/**获取团购的奖励周期 获取不到活动信息 默认返回0*/
	public getGroupBuyIndex():number{
		let info:ActivityInfo = this.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeRechargeGroup);
		return this.getGroupBuyIndexByInfo(info);
	}

	/**
	 * 所有活动图标开启信息
	 */
	public get activityIconInfos():ActivityInfo[] {
		return this._activityIconInfos;
	}

	/**
	 * 是否领取完该活动所有的奖励
	 */
	public isComplete(info:ActivityInfo):boolean {
		if(!info) return false;
		//独立活动图标的，判断活动大类
		if(info.category == ActivityCategoryEnum.VipGiftPackage) {
			if(CacheManager.vipGift.hasBuyAll()) {
				return true;
			}
		}
		else if(info.category == ActivityCategoryEnum.ActivityInvest) {
			if(this.activityInvestComplete()) {
				return true;
			}
		}
		else if(info.category == ActivityCategoryEnum.ActivityBoss) {
			if(this.activityBossComplete()) {
				return true;
			}
		}
		else if(info.category == ActivityCategoryEnum.ActivityShop) {
			if(info.type != ESpecialConditonType.ESpecialConditionTypePreferentialGift) {
				info = this.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypePreferentialGift);
			}
			if(this.preferentialGiftComplete(info)) {
				return true;
			}
		}
		else if(info.category == ActivityCategoryEnum.ActivityLimitRecharge) {
			if(info.type != ESpecialConditonType.ESpecialConditionTypeFlashRecharge) {
				info = this.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeFlashRecharge);
				if(this.limitRechargeComplete(info)) {
					return true;
				}
			}
		}
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑独立活动图标↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeShowIcon) {
			//type是图标开启类型，要判断该活动大类category中所有子活动是否完成
			let list:ActivityInfo[] = this.getActivityListByCategory(info.category);
			if(!list || !list.length) return true;
			for(let i:number = 0; i < list.length; i++) {
				if(!this.isComplete(list[i]) && list[i].isOpenByTime()) return false;//只要存在1个未完成的活动，该分类的图标标记为未完成
			}
			return true;
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeMgRecharge) {
			let getInfos:number[] = this.rewardGetInfos[info.code];
			for(let i:number = 0; i < info.rewardInfos.length; i++) {
				let hadGet:boolean = getInfos != null && getInfos[i] > 0;
				if(!hadGet) return false;//存在未领取奖励
			}
			return true;
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeCondDayCount) {
			if(this.continueRechargeComplete(info)) {
				return true;
			}
		}
		// else if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn) {
		// 	return false;
		// }
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeNewServerLimitBuy) {
			if(this.limitBuyComplete(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypePreferentialGiftNormal) {
			if(this.preferentialGiftComplete(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeReachGoal) {
			if(this.dayTargetComplete(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeLevelReward) {
			if(CacheManager.welfare.hadGetAllReward()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeSpiritSports) {
			if(this.upgradeFaBaoComplete(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeComposeRecharge) {
			if(this.dayAndSevenRechargeComplete()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeInvestPlan) {
			if(this.activityInvestComplete()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeFlashRecharge) {
			if(this.limitRechargeComplete(info)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检测某一类活动图标红点
	 */
	public checkActivityTips(category:ActivityCategoryEnum):boolean {
		let activitys:ActivityInfo[] = this.categoryInfos[category];
		if(!activitys || activitys.length == 0) return false;
		for(let info of activitys) {
			if(!info.isOpenByTime()) continue;
			if(this.checkActivityTipsByInfo(info)) return true;
		}
		return false;
	}

	/**
	 * 检测某一活动红点
	 */
	public checkActivityTipsByInfo(info:ActivityInfo):boolean {
		if(info.type == ESpecialConditonType.ESpecialConditonTypeMgRecharge) {
			if(this.checkAddRechargeTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeCondDayCount) {
			if(this.checkContinueRechargeTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn) {
			if(this.checkRechargeRebateTips()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeNewServerLimitBuy) {
			if(this.checkLimitBuyTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypePreferentialGift ||
				info.type == ESpecialConditonType.ESpecialConditionTypePreferentialGiftNormal) {
			if(this.checkPreferentialGiftTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeBossTask) {
			if(this.checkActivityBossTips()) {
				return true;
			}
		}
		// else if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeToday) {
		// 	if(this.checkDayRechargeTips()) {
		// 		return true;
		// 	}
		// }
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeReachGoal) {
			if(this.checkDayTargetTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeVipGiftPackage) {
			if(this.checkVipGiftPackageTips()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeLevelReward) {
			if(this.checkUpgradeLvTips()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeActivity) {
			if(CacheManager.activitySeven.checkTips()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeSpiritSports) {
			if(this.checkUpgradeFaBaoTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeComposeRecharge) {
			if(this.checkDayAndSevenRechargeRebateTips()) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeBossScore){
			if(this.checkScoreExcTip(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeInvestPlan) {
			if(this.checkActivityInvestTips()) {
				return true;
			}
		}else if(info.type == ESpecialConditonType.ESpecialConditionTypeRechargeGroup){
			if(CacheManager.recharge.checkGroupBuyTips()){
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditionTypeFlashRecharge) {
			if(this.checkLimitRechargeTips(info)) {
				return true;
			}
		}
		else if(info.type == ESpecialConditonType.ESpecialConditonTypeComposeRechargeEx) {
			if(this.checkHolidayRechargeTips(info)) {
				return true;
			}
		}
		return false;
	}

	/**检测某个活动是否有产出指定物品 */
	public checkActivityHasItem(activityType:number,itemCode:number):boolean {
		let info:ActivityInfo = this.getActivityInfoByType(activityType);
		if(!info || info.isOverTime) return false;
		if(activityType == ESpecialConditonType.ESpecialConditionTypeNewServerLimitBuy) {
			if(this.checkLimitBuyHasItemCode(info,itemCode)) {
				return true;
			}
		}
		return false;
	}

	public checkScoreExcTip(info:ActivityInfo):boolean{
		let flag:boolean = false;
		let rewardInf:ActivityRewardInfo;
		for(let rewardInf of info.rewardInfos){
			let needScore:number = rewardInf.conds[0];//所需积分
			let excCount:number = rewardInf.conds[1];//可兑换次数
			let excNum:number = CacheManager.activity.getBossExcNum(rewardInf.index);
			let leftNum:number = Math.max(excCount-excNum,0);
			let isUnLimit:boolean = excCount==-1;
			let mySco:number = CacheManager.activity.myBossScore;
			let isScore:boolean = mySco>=needScore;
			if(isScore && (isUnLimit || leftNum>0)){
				flag = true;
				break;
			}
		}
		return flag;
	}

	/**
	 * 累计充值红点检测
	 */
	public checkAddRechargeTips(info:ActivityInfo):boolean {
		let getInfos:number[] = this.rewardGetInfos[info.code];
		for(let i:number = 0; i < info.rewardInfos.length; i++) {
			let rewardIndex:number = info.rewardInfos[i].index;
			let hadGet:boolean = getInfos != null && getInfos[rewardIndex] > 0;
			if(!hadGet && this.addRechargeNum > info.rewardInfos[i].conds[2]) return true;
		}
		return false;
	}

	/**
	 * 连续充值红点检测
	 */
	public checkContinueRechargeTips(info:ActivityInfo):boolean {
		if(CacheManager.activity.checkShowEffect(PanelTabType.ESpecialConditonTypeRechargeCondDayCount)) return true;
		let getInfos:number[] = this.rewardGetInfos[info.code];
		for(let i:number = 0; i < info.rewardInfos.length; i++) {
			if(getInfos == null || getInfos[i] == 0) {
				if(this.rechargeDay >= info.rewardInfos[i].conds[1]) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 *  连续充值是否领取完所有奖励
	 */
	public continueRechargeComplete(info:ActivityInfo):boolean {
		let getInfos:number[] = this.rewardGetInfos[info.code];
		for(let i:number = 0; i < info.rewardInfos.length; i++) {
			if(getInfos == null || getInfos[i] == 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 天天返利红点
	 */
	public checkRechargeRebateTips():boolean {
		if(!this.rebateInfo) return false;
		let canGetList:number[] = this.rebateInfo.canGetRewardIdList.data_I;
		let allRewards:any[] = ConfigManager.rechargeRebate.getAllRewardsByRound(this.rebateInfo.rewardRound);
		for(let i:number = 0; i < allRewards.length; i++) {
			if(this._rebateInfo.rechargeDayNum >= allRewards[i].rechargeDay) {
				if(canGetList.indexOf(allRewards[i].id) != -1) {
					//可领取
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 开服限购红点
	 */
	public checkLimitBuyTips(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		let vipLv:number = CacheManager.vip.vipLevel;
		for(let i:number = 0; i < rewards.length; i++) {
			let leftNum:number = rewards[i].conds[4] - rewards[i].hadGetCount;
			if(vipLv >= rewards[i].conds[3] && leftNum > 0 && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,rewards[i].conds[1],false)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检测开服限购是否存在指定道具code并且有剩余数量
	 */
	public checkLimitBuyHasItemCode(info:ActivityInfo,itemCode:number):boolean {
		let rewardInfos:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0; i < rewardInfos.length; i++) {
			let leftNum:number = rewardInfos[i].conds[4] - rewardInfos[i].hadGetCount;
			if(leftNum <= 0) continue;
			for(let k:number = 0; k < rewardInfos[i].rewards.length; k++) {
				if(itemCode == rewardInfos[i].rewards[k].code_I) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 开服限购是否全部购买完
	 */
	public limitBuyComplete(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		let vipLv:number = CacheManager.vip.vipLevel;
		for(let i:number = 0; i < rewards.length; i++) {
			let leftNum:number = rewards[i].conds[4] - rewards[i].hadGetCount;
			if(leftNum > 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 特惠礼包红点
	 */
	public checkPreferentialGiftTips(info:ActivityInfo):boolean {
		let hadGetList:number[] = this.getActivityGetRewardInfo(info.code);
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0 ; i < rewards.length; i++) {
			if(hadGetList && hadGetList[i] > 0) continue;//已购买
			if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,rewards[i].conds[0],false)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 特惠礼包是否全部购买完
	 */
	public preferentialGiftComplete(info:ActivityInfo):boolean {
		let hadGetList:number[] = this.getActivityGetRewardInfo(info.code);
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0 ; i < rewards.length; i++) {
			if(hadGetList && hadGetList[i] > 0) continue;//已购买
			return false;
		}
		return true;
	}

	/**
	 * 全民boss红点检测
	 */
	public checkActivityBossTips():boolean {
		if(!this.bossInfos) return false;
		// if(this.isFirstShowBoss) return true;
		for(let i:number = 0; i < this.bossInfos.length; i++) {
			if(this.bossInfos[i].status_I == EDeityBookStatus.EDeityBookStatusComplete) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 全民boss活动是否全部完成
	 */
	public activityBossComplete():boolean {
		if(!this.bossInfos) return false;
		// if(this.isFirstShowBoss) return true;
		for(let i:number = 0; i < this.bossInfos.length; i++) {
			if(this.bossInfos[i].status_I != EDeityBookStatus.EDeityBookStatusHadEnd) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 每日累充红点检测
	 */
	public checkDayRechargeTips():boolean {
		let rechargeCfgs:any[] = ConfigManager.rechargeFirst.getRechargeConfigByType(2);
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetList();
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		for(let i:number = 0; i < rechargeCfgs.length; i++) {
			if(hadGetList.indexOf(rechargeCfgs[i].index) == -1) {
				if(rechargeNum >= rechargeCfgs[i].num) {
					return true;
				}
			}
		}
		rechargeCfgs = ConfigManager.rechargeFirst.getDayRechargeExRewardCfg();
		hadGetList = CacheManager.recharge.getDayRechargeHadGetListEx();
		let rechargeDay:number = CacheManager.recharge.rechargeDay;
		for(let i:number = 0; i < rechargeCfgs.length; i++) {
			if(hadGetList.indexOf(rechargeCfgs[i].id) == -1) {
				if(rechargeDay >= rechargeCfgs[i].day) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 每日累充直升丹奖励红点检测
	 */
	public checkDayRechargeShapeRewadTips():boolean {
		let rewardCfg:any = ConfigManager.rechargeFirst.getHaveShapeRewardRechargeCfg();
		if(!rewardCfg) return false;
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		return rechargeNum >= rewardCfg.num;
	}

	/**每日累充奖励是否全部领取完毕 */
	public dayRechargeHadAllGet():boolean {
		let rechargeCfgs:any[] = ConfigManager.rechargeFirst.getRechargeConfigByType(2);
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetList();
		let count:number = 0;
		for(let i:number = 0; i < rechargeCfgs.length; i++) {
			if(hadGetList.indexOf(rechargeCfgs[i].index) != -1) {
				count ++;
			}
		}
		if(count != rechargeCfgs.length) return false;
		rechargeCfgs = ConfigManager.rechargeFirst.getDayRechargeExRewardCfg();
		hadGetList = CacheManager.recharge.getDayRechargeHadGetListEx();
		let rechargeDay:number = CacheManager.recharge.rechargeDay;
		for(let i:number = 0; i < rechargeCfgs.length; i++) {
			if(hadGetList.indexOf(rechargeCfgs[i].id) == -1) {
				if(rechargeDay >= rechargeCfgs[i].day) {
					return false;//存在可领取奖励，代表没领完
				}
			}
		}
		return true;
	}

	/**
	 * 冲榜达标红点检测
	 */
	public checkDayTargetTips(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i].hadGetCount > 0) continue;
			let values:any[] = rewards[i].getTargetValues();
			if(values[0] >= rewards[i].conds[2]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 当天冲榜达标是否全部领完
	 */
	public dayTargetComplete(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i].hadGetCount > 0) continue;
			return false;
		}
		return true;
	}

	/** vip礼包红点 */
	public checkVipGiftPackageTips():boolean {
		return CacheManager.vipGift.checkVipGiftTips();
	}

	/**
	 * 冲级豪礼红点
	 */
	public checkUpgradeLvTips():boolean {
		return CacheManager.welfare.isGetUpgradeReward();
	}

	/**
	 * 法宝竞技红点
	 */
	public checkUpgradeFaBaoTips(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i].hadGetCount > 0) continue;
			let shapeInfo:any = CacheManager.magicWeaponStrengthen.shapeInfo;
			if(!shapeInfo) continue
			let leftCount:number = rewards[i].conds[2] - this.getActivityRewardGetNum(info.code,rewards[i].conds[0]);
			if(leftCount <= 0) continue;//剩余份数不足
			if(shapeInfo.level_I >= rewards[i].conds[1]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 法宝竞技是否领取完，或者没有剩余份数了
	 */
	public upgradeFaBaoComplete(info:ActivityInfo):boolean {
		let rewards:ActivityRewardInfo[] = info.rewardInfos;
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i].hadGetCount > 0) continue;
			let leftCount:number = rewards[i].conds[2] - this.getActivityRewardGetNum(info.code,rewards[i].conds[0]);
			if(leftCount > 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 累充返利红点提示
	 */
	public checkDayAndSevenRechargeRebateTips():boolean {
		if(!this._rechargeInfo) return false;
		let cfg:any = ConfigManager.activitySeven.getDayRechargeRebateCfg(this._rechargeInfo.code,this._rechargeInfo.curDay);
		if(cfg) {
			if(this._rechargeInfo.dayGet == 0 && this._rechargeInfo.dayCount >= cfg.rechargeAmount) {
				return true;
			}
		}
		cfg = ConfigManager.activitySeven.getSevenRechargeCfg(this._rechargeInfo.code);
		if(cfg) {
			if(this._rechargeInfo.totalGet == 0 && this._rechargeInfo.totalCount >= cfg.rechargeAmount) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 累充返利红是否全部领完
	 */
	public dayAndSevenRechargeComplete():boolean {
		if(!this._rechargeInfo) return false;
		let cfg:any = ConfigManager.activitySeven.getDayRechargeRebateCfg(this._rechargeInfo.code,this._rechargeInfo.curDay);
		if(cfg) {
			if(this._rechargeInfo.dayGet == 0) {
				return false;//每日充值未领取
			}
		}
		cfg = ConfigManager.activitySeven.getSevenRechargeCfg(this._rechargeInfo.code);
		if(cfg) {
			if(this._rechargeInfo.totalGet == 0) {
				return false;//七日累计充值未领取
			}
		}
		return true;//全部领取
	}

	/**投资计划红点检测 */
	public checkActivityInvestTips():boolean {
		if(!this.hasInvested) return false;
		let rewards:any[] = ConfigManager.activityInvest.getInvestRewardCfgs();
		for(let i:number = 0; i < rewards.length; i++) {
			if(this.investHadGet(rewards[i].day)) continue;
			if(this.investDay >= rewards[i].day) return true;
		}
		return false;
	}

	/**投资计划奖励是否全部领取完毕 */
	public activityInvestComplete():boolean {
		if(!this.hasInvested) return false;
		let rewards:any[] = ConfigManager.activityInvest.getInvestRewardCfgs();
		for(let i:number = 0; i < rewards.length; i++) {
			if(!this.investHadGet(rewards[i].day)) return false;
		}
		return true;
	}

	/**限时充值红点检测 */
	public checkLimitRechargeTips(info:ActivityInfo):boolean {
		for(let i:number = 0; i < info.rewardInfos.length; i++) {
			let rewardInfo:ActivityRewardInfo = info.rewardInfos[i];
			let getInfos:number[] = this.getActivityGetRewardInfo(info.code);
			if(this.limitRechargeNum >= rewardInfo.conds[0] && rewardInfo.hadGetCount <= 0) {
				return true;
			}
		}
		return false;
	}

	/**限时充值是否领取完所有奖励 */
	public limitRechargeComplete(info:ActivityInfo):boolean {
		for(let i:number = 0; i < info.rewardInfos.length; i++) {
			if(info.rewardInfos[i].hadGetCount <= 0) return false;//存在未领取奖励
		}
		return true;
	}

	/**连充返利红点检测 */
	public checkHolidayRechargeTips(info:ActivityInfo):boolean {
		let rechargeNums:number[] = ConfigManager.rechargeRebate.getRechargeAmounts(info.code);
		for(let i:number = 0; i < rechargeNums.length; i++) {
			let rechargeCfgs:any[] = ConfigManager.rechargeRebate.getRechargeList(info.code,rechargeNums[i]);
			for(let k:number = 0; k < rechargeCfgs.length; k++) {
				if(this.holidayRechargeGetState(info.code,rechargeCfgs[k].id) == 1) return true;
			}
		}
		return false;
	}

	public getActivityRankStr(type:EToplistType):string[] {
		let desStr:string = "";
		let unitStr:string = "";
		let value:any = 0;
		switch(type){
			case EToplistType.EToplistTypeStrengthenExCastOpen:
				desStr = "我的铸造总等级：";
				unitStr = "级";
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeCast);
				break;
			case EToplistType.EToplistTypeStrengthenExDragonSoulOpen:
				desStr = "我的龙炎甲总星数：";
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeDragonSoul);
				unitStr = "星";
				break;
			case EToplistType.EToplistTypeStrengthenExWingOpen:
				desStr = "我的翅膀总等级：";
				unitStr = "级";
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeWing);
				break;
			case EToplistType.EToplistTypeIllustrated:
				desStr = "我的图鉴总战力：";
				value = CacheManager.cultivate.getCultivateFight(ECultivateType.ECultivateTypeIllustrated);
				break;
			case EToplistType.EToplistTypeRoleStateOpen:
				desStr = "我的转生等级：";
				unitStr = "转";
				value = HtmlUtil.colorSubstitude(LangActivity.L17,CacheManager.role.getRoleState(),App.MathUtils.formatNum(CacheManager.role.money.roleExp_I));
				break;
			case EToplistType.EToplistTypeTotalEquipScoreOpen:
				desStr = "我的装备总评分：";
				value = CacheManager.pack.rolePackCache.getAllEquipedScore();
				break;
			case EToplistType.EToplistTypePlayerFightOpen:
				desStr = "我的战斗力：";
				value = CacheManager.role.combatCapabilities;
				break;
			case EToplistType.EToplistTypeShapePetOpen:
				desStr = "我的宠物等级：";
				unitStr = "级";
				value = CacheManager.pet.level < 0 ? 0 : CacheManager.pet.level;
				break;
			case EToplistType.EToplistTypePlayerRechargeOpen:
				desStr = "已充值元宝：";
				unitStr = "元宝";
				value = this.rankRechargeNum;
				break;
		}
		return [desStr + HtmlUtil.html(value + "",Color.Color_2),unitStr];
	}

	public checkActivityBossByIndex(index:number):boolean {
		if(!this.bossInfos || !this.bossInfos[index]) return false;
		return this.bossInfos[index].status_I == EDeityBookStatus.EDeityBookStatusComplete;
	}

	/**
	 * 每次登陆是否显示子活动图标特效
	 */
	public checkShowEffect(type:PanelTabType):boolean {
		if(this.showEffect.length == 0) {
			return !this.isShowed[type];
		}
		//showEffect预留只设置部分图标有特效
		return this.showEffect.indexOf(type) != -1 && !this.isShowed[type];
	}

	public clear():void {

	}
}