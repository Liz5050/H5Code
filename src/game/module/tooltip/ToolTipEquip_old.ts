/**
 * 装备ToolTip
 */
class ToolTipEquip_old extends ToolTipBase {
	private nameTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GTextField;
	private baseItem: BaseItem;
	/**装备评分 */
	private scoreTxt: fairygui.GTextField;
	/**综合评分 */
	private totalScoreTxt: fairygui.GTextField;//
	/**基础属性 */
	private baseAttrTxt: fairygui.GRichTextField;
	private careerTxt: fairygui.GTextField;
	private typeTxt: fairygui.GTextField;
	/**极品属性 */
	private bestAttrTxt: fairygui.GRichTextField;
	/**洗练属性 */
	private refreshAttrTxt: fairygui.GRichTextField;
	private cOpt: fairygui.Controller;
	private btnList: fairygui.GList;
	private itemData: ItemData;
	private endLineImg: fairygui.GImage;
	private stoneAttr: EquipStoneAttr;
	private endGroup: fairygui.GGroup;
	/**仙盟仓库积分显示组件 */
	private guildWarehouseScoreComp: fairygui.GComponent;
	private extData: any;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipEquip");
	}

	public initUI(): void {
		super.initUI();
		this.cOpt = this.getController("c_opt");
		this.btnList = this.getGObject("list_btn").asList;
		this.btnList.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.scoreTxt = this.getChild("txt_equip_score").asTextField;
		this.totalScoreTxt = this.getChild("txt_composite_score").asTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");

		this.baseAttrTxt = this.getChild("txt_base").asRichTextField;
		this.bestAttrTxt = this.getChild("txt_bestAttr").asRichTextField;
		this.refreshAttrTxt = this.getChild("txt_refreshAttr").asRichTextField;

		this.scoreTxt = this.getChild("txt_equip_score").asTextField;
		this.careerTxt = this.getChild("txt_career").asTextField;
		this.typeTxt = this.getChild("txt_type").asTextField;

		this.endLineImg = this.getChild("line2").asImage;
		this.endGroup = this.getChild("group_end").asGroup;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				let itemInfo: any = this.itemData.getItemInfo();
				var name: string = this.itemData.getName(true);
				let strengthenLevel: number = this.itemData.getStrengthenLevel();
				if (strengthenLevel > 0) {
					name += this.itemData.getColorString("+" + strengthenLevel.toString());
				}
				this.nameTxt.text = name;
				this.levelTxt.text = this.itemData.getLevel().toString();
				this.scoreTxt.text = WeaponUtil.getScoreBase(this.itemData).toString();
				this.totalScoreTxt.text = WeaponUtil.getTotalScore(this.itemData).toString();
				this.baseAttrTxt.text = this.getBaseAttr(this.itemData);

				this.bestAttrTxt.text = WeaponUtil.getBestAttr(this.itemData);
				if(this.extData && this.extData["bestRecommand"] && WeaponUtil.getBestAttr(this.itemData) == ""){
					this.bestAttrTxt.text = WeaponUtil.getBestRecommand(this.itemData);
				}
				this.refreshAttrTxt.text = this.getRefreshAttr(this.itemData);

				if (ConfigManager.mgOpen.isOpenedByKey("JewelEmbel", false) && this.itemData.getType() < EDressPos.EDressPosSpirit) {
					if (!this.stoneAttr) {
						this.stoneAttr = <EquipStoneAttr>fairygui.UIPackage.createObject(PackNameEnum.Common, "EquipStoneAttr").asCom;
					}
					this.stoneAttr.setData(this.itemData);

					this.stoneAttr.x = this.baseAttrTxt.x;
					this.stoneAttr.y = this.refreshAttrTxt.y + this.refreshAttrTxt.height;
					this.stoneAttr.setXY(this.baseAttrTxt.x, this.refreshAttrTxt.y + this.refreshAttrTxt.height);
					this.stoneAttr.addRelation(this.refreshAttrTxt, fairygui.RelationType.Top_Bottom);

					this.endLineImg.removeRelation(this.refreshAttrTxt);
					this.endLineImg.y = this.stoneAttr.y + this.stoneAttr.height + 20;
					this.endLineImg.addRelation(this.stoneAttr, fairygui.RelationType.Top_Bottom);
					this.addChild(this.stoneAttr);
				} else {
					if (this.stoneAttr) {
						this.endLineImg.removeRelation(this.stoneAttr);
						this.stoneAttr.removeFromParent();
					}
					this.endLineImg.y = this.refreshAttrTxt.y + this.refreshAttrTxt.height;
					this.endLineImg.setXY(this.endLineImg.x, this.refreshAttrTxt.y + this.refreshAttrTxt.height);
					this.endLineImg.addRelation(this.refreshAttrTxt, fairygui.RelationType.Top_Bottom);
				}

				let career: number = this.itemData.getCareer();
				this.careerTxt.text = ConfigManager.mgCareer.getCareerName(career);
				let careerColor: number = 0xFF0000;//CareerUtil.isCareerMatch(career) ? 0xFFFFFF : 0xFF0000;
				this.careerTxt.color = careerColor;
				this.typeTxt.text = WeaponUtil.getWeaponTypeName(this.itemData.getType());
				this.levelTxt.color = CacheManager.role.isLevelMatch(this.itemData.getLevel()) ? 0xFFFFFF : 0xFF0000;
				this.processGuildWarehouseScore();
				this.updateBtnList();
			}
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}

	public center(): void {
		let optListWidth: number = 130;
		let centerX: number = (fairygui.GRoot.inst.width - this.width + optListWidth) / 2;
		let centerY: number = (fairygui.GRoot.inst.height - this.height) / 2;
		this.setXY(centerX, centerY);
	}

	public enableOptList(enable: boolean): void {
		this.btnList.visible = enable;
	}

	/**
	 * 更新操作按钮
	 */
	private updateBtnList(): void {
		let data: Array<any> = [];
		if (this.toolTipData.optBtnList != null) {
			data = this.toolTipData.optBtnList;
		} else {
			if (this.toolTipData.source != ToolTipSouceEnum.None) {
				if (this.toolTipSource == ToolTipSouceEnum.GuildWarehouse) {//仓库需要判断权限
					if (CacheManager.guild.isCanManageWarehouse) {
						data = [ToolTipOptEnum.Destroy, ToolTipOptEnum.GuildWarehouseExchange];
					} else {
						data = [ToolTipOptEnum.ComposeUnDress];
					}
				} else if(this.toolTipSource == ToolTipSouceEnum.Compose){
					data = [ToolTipOptEnum.ComposeUnDress];
				} else {
					data = GameDef.ToolTipOptList[this.toolTipData.source];
				}
			} else {
				if (CacheManager.pack.rolePackCache.isDressed(this.itemData)) {
					data.push(ToolTipOptEnum.Undress);
					this.cOpt.setSelectedIndex(1);
				} else {
					this.cOpt.setSelectedIndex(0);
					if (CacheManager.pack.backPackCache.hasItem(this.itemData)) {//背包中
						data.push(ToolTipOptEnum.Dress);
						if (ItemsUtil.isCanSell(this.itemData)) {
							data.push(ToolTipOptEnum.Sell);
						}
						data.push(ToolTipOptEnum.Store);
					} else if (CacheManager.pack.warePackCache.hasItem(this.itemData)) {
						data = [ToolTipOptEnum.Fetch];
					}
				}
			}
		}

		this.btnList.removeChildrenToPool();
		for (let opt of data) {
			var button: fairygui.GButton = <fairygui.GButton>this.btnList.addItemFromPool();
			button.text = GameDef.ToolTipOptName[opt];
			button.name = opt;
		}
		this.btnList.resizeToFit();
	}

	/**点击操作按钮 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let button: fairygui.GButton = <fairygui.GButton>e.itemObject;
		if (button != null) {
			switch (Number(button.name)) {
				case ToolTipOptEnum.Dress:
					EventManager.dispatch(LocalEventEnum.EquipToRole, this.itemData);
					break;
				case ToolTipOptEnum.Undress:
					//EventManager.dispatch(LocalEventEnum.EquipUndressRole, this.itemData);
					EventManager.dispatch(LocalEventEnum.PlayerOpenReplaceEquip, this.itemData);
					break;
				case ToolTipOptEnum.Sell:
					EventManager.dispatch(LocalEventEnum.PackSale, this.itemData);
					break;
				case ToolTipOptEnum.Fetch:
					EventManager.dispatch(LocalEventEnum.PackFetch, this.itemData);
					break;
				case ToolTipOptEnum.Store:
					EventManager.dispatch(LocalEventEnum.PackStore, this.itemData);
					break;
				case ToolTipOptEnum.Donate:
					EventManager.dispatch(LocalEventEnum.GuildDonateEquip, this.itemData);
					break;
				case ToolTipOptEnum.Destroy:
					Alert.info("是否确认销毁这些珍贵的装备？", () => {
						EventManager.dispatch(LocalEventEnum.GuildDestroyEquip, [this.itemData.getUid()]);
					}, this);

					break;
				case ToolTipOptEnum.GuildWarehouseExchange:
					EventManager.dispatch(LocalEventEnum.GuildChangeEquip, this.itemData);
					break;
				case ToolTipOptEnum.ComposeUnDress:
					// {"itemData": this.itemData, "pos": this.extData["pos"]}
					EventManager.dispatch(LocalEventEnum.ComposeUnDressEquip, {"itemData": this.itemData, "pos": this.extData["pos"]});
					break;
			}
		}
		ToolTipManager.hide();
	}

	/**
	 * 获取基础属性串，包含强化
	 */
	private getBaseAttr(itemData: ItemData): string {
		var attr: string = "";
		let dict: any = WeaponUtil.getBaseAttrDict(itemData);
		let addDict: any = WeaponUtil.getStrengthenAttrDict(itemData);
		for (let key in dict) {
			let value: string = "";
			if (WeaponUtil.isPercentageAttr(Number(key))) {//有些属性是万分比
				value = `+${Number(dict[key]) / 100}%`;
			} else {
				value = dict[key];
			}
			attr += `${GameDef.EJewelName[key][0]}：${value}`;
			let addValue: number = 0;
			if (addDict[key] && addDict[key] > 0) {
				addValue = addDict[key];
				attr += `  <font color='#01ab24'>(强化+${addValue})</font>`;
			}
			attr += "\n";
		}
		return attr;
	}

	/**
	 * 获取洗炼属性串
	 */
	private getRefreshAttr(itemData: ItemData): string {
		var attr: string = "";
		let refresh: any = itemData.getItemExtInfo().refresh;
		if (refresh) {
			for (let key in refresh) {
				let attrData: any = ConfigManager.mgRefreshRate.getByPk(refresh[key][0]);
				let addValue: string = WeaponUtil.isPercentageAttr(attrData.attrType) ? `${refresh[key][1] / 100}%` : refresh[key][1];
				attr += `<font color = "#0cf24a">${GameDef.EJewelName[attrData.attrType][0]} +${addValue}</font>\n`;
			}
		}
		return attr ? `<font color='${"#FEA700"}'>洗炼属性</font>\n` + attr : "";

	}

	/**
	 * 处理仙盟仓库积分
	 * @param isShow 是否显示仙盟仓库积分
	 */
	private processGuildWarehouseScore(): void {
		let isShow: boolean = this.toolTipSource == ToolTipSouceEnum.GuildDonateWindow || this.toolTipSource == ToolTipSouceEnum.GuildWarehouse;
		if (isShow) {
			if (this.guildWarehouseScoreComp == null) {
				this.guildWarehouseScoreComp = fairygui.UIPackage.createObject(PackNameEnum.Common, "GuildWarehouseScoreComp").asCom;
			}
			this.guildWarehouseScoreComp.getChild("txt_score").asTextField.text = this.itemData.getCredit().toString();
			this.guildWarehouseScoreComp.x = this.endLineImg.x;
			this.guildWarehouseScoreComp.y = this.endLineImg.y + 20;
			this.guildWarehouseScoreComp.addRelation(this.endLineImg, fairygui.RelationType.Top_Bottom);
			this.addChild(this.guildWarehouseScoreComp);

			this.endGroup.x = this.guildWarehouseScoreComp.x;
			this.endGroup.y = this.guildWarehouseScoreComp.y + this.guildWarehouseScoreComp.height + 20;
			this.endGroup.relations.clearFor(this.endLineImg);
			this.endGroup.addRelation(this.guildWarehouseScoreComp, fairygui.RelationType.BottomExt_Bottom);
			this.endGroup.addRelation(this.guildWarehouseScoreComp, fairygui.RelationType.TopExt_Bottom);
		} else {
			if (this.guildWarehouseScoreComp != null) {
				this.guildWarehouseScoreComp.removeFromParent();
				this.endGroup.x = this.endLineImg.x;
				this.endGroup.y = this.endLineImg.y + 20;
				this.endGroup.relations.clearFor(this.guildWarehouseScoreComp);
				this.endGroup.addRelation(this.endLineImg, fairygui.RelationType.BottomExt_Bottom);
				this.endGroup.addRelation(this.endLineImg, fairygui.RelationType.TopExt_Bottom);
			}
		}
	}
}