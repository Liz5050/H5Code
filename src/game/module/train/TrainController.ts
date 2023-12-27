/**
 * 模块控制器
 * @author zhh
 * @time 2018-06-11 14:15:54
 */
class TrainController extends BaseController {
	private _moduleView:TrainModule;

	private godAttrDetailWin:GodWeaponAttrDetailWin;
	
	public constructor() {
		super(ModuleEnum.Train);
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new TrainModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolInfo], this.onSwordPoolInfo, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolEventUpdate], this.onSwordPoolEventUpdate, this);
		//this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolExpUpdate], this.onSwordPoolExpUpdate, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolActivityInfo], this.onPoolActivityInfo, this);

		this.addListen0(LocalEventEnum.TrainActGodWeapon,this.onActGodWeapon,this);
		this.addListen0(LocalEventEnum.TrainActGodWeaponPiece,this.onActGodWeaponPiece,this);
		this.addListen0(LocalEventEnum.TrainGetDailyScore,this.onReqGetDailyScore,this);
		

		this.addListen0(LocalEventEnum.TrainGetStageReward, this.onGetStageReward, this);
		this.addListen0(NetEventEnum.PlayerStrengthenExLoginInfo, this.checkTips, this);
		this.addListen0(NetEventEnum.roleTrainScoreUpdated, this.onRoleTrainScoreUpdated, this);
		this.addListen0(NetEventEnum.roleSkillInfo, this.onRoleSkillInfo, this);

		this.addListen0(NetEventEnum.packPosTypePropChange, this.onPackPropChange, this);
		this.addListen0(LocalEventEnum.TrainGodWPAttrDetail,this.onShowGodWeaponDetail,this);

	}
	
	public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.DailyGotoEvent, this.onGotoEvent, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpgraded, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenInfo, this);
		this.addListen1(LocalEventEnum.DailySPGetActivityReward, this.spGetActivityReward, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExLoginInfo, this.onStrengthenExLog, this);//强化更新
	}
	
	private onReqGetDailyScore(data:any):void{
		ProxyManager.train.getTrainScore(data.eventType);
		if(this._moduleView.isShow){			
			this._moduleView.showGetTrainScoreEffet(data.gx,data.gy);
		}
	}

	/**
	 * 前往日常事件
	 */
	private onGotoEvent(event: ESWordPoolEvent): void {
		let moduleId:number;
		let data:any;

		switch (event) {
			case ESWordPoolEvent.ESWordPoolEventCopyMgNewExp:
				moduleId = ModuleEnum.CopyHall;
				data = {tabType:PanelTabType.CopyHallDaily};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.CopyHallDaily});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgCheckPoint:
				if(!this.isInCopy()){
					EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
					this.openModelCb(true);
				}
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgRune:
				moduleId = ModuleEnum.CopyHall;
				data = {tabType:PanelTabType.CopyHallTower};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.CopyHallTower});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgMaterial:
				moduleId = ModuleEnum.CopyHall;
				data = {tabType:PanelTabType.CopyHallMaterial};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.CopyHallMaterial});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgPersonalBoss:
				moduleId = ModuleEnum.Boss;
				data = {tabType:PanelTabType.PersonalBoss};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:PanelTabType.PersonalBoss});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgNewWorldBoss:
				moduleId = ModuleEnum.Boss;
				data = {tabType:PanelTabType.WorldBoss};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:PanelTabType.WorldBoss});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgSecretBoss:
				moduleId = ModuleEnum.Boss;
				data = {tabType:PanelTabType.SecretBoss};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:PanelTabType.SecretBoss});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgKingStife:
				moduleId = ModuleEnum.Arena;
				data = {tabType:PanelTabType.KingBattle};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Arena,{tabType:PanelTabType.KingBattle});
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyEncounter:
				if(!this.isInCopy()){
					moduleId = ModuleEnum.Arena;
					data = {tabType:PanelTabType.Encounter};
					//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Arena,{tabType:PanelTabType.Encounter});
				}				
				break;
			case ESWordPoolEvent.ESWordPoolEventMining:
				moduleId = ModuleEnum.Arena;
				data = {tabType:PanelTabType.Mining};
				//EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Arena,{tabType:PanelTabType.Mining});
				break;
		}

		if(data && moduleId){
			data.cbFn = this.openModelCb;
			data.caller = this;
			EventManager.dispatch(UIEventEnum.ModuleOpen,moduleId,data);			
		}

	}

	private isInCopy():boolean{
		if(CacheManager.copy.isInCopy){
			let info:any =CacheManager.copy.getCurCopyInfo();
			if(info){
				Tip.showLeftTip(`正在挑战${info.name}`);
			}else{
				Tip.showLeftTip(`正在挑战副本`);
			}
			return true;
		} 
		return false;
	}

	private openModelCb(isOpen:boolean):void{
		if(isOpen){
			this.hide();
		}
	}

	/**
	 * 请求获取等阶经验
	 */
	private onGetStageReward(type:EStrengthenExType,level:number,index:number=-1):void{
		ProxyManager.train.getStageReward(type,level,index);
	}

	/**玩家拥有的历练值更新 */
	private onRoleTrainScoreUpdated():void{
		this.updateNobility();		
	}
	/**技能数据更新 */
	private onRoleSkillInfo():void{
		if(this.isShow){
			this._moduleView.updateMedal();
		}
		this.checkTips();
	}
	
	private onStrengthenExLog():void{
		this.updateNobility();
	}

	private onPlayerStrengthenExUpgraded(data:SUpgradeStrengthenEx):void{
		// SUpgradeStrengthenEx
		if(this.isShow){
			if(data.type==EStrengthenExType.EStrengthenExTypeLord){
				this._moduleView.updateNobility();
			}
			if(CacheManager.medal.upgradeStrenthenTypes.indexOf(data.type)>-1 || data.type==EStrengthenExType.EStrengthenExTypeMedal){
				this._moduleView.updateMedal();
			}
			
		}
		this.checkTips();
	}

	private onPlayerStrengthenInfo(data:any):void{
		this.updateNobility();
	}

	private updateNobility(delayScore:boolean=true):void{
		if(this.isShow){
			this._moduleView.updateNobility(delayScore);
		}
		this.checkTips();
	}
	private isNeedDelayCheckTips:boolean = true;
	private isInDelayCheckTips:boolean = false;
	private checkTips():void{
		if(this.isInDelayCheckTips){
			return;
		}
		if(this.isNeedDelayCheckTips){ //避免登录时多次检查
			this.isInDelayCheckTips = true;
			App.TimerManager.doDelay(1000,this.dealCheck,this);
		}else{
			this.dealCheck();
		}	
	}
	private dealCheck():void{
		let isTip:boolean = CacheManager.train.checkTips();
		EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, isTip);
		this.isNeedDelayCheckTips = false;
		this.isInDelayCheckTips = false;
	}
	/**领取奖励 */
	private spGetActivityReward(idx: number): void {
		ProxyManager.daily.getActivityReward(idx);
	}

	private onPackPropChange():void {
		if (this.isShow) {
			this._moduleView.onPackPropChange();
		}
		this.checkTips();
	}

	/**
	 * 剑池外形信息更新(有用到的 2018年8月30日20:02:40)
	 * @param data SSWordPool
	 */
	private onSwordPoolInfo(data: any): void {
		CacheManager.daily.swordPool = data;		
	}

	/**
	 * 剑池事件次数更新
	 * @param data SSwordPoolEventUpdateInfos
	 */
	private onSwordPoolEventUpdate(data: any): void {
		CacheManager.daily.updateEventTime(data);
		if (this.isShow) {
			this._moduleView.updateNobility();
		}
		this.checkTips();
	}
	/**
	 * 剑池经验更新 (暂时没有用到 2018年7月4日14:55:43)
	 * @param data SSeqAttributeUpdate
	 */
	private onSwordPoolExpUpdate(data: any): void {
		CacheManager.daily.updateExp(data);		
		
	}
	/**
	 * 活跃度更新
	 * @param data SSWordPoolActivity
	 */
	private onPoolActivityInfo(data: any): void {
		CacheManager.daily.swordPoolActivity = data;
		this.updateNobility(false);
	}
	
	

	private showGuide():void{
		EventManager.dispatch(LocalEventEnum.GuidePanelShow);
	}

	/**
	 * 请求激活神器
	 */
	private onActGodWeapon(code:number):void{
		ProxyManager.train.actGodWeapon(code);
	}
	/**
	 * 请求激活神器碎片
	 */
	private onActGodWeaponPiece(code:number,piece:number):void{
		ProxyManager.train.actGodWeaponPiece(code,piece);
	}

	/**
	 * 显示神器属性详情
	 */
	private onShowGodWeaponDetail():void{
		if(!this.godAttrDetailWin){
			this.godAttrDetailWin = new GodWeaponAttrDetailWin();
		}
		this.godAttrDetailWin.show();
		
	}
	public hide():void {
		super.hide();
	}
}