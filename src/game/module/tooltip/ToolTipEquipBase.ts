/**
 * 装备ToolTip
 */
class ToolTipEquipBase extends ToolTipBase {
	protected c1:fairygui.Controller;//用于仙盟仓库兑换组件显示控制
	protected nameTxt: fairygui.GRichTextField;
	//private levelTxt: fairygui.GTextField;
	protected baseItem: BaseItem;
	/**装备评分 */
	protected scoreTxt: fairygui.GTextField;
	protected rebirthTimeTxt: fairygui.GTextField;
	/**综合评分 */
	protected txtFight: fairygui.GTextField;//
	/**基础属性 */
	protected baseAttrTxt: fairygui.GRichTextField;
	protected careerTxt: fairygui.GTextField;
	protected typeTxt: fairygui.GTextField;
	protected cOpt: fairygui.Controller;
	protected btnList: fairygui.GList;
	protected itemData: ItemData;
	//private endLineImg: fairygui.GImage;
	protected stoneAttr: EquipStoneAttr;
	//private endGroup: fairygui.GGroup;
	protected bgImg: fairygui.GImage;
	/**仙盟仓库积分显示组件 */
	// protected guildWarehouseScoreComp: fairygui.GComponent;
	protected warehouseScoreCom:WarehouseExchangeCom;
	protected extData: any;
	protected listData: any[];
	protected toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor(pkgName:string=PackNameEnum.Common,contentName:string="ToolTipEquip") {
		super(pkgName,contentName);
	}

	public initUI(): void {
		super.initUI();
		this.c1 = this.getController("c1");
		this.cOpt = this.getController("c_opt");
		this.btnList = this.getGObject("list_btn").asList;
		this.btnList.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.btnList.scrollPane.bouncebackEffect = false;
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		//this.levelTxt = this.getChild("txt_level").asTextField;
		this.scoreTxt = this.getChild("txt_score").asTextField;
		let panel_fight: fairygui.GComponent = this.getChild("panel_fight").asCom;
		this.txtFight = panel_fight.getChild("txt_fight").asTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");
		this.baseItem.isShowRedEff = false;
		this.baseAttrTxt = this.getChild("txt_base").asRichTextField;

		this.careerTxt = this.getChild("txt_career").asTextField;
		this.typeTxt = this.getChild("txt_type").asTextField;
		this.rebirthTimeTxt = this.getChild("txt_rebirthTime").asTextField;

		//this.endLineImg = this.getChild("line2").asImage;
		//this.endGroup = this.getChild("group_end").asGroup;
		this.bgImg = this.getChild("window_itemtip").asImage;

		this.warehouseScoreCom = this.getChild("com_exchange") as WarehouseExchangeCom
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		if(this.c1) this.c1.selectedIndex = 0;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if(this.c1) {
				if(toolTipData.source == ToolTipSouceEnum.GuildScoreWarehouse) {
					this.c1.selectedIndex = 1;
					this.warehouseScoreCom.setData(this.itemData);
				}
			}

			if (ItemsUtil.isTrueItemData(this.itemData)) {
				let itemInfo: any = this.itemData.getItemInfo();
				this.updateInfo(itemInfo);				
				this.updateBtnList();
			}
			let isDressed: boolean = CacheManager.pack.rolePackCache.isDressed(this.itemData);
			if (isDressed) {
				this.cOpt.setSelectedIndex(1);
			} else {
				this.cOpt.setSelectedIndex(0);
			}
			this.baseItem.isShowCareerIco = false;
			this.baseItem.isShowName = false;
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);
		}

	}

	// public center(): void {
	// 	let optListWidth: number = 130;
	// 	let trueWid: number = this.listData && this.listData.length > 0 ? this.width : this.bgImg.width;
	// 	let centerX: number = (fairygui.GRoot.inst.width - trueWid) / 2;
	// 	let trueHeight: number = this.bgImg.y + this.bgImg.height;
	// 	let centerY: number = (fairygui.GRoot.inst.height - trueHeight) / 2;
	// 	this.setXY(centerX, centerY);
	// }

	public enableOptList(enable: boolean): void {
		this.btnList.visible = enable;
	}

	protected updateInfo(itemInfo: any):void{
		var name: string = this.itemData.getName(true);
		this.nameTxt.text = name;
		let skillFight:number = this.itemData.getAddSkillWarfare();
		//this.levelTxt.text = this.itemData.getLevel().toString();
		let total:number = WeaponUtil.getScoreBase(this.itemData)+skillFight;
		this.scoreTxt.text = "评分："+total;




		let career: number = this.itemData.getCareer();
		this.rebirthTimeTxt.text = WeaponUtil.getEquipLevelText(this.itemData, false);//等级
		this.careerTxt.text = CareerUtil.getCareerName(career);//职业
		// let careerColor: number = 0xFFFFFF; //CareerUtil.isCareerMatch(career) ? 0xFFFFFF : 0xFF0000;
		// this.careerTxt.color = careerColor;
		this.typeTxt.text = WeaponUtil.getWeaponTypeName(this.itemData.getType()); //部位
		var roleIdx = 0;
		if(this.extData){
			roleIdx = this.extData.roleIndex;
		}
		//强化属性
		let strengthenAttrDict: any = WeaponUtil.getStrengthenExAttrDict(this.itemData.getType(), this.itemData.strengthenLevel,EStrengthenExType.EStrengthenExTypeUpgrade);
		var info = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeUpgrade, roleIdx);
		if(info && info.addRate) {
			for(let i = 1;i<= 4;i++) {
				if(strengthenAttrDict[i]) {
					strengthenAttrDict[i] += strengthenAttrDict[i] * info.addRate/100;
					strengthenAttrDict[i] = Math.floor(strengthenAttrDict[i]);
				}
			}
		}

		let strengthenStr: string = this.getStrengthenAttrStr(strengthenAttrDict);
		strengthenStr != "" ? strengthenStr += HtmlUtil.brText : null;

		//铸造属性
		let castingAttrDic:any = WeaponUtil.getStrengthenExAttrDict(this.itemData.getType(), this.itemData.castingLevel,EStrengthenExType.EStrengthenExTypeCast);
		info = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeCast, roleIdx);
		if(info && info.addRate) {
			for(let i = 1;i<= 4;i++) {
				if(castingAttrDic[i]) {
					castingAttrDic[i] += castingAttrDic[i] * info.addRate/100;
					castingAttrDic[i] = Math.floor(castingAttrDic[i]);
				}
			}
		}
		let castingStr:string = this.getCastingAttrStr(castingAttrDic);
		castingStr != "" ? strengthenStr += castingStr + HtmlUtil.brText : null;

		//精炼属性
		let refineAttrDic:any = WeaponUtil.getStrengthenExAttrDict(this.itemData.getType(), this.itemData.refineLevel,EStrengthenExType.EStrengthenExTypeRefine);
		info = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeRefine, roleIdx);
		if(info && info.addRate && refineAttrDic) {
			for(let i = 1;i<= 4;i++) {
				if(refineAttrDic[i]) {
					refineAttrDic[i] += refineAttrDic[i] * info.addRate/100;
					refineAttrDic[i] = Math.floor(refineAttrDic[i]);
				}
			}
		}

		let refineStr:string = this.getRefineAttrStr(refineAttrDic);
		refineStr != "" ? strengthenStr += refineStr + HtmlUtil.brText : null;

		/**洗炼属性 */
		/* //没有洗练属性了
		let refreshArrtDict: any = WeaponUtil.getRefreshAttrDict(this.itemData);
		let refStr: string = this.getRefreshAttr(refreshArrtDict);
		refStr != "" ? strengthenStr += refStr + HtmlUtil.brText : null;
		*/

		strengthenStr != "" ? strengthenStr = HtmlUtil.brText + HtmlUtil.brText + strengthenStr : null;
		let isAncient:boolean = false;
		let roleIndex:number = -1;
		if(this.extData){
			isAncient = this.extData.isAncientAttr;
			roleIndex = this.extData.roleIndex;
		}
		this.baseAttrTxt.text = WeaponUtil.getBaseAttr(this.itemData, isAncient, roleIndex, Color.Color_7, Color.Color_8) + strengthenStr;
		this.baseAttrTxt["renderNow"]();

		if(ItemsUtil.isHeartLock(this.itemData)) {
			this.txtFight.text = total.toString();
		} else {
			var baseAttrDict: any = WeaponUtil.getBaseAttrDict(this.itemData, true);
			ObjectUtil.mergeObj(baseAttrDict, strengthenAttrDict);
			ObjectUtil.mergeObj(baseAttrDict, castingAttrDic);
			ObjectUtil.mergeObj(baseAttrDict, refineAttrDic);
			//ObjectUtil.mergeObj(baseAttrDict, refreshArrtDict);
			this.txtFight.text = (WeaponUtil.getCombat(baseAttrDict) + skillFight) + "";
		}

	}

	/**
	 * 更新操作按钮
	 */
	private updateBtnList(): void {
		let data: Array<any> = [];
		if (this.toolTipSource == ToolTipSouceEnum.Role && WeaponUtil.isCanReplace(this.itemData)
			&& CacheManager.pack.rolePackCache.isDressed(this.itemData)) {
			data.push(ToolTipOptEnum.Replace); //目前就一个更换装备的按钮
		}
		this.listData = data;
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
					EventManager.dispatch(LocalEventEnum.EquipUndressRole, this.itemData);
					break;
				case ToolTipOptEnum.Replace:
					EventManager.dispatch(LocalEventEnum.PlayerOpenReplaceEquip, { item: this.itemData, dressPos: ItemsUtil.getEqiupPos(this.itemData), roleIndex: this.itemData.getRoleIndex() });
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
					EventManager.dispatch(LocalEventEnum.ComposeUnDressEquip, { "itemData": this.itemData, "pos": this.extData["pos"] });
					break;
			}
		}
		ToolTipManager.hide();
	}

	private getStrengthenAttrStr(strengthenAttrDict: any): string {
		var attr: string = this.getFmtAttrDictHtml(strengthenAttrDict, Color.Color_7, Color.Color_6);
		return attr ? this.getAttrTitle("强化属性") + attr : "";
	}

	private getCastingAttrStr(castingAttrDic:any):string {
		let attr: string = this.getFmtAttrDictHtml(castingAttrDic, Color.Color_7, Color.Color_6);
		return attr ? this.getAttrTitle("铸造属性") + attr : "";
	}

	/**精炼属性 */
	private getRefineAttrStr(refineAttrDic:any):string {
		let attr: string = this.getFmtAttrDictHtml(refineAttrDic, Color.Color_7, Color.Color_6);
		return attr ? this.getAttrTitle("精炼属性") + attr : "";
	}

	/**
	 * 获取洗炼属性串
	 */
	private getRefreshAttr(dict: any): string {
		var attr: string = this.getFmtAttrDictHtml(dict, Color.Color_7, Color.Color_6);
		return attr ? this.getAttrTitle("洗练属性") + attr : "";

	}

	protected getFmtAttrDictHtml(dict: any, nameColor: string = Color.Color_7, valueColor:string = Color.Color_8): string {
		var attr: string = "";
		for (let key in dict) {
			if (Number(dict[key]) > 0) {
				attr += this.getAttrHtml(Number(key), dict[key], nameColor, valueColor);
			}
		}
		return attr;
	}

	private getAttrHtml(attrType: number, attrValue: any, nameColor:string, valueColor:string): string {
		if (WeaponUtil.isPercentageAttr(Number(attrType))) {//有些属性是万分比
			attrValue = `${Number(attrValue) / 100}%`;
		}
		var attr: string = HtmlUtil.html(`${GameDef.EJewelName[attrType][0]} `, nameColor, false) + 
		HtmlUtil.html(`+${attrValue}`, valueColor, true);
		return attr;
	}

	private getAttrTitle(title: string): string {
		return `<font color='${Color.Color_2}'>${title}</font>\n`;
	}

	/**
	 * 处理仙盟仓库积分
	 * @param isShow 是否显示仙盟仓库积分
	 */
	private processGuildWarehouseScore(): void {
		/*
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

		} else {
			if (this.guildWarehouseScoreComp != null) {
				this.guildWarehouseScoreComp.removeFromParent();				
			}
		}
		*/
	}

}