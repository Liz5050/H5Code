class TimeLimitTaskController extends BaseController {
	private module: TimeLimitTaskModule;
	
	private openedView: TimeLimitTaskOpened;

	private commonIsLoaded: boolean;
	private isShowOpenedView: boolean;

	public constructor() {
		super(ModuleEnum.TimeLimitTask);
		this.onCommonLoaded(PackNameEnum.Common);
	}

	public initView(): BaseModule {
		this.module = new TimeLimitTaskModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addListen0(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameTaskPushTimeLimitedTaskInfo], this.onTimeLimitedTaskInfo, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameTaskUpdateTimeLimitedTaskInfo], this.onTimeLimitedTaskInfoUpdate, this);
	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
	}

	public afterModuleShow(data?: any): void {
		super.afterModuleShow(data);
		
	}

	private onCommonLoaded(packageName: string): void {
		if (packageName == PackNameEnum.Common && ResourceManager.isPackageLoaded(packageName)) {
			this.removeListener(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
			this.commonIsLoaded = true;
			if (this.commonIsLoaded && this.isShowOpenedView) {
				//home打开后再显示
				App.TimerManager.doDelay(100, this.showOpenedView, this);
			}
		}
	}

	/**
	 * 玩家限时任务信息推送 S2C_SPlayerTimeLimitedTaskInfo
	 * 
	 */
	private onTimeLimitedTaskInfo(data: any): void {
		CacheManager.timeLimitTask.setTimeLimitTaskInfo(data);

		if(data.createFlag) {
			//弹窗
			this.isShowOpenedView = true;
			if (this.commonIsLoaded) {
				this.showOpenedView();
			}
		}

		if(CacheManager.timeLimitTask.needShowIcon()) {
			EventManager.dispatch(LocalEventEnum.AddHomeIcon, IconResId.TimeLimitTask);
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.TimeLimitTask, CacheManager.timeLimitTask.checkTips());
			EventManager.dispatch(LocalEventEnum.HomeIconSetTime, IconResId.TimeLimitTask, CacheManager.timeLimitTask.leftTime);
		}
		else {
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon, IconResId.TimeLimitTask);
		}
	}

	private showOpenedView():void {
		this.openedView || (this.openedView = new TimeLimitTaskOpened());
		this.openedView.show();
		this.isShowOpenedView = false;
	}

	/**
	 * 玩家限时任务更新信息推送 S2C_SPlayerTimeLimitedTaskInfoUpdate
	 * 
	 */
	private onTimeLimitedTaskInfoUpdate(data: any): void {
		CacheManager.timeLimitTask.updateTimeLimitTaskList(data);

		EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.TimeLimitTask, CacheManager.timeLimitTask.checkTips());
	}

	/** 
	 * 背包变动，检查按钮红点
	 */
	private backpackChange():void {
		if(this.isShow) {
			this.module.updateLookUpBtnTips();
		}
	}

	public isTaskOpenedWindowOpen() : boolean{
		return this.openedView && this.openedView.isShow;
	}

}