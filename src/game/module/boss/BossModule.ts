class BossModule extends BaseTabModule {
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.Boss)
	}

	public initOptUI():void {
		super.initOptUI();
		this.className = {
			[PanelTabType.PersonalBoss]:["PersonalBossPanel",PersonalBossPanel],
			[PanelTabType.WorldBoss]:["WorldBossPanel",WorldBossNewPanel],
			[PanelTabType.SecretBoss]:["SecretBossPanel",SecretBossPanel],
			[PanelTabType.GodBoss]:["GodBossPanel",GodBossPanel],
			[PanelTabType.BossHome]:["BossHomePanel",BossHomePanel,PackNameEnum.BossHome],
		};
		this.indexTitle = false;
	}

	public updateAll(data?:any):void {
		// this.setIndex(PanelTabType.PersonalBoss, data);
		this.updateBtnTips();
	}

	public copyInfoUpdate():void {
		this.updatePersonalBtnTips();
		this.updateBossCopyEnterTimes();
		this.updateWorldBossBtnTips();
		this.updateGodBossBtnTips();
		this.updatePersonalBoss();
		this.updateSecretBoss();
	}

	protected updateSubView():void {
		this.descBtn.visible = this.curType != PanelTabType.GodBoss;
		this.bottomArea = false;
	}
	
	private updatePersonalBoss():void{
		if(this.isTypePanel(PanelTabType.PersonalBoss)) {
			this.curPanel.updateAll();
		}
	}
	public updateSecretBoss():void{
		if(this.isTypePanel(PanelTabType.SecretBoss)) {
			this.curPanel.updateAll();
		}
	}
	public updateSecretKiller(data:any):void{
		if(this.isTypePanel(PanelTabType.SecretBoss)) {
			(this.curPanel as SecretBossPanel).updateLastKiller(data);
		}
	}

	/**
	 * boss列表数据更新
	 */
	public onBossListUpdate():void {
		this.updateWorldBoss();
		this.updateGodBoss();
		this.updateBossHomeList();
	}

	public updateWorldBoss():void {
		if(this.isTypePanel(PanelTabType.WorldBoss)) {
			(this.curPanel as WorldBossNewPanel).updateWorldBossList();
		}
	}

	public updateGodBoss():void {
		if(this.isTypePanel(PanelTabType.GodBoss)) {
			(this.curPanel as GodBossPanel).updateGodBossList();
		}
	}

	

	/**
	 * boss之家列表更新
	 */
	public updateBossHomeList():void {
		if(this.isTypePanel(PanelTabType.BossHome)) {
			(this.curPanel as BossHomePanel).updateBossList();
		}
	}

	public updateTickets():void{
		if(this.isTypePanel(PanelTabType.SecretBoss)) {
			(this.curPanel as SecretBossPanel).updateTicketItem();
		}else if(this.isTypePanel(PanelTabType.WorldBoss)) {
			(this.curPanel as WorldBossNewPanel).updateTickets();
		}
	}
	
	private updateBossCopyEnterTimes():void {
		if(this.isTypePanel(PanelTabType.WorldBoss)) {
			(this.curPanel as WorldBossNewPanel).updateTimeCount();
		}
	}

	/**boss之家刷新时间 */
	public updateHomeBossRefreshTime():void {
		if(this.isTypePanel(PanelTabType.BossHome)) {
			(this.curPanel as BossHomePanel).updateRefreshTime();
		}
	}

	public updateBtnTips():void{
		this.updatePersonalBtnTips();
		this.updateWorldBossBtnTips();
		this.updateGodBossBtnTips();
		this.updateSecretBtnTips();
		this.updateBossHomeBtnTips();
	}
	/**
	 * 更新个人boss按钮红点
	 */
	private updatePersonalBtnTips():void{
		this.setBtnTips(PanelTabType.PersonalBoss,CacheManager.bossNew.isPeronalBossTips());
	}
	/**
	 * 更新秘境boss按钮红点
	 */
	private updateSecretBtnTips():void{
		this.setBtnTips(PanelTabType.SecretBoss,CacheManager.bossNew.checkSecretTips());
	}

	/**更新野外boss红点 */
	public updateWorldBossBtnTips():void {
		this.setBtnTips(PanelTabType.WorldBoss,CacheManager.bossNew.checkWorldBossTips(CopyEnum.CopyWorldBoss));
	}

	/**
	 * 更新神域boss红点
	 */
	public updateGodBossBtnTips():void {
		this.setBtnTips(PanelTabType.GodBoss,CacheManager.bossNew.checkWorldBossTips(CopyEnum.CopyGodBoss));
	}

	/**
	 * 更新boss之家红点
	 */
	public updateBossHomeBtnTips():void {
		this.setBtnTips(PanelTabType.BossHome,CacheManager.bossNew.checkBossHomeTips());
	}

	protected clickDesc():void {
		let tipStr:string = "";
		if(this.isTypePanel(PanelTabType.BossHome)) {
			tipStr = LangBoss.BOSS_HOME_TIPS;
		}
		else if(this.isTypePanel(PanelTabType.WorldBoss)) {
			tipStr = LangBoss.LANG2;
		}
		else if(this.isTypePanel(PanelTabType.PersonalBoss)) {
			tipStr = LangBoss.LANG3;
		}
		else if(this.isTypePanel(PanelTabType.SecretBoss)) {
			tipStr = LangBoss.LANG4;
		}
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
	}
}