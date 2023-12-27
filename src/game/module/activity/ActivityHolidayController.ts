class ActivityHolidayController extends SubController {
	public constructor() {
		super();
	}

	public getModule(): ActivityModule {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActivePushComposeRechargeExActiveInfo],this.onHolidayRechargeInfoUpdate,this);
	}

	public addListenerOnShow(): void {
    }

	private onHolidayRechargeInfoUpdate(data:any):void {
		CacheManager.activity.updateHolidayRechargeInfo(data);
		if(this.isShow) {
			this.getModule().updateRewardInfo();
		}
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityHoliday);
		this.checkHomeIconTips(ActivityCategoryEnum.ActivityHoliday2);
	}

	private checkHomeIconTips(category:ActivityCategoryEnum = null):void {
		if(category == null && this.getModule()) category = this.getModule().activityCategory;
		let isShow:boolean = CacheManager.activity.checkActivityTips(category);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId[ActivityCategoryEnum[category]],isShow);
	}
}