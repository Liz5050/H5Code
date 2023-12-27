class BossController extends BaseController {
	private module:BossModule;

	private bossSet:BossSetWindow;
	private _explainWin: BossTireExplainWindow;
	public resultWindow:WindowBossResult;
	private bossReward:BossRewardPanel;
	private hideBossInfo:HideBossWindow;
	private crossGuildBossResult:WindowCrossGuildBOSSResult;
	// private bossRefresh:WindowBossWarn;
	private bossRefresh:BossRefreshTips;
	private bossRefresh2:BossRefreshTips2;
	private activityTips:ActivityWarfareOpenView;

	private _curBossCode: number = 0; //当前要进入的boss
	private _curMapId: number = 0; //当前要进入的boss
	private _hideBoss:HideBoss;
	private ownerRewardData:any;
	public constructor() {
		super(ModuleEnum.Boss);
	}

	public initView():BaseModule {
		this.module = new BossModule(this.moduleId);
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.BossReqEnterCopy, this.onReqEnterBossCopy, this);
		this.addListen0(LocalEventEnum.BossRefrishNotice, this.onBossRefrishNoticeShow, this);
		this.addListen0(UIEventEnum.BossSetOpen,this.onOpenBossSetHandler,this);
		this.addListen0(LocalEventEnum.WorldBossAutoFight,this.onAutoFihtBossHandler,this);
		// this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneUpdate,this);
		this.addListen0(UIEventEnum.BossRewardPanelOpen,this.onOpenRewardPanel,this);
		this.addListen0(LocalEventEnum.GameReSize,this.onUpdateGameSize,this);
		this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneUpdateHandler,this);
		this.addListen0(NetEventEnum.roleCareerChanged, this.onRoleCareerChangeHandler, this);
		this.addListen0(NetEventEnum.roleLevelUpdate, this.onRoleLvUpdate, this);
		this.addListen0(LocalEventEnum.VipUpdate,this.onRoleLvUpdate,this);
		this.addListen0(LocalEventEnum.BossFollow,this.onUpdateBossFollowSysSet,this);
		this.addListen0(UIEventEnum.BossExplainShow, this.onShowExplain, this);
		this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);
		this.addListen0(LocalEventEnum.ActivityWarTipsUpdate,this.onWarTipsUpdate,this);
		this.addListen0(LocalEventEnum.HideBossRefreshTips,this.onHideBossRefreshHandler,this);
		this.addListen0(LocalEventEnum.HideActivityWarTips,this.onHideActivityWarTips,this);
		this.addListen0(UIEventEnum.HomeOpened,this.onHomeOpen,this);
		this.addListen0(LocalEventEnum.BossHideBossInfoWin, this.onShowHideBossInfoWin, this);
		this.addListen0(LocalEventEnum.AIPickUpComplete,this.onAIPickUpComplete,this);

		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGameBossList], this.onBossListUpdate, this); //所有boss
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGameBoss], this.onBossInfoUpdate, this);//更新单个boss
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicOwnerReward],this.onOwnerRewardUpdate,this);//归属者奖励
		// this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicJoinReward],this.onJoinRewardUpdate,this);//参与者奖励
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBossOwner],this.onBossOwnerUpdate,this);//boss掉落归属更新
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGameBossDeathRecord], this.onBossDeath, this);//boss死亡记录
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGameBossDeathRecord], this.onBossDeath, this);//boss死亡记录
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGameBossDropRecord], this.onBossDropRecord, this);//boss掉落记录
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewBossHomeRefresh],this.onBossHomeRefreshUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicHideBossInfo],this.onHideBossInfo,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateRefreshNewWorldBoss],this.onBossRefreshNumUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCoReward],this.onAssistRewardUpdate,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange,this.onPackChangeHandler,this);
		this.addListen1(NetEventEnum.copyInfUpdate,this.onCopyInfoUpdate,this);
		this.addListen1(UIEventEnum.BossReqKillRecord, this.onReqKillRecord, this);

		this.onHideBossRefreshHandler();
	}

	private onHideBossRefreshHandler():void {
		if(this.bossRefresh && this.bossRefresh.isShow) {
			this.bossRefresh.hide();
		}
		if(this.bossRefresh2 && this.bossRefresh2.isShow) {
			this.bossRefresh2.hide();
		}
	}

	private onHideActivityWarTips():void {
		if(this.activityTips && this.activityTips.isShow) {
			this.activityTips.hide();
		}
	}
	
	protected afterModuleShow(data?: any): void {
		let type:PanelTabType = data.tabType;
		if(!data.isAuto) {
			if(type == PanelTabType.PersonalBoss) {
				if(!CacheManager.bossNew.isPeronalBossTips() && ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.WorldBoss,false)) {
					type = PanelTabType.WorldBoss;
				}
			}
		}
		this.module.setIndex(type, data);
	}
	private onReqKillRecord(copyCode: number, bossCode: number): void {
		ProxyManager.boss.reqBossDeathRecord(copyCode, bossCode);
	}
	/**
	 * 世界boss说明界面
	 */
	private onShowExplain(data:any): void {
		if (!this._explainWin) {
			this._explainWin = new BossTireExplainWindow();
		}
		this._explainWin.show(data);
	}

	/**
	 * 打开boss设置界面
	 */
	private onOpenBossSetHandler(copyCode:number):void {
		if(!this.bossSet) {
			this.bossSet = new BossSetWindow();
		}
		this.bossSet.show(copyCode);
	}

	private onOpenRewardPanel(bossCode:number):void {
		if(!this.bossReward) {
			this.bossReward = new BossRewardPanel();
		}
		this.bossReward.show(bossCode);
	}

	/**自动挑战Boss */
	private onAutoFihtBossHandler():void {
		if(UIManager.isShow(ModuleEnum.Team))return;
		if(!CacheManager.copy.checkCanEnterCopy(false)) {
			return;
		}
		let autoFight:boolean = CacheManager.bossNew.autoFight2;
		if(autoFight && this.checkAutoEnter(CopyEnum.CopyGodBoss)) {
			//优先挑战神域boss
			return;
		}
		autoFight = CacheManager.bossNew.autoFight;
		if(autoFight) {
			this.checkAutoEnter(CopyEnum.CopyWorldBoss);
		}
	}

	private checkAutoEnter(copyCode:number):boolean {
		if(CacheManager.copy.getEnterLeftNum(copyCode) > 0) {
			let codes:number[];
			if(copyCode == CopyEnum.CopyWorldBoss) {
				codes = CacheManager.bossNew.autoFightBossList;
			}
			else if(copyCode == CopyEnum.CopyGodBoss) {
				codes = CacheManager.bossNew.autoFightBossList2;
			}
			if(!codes) return false;
			let minLv:number = 0;
			let bossCode:number = -1;
			for(let i:number = 0; i < codes.length; i++) {
				if(CacheManager.bossNew.isBossCd(codes[i]) || !CacheManager.bossNew.getBossIsOpened(codes[i])) continue;
				let boss:any = ConfigManager.boss.getByPk(codes[i]);
				if(boss.level > minLv) {
					bossCode = codes[i];
					minLv = boss.level;
				}
			}	
			if(bossCode > 0) {
				let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
				this.onReqEnterBossCopy(gameBoss.copyCode,gameBoss.mapId,bossCode);
				return true;
			}
		}
		return false;
	}

	/**boss刷新通知 */
	private onBossRefrishNoticeShow(bossCode: number): void {
		if(!CacheManager.bossNew.needRefreshTips(bossCode)) return;
		if(CacheManager.bossNew.checkAutoFight(bossCode)) {
			//自动进入挑战
			let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
			this.onReqEnterBossCopy(gameBoss.copyCode,gameBoss.mapId,bossCode);
			return;
		}
		
		//（策划需求）战场活动刷新提示存在期间，不弹出boss刷新提示
		//BOSS模块 竞技模块 副本大厅 首充模块打开期间不弹刷新提示
		if(this.activityTips && this.activityTips.isShow) return;
		if(this.isShow || UIManager.isShow(ModuleEnum.Arena) || UIManager.isShow(ModuleEnum.CopyHall) || UIManager.isShow(ModuleEnum.RechargeFirst)) {
			return;
		}
		if(CacheManager.bossNew.checkBossCopy(bossCode,CopyEnum.CopyBossHome)) {
			//boss之家刷新提示
			if(!this.bossRefresh) {
				this.bossRefresh = new BossRefreshTips();
			}
			this.bossRefresh.show(bossCode);
			this.bossRefresh.setXY(fairygui.GRoot.inst.width - 350, fairygui.GRoot.inst.height - 410);
		}
		else {
			if(!this.bossRefresh2) {
				this.bossRefresh2 = new BossRefreshTips2();
			}
			this.bossRefresh2.show(bossCode);
			this.bossRefresh2.setXY(fairygui.GRoot.inst.width - 370, fairygui.GRoot.inst.height - 444);
		}
		CacheManager.bossNew.refreshedDict[bossCode] = true;
	}

	/**
	 * 战场活动提示
	 */
	private onWarTipsUpdate(iconId:IconResId):void {
		if(iconId) {
			if(UIManager.isShow(ModuleEnum.RechargeFirst) || UIManager.isShow(ModuleEnum.GamePlay)) return;
			if(iconId == IconResId.GuildBattle && UIManager.isShow(ModuleEnum.GuildBattle)) return;
			this.onHideBossRefreshHandler();
			if(!this.activityTips) {
				this.activityTips = new ActivityWarfareOpenView();
			}
			this.activityTips.show(iconId);
			this.activityTips.setXY(fairygui.GRoot.inst.width - 400, fairygui.GRoot.inst.height - 454);
		}
		else {
			this.onHideActivityWarTips();
		}
	}

	/**游戏窗口尺寸变化 */
	private onUpdateGameSize():void {
		if(this.bossRefresh && this.bossRefresh.isShow) {
			this.bossRefresh.setXY(fairygui.GRoot.inst.width - 350, fairygui.GRoot.inst.height - 410);
		}
		if(this.bossRefresh2 && this.bossRefresh2.isShow) {
			this.bossRefresh2.setXY(fairygui.GRoot.inst.width - 370, fairygui.GRoot.inst.height - 444);
		}

		if(this.activityTips && this.activityTips.isShow) {
			this.activityTips.setXY(fairygui.GRoot.inst.width - 400, fairygui.GRoot.inst.height - 454);
		}
	}

	private onSceneUpdateHandler():void {
		if(this.bossRefresh && this.bossRefresh.isShow) {
			this.bossRefresh.visible = !CacheManager.copy.isInCopy;
		}
		if(this.bossRefresh2 && this.bossRefresh2.isShow) {
			this.bossRefresh2.visible = !CacheManager.copy.isInCopy;
		}
		this.onAutoFihtBossHandler();		
	}

	private onUpdateBossFollowSysSet():void {
		this.updateFollow();
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Boss,CacheManager.bossNew.checkTips());
	}

	/**转生改变 */
	private onRoleCareerChangeHandler():void {
		//转生改变需要重置玩家手动设置过的不符合关注规则的BOSS（重登不重置玩家手动设置过的）
		this.updateFollow(true);
	}

	//角色等级，vip等级改变
	private onRoleLvUpdate():void {
		this.updateFollow();
	}

	private updateFollow(careerChange:boolean = false):void {
		CacheManager.bossNew.isSecret = true;
		let followSets:number[] = CacheManager.sysSet.getValue(LocalEventEnum.BossFollow);
		if(!followSets) return;
		let setList:any[] = CacheManager.sysSet.getValue(LocalEventEnum.BossSetList);
		let bossList: any[] = ConfigManager.mgGameBoss.getCanFollowList();
		let roleLv:number = CacheManager.role.getRoleLevel();
		let roleState:number = CacheManager.role.getRoleState();
		for(let i:number = 0; i < bossList.length; i++) {
			let isOpen:boolean = CacheManager.bossNew.getBossIsOpened(bossList[i].bossCode);
			let setIndex:number = setList.indexOf(bossList[i].bossCode);
			let followIndex:number = followSets.indexOf(bossList[i].bossCode);
			let copyCfg:any = ConfigManager.copy.getByPk(bossList[i].copyCode);
			let bossLv:number = ConfigManager.boss.getByPk(bossList[i].bossCode).level;
			let state:boolean;
			let bossState:number = bossList[i].roleState;
			let levelFlag:boolean = false;
			if(roleState > 0) {
				roleLv = 80 + roleState*10;
			}
			if(bossState > 0 && roleState > 0) {
				if(ConfigManager.mgGameBoss.isQCMaxBoss(bossList[i].bossCode)) {
					levelFlag = isOpen;
				}
				else {
					levelFlag = roleState - bossState < 2;
				}
			}
			else if(roleState <= 0){
				//玩家未转生，始终取60 80级boss关注
				levelFlag = roleLv >= bossLv && bossLv >= 60;
			}
			else if(!bossState && roleState > 0){
				levelFlag = roleLv - bossLv <= 10;
			}

			if(copyCfg.copyType == ECopyType.ECopyMgSecretBoss) {
				//秘境boss不可主动设置关注状态，不用判断setIndex，只判断isOpen
				state = isOpen;
			}
			else {
				//setIndex == -1代表从未设置过关注状态，已开启的Boss默认设置为关注状态
				//setIndex != -1已经主动设置过关注状态，存在主动取消关注设置，直接取得系统设置中关注列表的followIndex为是否关注了该Boss
				if(careerChange) {
					//转生改变需要重置玩家手动设置过的不符合关注规则的BOSS（重登不重置玩家手动设置过的）
					state = isOpen && levelFlag;
				}
				else {
					state = ((setIndex == -1 && levelFlag) || followIndex != -1) && isOpen;
				}
			}
			CacheManager.bossNew.setFollowBoss(bossList[i].bossCode, state);
			if(state) {
				if(followIndex == -1) followSets.push(bossList[i].bossCode);
				if(setIndex == -1) setList.push(bossList[i].bossCode);
			}
			else if(!levelFlag) {
				if(followIndex != -1) followSets.splice(followIndex,1);
			}
		}
		if(this.isShow) {
			//等级 转生等级发生改变需全部检测
			//vip等级发生改变仅检测boss之家
			//关注设置改变检测野外、神域、boss之家
			//临时处理，每次更新检测全部页签红点
			this.module.updateBtnTips();
		}
	}

	/**
	 * boss列表更新 登陆推送、请求推送（全部）
	 * SDictIntBoolDate CdlPublic.cdl
	 */
	private onBossListUpdate(data:any):void {
		CacheManager.bossNew.updateBossList(data.dict);
		if(this.module && this.module.isShow) {
			this.module.onBossListUpdate();
		}	
		EventManager.dispatch(NetEventEnum.BossListInfUpdate);
	}

	/**
	 * 单个boss信息更新 
	 * SIntBoolDate
	 **/
	private onBossInfoUpdate(data:any): void {	
		let isDead:boolean = CacheManager.bossNew.isBossCd(data.val_I);
		CacheManager.bossNew.updateBossInfo(data);
		if(isDead && !CacheManager.bossNew.isBossCd(data.val_I)) {
			this.onBossRefrishNoticeShow(data.val_I);
		}
		if(this.module && this.module.isShow) {
			if(CacheManager.bossNew.checkBossCopy(data.val_I)){
				this.module.updateWorldBoss();
				this.module.updateWorldBossBtnTips();
			}
			else if(CacheManager.bossNew.checkBossCopy(data.val_I,CopyEnum.CopyBossHome)) {
				this.module.updateBossHomeList();
				this.module.updateBossHomeBtnTips();
			}
			else if(CacheManager.bossNew.checkBossCopy(data.val_I,CopyEnum.CopyGodBoss)) {
				this.module.updateGodBoss();
				this.module.updateGodBossBtnTips();
			}else if(CacheManager.bossNew.checkBossCopy(data.val_I,null,ECopyType.ECopyMgSecretBoss) || CacheManager.bossNew.checkBossCopy(data.val_I,null,ECopyType.ECopyMgDarkSecretBoss)){
				this.module.updateSecretBoss();
			}
		}
        EventManager.dispatch(NetEventEnum.BossInfUpdate,data);
	}

	private onAIPickUpComplete():void{
		this.showDelayOwerReward();
	}

	private showDelayOwerReward():void{
		if(this.ownerRewardData){
			this.showResutWin(this.ownerRewardData);
			this.ownerRewardData = null;
		}	
	}

	/**
	 * 奖励结算（打完boss结算时才更新）
	 * SGameBossReward
	 */
	private onOwnerRewardUpdate(data:any):void {
		if(this.bossReward && this.bossReward.isShow) {
			this.bossReward.hide();
		}
		EventManager.dispatch(NetEventEnum.BossRewardResult,data);
		let isQiongCang:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangHall) || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangAttic);
		let isSecret:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss);
		let isDarkSecret:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgDarkSecretBoss);
		let isCrossGuild:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder);
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss) || isCrossGuild || isQiongCang || isSecret || isDarkSecret || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossIntruder)) {
			// CacheManager.king.stopKingEntity(true);
			EventManager.dispatch(LocalEventEnum.AutoStopFight);
			CacheManager.map.clearFightPlayers();
			/*
			//秘境boss也弹结算 2019年3月4日21:32:00 
			if((isSecret || isDarkSecret) && EntityUtil.isMainPlayer(data.ownerMiniPlayer.entityId)){//暗之秘境或者秘境非归属者都不显示结算
				return;
			}else if(isQiongCang) {
				//穹苍Boss不显示结算界面
				return;
			}
			*/
		}
		
		if(CacheManager.copy.curCopyType!=null && 
		CopyUtils.isDelayDropRetCopy(CacheManager.copy.curCopyType) && 
		EntityUtil.isMainPlayer(data.ownerMiniPlayer.entityId) ){ //归属者才能通过捡完掉落弹结算; (非归属者不能捡,没有PickUp事件直接弹就可以了)
			this.ownerRewardData = data;
			return;
		}

		if(isCrossGuild){ //神兽入侵
			if(!this.crossGuildBossResult){
				this.crossGuildBossResult = new WindowCrossGuildBOSSResult();
			}
			this.crossGuildBossResult.show(data);
			return;
		}
		this.showResutWin(data);		
		this.onBossOwnerUpdate(null);
	}

	private showResutWin(data:any):void{
		if(CacheManager.copy.isInCopy) {
			if(!this.resultWindow) {
				this.resultWindow = new WindowBossResult();
			}
			this.resultWindow.show(data);
		}
	}

	

	/**
	 * 协助奖励更新
	 * SGameBossReward
	 */
	private onAssistRewardUpdate(data:any):void {
		if(CacheManager.copy.isInCopy) {
			if(!this.resultWindow) {
				this.resultWindow = new WindowBossResult();
			}
			data.coRewards = data.rewards;
			this.resultWindow.show(data);
		}
	}

	/** SeqGameBossDeathRecord */
	protected onBossDeath(data: any): void {		
		if(this.isShow){
			let arg:any = data.data.length>0?data.data[0]:null;
			this.module.updateSecretKiller(arg);
		}
		
	}
	/**
	 * boss掉落归属更新
	 * SBossOwner
	 */
	private onBossOwnerUpdate(data:any):void {
		CacheManager.bossNew.updateBossOwner(data);
		if(CacheManager.bossNew.hasOwner) {
			let info:any = CacheManager.bossNew.ownerInfo;
			if(info) {
				Tip.showRollTip(App.StringUtils.substitude(LangBoss.L16,HtmlUtil.html(info.name_S,Color.Green2)));
			}
		}
		EventManager.dispatch(NetEventEnum.BossOwnerChange);
	}

	/**背包道具改变 */
	private onPackChangeHandler():void {
		if(this.module && this.module.isShow) {
			this.module.updateTickets();
		}
	}
	
	/**副本信息更新 */
	private onCopyInfoUpdate():void {
		if(this.module && this.module.isShow) {
			this.module.copyInfoUpdate();
		}
	}
	
	/**
	 * 请求进入boss副本
	 */
	private onReqEnterBossCopy(copyCode: number, mapId: number, bossCode: number,isRefresh:boolean = false): void {
		if(!CacheManager.copy.checkCanEnterCopy(false)) {
			return;
		}
		if(!CacheManager.bossNew.getBossIsOpened(bossCode)) {
			Tip.showTip(LangBoss.L12);
			return;
		}

		let leftNum:number = CacheManager.copy.getEnterLeftNum(copyCode);
		if(isRefresh && copyCode == CopyEnum.CopyWorldBoss) {
			//刷新进入野外boss
			if(leftNum <= 0) {
				Tip.showTip(LangBoss.L13);
				return;
			}
			ProxyManager.boss.refreshAndEnterBoss(copyCode, mapId);
			return;
		}

		if(CacheManager.bossNew.isBossCd(bossCode)) {
			Tip.showTip(LangBoss.L14);
			return;
		}
		
		let this_ = this;
		function enterWorldBoss():void {
			ProxyManager.boss.reqEnterBossCopy(copyCode, mapId);
			this_._curBossCode = bossCode;
			this_._curMapId = mapId;
		}
		if(copyCode == CopyEnum.CopyWorldBoss) {
			if(leftNum <= 0) {
				let bagItem:ItemData = CacheManager.pack.propCache.getItemByCode(419906001);
				if(bagItem) {
					AlertII.show(App.StringUtils.substitude(LangBoss.L15,bagItem.getName(true)),null,function(type:AlertType){
						if(type == AlertType.YES) {
							EventManager.dispatch(LocalEventEnum.PackUseByCode,bagItem,1);
							enterWorldBoss();
						}
					},this);
				}
				else {
					Tip.showTip(LangBoss.L13);
				}
				return;
			}
		}
		
		enterWorldBoss();
	}

	private routeToBoss(): void {
		if(CacheManager.copy.isInCopy) {
			EventManager.dispatch(LocalEventEnum.BossRouteToBossGrid, this._curBossCode, this._curMapId);
			this._curBossCode = 0;
		}
	}

	private onShowHideBossInfoWin(mgBossInfo:any):void{
		if(!this.hideBossInfo){
			this.hideBossInfo = new HideBossWindow();
		}
		this.hideBossInfo.show(mgBossInfo);
		
	}

	private onHomeOpen():void{
		this.showHideBoss();
	}

	/**隐藏boss刷新信息 SHideBossInfo */
	private onHideBossInfo(data:any):void{
		CacheManager.bossNew.hideBossDt = data.endSec_I;
		CacheManager.bossNew.hideBossCopyCode = data.copyCode_I;
		this.showHideBoss();
	}

	private showHideBoss():void{
		if(UIManager.isShow(ModuleEnum.Home) && CacheManager.bossNew.isShowHideBoss()){
			if(!this._hideBoss){
				this._hideBoss = new HideBoss();
			}
			this._hideBoss.show();
		}else if(this._hideBoss && this._hideBoss.isShow){
			this._hideBoss.hide();
		}
	}

	/**
	 * boss之家刷新时间更新
	 */
	private onBossHomeRefreshUpdate(data:any):void {
		CacheManager.bossNew.bossHomeRefresh = data.value_I;
		if(this.isShow) {
			this.module.updateHomeBossRefreshTime();
		}
	}

	/**
	 * 野外boss已使用刷新次数更新
	 * SInt
	 */
	private onBossRefreshNumUpdate(data:any):void {
		CacheManager.bossNew.updateRefreshedNum(data.value_I);
	}

	private onCopyLeft():void {
		this.onBossOwnerUpdate(null);
		this.showHideBoss();
		this.ownerRewardData = null;
	}
}