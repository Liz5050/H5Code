/**
 * 修罗
 */
class ShuraPanel extends BaseTabView {
	private equipList: List;
	private scoreTxt: fairygui.GTextField;
	private attrTxt: fairygui.GTextField;
	private costTxt: fairygui.GRichTextField;
	private upgradeBtn: fairygui.GButton;
	private decomposeBtn: fairygui.GButton;
	private materialLoader: GLoader;

	private sixMovieClip: UIMovieClip;

	private selectedIdx: number;
	private curData: any;
	private isMax: boolean;
	private isHasProp: boolean;

	private costItemcode: number;

	private _roleIndex: number = RoleIndexEnum.Role_index0;

	private modelContainer: fairygui.GComponent;
	private mcEquip: MovieClip;
	// private modelBody: egret.DisplayObjectContainer;
	// private model: ModelShow;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.equipList = new List(this.getGObject("list_equip").asList);
		this.scoreTxt = this.getGObject("txt_score").asTextField;
		this.attrTxt = this.getGObject("txt_attr").asTextField;
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.decomposeBtn = this.getGObject("btn_decompose").asButton;
		this.materialLoader = <GLoader>this.getGObject("loader_material");

		this.equipList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
		this.decomposeBtn.addClickListener(this.clickdecomposeBtn, this);
		this.materialLoader.addClickListener(this.onTouchCostIconHandler, this);

		this.modelContainer = this.getGObject("model_container").asCom;
		this.mcEquip = new MovieClip();
		// this.model = new ModelShow(EShape.ECustomPlayer);
		// this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		// this.modelBody.addChild(this.model);
		// this.modelBody.x = 258;
		// this.modelBody.y = 230;
		// this.modelBody.scaleX = 0.75;
		// this.modelBody.scaleY = 0.75;
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.mcEquip);

	}

	public updateAll(): void {
		this.selectedIdx = 0;
		this.updateList();
		this.updateDecomposeTips();
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		CacheManager.shura.curIndex = roleIndex;
		this.updateList();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	public updateEquip(): void {
		this.updateList();
		// this.onClickItem();
	}

	private clickdecomposeBtn(): void {
		EventManager.dispatch(UIEventEnum.ShuraDecomposeOpen);
	}

	protected onTouchCostIconHandler(): void {
		ToolTipManager.showByCode(this.costItemcode);
	}

	private clickUpgradeBtn(): void {
		// AlertII.show(`当前部位上已穿着<font color = '#fea700'>${this.curData.itemData.getName(false)}</font>，是否继续合成装备？`,null,null, this,[AlertType.NO,AlertType.YES]);
		// return;
		if (this.isMax) {
			Tip.showOptTip("已达到最高等级");
			return;
		}
		if (!this.curData.isDress) {
			if (ItemsUtil.checkSmeltTips(true, 1)) {
				return;
			}
		}
		if (!this.isHasProp) {
			Tip.showOptTip("修罗碎片不足");
		} else if (WeaponUtil.isCanEquipByItemData(this.curData.itemData)) {
			let type: number = this.curData.itemData.getType();
			if (this.curData.isDress) {
				ProxyManager.godEquip.upgradeEquip(this.roleIndex, EEquipType.EEquipTypeJiuli, type, 1);//升级
			} else {
				let baseCareer: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(this.roleIndex));
				let roleEquipScore: number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(baseCareer, type);
				let curItemData: ItemData = CacheManager.pack.rolePackCache.getDressEquipByType(type, this.roleIndex);
				if (roleEquipScore > WeaponUtil.getScoreBase(this.curData.itemData)) {
					Alert.alert(`当前部位上已穿着<font color = '#fea700'>${curItemData.getName(false)}</font>，是否继续合成装备？`, this.generateEquip, this);
				} else {
					this.generateEquip();
				}
			}
		} else {
			if (this.curData.isDress) {
				Tip.showOptTip("升级后将超过角色等级");
			} else {
				Tip.showOptTip("等级未达到");
			}
		}
	}

	private generateEquip(): void {
		let type: number = this.curData.itemData.getType();
		ProxyManager.godEquip.upgradeEquip(this.roleIndex, EEquipType.EEquipTypeJiuli, type, 0);//合成
	}

	private onClickItem(): void {
		this.selectedIdx = this.equipList.selectedIndex;
		this.curData = this.equipList.selectedData;
		this.updateCurAttr();
		this.updateModel();
	}

	private updateList(): void {
		let equipArr: Array<any> = CacheManager.shura.getEquipByIndex(this.roleIndex);
		this.equipList.data = equipArr;
		this.equipList.selectedIndex = this.selectedIdx;
		this.onClickItem();
	}

	private updateCurAttr(): void {
		let itemData: ItemData = this.curData.itemData;
		itemData.baseAttrAddRateGod = ItemsUtil.getBaseAttrAddRate();
		this.scoreTxt.text = `评分：${WeaponUtil.getScoreBase(itemData)}`;
		this.attrTxt.text = WeaponUtil.getBaseAttr(itemData);

		let category: number = itemData.getCategory();
		let type: number = itemData.getType();
		let level: number = itemData.getNewItemLevel();
		let equipUpgradeData: any;
		let propCount: number;
		let needNum: number = 0;
		this.isMax = false;
		if (this.curData.isDress) {//已穿戴
			this.upgradeBtn.title = '升  级';
			if (this.curData.isNextItem) {//可升级
				let nextEquipUpgradeData: any = ConfigManager.equipUpgrade.getByPk(`${category},${EEquipType.EEquipTypeJiuli},${type},${level}`);
				equipUpgradeData = ConfigManager.equipUpgrade.getByPk(`${category},${EEquipType.EEquipTypeJiuli},${type},${level - 1}`);
				needNum = nextEquipUpgradeData.costNum - equipUpgradeData.costNum;
			} else {//已满级
				equipUpgradeData = ConfigManager.equipUpgrade.getByPk(`${category},${EEquipType.EEquipTypeJiuli},${type},${level}`);
				this.isMax = true;
			}
		} else {//可合成
			equipUpgradeData = ConfigManager.equipUpgrade.getByPk(`${category},${EEquipType.EEquipTypeJiuli},${type},${level}`);
			needNum = equipUpgradeData.costNum;
			this.upgradeBtn.title = '合  成';
		}
		this.costItemcode = equipUpgradeData.costItemcode;
		propCount = CacheManager.pack.propCache.getItemCountByCode2(this.costItemcode);
		this.isHasProp = propCount >= needNum;

		let color: string = this.isHasProp ? Color.GreenCommon : Color.RedCommon;
		this.costTxt.text = `<font color = ${color}>${propCount}/${needNum}</font>`;

		let materialData: any = ConfigManager.item.getByPk(this.costItemcode);
		this.materialLoader.load(URLManager.getIconUrl(materialData.icon, URLManager.ITEM_ICON));

		App.DisplayUtils.grayButton(this.upgradeBtn, this.isMax, this.isMax);
		this.costTxt.visible = !this.isMax;
	}

	private updateModel(): void {
		let type: number = this.curData.itemData.getType();
		let career: number = CacheManager.role.getRoleCareerByIndex(this.roleIndex);
		let modelId: number = this.curData.itemData.getItemInfo().modelId;
		if (type == EEquip.EEquipWeapon) {
			this.mcEquip.playFile(ResourcePathUtils.getRPGGameShow() + "weapon/" + modelId + "_stand", -1, ELoaderPriority.UI_EFFECT);
			this.mcEquip.x = 150;
			this.mcEquip.y = -50;
			// this.modelContainer.setXY(556,400);
		} else if (type == EEquip.EEquipClothes) {
			this.mcEquip.playFile(ResourcePathUtils.getRPGGameShow() + "player/" + modelId + "_stand", -1, ELoaderPriority.UI_EFFECT);
			this.mcEquip.x = 0;
			this.mcEquip.y = 50;
			// this.modelContainer.setXY(356,550);
		}
	}

	public updateDecomposeTips(): void {
		if (CacheManager.shura.checkDecompose()) {
			if (this.sixMovieClip == null) {
				this.sixMovieClip = UIMovieManager.get(PackNameEnum.MCOneKey, -156, -190, 0.9, 0.8);
				this.decomposeBtn.addChild(this.sixMovieClip);
				this.sixMovieClip.playing = true;
				this.sixMovieClip.frame = 0;
			}
		} else {
			if (this.sixMovieClip != null) {
				UIMovieManager.push(this.sixMovieClip);
				this.sixMovieClip = null;
			}
		}
	}
}