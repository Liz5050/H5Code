/**背包物品项 */
class BaseItem extends ListRenderer {
	/**当前选中（全局） */
	public static SELECTED_ITEM: BaseItem;
	/**
	 * 是否启用Tip
	 */
	public enableToolTip: boolean = true;

	/**根据选中显示toolTips */
	public toolTipBySelected: boolean = false;

	/**
	 * 是否启用Tip的操作按钮
	 */
	public enableToolTipOpt: boolean = true;
	/**tip来源 */
	public toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;
	/**是否显示职业角标 */
	public isShowCareerIco: boolean = true;
	/**是否显示名字文本 */
	public isShowName: boolean = true;
	/**物品名称是否显示数量 */
	public isNameCount: boolean = false;
	/**是否有选中状态 */
	public isSelectStatus: boolean = false;
	/**刷新数据 重置选中状态 */
	public isResetSelect: boolean = false;
	/**是否显示强化等级 */
	public isShowStrengthLevel: boolean = false;
	/**是否显示锻造等级 */
	public isShowRefineLv: boolean = false;
	/**是否显示红装特效 */
	public isShowRedEff: boolean = true;
	/**物品名称是否描边 */
	public isTxtNameStroke: boolean = false;
	/**是否显示颜色特效 */
	public isShowEffect: boolean = true;
	/**数据为空的时候 设置灰色滤镜 */
	public isNoneGray: boolean = false;
	/**是否显示金色特效 */
	public isShowGoldMc: boolean = true;
	/**扩展数据 */
	public extData: any = {};

	/**背景 */
	public bgLoader: GLoader;
	public colorLoader: GLoader;
	public iconLoader: GLoader;
	public ancientLoader:GLoader;

	public numTxt: fairygui.GRichTextField;
	/**强化等级 */
	private strengthTxt: fairygui.GTextField;
	/**铸造总等级 */
	private txtRefineLevel: fairygui.GTextField;
	private txtStrengthenLevel: fairygui.GTextField;
	public txtName: fairygui.GTextField;
	private bindImg: fairygui.GImage;
	private imgSelect: fairygui.GImage;
	private _selectStatus: boolean;
	/**星级装备星级提示 */
	private cStar: fairygui.Controller;//星级
	/**c1控制器 属性升降等显示提醒 */
	private cScore: fairygui.Controller;//score
	/**更好装备的特效 */
	private mcBest: fairygui.Controller;//特效
	/**职业角标 */
	private cCareer: fairygui.Controller;//特效
	protected _itemData: ItemData;
	private toolTipData: ToolTipData;
	private _strengthenLevel: number;
	/**红装特效 */
	private mcColor: UIMovieClip;
	/**元宝特效 */
	private goldEffect: UIMovieClip;
	/**金色额外特效 */
	private goldMc: UIMovieClip;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.ancientLoader = <GLoader>this.getChild("loader_ancient");
		this.bgLoader = <GLoader>this.getChild("icon");
		this.colorLoader = this.getChild("loader_color") as GLoader;
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.numTxt = this.getChild("txt_num").asRichTextField;
		this.strengthTxt = this.getChild("txt_strengthen").asTextField;
		this.txtRefineLevel = this.getChild("txt_refineLevel").asTextField;
		this.txtStrengthenLevel = this.getChild("txt_strengthenLevel").asTextField;
		this.txtName = this.getChild("txt_name").asTextField;
		this.bindImg = this.getChild("bind").asImage
		this.imgSelect = this.getChild("img_select").asImage;
		this.cScore = this.getController("c1");
		this.cStar = this.getController("c2");
		this.mcBest = this.getController("c3");
		this.cCareer = this.getController("c4");
		this.addClickListener(this.click, this);
		this.txtRefineLevel.text = "";
		this.txtStrengthenLevel.text = "";
		this.setSelectStatus(false);
	}

	public setData(data: any) {
		this.itemData = <ItemData>data;
	}

	public set itemData(itemData: ItemData) {
		this.ancientLoader.clear(); //清掉混元外框，需要设置则另外设置 ancientUrl 属性
		this.ancientLoader.visible = false;
		this._itemData = itemData;
		let careerIdx: number = 3;
		let nameText: string = "";
		if (itemData) {
			this.colorLoader.load(itemData.getColorRes());
			this.iconLoader.load(itemData.getIconRes());
			let amount: number = itemData.getItemAmount();
			if (amount > 1) {
				this.numTxt.text = App.MathUtils.formatNum(amount,false);
			} else {
				this.numTxt.text = "";
			}
			this.bindImg.visible = false;
			let isEquip: boolean = ItemsUtil.isEquipItem(this.itemData);
			if (isEquip) {
				this.cStar.selectedIndex = WeaponUtil.getStar(this.itemData);				
				if (this.itemData.isExpire) { // 三角色 职业永远符合 !CareerUtil.isCareerMatch(this.itemData.getCareer()) || 
					this.cScore.selectedIndex = 3;
				} else {
					this.cScore.selectedIndex = 0;
				}
				if (this.isShowCareerIco) {
					let baseCareer: number = CareerUtil.getBaseCareer(this.itemData.getCareer());
					var idx: number = ConfigManager.const.getRoleIndex(baseCareer);
					if (idx > -1) {
						careerIdx = idx;
					}
				}
			} else if (ItemsUtil.isBeastEquip(this.itemData)) {
				//神兽装备
                this.cStar.selectedIndex = ConfigManager.mgBeastEquip.getStar(this.itemData.getEffect());
				this.isShowStrengthLevel = true;
				itemData.showStrengthenLevel = itemData.beastStrLevel;
				
				let colorEx: number = ConfigManager.mgBeastEquip.getColorEx(this.itemData.getEffect());
				if(colorEx != 0){
					careerIdx = colorEx + 4;
				}
            } else {
				this.cScore.selectedIndex = 0;
				this.cStar.selectedIndex = 0;
				this.showBestMc(false);

			}
			this.updateStrengthLevel(itemData.showStrengthenLevel);
			this.updateRefineLevel(itemData.showCastingLevel);
			nameText = this.getItemNameText(isEquip);
			this.showGoldMc(this.itemData.getColor() == EColor.EColorGold);
			if (this.isNoneGray) {
				this.grayed = false;
			}
		} else {
			this.colorLoader.clear();
			this.numTxt.text = "";
			this.strengthTxt.text = "";
			this.txtStrengthenLevel.text = "";
			this.txtRefineLevel.text = "";
			this.iconLoader.clear();
			this.txtName.text = "";
			this.cCareer.setSelectedIndex(3);
			this.cScore.setSelectedIndex(0);
			this.cStar.setSelectedIndex(0);
			this.bindImg.visible = false;
			this.showBestMc(false);
			this._selectStatus = false;
			if (this.isNoneGray) {
				this.grayed = true;
			}
			let redPoint: fairygui.GObject = this.getChild(CommonUtils.redPointName);
			if (redPoint) {
				this.removeChild(redPoint);
			}
			this.showGoldMc(false);
		}
		this.bgVisible = this.itemData == null;
		this.numTxt.visible = this.numTxt.text != "";
		if (this.isResetSelect) {
			this._selectStatus = false;
		}
		if (nameText && this._itemData && this.isNameCount) {
			nameText += "x" + this._itemData.getItemAmount();
		}
		this.addItemEff();
		this.cCareer.setSelectedIndex(careerIdx); //职业角标
		this.setNameText(nameText);
		this.setNameVisible(this.isShowName);
		this.setSelectStatus(this._selectStatus);
		// this.updateGoldEffect();
	}

	private addItemEff():boolean {
		let flag:boolean = false;
		let pkgName: string = this.getColotEffectName();
		if (pkgName && this.isShowEffect) {
			flag = true;
			if(this.mcColor){
				if(this.mcColor.pkgName!=pkgName){
					this.mcColor.setRes(pkgName,pkgName);
				}
			}else{
				this.mcColor = UIMovieManager.get(pkgName, -195, -197, 1, 1);
				this.mcColor.frame = 0;
				this.mcColor.visible = true;
				this.mcColor.playing = true;
				this.mcColor.grayed = false; //创建的时候都不是灰的
			}
			this.addChild(this.mcColor);
			this.swapChildren(this.imgSelect, this.mcColor);
			let redPoint: fairygui.GObject = this.getChild(CommonUtils.redPointName);
			if (redPoint) {
				this.setChildIndex(redPoint, this.numChildren - 1);
			}
		}else{
			this.removeEff();
		}
		return flag;
	}
	private removeEff(): void {
		if (this.mcColor) {
			UIMovieManager.push(this.mcColor);
			this.mcColor = null;
		}
	}
	private getColotEffectName(): string {
		let pkgName: string = "";
		if (this._itemData && this._itemData.isNeedEffect()) {
			pkgName = PackNameEnum[`MCItemColor${this._itemData.getColor()}`];
		}
		return pkgName;
	}

	/**元宝道具特效 */
	private updateGoldEffect(): void {
		if (this.isShowEffect && (this.itemData != null && this.itemData.getCode() == ItemCodeConst.GoldOfShop)) {
			if (this.goldEffect == null) {
				this.goldEffect = UIMovieManager.get(PackNameEnum.MCRoop, -337, -353, 1, 1);
				this.addChild(this.goldEffect);
			}
		}
		else if (this.goldEffect) {
			this.goldEffect.destroy();
			this.goldEffect = null;
		}
	}

	private getItemNameText(isEquip: boolean): string {
		let nameText: string = "";
		if (this.isShowName) {
			if (isEquip && !ItemsUtil.isKillItem(this.itemData)) {
				nameText = WeaponUtil.getEquipLevelText(this.itemData);
			} else {
				nameText = this.itemData.getName(true);
			}
		}
		return nameText;
	}

	/**设置混元外框(必须在设置itemData之后设置) */
	public set ancientUrl(url:string){
		this.ancientLoader.load(url);
		this.ancientLoader.visible = true;
	}

	/**
	 * 设置背景图片
	 */
	public set bgUrl(url: string) {
		this.bgLoader.load(url);
	}

	/**
	 * 设置颜色品质图片
	 */
	public set colorUrl(url: string) {
		this.colorLoader.load(url);
	}

	/**设置图标的url */
	public set icoUrl(url: string) {
		this.iconLoader.load(url);
	}

	/**根据颜色枚举设置背景 */
	public setColorBG(color:EColor):void{
		this.colorUrl = URLManager.getItemColorUrl(`color_${color}`);
	}

	public setColorMcGrayed(grayed:boolean):void{
		if(this.mcColor){
			this.mcColor.grayed = grayed;
		}
		if(this.goldEffect){
			this.goldEffect.grayed = grayed;
		}
		if(this.goldMc){
			this.goldMc.grayed = grayed;
		}
	}

	/**设置名称文本 */
	public setNameText(text: string): void {
		if (this.isShowName) {
			this.txtName.text = text;
			if (this.isTxtNameStroke) {
				this.txtName.stroke = 1;
				this.txtName.strokeColor = 0x000000;
			} else {
				this.txtName.stroke = 0;
			}

		}
	}
	/**
	 * 设置名称文本是否可见
	 */
	public setNameVisible(value: boolean): void {
		if (this.txtName.visible != value) {
			this.txtName.visible = value;
		}
	}

	/**
	 * 设置文本的灰度
	 */
	public setNameGrayed(value: boolean): void {
		this.txtName.grayed = value;
	}
	/**
	 * 更新右下角数量
	 */
	public updateNum(value: string): void {
		this.numTxt.text = value;
		this.numTxt.visible = this.numTxt.text != "";
	}

	/**
	 * 更新右上角强化等级
	 */
	public updateStrength(value: string): void {
		this.strengthTxt.text = value;
	}

	public updateStrengthLevel(level: number): void {
		if (level > 0 && this.isShowStrengthLevel) {
			this.txtStrengthenLevel.text = "+" + level;
		} else {
			this.txtStrengthenLevel.text = "";
		}
		this.txtStrengthenLevel.visible = this.txtStrengthenLevel.text != "";
	}

	public set bgVisible(visible: boolean) {
		this.bgLoader.visible = visible;
	}

	public set colorBgVisible(visible: boolean) {
		this.colorLoader.visible = visible;
	}

	public get itemData(): ItemData {
		return this._itemData;
	}

	/**
	 * 是否更好的评分
	 */
	public set isBetterScore(isBetter: boolean) {
		this.cScore.setSelectedIndex(0); //暂时去掉箭头
		/*
		if (isBetter) {
			this.cScore.setSelectedIndex(1);
		} else {
			this.cScore.setSelectedIndex(2);
		}
		*/
	}
	public updateRefineLevel(lv: number): void {
		if (lv > 0 && this.isShowRefineLv) {
			this.txtRefineLevel.text = "" + lv;
		}
		else {
			this.txtRefineLevel.text = "";
		}
		this.txtRefineLevel.visible = this.txtRefineLevel.text != "";
	}

	public set strengthenLevel(strengthen: number) {
		this._strengthenLevel = strengthen;
		this.updateStrength(this._strengthenLevel > 0 ? this._strengthenLevel.toString() : "");
	}

	public get strengthenLevel(): number {
		return this._strengthenLevel;
	}

	//设置铸造等级
	public set forgeCastingLv(level: number) {
		this.updateRefineLevel(level);
	}

	/**
	 * 显示评分比较
	 */
	public showScoreCompare(isShow: boolean): void {
		if (ItemsUtil.isEquipItem(this.itemData)) {
			if (this.itemData.isExpire) {
				return;
			}
			if (isShow) {
				let pos: EDressPos = ItemsUtil.getEqiupPos(this.itemData);
				let equipped: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(pos);
				let equippedScore: number = WeaponUtil.getScoreBase(equipped);
				let selfScore: number = WeaponUtil.getScoreBase(this.itemData);
				if (selfScore == equippedScore) {
					this.cScore.setSelectedIndex(0);
				} else {
					this.isBetterScore = selfScore > equippedScore;
				}
			} else {
				this.cScore.setSelectedIndex(0);
			}
		} else {
			this.cScore.setSelectedIndex(0);
		}
	}

	/**
	 * 最高评分特效
	 */
	public showBestMc(isShow: boolean) {
		if (isShow) {
			// !CareerUtil.isCareerMatch(this.itemData.getCareer()) ||  多角色 不需要判断职业 
			if (ItemsUtil.isEquipItem(this.itemData) && this.itemData.getUid() != null && !this.itemData.isExpire) {
				this.mcBest.selectedIndex = this.itemData.isBestEquipInPack ? 1 : 0;
			}
		} else {
			this.mcBest.selectedIndex = 0;
		}
	}

	/**
	 * 显示绑定/非绑
	 */
	public showBind(): void {
		if (this.itemData) {
			this.bindImg.visible = this.itemData.isBind;
		} else {
			this.bindImg.visible = false;
		}
	}
	/**
	 * 显示职业角标
	 * @aparam idx 0 1 2 3 4 5 6;战 法 道 无 必掉 神（神兽） 圣（神兽）
	 */
	public showCareerIco(idx: number): void {
		this.cCareer.setSelectedIndex(idx);
	}

	/**强制显示/隐藏 */
	public forceShowBind(isShow: boolean): void {
		this.bindImg.visible = isShow;
	}

	public setStarNum(starNum: number): void {
		this.cStar.selectedIndex = starNum;
	}

	/**点击弹出tooltip */
	public click(evt: egret.Event): void {
		this.changeSelected();
		if (!this.enableToolTip) {
			return;
		}
		if(this.toolTipBySelected && !this.selected){
			return;
		}
		
		if (this.itemData) {
			if (this.itemData.getUid() != null && this.itemData.isCanUseInPack && CacheManager.pack.propCache.hasItem(this.itemData) && !ItemsUtil.isVipLimitedGiftBag(this.itemData)
				&& !ItemsUtil.isCanDonateItem(this.itemData)) {
				if (ItemsUtil.isChooseGiftBag(this.itemData)) {
					EventManager.dispatch(UIEventEnum.PackChooseGiftBagWindowOpen, this.itemData);
					return;
				}
				if(ItemsUtil.isMonthTempPrivilegeCard(this.itemData)) {
					EventManager.dispatch(UIEventEnum.ShowPrivilegeCardExpWindow);
					return;
				}
				EventManager.dispatch(UIEventEnum.PackUseOpen, this.itemData);
				return;
			}

			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.isEnableOptList = this.enableToolTipOpt;
			this.toolTipData.data = this.itemData;
			this.toolTipData.extData = this.extData;
			this.toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
			this.toolTipData.source = this.toolTipSource;
			ToolTipManager.show(this.toolTipData);
		}

		//evt.stopImmediatePropagation();
	}
	/**获取图标的全局坐标 */
	public getIcoPos(): egret.Point {
		let p: egret.Point = new egret.Point(0, 0);
		if (this.iconLoader) {
			p = this.localToGlobal(this.iconLoader.x, this.iconLoader.y);
		}
		return p;
	}

	private changeSelected(): void {
		if (BaseItem.SELECTED_ITEM) {
			BaseItem.SELECTED_ITEM.setSelectStatus(false);
		}
		BaseItem.SELECTED_ITEM = this;
		if (this.isSelectStatus) {
			BaseItem.SELECTED_ITEM.setSelectStatus(true);
		} else if (BaseItem.SELECTED_ITEM.selected) {
			BaseItem.SELECTED_ITEM.setSelectStatus(false);
		}
	}

	public setSelectStatus(isSelected: boolean): void {
		this._selectStatus = isSelected;
		this.imgSelect.visible = isSelected;
		if (isSelected && BaseItem.SELECTED_ITEM != this) {
			BaseItem.SELECTED_ITEM = this;
		}
	}

	/**显示金色特效 */
	private showGoldMc(isShow: boolean): void {
		if (isShow && this.isShowGoldMc) {
			if (!this.goldMc) {
				this.goldMc = UIMovieManager.get(PackNameEnum.MCEquipBest, 61, 58, 0.7, 0.7);
				this.goldMc.setSize(170, 170);
				this.goldMc.setPivot(0.5, 0.5, true);
			}
			this.addChild(this.goldMc);
		} else {
			if (this.goldMc) {
				this.goldMc.removeFromParent();
			}
		}
	}
}