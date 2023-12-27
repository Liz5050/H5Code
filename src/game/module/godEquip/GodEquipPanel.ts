/**
 * 神装界面
 */

class GodEquipPanel extends BaseTabView {
	private typeEquipItems: any;//按类型装备项
	private generateItem: GodEquipItem;
	private currentItem: GodEquipItem;
	private nextItem: GodEquipItem;
	private generateScoresTxt: fairygui.GTextField;
	private currentScoresTxt: fairygui.GTextField;
	private nextScoresTxt: fairygui.GTextField;
	private generateAttrTxt: fairygui.GRichTextField;
	private currentAttrTxt: fairygui.GRichTextField;
	private nextAttrTxt: fairygui.GRichTextField;
	private fragmentCostTxt: fairygui.GRichTextField;
	private decomposeBtn: fairygui.GButton;
	private generateBtn: fairygui.GButton;
	private upgradeBtn: fairygui.GButton;
	private statusController: fairygui.Controller;
	private materialLoader: GLoader;
	
	private sixMovieClip:UIMovieClip;
	private mcSuccess: UIMovieClip;

	private selectedType: number;
	private isHasProp: boolean = false;

	private lastTime: number = 0;
	private limitNumPack: number = 5;
	private _roleIndex: number = RoleIndexEnum.Role_index0;

	/**神装合成引导使用 */
	private checkGenerateArr: Array<number> = [EEquip.EEquipWeapon, EEquip.EEquipGloves, EEquip.EEquipWristlet,
		 EEquip.EEquipClothes, EEquip.EEquipShoulder, EEquip.EEquipBelt, EEquip.EEquipHelmet, EEquip.EEquipShoes];

	public constructor() {
		super();
	}

	public initOptUI(): void {
		let equipConfs: Array<any> = [
			{ "name": "baseItem_weapon", "type": EEquip.EEquipWeapon },//武器
			{ "name": "baseItem_wristlet", "type": EEquip.EEquipWristlet },//护符
			{ "name": "baseItem_shoulder", "type": EEquip.EEquipShoulder },//护手
			{ "name": "baseItem_helmet", "type": EEquip.EEquipHelmet },//手镯
			{ "name": "baseItem_gloves", "type": EEquip.EEquipGloves },//头盔
			{ "name": "baseItem_clothes", "type": EEquip.EEquipClothes },//衣服
			{ "name": "baseItem_belt", "type": EEquip.EEquipBelt },//护腿
			{ "name": "baseItem_shoes", "type": EEquip.EEquipShoes },//鞋
		];

		this.typeEquipItems = {};
		for (let c of equipConfs) {
			let baseItem: BaseItem = <BaseItem>this.getGObject(c["name"]);
			baseItem.isSelectStatus = true;
			baseItem.enableToolTip = false;
			baseItem.enableToolTipOpt = false;
			baseItem.bgVisible = false;
			let type: number = c["type"];
			this.typeEquipItems[type] = baseItem;
			baseItem.addClickListener(this.clickBaseItem, this);
		}

		this.generateItem = <GodEquipItem>this.getGObject("generateItem");
		this.currentItem = <GodEquipItem>this.getGObject("currentItem");
		this.nextItem = <GodEquipItem>this.getGObject("nextItem");
		this.generateScoresTxt = this.getGObject("txt_evaluate").asTextField;
		this.currentScoresTxt = this.getGObject("txt_nowEvaluate").asTextField;
		this.nextScoresTxt = this.getGObject("txt_nextEvaluate").asTextField;
		this.generateAttrTxt = this.getGObject("txt_onlyAttr").asRichTextField;
		this.currentAttrTxt = this.getGObject("txt_nowAttr").asRichTextField;
		this.nextAttrTxt = this.getGObject("txt_upAttr").asRichTextField;
		this.fragmentCostTxt = this.getGObject("txt_cost").asRichTextField;
		this.decomposeBtn = this.getGObject("btn_decompose").asButton;
		this.generateBtn = this.getGObject("btn_synthesis").asButton;
		this.upgradeBtn = this.getGObject("btn_levelUp").asButton;
		this.statusController = this.getController("c1");
		this.materialLoader = <GLoader>this.getGObject("loader_material");

		this.decomposeBtn.addClickListener(this.clickdecomposeBtn, this);
		this.generateBtn.addClickListener(this.clickGenerate, this);
		this.upgradeBtn.addClickListener(this.clickUpgrade, this);
		this.materialLoader.addClickListener(this.onTouchCostIconHandler, this);

		GuideTargetManager.reg(GuideTargetName.GodEquipPanelGenerateBtn, this.generateBtn);
		GuideTargetManager.reg(GuideTargetName.GodEquipPanelDecomposeBtn, this.decomposeBtn);
	}

	public updateAll(): void {
		// this.needFragment = 0;
		this.selectedType = EEquip.EEquipWeapon;
		this.updateEquips();
		this.updateDecomposeTips();
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.updateEquips();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	/**更新某个装备 */
	public updateEquipItem(index: number, type: number): void {
		if (this.roleIndex == index) {
			let baseItem: BaseItem = <BaseItem>this.typeEquipItems[type];
			let itemData: ItemData = CacheManager.pack.rolePackCache.getDressEquipByType(type, index);
			baseItem.itemData = itemData;
			if (itemData) {
				this.statusController.selectedIndex = 1;
			} else {
				this.statusController.selectedIndex = 0;
			}
			this.selectedBaseItem(baseItem);
			baseItem.bgVisible = false;
		}
	}

	/**
	 * 更新所有装备
	 */
	public updateEquips(): void {
		let index: number = this.roleIndex;
		let equipDict: { [key: number]: ItemData } = CacheManager.pack.rolePackCache.getEquips(index);
		let itemData: ItemData;
		for (let type in this.typeEquipItems) {
			let baseItem: BaseItem = this.typeEquipItems[type];
			itemData = equipDict[type];
			baseItem.isShowCareerIco = false;
			baseItem.txtName.color = 0xc8b185;
			if (itemData && itemData.isGodEquipType()) {
				baseItem.itemData = itemData;
			} else {
				baseItem.itemData = null;
			}
			baseItem.bgVisible = false;
		}
		this.clickBaseItem({ "target": this.typeEquipItems[this.selectedType] });
		this.setBtnTips();
	}

	// public updateGetFragment(rewardAmount: number): void {
	// 	this.countFragment += rewardAmount;
	// 	if (this.countFragment >= this.needFragment) {
	// 		this.fragmentCostTxt.text = `消耗神装碎片：${this.countFragment}/${this.needFragment}`;
	// 		this.isHasProp = true;
	// 	} else {
	// 		this.fragmentCostTxt.text = `消耗神装碎片：<font color = ${Color.RedCommon}>${this.countFragment}</font>/${this.needFragment}`;
	// 		this.isHasProp = false;
	// 	}
	// }

	public onGenerateSuccess(type: EEquip): void {
		this.playerSuccessMc(type);
	}

	private playerSuccessMc(type: EEquip): void {
        if (this.mcSuccess == null) {
            this.mcSuccess = UIMovieManager.get(PackNameEnum.MCStrengthen);
            this.mcSuccess.x = -195;
            this.mcSuccess.y = -208;
        }
		let baseItem: BaseItem = this.typeEquipItems[type];
		baseItem.addChild(this.mcSuccess);
		this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			this.mcSuccess.removeFromParent();
			this.mcSuccess.playing = false;
		}, this);
		this.mcSuccess.playing = true;
	}

	private updateFragmentCost(need: number): void {
		let color: string;
		let count: number = CacheManager.pack.propCache.getItemCountByCode2(CacheManager.godEquip.godEquipFragmentCode);
		let materialData: any = ConfigManager.item.getByPk(CacheManager.godEquip.godEquipFragmentCode);
		this.isHasProp = count >= need;
		color = this.isHasProp ? Color.GreenCommon : Color.RedCommon;
		this.fragmentCostTxt.text = `<font color = ${color}>${count}/${need}</font>`;
		this.materialLoader.load(URLManager.getIconUrl(materialData.icon, URLManager.ITEM_ICON));
	}

	/**点击装备项 */
	private clickBaseItem(e: any): void {
		let baseItem: BaseItem = <BaseItem>e.target;
		let itemData: ItemData = baseItem.itemData;
		if (itemData) {
			this.statusController.selectedIndex = 1;
		} else {
			this.statusController.selectedIndex = 0;
		}
		this.selectedBaseItem(baseItem);
	}

	/**选中一个装备 */
	private selectedBaseItem(baseItem: BaseItem): void {
		for (let type in this.typeEquipItems) {
			let tmp: BaseItem = <BaseItem>this.typeEquipItems[type];
			tmp.setSelectStatus(baseItem == tmp);
			if (baseItem == tmp) {
				this.selectedType = Number(type);
				let itemData: ItemData = baseItem.itemData;
				let nextItemData: ItemData;
				if (ItemsUtil.isTrueItemData(itemData)) {
					nextItemData = ConfigManager.item.getGodEquipNext(itemData.getCode());
					if (ItemsUtil.isTrueItemData(nextItemData)) {
						nextItemData.baseAttrAddRateGod = ItemsUtil.getBaseAttrAddRate();
						this.currentItem.setData(itemData);
						this.currentScoresTxt.text = `评分：${WeaponUtil.getScoreBase(itemData)}`;
						this.currentAttrTxt.text = WeaponUtil.getBaseAttr(itemData);
						this.nextItem.setData(nextItemData);
						this.nextScoresTxt.text = `评分：${WeaponUtil.getScoreBase(nextItemData)}`;
						this.nextAttrTxt.text = `${WeaponUtil.getBaseAttr(nextItemData)}`;

						let godEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${itemData.getType()},${itemData.getNewItemLevel()}`);
						let nextGodEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${nextItemData.getType()},${nextItemData.getNewItemLevel()}`);
						this.updateFragmentCost(nextGodEquipCostData.cost - godEquipCostData.cost);
					} else {
						this.generateItem.setData(itemData);
						this.generateScoresTxt.text = `评分：${WeaponUtil.getScoreBase(itemData)}`;
						this.generateAttrTxt.text = WeaponUtil.getBaseAttr(itemData);
						this.updateFragmentCost(0);
						this.statusController.selectedIndex = 2;
					}
				} else {
					let career: number = CacheManager.role.getRoleCareerByIndex(this.roleIndex);
					itemData = ConfigManager.item.getGodEquipGenerate(career, Number(type));
					itemData.baseAttrAddRateGod = ItemsUtil.getBaseAttrAddRate();
					if (ItemsUtil.isTrueItemData(itemData)) {
						this.generateItem.setData(itemData);
						this.generateScoresTxt.text = `评分：${WeaponUtil.getScoreBase(itemData)}`;
						this.generateAttrTxt.text = WeaponUtil.getBaseAttr(itemData);
						let godEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${itemData.getType()},${itemData.getNewItemLevel()}`);
						this.updateFragmentCost(godEquipCostData.cost);
					} else {
						this.generateItem.setData(null);
						this.generateScoresTxt.text = "";
						this.generateAttrTxt.text = "";
					}
				}
			}
		}
	}

	private clickdecomposeBtn(): void {
		EventManager.dispatch(UIEventEnum.GodEquipDecomposeOpen);
	}

	private clickGenerate(): void {
		if(Date.now() - this.lastTime > 500){
			this.lastTime = Date.now();
			if (this.isHasProp) {
				if (this.generateItem.isCanEquip()) {
					if(!ItemsUtil.checkSmeltTips(true, this.limitNumPack)){
						App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
						ProxyManager.godEquip.generateGodEquip(this.roleIndex, this.selectedType);
					}
				} else {
					Tip.showOptTip(HtmlUtil.html("人物等级不足，无法合成神装", Color.Red));
				}
			} else {
				Tip.showOptTip("神装碎片不足");
			}

		}
	}

	private clickUpgrade(): void {
		if (this.isHasProp) {
			if (this.nextItem.isCanEquip()) {
				ProxyManager.godEquip.upgradeGodEquip(this.roleIndex, this.selectedType);
			} else {
				Tip.showOptTip(HtmlUtil.html("人物等级不足，无法升级神装", Color.Red));
			}
		} else {
			Tip.showOptTip("神装碎片不足");
		}
	}

	protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(CacheManager.godEquip.godEquipFragmentCode);
    }

	private setBtnTips(): void {
		for (let type in this.typeEquipItems) {
			let baseItem: BaseItem = this.typeEquipItems[type];
			CommonUtils.setBtnTips(baseItem, CacheManager.godEquip.checkTipByType(this.roleIndex, Number(type)));
		}

		/**神装合成引导注册 */
		for (let type of this.checkGenerateArr) {
			let baseItem: BaseItem = this.typeEquipItems[type];
			if(baseItem.itemData == null && CacheManager.godEquip.checkGenerateByType(this.roleIndex, Number(type))){
				GuideTargetManager.reg(GuideTargetName.GodEquipPanelEquipItem, baseItem, true);
				break;
			}
		}
	}

	public updateDecomposeTips(): void {
		if(CacheManager.godEquip.checkDecompose()){
			if(this.sixMovieClip == null){
				this.sixMovieClip = UIMovieManager.get(PackNameEnum.MCOneKey, -156, -190, 0.9, 0.8);
				this.decomposeBtn.addChild(this.sixMovieClip);
				this.sixMovieClip.playing = true;
				this.sixMovieClip.frame = 0;
			}
		}else{
			if(this.sixMovieClip != null){
				UIMovieManager.push(this.sixMovieClip);
				this.sixMovieClip = null;
			}
		}
	}
}