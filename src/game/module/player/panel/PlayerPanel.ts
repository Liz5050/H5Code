class PlayerPanel extends BaseTabView {
	private loader_playerBg:GLoader;
	private attrBtn: fairygui.GButton;
	private btn_huaxing: fairygui.GButton;
	private btn_zhuangban: fairygui.GButton;
	private btn_jingjie: fairygui.GButton;
	private fashionBtn: fairygui.GButton;
	private magicWeaponBtn: fairygui.GButton;
	private godEquipBtn: fairygui.GButton;
	private runeBtn: fairygui.GButton;
	private magicWareBtn: fairygui.GButton;
	private btnOnekey: fairygui.GButton;
	private oneKeyMc:UIMovieClip;
	private shapeChangeBtn: fairygui.GButton;
	private roleAttrWindow: RoleAttrWindow;
	private posEquipItems: any;//按位置装备项
	private typeEquipItems: any;//按类型装备项
	private typePosMap: any;
	//private nameTxt: fairygui.GTextField;
	//private levelTxt: fairygui.GTextField;
	private txtFight: fairygui.GTextField;
	private chuanshiBtn:fairygui.GButton;

	private roleCache: RoleCache;
	private dressPosAll: number[];
	//测试模型武器
	private modelContainer: fairygui.GComponent;
	private playerModel: PlayerModel;
	private roleItemPanel: RoleItemPanel;
	private typeReplaceEff: any;

	private modelContainer1: fairygui.GComponent;
    private modelBody1: egret.DisplayObjectContainer;
    private model1: ModelShow;


    private modelContainer2: fairygui.GComponent;
    private modelBody2: egret.DisplayObjectContainer;
    private model2: ModelShow;

	

	public constructor() {
		super();
		this.roleCache = CacheManager.role;
	}

	public initOptUI(): void {
		let equipConfs: Array<any> = [
			{ "name": "baseItem_gloves", "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipGloves },//头盔
			{ "name": "baseItem_clothes", "pos": EDressPos.EDressPosClothes, "type": EEquip.EEquipClothes },//衣服
			{ "name": "baseItem_belt", "pos": EDressPos.EDressPosBelt, "type": EEquip.EEquipBelt },//护腿
			{ "name": "baseItem_shoulder", "pos": EDressPos.EDressPosShoulder, "type": EEquip.EEquipShoulder },//护手
			{ "name": "baseItem_shoes", "pos": EDressPos.EDressPosShoes, "type": EEquip.EEquipShoes },//鞋
			{ "name": "baseItem_weapon", "pos": EDressPos.EDressPosWeapon, "type": EEquip.EEquipWeapon },//武器
			//{ "name": "baseItem_spirit", "pos": EDressPos.EDressPosSpirit, "type": EEquip.EEquipSpirit },//守护
			{ "name": "baseItem_jewelry", "pos": EDressPos.EDressPosJewelry, "type": EEquip.EEquipJewelry },//项链
			{ "name": "baseItem_wristlet", "pos": EDressPos.EDressPosWristlet, "type": EEquip.EEquipWristlet },//仙符
			{ "name": "baseItem_helmet", "pos": EDressPos.EDressPosHelmet, "type": EEquip.EEquipHelmet },//手镯
			{ "name": "baseItem_ring", "pos": EDressPos.EDressPosRing, "type": EEquip.EEquipRing },//戒指
			{ "name": "baseItem_heartLock", "pos": EDressPos.EDressPosHeartLock, "type": EEquip.EEquipHeartLock }//同心锁
		];
		this.typeReplaceEff = {};

		this.loader_playerBg = this.getGObject("loader_playerBg") as GLoader;
		this.loader_playerBg.load(URLManager.getModuleImgUrl("player_bg.jpg",PackNameEnum.Player));

		this.modelContainer = this.getGObject("model_container").asCom;
		//this.nameTxt = this.getGObject("txt_name").asTextField;
		//this.levelTxt = this.getGObject("txt_level").asTextField;
		let fightPanel: fairygui.GComponent = this.getGObject("panel_fight").asCom;
		this.txtFight = fightPanel.getChild("txt_fight").asTextField;
		//装备项
		this.posEquipItems = {};
		this.typeEquipItems = {};
		this.typePosMap = {};
		this.dressPosAll = [];
		for (let c of equipConfs) {
			let baseItem: BaseItem = <BaseItem>this.getGObject(c["name"]);
			baseItem.toolTipSource = ToolTipSouceEnum.Role;
			baseItem.enableToolTipOpt = true;
			baseItem.bgVisible = false;
			baseItem.isShowRefineLv = true;
			baseItem.isShowStrengthLevel = true;
			baseItem.isSelectStatus = false;
			let pos: number = c["pos"];
			let type: number = c["type"];
			if (EDressPos.EDressPosSpirit != pos && !WeaponUtil.isSpecialTipsEquip(pos)) { //三种类型的不能一键更换
				this.dressPosAll.push(pos);
			}
			if(WeaponUtil.isSpecialTipsEquip(pos)){//特殊装备不弹出tip，走升级窗口
				baseItem.enableToolTip = false;
			}
			this.posEquipItems[pos] = baseItem;
			this.typeEquipItems[type] = baseItem;
			this.typePosMap[type] = pos;
			baseItem.addClickListener(this.clickBaseItem, this);
		}

		//let weapon: any = CacheManager.role.getModelId(EEntityAttribute.EAttributeWeapon);
		this.playerModel = new PlayerModel();
		this.playerModel.x = 345;
		this.playerModel.y = 335;
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);

		this.getGObject("btn_attr").addClickListener(this.clickAttrBtn, this);
		//this.getGObject("btn_baoshi").addClickListener(this.showStoneTarget, this);
		//this.getGObject("btn_xingji").addClickListener(this.showStarTarget, this);
		//this.getGObject("btn_qianghua").addClickListener(this.showStrengthenTarget, this);
		this.btnOnekey = this.getGObject("btn_onekey").asButton;
		App.DisplayUtils.addBtnEffect(this.btnOnekey,true);
		
		// this.btn_huaxing = this.getGObject("btn_huaxing").asButton;
		// this.btn_huaxing.addClickListener(this.clickChangeBtn, this);
		// this.btn_zhuangban = this.getGObject("btn_zhuangban").asButton;
		// this.btn_zhuangban.addClickListener(this.clickFashionBtn, this);
		this.btnOnekey.addClickListener(this.onClickOneKey, this);
		this.fashionBtn = this.getGObject("btn_fashion").asButton;
		this.chuanshiBtn = this.getGObject("btn_chuanshi").asButton;
		this.fashionBtn.addClickListener(this.clickFashionBtn, this);
		this.chuanshiBtn.addClickListener(this.clickChuanshiBtn, this);
		// this.btn_jingjie = this.getGObject("btn_jingjie").asButton;
		// this.btn_jingjie.addClickListener(this.clickStateBtn, this);
		this.magicWeaponBtn = this.getGObject("btn_magicWeapon").asButton;
		this.magicWeaponBtn.addClickListener(this.clickMagicWeaponBtn, this);
		this.godEquipBtn = this.getGObject("btn_godEquip").asButton;
		this.godEquipBtn.addClickListener(this.clickGodEquipBtn, this);
		this.runeBtn = this.getGObject("btn_rune").asButton;
		this.runeBtn.addClickListener(this.clickRuneBtn, this);
		this.magicWareBtn = this.getGObject("btn_faqi").asButton;
		this.magicWareBtn.addClickListener(this.clickMagicWareBtn, this);
		// this.getGObject("btn_chenghao").addClickListener(this.clickTitleBtn, this);


		this.roleItemPanel = <RoleItemPanel>this.getGObject("panel_roleItem");
		this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);

		GuideTargetManager.reg(GuideTargetName.PlayerOnekeyEquip, this.btnOnekey);

        this.modelContainer1 = this.getGObject("law_container").asCom;
        this.model1 = new ModelShow(EShape.EShapeLaw);
        this.modelBody1 = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody1.addChild(this.model1);
        this.modelBody1.x = 20;
        this.modelBody1.y = 5;
        (this.modelContainer1.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody1);

        this.modelContainer2 = this.getGObject("law_container2").asCom;
        this.model2 = new ModelShow(EShape.EShapeLaw);
        this.modelBody2 = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody2.addChild(this.model2);
        this.modelBody2.x = 20;
        this.modelBody2.y = 5;
        (this.modelContainer2.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody2);
		


		GuideTargetManager.reg(GuideTargetName.PlayerPanelGodEquipBtn, this.godEquipBtn, true);
	}

	public updateAll(): void {
		CacheManager.player.isReplaceRet = true;
		this.updateRoles();
		this.updateName();
		this.updateLevel();
		this.updateFight();
		this.updateEquips(false);
		this.selectedBaseItem(null);
		let roleIndex: number = this.roleItemPanel.getFirstFuncRedTip();
		this.roleItemPanel.selectedIndex = roleIndex;
		this.onRoleSelectChanged(roleIndex, null);
		this.updateBtnTips();
	}

    public addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.PlayerOneKeyEquip, this.onClickOneKey, this);
    }

	public updateMoney(): void{
		this.updateMagicWareTips();
	}

    public updateRoles(): void {
		this.roleItemPanel.updateRoles();
	}

	/**更新名称 */
	public updateName(value: string = ""): void {
		if (value == "") {
			value = this.roleCache.player.name_S;
		}
		//this.nameTxt.text = value;
	}

	/**更新等级 */
	public updateLevel(value: number = -1): void {
		if (value == -1) {
			value = this.roleCache.role.level_I;
		}
		//this.levelTxt.text = value.toString();
	}

	/**更新战力 */
	public updateFight(value: number = -1): void {
		if (value == -1) {
			value = this.roleCache.getRoleComBat(this.roleItemPanel.selectedIndex);
		}
		this.txtFight.text = value.toString();
	}

	/**
	 * 更新所有装备
	 * @param isReplace 是否因为换装 刷新
	 */
	public updateEquips(isReplace: boolean): void {
		if(isReplace) App.SoundManager.playEffect(SoundName.Effect_EquipChange);
		let index: number = this.roleItemPanel.selectedIndex;
		let equipDict: { [key: number]: ItemData } = CacheManager.pack.rolePackCache.getEquips(index);
		let itemData: ItemData;
		let isOneKey: boolean = false;

		for (let type in this.typeEquipItems) {
			let baseItem: BaseItem = this.typeEquipItems[type];
			baseItem.toolTipSource = ToolTipSouceEnum.Role;
			itemData = equipDict[type];

			baseItem.isShowCareerIco = false;
			let grayed: boolean = false;
			if (WeaponUtil.isSpecialTipsEquip(Number(type))) {
				if (!itemData) {
					itemData = WeaponUtil.getSpecialEquipItem(Number(type));
					grayed = true;
				}
			}
			if (itemData) {
				itemData.showStrengthenLevel = WeaponUtil.getEquipStrengthenLevel(index, Number(type), EStrengthenExType.EStrengthenExTypeUpgrade);
				itemData.strengthenLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeUpgrade, index);

				itemData.showCastingLevel = WeaponUtil.getEquipStrengthenLevel(index, Number(type), EStrengthenExType.EStrengthenExTypeCast);
				itemData.castingLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeCast, index);

				itemData.refineLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeRefine, index);
			}
			if (itemData == null) {
				this.clickBaseItem({ "target": baseItem, "isCall": true });
			}
			let pos: number = this.typePosMap[type];

			let isTip: boolean = false;
			let isSpec: boolean = WeaponUtil.isSpecialTipsEquip(Number(type));
			if (pos != EDressPos.EDressPosSpirit) {
				if (itemData && !grayed) {
					isTip = this.setOneKeyVisible(pos);
					if(isSpec){//特殊装备，已穿戴的可升级
						let cfg: any = ConfigManager.mgEquipUpgrade.getByPk(itemData.getCode());
						if(cfg != null){
							let count: number = CacheManager.pack.backPackCache.getItemCountByCode2(cfg.useItemCode);
							isTip = count >= cfg.useItemNum;
						}
					}
				} else if (CacheManager.pack.backPackCache.isHasEquipByDressPos(pos, index)) { //背包是否有该装备					
					isTip = true;
					if (isSpec) {
						itemData = CacheManager.pack.backPackCache.getEquipByDressPos(pos, index)[0]; //背包有 用背包的作为数据
					}
				}
			}
			if (!isOneKey && !isSpec) {
				isOneKey = isTip;
			}

			baseItem.extData = { roleIndex: index,isAncientAttr:true };
			baseItem.itemData = itemData;
			
			if(itemData){
				let ancientLv:number = CacheManager.ancientEquip.getPosLevel(index,Number(type));
				if(ancientLv>0){
					baseItem.ancientUrl = itemData.getAncientRes(ancientLv);
				}				
			}

			if (!WeaponUtil.isCanReplacePos(pos) && itemData) {
				baseItem.setNameText(itemData.getName());
			}

			CommonUtils.setBtnTips(baseItem, isTip);
			App.DisplayUtils.grayCom(baseItem, grayed, ["txt_name", CommonUtils.redPointName]);
			baseItem.setColorMcGrayed(grayed);
			baseItem.bgVisible = false;
		}
		this.btnOnekey.visible = isOneKey;
		this.roleItemPanel.checkTips();
	}

	/**
	 * 更新指定位置上的装备
	 */
	public updateEquipAtPos(pos: number, itemData: ItemData): void {
		(this.posEquipItems[pos] as BaseItem).itemData = itemData;
		this.btnOnekey.visible = this.setOneKeyVisible(pos);
	}

	/**
	 * 更新模型
	 */
	public updateModelByType(type: EEntityAttribute): void {
		this.playerModel.updateModelByType(type);
	}

	public updateBtnTips(): void {
		// CommonUtils.setBtnTips(this.btn_huaxing, CacheManager.player.isHasShapeTips());
		// CommonUtils.setBtnTips(this.btn_zhuangban, CacheManager.player.isHasFashionTips());
		// CommonUtils.setBtnTips(this.btn_jineng, CacheManager.skill.checkTips());
		// this.updateRealmTips();
		this.updateMagicWeaponTips();
		this.updateGodEquipTips();
		this.updateRuneTips();
		this.updateMagicWareTips();
		this.updateFashionTips();
		this.updateChuanshiTips();
	}

	public updateRealmTips(): void {
		// CommonUtils.setBtnTips(this.btn_jingjie, CacheManager.player.isRealmTips());
	}

	public updateMagicWeaponTips(): void {
		let isTip:boolean = CacheManager.sevenDayMagicWeapon.checkCanActived() || CacheManager.copy.isSpiritTip() || CacheManager.magicWeaponStrengthen.checkTips();
		CommonUtils.setBtnTips(this.magicWeaponBtn, isTip);
	}

	public updateGodEquipTips(): void {
		CommonUtils.setBtnTips(this.godEquipBtn, CacheManager.godEquip.checkGodEquipModuleTips());
	}

	public updateRuneTips(): void {
		CommonUtils.setBtnTips(this.runeBtn, CacheManager.rune.checkTips());
	}

	public updateMagicWareTips(): void {
		CommonUtils.setBtnTips(this.magicWareBtn, CacheManager.magicWare.isMagicWareRedTip());
	}

	public updateFashionTips(): void {
		CommonUtils.setBtnTips(this.fashionBtn, CacheManager.fashionPlayer.checkFashionTips());
	}

	public updateChuanshiTips():void{		
		CommonUtils.setBtnTips(this.chuanshiBtn, CacheManager.ancientEquip.checkTips());
	}

	/**
	 * 设置换装特效
	 */
	public setReplaceEff(itemData: ItemData): void {
		let type: number = itemData.getType();
		let baseItem: BaseItem = this.typeEquipItems[type];
		let mc: UIMovieClip = this.typeReplaceEff[type];
		if (!mc) {
			// mc = ObjectPool.pop("UIMovieClip", PackNameEnum.MovieClip, "MCStrengthen");
            mc = UIMovieManager.get(PackNameEnum.MCStrengthen);
			this.typeReplaceEff[type] = mc;
		}
		this.addChild(mc);

		mc.x = baseItem.x - 196;
		mc.y = baseItem.y - 211;
		mc.autoRemove = true;
		mc.playing = true;
		mc.addRelation(baseItem, fairygui.RelationType.Top_Top);
		mc.addRelation(baseItem, fairygui.RelationType.Left_Left);
	}
	private setOneKeyVisible(posType: number): boolean {
		let isOneKey: boolean = false;
		if (WeaponUtil.isCanReplacePos(posType)) {
			var roleIndex: number = this.roleItemPanel.selectedIndex;
			isOneKey = CacheManager.pack.backPackCache.isHasBestScoreEquipByPos(posType, roleIndex);
		}
		return isOneKey;
	}

	/**打开角色属性面板 */
	private clickAttrBtn(): void {
		this.roleAttrWindow = RoleAttrWindow.instance;
		this.roleAttrWindow.show();
		var index: number = this.roleItemPanel.selectedIndex;
		let career: number = CacheManager.role.getRoleCareerByIndex(index);
		this.roleAttrWindow.selectByCareer(career);
	}

	/**点击时装 */
	private clickFashionBtn(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.FashionII,{},ViewIndex.Two);
		// Tip.showTip("功能暂未开放");
		// if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Fashion)) {
		// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Fashion);
		// }
	}

	private clickChuanshiBtn():void{
		Tip.showTip("功能暂未开放");
		//HomeUtil.open(ModuleEnum.AncientEquip);
	}

	private onClickOneKey(e: any): void {
		EventManager.dispatch(UIEventEnum.PlayerOnekeyEquip, { derssPosAll: this.dressPosAll, roleIndex: this.roleItemPanel.selectedIndex });
	}


	/**点击境界 */
	private clickStateBtn(): void {
		HomeUtil.open(ModuleEnum.Realm);
	}

	/**点击称号 */
	private clickTitleBtn(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Title);
	}

	/**点击法宝 */
	private clickMagicWeaponBtn():void{
		if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MagicWeapon)) {
			if(!ControllerManager.sevenDayMagicWeapon.isFused) {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.SevenDayMagicWeapon, {}, ViewIndex.Two);
			}
			else {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWeaponStrengthen, {}, ViewIndex.Two);
			}
		}
	}

	/**点击神装 */
	private clickGodEquipBtn(): void {
		if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.GodEquip)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GodEquip);
		}
	}

	private clickRuneBtn(): void {
		if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Rune)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Rune);
		}
	}

	private clickMagicWareBtn(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare);
	}

	/**点击装备项 */
	private clickBaseItem(e: any): void {
		let baseItem: BaseItem = <BaseItem>e.target;
		let itemData: ItemData = baseItem.itemData;
		if (itemData) {
			this.selectedBaseItem(baseItem);
			if(WeaponUtil.isSpecialTipsEquip(itemData.getType())){
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.SpecialEquip, {"item": itemData, roleIndex: this.roleItemPanel.selectedIndex});
			}
		} else {
			baseItem.selected = false;
			if (!e.isCall) {
				let type: number = this.getTypeByItem(baseItem);
				if (type > -1) {
					if (WeaponUtil.isSpecialTipsEquip(type)) {
						ToolTipManager.showByCode(WeaponUtil.getSpecialEquipCode(type));
					} else {
						let pos: number = ItemsUtil.getEquipPosByType(type);
						EventManager.dispatch(LocalEventEnum.PlayerOpenReplaceEquip, { item: itemData, dressPos: pos, roleIndex: this.roleItemPanel.selectedIndex });
					}

				}
			}


		}
	}

	private getTypeByItem(baseItem: BaseItem): number {
		let type: number = -1;
		for (let key in this.typeEquipItems) {
			if (baseItem == this.typeEquipItems[key]) {
				type = Number(key);
				break;
			}
		}
		return type;
	}

	/**选中一个装备 */
	private selectedBaseItem(baseItem: BaseItem): void {
		/*
		for (let i in this.posEquipItems) {
			let tmp: BaseItem = <BaseItem>this.posEquipItems[i];
			tmp.selected = baseItem == tmp
		}
		*/
	}

	/**
	 * 显示强化目标ToolTip
	 */
	private showStrengthenTarget(): void {
		let toolTipData: ToolTipData = new ToolTipData();
		toolTipData.type = ToolTipTypeEnum.Target;
		let content: string = "";
		let totalLevel: number = CacheManager.pack.rolePackCache.getTotalStrengthenLevel();
		let currentTarget: any = ConfigManager.mgTarget.getStrengthCurrentTarget(totalLevel);
		let nextTarget: any;
		let attrDict: any;
		if (totalLevel >= currentTarget.num) {//没达到第一级目标
			nextTarget = ConfigManager.mgTarget.getStrengthNextTarget(totalLevel);
			content += `装备累计强化+${currentTarget.num}\n`;
			attrDict = WeaponUtil.getAttrDict(currentTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			nextTarget = currentTarget;
		}
		content += `\n<font color="#df22e7">当前强化+${totalLevel}</font>\n\n`;
		if (nextTarget != null) {
			content += `下级目标\n装备累计强化+${nextTarget.num}级\n`;
			attrDict = WeaponUtil.getAttrDict(nextTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			content += "已达到最大强化等级";
		}

		toolTipData.data = { "title": "累计强化加成", "content": content };
		ToolTipManager.show(toolTipData);
	}

	/**
	 * 显示星级目标ToolTip
	 */
	private showStarTarget(): void {
		let toolTipData: ToolTipData = new ToolTipData();
		toolTipData.type = ToolTipTypeEnum.Target;
		let content: string = "";
		let totalLevel: number = CacheManager.pack.rolePackCache.getTotalStarLevel();
		let currentTarget: any = ConfigManager.mgTarget.getStarCurrentTarget(totalLevel);
		let nextTarget: any;
		let attrDict: any;
		if (totalLevel >= currentTarget.num) {//没达到第一级目标
			nextTarget = ConfigManager.mgTarget.getStarNextTarget(totalLevel);
			content += `全身装备星级达到${currentTarget.num}星\n`;
			attrDict = WeaponUtil.getAttrDict(currentTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			nextTarget = currentTarget;
		}
		content += `\n<font color="#df22e7">当前星级共${totalLevel}星</font>\n\n`;
		if (nextTarget != null) {
			content += `下级目标\n全身装备星级达到${nextTarget.num}星\n`;
			attrDict = WeaponUtil.getAttrDict(nextTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			content += "已达到最高星级";
		}

		toolTipData.data = { "title": "装备星级加成", "content": content };
		ToolTipManager.show(toolTipData);
	}

	/**
	 * 显示宝石目标ToolTip
	 */
	private showStoneTarget(): void {
		let toolTipData: ToolTipData = new ToolTipData();
		toolTipData.type = ToolTipTypeEnum.Target;
		let content: string = "";
		let totalLevel: number = CacheManager.pack.rolePackCache.getTotalStoneLevel();
		let currentTarget: any = ConfigManager.mgTarget.getStoneCurrentTarget(totalLevel);
		let nextTarget: any;
		let attrDict: any;
		if (totalLevel >= currentTarget.num) {//没达到第一级目标
			nextTarget = ConfigManager.mgTarget.getStoneNextTarget(totalLevel);
			content += `全身装备宝石共${currentTarget.num}级\n`;
			attrDict = WeaponUtil.getAttrDict(currentTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			nextTarget = currentTarget;
		}
		content += `\n<font color="#df22e7">当前宝石共${totalLevel}级</font>\n\n`;
		if (nextTarget != null) {
			content += `下级目标\n全身装备宝石共${nextTarget.num}级\n`;
			attrDict = WeaponUtil.getAttrDict(nextTarget.attrList);
			for (let type in attrDict) {
				content += `<font color="#FFFFFF">${GameDef.EJewelName[type][0]}</font>：<font color="#00FF00">+${attrDict[type]}</font>\n`;
			}
		} else {
			content += "已达到最高宝石等级";
		}

		toolTipData.data = { "title": "全身宝石加成", "content": content };
		ToolTipManager.show(toolTipData);
	}

	private onRoleSelectChanged(index: number, data: any): void {
		this.updateEquips(false);
		this.txtFight.text = this.roleCache.getRoleComBat(index) + "";
		this.playerModel.updateAll(index);
		this.updateLawModel(index);
	}

	private updateLawModel(roleindex : number) {
        if(CacheManager.magicArray.getInfo(roleindex)) {
            this.model1.visible = true;
            this.model2.visible = true;
        }
        else {
            this.model1.visible = false;
            this.model2.visible = false;
        }
		var info = CacheManager.magicArray.getInfo(roleindex);
		if(info) {
			this.model1.setData(info.useModelId_I);
			if(info.useModelId_I == 1001) {
				this.model2.visible = true;
				this.model2.setData(1002);
			}
			else {
				this.model2.visible = false;
			}
		}
	}
}