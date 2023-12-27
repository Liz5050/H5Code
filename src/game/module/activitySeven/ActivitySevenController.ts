class ActivitySevenController extends BaseController {
	private module:ActivitySevenModule;
	public constructor() {
		super(ModuleEnum.ActivitySeven);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseModule {
        this.module = new ActivitySevenModule(this.moduleId);
		return this.module;
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateActiveActivityInfo],this.onActivityInfoUpdate,this);
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
    }

    /**
     * 活跃度信息更新
     * SPlayerActivityInfo
     */
    private onActivityInfoUpdate(data:any):void {
        CacheManager.activitySeven.updateActivityInfo(data);
        if(this.isShow) {
            this.module.updateRewardList();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.ActivitySeven,CacheManager.activitySeven.checkTips());
    }
}