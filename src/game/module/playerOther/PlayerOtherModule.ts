class PlayerOtherModule extends BaseModule {
	private bgLoader: GLoader;
	private fightTxt:fairygui.GTextField;
	private fightPanel:fairygui.GComponent;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private guildTxt: fairygui.GTextField;
	private stageIcon:GLoader;
	private headIcon:GLoader;
	private loaderFix:GLoader;

	private roleItems:OtherRoleItem[];

	private posEquipItems: any;//按位置装备项
	private typeEquipItems: any;//按类型装备项

	private playerModel: PlayerModel;
	private modelContainer: fairygui.GComponent;
	private roleAttrWindow: WindowOtherRoleAttr;

	private playerData:any;
	private curRoleData:any;
	private weapons:any;
	private curIndex:number = -1;

	private modelContainer1: fairygui.GComponent;
    private modelBody1: egret.DisplayObjectContainer;
    private model1: ModelShow;


    private modelContainer2: fairygui.GComponent;
    private modelBody2: egret.DisplayObjectContainer;
    private model2: ModelShow;
    private attrBtn: fairygui.GButton;


	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.PlayerOther);
	}

	public initOptUI():void {
		this.bgLoader = <GLoader>this.getGObject("loader_bg");
		this.bgLoader.load(URLManager.getModuleImgUrl("player_bg.jpg",PackNameEnum.Player));

		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.guildTxt = this.getGObject("txt_guild").asTextField;
		this.stageIcon = this.getGObject("icon_stage") as GLoader;
		this.headIcon = this.getGObject("head_icon") as GLoader;
		this.loaderFix = this.getGObject("loader_fix") as GLoader;

		this.modelContainer = this.getGObject("model_container").asCom;
		this.playerModel = new PlayerModel();
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);

		this.fightPanel = this.getGObject("panel_fight").asCom;
		this.fightTxt = this.fightPanel.getChild("txt_fight").asTextField;

		this.roleItems = [];
		for(let i:number = 0; i < 3; i++) {
			let roleItem:OtherRoleItem = this.getGObject("role_item_" + i) as OtherRoleItem;
			roleItem.addClickListener(this.onChangeRoleHandler,this);
			this.roleItems.push(roleItem);
		}

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

		//装备项
		this.posEquipItems = {};
		this.typeEquipItems = {};
		for (let c of equipConfs) {
			let baseItem: BaseItem = <BaseItem>this.getGObject(c["name"]);
			baseItem.toolTipSource = ToolTipSouceEnum.Role;
			baseItem.enableToolTipOpt = false;
			baseItem.bgVisible = false;
			baseItem.isShowRefineLv = true;
			baseItem.isShowStrengthLevel = true;
			baseItem.isSelectStatus = false;
			baseItem.isShowCareerIco = false;
			let pos: number = c["pos"];
			let type: number = c["type"];
			this.posEquipItems[pos] = baseItem;
			this.typeEquipItems[type] = baseItem;
			// this.typePosMap[type] = pos;
		}

		this.attrBtn = this.getGObject("btn_attr").asButton;
        this.attrBtn.addClickListener(this.clickAttrBtn, this);


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
	}

	public updateAll(data:any):void {
		this.playerData = data.playerData;
		let roleDates:any[] = this.playerData.roleDatas.data;
		let mainPlayerData:any;
		for(let i:number = 0; i < this.roleItems.length; i++) {
			if(i < roleDates.length) {
				this.roleItems[i].setData(roleDates[i]);
				if(roleDates[i].roleIndex_I == 0) {
					mainPlayerData = roleDates[i];
				}
			}
			else {
				this.roleItems[i].setData(null);
			}
		}
		let lordLv:number = this.playerData.lord_I;
		if(!lordLv || lordLv <= 0) {
			lordLv = 1;
		}
		let info = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,lordLv);
		this.stageIcon.load(CacheManager.nobility.getStageIcoUrl(info.stage));

		if(CacheManager.nobility.isHasFixName(info.stage)){
            this.loaderFix.load(URLManager.getNobilityName(info.stage%NoBilityCache.MAX_NAME_STAGE,true));
        }else{
            this.loaderFix.clear();
        }

		let miniPlayer:any = this.playerData.miniPlayer;		
		this.nameTxt.text = ChatUtils.getPlayerName(miniPlayer);
		let guildName:string = this.playerData.guildName_S != "" ? this.playerData.guildName_S : "无";
		this.guildTxt.text = "仙盟：" + guildName;
		let lvStr:string;
		if(miniPlayer.roleState_I > 0) {
			lvStr = miniPlayer.roleState_I + "转" + miniPlayer.level_SH + "级";
		}
		else {
			lvStr = miniPlayer.level_SH + "级";
		}
		this.levelTxt.text = lvStr;
		if(mainPlayerData) {
			this.headIcon.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(mainPlayerData.career_SH)));
		}
		this.setIndex(0);
        this.closeObj.visible = this.thisParent != LayerManager.UI_Main;
        this.fightPanel.visible = this.attrBtn.visible = data.showFc;
	}

	private onChangeRoleHandler(evt:egret.TouchEvent):void {
		let roleItem:OtherRoleItem = evt.currentTarget as OtherRoleItem;
		if(!roleItem.roleData) return;
		let index:number = this.roleItems.indexOf(roleItem);
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		if(this.curIndex != -1) {
			this.roleItems[this.curIndex].selected = false;
		}
		this.curIndex = index;
		this.roleItems[this.curIndex].selected = true;
		this.curRoleData = this.playerData.roleDatas.data[index];

		this.fightTxt.text = this.curRoleData.warfare_L64.toString();
		this.updateEquips();
		this.updateWeapons();
		this.updateShapeModel();
	}

	private updateEquips():void {
		let baseItem: BaseItem;
		for (let type in this.typeEquipItems) {
			baseItem = this.typeEquipItems[type];
			baseItem.itemData = null;
			if (WeaponUtil.isSpecialTipsEquip(Number(type))) {
				baseItem.itemData = WeaponUtil.getSpecialEquipItem(Number(type));
				baseItem.setNameText(baseItem.itemData.getName());
				baseItem.grayed = true;
				baseItem.setColorMcGrayed(true);
			}
			baseItem.extData = { roleIndex: this.curIndex };
			baseItem.bgVisible = false;
		}

		let strengthIndex:number;
		let strengthType:EStrengthenExType[] = this.curRoleData.strengthenexs.key_I;
		let strengthLv:number[] = this.curRoleData.strengthenexs.value_I;
		for (let sPlayerItemUpdate of this.curRoleData.playerItemUpdates.data) {
			let itemData:ItemData = new ItemData(sPlayerItemUpdate.playerItem);
			let type:EEquip = itemData.getType();

			//强化等级
			strengthIndex = strengthType.indexOf(EStrengthenExType.EStrengthenExTypeUpgrade);
			if(strengthIndex != -1) {
				itemData.showStrengthenLevel = StrengthenExUtil.getItemStrengthenLevel(GameDef.EquipTypeIndex[type], strengthLv[strengthIndex], 8);
				itemData.strengthenLevel = strengthLv[strengthIndex];
			}
			
			//铸造等级
			strengthIndex = strengthType.indexOf(EStrengthenExType.EStrengthenExTypeCast);
			if(strengthIndex != -1) {
				itemData.showCastingLevel = StrengthenExUtil.getItemStrengthenLevel(GameDef.EquipTypeIndex[type], strengthLv[strengthIndex], 8);
				itemData.castingLevel = strengthLv[strengthIndex];
			}

			//精炼等级
			strengthIndex = strengthType.indexOf(EStrengthenExType.EStrengthenExTypeRefine);
			if(strengthIndex != -1) {
				// itemData.showRef = StrengthenExUtil.getItemStrengthenLevel(GameDef.EquipTypeIndex[type], strengthLv[strengthIndex], 8);
				itemData.refineLevel = strengthLv[strengthIndex];
			}

			baseItem = this.typeEquipItems[type];
			if(!baseItem) continue;
			baseItem.itemData = itemData;
			if (WeaponUtil.isSpecialTipsEquip(Number(type))) {
				baseItem.setNameText(itemData.getName());
			}
			baseItem.grayed = false;
			baseItem.setColorMcGrayed(false);
			// sPlayerItemUpdate.playerItem.posType_I;
		}
	}

	private updateWeapons():void {
		this.weapons = {};
		for (let i: number = 0; i < this.curRoleData.weapons.key_I.length; i++) {
			this.weapons[this.curRoleData.weapons.key_I[i]] = this.curRoleData.weapons.value_I[i];
		}
		let modelId: number = WeaponUtil.getModelId(EEntityAttribute.EAttributeWing, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updateWing(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeWeapon, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updateWeapon(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeClothes, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updatePlayer(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeSpirit, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updateSpirit(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeForeverEquipSuit, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updateAncient(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeSwordPool, this.weapons, this.curRoleData.career_SH);
		this.playerModel.updateSwordPoolModel(modelId);
	}

	/**打开角色属性面板 */
	private clickAttrBtn(): void {
		
		WindowOtherRoleAttr.instance.show({playerData:this.playerData.roleDatas.data,curData:this.curRoleData});
		// this.roleAttrWindow = RoleAttrWindow.instance;
		// this.roleAttrWindow.show();
		// var index: number = this.roleItemPanel.selectedIndex;
		// let career: number = CacheManager.role.getRoleCareerByIndex(index);
		// this.roleAttrWindow.selectByCareer(career);
	}

	public hide():void {
		super.hide();
		if(this.curIndex != -1) {
			this.roleItems[this.curIndex].selected = false;
			this.curIndex = -1;
		}
	}

	public updateShapeModel() {
		let modelId: number = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeLaw, this.weapons, this.curRoleData.career_SH);
        if(modelId > 0) {
            this.model1.visible = true;
            this.model2.visible = true;
        }
        else {
            this.model1.visible = false;
            this.model2.visible = false;
        }
		if(modelId == 1001) {
			this.model1.visible = true;
            this.model2.visible = true;
			this.model1.setData(1001);
        	this.model2.setData(1002);
		}
		else {
			this.model1.visible = true;
            this.model2.visible = false;
			this.model1.setData(modelId);
		}
		
	}
}