/**
 * 仙盟守护控制器
*/
class GuildDefendCopyController extends SubController{

	private autoTimeId:number = 0;
	private enterTimeId:number = 0;
	private delayAutoId:number = 0;

	private DELAY:number = 10000;

	private resultWin:WindowGuildDefendResult;
	// 烈焰仙尊,雷霆仙尊,仙盟神女
	private defenderCodes:number[] =  [
		GuildDefendCache.DEFENDER_1,GuildDefendCache.DEFENDER_2,GuildDefendCache.DEFENDER_3
	];

	public constructor() {
		super();
	}

	public getModule():any{
		return this._module;
	}

	private get copyPanel():GuildDefendPanel{
		if(!(this._module instanceof GuildDefendPanel)){
			return null;
		}
		return this._module as GuildDefendPanel;
	}

	protected addListenerOnInit():void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseIconOpen],this.onIcoOpenHandler,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseClose],this.onGuildClose,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseOpen],this.onGuildOpen,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseDefender],this.onDefenderMonster,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseNextRefreshWave],this.onNextWaveMonster,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseRefreshBossDt],this.onRefreshBossDt,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseCopyInfo],this.onGuildDfInfo,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefensePointsRankInfo],this.onRankInfo,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseReward],this.onGuildDfReward,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseCopyStage],this.onStageChange,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgGuildDefenseRewardBoxInfo],this.onBoxInfo,this);
    }

	public addListenerOnShow(): void {
		this.addListen0(NetEventEnum.EntityLifeUpdate,this.onDefenderLife,this);
		//this.addListen0(LocalEventEnum.SceneClickGround,this.onClickGroud,this);
		//this.addListen0(LocalEventEnum.CopyGuildDefendStart,this.onGuildDefendStart,this);
		//this.addListen0(LocalEventEnum.CopyGuildDefendStop,this.onGuildDefendStop,this);
		this.addListen0(LocalEventEnum.AutoFightChange,this.onAutoFightChange,this);
		this.addListen0(LocalEventEnum.CopyGuildShowAtkBoss,this.onBossShow,this);
	}
	public removeListenerOnHide(): void {
		this.removeListener(NetEventEnum.EntityLifeUpdate,this.onDefenderLife,this);
		//this.removeListener(LocalEventEnum.SceneClickGround,this.onClickGroud,this);
		//this.removeListener(LocalEventEnum.CopyGuildDefendStart,this.onGuildDefendStart,this);
		//this.removeListener(LocalEventEnum.CopyGuildDefendStop,this.onGuildDefendStop,this);
		this.removeListener(LocalEventEnum.AutoFightChange,this.onAutoFightChange,this);
		this.stopAutoTimeOut();
		CacheManager.guildDefend.bossEntity = null;
		CacheManager.guildDefend.clearDefenderLife();
    }

	private onBossShow(data:any):void{
		CacheManager.guildDefend.bossEntity = data.entityInfo;
		this.copyPanel.updateAtkBoss();
	}

	private onAutoFightChange():void{
		/*
		this.stopAutoTimeOut();	
		if(!CacheManager.king.isAutoFighting){
			this.startAutoTimeOut();
		}
		*/
	}

	private onGuildDefendStop():void{
		this.stopAutoTimeOut();
		this.stopEnterTimeOut();
	}

	private onGuildDefendStart():void{
		//this.stopAutoTimeOut();	
		//this.startAutoTimeOut();
		this.enterTimeId = egret.setTimeout(()=>{
			let data = CacheManager.guildDefend.getEnterPoint();
			EventManager.dispatch(LocalEventEnum.AutoStartFight,data);
		},this,this.DELAY);

	}
	private stopEnterTimeOut():void{
		if(this.enterTimeId){
			egret.clearTimeout(this.enterTimeId);
			this.enterTimeId = 0;
		}		
	}
	private stopAutoTimeOut():void{
		if(this.autoTimeId){
			egret.clearTimeout(this.autoTimeId);
			this.autoTimeId = 0;
		}
	}

	private startAutoTimeOut():void{		
		if(CacheManager.guildDefend.isInTravel()){
			return;
		}		
		this.autoTimeId = egret.setTimeout(()=>{
			let nearPoint:any = CacheManager.guildDefend.getNearHookPoint();
			let data:any = nearPoint?nearPoint:this.getWaitPoint();
			EventManager.dispatch(LocalEventEnum.AutoStartFight,data);			
		},this,this.DELAY);
	}

	private getWaitPoint():any{
		let c:number = 0;
		let tarEntoty:any;
		let tarWp:any;
		let tarCode:number=0;
		let minNum:number = 0;
		let dis:number = CacheManager.battle.autoBattleSearchDis; //挂机范围
		for(let i:number=0;i<this.defenderCodes.length;i++){
			let bossCode:number = this.defenderCodes[i];
			let entity:EntityInfo = <EntityInfo>CacheManager.map.getEntityByBossCode(bossCode);
			if(entity && entity.life_L64>0){
				c++;
				//计算挂机点附近的人数，优先去少人的挂机点
				let wp:any = CacheManager.guildDefend.getWaitPoint(bossCode);
				let num:number = CacheManager.map.getRangeEntityNum(wp.waitPointX,wp.waitPointY,dis);
				if(!tarEntoty || num<minNum){
					tarEntoty = entity;
					minNum = num;
					tarCode = this.defenderCodes[i];
					tarWp = wp;
				}
			}
			if(c==2){ //前两个建筑都存活不需要判断第三个神像
				break;
			}
		}		
		return tarWp;
	}

	private onClickGroud():void{
		if(this.delayAutoId){
			egret.clearTimeout(this.delayAutoId);
			this.delayAutoId = 0;
		}
		this.delayAutoId = egret.setTimeout(()=>{
			if(!CacheManager.king.isAutoFighting){
				this.stopAutoTimeOut();		
				this.startAutoTimeOut(); //点击地面重新开始倒计时挂机
			}
		},this,500);		
		
	}

	private onDefenderLife(entity:RpgGameObject):void{

		if(EntityUtil.isBoss(entity.entityInfo)){ //仙盟守护内更新boss血量
			if(entity.entityInfo.life_L64<=0){
				CacheManager.guildDefend.bossEntity = null;
			}
			this.copyPanel.updateAtkBoss();
			return;
		}
		if(!CopyUtils.isGuildDefenderEntity(entity.entityInfo)) return;

		let isGodBe:boolean = false;
		if(CacheManager.guildDefend.isGodDefend(entity.entityInfo.code_I) && CacheManager.guildDefend.isLifeChange(entity.entityInfo.code_I,entity.entityInfo.life_L64)){
			//神女受到攻击了
			isGodBe = true;
		}		
		this.copyPanel.updateDefByCode(entity.entityInfo.code_I);
		if(isGodBe){
			this.copyPanel.showGuideTips();
		}

		if(entity.isDead()){ //建筑死亡,我离该建筑最近			
			let wp:any = CacheManager.guildDefend.getWaitPoint(entity.entityInfo.code_I);
			let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
			if(!kingEntity || !kingEntity.entityInfo) {
				return;
			}
			let dis:number = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, wp.waitPointX, wp.waitPointY);
			if(CacheManager.guildDefend.isMinDis(dis,entity.entityInfo.code_I)){
				this.stopAutoTimeOut();
				this.stopEnterTimeOut();
				this.startAutoTimeOut();
			}			
		}
	}

	/**排行榜信息 SMgGuildDefenseRankInfo */
	private onRankInfo(data:any):void{
		CacheManager.guildDefend.rankInfo = data;
		if(this.isPanelShow()){
			this.copyPanel.updateRank();
		}
	}

	/**副本信息 SMgGuildDefenseCopyInfo */
	private onGuildDfInfo(data:any):void{
		CacheManager.guildDefend.scopyInfo = data;
		if(this.isPanelShow()){
			this.copyPanel.updateAll();
		}
	}

	/**SActiveOpen */
	private onGuildOpen(data:any):void{		
		//CacheManager.guildDefend.setOpenInfoAttr('openDt_DT',data.openDt_DT);		
		//EventManager.dispatch(LocalEventEnum.HomeAddGuildDefendIco);
		//EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.GuildDefend);
		//EventManager.dispatch(LocalEventEnum.HomeIconSetTime,CacheManager.guildDefend.leftOpenTime);
	}

	private onGuildClose():void{		
		CacheManager.guildDefend.isCloseAct = true;
		//this.removeIco();
		if(CacheManager.guildDefend.actStageInfo && CacheManager.guildDefend.actStageInfo.stage_I==EMgGuildDefenseStageType.EMgGuildDefenseStageTypeNotStart){
			CacheManager.guildDefend.updateOpenInfo(null);
		}
	}

	/**赏灯阶段宝箱信息 SMgGuildDefenseRewardBoxInfo */
	private onBoxInfo(data:any):void{
		CacheManager.guildDefend.boxInfo = data;
		if(this.isPanelShow()){
			this.copyPanel.updateAll();
		}
	}	

	private onStageChange(data:any):void{
		CacheManager.guildDefend.actStageInfo = data; 
		this.removeIco();
		if(CacheManager.guildDefend.isInTravel() && CacheManager.guildDefend.scopyInfo){//赏灯阶段清除突袭怪、波数倒计时
			CacheManager.guildDefend.scopyInfo.specialBossTime_DT = 0;
			CacheManager.guildDefend.setNextWaveDt({value_I:0});
		}
		if(this.isPanelShow()){
			this.copyPanel.updateAll();
		}
	}

	private removeIco():void{
		if(CacheManager.guildDefend.actStageInfo.stage_I==EMgGuildDefenseStageType.EMgGuildDefenseStageTypeEnd){
			CacheManager.guildDefend.updateOpenInfo(null);
		}
	}

	private onIcoOpenHandler(data:any):void{
		CacheManager.guildDefend.updateOpenInfo(data);
	}

	/**守卫仙盟下一波怪刷新倒计时 SInt */	
	private onNextWaveMonster(data:any):void{
		//场景右上角倒计时
		CacheManager.guildDefend.setNextWaveDt(data);		
	}
	
	/**守方怪信息 SMgGuildDefenseDefender */
	private onDefenderMonster(data:any):void{
		CacheManager.guildDefend.setDefenderInfo(data);
		if(this.isPanelShow()){
			this.copyPanel.updateDefender();
		}
	}

	//刷新倒计时 SDate
	private onRefreshBossDt(data:any):void{
		//进入副本刷新倒计时; X秒后开始战斗 的歌词秀
		let dt:number = data.dateVal_DT - CacheManager.serverTime.getServerTime();
		CacheManager.copy.copyOpenLefTime = dt*1000+egret.getTimer();		 
	}

	/**
	 * 结算
	 * SMgGuildDefenseRewardInfo
	 */
	private onGuildDfReward(data:any):void{		
		if(!this.resultWin){
			this.resultWin = new WindowGuildDefendResult();
		}
		this.resultWin.show(data);
	}

	private isPanelShow():boolean{
		return this.copyPanel && this.copyPanel.isShow;
	}

}