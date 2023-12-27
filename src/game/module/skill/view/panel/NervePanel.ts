class NervePanel extends BaseTabView {
	private c1: fairygui.Controller;
	private c2:fairygui.Controller;
	private nameTxt: fairygui.GTextField;
	private stageTxt: fairygui.GTextField;
	private bgLoader: GLoader;

	private curAttrList: List;
	private nextAttrList: List;

	private txt_cost: fairygui.GTextField;
	private costIcon: GLoader;
	private btn_upgrade: fairygui.GButton;
	private btn_tupo:fairygui.GButton;

	private fightPanel: FightPanel;

	// private effect:fairygui.GMovieClip;
	private ballMc: fairygui.GMovieClip[];

	private level: number;
	private cfg: any;
	private _roleIndex: number;
	private isCanUpgrade: boolean;
	private useItemCode:number;
	public constructor() {
		super();
		this.useItemCode = ConfigManager.mgStrengthenEx.getUseItemCode(EStrengthenExType.EStrengthenExTypeNerve);
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.bgLoader = this.getChild("bgLoader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("nerveBg.jpg", PackNameEnum.Skill));
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.stageTxt = this.getChild("txt_stage").asTextField;
		this.curAttrList = new List(this.getChild("list_currentAttr").asList);
		this.nextAttrList = new List(this.getChild("list_nextAttr").asList);
		this.txt_cost = this.getChild("txt_costNum").asTextField;
		this.costIcon = this.getChild("loader_icon") as GLoader;
		this.costIcon.addClickListener(this.onTouchCostIconHandler, this);
		this.fightPanel = <FightPanel>this.getChild("panel_fight");

		this.ballMc = [];
		for (let i: number = 1; i < 11; i++) {
			let mc: fairygui.GMovieClip = this.getChild("ball_" + i).asMovieClip;
			this.ballMc.push(mc);
			mc.visible = false;
			mc.playing = false;
		}
		// this.effect = this.getChild("mc_upLevel").asMovieClip;

		// this.effect.playing = false;
		// this.effect.visible = false;

		this.btn_upgrade = this.getChild("btn_upgrade").asButton;
		this.btn_upgrade.addClickListener(this.onUpgradeHandler, this);
		this.btn_tupo = this.getChild("btn_tupo").asButton;
		this.btn_tupo.addClickListener(this.onTupoHandler,this);
		this.getGObject("btn_get").asButton.addClickListener(this.clickGet,this);
		GuideTargetManager.reg(GuideTargetName.NervePanelUpgradeBtn, this.btn_upgrade);
	}

	public updateAll(): void {
		this.btn_upgrade.enabled = this.isOpen();
		this.level = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeNerve, this.roleIndex);
		this.cfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeNerve, this.roleIndex);
		let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
		if (itemCfg) {
			this.costIcon.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		}
		this.updateAttrList();
		
		let star:number = this.cfg.star > 0 ? this.cfg.star : 0;
		this.stageTxt.text = App.StringUtils.substitude(LangSkill.L13,FuiUtil.getStageStr(this.cfg.stage),FuiUtil.getStageStr(star));//App.StringUtils.arabicNumToChineseNum(this.cfg.stage) + "阶";
		if (this.level == 0) {
			this.c1.selectedIndex = 0;
		}
		else {
			let index: number = StrengthenExUtil.getCurrentItemIndex(this.level, 10);
			if (index == 0) {
				index = 10;
			}
			this.c1.selectedIndex = index;
		}
		// let index: number = StrengthenExUtil.getCurrentItemIndex(this.level, 11);
		// this.c1.selectedIndex = index;
		// this.c2.selectedIndex = index == 10 ? 1 : 0;
		this.nameTxt.text = this.cfg.showName;
		this.updateProp();
		this.updateFight();
		this.updateBallEffect();
	}

	public updateBallEffect(): void {
		for (let i: number = 0; i < this.ballMc.length; i++) {
			if (i < this.c1.selectedIndex) {
				if (!this.ballMc[i].visible) {
					this.ballMc[i].visible = true;
					this.ballMc[i].setPlaySettings(0, -1, -1, -1);
					this.ballMc[i].playing = true;
				}
			}
			else if (this.ballMc[i].visible) {
				this.ballMc[i].visible = false;
				this.ballMc[i].playing = false;
			}
		}
	}

	public stopBallEffect(): void {
		for (let i: number = 0; i < this.ballMc.length; i++) {
			this.ballMc[i].visible = false;
			this.ballMc[i].playing = false;
		}
	}


	/**
     * 更新战斗力
     */
	private updateFight(): void {
		let attrDict: any;
		let fight: number = 0;
		if (this.cfg != null) {
			fight = WeaponUtil.getCombat(WeaponUtil.getAttrDict(this.cfg.attrList))
		}
		this.fightPanel.updateValue(fight);
	}

	/**
	 * 更新道具
	 */
	public updateProp(): void {
		let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.useItemCode);
		let costNum: number = this.cfg.useItemNum > 0 ? this.cfg.useItemNum : 0;
		let color: string = Color.GreenCommon;
		if (costNum > count) {
			color = Color.RedCommon;
		}
		this.txt_cost.text = `<font color="${color}">${count}/${costNum}</font>`;
		this.isCanUpgrade = count >= costNum;
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	private onUpgradeHandler(): void {
		if (this.isCanUpgrade) {
			App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeNerve, this.roleIndex);
		} else {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
        	Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	/**
	 * 突破
	 */
	private onTupoHandler():void {
		this.onUpgradeHandler();
	}

	/**
	 * 更新属性列表
	 */
	private updateAttrList(): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeNerve, this.level, false);
		this.curAttrList.data = attrListData;
		attrListData = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeNerve, this.level + 1, false);
		this.nextAttrList.data = attrListData;
	}
	
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}
	
	protected onTouchCostIconHandler(): void {
		ToolTipManager.showByCode(this.useItemCode);
	}

	public hide(): void {
		super.hide();
		this.stopBallEffect();
	}
}