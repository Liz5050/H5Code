class WorldBossCopyPanel extends BaseCopyPanel {
	/**攻击boss */
	private attackBossBtn: fairygui.GButton;
	/**攻击归属者按钮 */
	private attackOwnerBtn: fairygui.GButton;
	protected ownerView: BossOwnerView;
	protected rewardBtn: fairygui.GButton;

	private hasClicked: Boolean = false;
	private guideClickView: GuideClickView2;
    protected attackBossInfo: EntityInfo;

	private txtcolor = [0xfcf9d7,0xd3bf96,0xdcdcdc];
	private outlinecolor = [0x7d3b00,0x542000,0x3a3a3a];

	public constructor(inf: any,contentname: string = "WorldBossPanel") {
		super(inf, contentname);
		this.isCenter = true;
		this.isShowBossReward = true;
	}

	public initOptUI(): void {
		super.initOptUI();
		let com: fairygui.GComponent = this.getGObject("owner_bossCopy").asCom;//this.getGObject("panel_owner").asCom;
		let ownerView:fairygui.GComponent = com.getChild("panel_owner").asCom;
		ownerView.addEventListener(BossOwnerView.ATTACK_OWNER, this.onAttackOwnerHandler, this);
		this.ownerView = new BossOwnerView(ownerView);
		ownerView.visible = false;

		this.attackBossBtn = com.getChild("btn_boss").asButton;
		this.attackBossBtn.addClickListener(this.onAttackBossHandler, this);
		this.attackBossBtn.text = "攻击BOSS";
		this.selectedBtn(this.attackBossBtn, false, false);

		this.attackOwnerBtn = com.getChild("btn_belong").asButton;
		this.attackOwnerBtn.addClickListener(this.onAttackOwnerHandler, this);
		this.attackOwnerBtn.text = "攻击归属者";
		this.selectedBtn(this.attackOwnerBtn, false, false);

		let rewardObj:fairygui.GObject = this.getGObject("btn_reward");
		if(rewardObj) {
			this.rewardBtn = rewardObj.asButton;
			this.rewardBtn.addClickListener(this.onOpenRewardHandler, this);
		}

		this.XPSetBtn.visible = true;
	}

	public updateAll(data?: any): void {
        this.hasClicked = false;
		this.setRewardBtnShow(true);
		this.updateOwnerInfo();
		this.updateBattleObj();
		this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
		this.setExitBtnShow();
	}

	 /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		//主控制改变，需要重新更新攻击对象
		this.addListen1(LocalEventEnum.LeaderRoleChange,this.onLeaderChangeHandler,this);
		this.addListen1(LocalEventEnum.BattleObjChange,this.onBattleObjChangeHandler,this);
		this.addListen1(UIEventEnum.SceneMapUpdated,this.onSceneUpdateHandler,this);
    }

	public updateOwnerInfo(): void {
		this.attackOwnerBtn.titleColor = Color.White;
		if (CacheManager.bossNew.hasOwner) {
			this.ownerView.updateOwner();
			let info: any = CacheManager.bossNew.ownerInfo;
			if (EntityUtil.isMainPlayer(info.entityId)) {
				this.attackOwnerBtn.text = "我是归属者";
				this.attackOwnerBtn.titleColor = Color.White;
				this.selectedBtn(this.attackOwnerBtn, true, false);
				this.hideGuide();
			}
			else {
				this.attackOwnerBtn.text = "攻击归属者";
				this.selectedBtn(this.attackOwnerBtn, false, false);
				if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossLead) && !this.hasClicked) {
					this.showGuide(this.attackOwnerBtn, "点击攻击");
				}
				else {
					this.hideGuide();
				}
			}
		}
		else {
			this.attackOwnerBtn.text = "攻击归属者";
			this.selectedBtn(this.attackOwnerBtn, false, false);
			this.ownerView.reset();
			this.hideGuide();
		}
		// this.onAttackBossHandler();
	}

	public ownerEntityUpdate(entity: RpgGameObject): void {
		this.ownerView.updateOwnerLife(entity);
	}

	public setRewardBtnShow(isShow: boolean): void {
		if(this.rewardBtn) {
			this.rewardBtn.visible = isShow;
		}
	}

	public setOwnerViewAttackBtnState(state:OwnerAttackBtnState): void {
        this.ownerView.setAttackBtnState(state);
	}

	private onLeaderChangeHandler():void {
		this.updateBattleObj();
	}

	private updateBattleObj(): void {
		if(!CacheManager.king.leaderEntity) return;
		let battleObj: RpgGameObject = CacheManager.king.leaderEntity.battleObj;
		let ownerInfo: any = CacheManager.bossNew.ownerInfo;
		this.attackOwnerBtn.titleColor = Color.White;
		if (battleObj && battleObj.entityInfo) {
			if (battleObj instanceof RpgMonster) {
				if(battleObj.isBoss) {
					this.attackBossBtn.selected = true;
					this.attackBossBtn.text = "正在攻击BOSS";
					this.selectedBtn(this.attackBossBtn, false, true);
				}
				else {
					this.attackBossBtn.selected = false;
					this.attackBossBtn.text = "攻击BOSS";
					this.selectedBtn(this.attackBossBtn, false, false);
				}
				this.attackOwnerBtn.selected = false;
				this.attackOwnerBtn.text = "攻击归属者";
				this.selectedBtn(this.attackOwnerBtn, false, false);
			}
			else if (EntityUtil.isPlayer(battleObj.entityInfo.entityId)) {
				let ownerId: any = ownerInfo != null ? ownerInfo.entityId : null;
				if (CacheManager.bossNew.hasOwner && EntityUtil.isPlayerOther(ownerId,battleObj.entityInfo.entityId)) {
					this.attackOwnerBtn.selected = true;
					this.attackOwnerBtn.text = "正在攻击归属者";
					this.selectedBtn(this.attackOwnerBtn, false, true);
				}
				else {
					this.attackOwnerBtn.selected = false;
					this.attackOwnerBtn.text = "攻击归属者";
					this.selectedBtn(this.attackOwnerBtn, false, false);
				}
				this.attackBossBtn.selected = false;
				this.attackBossBtn.text = "攻击BOSS";
				this.selectedBtn(this.attackBossBtn, false, false);
			}
		}
		else {
			this.attackOwnerBtn.selected = false;
			this.attackOwnerBtn.text = "攻击归属者";
			this.attackBossBtn.selected = false;
			this.attackBossBtn.text = "攻击BOSS";
			this.selectedBtn(this.attackOwnerBtn, false, false);
			this.selectedBtn(this.attackBossBtn, false, false);
		}
		if (CacheManager.bossNew.hasOwner && EntityUtil.isMainPlayer(ownerInfo.entityId)) {
			this.attackOwnerBtn.titleColor = Color.White;
			this.attackOwnerBtn.text = "我是归属者";
			this.selectedBtn(this.attackOwnerBtn, true, false);
		}
	}

	/**攻击boss */
	private onAttackBossHandler(): void {
		if(CacheManager.king.isDead()) {
			Tip.showRollTip(LangCommon.L24);
			return;
		}
		if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady) {
			// this.attackBossBtn.selected = false;
			return;
		}
		let target:RpgGameObject = CacheManager.map.getNearestMonster(-1,-1,false,true);
		let battleObj: RpgGameObject = CacheManager.king.leaderEntity != null ? CacheManager.king.leaderEntity.battleObj : null;
		if (battleObj && !battleObj.isDead() && target == battleObj) {
			Tip.showTip("正在攻击BOSS");
			return;//正在攻击boss
		}
		if(!target || target.isDead()) {
			Tip.showTip("BOSS已被击杀");
		}
		if(target != CacheManager.bossNew.battleObj) {
			CacheManager.king.stopKingEntity(true);
		}
		CacheManager.bossNew.battleObj = target;
	}

	/**攻击归属者 */
	private onAttackOwnerHandler(): void {
		if(CacheManager.king.isDead()) {
			Tip.showRollTip(LangCommon.L24);
			return;
		}
		if (!CacheManager.bossNew.hasOwner) {
			Tip.showTip("暂无归属者");
			this.attackOwnerBtn.selected = false;
			this.selectedBtn(this.attackOwnerBtn, false, false);
			return;
		}
		let ownerInfo: any = CacheManager.bossNew.ownerInfo;
		let ownerId: string = EntityUtil.getEntityId(ownerInfo.entityId);
		let ownerObj: RpgGameObject = CacheManager.map.getEntity(ownerId);
		if (ownerObj && ownerObj.isDead()) {
			ownerObj = CacheManager.map.getOtherPlayer(ownerObj.entityInfo.entityId);
		}
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder) && CacheManager.guildNew.isMyGuild(ownerInfo.guildId_I)){
			Tip.showTip(LangFight.LANG6);
			return;
		}
		
		if(!EntityUtil.checkEntityIsCanAttack(ownerObj,true)) {
			//穹苍阁与穹苍圣殿是同一张地图，穹苍圣殿可攻击仙盟成员
			return;
		}
				
		let king: MainPlayer = CacheManager.king.leaderEntity;
		if (!king) return;

		this.hasClicked = true;
		this.hideGuide();
		
		let battleObj: RpgGameObject = king.battleObj;
		if (battleObj && battleObj.entityInfo && EntityUtil.isPlayerOther(ownerInfo.entityId,battleObj.entityInfo.entityId)) {
			Tip.showRollTip("正在攻击归属者" + HtmlUtil.html(ownerInfo.name_S,Color.Green2));
			return;//正在攻击归属者
		}

		if (ownerObj && ownerObj.entityInfo != null && !ownerObj.isDead() && !EntityUtil.isMainPlayer(ownerInfo.entityId)) {
			if(ownerObj != CacheManager.bossNew.battleObj) {
				CacheManager.king.stopKingEntity(true);
			}
			CacheManager.bossNew.battleObj = ownerObj;
		}
		else {
			if (EntityUtil.isMainPlayer(ownerInfo.entityId)) {
				Tip.showTip("你已是归属者");
			}
			this.attackOwnerBtn.selected = false;
		}
	}

	/**打开奖励界面 */
	public onOpenRewardHandler(): void {
		let mapBossList: any[] = ConfigManager.mgGameBoss.getByMapId(CacheManager.map.mapId);
		if (mapBossList && mapBossList.length > 0) {
			EventManager.dispatch(UIEventEnum.BossRewardPanelOpen, mapBossList[0].bossCode);
		}
	}

	/**
	 * 显示指引
	 */
	private showGuide(btn: fairygui.GComponent, desc: string): void {
		if (this.guideClickView == null) {
			this.guideClickView = new GuideClickView2();
			// this.guideClickView.setMcXY(btn.x - 29, btn.y - 94);
			// this.guideClickView.setTipXY(btn.x + btn.width / 2, btn.y + btn.height - 20);
			this.guideClickView.updateTip(desc, GuideArrowDirection.Bottom);
		}
		// this.addChild(this.guideClickView);
		this.guideClickView.addToParent(this.attackOwnerBtn);
	}

	/**
	 * 隐藏指引
	 */
	private hideGuide(): void {
		if (this.guideClickView != null && this.guideClickView.isShow) {
			this.guideClickView.removeFromParent();
		}
	}

	private selectedBtn(btn: fairygui.GButton, selected: boolean, light: boolean) {
		btn.getController("c1").selectedIndex = selected ? 1 : 0;
		btn.getController("c2").selectedIndex = light ? 1 : 0;
		if(btn == this.attackOwnerBtn && selected){
			btn.titleColor = Color.White;
		}
		else {
			btn.titleColor = Color.White;
		}
		if(!selected && light) {
			btn.titleColor = this.txtcolor[0];
			btn.getTextField().strokeColor = this.outlinecolor[0];
			return;
		}
		if(!selected && !light) {
			btn.titleColor = this.txtcolor[1];
			btn.getTextField().strokeColor = this.outlinecolor[1];
		}
		if(selected) {
			btn.titleColor = this.txtcolor[2];
			btn.getTextField().strokeColor = this.outlinecolor[2];
		}
		
	}

    protected onBattleObjChangeHandler(battleObj:RpgGameObject) {
        this.checkRewardBtn(battleObj && battleObj.entityInfo);
		this.updateBattleObj();
    }

    protected onSceneUpdateHandler():void {
        let bossInfo:EntityInfo = CacheManager.map.getBossEntityInfo();
        this.checkRewardBtn(bossInfo);
	}

	private checkRewardBtn(info:EntityInfo):void {
        if (EntityUtil.isShowBossHp(info)) {
            this.attackBossInfo = info;
            this.setRewardBtnShow(true);
        } else if (!this.attackBossInfo || this.attackBossInfo.life_L64 <= 0) {
            this.attackBossInfo = null;
            this.setRewardBtnShow(false);
        }
	}

    public hide(param: any = null, callBack: CallBack = null): void {
		super.hide(param, callBack);
		this.attackBossInfo = null;
    }
}