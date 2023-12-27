class ActivityBossController extends BaseController {
	private module:ActivityBossModule;
	public constructor() {
		super(ModuleEnum.ActivityBoss);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseModule {
        this.module = new ActivityBossModule(this.moduleId);
		return this.module;
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		//全民Boss活动，独立协议(原天书寻主功能)
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookInfo], this.onActiveGetDeityBookInfo, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateDeityBookTargetComplete], this.onDeityBookTargetComplete, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookTargetReward], this.onGetDeityBookTargetReward, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookPageReward], this.onGetDeityBookPageReward, this);
	}

		/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
	}

	/**
	 * 获取全民boss信息返回
	 * @param data S2C_SGetDeityBookInfo
	 */
	private onActiveGetDeityBookInfo(data: any): void{
		CacheManager.activity.updateActivityBossInfo(data);
		if(CacheManager.activity.activityBossComplete()) {
			//已经领取所有奖励，关闭界面，移除活动图标
			if(this.isShow) {
				this.hide();
			}
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.ActivityBoss);
		}
		else {
			if(this.isShow) {
				this.module.updateRewardInfo();
			}
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.ActivityBoss,CacheManager.activity.checkActivityTips(ActivityCategoryEnum.ActivityBoss));
		}
	}

	/**天书目标完成 */
	private onDeityBookTargetComplete(data: any): void{
		ProxyManager.bibleActivity.getDeityBookInfo();
	}

	private onGetDeityBookTargetReward(data: any): void{
		ProxyManager.bibleActivity.getDeityBookInfo();
	}

	private onGetDeityBookPageReward(data: any): void{
		ProxyManager.bibleActivity.getDeityBookInfo();
	}
}