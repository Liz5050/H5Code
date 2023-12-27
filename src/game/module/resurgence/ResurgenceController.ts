/**
 * 复活
 */
class ResurgenceController extends BaseController {
	private module: ResurgenceModule;
	private _reviveTireWin:ReviveTireWindow
	// private curRviveWin:BaseReviveWindow;	
	private _reviveCdView:ReviveCoolDownView;
    private autoReliveTimeId: number = -1;

	private reviveView:ReviveThreeView;
	private guildBattleRevive:GuildBattleReviveView;

	private killInfo:any;
	public constructor() {
		super(ModuleEnum.Resurgence);
	}

	public initView(): BaseModule {
		this.module = new ResurgenceModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateKillByEntity], this.killByEntity, this);//被实体(boss/怪)杀死
		this.addListen0(NetEventEnum.kingDie, this.onKingDie, this);//主角死亡了 玩家死亡必定收到ECmdGateKillByEntity，这里先屏蔽
		this.addListen0(NetEventEnum.kingRelived, this.kingRelived, this);//主角复活了
		this.addListen0(LocalEventEnum.Revive, this.revive, this);//复活
		this.addListen0(LocalEventEnum.ReviveShowTireWin, this.onShowReviveCityCdWin, this);
	}

	private onKingDie(roleIndex:number):void {
        CacheManager.king.updateMultiRoleInfo(null, true);//控制权移交
	}

	/**
	 * @param data SEntityKillerInfo
	 */
	private dieIndex:number;
	private killByEntity(data: any): void {
		CacheManager.battle.isNearAttack = false;
		if(data) CacheManager.map.addMurdererId(data.entityId);
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)){
			if(data){
				CacheManager.copy.setDfReliveCd(data.index_I);
			}
		}

		if (CacheManager.battle.deadStopAI()) {//特殊副本死亡即停掉自动挂机
			EventManager.dispatch(LocalEventEnum.AutoStopFight);
		}
		else {
			CacheManager.bossNew.battleObj = null;
		}
		
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)
			|| CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)
			|| CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)
			|| CacheManager.copy.isInCopyByType(ECopyType.ECopyContest)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMiningChallenge)) {//特殊副本不弹复活界面
			return;
		}
		if(MapUtil.isInNoLocalReliveMap() && MapUtil.isInNoCityReliveMap()){
			return;
		}
		this.dieIndex = -1;
		if(!data) return;
		this.dieIndex = data.index_I;
		this.killInfo = data;
		if(data.name_S){
			let entityType:string = "玩家";
			if(data.entityId.type_BY == EEntityType.EEntityTypeBoss) {
				entityType = "BOSS";
			}
			this.showResurgenceWin(`你被${entityType}${HtmlUtil.html(data.name_S,Color.Color_2)}杀死了`);
		}else{
			this.showResurgenceWin("你被杀死了");
		} 
		CacheManager.map.clearFightPlayers();
		CacheManager.copy.combo = 0;
	}

	// /**
	//  * 主角挂了，弹复活框
	//  */
	// private onKingDie(index:number): void {
	// 	if(this.dieIndex == NaN || this.dieIndex == null) {
	// 		Tip.showTip("未收到角色死亡索引");
	// 		return;
	// 	}
	// 	this.showResurgenceWin("你被杀死了");
	// }

	private onShowReviveCityCdWin():void{
		if(!this._reviveTireWin){
			this._reviveTireWin = new ReviveTireWindow();
		}
		this._reviveTireWin.show(true);
	}

	private showResurgenceWin(tip: string): void {

		if(MapUtil.isInNoLocalReliveMap()){
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar)) {
				if(!this.guildBattleRevive) {
					this.guildBattleRevive = new GuildBattleReviveView();
				}
				this.guildBattleRevive.show(this.killInfo);
				Tip.showRollTip(tip);
			}
			else {
				/*
				if(!this._reviveCdView){
					this._reviveCdView = new ReviveCoolDownView();
				}
				if(!this._reviveCdView.isShow){
					this._reviveCdView.show();
				}
				*/
				
				if(!this.reviveView) {
					this.reviveView = new ReviveThreeView();
				}
				this.reviveView.show({tips:tip,revivalType:ERevivalType.ERevivalTypeInBackToTheCity, noShowBtn:true});
			}
		}
		else{
			if(!this.reviveView) {
				this.reviveView = new ReviveThreeView();
			}
			let parent = null;
			let noShowBtn:boolean;
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyLegend)) {
                parent = LayerManager.UI_Popup;
                noShowBtn = true;
			}
            if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossTeam) ||
			  CacheManager.copy.isInCopyByType(ECopyType.ECopyGuildTeam) ||
			  CacheManager.copy.isInCopyByType(ECopyType.ECopyGuild)
			  ) {
                noShowBtn = true;
            }
			this.reviveView.show({tips:tip, parent:parent, noShowBtn:noShowBtn});
			if(!noShowBtn) {
				this.checkAutoRelive(true);
			}
		}
	}

	private revive(data:any): void {
		if(data.roleIndex==null && (this.dieIndex == NaN || this.dieIndex == null)) {
			Tip.showTip("未收到角色死亡索引");
			return;
		}

		if (data.revivalType == ERevivalType.ERevivalTypeInBackToTheCity) {
			CacheManager.battle.setRevivalWait(true);
		}
		let mainIndex:number = 0;
		let posX:number = 0;
		let posY:number = 0;
		if(data.revivalType == ERevivalType.ERevivalTypeInSitu) {
			mainIndex = CacheManager.role.getMainIndex();
			let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
			if(mainPlayer) {
				posX = mainPlayer.col;
				posY = mainPlayer.row;
				console.log("复活主控制",mainPlayer);
			}
			else {
				let info:EntityInfo = CacheManager.role.getEntityInfo(mainIndex);
				posX = info.col;
				posY = info.row;
				console.log("复活" + mainIndex + "角色",info);
			}
		}
		let idx:number = data.roleIndex!=null?data.roleIndex:this.dieIndex;
		mainIndex = data.mainIndex!=null?data.mainIndex:mainIndex;
		ProxyManager.player.revive(data.revivalType,data.priceUnit,idx,mainIndex,posX,posY);
	}

	private kingRelived(index:number): void {
        CacheManager.king.updateMultiRoleInfo(null, true);//控制权移交
		if (this.reviveView) {
			this.reviveView.hide();
		}
		CacheManager.boss.reviveCityEnd = 0; //复活了 清除cd
		if(this._reviveTireWin){
			this._reviveTireWin.hide(); //隐藏
		}
		if(this._reviveCdView){
			this._reviveCdView.hide();
		}
		this.checkAutoRelive(false);
		if (!CacheManager.king.isDead() && MapUtil.isReliveToAutofightMap()) {//当前没有挂机，复活后自动挂机
            EventManager.dispatch(LocalEventEnum.AutoStartFight);
		}
	}

    private checkAutoRelive(isDead:boolean)
    {
        if (isDead)
        {
            if (this.autoReliveTimeId == -1 && CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.AutoRelive]))
            {//自动买药复活
                this.autoReliveTimeId = egret.setTimeout(this.autoRelive, this, 1000);
            }
        }
        else if (this.autoReliveTimeId > 0)
        {
            egret.clearTimeout(this.autoReliveTimeId);
            this.autoReliveTimeId = -1;
        }
    }

    private autoRelive()
    {
		this.autoReliveTimeId = -1;
        if (CacheManager.king.isDead())
        {
            let priceUnit:EPriceUnit;
			if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGoldBind, 100, false))
                priceUnit = EPriceUnit.EPriceUnitGoldBind;
            else if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, 100, false))
                priceUnit = EPriceUnit.EPriceUnitGold;
			if(priceUnit) {
				EventManager.dispatch(LocalEventEnum.Revive, { revivalType: ERevivalType.ERevivalTypeInSitu, priceUnit: priceUnit });
				Tip.showRollTip("已自动原地复活（设置）");
			}
        }
    }
}