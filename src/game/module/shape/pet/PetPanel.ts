/**
 * 宠物界面（新）
 */
class PetPanel extends BaseTabView {
    private controller: fairygui.Controller;
    private nameLoader: GLoader;
    private talentSkill: ShapeSkillItem;
    private skillList: List;
    private drugList: List;
    private starList: List;
    private luckyBar: ProgressBar1;//祝福值
    private curAttr: fairygui.GTextField;
    private nextAttr: fairygui.GTextField;
    private finalAttrTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private costTxt: fairygui.GRichTextField;
    private suitDetailBtn: fairygui.GButton;
    private activeBtn: fairygui.GButton;
    private onekeyBtn: fairygui.GButton;
    private autoBuyBtn: fairygui.GButton;
    private changeBtn: fairygui.GButton;
    private getBtn: fairygui.GButton;
    private upDrugLoader: GLoader;
    private goldLoader: GLoader;
    private fightPanel: FightPanel;
    private equipItems: any;

    private leftBtn: fairygui.GButton;
    private rightBtn: fairygui.GButton;

    /**模型展示 */
    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;

    private mcSuccess: UIMovieClip;
    private mcUpStar: UIMovieClip;
    private levelUpBtn: fairygui.GButton;

    /**活动按钮 */
    private activityIcon: MaterialsActivityGetItem;

    private curCfg: any;
    private eShape: EShape = EShape.EShapePet;
    private star: number;
    private starMax: number = 10;
    private isCanUpgrade: boolean;
    private isMax: boolean;
    private stage: number;
    private lastStage: number = -1;//上一次显示阶
    private modelId:number = -1;
    private lastModelId:number = -1;//上一次的模型展示id

    /**是否一键提升中 */
    private isOneKeyPromoteing: boolean = false;
    private isCanContinuePromote: boolean = true;

    private currentModelId: number;
    private currentModelIndex: number;
    private showModelIndex: number;
    private modelIds: Array<number>;
    private levelUpItemDatas: Array<ItemData>;
    private upgradeItemDatas: Array<ItemData>;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.controller = this.getController("c1");
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.talentSkill = this.getGObject("talentSkill") as ShapeSkillItem;
        this.skillList = new List(this.getGObject("list_skill").asList);
        this.drugList = new List(this.getGObject("list_drug").asList);
        this.starList = new List(this.getGObject("list_star").asList);
        this.luckyBar = <ProgressBar1>this.getGObject("progressBar_lucky");
        this.curAttr = this.getGObject("txt_curAttr").asTextField;
        this.nextAttr = this.getGObject("txt_nextAttr").asTextField;
        this.finalAttrTxt = this.getGObject("txt_finalAttr").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.suitDetailBtn = this.getGObject("btn_suitDetail").asButton;
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.onekeyBtn = this.getGObject("btn_upgrade").asButton;
        this.autoBuyBtn = this.getGObject("btn_autoBuy").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.getBtn = this.getGObject("btn_get").asButton;
        this.upDrugLoader = <GLoader>this.getGObject("loader_upDrug");
        this.goldLoader = <GLoader>this.getGObject("loader_gold");
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");

        this.equipItems = {};
        for(let type of CacheManager.pet.petEquipType){
            let petEquipItem: PetEquipItem = <PetEquipItem>this.getGObject(`petequip_${type}`);
            this.equipItems[type] = petEquipItem;
        }

        this.leftBtn = this.getGObject("btn_left").asButton;
        this.rightBtn = this.getGObject("btn_right").asButton;

        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(EShape.EShapePet);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 20;
        this.modelBody.y = 5;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.suitDetailBtn.addClickListener(this.clickSuitDetailBtn, this);
        this.activeBtn.addClickListener(this.clickActiveBtn, this);
        this.onekeyBtn.addClickListener(this.clickOnekey, this);
        this.autoBuyBtn.addClickListener(this.clickAutoBuy, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.getBtn.addClickListener(this.clickGet, this);
        this.leftBtn.addClickListener(this.clickChangeModelBtn, this);
        this.rightBtn.addClickListener(this.clickChangeModelBtn, this);
        this.upDrugLoader.addClickListener(this.onTouchCostIconHandler, this);
        this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
        this.levelUpBtn.addClickListener(this.clickLevelUp, this);

        this.activityIcon = <MaterialsActivityGetItem>FuiUtil.createComponent(PackNameEnum.Common, "MaterialsActivityGetItem", MaterialsActivityGetItem);
        this.activityIcon.setParent(this, 15, 875);

        GuideTargetManager.reg(GuideTargetName.PetPanelOnekeyBtn, this.onekeyBtn);
    }

    public updateAll(): void {
        this.updateAttr();
        this.updateSkill();
        // this.updateEquip();
        if (this.modelIds == null) {
            this.modelIds = ConfigManager.mgShape.getModels(this.eShape);
        }
        if (CacheManager.pet.shapeInfo) {
            this.currentModelId = this.curCfg.modelId;//CacheManager.pet.shapeInfo.useModelId_I; //幻化后不改变显示模型
        } else {
            this.currentModelId = this.modelIds[0];
        }
        this.currentModelIndex = this.modelIds.indexOf(this.currentModelId);
        this.showModelIndex = this.currentModelIndex;
        // this.model.setData(this.currentModelId);
        // this.nameLoader.load(URLManager.getModuleImgUrl(this.currentModelId + ".png", PackNameEnum.Pet));


        this.clickChangeModelBtn();
        this.updateStatus();

        if(CacheManager.pet.shapeInfo && !this.isMax){
            this.activityIcon.setData(this.curCfg.useItemCode);
        }else{
            this.activityIcon.setData(0);
        }
    }

    public hide(): void {
        super.hide();
        this.stopOneKey();
    }

    private clickSuitDetailBtn(): void {
        EventManager.dispatch(UIEventEnum.PetSuitDetailViewOpen);
    }

    private clickActiveBtn(): void {
        if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Pet)) {
            ProxyManager.shape.shapeActivate(this.eShape);
        }
    }

    private clickUpgradeBtn(): void {
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeUpgrade(this.eShape, this.autoBuyBtn.selected);
        } else {
            Tip.showOptTip(LangShapeBase.LANG25);
        }
    }

    /**点击一键提升/停止 */
    private clickOnekey(): void {
        if (this.isOneKeyPromoteing) {
            this.stopOneKey();
            return;
        }

        if (!this.isCanContinuePromote) {
            return;
        }
        this.isOneKeyPromoteing = true;
        this.clickPromote(false);
        this.updateOneKeyBtn();
    }

    private updateOneKeyBtn(): void {
        if (this.isOneKeyPromoteing) {
            this.onekeyBtn.text = LangShapeBase.LANG3;
        } else {
            this.onekeyBtn.text = LangShapeBase.LANG4;
        }
    }

	/**
     * 提升
     * @param {boolean} isAuto 是否为自动点击的
     */
    private clickPromote(isAuto: boolean = true): void {
        if (this.isMax) {
            Tip.showOptTip(LangShapeBase.LANG1);
            this.stopOneKey();
            return;
        }
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeUpgrade(this.eShape, this.autoBuyBtn.selected);
        } else {
            // if (!isAuto) {//一键提升材料不足时不谈窗
            // }
            if (this.autoBuyBtn.selected) {
                MoneyUtil.alertMoney(GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold]);
            } else {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curCfg.useItemCode });
            }
            let itemCfg: any = ConfigManager.item.getByPk(this.curCfg.useItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            this.stopOneKey();
        }
    }

	/**
     * 停止一键提升
     */
    private stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
    }

    private clickAutoBuy(): void {
        this.updateProp();
    }

    private clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetChange);
        this.stopOneKey();
    }

    /**
	 * 获取道具
	 */
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curCfg.useItemCode });
	}

	/**
     * 提升成功后触发
     */
    public onSuccess(info: any): void {
        if (info.result) {//升星成功
            this.luckyBar.setValue(this.curCfg.luckyMax, this.curCfg.luckyMax);
            App.TimerManager.remove(this.onUpgrade, this);
            App.TimerManager.doDelay(100, this.onUpgrade, this);
            this.stopOneKey();
        } else {
            this.updateAll();
        }
        this.isCanContinuePromote = true;
        if (this.isOneKeyPromoteing) {
            App.TimerManager.doDelay(50, this.clickPromote, this);
        }
    }

    private onUpgrade(): void {
        this.updateAll();
        if (this.curCfg.star != 0) {//进阶成功不显示升星特效
            this.playStarMc();
        }
        // this.stopOneKey();
    }

    public updateStatus(): void {
        // this.shapeInfo = CacheManager.pet.shapeInfo;
        if (CacheManager.pet.shapeInfo) {
            this.controller.selectedIndex = 1;
        } else {
            this.controller.selectedIndex = 0;
        }
        if (this.isMax) {
            this.controller.selectedIndex = 2;
        }
    }

    private updateAttr(): void {
        let level: number = CacheManager.pet.level;
        let attrListData: Array<AttrInfo> = MgShapeConfig.getAttrListData(this.eShape, level);
        let drugAttrCfg: any = MgShapeDrugAttrConfig.getDrugAttr(this.eShape);
        let drugUsed: any = CacheManager.pet.getDrugUsed();
        let curStr: string = "";
        let nextStr: string = "";
        for (let attr of attrListData) {
            let value: number = attr.value;
            let nextValue: number = attr.nextValue;
            let attrRates: number = 0;
            for (let drugCode in drugUsed) {
                if (drugUsed[drugCode]) {
                    let drugAttr: any = drugAttrCfg[drugCode];
                    let drugAttrDict: any = drugAttr.attrDict;
                    if (drugAttrDict[attr.type]) {
                        value += drugAttrDict[attr.type] * drugUsed[drugCode];
                        nextValue += drugAttrDict[attr.type] * drugUsed[drugCode];
                    }
                    if (drugAttr.attrRate) {
                        attrRates += drugAttr.attrRate / 10000 * drugUsed[drugCode];
                    }
                }
            }
            if(attrRates != 0){
                value *= (1 + attrRates);
                nextValue *= (1 + attrRates);
            }
            curStr += `${attr.name}: ${Math.floor(value)}\n`;
            nextStr += `${attr.name}: ${Math.floor(nextValue)}\n`;
        }
        this.curAttr.text = curStr;
        this.nextAttr.text = nextStr;
        this.finalAttrTxt.text = curStr;

        this.curCfg = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, level);
        this.isMax = level == ConfigManager.mgShape.getMaxLevel(this.eShape);
        if (this.curCfg) {
            this.stage = this.curCfg.stage;
            this.star = this.curCfg.star != null ? this.curCfg.star : 0;
            this.modelId = this.curCfg.modelId;
            this.fightPanel.updateValue(CacheManager.pet.warfare);
            // this.levelTxt.text = `${FuiUtil.getStageStr(this.stage)}阶`;
            this.updateStar();
            this.updateProp();
            this.updateLucky();
        } else {
            this.fightPanel.updateValue(0);
            this.updateStar();
        }

        if (this.lastStage != -1 && this.stage > this.lastStage) {
            //升阶了，停止一键
            this.stopOneKey();
            this.playSuccessMc();
            if(this.lastModelId > 0 && this.modelId != this.lastModelId) {
                EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:EShape.EShapePet});
            }
        }

        if (this.isMax) {//达到最高等级
            this.stopOneKey();
        }

        this.lastStage = this.stage;
        this.lastModelId = this.modelId;
    }

    private updateSkill(): void {
        let skills: Array<any> = CacheManager.pet.getSkills();
        this.skillList.data = skills;
        this.talentSkill.setData(CacheManager.pet.getTalentSkill());
    }

    private updateDrug(): void {
        let drugCodes: Array<number> = MgShapeDrugAttrConfig.getDrugCodes(this.eShape);
        let drugUsed: any = CacheManager.pet.getDrugUsed();
        let drugDatas: Array<any> = [];
        for (let i = 0; i < drugCodes.length; i++) {
            let useNum: number = drugUsed[drugCodes[i]] ? drugUsed[drugCodes[i]] : 0;
            let drugType: number = i + 1;
            let nextDrugLevel: number = MgShapeConfig.getNextDrugMaxLevel(this.eShape, CacheManager.pet.level, drugType);
            drugDatas.push({
                "code": drugCodes[i],
                "used": useNum,
                "max": this.curCfg[`drug${drugType}ItemMax`],
                "drugType": drugType,
                "shape": this.eShape,
                "level": nextDrugLevel,
                "role": -1,
            });
        }
        this.drugList.data = drugDatas;
    }

	/**
     * 更新星级
     */
    private updateStar(): void {
        let data: Array<number> = [];
        for (let i: number = 0; i < this.starMax; i++) {
            if (i < this.star) {
                data.push(1);
            } else {
                data.push(0);
            }
        }
        this.starList.data = data;
    }

    /**更新幸运值 */
    private updateLucky(): void {
        this.luckyBar.setValue(CacheManager.pet.shapeInfo.lucky_I, this.curCfg.luckyMax);
        // if (this.isMax || this.isFullStar) {
        //     this.luckyBar.setValue(100, 100);
        // } else {
        //     this.luckyBar.setValue(this.exInfo.lucky, this.cfg["luckyNeed"]);
        // }
        // this.maxImg.visible = this.isMax;
        // this.luckyBar.progressTxt.visible = !this.isFullStar;
    }

	/**
     * 更新道具
     */
    public updateProp(): void {
        if (this.curCfg == null) {
            return;
        }
        let ownedValue: number = 0;//拥有数值
        let costValue: number = 0;//显示的消耗数值
        let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.curCfg.useItemCode);
        let costNum: number = this.curCfg.useItemNum ? this.curCfg.useItemNum : 0;
        let shopCell: any = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, this.curCfg.useItemCode);
        let propSellPrice: number = 0;
        let materialData: any = ConfigManager.item.getByPk(this.curCfg.useItemCode);
        if (shopCell != null) {
            propSellPrice = shopCell["price"];
        }

        // this.costGroup.visible = costNum != 0;
        if (this.autoBuyBtn.selected && costNum > count) {//材料不足使用元宝自动购买
            ownedValue = CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold);
            costValue = (costNum - count) * propSellPrice;
            this.upDrugLoader.visible = false;
            this.goldLoader.visible = true;
        } else {
            ownedValue = count;
            costValue = costNum;
            this.upDrugLoader.visible = true;
            this.goldLoader.visible = false;
        }
        this.autoBuyBtn.visible = !this.isMax && propSellPrice > 0;

        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        this.upDrugLoader.load(URLManager.getIconUrl(materialData.icon, URLManager.ITEM_ICON));
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isOneKeyPromoteing);

        if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }

        this.updateDrug();//属性药也是道具
        this.updateEquip();//宠物装备也在道具背包
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.petChange.checkTips());//激活和升级都是道具

        this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isPetUpLevelItem, ItemsUtil);
        this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isPetUpgradeItem, ItemsUtil);

		this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
		CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);
    }

    /**更新装备 */
    private updateEquip(): void{
        let equipData: any;
        let equipInfo: any = CacheManager.pet.getEquips();
        for(let type of CacheManager.pet.petEquipType){
            let petEquipItem: PetEquipItem = <PetEquipItem>this.equipItems[type];
            if(equipInfo[type]){//已穿戴装备
                equipData = {"type": type, "itemCode": equipInfo[type]};
            }else{
                equipData = {"type": type};
            }
            petEquipItem.setData(equipData);
        }
    }

    /**
     * 播放成功特效
     */
    private playSuccessMc(): void {
        if (this.mcSuccess == null) {
            this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
        }
        this.mcSuccess.x = this.modelContainer.x - 255;
        this.mcSuccess.y = this.modelContainer.y - 140;
        this.addChild(this.mcSuccess);
        this.mcSuccess.alpha = 1;
        egret.Tween.removeTweens(this.mcSuccess);
        this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
            egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
                this.mcSuccess.removeFromParent();
                this.mcSuccess.playing = false;
            })
        }, this);
        this.mcSuccess.playing = true;
    }

    /**升星 */
    private playStarMc(): void {
        if (this.mcUpStar == null) {
            this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);
            this.mcUpStar.x = -232;
            this.mcUpStar.y = -232;
        }
        let index: number;
        if (this.star == 0) {
            index = 9;
        } else {
            index = this.star - 1;
        }
        let starItem: StarItem = <StarItem>this.starList.list.getChildAt(index);
        starItem.addChild(this.mcUpStar);
        this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
            this.mcUpStar.removeFromParent();
            this.mcUpStar.playing = false;
        }, this);
        this.mcUpStar.playing = true;
    }

    /**
     * 点击改变模型按钮
     */
    private clickChangeModelBtn(e: egret.TouchEvent = null): void {
        let showModelId: number;
        if (e != null) {
            let btn: fairygui.GButton = e.target;
            if (btn == this.leftBtn) {
                this.showModelIndex--;
            } else {
                this.showModelIndex++;
            }
            if (this.showModelIndex > this.currentModelIndex + 1) {//最高只显示下一阶
                this.showModelIndex = this.currentModelIndex + 1;
            }
        }
        showModelId = this.modelIds[this.showModelIndex];
        this.model.setData(showModelId);
        this.updateChangeModelBtn();
        if(this.showModelIndex == this.currentModelIndex){
            this.levelTxt.text = FuiUtil.getStageStr(this.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
        }else{
            let showStage: number = ConfigManager.mgShape.getModelFirstStage(this.eShape, showModelId);
            this.levelTxt.text = FuiUtil.getStageStr(showStage) + "阶" + FuiUtil.getStageStr(1) + "星";
        }
        this.nameLoader.load(URLManager.getModuleImgUrl(showModelId + ".png", PackNameEnum.Pet));
    }

    /**
     * 更新按钮状态(屏蔽模型切换)
     */
    private updateChangeModelBtn(): void {
        let isFirst: boolean = this.showModelIndex == 0;
        let isLast: boolean = this.showModelIndex == this.modelIds.length - 1 || this.showModelIndex == this.currentModelIndex + 1;
        this.leftBtn.visible = !isFirst;
        this.rightBtn.visible = !isLast;

        // this.leftBtn.visible = false;
        // this.rightBtn.visible = false;
    }

    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curCfg.useItemCode);
    }

    /**
     * 点击提升
     */
    private clickLevelUp(): void {
        let tip: string;
		let upgradeTip: string = LangShapeBase.LANG11;
		let levelTip: string = LangShapeBase.LANG12;
		let isCanUse: boolean = true;
		let itemData: ItemData;
		if (this.stage >= 5) {
			if (this.upgradeItemDatas.length > 0) {
				itemData = this.upgradeItemDatas[0];
				tip = upgradeTip;
				if (itemData.isExpire) {
					tip = App.StringUtils.substitude(LangShapeBase.LANG10, itemData.sellPrice);
				}
			} else if (this.levelUpItemDatas.length > 0) {
				tip = levelTip;
				itemData = this.levelUpItemDatas[0];
				if (itemData.isExpire) {
					tip = App.StringUtils.substitude(LangShapeBase.LANG10, itemData.sellPrice);
				}
			}
		} else {
			tip = levelTip;
			if (this.levelUpItemDatas.length > 0) {
				itemData = this.levelUpItemDatas[0];
				if (itemData.isExpire) {
					tip = App.StringUtils.substitude(LangShapeBase.LANG10, itemData.sellPrice);
				}
			} else if (this.upgradeItemDatas.length > 0) {
				itemData = this.upgradeItemDatas[0];
				tip = upgradeTip;
				isCanUse = false;
                if (itemData.isExpire) {
                    tip = App.StringUtils.substitude(LangShapeBase.LANG10, itemData.sellPrice);
                }
			}
		}

		if (itemData) {
			Alert.alert(tip, () => {
				if (isCanUse || itemData.isExpire) {
					ProxyManager.pack.useItem(itemData.getUid(), 1, []);
				} else {
					Tip.showLeftTip(LangShapeBase.LANG13);
				}
			}, this);
		}
    }
}