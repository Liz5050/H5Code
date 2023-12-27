class ToolTipPetEquip extends ToolTipBase {
	private controller: fairygui.Controller;
	private nameTxt: fairygui.GRichTextField;
	private scoreTxt: fairygui.GTextField;
	private posTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private attrTxt: fairygui.GRichTextField;
	private suitTxt: fairygui.GRichTextField;
	private fightPanel: FightPanel;
	private upgradeBtn: fairygui.GButton;

	private baseItem: BaseItem;
	private itemData: ItemData;
	private petEquipType: number;

	private bgImg: fairygui.GImage;
	private addY: number = 0;

	private btn_replcace : fairygui.GButton;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;
	private petType: Array<number> = [EShapePetEquipType.EShapePetEquipTypeOne,
		EShapePetEquipType.EShapePetEquipTypeTow, EShapePetEquipType.EShapePetEquipTypeThree,
		EShapePetEquipType.EShapePetEquipTypeFour];

	public constructor() {
		super(PackNameEnum.Common, "ToolTipPetEquip");
	}

	public initUI(): void {
		super.initUI();
		this.controller = this.getController("c1");
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.scoreTxt = this.getChild("txt_score").asTextField;
		this.posTxt = this.getChild("txt_pos").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.attrTxt = this.getChild("txt_attr").asRichTextField;
		this.suitTxt = this.getChild("txt_suit").asRichTextField;
		this.fightPanel = this.getChild("fight_panel") as FightPanel;
		this.upgradeBtn = this.getChild("btn_upgrade").asButton;
		this.baseItem = <BaseItem>this.getChild("baseItem");
		
		this.baseItem.isShowName = false;
		this.btn_replcace = this.getChild("replace").asButton;
		this.bgImg = this.getChild("n0").asImage;

		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
		this.btn_replcace.addClickListener(this.clickReplace, this);
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {

				let equipData: any = ConfigManager.mgShapeEquip.getByItemCode(this.itemData.getCode());
				let attrDict: any = WeaponUtil.getAttrDict(equipData.attrList);
				let fight:number = WeaponUtil.getCombat(attrDict) * CacheManager.role.roles.length;
				let attrStr: string = WeaponUtil.getAttrText2(attrDict, true, Color.Color_8, Color.Color_7, true, false);
				if(this.itemData.getShape() == EShape.EShapePet){
					fight = WeaponUtil.getCombat(attrDict) * CacheManager.role.roles.length;
				}else{
					fight = WeaponUtil.getCombat(attrDict);
				}
				this.nameTxt.text = this.itemData.getName(true);
				this.petEquipType = equipData.type;
				this.setPosTxt(this.itemData.getShape(), this.petEquipType);
				this.levelTxt.text = WeaponUtil.getEquipLevelText(this.itemData, false);
				this.scoreTxt.text = `评分：${fight}`;
				this.fightPanel.updateValue(fight);
				this.attrTxt.text = `<font size = "24" color = ${Color.Color_2}}>基本属性</font>\n` + attrStr.slice(0, attrStr.length - 1);

				//套装
				if(this.itemData.getShape() == EShape.EShapePet){
					this.suitTxt.text = this.getSuitStr();
				}else{
					this.controller.selectedIndex = 0;
					this.suitTxt.text = "";
					if(this.toolTipSource == ToolTipSouceEnum.PetEquip){
						this.addY = 60;
					}else{
						this.addY = -15;
					}
				}
			}
			this.baseItem.itemData = this.itemData;
			this.updateBtn();
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}

	private setPosTxt(shape : EShape, type : number) {
		switch(shape) {
			case EShape.EShapeLaw: 
				this.posTxt.text = GameDef.EShapeLawEquipType[type];
				break;
			case EShape.EShapePet: 
				this.posTxt.text = GameDef.EShapePetEquipType[type];
				break;
			case EShape.EShapeBattle:
				this.posTxt.text = GameDef.EShapeBattleEquipType[type];
				break;
			case EShape.EShapeMount: 
				this.posTxt.text = GameDef.EShapeMountEquipType[type];
				break;
			case EShape.EShapeSwordPool:
				this.posTxt.text = GameDef.EShapeSwordPoolEquipType[type];
				break;
			default: 
				this.posTxt.text = "";
				break;
		}
	}

	private clickUpgradeBtn(): void{
		// if(CacheManager.pet.checkEquipUpgradeByType(this.petEquipType)){
		// }
		ProxyManager.shape.shapeUpgradeEquip(EShape.EShapePet, this.petEquipType);
		this.hide();
	}

	private updateBtn(): void{
		let isCanUpgrade: boolean = CacheManager.pet.checkEquipUpgradeByType(this.petEquipType);
		App.DisplayUtils.grayButton(this.upgradeBtn, !isCanUpgrade, !isCanUpgrade);
	}

	private getSuitStr(): string{
		let suitCfg: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeShapeEquip},${EShape.EShapePet},${this.itemData.getItemLevel()},4`);
		let suitTitleStr: string = "";
		let suitStr: string = "";
		let titleColor: string = Color.Color_6;
		let suitAttrColor: string = Color.Color_7;
		let activeNum: number = 0;
		if(this.toolTipSource == ToolTipSouceEnum.PetEquip){//宠物界面
			let equipInfo: any = CacheManager.pet.getEquips();
			for(let type of this.petType){
				let equipLevel: number = 0;
				if(equipInfo[type]){
					let equipData: ItemData = new ItemData(equipInfo[type]);
					equipLevel = equipData.getItemLevel();
				}
				if(equipLevel >= this.itemData.getItemLevel()){
					suitStr += `<font color = ${Color.Color_7}>${GameDef.EShapePetEquipType[type]}、</font>`;
					activeNum += 1;
				}else{
					suitStr += `<font color = ${Color.Color_9}>${GameDef.EShapePetEquipType[type]}、</font>`;
				}
			}
			if(activeNum != this.petType.length){
				titleColor = Color.Color_4;
				suitAttrColor = "#786b52";
			}
			this.controller.selectedIndex = 1;
			this.addY = 80;
		}else{
			for(let type of this.petType){
				if(type == this.petEquipType){
					suitStr += `<font color = ${Color.Color_7}>${GameDef.EShapePetEquipType[type]}、</font>`;
				}else{
					suitStr += `<font color = ${Color.Color_9}>${GameDef.EShapePetEquipType[type]}、</font>`;
				}
			}
			activeNum = 1;
			this.addY = 0;
			this.controller.selectedIndex = 0;
		}
		if(suitStr != ""){
			suitStr = suitStr.slice(0, suitStr.length - 8);
			suitStr += "</font>\n";
		}
		if(suitCfg != null){
			suitTitleStr = `<font size = "24"}><font color = ${Color.Color_2}>${suitCfg.suitName}属性</font><font color = ${titleColor}> (${activeNum}/4)</font></font>\n`;
			return suitTitleStr + suitStr + `<font color = ${suitAttrColor}>${suitCfg.effectDesc}</font>`;
		}

		return "";
	}

	public center(): void {
		this.bgImg.height = this.suitTxt.height + this.suitTxt.y + 20 + this.addY;
		// let centerX: number = (fairygui.GRoot.inst.width - this.width) / 2;
		// let centerY: number = (fairygui.GRoot.inst.height - this.height) / 2;
		// this.setXY(centerX, centerY);
		super.center();
	}

	public enableOptList(enable:boolean):void{
		this.btn_replcace.visible = this.toolTipData.extData == "equip";
	}

	public clickReplace() {
		var cfg = ConfigManager.mgShapeEquip.getByItemCode(this.itemData.getCode());
		var equipData = {"dressPos": cfg.type,  "roleIndex":this.toolTipData.roleIndex, "shape":cfg.shape};
		EventManager.dispatch(UIEventEnum.ShapeEquipReplaceOpen,equipData);
		this.hide();
	}
}