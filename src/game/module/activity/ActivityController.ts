// import {CacheManager} from "../../manager/CacheManager"
class ActivityController extends BaseController {
	private module:ActivityModule;
	private rankWindow:ActivityRankWindow;
	private dayRechargeWindow:ActivityDayRechargeWindow;
	private shapeRewardWindow:ActivityDayRechargeRewardShow;
	private scoreExcWin:ActivityScoreExcWin;
	private exChangeWin : ExChangeWindow;
	private holidayController:ActivityHolidayController;
	public constructor() {
		super(ModuleEnum.Activity);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseModule {
        this.module = new ActivityModule(this.moduleId);
		this.holidayController.setModule(this.module);
		return this.module;
    }

	public show(data?: any): void {
		if(this.isShow && this.module.activityCategory != data.category) {
			this.hide();
		}
		super.show(data);
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		this.holidayController = new ActivityHolidayController();
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSpecialActiveUpdate],this.onActivityInfoUpdate,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSpecialActiveGetInfo],this.onGetInfoUpdate,this);//登陆推送一次
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSpecialActiveGetInfoUpdate],this.onActivityGetInfoUpdate,this);//变化实时更新
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSpecialActiveUpdatePart],this.onActivityInfoChangeUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicSpecialActiveRewardNumInfo],this.onActiveRewardNumInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicSpecialActiveRewardNumUpdate],this.onActiveRewardNumUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicRechargeGroupPlayerCount],this.onRechargePlayerCount,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicRechargeGroupInfo],this.onRechargeGroupInfo,this);

		//累计充值活动的充值额度
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateActiveRechargeNum2],this.onRechargeNumUpdate,this);
		//连续充值的充值天数
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateActiveRechargeCondDayCount],this.onRechargeDayCountUpdate,this);
		//积分兑换
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateActiveBossScore], this.onBossScoreExcInfo, this);

		//天天返利信息，独立活动协议
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveRechargeDayReturnInfo],this.onRebateInfoUpdate,this);

		// //全民Boss活动，独立协议(原天书寻主功能)
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookInfo], this.onActiveGetDeityBookInfo, this);
		// this.addMsgListener(EGateCommand[EGateCommand.ECmdGateDeityBookTargetComplete], this.onDeityBookTargetComplete, this);
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookTargetReward], this.onGetDeityBookTargetReward, this);
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookPageReward], this.onGetDeityBookPageReward, this);

		//冲榜排名信息
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicToplistActivePlayerInfoList], this.onToplistActivePlayerInfoList, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicToplistActivePlayerInfo], this.onToplistActivePlayerInfo, this);
		

		//冲级豪礼
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateLevelReward], this.onLevelReward, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicLevelRewardNumInfo], this.onLevelRewardNumInfo, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicLevelRewardNumUpdate], this.onLevelRewardNumInfo, this);

		//累充返利(每日、七日混合累充活动)
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActivePushComposeRechargeActiveInfo], this.updateDayAndSevenRechargeInfo, this);

		//投资计划信息更新
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateInvestRewardInfo], this.onInvestInfoUpdate, this);

		//冲榜活动充值额度更新
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePushReachGoalRechargeNum],this.onReachGoalRechargeNumUpdate,this);


		//通用活动领奖
		this.addListen0(LocalEventEnum.ActivityGetReward,this.onGetRewardHandler,this);
		//天天返利领奖
		this.addListen0(LocalEventEnum.ActivityRebateGetReward,this.onGetRebateRewardHandler,this);
		this.addListen0(LocalEventEnum.ActivityDayRechargeReward,this.onGetDayRechargeRewardHandler,this);
		this.addListen0(LocalEventEnum.RechargeActInfo,this.onRechargeInfoUpdate,this);

		this.addListen0(LocalEventEnum.CheckActivityRank,this.onOpenActivityRankWindow,this);

		//强化属性更新
		this.addListen0(NetEventEnum.PlayerStrengthenExUpgraded, this.checkDayTargetTips, this);
		//转生等级改变
		this.addListen0(NetEventEnum.roleCareerChanged, this.checkDayTargetTips, this);
		//人物背包改变
		this.addListen0(NetEventEnum.packPosTypeRoleChange,this.checkDayTargetTips,this);
		//角色战力更新
		this.addListen0(NetEventEnum.roleCombatCapabilitiesUpdate, this.checkDayTargetTips, this);


		this.addListen0(LocalEventEnum.OpenDayRecharge,this.onOpenDayRechargeHandler,this);
		this.addListen0(LocalEventEnum.OpenDayRechargeShow,this.onOpenDayRechargeShowHandler,this);

		this.addListen0(NetEventEnum.CultivateFightUpdate,this.onCultivateFightUpdate,this);
		/**法宝更新 */
		this.addListen0(LocalEventEnum.MagicWeaponUpdate,this.onMagicInfoUpdate,this);

		/**元宝发生改变 */
		this.addListen0(NetEventEnum.moneyGoldUpdate, this.moneyGoldUpdate, this);
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		this.holidayController.addListenerOnShow();
		this.addListen1(LocalEventEnum.ActivityAdd,this.onAddActivityHandler,this);
		this.addListen1(LocalEventEnum.ActivityRemove,this.onRemoveActivityHandler,this);
		this.addListen1(LocalEventEnum.GetRankInfoUpdate,this.onRankInfoUpdate,this);
		this.addListen1(LocalEventEnum.ActivityScoreExcWin,this.onShowScoreExcWin,this);
		this.addListen1(LocalEventEnum.ExchangeWinShow, this.onShowExchangeWin, this);
	}	

	protected afterModuleShow(data?: any): void {
    }

	/**
	 * 活动信息更新 
	 * SSeqSpecialActiveInfo
	 * ActiveDef.cdl
	 * 
	 */
	private onActivityInfoUpdate(data:any):void {
		CacheManager.activity.updateActivityInfos(data.specialActiveInfos.data);
		if(this.isShow) {
			this.module.updateActicityInfo();
		}
	}

	/***
	 * 后续活动更新，直接替换相同code旧活动数据
	 * SSeqSpecialActiveInfo
	 */
	private onActivityInfoChangeUpdate(data:any):void {
		CacheManager.activity.activityChangeUpdate(data.specialActiveInfos.data);
		if(this.isShow) {
			this.module.updateActicityInfo();
		}
	}

	/**
	 * 活动已领取标志更新
	 * 实时更新
	 * SSpecialActiveGetInfo
	 */
	private onActivityGetInfoUpdate(data:any):void {
		CacheManager.activity.updateGetRewardInfo(data.info);
		if(this.isShow) {
			this.module.updateRewardInfo();
		}
		this.checkHomeIconTips();
	}

	/**
	 * 活动已领取标志更新
	 * 登陆推送一次
	 * SSpecialActiveGetInfo
	 */
	private onGetInfoUpdate(data:any):void {
		CacheManager.activity.updateGetRewardInfo(data.info);
	}

	/**
	 * 有全服数量限制的领取信息（登陆推送一次）
	 * SCodeDictList
	 */
	private onActiveRewardNumInfoUpdate(data:any):void {
		CacheManager.activity.updateRewardNumList(data.list.data);
	}

	/**
	 * 数量限制信息更新
	 * SCodeDictList
	 */
	private onActiveRewardNumUpdate(data:any):void {
		CacheManager.activity.updateRewardNumList(data.list.data);
		if(this.isShow) {
			this.module.updateRewardNumList();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
	}

	/**
	 * 全服充值人数 
	 * @param sint
	 * */
	private onRechargePlayerCount(data:any):void{
		CacheManager.recharge.serveRechargeCount = data.value_I;
		this.updatreGroupBuy();
	}

	/**
	 * 团购充值信息
	 * @params SRechargeGroupInfo
	 *  */
	private onRechargeGroupInfo(data:any):void{
		CacheManager.recharge.setGroupBuyInf(data);
		this.updatreGroupBuy();
	}

	private updatreGroupBuy():void{
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeRechargeGroup);			
		if(info && this.isShow) { //没有活动信息 不实时刷新界面 ，活动界面是10秒刷新一次
			this.module.updateActicityInfo();
			this.module.updateRewardInfo();
		}
	}

	/**
	 * 累计充值活动期间充值数额
	 * SInt
	 */
	private onRechargeNumUpdate(data:any):void {
		CacheManager.activity.addRechargeNum = data.value_I;
		if(this.isShow) {
			this.module.updateRechargeNum();
		}
		let category:ActivityCategoryEnum = CacheManager.activity.getActivityCategoryByType(ESpecialConditonType.ESpecialConditonTypeMgRecharge);
		if(category) {
			this.checkHomeIconTips(category);
		}
	}

	/**
	 * 连续充值已充值天数更新
	 */
	private onRechargeDayCountUpdate(data:any):void {
		CacheManager.activity.rechargeDay = data.value_I;
		if(this.isShow) {
			this.module.updateRechargeDay();
		}
		let category:ActivityCategoryEnum = CacheManager.activity.getActivityCategoryByType(ESpecialConditonType.ESpecialConditonTypeRechargeCondDayCount);
		if(category) {
			this.checkHomeIconTips(category);
		}
	}
	/**
	 * 积分兑换 SAttribute
	 * value字段传的是已有的积分， valueStr传的是已兑换的字符串，{“index”： 次数}
	 */
	private onBossScoreExcInfo(data:any):void{
		CacheManager.activity.setBossScoreExcInfo(data);
		if(this.scoreExcWin && this.scoreExcWin.isShow){
			this.scoreExcWin.updateAll();
		}
		if(this.isShow) {
			this.module.updateBossScore();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
	}

	/**
	 * 天天返利信息推送
	 * S2C_SRechargeDayReturnInfo
	 */
	private onRebateInfoUpdate(data:any):void {
		CacheManager.activity.updateRechargeRebateInfo(data);
		if(this.isShow) {
			this.module.rebateInfoUpdate();
		}
		// let category:ActivityCategoryEnum = CacheManager.activity.getActivityCategoryByType(ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn);
		// if(category) {
		// 	this.checkHomeIconTips(category);
		// 	// this.checkHomeIconTips(ActivityCategoryEnum.ActivityRecharge);//天天返利活动会放在开服返利大类里
		// }
		if(CacheManager.serverTime.serverOpenDay <= 7) {
			this.checkHomeIconTips(ActivityCategoryEnum.ActivityRecharge);
		}
		else {
			this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
		}
		// optional int32 rechargeDayNum = 1;	    //累计充值天数
		// optional int32 rewardRound = 2;	    //奖励轮数
		// optional Protocol_Public.SeqInt canGetRewardIdList = 3;	    //可以领取的奖励 id 列表
	}

	// /**
	//  * 获取全民boss信息返回
	//  * @param data S2C_SGetDeityBookInfo
	//  */
	// private onActiveGetDeityBookInfo(data: any): void{
	// 	CacheManager.activity.updateActivityBossInfo(data);
	// 	if(this.isShow) {
	// 		this.module.updateRewardInfo();
	// 	}
	// 	this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
	// }

	// /**天书目标完成 */
	// private onDeityBookTargetComplete(data: any): void{
	// 	ProxyManager.bibleActivity.getDeityBookInfo();
	// }

	// private onGetDeityBookTargetReward(data: any): void{
	// 	ProxyManager.bibleActivity.getDeityBookInfo();
	// }

	// private onGetDeityBookPageReward(data: any): void{
	// 	ProxyManager.bibleActivity.getDeityBookInfo();
	// }

	/**
	 * 排行榜信息更新
	 */
	private onRankInfoUpdate(data:any[]):void {
		if(this.showRank) {
			this.showRank = false;
			if(data && data.length > 0) {
				if(!this.rankWindow) {
					this.rankWindow = new ActivityRankWindow();
				}
				this.rankWindow.show(data);
			}
			else {
				Tip.showTip(LangActivity.L18);
			}
		}
		if(this.isShow) {
			this.module.updateActivityRank(data);
		}
	}
	/**显示积分兑换窗口 */
	private onShowScoreExcWin(actInfo:any):void{
		if(!this.scoreExcWin){
			this.scoreExcWin = new ActivityScoreExcWin();
		}
		this.scoreExcWin.show(actInfo);
	}

	private onShowExchangeWin(data : any): void {
		if(!this.exChangeWin) {
			this.exChangeWin = new ExChangeWindow();
		}
		this.exChangeWin.show(data);
	}

	/**
	 * 登录推送
	 * @param data SToplistActivePlayerInfoList
	 */
	private onToplistActivePlayerInfoList(data: any): void{
		// let infoList: Array<any> = data.list.data;
		// let info: any = {};
		// if(infoList.length > 0){
		// 	for(let value of infoList){
		// 		info[value.toplist_I] = value;
		// 	}
		// }
		// CacheManager.rankRush.tabToplistDate = info;
		CacheManager.activity.updateActivityRankInfos(data.list.data);
	}

	/**
	 * 玩家个人冲榜信息更新推送（排名或条件发生更新时都会推送）
	 * @param data SToplistActivePlayerInfo
	 */
	private onToplistActivePlayerInfo(data: any): void{
		// CacheManager.rankRush.tabToplistDate[data.toplist_I] = data;
	}

	/**
	 * 充值活动信息更新
	 */
	private onRechargeInfoUpdate():void {
		if(this.isShow) {
			this.module.updateRewardInfo();
		}
		if(this.dayRechargeWindow && this.dayRechargeWindow.isShow) {
			this.dayRechargeWindow.updateRewardGetInfo();
		}
		if(this.shapeRewardWindow && this.shapeRewardWindow.isShow) {
			this.shapeRewardWindow.updateAll();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer); //充值团购 需要检查开服活动大图标
		if(CacheManager.serverTime.serverOpenDay <= 7) {
			this.checkHomeIconTips(ActivityCategoryEnum.ActivityRecharge);
		}
		else {
			this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.DayRecharge,CacheManager.activity.checkDayRechargeTips());
		// EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.DayRechargeShow,CacheManager.activity.checkDayRechargeShapeRewadTips());
	}

	/**
	 * 冲级豪礼玩家领取记录登录推送和领取后的更新推送
	 * @param data SLevelReward
	 */
	private onLevelReward(data: any): void{
		let levels: Array<any> = data.levels.data_I;
		let dict: any = CacheManager.welfare.levelReward;
		for(let d of levels) {
			dict[d] = true;
		}
		if(this.isShow) {
			this.module.updateUpgradeLvList();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
	}

	/**
	 * 冲级豪礼全服已领取记录登录推送/冲级豪礼领取后全服已领取记录更新推送
	 * @param data SDictIntInt
	 */
	private onLevelRewardNumInfo(data: any): void{
		let dict: any = CacheManager.welfare.levelRewardNum;
		let key: Array<any> = data.intIntDict.key_I;
		let value: Array<any> = data.intIntDict.value_I;
		for(let i = 0; i < key.length; i++){
			dict[key[i]] = value[i];
		}
		if(this.isShow) {
			this.module.updateUpgradeLvList();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
	}

	/**
	 * 累充返利活动信息更新（每日、七日）
	 * S2C_SPushComposeRechargeActiveInfo
	 */
	private updateDayAndSevenRechargeInfo(data:any):void {
		CacheManager.activity.updateDayAndSevenRechargeInfo(data);
		if(this.isShow) {
			this.module.updateRewardInfo();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
	}

	/**养成系统战力更新 */
	private onCultivateFightUpdate(type:ECultivateType):void {
		if(type != ECultivateType.ECultivateTypeIllustrated) return;
		this.checkDayTargetTips();
	}

	/**元宝更新 */
	private moneyGoldUpdate():void {
		if(this.isShow) {
			this.module.moneyGoldUpdate();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityShop);
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityHoliday);
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityHoliday2);
	}

	/**
	 * 投资计划活动信息更新
	 * SInvestActive 
	 * int32 investDay_DT = 1;投资时间戳
	 * SSeqInt hasGet = 2;已领取列表
	 */
	private onInvestInfoUpdate(data:any):void {
		let hasInvested:boolean = CacheManager.activity.hasInvested;
		CacheManager.activity.updateInvestInfo(data);
		if(this.isShow) {
			this.module.updateInvestInfo();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityInvest);
		if(!hasInvested) {
			EventManager.dispatch(LocalEventEnum.HomeIconSetTime,IconResId.ActivityInvest,-1);
		}
	}

	/**
	 * 冲榜活动充值额度更新 
	 * SInt
	 */
	private onReachGoalRechargeNumUpdate(data:any):void {
		CacheManager.activity.rankRechargeNum = data.value_I;
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityOpenServer);
	}

	/**
	 * 领取活动奖励
	 */
	private onGetRewardHandler(code:number,index:number, num : number = 1):void {
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByCode(code);
		if(!info || info.isOverTime) {
			Tip.showTip("活动已结束");
			return;
		}
		if(!info.isOpenByTime() || !info.checkGetTime) {
			Tip.showTip("活动暂未开启");
			return;
		}
		ProxyManager.activity.getActivityReward(code,index, num);
	}

	/**
	 * 天天返利领奖
	 */
	private onGetRebateRewardHandler(id:number):void {
		ProxyManager.activity.getActivityRebateReward(id);
	}

	/**
	 * 每日累充领奖
	 */
	private onGetDayRechargeRewardHandler(index:number):void {
		ProxyManager.activity.getActivityDayRechargeRewards(index);
	}

	/**
	 * 查看冲榜排名
	 */
	private showRank:boolean = false;
	private onOpenActivityRankWindow(type:EToplistType):void {
		this.showRank = true;
		EventManager.dispatch(LocalEventEnum.GetRankList,type);
	}

	/**打开每日充值 */
	private onOpenDayRechargeHandler():void {
		if(!this.dayRechargeWindow) {
			this.dayRechargeWindow = new ActivityDayRechargeWindow();
		}
		this.dayRechargeWindow.show();
	}

	/**每日充值直升丹奖励展示界面 */
	private onOpenDayRechargeShowHandler():void {
		if(!this.shapeRewardWindow) {
			this.shapeRewardWindow = new ActivityDayRechargeRewardShow();
		}
		this.shapeRewardWindow.show();
	}

	/**
	 * 有新活动开启
	 */
	private onAddActivityHandler(info:ActivityInfo):void {
		this.module.addActivity(info);
	}

	/**
	 * 有活动过期
	 */
	private onRemoveActivityHandler(info:ActivityInfo):void {
		this.module.removeActivity(info);
	}	

	private checkHomeIconTips(category:ActivityCategoryEnum = null):void {
		if(category == null && this.module) category = this.module.activityCategory;
		let isShow:boolean = CacheManager.activity.checkActivityTips(category);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId[ActivityCategoryEnum[category]],isShow);
	}

	/**开服活动图标红点检测 */
	private checkDayTargetTips():void {
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeReachGoal);
		if(!info) {
			info = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeLevelReward);
		}
		if(info) {
			this.checkHomeIconTips(info.category);
		}
	}

	/**法宝信息更新 */
	private onMagicInfoUpdate():void {
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityContinue);
	}
}