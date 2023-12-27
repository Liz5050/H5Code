/**
 * 天书寻主
 */

class BibleActivityController extends BaseController{
	private module: BibleActivityModule;

	public constructor() {
		super(ModuleEnum.BibleActivity);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseGUIView{
		this.module = new BibleActivityModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookInfo], this.onActiveGetDeityBookInfo, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateDeityBookTargetComplete], this.onDeityBookTargetComplete, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookTargetReward], this.onGetDeityBookTargetReward, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActiveGetDeityBookPageReward], this.onGetDeityBookPageReward, this);

    }

	public addListenerOnShow(): void{
	}


	/**
	 * 获取天书信息返回
	 * @param data S2C_SGetDeityBookInfo
	 */
	private onActiveGetDeityBookInfo(data: any): void{
		if(data.info.status_I == EDeityBookStatus.EDeityBookStatusComplete){
			ProxyManager.bibleActivity.getDeityBookPageReward(data.info.currentPage_I);
		}else{
			CacheManager.bibleActivity.deityBookInfo = data;
			CacheManager.bibleActivity.updateTargetInfo();
			if(this.isShow){
				this.module.updateTabList();
			}
		}
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, HomeModule.ActivityBtn, HomeUtil.checkOpenServerTips(), true);
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