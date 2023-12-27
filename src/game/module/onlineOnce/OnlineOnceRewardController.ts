class OnlineOnceRewardController extends BaseController{
	private module: OnlineOnceRewardModule;
	private onceCfg:any;
    public constructor() {
        super(ModuleEnum.OnlineReward);
    }

    public initView(): BaseModule {
        this.module = new OnlineOnceRewardModule(this.moduleId);
        return this.module;
    }

	protected addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.OnlineRewardStateUpdate,this.onRewardStateUpdate,this);
		this.addListen0(NetEventEnum.OnlineTimeTodayUpdate,this.onlineTimeUpdate,this);
	}

	protected addListenerOnShow(): void {
	}

	private onRewardStateUpdate():void {
		if(this.isShow) {
			this.module.updateRewardState();
		}
		if(!this.onceCfg) {
			this.onceCfg = ConfigManager.online.getOnceOnlineRewardCfg();
		}
		if(CacheManager.welfare2.onlineRewardHadGet(this.onceCfg.type,this.onceCfg.onlineMinute)) {
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.OnlineRewardFashion);
			this.removeListener(LocalEventEnum.OnlineRewardStateUpdate,this.onRewardStateUpdate,this);
			this.removeListener(NetEventEnum.OnlineTimeTodayUpdate,this.onlineTimeUpdate,this);
		}
		else {
			let totalOnlineTime:number = CacheManager.serverTime.totalOnlineTime;
			let leftGetTime:number = this.onceCfg.onlineMinute * 60 - totalOnlineTime;
			EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.OnlineRewardFashion);
			EventManager.dispatch(LocalEventEnum.HomeIconSetTime,IconResId.OnlineRewardFashion,leftGetTime);
		}
	}

	private onlineTimeUpdate():void {
		if(!this.onceCfg) {
			this.onceCfg = ConfigManager.online.getOnceOnlineRewardCfg();
		}
		let totalOnlineTime:number = CacheManager.serverTime.totalOnlineTime;
		let leftGetTime:number = this.onceCfg.onlineMinute * 60 - totalOnlineTime;
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.OnlineRewardFashion,CacheManager.welfare2.checkOnlineOnceRewardTips());
		EventManager.dispatch(LocalEventEnum.HomeIconSetTime,IconResId.OnlineRewardFashion,leftGetTime);
	}
}