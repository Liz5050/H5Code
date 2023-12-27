class CopyHallController extends BaseController {
	//private _copySweepWin: CopySweepWindow;
	private _mergeWin:CopyHallMergeWindow;
	private _addTimeWin:CopyAddTimeWindow;
	private _expReceiveWin:CopyHallExpReceiveWin;
	private copyHall: CopyHallModule;
	private _rankWin:TowerRankWindow;
	private _getRewardWin:CopyTowerDayRewardWin;
	private _dlgWin:CopyDefendDlgWin;
	/**是否第一弹 */
	private _isExpFirst:boolean=true;
	/**本次领取经验的提示框是否弹过 */
	private _isExpShow:boolean = false;
    private strategyWin: CopyLegendStrategyWindow;

	public constructor() {
		super(ModuleEnum.CopyHall);
	}

	public initView(): BaseGUIView {
		if (!this.copyHall) {
			this.copyHall = new CopyHallModule();
		}
		return this.copyHall;

	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameStartDelegateNew], this.onDelegate, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRuneCopyReward], this.onRuneCopyReward, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRuneCopyRewardForShow], this.onRuneCopyRewardForOpen, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetRuneCopyReward], this.onGetRuneCopyInfo, this);		
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewExperienceGetExp], this.onNewExpCopyGetExp, this); //提示经验副本有经验还没领取  SNewExperienceCopyInfo 

		this.addListen0(LocalEventEnum.CopyDelegate, this.onReqDelegateCopy, this);
		this.addListen0(NetEventEnum.copyInfUpdate, this.onCopyInf, this);
		this.addListen0(LocalEventEnum.copyShowExpReward, this.showReceiveWin, this);
		this.addListen0(LocalEventEnum.copyHideExpReward, this.hideReceiveWin, this);
		this.addListen0(UIEventEnum.CopyReqReceiveExpCopy, this.onReqReceiveExpCopy, this);			
		this.addListen0(LocalEventEnum.CopyGetTowerDayReward, this.onGetTowerDayReward, this);
		this.addListen0(LocalEventEnum.CopyGetTowerDayRewardForOpen, this.onGetTowerDayRewardForOpen, this);
		this.addListen0(UIEventEnum.CopyLegendStrategedOpen, this.onLegendStrategyOpen, this);

		this.addListen1(LocalEventEnum.MonthCardInfoUpdate, this.onMonthCardUpdate, this);//月卡更新
	}


	public addListenerOnShow(): void {
		this.addListen1(UIEventEnum.CopyAddTime, this.onAddCopyTime, this);
		this.addListen1(UIEventEnum.CopyExpClearCd, this.onClearCopyCd, this);
		this.addListen1(UIEventEnum.CopyEnterModle, this.onEnterCopyModel, this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.onPosTypeBagChange, this);
		this.addListen1(NetEventEnum.copyTowerLotteryInfo, this.onTowerLotteryInfo, this);
		this.addListen1(LocalEventEnum.GetRankInfoUpdate, this.onRankInfoUpdate, this);
		this.addListen1(LocalEventEnum.CopyDefendDlg, this.onDlgDefend, this);
		this.addListen1(NetEventEnum.packPosTypePropChange,this.onPackChangeHandler,this);
		App.TimerManager.doTimer(1000, 0, this.onTimerRun, this);		
		this.onTimerRun();
		EventManager.dispatch(LocalEventEnum.HideBossRefreshTips);
	}

	public afterModuleHide(): void {
		App.TimerManager.remove(this.onTimerRun, this);		
	}
	/**
	 * 扫荡返回
	 * S2C_SStartDelegateNew
	 */
	private onDelegate(data: any): void {
		EventManager.dispatch(NetEventEnum.copyDelegateResult,data); 		
			
	}
	private onReqReceiveExpCopy(multiple:number):void{
		ProxyManager.copy.getExpCopyReward(multiple);
		
	}
	
	/**
	 * 有收到这个消息表示可领取
	 */
	private onGetRuneCopyInfo():void{
		CacheManager.copy.setRuneTowerRewardStatus(true);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.CopyHall,CacheManager.copy.checkTips());
	}

	private onRuneCopyRewardForOpen(data:any):void{
		this.updateTower(data);
	}

	/**
	 * 诛仙塔每日奖励返回
	 * SSeqReward
	 */
	private onRuneCopyReward(data:any):void{
		CacheManager.copy.setRuneTowerRewardStatus(false);
		this.updateTower(data);
		if(this.isShow){
			this.copyHall.updateTowerReward();
			this.copyHall.checkTowerTips();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.CopyHall,CacheManager.copy.checkTips());
	}

	private updateTower(data:any):void{
		if(this.isShow){
			this.copyHall.updateTowerReward();
			this.copyHall.checkTowerTips();
		}
		if(data && data.rewards && data.rewards.data.length > 0){
			if(!this._getRewardWin){
				this._getRewardWin = new CopyTowerDayRewardWin();
			}
			if(this._getRewardWin.isShow){
				this._getRewardWin.updateAll(data);
			}else{
				this._getRewardWin.show(data);
			}	
			
		}else{
			Tip.showLeftTip(LangCopyHall.L23);
		}	
		
	}

	/**
	 * 有领取提醒
	 * SNewExperienceCopyInfo 
	 * 如果返回 killBossNum_I 和 createPlayerLevel_I 都是0 表示领取经验了
	 */
	private onNewExpCopyGetExp(data:any):void{
		//界面显示 肯定是用这个
		CacheManager.copy.newExpCopyInf = data;
		if(this.isShow){
			this.copyHall.updateAll();
		}
		if(!this._isExpFirst && data.killBossNum_I>0 && !this._isExpShow){
			this._isExpShow = true;
			this.showReceiveWin();			
		}else{
			//初次登录	
			this._isExpFirst = false;
			if(data.killBossNum_I>0){ //初次登录有未领取的 表示弹过 防止重连再弹
				this._isExpShow = true;
			}
		}		
		if(data.killBossNum_I==0){
			this._isExpShow = false;
		}
	}
	private hideReceiveWin():void{
		if(this._expReceiveWin && this._expReceiveWin.isShow){
			this._expReceiveWin.hide();
		}
	}
	private showReceiveWin():void{
		if(!this._expReceiveWin){
			this._expReceiveWin = new CopyHallExpReceiveWin();
		}
		this._expReceiveWin.show();//CacheManager.copy.newExpCopyInf
	}
	private onPosTypeBagChange():void{
		// if(this._copySweepWin && this._copySweepWin.isShow){
		// 	this._copySweepWin.updateItemCount();
		// }
	}

	private onTowerLotteryInfo():void{
		this.copyHall.updateTowerTips();
	}

	/**请求获取诛仙塔每日奖励 */
	private onGetTowerDayReward():void{
		ProxyManager.copy.getTowerReward();
	}

	private onGetTowerDayRewardForOpen():void{
		ProxyManager.copy.getTowerRewardOpen();
	}

	private onMonthCardUpdate(): void{
		if(this.isShow){
			this.copyHall.updateDailyPanel();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.CopyHall,CacheManager.copy.checkTips());
	}

	/**背包道具改变 */
	private onPackChangeHandler():void {
		if(this.copyHall && this.copyHall.isShow) {
			this.copyHall.updateExpTickets();
		}
	}

	private onDlgDefend():void{
		if(!this._dlgWin){
			this._dlgWin = new CopyDefendDlgWin();
		}
		this._dlgWin.show();
	}

	private onRankInfoUpdate(data:any[]):void{
		if(this.isShow){
			this.copyHall.updateRank(data);
		}
		if(CacheManager.copy.isLookupTowerRank){
			CacheManager.copy.isLookupTowerRank = false;
			if(!this._rankWin){
				this._rankWin = new TowerRankWindow();
			}
			this._rankWin.show(data);
		}
	}
	private onReqDelegateCopy(copyCode: number,key1: number, isAsk: boolean): void {
		
		this.onSweepAlerClose(copyCode,key1);
	}

	private onSweepAlerClose(copyCode: number, key1: number): void {
		//2018年5月30日10:17:40  扫荡现在完全改成材料副本的扫荡 逻辑完全不一样		
		if(CopyUtils.isCanDelegate(copyCode,true,true)){ //CacheManager.copy.isCanDelegate(copyCode)
			ProxyManager.copy.delegate(copyCode, key1);
			
			/*
			if (!CacheManager.copy.isEnterNumOk(copyCode)){
				Tip.showTip(LangCopyHall.L_ENTER_NUM);
			}else if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,ConfigManager.mgDelegate.getCostGold(copyCode))){
				
				//EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CopyHall);
			}
			*/

		}
				
	}
	/**增加副本次数 */
	private onAddCopyTime(data:any): void {
		if(!this._addTimeWin){
			this._addTimeWin = new CopyAddTimeWindow();
		}
		this._addTimeWin.show(data);
		//this._addTimeWin.updateAll();
	}
	/**
	 * 清除九幽副本的cd时间
	 */
	private onClearCopyCd(): void {
		//var copyInf:any = ConfigManager.copy.getByPk(CopyEnum.CopyExp);
		var nStr:string = HtmlUtil.html("100元宝",Color.Red); 
		var msg:string = `副本冷却中，需要使用${nStr}清除冷却时间吗？`+HtmlUtil.brText;
		msg+=HtmlUtil.html("（优先使用绑元）",Color.Green);
		Alert.info(msg,()=>{
			ProxyManager.copy.resetExpCopyCd();
		},this);
		
		
	}
	/**
	 *  请求进入组队副本的模式
	 */
	private onEnterCopyModel(model: number, code: number): void {
		switch (model) {
			case CopyEnum.ENTER_MODEL_AUTO:
				break;
			case CopyEnum.ENTER_MODEL_SINGLE: //现在只做单人模式的处理							
				EventManager.dispatch(LocalEventEnum.CopyReqEnter,code);
				break;
			case CopyEnum.ENTER_MODEL_TEAM:
				break;
		}
		this.hide();
	}
	/**计时器 */
	protected onTimerRun(): void {
		var isExpCd:boolean = CacheManager.copy.isCopyInCd(CopyEnum.CopyExp);
		if(isExpCd){
			//this.copyHall.expPanel.onTimeRun();
		}
	}
	/**
	 * 副本信息
	 * SDictPlayerCopy
	 */
	protected onCopyInf(): void {
		if (this.copyHall && this.copyHall.isShow) {
			this.copyHall.updateAll();
		}
	}

    private onLegendStrategyOpen(copyCode:number) {
		if (!this.strategyWin) {
			this.strategyWin = new CopyLegendStrategyWindow();
		}
		this.strategyWin.show(copyCode);
    }
}