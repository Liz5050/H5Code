class ForgeCastingPanel extends ForgeBaseTabPanel {

	private items: ForgeCastingItem[];
	private itemLines: ForgeCastingLineItem[];
	private list_attr: List;
	private costTxt: fairygui.GRichTextField;
	private costIcon: GLoader;
	private castingBtn: fairygui.GButton;
	private getBtn: fairygui.GButton;

	/**活动按钮 */
    private activityIcon: MaterialsActivityGetItem;

	private isMax: boolean;
	private isCanUpgrade: boolean;
	private equipConfs: Array<any>;

	private lastUpdateIndex: number = 0;
	private mcSuccess: UIMovieClip;

	public constructor() {
		super();
		this.type = EStrengthenExType.EStrengthenExTypeCast;
	}

	public initOptUI(): void {
		this.items = [];
		this.itemLines = [];
		this.equipConfs = [
			{ "pos": EDressPos.EDressPosWeapon, "type": EEquip.EEquipWeapon },//武器
			{ "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipGloves },//头盔
			{ "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipWristlet },//护符
			{ "pos": EDressPos.EDressPosClothes, "type": EEquip.EEquipClothes },//衣服
			{ "pos": EDressPos.EDressPosShoulder, "type": EEquip.EEquipShoulder },//护手
			{ "pos": EDressPos.EDressPosBelt, "type": EEquip.EEquipBelt },//护腿
			{ "pos": EDressPos.EDressPosRing, "type": EEquip.EEquipHelmet },//手镯
			{ "pos": EDressPos.EDressPosShoes, "type": EEquip.EEquipShoes },//鞋
		];
		for (let i: number = 0; i < this.equipConfs.length; i++) {
			let item: ForgeCastingItem = new ForgeCastingItem(this.getGObject("item" + (i + 1)).asCom, i);
			item.updateAll(this.equipConfs[i].type);
			this.items.push(item);
			if (i < 7) {
				let line: ForgeCastingLineItem = new ForgeCastingLineItem(this.getGObject("line" + (i + 1)).asCom);
				this.itemLines.push(line);
			}
		}
		this.list_attr = new List(this.getGObject("list_attr").asList);
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.costIcon = this.getGObject("loader_icon") as GLoader;
		this.costIcon.addClickListener(this.onTouchCostIconHandler, this);
		this.castingBtn = this.getGObject("btn_casting").asButton;
		this.castingBtn.addClickListener(this.clickCasting, this);
		this.getBtn = this.getGObject("btn_get").asButton;
		this.getBtn.addClickListener(this.clickGet, this);

		this.activityIcon = <MaterialsActivityGetItem>FuiUtil.createComponent(PackNameEnum.Common, "MaterialsActivityGetItem", MaterialsActivityGetItem);
        this.activityIcon.setParent(this, 15, 875);

		GuideTargetManager.reg(GuideTargetName.CastingBtn, this.castingBtn);
	}

	public updateAll(): void {
		super.updateAll();
		let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
		if (itemCfg) {
			this.costIcon.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		}
		this.updateAttrList();
		let lv: number = this.level % this.items.length;
		for (let i: number = 0; i < this.items.length; i++) {
			this.items[i].selected = lv >= i;
			if (lv >= i) {
				this.lastUpdateIndex = i;
			}
			this.items[i].updateLevel(this.level);
			if (i < this.itemLines.length) {
				this.itemLines[i].selected = lv > i;
			}
		}
		this.updateProp();
		// this.playerSuccessMc();

		if(!this.isMax){
            this.activityIcon.setData(this.useItemCode);
        }else{
            this.activityIcon.setData(0);
        }
	}

	public updateBySUpgradeStrengthenEx(): void {
		this.playerSuccessMc();
		this.updateAll();
		App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
	}

	/**
	 * 播放特效
	 */
	private playerSuccessMc(): void {
        if (this.mcSuccess == null) {
            this.mcSuccess = UIMovieManager.get(PackNameEnum.MCStrengthen);
            this.mcSuccess.x = -209;
            this.mcSuccess.y = -209;
        }
		let forgeCastingItem: ForgeCastingItem = this.items[this.lastUpdateIndex];
		if (forgeCastingItem) {
			forgeCastingItem.viewCom.addChild(this.mcSuccess);
			this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
				this.mcSuccess.removeFromParent();
				this.mcSuccess.playing = false;
			}, this);
			this.mcSuccess.playing = true;
		}
	}

	/**
	 * 更新道具
	 */
	public updateProp(): void {
		let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.useItemCode);
		let costNum: number = this.cfg.useItemNum;
		let color: string = Color.GreenCommon;
		if (costNum > count) {
			color = Color.RedCommon;
		}
		this.costTxt.text = `<font color="${color}">${count}/${costNum}</font>`;
		this.isCanUpgrade = count >= costNum;
		this.isMax = this.cfg.strengthenLevel >= ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeRefine);
	}

	/**铸造 */
	private clickCasting(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, this.type, this.roleIndex);
		} else {
			this.clickGet();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
			Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}

	/**
	 * 更新属性列表
	 */
	private updateAttrList(): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(this.type, this.level);
		var info = CacheManager.role.getPlayerStrengthenExtInfo(this.type, this.roleIndex);
		if(info && info.addRate) {
			for(let i = 0;i<attrListData.length; i++) {
				attrListData[i].value +=  attrListData[i].value * info.addRate /100;
				attrListData[i].value = Math.floor(attrListData[i].value);
				attrListData[i].addValue += attrListData[i].addValue * info.addRate /100;
				attrListData[i].addValue = Math.floor(attrListData[i].addValue);
			}
		}
		this.list_attr.data = attrListData;
	}
}