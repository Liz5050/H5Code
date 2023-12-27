class BeastBattlePanel extends BaseTabView {
	private showLoader: GLoader;
	private beastList: List;
	private attrList: fairygui.GList;
	private strAttrList: fairygui.GList;
	private battleTxt: fairygui.GTextField;
	private costTxt: fairygui.GRichTextField;
	private skillAllItem: BeastSkillItem;
	private skillOneItem: BeastSkillItem;
	private fightPanel: FightPanel;
	private equipItems: Array<BeastEquipItem>;
	private battleBtn: fairygui.GButton;
	private decomposeBtn: fairygui.GButton;
	private strengthBtn: fairygui.GButton;
	private exchangeBtn: fairygui.GButton;
	private extendBtn: fairygui.GButton;
	private returnBtn: fairygui.GButton;
	private leftBtn: fairygui.GButton;
	private rightBtn: fairygui.GButton;
	private controller: fairygui.Controller;

	private beastData: Array<any>;
	private lastselHole: number;
	private isBattle: boolean;
	private isCanBattle: boolean;
	private isCanStrength: boolean;
	private isMaxLevel: boolean;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.showLoader = <GLoader>this.getChild("loader_show");
		this.beastList = new List(this.getGObject("list_beast").asList);
		this.attrList = this.getGObject("list_attr").asList;
		this.strAttrList = this.getGObject("list_strAttr").asList;
		this.battleTxt = this.getGObject("txt_battle").asTextField;
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.skillAllItem = <BeastSkillItem>this.getGObject("skill_all");
		this.skillOneItem = <BeastSkillItem>this.getGObject("skill_one");
		this.fightPanel = <FightPanel>this.getGObject("fight_panel");
		this.battleBtn = this.getGObject("btn_battle").asButton;
		this.decomposeBtn = this.getGObject("btn_decompose").asButton;
		this.strengthBtn = this.getGObject("btn_strength").asButton;
		this.exchangeBtn = this.getGObject("btn_exchange").asButton;
		this.extendBtn = this.getGObject("btn_extend").asButton;
		this.returnBtn = this.getGObject("btn_return").asButton;
		this.leftBtn = this.getGObject("btn_left").asButton;
		this.rightBtn = this.getGObject("btn_right").asButton;
		this.controller = this.getController("c1");

		this.equipItems = [];
		for (let i = 1; i < 6; i++) {
			let beastEquipItem: BeastEquipItem = <BeastEquipItem>this.getGObject("equip_" + i);
			this.equipItems.push(beastEquipItem);
			beastEquipItem.addClickListener(this.clickEquipItem, this);
		}

		this.beastList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickBeast, this);
		this.battleBtn.addClickListener(this.clickBattleBtn, this);
		this.decomposeBtn.addClickListener(this.clickDecomposeBtn, this);
		this.strengthBtn.addClickListener(this.clickStrengthBtn, this);
		this.exchangeBtn.addClickListener(this.clickExchangeBtn, this);
		this.extendBtn.addClickListener(this.clickExtendBtn, this);
		this.returnBtn.addClickListener(this.clickReturnBtn, this);
		this.leftBtn.addClickListener(this.clickArrowBtn, this);
		this.rightBtn.addClickListener(this.clickArrowBtn, this);
		this.beastList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onScroll, this);
		this.beastList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onScrollEnd, this);
	}

	public updateAll(): void {
		this.updateBeast();
		this.checkBeastListSel();
		this.controller.selectedIndex = 0;
		this.onClickBeast();
		this.onScroll();
	}

	public updatePanel(): void {
		let selected: number = this.beastList.selectedIndex;
		this.updateBeast();
		this.beastList.selectedIndex = selected;
		this.updateEquip();
		this.updateSkill();
		if(!this.isBattle){
			this.controller.selectedIndex = 0;
		}
		if (this.controller.selectedIndex == 0) {
			this.updateAttr();
		} else {
			this.updateStrAttr();
		}
	}

	public onClickBeast(): void {
		this.controller.selectedIndex = 0;
		this.updateEquip();
		this.updateSkill();
		this.updateAttr();
		this.clickEquipItem();
		
	}

	/**点击装备部位 */
	private clickEquipItem(e: any = null): void {
		for (let equip of this.equipItems) {
			equip.selected = false;
		}
		if (e) {
			this.lastselHole = e.target._data.id_BY;
			if(CacheManager.beastBattle.isBeckonByCode(this.equipItems[this.lastselHole - 1].beastCode)){
				e.target.selected = true;
				this.controller.selectedIndex = 1;
				this.updateStrAttr();
			}else{
				EventManager.dispatch(UIEventEnum.BeastEquipReplaceWindowOpen, e.target._data);
			}
			
			
		}
	}

	private clickBattleBtn(): void {
		if (this.isBattle) {
			EventManager.dispatch(LocalEventEnum.BeastBattleRecall, { "code": this.beastList.selectedData.code });
		} else {
			EventManager.dispatch(LocalEventEnum.BeastBattleBeckon, { "code": this.beastList.selectedData.code });
		}
	}

	private clickDecomposeBtn(): void {
		//打开分解界面
		EventManager.dispatch(UIEventEnum.BeastEquipDecomposeWindowOpen);
	}

	/**强化 */
	private clickStrengthBtn(): void {
		if (this.isCanStrength) {
			EventManager.dispatch(LocalEventEnum.BeastBattleStrengthenEquip, { "code": this.beastList.selectedData.code, "holeId": this.lastselHole });
		} else {
			Tip.showTip("神兽经验不足");
		}
	}

	/**打开装备替换界面 */
	private clickExchangeBtn(): void{
		EventManager.dispatch(UIEventEnum.BeastEquipReplaceWindowOpen, this.equipItems[this.lastselHole - 1].getData());
	}

	private clickExtendBtn(): void {
		EventManager.dispatch(UIEventEnum.BeastExtendWindowOpen);
	}

	/**返回出战界面 */
	private clickReturnBtn(): void{
		this.controller.selectedIndex = 0;
		this.updateAttr();
		this.clickEquipItem();
	}

	private clickArrowBtn(e: egret.TouchEvent): void {
		let isLeft: boolean = e.target && e.target.name == "btn_left";
		let idx: number = this.beastList.list.getFirstChildInView();
		if (isLeft) {
			idx -= 5;
			if (idx < 0) {
				idx = 0;
			}
		} else {
			idx += 5;
			if (idx > this.beastData.length - 1) {
				idx = this.beastData.length - 1;
			}
		}
		this.beastList.scrollToView(idx, true, true);
		App.TimerManager.doDelay(800, this.onScrollEnd, this);
	}

	private onScroll(): void {
		if (!this.leftBtn || !this.rightBtn) {
			return;
		}
		let percX: number = this.beastList.list.scrollPane.percX;
		if (percX == 0) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = true;
		}
		else if (percX == 1) {
			this.leftBtn.visible = true;
			this.rightBtn.visible = false;
		}
		else {
			this.leftBtn.visible = true;
			this.rightBtn.visible = true;
		}
	}

	private onScrollEnd(): void {
		if (!this.leftBtn || !this.rightBtn) {
			return;
		}
		let leftTip: boolean = false;
		let rightTip: boolean = false;
		let firstIdx: number = this.beastList.list.getFirstChildInView();
		let item: BeastItem;
		for (let i = 0; i < this.beastList.data.length; i++) {
			if (!this.beastList.isChildInView(i)) {
				item = this.beastList.list.getChildAt(this.beastList.list.itemIndexToChildIndex(i)) as BeastItem;
				if (item && item.getChild(CommonUtils.redPointName) != null) {
					if (i <= firstIdx) {
						leftTip = true;
					}
					else {
						rightTip = true;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.leftBtn.asButton, leftTip);
		CommonUtils.setBtnTips(this.rightBtn.asButton, rightTip, 0, 0, false);
	}

	private checkBeastListSel(): void{
		let selIndex: number = 0;
		for(let i = 0; i < this.beastData.length; i++){
			if(CacheManager.beastBattle.isBeckonByCode(this.beastData[i].code)){
				selIndex = i;
			}
		}
		this.beastList.selectedIndex = selIndex;
		this.beastList.scrollToView(selIndex);
	}


	public updateBeast(): void {
		this.beastData = ConfigManager.mgBeast.getData();
		this.beastList.data = this.beastData;
	}

	public updateEquip(): void {
		let equips: Array<any> = CacheManager.beastBattle.getHoleInfo(this.beastList.selectedData.code);
		let holeData: any;
		this.isCanBattle = true;
		for (let i = 0; i < equips.length; i++) {
			holeData = ConfigManager.mgBeastHole.getByPk(`${this.beastList.selectedData.code},${equips[i].id_BY}`);
			equips[i]["holeData"] = holeData;
			this.equipItems[i].setData(equips[i]);

			if (equips[i].itemCode_I == 0) {//没穿齐装备，不能出战
				this.isCanBattle = false;
			}
		}
		this.isBattle = CacheManager.beastBattle.isBeckonByCode(this.beastList.selectedData.code);
		this.showLoader.load(URLManager.getModuleImgUrl(`show/${this.beastList.selectedData.icon}.png`, PackNameEnum.BeastBattle));
		this.showLoader.grayed = !this.isBattle;
		CommonUtils.setBtnTips(this.extendBtn, CacheManager.beastBattle.checkExtendCardTips(), 38, -10);
		this.onScrollEnd();
	}

	public updateAttr(): void {
		this.battleTxt.text = App.StringUtils.substitude(LangBeast.LANG3, CacheManager.beastBattle.curBattleNum, CacheManager.beastBattle.maxBattleNum);
		this.battleBtn.title = this.isBattle ? LangBeast.LANG4 : LangBeast.LANG5;
		App.DisplayUtils.grayButton(this.battleBtn, !this.isCanBattle, !this.isCanBattle);
		CommonUtils.setBtnTips(this.battleBtn, CacheManager.beastBattle.isCanBattleByCode(this.beastList.selectedData.code));

		let attrDict: any = CacheManager.beastBattle.getEquipAttrDict(this.beastList.selectedData.code);
		this.attrList.removeChildrenToPool();
		for (let key in attrDict) {
			let item: fairygui.GComponent = this.attrList.addItemFromPool().asCom;
			let attrTxt: fairygui.GTextField = item.getChild("txt_attr").asTextField;
			attrTxt.text = `${GameDef.EJewelName[key][0]}： ${attrDict[key]}\n`;
		}
		this.fightPanel.updateValue(WeaponUtil.getCombat(attrDict) * CacheManager.role.roles.length);
	}

	public updateSkill(): void {
		let skillStr: string = this.beastList.selectedData.skillList;
		let skills: Array<string> = skillStr.split(",");
		this.skillOneItem.visible = false;
		this.skillAllItem.visible = false;
		for (let skillId of skills) {
			if (skillId) {
				let skillCfg: any = ConfigManager.skill.getSkill(Number(skillId));
				let stateCfg: any = ConfigManager.state.getByPk(skillCfg.additionState);
				if (stateCfg) {
					if (stateCfg.type == EStateType.EStateOneBeastAttribute) {
						this.skillOneItem.setData(Number(skillId));
						this.skillOneItem.visible = true;
					}
					if (stateCfg.type == EStateType.EStateAllBeastAttribute) {
						this.skillAllItem.setData(Number(skillId));
						this.skillAllItem.visible = true;
					}
				}
			}
		}
	}

	public updateStrAttr(): void {
		let beastEquipItem: BeastEquipItem = this.equipItems[this.lastselHole - 1];
		let itemData: ItemData = beastEquipItem.itemData;
		let attrDict: any = WeaponUtil.getBeastEquipAttrDict(itemData);
		let nextAttrDict: any = WeaponUtil.getBeastEquipNextAttrDict(itemData);
		this.isMaxLevel = ConfigManager.mgBeastStrengthen.isMaxLevel(itemData.getType(), itemData.beastStrLevel);
		this.strAttrList.removeChildrenToPool();
		for (let key in attrDict) {
			let item: fairygui.GComponent = this.strAttrList.addItemFromPool().asCom;
			let attrTxt: fairygui.GTextField = item.getChild("txt_attr").asTextField;
			let nextAttrTxt: fairygui.GTextField = item.getChild("txt_nextAttr").asTextField;
			let img: fairygui.GImage = item.getChild("img").asImage;
			attrTxt.text = `${GameDef.EJewelName[key][0]}： ${attrDict[key]}`;
			nextAttrTxt.text = `${nextAttrDict[key]}`;

			img.visible = this.isMaxLevel;
			nextAttrTxt.visible = this.isMaxLevel;

		}

		let strLevel: number = itemData.beastStrLevel + 1;
		let needExp: number = ConfigManager.mgBeastStrengthen.getNeedExp(itemData.getType(), itemData.beastStrLevel);
		if (needExp > 0) {
			this.isCanStrength = CacheManager.role.getMoney(EPriceUnit.EPriceUnitBeastEquipExp) >= needExp;
			this.costTxt.text = MoneyUtil.getResourceText(CacheManager.role.getMoney(EPriceUnit.EPriceUnitBeastEquipExp), needExp);
			this.strengthBtn.visible = true;
		} else {
			this.costTxt.text = MoneyUtil.getResourceText(CacheManager.role.getMoney(EPriceUnit.EPriceUnitBeastEquipExp), 0);
			this.strengthBtn.visible = false;
		}

		// CommonUtils.setBtnTips(this.strengthBtn, this.equipItems[this.lastselHole - 1].getChild(CommonUtils.redPointName) != null);
		let data: any = beastEquipItem.getData();
		CommonUtils.setBtnTips(this.strengthBtn, CacheManager.beastBattle.checkEquipStrengthByHole(data.holeData.code, data));
		CommonUtils.setBtnTips(this.exchangeBtn, CacheManager.beastBattle.checkEquipDressByHole(data.holeData.code, data.id_BY, data));
	}

}