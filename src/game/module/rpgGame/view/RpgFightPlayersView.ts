class RpgFightPlayersView extends BaseContentView {
	private controller:fairygui.Controller;
	private c2:fairygui.Controller;
	private c3:fairygui.Controller;
    private c4:fairygui.Controller;
    private c5:fairygui.Controller;
	private c6:fairygui.Controller;
	private c7:fairygui.Controller;

	private attackList:List;//可攻击列表
	private beAttacked:List;//被攻击列表
	private attackTarget:AttackTargetView;

	private player_bar:PlayerInfoBarView;
	private murdererView:MurdererListView;

	private hasClicked: Boolean = false;
	private guideClickView: GuideClickView;

	private fightMc:fairygui.GMovieClip;
	private entitys:EntityInfo[] = [];
	private canAttacks:EntityInfo[] = [];
	private sceneData:any;

	private battleObj:RpgGameObject;
    private shieldBtn: fairygui.GButton;
    private autoFightBtn: fairygui.GButton;
	private btn_nearAttack:fairygui.GButton;

	private showAttack:boolean;
    private showShield:boolean;
    private showAutoFight: boolean;
	private showNearAttack:boolean;
	private showMurdererList:boolean;
	private showBeAttack:boolean;

	private timeIndex:number = -1;
	public constructor() {
		super(PackNameEnum.FightPlayers, "RpgFightPlayersView");
		this.thisParent = LayerManager.UI_Home;
		this.defParent = LayerManager.UI_Home;
		this.isCenter = true;
		// LocalEventEnum.LeaderRoleChange
	}

	public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public initOptUI(): void {
		this.controller = this.getController("c1");
		this.c2 = this.getController("c2");
		this.c3 = this.getController("c3");
		this.c4 = this.getController("c4");
		this.c5 = this.getController("c5");
		this.c6 = this.getController("c6");
		this.c7 = this.getController("c7");

		this.player_bar = this.getGObject("player_bar") as PlayerInfoBarView;
		this.murdererView = this.getGObject("murderer_view") as MurdererListView;
		
		this.attackList = new List(this.getGObject("list_attack").asList);
		this.attackList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onAttackItemClick,this);

		this.beAttacked = new List(this.getGObject("list_beAttacked").asList);
		this.beAttacked.list.addEventListener(fairygui.ItemEvent.CLICK,this.onItemClickHandler,this);
		this.attackTarget = this.getGObject("attack_target") as AttackTargetView;

		this.fightMc = this.attackTarget.getChild("mc_fight").asMovieClip;
		this.fightMc.playing = false;

        this.shieldBtn = this.getGObject("btn_shield").asButton;
        this.shieldBtn.addClickListener(this.onClickShield, this);

        this.autoFightBtn = this.getGObject("btn_autoFight").asButton;
        this.autoFightBtn.addClickListener(this.onClickAutoFight, this);

		this.btn_nearAttack = this.getGObject("btn_nearAttack").asButton;
		this.btn_nearAttack.addClickListener(this.onSwitchNearAttackHandler,this);
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		//主控制改变，需要重新更新攻击对象
		this.addListen1(LocalEventEnum.LeaderRoleChange,this.onLeaderChangeHandler,this);
		this.addListen1(NetEventEnum.BossRewardResult,this.onBossCopyResult,this);
		this.addListen1(LocalEventEnum.HidePlayerFightView,this.hide,this);
		this.addListen1(NetEventEnum.FightEntitysUpdate,this.beAttackedUpdate,this);
		this.addListen1(NetEventEnum.MurdererListUpdate,this.onMurdererUpdate,this);
		this.addListen1(LocalEventEnum.NearAttackSwitch,this.updateNearAttackBtnState,this);
		CacheManager.battle.isNearAttack = false;
    }

	public updateAll(): void {
		this.parent.setChildIndex(this,0);
		this.sceneData = CacheManager.map.getCurMapScene();
		if(!this.sceneData) {
			//防止快速切图过程中，FightPlayers包加载完成，最新地图配置还没加载完成，地图数据取不到
			this.hide();
			return;
		}
		this.showAttack = MapUtil.showCanAttackList();
		this.showNearAttack = MapUtil.showNearAttack();
		this.showMurdererList = MapUtil.showMurdererList();
		this.showBeAttack = MapUtil.showBeAttackedList();
		this.showShield = this.sceneData.shieldModel;
        this.c4.selectedIndex = this.showShield ? 1 : 0;
		this.onMurdererUpdate();
		this.c7.selectedIndex = this.showNearAttack ? 1 : 0;
		this.btn_nearAttack.grayed = !CacheManager.battle.isNearAttack;
		this.shieldBtn.selected = CacheManager.sysSet.getValue(LocalEventEnum.HideOther);
        this.beAttackedUpdate();
		this.attackListUpdate();
		this.updateBattleObj();
		this.fightMc.playing = true;
        this.hasClicked = false;
        if(this.showAttack && !MapUtil.checkNoShowBeAttackedLife()) {
            this.c3.selectedIndex = 1;
        }
		else {
            this.c3.selectedIndex = 0;
        }
		if(this.showAttack) {

            if(this.timeIndex == -1) {
                //每两秒刷新一次可攻击列表
				// App.TimerManager.doTimer(2000,0,this.attackListUpdate,this);
				this.timeIndex = egret.setInterval(this.attackListUpdate,this,2000);
            }
        }

        this.showAutoFight = MapUtil.showAutoFight();
        if (this.showAutoFight) {
            this.c5.selectedIndex = 1;
            this.addListen1(LocalEventEnum.AutoFightChange,this.onAutoFightChange,this);
            this.onAutoFightChange();
            this.attackTarget.visible = false;
		} else {
            this.c5.selectedIndex = 0;
            this.attackTarget.visible = true;
		}
    }

	/**
	 * 更新被攻击列表
	 */
	private beAttackedUpdate():void {
		if(this.showBeAttack) {
			this.entitys = CacheManager.map.getFightEntityInfos();
			this.beAttacked.data = this.entitys;
			if(this.entitys.length > 0) {
				if(this.battleObj && this.battleObj.entityInfo && !this.battleObj.isDead()) {
					this.controller.selectedIndex = 2;
				}
				else {
					this.controller.selectedIndex = 1;
				}

				if(this.entitys.length == 1) {//机器人挂了，需要再次反击指引
					this.hasClicked = false;
				}

				if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossLead) && !this.hasClicked) {
		            this.showGuide(this.beAttacked.list.x+207, this.beAttacked.list.y-67);
		            EventManager.dispatch(LocalEventEnum.ShowBroadStory,{msg:LangCopyHall.L25, isFirst:true});
		        }
		        else {
		        	this.hideGuide();
		        }
			}
			else {
				if(this.battleObj && this.battleObj.entityInfo && !this.battleObj.isDead()) {
					this.controller.selectedIndex = 0;
				}
				else {
					this.controller.selectedIndex = 3;
				}

				this.hideGuide();
			}
		}
		else {
			this.beAttacked.data = null;
			this.controller.selectedIndex = 3;

			this.hideGuide();
		}
	}

	/**
	 * 更新可攻击列表
	 */
	public attackListUpdate():void {
		if(this.showAttack) {
			let isGuildBattle:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar) && CacheManager.guildBattle.position == EGuildBattlePosition.GuildBattle_2;
			let isCrossCopy:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss);
			let firstId:any;
			if(isGuildBattle && CacheManager.guildBattle.hasCollecter) {
				firstId = CacheManager.guildBattle.collectInfo.entityId;
			}
			this.canAttacks = CacheManager.map.getCanAttackPlayerInfos(firstId);
			//判断特定副本，有些不显示最近怪物
			let monster:RpgMonster;
			if(isCrossCopy) {
				if(CacheManager.crossBoss.canShowCollect()) monster = CacheManager.map.getNearestCollect();
			}
			else if(isGuildBattle) {
				if(!CacheManager.guildBattle.hasCollecter) {
					monster = CacheManager.map.getNearestCollect();
				}
			}
			else {
				monster = CacheManager.map.getNearestMonster();
			}
			if(monster && !monster.isDead() && !monster.isBoss) {
				this.canAttacks.unshift(monster.entityInfo);
			}

			let listHeight:number = 565;
			if(this.canAttacks.length <= 4) {
				listHeight = 0;
				let isGuildBossCopy:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder);
				for(let i:number = 0; i < this.canAttacks.length; i++) {
					if(isGuildBossCopy || EntityUtil.isCrossPlayer(this.canAttacks[i].entityId)) {
						listHeight += 165;
					}
					else {
						listHeight += 140;
					}
				}
			}
			this.attackList.list.height = Math.min(listHeight,565);
			this.attackList.setVirtual(this.canAttacks);
			this.c2.selectedIndex = this.canAttacks.length > 0 ? 0 : 1;
		}
		else {
			this.attackList.list.numItems = 0;
			this.c2.selectedIndex = 1;
		}
		this.onMurdererUpdate();
	}

	/**
	 * 更新仇恨列表（击杀过我的玩家）
	 */
	private onMurdererUpdate():void {
		if(!this.showMurdererList)  {
			this.c6.selectedIndex = 0;
			return;
		}
		let murderers:EntityInfo[] = CacheManager.map.getMurdererInfos();
		this.c6.selectedIndex = murderers.length > 0 ? 1 : 0;
		this.murdererView.updateList(murderers);
	}

	private onLeaderChangeHandler():void {
		this.updateBattleObj();
	}

	public updateBattleObj():void {
		if(!CacheManager.king.leaderEntity) return;
		this.battleObj = CacheManager.king.leaderEntity.battleObj;
		if(this.battleObj && this.battleObj.entityInfo && !this.battleObj.isDead()) {
			this.attackTarget.setData(this.battleObj.entityInfo);
			if(this.beAttacked.selectedData) {
				if(this.battleObj.entityInfo.id != this.beAttacked.selectedData.id) {
					this.beAttacked.selectedItem.selected = false;
				}
			}
			let index:number = this.entitys.indexOf(this.battleObj.entityInfo);
			this.beAttacked.selectedIndex = index;
			if(this.beAttacked.data != null && this.beAttacked.data.length > 0) {
				this.showBeAttack && this.controller.setSelectedIndex(2);

				if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossLead) && !this.hasClicked) {
		            this.showGuide(this.beAttacked.list.x+207, this.beAttacked.list.y-67);
		            EventManager.dispatch(LocalEventEnum.ShowBroadStory,{msg:LangCopyHall.L25, isFirst:true});
		        }
		        else {
		        	this.hideGuide();
		        }
			}
			else {
				if(this.battleObj.isDead()) {
					this.controller.setSelectedIndex(3);
				}
				else if(this.showBeAttack){
					this.controller.setSelectedIndex(0);
				}
				this.hideGuide();
			}
			this.player_bar.info = this.battleObj.entityInfo;
		}
		else {
			this.hideGuide();

			this.attackTarget.setData(null);
			if(this.showBeAttack && this.beAttacked.data != null && this.beAttacked.data.length > 0) {
				this.controller.setSelectedIndex(1);
			}
			else {
				this.controller.setSelectedIndex(3);
			}
			this.player_bar.info = null;
		}
		this.player_bar.updateLife();
	}

	/**
	 * 更新攻击目标的血量
	 */
	public updateBattleObjLife(entity:RpgGameObject):void {
		this.attackTarget.updateLife();
		if(this.c3.selectedIndex != 1) return;
		// if(!this.showAttack && MapUtil.checkNoShowBeAttackedLife()) return;
		
		if((entity.objType == RpgObjectType.Monster && entity.isDead())) {
			this.attackListUpdate();
		}
		this.player_bar.updateLife();
	}

	private onItemClickHandler():void {
		let index:number = this.beAttacked.selectedIndex;
		if(index < this.entitys.length) {
			let entity:RpgGameObject = CacheManager.map.getEntity(this.entitys[index].id);
			if(!entity || entity.isDead()) 
			{	
				CacheManager.map.removeFightPlayer(this.entitys[index].entityId);
				CacheManager.bossNew.battleObj = null;
				return;
			}
			if(entity != CacheManager.bossNew.battleObj) {
				CacheManager.king.stopKingEntity(true);
			}
			CacheManager.bossNew.battleObj = entity;
			CacheManager.battle.isNearAttack = false;

			this.hasClicked = true;
			this.hideGuide();
		}
	}

	private onAttackItemClick():void {
		let index:number = this.attackList.list.itemIndexToChildIndex(this.attackList.selectedIndex);
		let item:RpgFightPlayerItem = this.attackList.list.getChildAt(index) as RpgFightPlayerItem;
		let entity:RpgGameObject = item.getTarget();;
		if(!entity || entity.isDead()) {	
			CacheManager.bossNew.battleObj = null;
			Tip.showTip(LangFight.LANG7);
			return;
		}
		if(entity != CacheManager.bossNew.battleObj) {
			CacheManager.king.stopKingEntity(true);
		}
		CacheManager.bossNew.battleObj = entity;
		CacheManager.battle.isNearAttack = false;
	}

	protected onClickShield():void {
		let isHideOther:boolean = this.shieldBtn.selected;
		CacheManager.sysSet.setValue(LocalEventEnum.HideOther, isHideOther);
	}

	protected onClickAutoFight():void {
        if (this.autoFightBtn.selected) {
			let data:any;
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){ //守护仙盟挂机需要参数
				data = CacheManager.guildDefend.getNearPoint();
			}
            EventManager.dispatch(LocalEventEnum.AutoStartFight,data);
        } else {
            let kingEntity:MainPlayer = CacheManager.king.leaderEntity;
            let mainCtrl:MainControlComponent = kingEntity ? <MainControlComponent>kingEntity.controlComponent : null;
            if (mainCtrl) {
                mainCtrl.clickGround(kingEntity.pixPoint.x, kingEntity.pixPoint.y);
            }
        }
	}

	/**
	 * 就近攻击挂机模式切换
	 */
	private onSwitchNearAttackHandler():void {
		if(CacheManager.king.isDead()) {
			Tip.showRollTip(LangCommon.L24);
			return;
		}
		CacheManager.battle.isNearAttack = !CacheManager.battle.isNearAttack;
	}

	private updateNearAttackBtnState():void {
		this.btn_nearAttack.grayed = !CacheManager.battle.isNearAttack;
	}

	private onAutoFightChange():void {
        this.autoFightBtn.selected = CacheManager.king.isAutoFighting;
	}

	private onBossCopyResult():void {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangHall) || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangAttic) ||
			CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossIntruder)) {
			this.hide();
        }
	}

	/**
     * 显示指引
     */
    public showGuide(x:number, y:number): void {
        if (this.guideClickView == null) {
            this.guideClickView = new GuideClickView();
			this.guideClickView.clickMc.scaleX = -1;
            this.guideClickView.setMcXY(x, y);
            this.guideClickView.setTipXY(x+220, y+250);
        }
        this.guideClickView.guideKey = "";
        this.guideClickView.updateTip("点击攻击敌人");
        this.addChild(this.guideClickView);
    }

    /**
     * 隐藏指引
     */
    public hideGuide(): void {
        if (this.guideClickView != null && this.guideClickView.isShow) {
            this.guideClickView.removeFromParent();
        }
    }

	public hide():void {
		super.hide();
		if(this.shieldBtn.selected) CacheManager.sysSet.setValue(LocalEventEnum.HideOther, false);
		this.hideGuide();
		this.fightMc.playing = false;
		CacheManager.battle.isNearAttack = false;
		// App.TimerManager.remove(this.attackListUpdate,this);
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
	}
}