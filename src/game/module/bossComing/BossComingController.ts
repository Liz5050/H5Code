class BossComingController extends BaseController{
	private module:BossComingModule;
    private rewardWindow:WindowBossComingReward;
	public constructor() {
		super(ModuleEnum.BossComing);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BossComingModule {
		this.module = new BossComingModule(this.moduleId);
        return this.module;
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBossIntruderInfoUpdate],this.onBossComingInfoUpdate,this);
        this.addListen0(UIEventEnum.BossComingRewardOpen,this.onOpenRewardHandler,this);
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
        this.addListen1(NetEventEnum.BossInfUpdate,this.onBossInfoUpdate,this);
    }

    /**
     * boss来袭信息更新 
     * 登陆推列表
     * 单个变化推单个（还是列表，只有一个子元素）
     */
    private onBossComingInfoUpdate(data:any):void {
        if(!data.seqInfo) return;
        CacheManager.bossNew.updateBossComingInfo(data.seqInfo.data);
        if(this.isShow) {
            this.module.updateBossComingInfo();
        }
    }

    private onOpenRewardHandler(bossCode:number):void {
        if(!this.rewardWindow) {
			this.rewardWindow = new WindowBossComingReward();
		}
		this.rewardWindow.show(bossCode);
    }

    /**
     * 单个boss更新
     */
    private onBossInfoUpdate(data:any):void {
        if(CacheManager.bossNew.checkBossCopy(data.val_I,null,ECopyType.ECopyMgBossIntruder)) {
            this.module.updateBossState();
        }
    }
}