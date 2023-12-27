class ActivityLimitRechargeController extends BaseController{
	private module:ActivityLimitRechargeWindow;
	public constructor() {
		super(ModuleEnum.ActivityLimitRecharge);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseWindow {
        this.module = new ActivityLimitRechargeWindow(this.moduleId);
		return this.module;
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateActiveRechargeNum4],this.onRechargeNumUpdate,this);

		this.addListen0(NetEventEnum.ActivityInfoListUpdate,this.onActivityListInfoUpdate,this);
		this.addListen0(NetEventEnum.ActivityRewardInfoUpdate,this.onActivityRewardInfoUpdate,this)
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		// this.addListen1(LocalEventEnum.ActivityRemove,this.onRemoveActivityHandler,this);
	}

	/**
	 * 限时充值活动期间充值数更新
	 * SInt
	 */
	private onRechargeNumUpdate(data:any):void {
		CacheManager.activity.limitRechargeNum = data.value_I;
		if(this.isShow) {
			this.module.updateRechargeNum();
		}
		this.checkHomeIconTips();
	}

	/**活动列表更新 */
	private onActivityListInfoUpdate():void {
		if(this.isShow) {
			this.module.updateActicityInfo();
		}
	}

	private onActivityRewardInfoUpdate():void {
		if(this.isShow) {
			this.module.updateRewardInfo();
		}
		this.checkHomeIconTips();
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeFlashRecharge);
		if(!info) {
			//当天活动奖励已经全部领取完成
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.ActivityLimitRecharge);
		}
	}

	private checkHomeIconTips():void {
		let isShow:boolean = CacheManager.activity.checkActivityTips(ActivityCategoryEnum.ActivityLimitRecharge);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId[ActivityCategoryEnum[ActivityCategoryEnum.ActivityLimitRecharge]],isShow);
	}

	/**
	 * 有活动过期
	 */
	private onRemoveActivityHandler(info:ActivityInfo):void {
		if(info.category == ActivityCategoryEnum.ActivityLimitRecharge) {
			this.hide();
		}
	}
}