class SpecialEquipModule extends BaseWindow {
	private nameLoader: GLoader;
	private curFightPanel: FightPanel;
	private nextFightPanel: FightPanel;
	private curAttrTxt: fairygui.GTextField;
	private nextAttrTxt: fairygui.GTextField;
	private curSkillNameTxt: fairygui.GRichTextField;
	private nextSkillNameTxt: fairygui.GRichTextField;
	private curSkillDescTxt: fairygui.GRichTextField;
	private nextSkillDescTxt: fairygui.GRichTextField;
	private upgradeBtn: fairygui.GButton;
	private getBtn: fairygui.GButton;
	private costTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GTextField;
	private costIcon: GLoader;
	private c1: fairygui.Controller;

	//未激活和满级状态
	private fightPanel: FightPanel;
	private attrTxt: fairygui.GTextField;
	private skillNameTxt: fairygui.GRichTextField;
	private skillDescTxt: fairygui.GRichTextField;

	private modelContainer: fairygui.GComponent;
	private modelShow: ModelShow;

	private curItemData: ItemData;
	private roleIndex: number;
	private useItemCode: number;
	private useItemNum: number;
	private isActived: boolean;
	private isMax: boolean;
	private isHasProp: boolean;


	public constructor(moduleId: ModuleEnum = null) {
		super(PackNameEnum.SpecialEquip, "SpecialEquipModule", moduleId);
	}

	public initOptUI(): void {
		this.nameLoader = <GLoader>this.getGObject("loader_name");
		this.curFightPanel = <FightPanel>this.getGObject("fight_panelCur");
		this.nextFightPanel = <FightPanel>this.getGObject("fight_panelNext");
		this.curAttrTxt = this.getGObject("txt_curAttr").asTextField;
		this.nextAttrTxt = this.getGObject("txt_nextAttr").asTextField;
		this.curSkillNameTxt = this.getGObject("txt_curSkillName").asRichTextField;
		this.nextSkillNameTxt = this.getGObject("txt_nextSkillName").asRichTextField;
		this.curSkillDescTxt = this.getGObject("txt_curSkillDesc").asRichTextField;
		this.nextSkillDescTxt = this.getGObject("txt_nextSkillDesc").asRichTextField;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.getBtn = this.getGObject("btn_get").asButton;
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.costIcon = this.getGObject("loader_icon") as GLoader;
		this.c1 = this.getController("c1");

		this.fightPanel = <FightPanel>this.getGObject("fight_panel");
		this.attrTxt = this.getGObject("txt_attr").asTextField;
		this.skillNameTxt = this.getGObject("txt_skillName").asRichTextField;
		this.skillDescTxt = this.getGObject("txt_skillDesc").asRichTextField;


		this.modelShow = new ModelShow(EShape.EShapeMagic);
		this.modelContainer = this.getGObject("model_container").asCom;
		this.modelContainer.displayListContainer.addChild(this.modelShow);

		this.costIcon.addClickListener(this.onTouchCostIconHandler, this);
		this.getBtn.addClickListener(this.clickGet, this);
		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
	}

	public updateAll(data: any): void {
		this.curItemData = data.item;
		this.roleIndex = data.roleIndex;
		this.updateStatus();
		this.updateAttr();
	}

	public updateModule(data: any): void{
		if(data.roleIndex == this.roleIndex){
			this.updateAll(data);
		}
	}

	private updateAttr(): void {
		// let curSkill: any = ConfigManager.skill.getByPk(this.curItemData.getAddSkills());
		let cfg: any = ConfigManager.mgEquipUpgrade.getByPk(this.curItemData.getCode());
		this.isMax = cfg == null;

		if (this.isActived && !this.isMax) {
			// let curSkill: any = ConfigManager.skill.getByPk(this.curItemData.getAddSkills());
			this.curFightPanel.updateValue(WeaponUtil.getCombatByItemData(this.curItemData));
			this.curAttrTxt.text = WeaponUtil.getAttrText2(WeaponUtil.getBaseAttrDict(this.curItemData), false, null, null, true, false);
			// this.curSkillNameTxt.text = `${curSkill.skillName}LV.${curSkill.skillLevel}`;
			// this.curSkillDescTxt.text = curSkill.skillDescription;

			let curSkillArr: Array<string> = this.curItemData.getAddSkills().split(",");
			this.curSkillDescTxt.text = "";
			for(let i = 0; i < curSkillArr.length; i++){
				let skillCfg: any = ConfigManager.skill.getByPk(curSkillArr[i]);
				if(i == 0){
					this.curSkillNameTxt.text = `${skillCfg.skillName}LV.${skillCfg.skillLevel}`;
				}
				this.curSkillDescTxt.text += skillCfg.skillDescription;
			}


			let nextItem: ItemData = new ItemData(cfg.newEquipCode);
			let nextSkillItem: ItemData = new ItemData(cfg.nextSkillEquipCode);
			// let nextSkill: any = ConfigManager.skill.getByPk(nextSkillItem.getAddSkills());
			this.nextFightPanel.updateValue(WeaponUtil.getCombatByItemData(nextItem));
			this.nextAttrTxt.text = WeaponUtil.getAttrText2(WeaponUtil.getBaseAttrDict(nextItem), false, null, null, true, false);
			// this.nextSkillNameTxt.text = `${nextSkill.skillName}LV.${nextSkill.skillLevel}<font color = ${Color.Color_4}>(${nextSkillItem.getNewItemLevel()}阶激活)</font>`;
			// this.nextSkillDescTxt.text = nextSkill.skillDescription;

			let nextSkillArr: Array<string> = nextSkillItem.getAddSkills().split(",");
			this.nextSkillDescTxt.text = "";
			for(let i = 0; i < nextSkillArr.length; i++){
				let skillCfg: any = ConfigManager.skill.getByPk(nextSkillArr[i]);
				if(i == 0){
					this.nextSkillNameTxt.text = `${skillCfg.skillName}LV.${skillCfg.skillLevel}<font color = ${Color.Color_4}>(${nextSkillItem.getNewItemLevel()}阶激活)</font>`;
				}
				this.nextSkillDescTxt.text += skillCfg.skillDescription;
			}
		} else {
			this.fightPanel.updateValue(WeaponUtil.getCombatByItemData(this.curItemData));
			this.attrTxt.text = WeaponUtil.getAttrText2(WeaponUtil.getBaseAttrDict(this.curItemData), false, null, null, true, false);
			// this.skillNameTxt.text = `${curSkill.skillName}LV.${curSkill.skillLevel}`;
			// this.skillDescTxt.text = curSkill.skillDescription;

			let curSkillArr: Array<string> = this.curItemData.getAddSkills().split(",");
			this.skillDescTxt.text = "";
			for(let i = 0; i < curSkillArr.length; i++){
				let skillCfg: any = ConfigManager.skill.getByPk(curSkillArr[i]);
				if(i == 0){
					this.skillNameTxt.text = `${skillCfg.skillName}LV.${skillCfg.skillLevel}`;
				}
				this.skillDescTxt.text += skillCfg.skillDescription;
			}

			if(this.isMax){
				this.c1.selectedIndex = 2;
			}
		}


		this.modelShow.setData(this.curItemData.getModelId());

		this.levelTxt.text = FuiUtil.getStageStr(this.curItemData.getNewItemLevel()) + "阶";
		this.nameLoader.load(URLManager.getPackResUrl(PackNameEnum.SpecialEquip, `equip_${this.curItemData.getType()}`));

		if(!this.isMax){
			this.useItemCode = cfg.useItemCode;
			this.useItemNum = cfg.useItemNum;
			this.updateProp();
		}else{
			this.upgradeBtn.text = `已满级`;
		}
		App.DisplayUtils.grayButton(this.upgradeBtn, this.isMax, this.isMax);
	}

	private updateStatus(): void {
		this.isActived = CacheManager.pack.rolePackCache.isDressed(this.curItemData);
		if (this.isActived) {
			this.upgradeBtn.text = `升  级`;
			this.c1.selectedIndex = 1;
		} else {
			this.upgradeBtn.text = `激  活`;
			this.c1.selectedIndex = 0;
		}
	}

	public updateProp(): void{
		let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
		let count: number = CacheManager.pack.backPackCache.getItemCountByCode2(this.useItemCode);
		if (itemCfg) {
			this.costIcon.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		}
		this.costTxt.text = MoneyUtil.getResourceText(count, this.useItemNum);
		this.isHasProp = count >= this.useItemNum;
	}


	private clickUpgradeBtn(): void {
		if(this.isHasProp){
			if (this.isActived) {
				ProxyManager.player.upgradeEquipEx(this.roleIndex, this.curItemData.getType());
			} else {
				let itemData: ItemData = CacheManager.pack.backPackCache.getEquipByDressPos(this.curItemData.getType(), this.roleIndex)[0];
				EventManager.dispatch(LocalEventEnum.EquipToRole, itemData, this.roleIndex);
			}
		}else{
			this.clickGet();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
        	Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	private onTouchCostIconHandler(): void {
		ToolTipManager.showByCode(this.useItemCode);
	}

	/**
	 * 获取道具
	 */
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}
}