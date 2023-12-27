/**
 * 副本基础控制器
 * 
 */
class CopyController extends BaseController {
	/**当前副本类型 */
	public currentType: number = -1;	
	protected copyMudule: BaseCopyPanel;
	protected resultWinDict: Object;
	protected resultWin: BaseWindow;
	protected legendResultWin: CopyLegendResult;
	protected contestResultWin: CopyContestResult;
	protected qcResultWin:WindowQCCopyResult;
	protected crossTeamResultWin:WindowCrossTeamResult;
	protected copyInf: any;
	/**离开副本倒计时 */
	protected leaveEndTime: number = 0;

	private _inspriteWin: CopyInspireWindow;
	private _useExpWin: CopyUseExpItemWindow;
	private _callBossWin: DefendCallBossWin;

	//连斩
	private comboView:ComboView;
	private diceReward:BossDicePanel;//护盾礼包
	private hurtListView:CopyHurtListView;//副本伤害排名
	
	private _starEstimate: CopyEstimate;
	// private _isRePassInto: boolean;
	/**星级改变 需要做动画了 */
	private _isStarFly: boolean = false;
	/**是否播放了动画 */
	private _isStarFlyFlag: boolean;
	private _curReqCopyCode: number = 0;
	private _isInitCopyInf: boolean;
	private _timerHandler:number = 0;
	private guildDfCopy:GuildDefendCopyController;
	private _waveTip:CopyBossWaveTip;
	private _sceneMask:SceneMaskEffect;

	private _assitView:CopyAssitView;

	public constructor() {
		super(ModuleEnum.Copy);
		CopyManager.instance.init();
		this.viewIndex = ViewIndex.Zero;
		
	}

	public initView(): BaseCopyPanel {
		this.copyMudule = CopyManager.instance.getPanel(this.currentType, this.copyInf.code);
		if (!this.copyMudule) {
			var cls: any = CopyManager.instance.getCls(this.currentType, this.copyInf.code);
			if (!cls) {
				cls = CommonCopyPanel;
			}
			this.copyMudule = new cls(this.copyInf);
			CopyManager.instance.regPanel(this.currentType, this.copyInf.code, this.copyMudule); //防止重复进入同一个副本不断创建			
		}
		this.guildDfCopy.setModule(this.copyMudule);
		return this.copyMudule;
	}

	public addListenerOnInit(): void {		
		this.guildDfCopy = new GuildDefendCopyController();
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyPassPlayerIntoCopy], this.onPassIntoCopy, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyRePassPlayerIntoCopy], this.onPassIntoCopyLogin, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyLeftCopy], this.onLeftCopy, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyShowReward], this.onCopyResult, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyInfo], this.onCopyInfo, this); //副本信息
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyMsg], this.onCopyMsg, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyKillBossNumDetail], this.onCopyKillBossNumDetail, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewExperienceCopyInfo], this.onNewExpCopyInfo, this); //副本内信息更新 SNewExperienceCopyInfo 
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicSecretGiftInfo], this.onSecretGiftInfo, this); 
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyHurtRank],this.onHurtRankUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyUpdatePlayerHurt],this.onMyHurtUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgDefenseCopyInfo],this.onDefenseCopyInfo,this);

		this.addListen0(LocalEventEnum.CopyReqExit, this.reqExitCopy, this);
		this.addListen0(LocalEventEnum.CopyReqEnter, this.reqEnterCopy, this);
		this.addListen0(LocalEventEnum.copyReqAssit, this.reqAssit, this);
		this.addListen0(LocalEventEnum.BossReqEnterPersonalBoss,this.reqEnterPersonalBoss, this);
		this.addListen0(LocalEventEnum.BossRouteToBossGrid, this.onRouteToBoss, this);		
		this.addListen0(NetEventEnum.copyDelegateResult, this.onDelegateResult, this);		
		this.addListen0(LocalEventEnum.AddCopyEnterNum,this.onAddCopyNumHandler,this);
		this.addListen0(LocalEventEnum.ShowGetExpEffect, this.onShowGetExpEffect, this);
		this.addListen0(LocalEventEnum.BossReqSecretRoundDice, this.onSecretBossReqRoundDice, this);
		this.addListen0(LocalEventEnum.RefreshCopyCDTime,this.onRefreshCopyCDTime,this);
		this.addListen0(NetEventEnum.copySuccess, this.onCopySuccess, this);
		this.addListen0(NetEventEnum.copyFail, this.onCopyFail, this);
		this.addListen0(NetEventEnum.TimeLimitBossBuffUpdate,this.onTimelimitBossBuffUpdate,this);
		this.addListen0(LocalEventEnum.CloseCopyView,this.onLeftCopy,this);
		this.addListen0(LocalEventEnum.ComboViewUpdate,this.onComboUpdate,this);
		this.addListen0(LocalEventEnum.SceneShowMaskEffect,this.onShowMaskEffect,this);
		this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneUpdateHandler,this);
		this.addListen0(LocalEventEnum.AIPickUpComplete,this.onAIPickUpComplete,this);
        //1VN
        this.addListen0(NetEventEnum.ContestResult,this.onContestResult,this);//1VN挑战结果
	}

	public addListenerOnShow(): void {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){
			this.guildDfCopy.addListenerOnShow();
		}		
		this.addListen1(UIEventEnum.ModuleOpened, this.viewOpenedHandler, this);
        this.addListen1(UIEventEnum.ModuleClosed, this.viewCloseddHandler, this);

		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgExperienceCopyInfo], this.onExpCopyInf, this); //九幽魔窟 经验副本信息
		this.addListen1(NetEventEnum.copyProcess, this.onCopyProcess, this);
		this.addListen1(UIEventEnum.CopyClickBuff, this.onReqBuff, this);
		this.addListen1(UIEventEnum.CopyInspire, this.onReqInspire, this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.onPackItemUpdate, this);
		// this.addListen1(NetEventEnum.entityInfoMyselfUpdate, this.onMainPlyerCreate, this);
		// this.addListen1(NetEventEnum.BossInfUpdate, this.onBossInfUpdate, this);
		this.addListen1(NetEventEnum.EntityLifeUpdate,this.onEntityLifeUpdate,this);
		this.addListen1(NetEventEnum.BossOwnerChange,this.onBossOwnerChange,this);
		this.addListen1(NetEventEnum.BossRewardResult,this.onBossCopyResult,this);
		// this.addListen1(NetEventEnum.SocketClose,this.onSocketClostHandler,this);
		this.addListen1(NetEventEnum.BossHurtListUpdate,this.onHurtListUpdate,this);
		this.addListen1(NetEventEnum.TimelimitBossUpate,this.onTimelimitBossUpdate,this);
		this.addListen1(NetEventEnum.PositionOccupyInfosUpdate,this.onOccupyInfosUpdate,this);
		this.addListen1(NetEventEnum.MyOccupyInfoUpdate,this.onSelfOccupyInfoUpdate,this);
		this.addListen1(NetEventEnum.copyDfSkillCDUpd,this.onDfCopyCdUpdate,this);
		
		//阵营战
		this.addListen1(NetEventEnum.CampBattleScoreListUpdate,this.onScoreListUpdate,this);
		this.addListen1(NetEventEnum.CampBattleScoreRewardUpdate,this.onScoreRewardUpdate,this);

		//仙盟争霸
		this.addListen1(NetEventEnum.GuildScoreRankUpdate,this.onGuildScoreRankUpdate,this);//仙盟积分排名更新
		this.addListen1(NetEventEnum.GuildBattleScoreRewardUpdate,this.onGuildBattleScoreRewardUpdate,this);
		this.addListen1(NetEventEnum.MyGuildScoreUpdate,this.onMyGuildScoreUpdate,this);//自己仙盟积分更新
		this.addListen1(NetEventEnum.GuildBattleMyScoreUpdate,this.onMyScoreUpdate,this);//自己积分更新
		this.addListen1(NetEventEnum.GuildBattleScoreUpdate,this.onMyBattleScoreUpdate,this);//自己战功更新
		this.addListen1(NetEventEnum.GuildBattleCollectInfoUpdate,this.onCollectInfoUpdate,this);//采集信息更新
		this.addListen1(NetEventEnum.GuildBattleCollectShieldUpdate,this.onCollectShieldUpdate,this);//采集护盾更新
		this.addListen1(NetEventEnum.GuildBattleMemberPositionUpdate,this.onMemberInfoUpdate,this);//成员更新
		this.addListen1(NetEventEnum.RoleBuffUpdate,this.onRoleBuffUpdate,this);//buff更新
		this.addListen1(NetEventEnum.roleLifeUpdate,this.onRoleLife,this);//生命更新

		// this.addListen1(LocalEventEnum.BattleObjChange,this.onBattleObjChange,this);
		// this.addListen1(LocalEventEnum.OtherPlayerDied,this.onOtherPlayerDiedHandler,this);
		// this.addListen1(LocalEventEnum.BossSecretHideDice,this.onHideDicePanel,this);
		this.addListen1(LocalEventEnum.BossSecretHideLeave,this.onHideSecretLeavePanel,this);
		this.addListen1(LocalEventEnum.CopyShowCallBoss,this.onShowCallBoss,this);
		

		//App.TimerManager.doTimer(1000, 0, this.onTimerRun, this);
		this._timerHandler = egret.setInterval(this.onTimerRun,this,1000);
	}

	private viewOpenedHandler(key: number, viewIndex: number):void {
		if (viewIndex == ViewIndex.One && key != ModuleEnum.TaskDialog && key != ModuleEnum.Chat && key != ModuleEnum.Friend) {
            this.copyMudule.visible = false;
        }
	}

	private viewCloseddHandler(key: number, viewIndex: number): void {
        if (viewIndex == ViewIndex.One) {
            if (!UIManager.isOpenOneIndexView()) {
                this.copyMudule.visible = true;
            }
        }
	}

	protected afterModuleShow(): void {
		super.afterModuleShow();
		this.copyMudule.visible = true;//刚进入副本重设下visible为true，防止onShow中的监听未触发visible = true
		this.copyMudule.setCdTime("00:00");
		this.copyMudule.extendPanel(true);
		this.copyMudule.update(this.copyInf); //该函数会自动执行 updateAll 刷新静态显示内容		
		this.onTimerRun();
		/*
		var starInf: any = ConfigManager.copyStar.getByPk(CacheManager.copy.curCopyCode);
		if (starInf) {
			this._isStarFly = true;
			this.copyMudule.showCdView(false);
		}
		*/
		let idx:number = 3;//CopyUtils.isInNotOptCopy()? 3:1;
		// if (CacheManager.copy.isInCopyByType(ECopyType.ECopyPunchLead)) {
		// 	idx = 2;
		// }
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) idx = 2;
		if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            EventManager.dispatch(LocalEventEnum.CopySwitchHomeStatu, idx);
        }
		//经验副本检测小鬼怪
		if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgExperience)) {
			EventManager.dispatch(LocalEventEnum.PackCheckSpiritExpEquip);
		}
	}

	public afterModuleHide(): void {
		//App.TimerManager.remove(this.onTimerRun, this);
		if(this._timerHandler>0){
			egret.clearInterval(this._timerHandler);
			this._timerHandler = 0;
		}

		this.copyInf = null;
		if(this.diceReward && this.diceReward.isShow) {
			this.diceReward.hide();
		}

		if(this.comboView && this.comboView.isShow) {
			this.comboView.hide();
		}
		CacheManager.copy.combo = 0;

		if(this.hurtListView && this.hurtListView.isShow) {
			this.hurtListView.hide();
		}	
	}
	
	private onDelegateResult(data:any):void{				
		if(CopyUtils.isDeleagteResult(data.copyCode)){
			this.showResultWin(true,true,data);
		}		
	}

	/**寻路到某个boss */
	protected onRouteToBoss(bossCode: number, mapId: number): void {

		var routeInf: any = ConfigManager.mgHookPropose.getByPk(mapId + "," + bossCode);
		var data: any = {
			"bossCode": bossCode, mapId: routeInf.mapId, x: routeInf.mapX,
			y: routeInf.mapY//, checkFn: this.checkBossHook, checkCaller: this
		};
		/*EventManager.dispatch(LocalEventEnum.AIStart, {
			"type": AIType.RouteBossHook,
			"data": data
		});*/
		EventManager.dispatch(LocalEventEnum.AutoStartFight, data);
	}
	
	private checkBossHook(bossCode: number): boolean {
		var isDeath: boolean = CacheManager.boss.isBossDeath(bossCode);
		var isTire: boolean = CacheManager.boss.isTire();
		return !isDeath && !isTire;
	}

	/**
	 * 主动退出副本
	 */
	protected reqExitCopy(isLeftTeam:boolean = false): void {
		if (CacheManager.copy.isInCopy) {
			ProxyManager.copy.leftCopy(isLeftTeam);
		}
	}

	private reqAssit(copyCode:number,mapId:number):void{
		if (CacheManager.copy.isInCopy) {
			ProxyManager.copy.reqCopyAssit(copyCode,mapId);
		}
	}

	/**
	 * 请求进入副本
	 */
	protected reqEnterCopy(code: number): void {
		if(!CopyUtils.isCanEnter(code))
		{
			return;
		}
		if (this._curReqCopyCode == 0) { //正在做动画 又重新请求进另外一个 不给进			
			if (CopyUtils.isScaleRoleCopy(code)) {
				this._curReqCopyCode = code;
				EventManager.dispatch(LocalEventEnum.RoleScaleHide, { call: this.roleHideComplete, caller: this, enterCopy: true });
			} else {
				if(code==CopyEnum.CopyForceWar){
					ProxyManager.copy.enterForceWar();
				}else{
					ProxyManager.copy.enterCopy(code);
				}				
				this._curReqCopyCode = 0;
			}
		}
	}

	/**请求增加副本次数 */
	private onAddCopyNumHandler(code:number):void {
		let copyCfg:any = ConfigManager.copy.getByPk(code);
		if(!copyCfg) {
			Log.trace(Log.SERR,"error copyCode: " + code);
			return;
		}
		let key:string = copyCfg.copyType + "," + CacheManager.vip.vipLevel;
		let addCfg:any = ConfigManager.copyAddNum.getByPk(key);
        if(addCfg.maxAddNum < 0) {
			Tip.showTip(LangCopyHall.L_VIP_NOT_BUY);
        }
        else if(MoneyUtil.checkEnough(addCfg.costUnit,addCfg.costNum)) {
            if(!CacheManager.copy.isAddNumLimit(code)) {
                ProxyManager.copy.addCopyNum(copyCfg.copyType);
            }
            else {
                Tip.showTip(LangCopyHall.L4);
            }					
        }
	}
	private onShowGetExpEffect(gp:egret.Point){
		if(this.copyMudule && this.copyMudule.isShow && this.copyMudule instanceof ExpCopyPanel){
			let p:ExpCopyPanel = <ExpCopyPanel>this.copyMudule;
			let toP:egret.Point = p.getRewardGPoint(0);
			CopyUtils.startExpEffect(gp, toP,1,800,0,10,LayerManager.UI_Tips,true);
			if(ConfigManager.expCopy.isHasLevelExp()){
				toP = p.getRewardGPoint(1);
				CopyUtils.startExpEffect(gp, toP,1,800,0,10,LayerManager.UI_Tips,true);
			}
			
		}		
	}

	/**
	 * 秘境boss请求摇色子
	 */
	private onSecretBossReqRoundDice():void{
		ProxyManager.copy.sendRoundDice();
	}

	/**
	 * 请求进入个人boss
	 */
	private reqEnterPersonalBoss(copyCode:number,bossId:number,useMoney:boolean=false):void{
		if(CopyUtils.isCanEnter(copyCode)){
			ProxyManager.copy.enterPersonalBoss(copyCode,bossId,useMoney);
			EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.Boss);
		}		
	}

	private onRefreshCopyCDTime():void {
		ProxyManager.copy.refreshCopyCDTime();
	}

	private roleHideComplete(): void {
		if (this._curReqCopyCode > 0) {
			ProxyManager.copy.enterCopy(this._curReqCopyCode);
			this._curReqCopyCode = 0;
		}
	}
	// protected onBossInfUpdate(): void {
	// 	if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossHome) && this.copyMudule && this.copyMudule.isShow) {
	// 		this.copyMudule.updateAll();
	// 	}
	// }

	/**boss掉落归属者实体属性更新 */
	private onEntityLifeUpdate(entity:RpgGameObject):void {
		if(!CacheManager.bossNew.hasOwner) return;
		if(entity.objType == RpgObjectType.MainPlayer || entity.objType == RpgObjectType.OtherPlayer) {
			let ownerId:any = CacheManager.bossNew.ownerInfo.entityId
			if(EntityUtil.isPlayerOther(ownerId,entity.entityInfo.entityId)) {
				if (CopyUtils.isOwnerCopy() && this.copyMudule && this.copyMudule.isShow) {
					(this.copyMudule as WorldBossCopyPanel).ownerEntityUpdate(entity);
				}
			}
        }
	}

	/**boss掉落归属改变 */
	private onBossOwnerChange():void {
		if (CopyUtils.isOwnerCopy() && this.copyMudule && this.copyMudule.isShow) {
			(this.copyMudule as WorldBossCopyPanel).updateOwnerInfo();
		}
	}
 
	/**个人boss 野外boss结算 */
	private onBossCopyResult(data:any):void{
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss) || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgDarkSecretBoss) ){
			let panel:WorldBossCopyPanel = this.copyMudule as WorldBossCopyPanel;
			if(panel){
				panel["showLeavePanel"](true,data);
			}
		}
	}

	// /**主角当前攻击对象改变 */
	// private onBattleObjChange():void {
	// 	if (CopyUtils.isOwnerCopy() && this.copyMudule && this.copyMudule.isShow) {
	// 		(this.copyMudule as WorldBossCopyPanel).updateBattleObj();
	// 	}

	// 	if(this.isGuildBattle()) {
	// 		(this.copyMudule as GuildBattleCopyView).updateBattleObj();
	// 	}
	// }

	/**收到服务器副本成功 */
	protected onCopySuccess(): void {
		//有配置延迟退出就用配置 否则用3秒		
		if(CopyUtils.isAutoLeaveCopy()){
			let delaySec: number = 0;
			if(this.copyInf) {
				if(this.copyInf.copyType == ECopyType.ECopyCheckPoint) {
					return;
				}	
				else {
					delaySec = this.copyInf.waitLeaveSec ? this.copyInf.waitLeaveSec : 0;
				}
			}
			if(delaySec>0){
				delaySec = delaySec * 1000
				this.leaveEndTime = egret.getTimer() + delaySec;
				this.onTimerRun();
				App.TimerManager.doDelay(delaySec, this.delayLeft, this);
			}			
		}
		
	}

	protected onCopyFail():void {
		if (this.currentType == ECopyType.ECopyEncounter) {
            let delaySec: number = 3000;
            App.TimerManager.doDelay(delaySec, this.delayLeft, this);
		}
	}

	protected delayLeft(): void {
		ProxyManager.copy.leftCopy();
	}

	/**
	 * 副本进度
	 */
	protected onCopyProcess(valueNum: number, valueStrNum: number): void {
		CacheManager.copy.copyProcessInf.valueNum = valueNum;
		CacheManager.copy.copyProcessInf.valueStrNum = valueStrNum;
		if (this.copyMudule && this.copyMudule.isShow) {
			this.copyMudule.updateAll();
		}
	}

	/**副本击杀信息 */
	protected onCopyKillBossNumDetail(data: any): void {
		CacheManager.copy.setKillBossDetail(data.intIntDict);
		if (this.isShow) {
			this.copyMudule.updateAll();
		}
	}

	/**
	 * 副本消息更新
	 * struct:SCopyMsgInfo
	 */
	protected onCopyMsg(data: any): void {
		var type: number = data.type; //消息类型
		switch (type) {
			case ECopyInfoType.ECopyInfoTypeRing: //副本环数     num1--当前环数 num2--下一环刷怪倒计时 num5--最大环数						
				CacheManager.copy.setRingInf(data);
				if(this.isShow){
					this.copyMudule.updateAll();
					if(CacheManager.copy.isRingTips() && CacheManager.copy.copyRingInf.curRing>0){
						if(this._waveTip&&this._waveTip.curRing==CacheManager.copy.copyRingInf.curRing){
							return;
						}
						if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense) && CacheManager.guildDefend.isInTravel()){
							return;
						}
						if(!this._waveTip){
							this._waveTip = new CopyBossWaveTip();
						}
						this._waveTip.show(CacheManager.copy.copyRingInf.curRing);
					}
				}				
				break;
			case ECopyInfoType.ECopyInfoTypeEnd: //副本结束时间				
				CacheManager.copy.copyEndTime = egret.getTimer() + data.num1_I * 1000;
				break;
		}

	}
	
	/**
	 * 副本内消息更新
	 * SNewExperienceCopyInfo
	 */
	private onNewExpCopyInfo(data:any):void{
		//只更新副本内的显示 
		if( this.isShow && CacheManager.copy.isInCopy && this.copyMudule && this.copyMudule instanceof ExpCopyPanel ){
			this.copyMudule.updateAll(data);			
		}
	}	

	/**
	 * 秘境boss显示护盾礼包
	 */
	private onSecretGiftInfo(data:any):void{
		Log.trace(Log.TEST," --------------- ******* 秘境boss显示护盾礼包 onSecretGiftInfo ",data)
		CacheManager.bossNew.setDiceInfo(data);		
		if(!this.diceReward) {
			this.diceReward = new BossDicePanel();
		}
		this.diceReward.show();
		// if(this.isShow && this.copyMudule instanceof WorldBossCopyPanel){
		// 	(this.copyMudule as SecretBossCopyView).showDicePanel(!isExpire);
		// }
	}

	// private onHideDicePanel():void{
	// 	if(this.copyMudule instanceof WorldBossCopyPanel){
	// 		(this.copyMudule as SecretBossCopyView).showDicePanel(false);
	// 	}
	// }
	private onHideSecretLeavePanel():void{
		if(this.copyMudule instanceof WorldBossCopyPanel){
			(this.copyMudule as SecretBossCopyView).showLeavePanel(false,null);
		}
	}
	
	/**显示召唤boss窗口 */
	private onShowCallBoss():void{
		if(!this._callBossWin){
			this._callBossWin =  new DefendCallBossWin();
		}
		this._callBossWin.show();
	}

	/**
	 * 九幽魔窟 副本信息下推
	 * SExperienceCopyInfo
	 */
	protected onExpCopyInf(data: any): void {
		var oldPre: number = 0;
		var isFirst: boolean = false;
		if (CacheManager.copy.expCopyInf) {
			oldPre = CacheManager.copy.expCopyInf.coinInspireNum_I + CacheManager.copy.expCopyInf.goldInspireNum_I;
		} else {
			isFirst = true;
		}
		CacheManager.copy.expCopyInf = data;
		var newPer: number = CacheManager.copy.expCopyInf.coinInspireNum_I + CacheManager.copy.expCopyInf.goldInspireNum_I;
		if (newPer > oldPre) {
			newPer *= 10;
			Tip.showTip(`你获得伤害鼓舞状态,伤害增加${newPer}%`);
		}
		this.updateExpCopyInf(isFirst);
		if (this._inspriteWin && this._inspriteWin.isShow) {
			this._inspriteWin.updateAll();
		}
	}

	// protected onMainPlyerCreate(): void {
	// 	if (this._isRePassInto) {
	// 		this._isRePassInto = false;
	// 		// EventManager.dispatch(LocalEventEnum.AutoStartFight);
	// 	}
	// }

	protected onPackItemUpdate(): void {
		if (this._useExpWin && this._useExpWin.isShow) {
			this._useExpWin.updateAll();
		}
	}

	protected onReqInspire(type: number): void {
		ProxyManager.copy.inspireInExpCopy(type);
	}

	/**
	 * 副本内操作 加buff
	 */
	private onReqBuff(BuffType: number): void {
		switch (BuffType) {
			case CopyEnum.BuffInspire:
				//弹出一个对话框 选择鼓舞类型 金币/元宝
				this.showInspriteWin(true);
				break;
			case CopyEnum.BuffExp:
				//弹出使用物品
				this.showUseExpWin(true);
				break;
		}
	}

	private showInspriteWin(show: boolean): void {
		if (!this._inspriteWin && show) {
			this._inspriteWin = new CopyInspireWindow();
		}
		if (this._inspriteWin) {
			show ? this._inspriteWin.show() : this._inspriteWin.hide();
		}

	}

	private showUseExpWin(show: boolean): void {
		if (!this._useExpWin && show) {
			this._useExpWin = new CopyUseExpItemWindow();
		}
		if (this._useExpWin) {
			show ? this._useExpWin.show() : this._useExpWin.hide();
		}
	}

	protected updateExpCopyInf(isFirst: boolean): void {
		if (this.isInExpCopy() && this.copyMudule.isShow) {
			this.copyMudule.updateAll();
			if (isFirst) {
				var buffStop: boolean = CacheManager.copy.expCopyInf.coinInspireNum_I > 0 || CacheManager.copy.expCopyInf.goldInspireNum_I > 0;
				var efficiencyStop: boolean = CacheManager.copy.expCopyInf.drupExpAdd_I > 0; // 
				this.copyMudule.stopInspireAni(buffStop, efficiencyStop);
			}
		}
	}

	protected isInExpCopy(): boolean {
		var b: boolean = (this.copyMudule && this.currentType == ECopyType.ECopyMgExperience);
		return b;
	}

	private autoFightFlag: boolean;
	/**计时器 */
	protected onTimerRun(): void {
		if (this.copyMudule && this.copyMudule.isShow) {
			var canShowEndTime: boolean = this.updateTimeTip();
			this.updateEndTime(canShowEndTime);
			this.copyMudule.onTimer();
		}
	}

	/**更新波数倒计时 副本开始倒计时的提示文本 */
	private updateTimeTip(): boolean {
		var nowms: number = egret.getTimer();
		var canShowEndTime: boolean;
		var canShowTipTime: boolean; //是否可以显示副本结束倒计时
		var curTxt: fairygui.GTextField;
		var leftSec: number = 0;
		if (CacheManager.copy.copyOpenLefTime > nowms) { //开启副本倒计时
			canShowEndTime = false;
			canShowTipTime = true;
			leftSec = CacheManager.copy.copyOpenLefTime - nowms;
			leftSec = Math.round(leftSec /= 1000);
			this.copyMudule.setTimeTipsText(leftSec+"",CopyEnum.TIME_TYPE3)
		} else if (this.leaveEndTime > nowms) { //离开副本倒计时
			canShowEndTime = false;
			canShowTipTime = true;
			leftSec = this.leaveEndTime - nowms;
			leftSec = Math.round(leftSec /= 1000);
			this.copyMudule.setTimeTipsText(leftSec+"",CopyEnum.TIME_TYPE1);
		} else if (CacheManager.copy.isShowRing()) { //更新波数倒计时 
			canShowEndTime = true;
			canShowTipTime = true;
			leftSec = CacheManager.copy.ringEndTime - nowms;
			leftSec = Math.round(leftSec /= 1000);
			leftSec = Math.max(leftSec,0);
			this.copyMudule.setTimeTipsText(leftSec + "",CopyEnum.TIME_TYPE2);

		} else {
			canShowEndTime = true;
		}
		if (canShowEndTime && this._isStarFly) {
			canShowEndTime = false;
			if (!this._isStarFlyFlag) {
				//this.flyStarEstimate();
			}
		}
		this.copyMudule.showTipsView(canShowTipTime);
		this.copyMudule.showCdView(canShowEndTime);
		return canShowEndTime;
	}

	/**更新副本结束倒计时 */
	private updateEndTime(canShowEndTime: boolean): void {
		if (canShowEndTime) { //副本倒计时				
			var nowms: number = egret.getTimer();
			if (!this.autoFightFlag) {
				this.autoFightFlag = true;
				/*if(CopyEnum.CopyLeader==CacheManager.copy.curCopyCode){
					App.TimerManager.doDelay(2500,()=>{
						EventManager.dispatch(LocalEventEnum.AutoStartFight);
					},this)
				}else if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){
					EventManager.dispatch(LocalEventEnum.AutoStartFight);
				}*/
			}
			var leftSec: number = CacheManager.copy.copyEndTime - nowms;
			leftSec = Math.round(leftSec /= 1000);
			if (leftSec >= 0) {
				var times: string = App.DateUtils.getFormatBySecond(leftSec, 6);
				this.copyMudule.setCdTime(times);
			}
			//this.checkCopyFlyStar();
		}

	}

	/**检查副本星级改变 进行飞行动画播放 */
	private checkCopyFlyStar(): void {
		if (!this._isStarFly && this._starEstimate && this._starEstimate.isShow) {
			var b: boolean = this._starEstimate.onTimer();
			if (b) {
				this._isStarFly = true;
				this._isStarFlyFlag = false;
				this.flyStarEstimate();
				this.copyMudule.showCdView(false);
			}
		}
	}

	private onCopyInfo(data: any): void {
		CacheManager.copy.setCopiesInf(data, this._isInitCopyInf);
		EventManager.dispatch(NetEventEnum.copyInfUpdate);		
		this._isInitCopyInf = true;
	}

	private onAIPickUpComplete():void{
		if(this.copyResultData){
			let isSuccess: boolean = this.copyResultData.isSuccess_B;
			this.showResultWin(isSuccess,false,this.copyResultData);
			this.copyResultData = null;
		}			
		
	}

	private onContestResult(data:any):void {
		this.showResultWin(data.bWin_B, false, data);
	}

	private copyResultData:any;
	/**
	 * 副本结算
	 * struct:SCopyShowReward
	 */
	protected onCopyResult(data: any): void {
		let isSuccess: boolean = data.isSuccess_B;		
		let copyCfg:any = ConfigManager.copy.getByPk(data.copyCode_I);
		if(copyCfg.copyType == ECopyType.ECopyCheckPoint) {
			if(isSuccess) {
				//关卡副本内胜利，不弹结算
				return;
			}
			else if(CacheManager.copy.isRePassInCopy) {
				//重登不显示失败结算
				CacheManager.copy.isRePassInCopy = false;
				return;
			}
		}
		CacheManager.copy.isRePassInCopy = false;

		if(this.copyMudule && this.copyMudule.isShow){ //这行代码必须执行
			this.copyMudule.setSceneUI();
		}

		// if(copyCfg.copyType == ECopyType.ECopyPunchLead) {
		// 	this.copyResultData = data;
		// 	return;
		// }
		if(isSuccess && CopyUtils.isDelayDropRetCopy(copyCfg.copyType)){//由捡完掉落完成触发结算
			this.copyResultData = data;
			return;
		}
		this.showResultWin(isSuccess,false,data);	
		if(!isSuccess) {
			var copyCode:number = data.copyCode_I;
			let copyInfo:any = ConfigManager.copy.getByPk(copyCode);
			var curType = copyInfo.copyType;
			if(curType == ECopyType.ECopyMgRune) {
				EventManager.dispatch(LocalEventEnum.CopyTowerDie);
			}
		}	
	}

	/**
	 * 显示结算界面
	 */
	private showResultWin(isSuccess:boolean,isDelagate:boolean,data:any):void{
		let copyCode:number = data.copyCode_I?data.copyCode_I:data.copyCode;
		if (!copyCode) copyCode = CacheManager.copy.curCopyCode;
		let copyCfg:any = ConfigManager.copy.getByPk(copyCode);
		if(copyCfg.copyType == ECopyType.ECopyMgKingStife) {
			//王者争霸结算不应该收到副本结算，有独立的结算协议
			Log.trace(Log.SERR,"收到王者争霸副本结算消息",isSuccess,data);
		}else if (copyCfg.copyType == ECopyType.ECopyEncounter||copyCfg.copyType == ECopyType.ECopyMgPeakArena) {
			// EventManager.dispatch(LocalEventEnum.EncounterResult, isSuccess);
		}
		else {
			if(copyCfg.copyType == ECopyType.ECopyGuildTeam)  {
				isSuccess = true;
				// if(!data.rewardItems.key_I.length && !data.rewardMoneys.key_I.length && !data.rewardPlayers.data.length) {
					// //没有获得任何奖励，不显示结算
					// EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildCopy,{tabType:PanelTabType.GuildTeam});
					// return;
				// }
			}
			this.resultWin = this.getResultWin(isSuccess, copyCfg.copyType);
			this.resultWin.show({data:data,isDelagate:isDelagate});
			if(copyCfg.copyType == ECopyType.ECopyCheckPoint) {
				//关卡boss副本,成功不会推送结算
				CacheManager.checkPoint.isAuto = false;
			}
		}
	}
	/**正常进入副本 */
	protected onPassIntoCopy(data: any): void {	
		Log.trace(Log.TEST,"ECmdPublicCopyPassPlayerIntoCopy onPassIntoCopy:",data);
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgRune)){
			this.autoFightFlag = false;
		}else{
			EventManager.dispatch(LocalEventEnum.AutoStopFight);
		}		
		this.onEnterCopy(data, true);
	}
	/**登录就在副本内 进入副本 */
	protected onPassIntoCopyLogin(data: any): void {
		CacheManager.copy.isRePassInCopy = true;
		this.onEnterCopy(data, false);
		// this._isRePassInto = true;
	}
	
	private onShowMaskEffect():void{
		this.showSceneMask();
	}

	private showSceneMask():void{
		let isFirst:boolean = false;
		if(!this._sceneMask){
			this._sceneMask = new SceneMaskEffect();
			isFirst = true;
		}
		if(!isFirst){ //第一次登陆切图不显示
			this._sceneMask.copyShow();
		}
		
	}

	/**
	 * 进入副本后返回
	 * struct:SCopyPassInto
	 */
	protected onEnterCopy(data: any, isPreTime: boolean): void {
		// if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyMgRune)){
		// 	ControllerManager.scene.sceneState = SceneStateEnum.Loading;
		// }

		CacheManager.copy.enterCopyTime = egret.getTimer();
		if(CacheManager.copy.isInCopy && this.isShow){ //在其他副本可以进另一个副本(目前就遭遇战有这个需求,其他副本在进之前限制 进之后就可以切 不管进的哪个)
			this.hide(); 
		}
		CacheManager.copy.curCopyCode = data.copyCode_I;
		this.copyInf = ConfigManager.copy.getByPk(data.copyCode_I);
		this.currentType = (this.copyInf.copyType ? this.copyInf.copyType : ECopyType.ECopyNormal);
		if(CopyUtils.isCheckPoint(this.currentType)){			
			//登陆就在副本中不发事件，关卡boss副本重登就算失败
			if(isPreTime) EventManager.dispatch(NetEventEnum.copyEnterCheckPoint);
		}else{
			//this.showSceneMask();
		}
		
		if (isPreTime) {
			CacheManager.copy.copyOpenLefTime = egret.getTimer() + this.copyInf.prepareTime * 1000;
			isNaN(CacheManager.copy.copyOpenLefTime) ? CacheManager.copy.copyOpenLefTime = 0 : null;
		}
		this.show(data);
		if(CacheManager.copy.isCloseAllOnEnterCopy) {
			UIManager.closeAll();
		}
		EventManager.dispatch(NetEventEnum.copyEnter);
		this.showAssitView(true);
	}

	protected onLeftCopy(): void {
		Log.trace(Log.UI,"关闭副本界面");		
		let lastCopyType:number = this.currentType;
		if(CopyUtils.isCheckPoint(lastCopyType)){
			CacheManager.copy.curCopyCode = 0;
			EventManager.dispatch(NetEventEnum.copyLeftCheckPoint);
			EventManager.dispatch(LocalEventEnum.PetTalk,PetTalkCondition.PassCheckPoint);
		}
		App.TimerManager.remove(this.delayLeft, this);
		EventManager.dispatch(LocalEventEnum.AutoStopFight);
		this.showUseExpWin(false);
		this.showInspriteWin(false);
		//后续进行一个次数判断 再执行下面回收panel的行
		//CopyManager.instance.unRegPanel(this.copyMudule.currentType);		
		this.hide();
		CacheManager.copy.updateHurtList(null);
		EventManager.dispatch(LocalEventEnum.CopySwitchHomeStatu, 0);
		// if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss)) {
		// 	CacheManager.role.isDropOwner = false;
		// 	EventManager.dispatch(NetEventEnum.roleDropOwner);
		// }
		CacheManager.copy.setDefendBuff(0,false);
		CacheManager.copy.setDefendScore(0,false);
		CacheManager.copy.curCopyCode = 0;
		CacheManager.copy.expCopyInf = null;
		CacheManager.copy.copyRingInf = null;
		CacheManager.copy.setKillBossDetail(null);
		CacheManager.guildDefend.truncate();
		this.leaveEndTime = 0;
		this._isStarFly = false;
		/*
		if (this._starEstimate) {
			egret.Tween.removeTweens(this._starEstimate);
			this._starEstimate.hide();
			this._starEstimate = null;
		}
		*/

		if (!CacheManager.copy.isActiveLeft) {//正常退出副本，标志重设
			CacheManager.task.gotoTaskFlag = true;
		}
		CacheManager.copy.isActiveLeft = false;
		EventManager.dispatch(NetEventEnum.copyLeft, lastCopyType);
		
		this.showAssitView(false);
		Log.trace(Log.UI,"关闭副本界面成功");
	}

	private showAssitView(isShow:boolean):void{
		if(isShow && CacheManager.copy.isInAssitCopy()){
			if(!this._assitView){
				this._assitView = new CopyAssitView();
			}
			this._assitView.show();
		}else if(this._assitView && this._assitView.isShow){
			this._assitView.hide();
		}
	}

	/**评星界面飞入效果 */
	protected flyStarEstimate(): void {
		if (!this._starEstimate) {
			this._starEstimate = new CopyEstimate();
		}
		this._isStarFlyFlag = true;
		this._starEstimate.x = fairygui.GRoot.inst.width;
		this._starEstimate.y = 304;
		this._starEstimate.show();
		this._starEstimate.updateAll();
		var tx: number = fairygui.GRoot.inst.width - this._starEstimate.width >> 1;
		egret.Tween.removeTweens(this._starEstimate);
		var t: egret.Tween = egret.Tween.get(this._starEstimate);
		var dur: number = 250;
		t.to({ x: tx }, dur);
		t.wait(3000);
		t.to({ x: 0 }, dur);
		t.wait(1000);
		t.call(() => {
			this._isStarFly = false;
			this._isStarFlyFlag = false;
		}, this);

	}

	protected getResultWin(isSuccess: boolean, copyType:ECopyType): BaseWindow {
        if (copyType == ECopyType.ECopyLegend && isSuccess) {
        	if (!this.legendResultWin) this.legendResultWin = new CopyLegendResult();
        	return this.legendResultWin;
        }

        if (copyType == ECopyType.ECopyContest) {
        	if (!this.contestResultWin) this.contestResultWin = new CopyContestResult();
        	return this.contestResultWin;
        }

		if(copyType == ECopyType.ECopyMgQiongCangDreamland && isSuccess){
			if(!this.qcResultWin){
				this.qcResultWin = new WindowQCCopyResult();
			}
			return this.qcResultWin;
		}

		if(copyType == ECopyType.ECopyCrossTeam && isSuccess){
			if(!this.crossTeamResultWin){
				this.crossTeamResultWin = new WindowCrossTeamResult();
			}
			return this.crossTeamResultWin;
		}

		if (!this.resultWinDict) {
			this.resultWinDict = {};
		}
		var type: number = isSuccess ? 1 : 0;
		if (!this.resultWinDict[type]) {
			var cls: any = isSuccess ? CopySuccessWin : CopyFailWin;
			this.resultWinDict[type] = new cls;
		}
		return this.resultWinDict[type];
	}

	/**
	 * boss伤害列表更新
	 */
	private onHurtListUpdate():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss)) {
			return;
		}
		if(this.copyMudule && this.copyMudule.isShow) {
			(this.copyMudule as TimeLimitBossCopyView).updateHurtList();
		}
	}

	/**
	 * 限时世界boss活动信息更新
	 */
	private onTimelimitBossUpdate():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss)) {
			return;
		}
		if(this.copyMudule && this.copyMudule.isShow) {
			(this.copyMudule as TimeLimitBossCopyView).onTimelimitBossUpdate();
		}
	}

	/**
	 * 限时世界boss鼓舞buff更新
	 */
	private onTimelimitBossBuffUpdate():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss)) {
			return;
		}
		if(this.copyMudule && this.copyMudule.isShow) {
			(this.copyMudule as TimeLimitBossCopyView).updateBuff();
		}
	}

	/**
	 * 阵地争夺占领信息更新
	 */
	private onOccupyInfosUpdate():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition)) {
			return;
		}
		if(this.isShow) {
			(this.copyMudule as ExpPositionOccupyView).updateOccupyInfo();
		}
	}

	/**
	 * 阵地争夺自己占领信息更新
	 */
	private onSelfOccupyInfoUpdate():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition)) {
			return;
		}
		if(this.isShow) {
			(this.copyMudule as ExpPositionOccupyView).updateSelfOccupy();
		}
	}

	/**
	 * 守护神剑副本技能cd
	 * {skillId:valueNum,total:总时间(毫秒),endTime:结束时间戳}
	 */
	private onDfCopyCdUpdate(data:any):void{
		CacheManager.copy.setDfCopySkillCd(data);		
	}
	
	/**
	 * 阵营战积分列表更新 （包含自己积分）
	 **/
	private onScoreListUpdate():void {
		if(this.isCampBattle()) {
			(this.copyMudule as CampBattleCopyView).updateScore();
		}
	}

	/**
	 * 积分奖励领取状态更新
	 */
	private onScoreRewardUpdate():void {
		if(this.isCampBattle()) {
			(this.copyMudule as CampBattleCopyView).updateScoreReward();
		}
	}

	/**
	 * 仙盟争霸仙盟积分排名更新
	 */
	private onGuildScoreRankUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateGuildScoreRanks();
		}
	}

	/**
	 * 仙盟争霸积分奖励 
	 */
	private onGuildBattleScoreRewardUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateScoreReward();
		}
	}

	/**
	 * 自己仙盟积分更新
	 */
	private onMyGuildScoreUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateMyGuildScore();
		}
	}

	/**
	 * 自己积分更新
	 */
	private onMyScoreUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateMyScore();
		}
	}

	/**
	 * 仙盟争霸战功更新
	 */
	private onMyBattleScoreUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateMyBattleScore();
		}
	}

	/**
	 * 采集信息更新
	 */
	private onCollectInfoUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateCollectInfo();
		}
	}

	/**
	 * 采集护盾更新
	 */
	private onCollectShieldUpdate(leftTime:number):void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateCollecterShield(leftTime);
		}
	}

	/**
	 * 仙盟争霸中成员信息更新
	 */
	private onMemberInfoUpdate():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).updateMember();
		}
	}
	//角色buff更新 { buffId: valueNum, type: attrUpdate.valueStr_S,roleIndex:roleIndex }
	private onRoleBuffUpdate(data:any):void{
		let roleIndex:number = data.roleIndex;
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)){//在守护副本内 buff更新
			if(this.copyMudule instanceof CopyDefendPanel){
				let tid:number = Number(ConfigManager.copy.getDefendSkills()[1].id);		
				if(data.buffId==tid){
					let isBuff:boolean = data.type==EBufferOp.EBufferOpAdd;
					CacheManager.copy.setDefendBuff(0,isBuff);
					this.copyMudule.updateRoleStatu();
				}		
				
			}
		}

	}

	private onRoleLife(valueStrNum:number,roleIndex:number):void{		
		if(valueStrNum>0 && CacheManager.copy.isDfReliveCd(roleIndex)){
			CacheManager.copy.clearDfRelive(roleIndex);
		}
		if(this.copyMudule instanceof CopyDefendPanel){			
			this.copyMudule.updateRoleStatu();
		}
	}

	/**
	 * 更新连斩
	 */
	private onComboUpdate():void {
		let combo:number = CacheManager.copy.combo;
		if(combo > 0) {
			if(!this.comboView) {
				this.comboView = new ComboView();
			}
			this.comboView.show(combo);
		}
		else {
			if(this.comboView && this.comboView.isShow) {
				this.comboView.hide();
			}
		}
	}

	private isCampBattle():boolean {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)) {
			return false;
		}
		return this.isShow;
	}

	private isGuildBattle():boolean {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar)) {
			return false;
		}
		return this.isShow;
	}

	/**
	 * 副本伤害排名更新 
	 * SHurtRank 
	 * SEntityId entityId = 1;
	 * string name_S = 2;
	 * int64 hurt_L64 = 3;
	 */
	private onHurtRankUpdate(data:any):void {
		CacheManager.copy.updateHurtList(data.rank.data);
		if(this.hurtListView && this.hurtListView.isShow) {
			this.hurtListView.updateHurtList();
		}
	}

	/**
	 * 自己伤害更新
	 */
	private onMyHurtUpdate(data:any):void {
		CacheManager.copy.myHurt = Number(data.value_L64);
		if(!this.hurtListView) {
			this.hurtListView = new CopyHurtListView();
		}
		if(!this.hurtListView.isShow) {
			this.hurtListView.show();
		}
		else {
			this.hurtListView.updateMyHurt();
		}
	}
	/**
	 * 守护神剑 积分信息
	 * SMgDefenseCopyInfo
	 */
	private onDefenseCopyInfo(data:any):void{
		CacheManager.copy.setDefendScore(data.score_I,true);
		CacheManager.copy.luckUseCount = data.luckyBossNum_I;
		if(this.copyMudule && this.copyMudule instanceof CopyDefendPanel && this.copyMudule.isShow){
			this.copyMudule.updateMonsScore();
		}
	}
	
	private onSceneUpdateHandler():void {
		if(this.isGuildBattle()) {
			(this.copyMudule as GuildBattleCopyView).sceneMapUpdate();
			if(CacheManager.guildBattle.position != 0) {
				//仙盟争霸中，只有第一个场景显示伤害排名
				if(this.hurtListView && this.hurtListView.isShow) {
					this.hurtListView.hide();
				}
			}
		}
		let isCp:boolean = CopyUtils.isCheckPoint(this.currentType);
		if(!isCp){
			this.showSceneMask();
		}
		
	}

	public hide(): void {
		super.hide();
		this.guildDfCopy
		this.autoFightFlag = false;
		this._view = null;
		this.copyMudule = null;
		if(this._callBossWin && this._callBossWin.isShow){
			this._callBossWin.hide();
		}
		if(this.guildDfCopy){
			this.guildDfCopy.removeListenerOnHide();
		}
		if(this._waveTip){
			this._waveTip.clearData();
		}

	}
}