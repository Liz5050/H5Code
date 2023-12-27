class AchievementController extends BaseController {
	private module:AchievementModule;
	private achievementComView:AchievementReachView;
	public constructor() {
		super(ModuleEnum.Achievement);
	}

	public initView():BaseModule {
		this.module = new AchievementModule(this.moduleId);
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.GetAchievementInfos,this.onGetAchievementInfos,this);
		this.addListen0(LocalEventEnum.GetAchievementAllInfo,this.onGetAchievementAllInfos,this);
		this.addListen0(LocalEventEnum.AchievementRewardGet,this.onGetRewardHandler,this);
		this.addListen0(LocalEventEnum.AchievementRewardGetALL,this.onGetAllRewardHandler,this);

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetAchievementInfos],this.onUpdateAchievementInfos,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetAchievementOverview],this.onAllInfoUpdate,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetAchievementCodes],this.onGetCompleteCodesSuccess,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateHasAchievementComplete],this.onAchievementComplete,this);
		
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetAchievementReward],this.onGetRewardSuccessHandler,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBatchGetAchievementReward],this.onGetRewardAllSuccessHandler,this);
		
		
	// 	ECmdGateAchievementUpdate = 12560;
    // ECmdGateHasAchievementComplete = 12561;
	}

	protected addListenerOnShow(): void {
	}

	/**
	 * 更新成就信息
	 * SeqAchievement [IAchievement]
	 */
	private onUpdateAchievementInfos(data:any):void {
		let infos:any[] = data.achievements.data;
		if(infos.length == 0) return;
		CacheManager.achievement.updateAchievementInfos(infos);
		if(this.module && this.module.isShow)
		{
			this.module.updateSelectList();
		}
	}

	/**
	 * 总览信息更新 
	 * SeqAchievementOverview [IAchievement]
	 */
	private onAllInfoUpdate(data:any):void {
		CacheManager.achievement.updateAllInfos(data.achievementOverviews.data);
		if(this.module && this.module.isShow)
		{
			this.module.updateTopPanel();
		}
	}

	/**
	 * 达成成就更新
	 * SSeqInt [CdlPublic.cdl]
	 */
	private onAchievementComplete(data:any):void
	{
		let codes:number[] = data.intSeq.data_I;
		CacheManager.achievement.completeCodes = CacheManager.achievement.completeCodes.concat(codes);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Achievement,CacheManager.achievement.completeCodes.length > 0);
		if(this.module && this.module.isShow)
		{
			this.module.updateBtnTipsIcon();
		}
		if(!this.achievementComView) {
			this.achievementComView = new AchievementReachView();
		}
		this.achievementComView.show(codes);
	}

	/**
	 * 主动请求可领奖的成就code更新
	 */
	private onGetCompleteCodesSuccess(data:any):void
	{
		let codes:number[] = data.completeCodes.data_I;
		CacheManager.achievement.completeCodes = codes;
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Achievement,codes.length > 0);
	}

	/**
	 * 领取单个成就奖励成功
	 */
	public onGetRewardSuccessHandler(data:any):void
	{
		CacheManager.achievement.achievementRewardGetSuccess([data.code]);
		if(this.module && this.module.isShow)
		{
			this.module.updateSelectList();
			this.module.updateBtnTipsIcon();
		}
	}

	/**
	 * 一键领取成就成功
	 * SeqInt codes
	 */
	private onGetRewardAllSuccessHandler(data:any):void
	{
		let codes:number[] = data.codes.data_I;
		CacheManager.achievement.achievementRewardGetSuccess(codes);
		if(this.module && this.module.isShow)
		{
			this.module.updateSelectList();
			this.module.updateBtnTipsIcon();
		}
	}


	/**获取成就信息 */
	private onGetAchievementInfos(category:number,type:number = 0):void {
		ProxyManager.achievement.getAchievementInfos(category,type);
	}

	/**获取成就总览信息 */
	private onGetAchievementAllInfos():void {
		ProxyManager.achievement.getAchievementAllInfos();
	}

	/**领取成就奖励 */
	private onGetRewardHandler(code:number):void {
		ProxyManager.achievement.getAchievementReward(code);
	}

	/**一键领取成就奖励 */
	private onGetAllRewardHandler(codes:number[]):void {
		ProxyManager.achievement.getChievementAllReward(codes);
	}
}
