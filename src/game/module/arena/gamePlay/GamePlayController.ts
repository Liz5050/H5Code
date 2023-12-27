class GamePlayController extends BaseController {

	private expResult:WindowExpPositionResult;
	private campBattleResult:WindowCampBattleResult;
	private campExchangeView:ExchangeCampView;

	private gamePlay:GamePlayWindow;
	public constructor() {
		super(ModuleEnum.GamePlay);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): any {
		this.gamePlay = new GamePlayWindow(ModuleEnum.GamePlay);
        return this.gamePlay;
    }

	protected addListenerOnInit():void {
		//阵地争夺
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionOpen],this.onOpenInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionClose],this.onExpPositionClose,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionOccupy],this.onOccupyInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionInfo],this.onSelfInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionReward],this.onResultRewardUpdate,this);
		//跨服阵地争夺
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossCopyOpen],this.onOpenInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossCopyClose],this.onExpPositionClose,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPositionRankList],this.onExpRankListUpdate,this);
		
		//阵营战 血战五洲
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichOpen],this.onCampBattleOpen,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichClose],this.onCampBattleClose,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichInfo],this.onCampBattleInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichScoreList],this.onCampBattleScoreListUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichUpdate],this.onCampBattleUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichRankReward],this.onCampBattleResult,this);
		//跨服血战五洲
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichCrossOpen],this.onCrossCampBattleOpen,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBattleBichCrossClose],this.onCampBattleClose,this);

		this.addListen0(LocalEventEnum.EnterGamePlay,this.onEnterHandler,this);
		this.addListen0(LocalEventEnum.GamePlayWindowOpen,this.onOpenGamePlay,this);
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		EventManager.dispatch(LocalEventEnum.HideActivityWarTips);
    }

	/***************************阵地争夺********************************* */
	/**
	 * 阵地争夺开启
	 */
	private onOpenInfoUpdate(data:any):void {
		CacheManager.posOccupy.updateOpenInfo(data);
	}

	/**
	 * 阵地争夺关闭
	 */
	private onExpPositionClose():void {
		CacheManager.posOccupy.updateOpenInfo(null);
	}

	/**
	 * 占领信息更新
	 * SPositionOccupyInfo
	 */
	private onOccupyInfoUpdate(data:any):void {
		CacheManager.posOccupy.updateOccupyInfos(data.occupyInfos.data);
		EventManager.dispatch(NetEventEnum.PositionOccupyInfosUpdate);
	}

	/**
	 * 阵地争夺个人信息更新
	 * SPositionInfo
	 */
	private onSelfInfoUpdate(data:any):void {
		CacheManager.posOccupy.updateSelfOccupyInfo(data);
		EventManager.dispatch(NetEventEnum.MyOccupyInfoUpdate);
	}

	/**
	 * 结算奖励更新
	 * SPositionRewardInfo
	 */
	private onResultRewardUpdate(data:any):void {
		if(!this.expResult) {
			this.expResult = new WindowExpPositionResult();
		}
		this.expResult.show(data.ranks.data);
	}

	/**
	 * 阵地争夺排行榜更新
	 * SPositionRewardInfo
	 */
	private onExpRankListUpdate(data:any):void {
		CacheManager.posOccupy.updateRankInfos(data);
	}

	private onEnterHandler(type:EActiveType):void {
		switch(type) {
			case EActiveType.EActiveTypePosition:
				this.onEnterOccupyHandler();
				break;
			case EActiveType.EActiveTypeWorlBoss:
				EventManager.dispatch(LocalEventEnum.TimeLimitBossEnter);
				break;
			case EActiveType.EActiveTypeBattleBich:
				this.onEnterCampBattle();
				break;
			case EActiveType.EActiveTypeQuestion:
				this.onEnterExam();
				break;
			case EActiveType.EActiveTypeCrossStair:
				this.onEnterCrossStair();
				break;
			case EActiveType.EActiveTypeMgGuildDefense:
				this.onEnterGuildDefend();
				break;
		}
	}

	private onOpenGamePlay(gamePlayCfg:any):void {
		if(gamePlayCfg.activeType == EActiveType.EActiveTypeWorlBoss) {
			EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.TimeLimitBoss);
		}
		else if(gamePlayCfg.activeType == EActiveType.EActiveTypeQuestion) {
			this.onEnterExam();
		}
		else {
			// if(!this.gamePlay) {
			// 	this.gamePlay = new GamePlayWindow();
			// }
			// this.gamePlay.show(gamePlayCfg);
			if (UIManager.isShow(ModuleEnum.Train)) {
				EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Train);
			}
			this.show(gamePlayCfg);
		}
	}

	private onEnterGuildDefend():void{
		let leftOpenTime:number = CacheManager.guildDefend.leftOpenTime;
		if(leftOpenTime > 0) {
			Tip.showRollTip("距活动开启还剩：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(leftOpenTime,DateUtils.FORMAT_4,true),Color.Green2));
			return;
		}
		if(!CacheManager.guildNew.isJoinedGuild()){
			Tip.showRollTip(LangGuildNew.L12);
			return;
		}
		ProxyManager.gamePlay.enterGuildDefend();
		
	}

	/**请求进入阵地争夺 */
	private onEnterOccupyHandler():void {
		if(!CacheManager.posOccupy.showIcon) {
			Tip.showRollTip("活动暂未开启");
			return;
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.TimeLimitBoss])) {
			return;
		}
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		let leftOpenTime:number = CacheManager.posOccupy.leftOpenTime;
		if(leftOpenTime > 0) {
			Tip.showRollTip("距活动开启还剩：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(leftOpenTime,DateUtils.FORMAT_4,true),Color.Green2));
			return;
		}
		let copyCode:number = CacheManager.posOccupy.copyCode;
		if(!copyCode) {
			copyCode = CopyEnum.CopyPositionExp;
		}
		ProxyManager.gamePlay.enterExpPosOccupy(copyCode);
	}

	//*******************************血战五洲******************************/
	/**
	 * 阵营战开启
	 */
	private onCampBattleOpen(data:any):void {
		CacheManager.campBattle.updateOpenInfo(data);
	}

	/**
	 * 跨服血战五洲开启
	 */
	private onCrossCampBattleOpen(data:any):void {
		CacheManager.campBattle.isCross = true;
		this.onCampBattleOpen(data);
	}

	/**
	 * 阵营战活动关闭
	 */
	private onCampBattleClose():void {
		CacheManager.campBattle.isCross = false;
		CacheManager.campBattle.updateOpenInfo(null);
	}

	/**
	 * 阵营战信息更新
	 * SBattleBichInfo
	 */
	private onCampBattleInfoUpdate(data:any):void {
		CacheManager.campBattle.updateHadGetList(data.hadGetList.data_I);
	}

	/**
	 * 阵营战积分列表推送
	 * SBattleBichScoreList
	 */
	private onCampBattleScoreListUpdate(data:any):void {
		CacheManager.campBattle.updateScoreList(data);
	}

	/**
	 * 阵营战更新
	 * SBattleBichUpdate
	 */
	private onCampBattleUpdate(data:any):void {
		let value:number = data.value_I;
		let valueStr:string = data.valueStr_S;
		switch(data.updateType) {
			case EBattleBichUpdate.EUpdateTypeKillBoss:
				Tip.showRollTip("杀怪获得积分+" + HtmlUtil.html("" + value,Color.Green2));
				break;
			case EBattleBichUpdate.EUpdateTypeKillPlayer:
				Tip.showRollTip("成功击杀" + HtmlUtil.html(valueStr,Color.Green2) + "，积分+" + HtmlUtil.html("" + value,Color.Green2));
				CacheManager.campBattle.updateMyScore(value);
				CacheManager.copy.combo ++;
				break;
			case EBattleBichUpdate.EUpdateTypeAssist:
				Tip.showRollTip("助攻击杀" + HtmlUtil.html(valueStr,Color.Green2) + "，积分+" + HtmlUtil.html("" + value,Color.Green2));
				CacheManager.campBattle.updateMyScore(value);
				break;
			case EBattleBichUpdate.EUpdateTypeBeKill:
				Tip.showRollTip("被" + HtmlUtil.html(valueStr,Color.Green2) + "击杀，积分+" + HtmlUtil.html("" + value,Color.Green2));
				CacheManager.campBattle.updateMyScore(value);
				CacheManager.copy.combo = 0;
				break;
			case EBattleBichUpdate.EUpdateTypeParticipant:
				Tip.showRollTip("获得持续参与奖，积分+" + HtmlUtil.html("" + value,Color.Green2));
				CacheManager.campBattle.updateMyScore(value);
				break;
			case EBattleBichUpdate.EUpdateTypeGetReward:
				Tip.showRollTip("领取成功，获得" + value + valueStr);
				break;
			case EBattleBichUpdate.EUpdateTypeAddBuff:
				Tip.showRollTip(HtmlUtil.html("获得逆袭BUFF，全属性+" + value + "%" + valueStr,Color.Red));
				break;
			case EBattleBichUpdate.EUpdateTypeStopAttack:
				CacheManager.king.stopKingEntity(true);
				CacheManager.map.clearFightPlayers();
				CacheManager.map.clearMurdererIds();
				this.showCampExchangeView();
				CacheManager.battle.isNearAttack = false;
				break;
			case EBattleBichUpdate.EUpdateTypeRefreshForce:
				// Tip.showRollTip("阵营已更新:" + value + "-" + valueStr);
				break;
		}
	}

	/**
	 * 阵营战结算
	 */
	private onCampBattleResult(data:any):void {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)) {
			CacheManager.king.stopKingEntity(true);
			CacheManager.map.clearFightPlayers();
		}
		if(!this.campBattleResult) {
			this.campBattleResult = new WindowCampBattleResult();
		}
		this.campBattleResult.show(data);
	}

	private onEnterCampBattle():void {
		if(!CacheManager.campBattle.showIcon) {
			Tip.showRollTip("活动暂未开启");
			return;
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.CampBattle])) {
			return;
		}
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		let leftOpenTime:number = CacheManager.campBattle.leftOpenTime;
		if(leftOpenTime > 0) {
			Tip.showRollTip("距活动开启还剩：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(leftOpenTime,DateUtils.FORMAT_4,true),Color.Green2));
			return;
		}
		ProxyManager.gamePlay.enterCampBattle();
	}

	private onEnterCrossStair():void {
		if(!CacheManager.crossStair.showIcon) {
			Tip.showRollTip("活动暂未开启");
			return;
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.CrossStair])) {
			return;
		}
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		let leftOpenTime:number = CacheManager.crossStair.leftOpenTime;
		if(leftOpenTime > 0) {
			Tip.showRollTip("距活动开启还剩：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(leftOpenTime,DateUtils.FORMAT_4,true),Color.Green2));
			return;
		}
		ProxyManager.gamePlay.enterCrossStair();
	}

	private showCampExchangeView():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)) {
			return;
		}
		if(!this.campExchangeView) {
			this.campExchangeView = new ExchangeCampView();
		}
		this.campExchangeView.show();
		Log.trace(Log.UI,"显示阵营交换提示");
	}

	private onEnterExam(): void{
		EventManager.dispatch(UIEventEnum.ExamEnter);
	}
}