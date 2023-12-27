class ExamController extends BaseController{
	private module: ExamModule;
	private resultWindow: ExamResultWindow;
	private rankWindow: ExamRankWindow;

	public constructor() {
		super(ModuleEnum.Exam);
		// this.viewIndex = ViewIndex.Two;
	}
	public initView(): BaseGUIView{
		this.module = new ExamModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit():void{
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGetQuestionInfoRet], this.onGetQuestionInfo, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicAnswerQuestionRet], this.onAnswerQuestion, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPushQuestionRewardInfo], this.onPushQuestionRewardInfo, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPushRefreshRankList], this.onPushRefreshRankList, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPushQuestionOpen], this.onPushQuestionOpen, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPushQuestionInfo], this.onPushQuestionInfo, this);

		this.addListen0(UIEventEnum.ExamRankOpen, this.openExamRankWindow, this);
		this.addListen0(UIEventEnum.ExamEnter, this.onEnterExam, this);
	}

	public addListenerOnShow():void{

	}

	public onEnterExam(): void{
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Question)){
			if(CacheManager.exam.isExamStart()){
				ProxyManager.exam.getQuestionInfo();
			}else{
				Tip.showTip("活动暂未开启");
			}
		}
	}

	/**
	 * 获取科举信息返回
	 * @param data SGetNewQuestionInfoRet
	 */
	private onGetQuestionInfo(data: any): void{
		CacheManager.exam.updateInfo(data);
		// if(this.module && this.module.isShow){
		// 	this.module.updateInfo();
		// }
		if(this.module && this.module.isShow){
			this.module.updateAll();
		}else{
			this.show();
		}
	}

	/**
	 * 科举答题返回
	 * @param data SAnswerNewQuestionRet
	 */
	private onAnswerQuestion(data: any): void{
		if(data.retCode_I == 1){//状态不同步，重新获取信息
			ProxyManager.exam.getQuestionInfo();
		}else{
			CacheManager.exam.updateAnswer(data);
			if(this.module && this.module.isShow){
				this.module.updateAnswerStatus();
			}
		}
	}

	/**
	 * 科举答题奖励显示结果推送
	 * @param data SPushNewQuestionRewardInfo
	 */
	private onPushQuestionRewardInfo(data: any): void{
		if(this.module && this.module.isShow){
			this.module.hide();
		}
		if(this.rankWindow){
			this.rankWindow.hide();
		}
		this.openResultWindow(data);
		//删除图标
		CacheManager.exam.showIcon = false;
        EventManager.dispatch(UIEventEnum.ExamIconBar);
		EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
		EventManager.dispatch(UIEventEnum.ExamBtnTips);
	}

	/**
	 * 排行榜刷新推送
	 * @param data SPushNewQuestionRankList
	 */
	private onPushRefreshRankList(data: any): void{
		CacheManager.exam.updateRank(data);
		if(this.module && this.module.isShow){
			this.module.updateRank();
		}
		if(this.rankWindow && this.rankWindow.isShow){
			this.rankWindow.updateRankInfo();
		}
	}

	/**
	 * 科举活动推送
	 * @param data SPushQuestionOpen
	 */
	private onPushQuestionOpen(data: any): void{
		CacheManager.exam.updatOpenInfo(data);
		//显示图标
		CacheManager.exam.showIcon = true;
        EventManager.dispatch(UIEventEnum.ExamIconBar);
		EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
		EventManager.dispatch(UIEventEnum.ExamBtnTips);
	}

	/**
	 * 登陆推送科举信息
	 * @param data SPushQuestionInfo
	 */
	private onPushQuestionInfo(data: any): void{
		if(data.lastChampionName_S != ""){
			CacheManager.exam.lastChampion = data.lastChampionName_S;
		}else{
			CacheManager.exam.lastChampion = "虚位以待";
		}
	}

	

	/**打开结算界面 */
	private openResultWindow(data: any): void{
		if(!this.resultWindow){
			this.resultWindow = new ExamResultWindow();
		}
		this.resultWindow.show(data);
	}

	/**打开科举答题排行榜界面 */
	private openExamRankWindow(): void{
		if(!this.rankWindow){
			this.rankWindow = new ExamRankWindow();
		}
		this.rankWindow.show();
	}

}