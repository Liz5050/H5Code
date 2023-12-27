/**
 * 内功
 */

class InnerPowerPanel extends BaseTabView {
	private innerPowerItem: any;
	private fightPanel: FightPanel;
	private openTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private costTxt: fairygui.GTextField;
	private attrList: fairygui.GList;//属性
	private upgradeBtn: fairygui.GButton;
	private oneKeyStrengthenBtn: fairygui.GButton;
	private activeBtn: fairygui.GButton;
	private statusController: fairygui.Controller;
	private c2: fairygui.Controller;

	private innerPowerBall: InnerPowerBall;
	private effectContainer: fairygui.GComponent;

	private cfg: any;
	private curInfo: any;
	private _roleIndex: number = RoleIndexEnum.Role_index0;
	private strengthenLevel: number = 0;
	private curStage: number;
	private isMax: boolean;
	private isCanUpgrade: boolean;

	// /**是否一键提升中 */
    // private isOneKeyPromoteing: boolean = false;
    // private isCanContinuePromote: boolean = true;

	private lastTime: number = 0;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.innerPowerItem = {};
		for (let i = 1; i < 11; i++) {
			let item: fairygui.GComponent = this.getGObject(`innerPowerItem_${i}`).asCom;
			let burnEffect: UIMovieClip = UIMovieManager.get(PackNameEnum.MCInnerPowerBurn, -159, -160);
			burnEffect.name = "effect_burn";
			item.addChild(burnEffect);
			this.innerPowerItem[`item_${i}`] = item;
		}
		this.fightPanel = <FightPanel>this.getGObject("panel_fight");
		this.openTxt = this.getGObject("txt_open").asTextField;
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.costTxt = this.getGObject("txt_cost").asTextField;
		this.attrList = this.getGObject("list_attr").asList;
		this.activeBtn = this.getGObject("btn_active").asButton;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.oneKeyStrengthenBtn = this.getGObject("btn_oneKeyStrengthen").asButton;
		this.oneKeyStrengthenBtn.sound = "";
		this.statusController = this.getController("c1");
		this.c2 = this.getController("c2");

		this.innerPowerBall = <InnerPowerBall>this.getChild("innerPowerBall");
		this.effectContainer = this.getGObject("effectContainer").asCom;

		this.activeBtn.addClickListener(this.clickActivethen, this);
		this.upgradeBtn.addClickListener(this.clickStrengthen, this);
		this.oneKeyStrengthenBtn.addClickListener(this.clickOneKeyStrength, this);
		GuideTargetManager.reg(GuideTargetName.InnerPowerActiveBtn, this.activeBtn);
		GuideTargetManager.reg(GuideTargetName.InnerPowerUpgradeBtn, this.upgradeBtn);
	}

	public updateAll(): void {
		this.updateActiveStatus();
		// this.updateOneKeyBtn();
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.updateAll();
		// this.stopOneKey();

		// App.TimerManager.remove(this.clickPromote, this);
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	/**激活 */
	private clickActivethen(): void {
		EventManager.dispatch(LocalEventEnum.PlayerStrengthExActive, EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
	}

	/**强化 */
	public clickStrengthen(): void {
		if (this.isMax) {
			Tip.showOptTip("当前已达等级上限，无法继续升级");
			return;
		}
		if(Date.now() - this.lastTime > 1500){
			if (this.isCanUpgrade) {
				App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
				EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
			} else {
				EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
				Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, "铜钱"));
			}
		}
	}

	/**一键升级 */
	public clickOneKeyStrength(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex, false, 0, true);
		} else {
			EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
			Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, "铜钱"));
		}
	}

	// /**点击一键提升/停止 */
    // private clickOnekey(): void {
    //     if (this.isOneKeyPromoteing) {
    //         this.stopOneKey();
    //         return;
    //     }

    //     if (!this.isCanContinuePromote) {
    //         return;
    //     }
    //     this.isOneKeyPromoteing = true;
    //     this.clickPromote(false);
    //     this.updateOneKeyBtn();
    // }

	// private updateOneKeyBtn(): void {
	// 	if(this.cfg){
	// 		if (this.isOneKeyPromoteing) {
	// 			this.upgradeBtn.text = LangForge.L12[0];
	// 		} else {
	// 			this.upgradeBtn.text = this.cfg.useMoneyNum ? LangForge.L12[1] : LangForge.L12[2];
	// 		}
	// 	}
    // }

	// /**
    //  * 停止一键提升
    //  */
    // private stopOneKey(): void {
    //     this.isOneKeyPromoteing = false;
    //     this.updateOneKeyBtn();
    // }

	// /**
    //  * 提升
    //  * @param {boolean} isAuto 是否为自动点击的
    //  */
    // private clickPromote(isAuto: boolean = true): void {
    //     if (this.isMax) {
    //         Tip.showOptTip(LangForge.L14);
    //         this.stopOneKey();
    //         return;
    //     }
    //     if (this.isCanUpgrade) {
	// 		// this.isCanPlayMc = true;
    //         App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
	// 		EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
    //     } else {
    //         if (!isAuto) {//一键提升材料不足时不弹窗
    //             EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
    //         }
	// 		Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, "铜钱"));
    //         this.stopOneKey();
    //     }
    // }

	/**
	 * 根据强化结果更新
	 */
	public updateBySUpgradeStrengthenEx(info: SUpgradeStrengthenEx): void {
		if (info.result) {
			this.innerPowerBall.value = this.cfg["luckyNeed"];
			this.onUpgrade();
			// this.stopOneKey();
		} else {
			this.updateAll();
		}

		// this.isCanContinuePromote = true;
        // if (this.isOneKeyPromoteing) {
        //     App.TimerManager.doDelay(50, this.clickPromote, this);
        // }
	}

	private onUpgrade(): void {
		// let curCfg: any = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
		// if (curCfg.stage > this.curStage) {
		// 	// ResourceManager.load(PackNameEnum.MCInnerPower, UIManager.getPackNum(PackNameEnum.MCInnerPower), new CallBack(this.playerSuccessMc, this));
		// 	this.playerSuccessMc();
		// } else {
		// 	// ResourceManager.load(PackNameEnum.MCInnerPower, UIManager.getPackNum(PackNameEnum.MCInnerPower), new CallBack(this.playerUpStar, this, false));
		// 	this.playerUpStar(false);
		// }
		this.playerUpStar(false);
	}

	/**升星 */
	private playerUpStar(isUpStage: boolean): void {
		let mcBig: UIMovieClip;
		let mcFly: UIMovieClip;
		let mcSmall: UIMovieClip;
		let ballNum: number = this.cfg.star ? this.cfg.star : 0;
		if (mcBig == null) {
			mcBig = UIMovieManager.get(PackNameEnum.MCInnerPowerBig, 60, 168);
			mcBig.alpha = 1;
			mcBig.playing = true;
			mcBig.frame = 0;
			// mcBig.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Center_Center);
		}
		if (mcFly == null) {
			mcFly = UIMovieManager.get(PackNameEnum.MCInnerPowerFly);
			mcFly.playing = true;
			mcFly.frame = 0;
			if(ResourceManager.isPackageLoaded(mcFly.pkgName)){
				this.setMCFly(mcFly, ballNum);
			}else{
				mcFly.addEventListener(UIMovieClip.Ready, ()=>{
					this.setMCFly(mcFly, ballNum);
				}, this);
			}
		}
		if (mcSmall == null) {
			mcSmall = UIMovieManager.get(PackNameEnum.MCInnerPowerSmall);

			mcSmall.x = -208;
			mcSmall.y = -211;
			mcSmall.playing = true;
			mcSmall.frame = 0;
		}

		this.effectContainer.addChild(mcBig);
		mcBig.setPlaySettings(0, -1, 1, -1, function (): void {
			// mcBig.destroy();
			mcBig.playing = false;
			egret.Tween.get(mcBig).to({alpha: 0}, 300).call(() => {
				UIMovieManager.push(mcBig);
				mcBig = null;
			} ,this);
		}, this);

		let item: fairygui.GComponent;
		if(this.innerPowerItem[`item_${ballNum + 1}`]){
			item = this.innerPowerItem[`item_${ballNum + 1}`].asCom;
		}
		this.effectContainer.addChild(mcFly);
		mcFly.setPlaySettings(0, -1, 1, -1, function (): void {
			UIMovieManager.push(mcFly);
			mcFly = null;

			if(!this.innerPowerItem[`item_${ballNum + 1}`]){
				UIMovieManager.push(mcSmall);
				mcSmall = null;
				return;
			}
			item = this.innerPowerItem[`item_${ballNum + 1}`].asCom;
			item.addChild(mcSmall);
			mcSmall.setPlaySettings(0, -1, 1, -1, function (): void {
				// mcSmall.destroy();
				UIMovieManager.push(mcSmall);
				mcSmall = null;
			}, this);
			this.updateAll();
		}, this);
	}

	private setMCFly(mcFly: UIMovieClip, ballNum: number): void{
		mcFly.x = 212;
		mcFly.y = 2;
		mcFly.mc.pivotX = 0.5;
		mcFly.mc.pivotY = 0.57;
		mcFly.mc.rotation = -121.5 + (ballNum) * 27;
	}

	/**升阶特效 */
	private playerSuccessMc(): void {
		let effectSmall: Array<any> = [];
		let centerPoint: egret.Point = this.innerPowerBall.localToGlobal();
		let mcBig: UIMovieClip;
		this.lastTime = Date.now();
		for (let key in this.innerPowerItem) {
			let item: fairygui.GComponent = this.innerPowerItem[key];
			let burnEffect: UIMovieClip = UIMovieManager.get(PackNameEnum.MCInnerPowerBurn, item.localToGlobal().x - 208, item.localToGlobal().y - 211);
			// burnEffect.x = item.localToGlobal().x - 208;
			// burnEffect.y = item.localToGlobal().y - 211;
			let endX: number = centerPoint.x + this.innerPowerBall.width / 2 - burnEffect.width / 2;
			let endY: number = centerPoint.y + this.innerPowerBall.height / 2 - burnEffect.height / 2;
			burnEffect.playing = true;
			burnEffect.frame = 0;

			this.addChild(burnEffect);
			egret.Tween.get(burnEffect).to({ x: endX, y: endY }, 300).call(() => {
				// burnEffect.removeFromParent();
				// burnEffect.playing = false;
				UIMovieManager.push(burnEffect);
				burnEffect = null;

				if (mcBig == null) {
					mcBig = UIMovieManager.get(PackNameEnum.MCInnerPowerBig, 60, 168);
					mcBig.alpha = 1;
					mcBig.playing = true;
					mcBig.frame = 0;
					// mcBig.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Center_Center);
					this.effectContainer.addChild(mcBig);
					mcBig.setPlaySettings(0, -1, 1, -1, function (): void {
						mcBig.playing = false;
						egret.Tween.get(mcBig).to({alpha: 0}, 300).call(() => {
							UIMovieManager.push(mcBig);
							mcBig = null;
						} ,this);
					}, this);
				}
				this.updateAll();
			}, this);
		}
		// this.updateAll();
	}

	private updateActiveStatus(): void {
		this.curInfo = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
		if (this.curInfo && this.curInfo.active != 0) {
			this.statusController.selectedIndex = 1;
			this.strengthenLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
			this.isMax = this.strengthenLevel == ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeInternalForce);
			this.cfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeInternalForce, this.roleIndex);
			this.curStage = this.cfg.stage;
			if (!this.cfg.stage) {
				this.curStage = 0;
			}
			this.updateStrengthen();
			this.updateAttrList(this.strengthenLevel);
			this.updateMoney();
			if(this.isMax){
				this.statusController.selectedIndex = 3;
				// this.stopOneKey();
				return;
			}
			// this.upgradeBtn.text = "修  炼";
			if (!this.cfg.useMoneyNum) {
				// this.upgradeBtn.text = "凝  气";
				this.statusController.selectedIndex = 2;
				// this.stopOneKey();
			}
			
		} else {
			this.statusController.selectedIndex = 0;
			CommonUtils.setBtnTips(this.activeBtn, true);
			this.openTxt.text = `${ConfigManager.mgOpen.getOpenCondDesc(PanelTabType[PanelTabType.InnerPower])}可激活内功`;
		}
	}

	/**
	 * 更新强化等级
	 */
	private updateStrengthen(): void {
		let currentDict: any = WeaponUtil.getAttrDict(this.cfg.attrList);
		this.fightPanel.updateValue(Number(this.curInfo.warfare));
		this.levelTxt.text = `${FuiUtil.getStageStr(this.curStage)}重`;
		this.updateItem(this.cfg.star);

		if (this.cfg.luckyNeed) {
			this.innerPowerBall.max = this.cfg.luckyNeed;
			this.innerPowerBall.value = this.curInfo.lucky;
		} else {
			this.innerPowerBall.max = 1;
			this.innerPowerBall.value = 1;
		}
	}

	/**
	 * 更新属性列表
	 * @param level 等级
	 */
	private updateAttrList(level: number): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeInternalForce, level);
		this.attrList.removeChildrenToPool();
		for (let data of attrListData) {
			let item: fairygui.GComponent = this.attrList.addItemFromPool().asCom;
			let sumTxt: fairygui.GTextField = item.getChild("txt_typeSum").asTextField;
			let increaseTxt: fairygui.GTextField = item.getChild("txt_typeIncrease").asTextField;
			sumTxt.text = `${data.name}+${data.value}`;
			increaseTxt.text = `${data.nextValue}`;
		}
	}

	/**
	 * 更新道具/货币
	 */
	public updateMoney(): void {
		if (this.cfg) {
			// let count: number = CacheManager.role.getMoney(this.cfg["useMoneyCode"]);
			let costNum: number = this.cfg["useMoneyNum"] ? this.cfg["useMoneyNum"] : 0;
			this.isCanUpgrade = MoneyUtil.checkEnough(this.cfg["useMoneyCode"], costNum, false);
			this.costTxt.text = `${costNum}`;
			if (this.isCanUpgrade) {
				this.costTxt.color = Color.Green2;
			} else {
				this.costTxt.color = Color.Red;
				// this.stopOneKey();
			}
		}
		this.updateBtn();
	}

	public updateBtn(): void{
		if(CacheManager.checkPoint.curFloor < 14){
			this.c2.selectedIndex = 0;
			// CommonUtils.setBtnTips(this.upgradeBtn, this.isCanUpgrade);
		}else{
			this.c2.selectedIndex = 1;
			// CommonUtils.setBtnTips(this.upgradeBtn, false);
			// CommonUtils.setBtnTips(this.oneKeyStrengthenBtn, this.isCanUpgrade);
		}
	}

	private updateItem(num: number): void {
		for (let i = 1; i < 11; i++) {
			let item: fairygui.GComponent = this.innerPowerItem[`item_${i}`].asCom;
			let controller: fairygui.Controller = item.getController("c1");
			let burnEffect: UIMovieClip = <UIMovieClip>item.getChild("effect_burn");
			controller.selectedIndex = i <= num ? 1 : 0;
			burnEffect.visible = i <= num;
		}
	}
}