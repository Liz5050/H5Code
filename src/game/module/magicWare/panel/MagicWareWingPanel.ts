/**
 * 翅膀
 */
class MagicWareWingPanel extends BaseTabView {
    private statusController: fairygui.Controller;
    private costController: fairygui.Controller;
    private nameLoader: GLoader;
    private activeBtn: fairygui.GButton;
    private openTxt: fairygui.GTextField;
    private stageTxt: fairygui.GTextField;
    private fightPanel: FightPanel;
    private luckyBar: ProgressBar1;//祝福值
    private maxImg: fairygui.GImage;//满级图片
    private attrTxt: fairygui.GRichTextField;
    private nextAttrTxt: fairygui.GRichTextField;
    private attrFinal: fairygui.GRichTextField;
    private godBtn: fairygui.GButton;
    private drugList: List;
    private skillList: List;
    // private promoteBtn: fairygui.GButton;
    private onekeyBtn: fairygui.GButton;
    private featherLoader: GLoader;
    private goldLoader: GLoader;
    private costTxt: fairygui.GRichTextField;
    private autoBuyBtn: fairygui.GButton;

    private mcSuccess: UIMovieClip;
    private mcUpStar: UIMovieClip;
    private starList: List;
    // private levelUpBtn: fairygui.GButton;
    private costGroup: fairygui.GGroup;
    private getBtn: fairygui.GButton;

    /**模型展示 */
    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private wingModel: ModelShow;

    private leftBtn: fairygui.GButton;
    private rightBtn: fairygui.GButton;

    /**活动按钮 */
    private activityIcon: MaterialsActivityGetItem;
    private wingUpgradeIcon: WingUpgradeItem;
    

    private strengthenType: EStrengthenExType = EStrengthenExType.EStrengthenExTypeWing;
    private _roleIndex: number = RoleIndexEnum.Role_index0;
    private strengthenLevel: number = 0;
    private cfg: any;
    private exInfo: any;
    private isCanUpgrade: boolean;
    private skillDatas: Array<any>;
    private drugItemDatas: Array<ItemData>;
    private isMax: boolean;
    /**是否一键提升中 */
    private isOneKeyPromoteing: boolean = false;
    private isCanContinuePromote: boolean = true;
    private shopCell: any;//消耗物品购买信息
    private propSellPrice: number = 0;//消耗物品价格
    private stage: number;
    private star: number;
    private lastStage: number = -1;//上一次显示阶
    private lastStar: number = -1;//上一次显示的星级
    private modelId:number = -1;
    private lastModelId:number = -1;//上一次的模型展示id
    // private itemCode: number;
    private starMax: number = 10;
    private levelUpItemDatas: Array<ItemData>;
    private oldLevelUpItemDatas: Array<ItemData>;
    private upgradeItemDatas: Array<ItemData>;
    private isStrengthenExActive: boolean;

    private useItemCode: number;
    private currentModelId: number;
    private currentModelIndex: number;
    private showModelIndex: number;
    private modelIds: Array<number>;

    private changeBtn: fairygui.GButton;

    public constructor() {
        super();
        this.useItemCode = ConfigManager.mgStrengthenEx.getUseItemCode(this.strengthenType);
    }

    public initOptUI(): void {
        this.statusController = this.getController("c1");
        this.costController = this.getController("c2");
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.activeBtn.addClickListener(this.clickActive, this);
        this.stageTxt = this.getGObject("txt_stage").asTextField;
        this.openTxt = this.getGObject("txt_open").asTextField;
        this.fightPanel = <FightPanel>this.getGObject("panel_fight");
        this.godBtn = this.getGObject("btn_godWing").asButton;
        this.luckyBar = <ProgressBar1>this.getGObject("progressBar_lucky");
        this.maxImg = this.getGObject("img_full").asImage;
        this.attrTxt = this.getGObject("txt_attr").asRichTextField;
        this.nextAttrTxt = this.getGObject("txt_nextAttr").asRichTextField;
        this.attrFinal = this.getGObject("txt_attr_final").asRichTextField;
        this.drugList = new List(this.getGObject("list_drug").asList);
        this.skillList = new List(this.getGObject("list_skill").asList);
        // this.promoteBtn = this.getGObject("btn_promote").asButton;
        this.onekeyBtn = this.getGObject("btn_automaticPromote").asButton;
        this.autoBuyBtn = this.getGObject("btn_autoBuy").asButton;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.featherLoader = <GLoader>this.getGObject("loader_feather");
        this.goldLoader = <GLoader>this.getGObject("loader_gold");
        // this.mcSuccess = this.getGObject("MC_success").asMovieClip;
        this.starList = new List(this.getGObject("list_star").asList);
        // this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.getBtn = this.getGObject("btn_get").asButton;
        this.leftBtn = this.getGObject("btn_left").asButton;
        this.rightBtn = this.getGObject("btn_right").asButton;

        this.godBtn.addClickListener(this.clickGod, this);
        this.onekeyBtn.addClickListener(this.clickOnekey, this);
        this.autoBuyBtn.addClickListener(this.clickAutoBuy, this);
        this.featherLoader.addClickListener(this.clickFeather, this);
        // this.levelUpBtn.addClickListener(this.clickLevelUp, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.getBtn.addClickListener(this.clickGet, this);
        this.leftBtn.addClickListener(this.clickChangeModelBtn, this);
        this.rightBtn.addClickListener(this.clickChangeModelBtn, this);

        this.costGroup = this.getGObject("group_cost").asGroup;

      

        this.modelContainer = this.getGObject("model_container").asCom;
        this.wingModel = new ModelShow(EShape.EShapeWing);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.wingModel);
        this.modelBody.x = 358;
        this.modelBody.y = 230;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);
        this.wingModel.setData(4001);

        this.activityIcon = <MaterialsActivityGetItem>FuiUtil.createComponent(PackNameEnum.Common, "MaterialsActivityGetItem", MaterialsActivityGetItem);
        this.activityIcon.setParent(this, 15, 875);

        this.wingUpgradeIcon = <WingUpgradeItem>FuiUtil.createComponent(PackNameEnum.MagicWare, "WingUpgradeItem", WingUpgradeItem);
        this.wingUpgradeIcon.setParent(this, 36, 320);
        

        GuideTargetManager.reg(GuideTargetName.WingActiveBtn, this.activeBtn);
        GuideTargetManager.reg(GuideTargetName.WingOneKeyBtn, this.onekeyBtn);
    }

    public updateAll(data: any = null): void {
        if (this.modelIds == null) {
            this.modelIds = ConfigManager.mgStrengthenEx.getModels(this.strengthenType);
        }
        this.updateOpenTxt();
        this.strengthenLevel = CacheManager.role.getPlayerStrengthenExLevel(this.strengthenType, this.roleIndex);
        this.isMax = this.strengthenLevel == ConfigManager.mgStrengthenEx.getMaxLevel(this.strengthenType);
        this.isStrengthenExActive = CacheManager.role.isStrengthenExActive(this.strengthenType, this.roleIndex);
        this.statusController.selectedIndex = this.isStrengthenExActive ? 1 : 0;
        if (this.isMax) {
            this.statusController.selectedIndex = 2;
        }
        this.cfg = StrengthenExUtil.getCurrentCfg(this.strengthenType, this.roleIndex);
        this.exInfo = CacheManager.role.getPlayerStrengthenExtInfo(this.strengthenType, this.roleIndex);
        if (this.exInfo) {
            this.currentModelId = this.exInfo.useModelId;
            this.currentModelIndex = this.modelIds.indexOf(this.currentModelId);
            this.showModelIndex = this.currentModelIndex;
            this.wingModel.setData(this.currentModelId);
            this.nameLoader.load(URLManager.getModuleImgUrl(`Wing/${this.currentModelId}.png`, PackNameEnum.MagicWare));
            this.scaleModel();
        }

        
        this.updateIcon();


        if (!this.isStrengthenExActive || this.cfg == null) {
            return;
        }


        this.stage = this.cfg["stage"];
        this.star = this.cfg.star != null ? this.cfg.star : 0;
        this.modelId = this.cfg.modelId;
        if (this.isMax) {
            this.star = 10;
        }

        this.stageTxt.text = FuiUtil.getStageStr(this.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
        let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
        if (itemCfg) {
            this.featherLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        }
        this.shopCell = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, this.useItemCode);
        if (this.shopCell != null) {
            this.propSellPrice = this.shopCell["price"];
        }
        this.updateAttrList();
        this.updateProp();
        this.updateSkill();
        if (this.lastStage != -1 && this.stage > this.lastStage) {
            //升阶了，停止一键
            this.stopOneKey();
            this.playSuccessMc();
            if(this.lastModelId > 0 && this.modelId != this.lastModelId) {
                EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:EShape.EShapeWing,roleIndex:this.roleIndex});
            }
        }
        this.updateStar(this.star);
        this.updateOneKeyBtn();
        this.updateLucky();
        if (this.isMax) {//达到最高等级
            this.stopOneKey();
        }
        this.starList.list.visible = !this.isMax;
        this.luckyBar.visible = !this.isMax;
        this.onekeyBtn.visible = !this.isMax;
        this.autoBuyBtn.visible = !this.isMax && this.propSellPrice > 0;

        this.lastStage = this.stage;
        this.lastStar = this.star;
        this.lastModelId = this.modelId;
        this.updateChangeModelBtn();

    }

    public set roleIndex(roleIndex: number) {
        this._roleIndex = roleIndex;
        this.lastStage = -1;
        this.lastStar = -1;
        this.updateAll();
        this.stopOneKey();
    }

    public get roleIndex(): number {
        return this._roleIndex;
    }

    /**
     * 提升成功后触发
     */
    public onSuccess(info: SUpgradeStrengthenEx): void {
        if (info.result) {//升星成功
            this.luckyBar.setValue(this.cfg["luckyNeed"], this.cfg["luckyNeed"]);
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
        if (this.star != 0) {//进阶成功不显示升星特效
            this.playStarMc();
        }
        // this.stopOneKey();
    }

    private setGodWingTip(roleIndex: number): void {
        CommonUtils.setBtnTips(this.godBtn, CacheManager.godWing.checkRoleTip(roleIndex));
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.shapeWingChange.checkTips(roleIndex));
    }

    /**
     * 激活成功后触发
     */
    public onActived(): void {
        this.updateAll();
    }

    /**
     * 更新道具
     */
    public updateProp(): void {
        if (!this.isStrengthenExActive || this.cfg == null) {
            return;
        }
        let ownedValue: number = 0;//拥有数值
        let costValue: number = 0;//显示的消耗数值
        let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.useItemCode);
        let costNum: number = this.cfg["useItemNum"] ? this.cfg["useItemNum"] : 0;

        if (this.autoBuyBtn.selected && costNum > count) {//材料不足使用元宝自动购买
            ownedValue = CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold);
            costValue = (costNum - count) * this.propSellPrice;
            this.featherLoader.visible = false;
            this.goldLoader.visible = true;
        } else {
            ownedValue = count;
            costValue = costNum;
            this.featherLoader.visible = true;
            this.goldLoader.visible = false;
        }
        this.costGroup.visible = costNum != 0;
        this.costTxt.visible = costNum != 0 && this.statusController.selectedIndex == 1;

        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isOneKeyPromoteing);
        

        if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }

        this.updateDrug();//属性药也是道具

        this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isWingUpLevelItem, ItemsUtil);
        this.oldLevelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isOldWingUpLevelItem, ItemsUtil);
        this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isWingUpgradeItem, ItemsUtil);
        // this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.oldLevelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
        // CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);
        this.setGodWingTip(this._roleIndex);
        this.updateIcon();
    }

    public updateIcon(): void{
        if(this.isStrengthenExActive && !this.isMax){
            this.activityIcon.setData(this.useItemCode);
            this.wingUpgradeIcon.setData(this.roleIndex);
        }else{
            this.activityIcon.setData(0);
            this.wingUpgradeIcon.setData(-1);
        }
    }

    public hide(): void {
        super.hide();
        this.stopOneKey();
    }

    /**使用仙羽 */
    private clickDrugBaseItem(e: any): void {
        // let itemData: ItemData = (e.target as MWDrugItem).itemData;
        // let amount: number = CacheManager.pack.propCache.getItemCountByCode2(itemData.getCode());
        // let drugType: number;
        // let itemCode: number;
        // for (let i = 0; i < this.drugItems.length; i++) {
        //     itemCode = e.target.itemData.getCode();
        //     if (itemCode == this.drugItems[i].itemData.getCode()) {
        //         drugType = i + 1;
        //         break;
        //     }
        // }
        // if (amount > 0) {
        //     let drugMaxDict: any = ConfigManager.strengthenExDrug.getDrugMaxDict(this.strengthenType);//最大使用数量
        //     let usedAmount: number = Number(this.drugItems[drugType - 1].numTxt.text);
        //     let canUseAmount: number = drugMaxDict[itemCode] - usedAmount;
        //     if (canUseAmount > 0) {
        //         amount = amount > canUseAmount ? canUseAmount : amount;
        //         EventManager.dispatch(LocalEventEnum.PlayerStrengthExUseDrug, this.strengthenType, this.roleIndex, drugType, amount);
        //     }
        //     else {
        //         Tip.showOptTip("新上限即将开放，敬请期待");
        //     }
        // }
        // e.target.selected = false;
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
            EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, this.strengthenType, this.roleIndex, this.autoBuyBtn.selected);
        } else {
            // if (!isAuto) {//一键提升材料不足时不谈窗
            // }
            if (this.autoBuyBtn.selected) {
                MoneyUtil.alertMoney(GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold]);
            } else {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
            }
            let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            this.stopOneKey();
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
        if (this.isFullStar) {
            this.clickPromote();
            return;
        }
        this.isOneKeyPromoteing = true;
        this.clickPromote(false);
        this.updateOneKeyBtn();
    }

    private updateOneKeyBtn(): void {
        if (this.isOneKeyPromoteing) {
            this.onekeyBtn.text = "停  止";
        } else {
            this.onekeyBtn.text = this.isFullStar ? "进  阶" : "一键升星";
        }
    }

    /**
     * 停止一键提升
     */
    private stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
    }

    /**更新幸运值 */
    private updateLucky(): void {
        if (this.isMax || this.isFullStar) {
            this.luckyBar.setValue(100, 100);
        } else {
            this.luckyBar.setValue(this.exInfo.lucky, this.cfg["luckyNeed"]);
        }
        this.maxImg.visible = this.isMax;
        if (this.isMax) {
            this.statusController.setSelectedIndex(2);
        }
        this.luckyBar.progressTxt.visible = !this.isFullStar;
    }

    /**更新属性药 */
    private updateDrug(): void {
        let drugCodes: Array<number> = StrengthenExDrugConfig.getDrugCodes(this.strengthenType);
        let drugUsed: any = CacheManager.magicWare.getDrugUsed(this.strengthenType, this.roleIndex);
        let drugMaxDict: any = ConfigManager.strengthenExDrug.getDrugMaxDict(this.strengthenType);//最大使用数量
        let drugDatas: Array<any> = [];
        for (let i = 0; i < drugCodes.length; i++) {
            let useNum: number = drugUsed[drugCodes[i]] ? drugUsed[drugCodes[i]] : 0;
            let drugType: number = i + 1;
            // let nextDrugLevel: number = MgShapeConfig.getNextDrugMaxLevel(this.eShape, this.getShapeCache().getLevel(this.roleIndex), drugType);
            drugDatas.push({
                "code": drugCodes[i],
                "used": useNum,
                "max": drugMaxDict[drugCodes[i]],
                "drugType": drugType,
                "strengthenType": this.strengthenType,
                // "level": nextDrugLevel,
                "role" : this.roleIndex
            });
        }
        this.drugList.data = drugDatas;

        // if (this.drugItemDatas == null) {
        //     this.drugItemDatas = ConfigManager.strengthenExDrug.getDrugs(this.strengthenType);
        // }
        // if (this.drugItemDatas) {
        //     let drugDict: any = StructUtil.dictIntIntToDict(this.exInfo.drugDict);
        //     let drugMaxDict: any = ConfigManager.strengthenExDrug.getDrugMaxDict(this.strengthenType);//最大使用数量
        //     let itemData: ItemData;
        //     let count: number;
        //     let drugTxt: fairygui.GTextField;

        //     let drugItem: MWDrugItem;
        //     let canUseAmount: number;
        //     let itemCode: number;
        //     for (let i = 0; i < this.drugItemDatas.length; i++) {
        //         let usedAmount: number = 0;
        //         drugItem = this.drugItems[i];
        //         itemData = this.drugItemDatas[i];
        //         itemCode = itemData.getCode();
        //         this.drugItems[i].itemData = itemData;
        //         if (drugDict[itemCode] != null) {
        //             usedAmount = drugDict[itemCode];
        //         }
        //         drugItem.num = usedAmount;
        //         count = CacheManager.pack.propCache.getItemCountByCode2(itemCode);
        //         canUseAmount = drugMaxDict[itemCode] - usedAmount;
        //         drugItem.maxNum = drugMaxDict[itemCode];
        //         drugItem.enableToolTip = count == 0;
        //         drugTxt = this.drugTxts[i];
        //         let drugTrans: fairygui.Transition = this.drugTrans[i];
        //         if (count > 0) {
        //             drugTxt.text = count + "↑";
        //         } else {
        //             drugTxt.text = "";
        //         }
        //         drugTxt.visible = count > 0 && canUseAmount > 0;
        //     }
        // }
    }

    /**更新技能 */
    private updateSkill(): void {
        let skills: Array<any> = CacheManager.magicWare.getSkills(this.strengthenType, this.roleIndex);
        this.skillList.data = skills;
        // this.skillDatas = [];
        // let cfgs: Array<any> = ConfigManager.mgStrengthenEx.getHadOpenSkills(this.strengthenType);
        // let skillId: number;
        // let openDesc: string = "";
        // let isOpen: boolean;
        // for (let cfg of cfgs) {
        //     skillId = cfg.openSkill;
        //     isOpen = this.isOpenSkill(skillId);
        //     if (!isOpen) {
        //         openDesc = cfg.stage + " 阶开启";
        //     }
        //     this.skillDatas.push({ "skillData": new SkillData(skillId), "openDesc": openDesc, "enabled": isOpen });
        // }
        // for (let data of this.skillDatas) {
        //     data["enabled"] = this.isOpenSkill((data["skillData"] as SkillData).skillId);
        // }
        // this.skillList.data = this.skillDatas;
    }

    /**
     * 技能释放已开启
     */
    private isOpenSkill(skillId: number): boolean {
        let skillIds: Array<number> = this.exInfo.skills.data_I;
        return skillIds != null && skillIds.indexOf(skillId) != -1;
    }

    /**更新属性 */
    private updateAttrList(): void {
        let attrDict: any = {};
        let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeWing, this.strengthenLevel);
        let attr: string = "";
        let nextAttr: string = "";
        for (let attrInfo of attrListData) {
            attr += attrInfo.name + ": " + attrInfo.value + "\n";
            nextAttr += attrInfo.name + ": " + HtmlUtil.html(attrInfo.nextValue.toString(), Color.GreenCommon) + "\n";
            attrDict[attrInfo.type] = attrInfo.value;
        }
        this.attrTxt.text = attr;
        this.nextAttrTxt.text = nextAttr;
        this.attrFinal.text = attr;
        //更新战力
        if (this.exInfo != null) {
            this.fightPanel.updateValue(Number(this.exInfo.warfare));
        }

    }

    /**
     * 点击激活
     */
    private clickActive(): void {
        // if (!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Wing], false) || !CacheManager.role.isStrengthenExCanActive(EStrengthenExType.EStrengthenExTypeWing, this.roleIndex)) {
        //     Tip.showLeftTip(this.openTxt.text);
        //     return;
        // }
        EventManager.dispatch(LocalEventEnum.PlayerStrengthExActive, this.strengthenType, this.roleIndex);
    }

    /**
     * 点击神羽
     */
    private clickGod(): void {
        //Tip.showTip("功能尚未开放");
        HomeUtil.open(ModuleEnum.GodWing, false, { roleIndex: this._roleIndex }, ViewIndex.Two);
    }

    private clickAutoBuy(): void {
        this.updateProp();
    }

    /**
     * 播放成功特效
     */
    private playSuccessMc(): void {
        if (this.mcSuccess == null) {
            this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
        }
        this.mcSuccess.x = this.modelContainer.x + 104;
        this.mcSuccess.y = this.modelContainer.y + 80;
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
     * 更新星级
     */
    private updateStar(star: number): void {
        let data: Array<number> = [];
        for (let i: number = 0; i < this.starMax; i++) {
            if (i < star) {
                data.push(1);
            } else {
                data.push(0);
            }
        }
        this.starList.data = data;
    }

    // /**
    //  * 点击提升
    //  */
    // private clickLevelUp(): void {
    //     let tip: string;
    //     let upgradeTip: string = "确定使用翅膀进阶丹提升翅膀吗？\n说明：翅膀等阶在5阶才能使用，使用后直升1阶，超过5阶使用获得50个羽毛。强烈推荐在翅膀5阶的时候使用";
    //     let levelTip: string = "确定使用翅膀直升丹提升翅膀吗？\n说明：翅膀等阶在4阶及以下使用可以直升1阶，超过4阶使用获得300个羽毛。强烈推荐在翅膀4阶的时候使用";
    //     let isCanUse: boolean = true;
    //     let itemData: ItemData;
    //     if (this.stage >= 5) {
    //         if (this.upgradeItemDatas.length > 0) {
    //             itemData = this.upgradeItemDatas[0];
    //             tip = upgradeTip;
    //             if (itemData.isExpire) {
    //                 tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
    //             }
    //         } else {
    //             tip = levelTip;
    //             if (this.levelUpItemDatas.length > 0) {//优先使用有时效性的
    //                 itemData = this.levelUpItemDatas[0];
    //                 if (itemData.isExpire) {
    //                     tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
    //                 }
    //             } else if (this.oldLevelUpItemDatas.length > 0) {
    //                 itemData = this.oldLevelUpItemDatas[0];
    //             }
    //         }
    //     } else {
    //         tip = levelTip;
    //         if (this.levelUpItemDatas.length > 0) {//优先使用有时效性的
    //             itemData = this.levelUpItemDatas[0];
    //             if (itemData.isExpire) {
    //                 tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
    //             }
    //         } else if (this.oldLevelUpItemDatas.length > 0) {
    //             itemData = this.oldLevelUpItemDatas[0];
    //         } else if (this.upgradeItemDatas.length > 0) {
    //             itemData = this.upgradeItemDatas[0];
    //             tip = upgradeTip;
    //             isCanUse = false;
    //             if (itemData.isExpire) {
    //                 tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
    //             }
    //         }
    //     }

    //     if (itemData) {
    //         Alert.alert(tip, () => {
    //             if (isCanUse || itemData.isExpire) {
    //                 ProxyManager.pack.useItem(itemData.getUid(), 1, [], this.roleIndex);
    //             } else {
    //                 Tip.showLeftTip("翅膀等阶在5阶才能使用");
    //             }
    //         }, this);
    //     }
    // }

    private clickFeather(): void {
        ToolTipManager.showByCode(this.cfg.useItemCode);
    }

    /**
     * 是否为满星
     */
    private get isFullStar() {
        return this.star >= 10 && this.star % 10 == 0;
    }

    /**
     * 点击改变模型按钮
     */
    private clickChangeModelBtn(e: egret.TouchEvent): void {
        let showModelId: number;
        let btn: fairygui.GButton = e.target;
        if (btn == this.leftBtn) {
            this.showModelIndex--;
        } else {
            this.showModelIndex++;
        }
        if (this.showModelIndex > this.currentModelIndex + 1) {//最高只显示下一阶
            this.showModelIndex = this.currentModelIndex + 1;
        }
        // this.currentModelId = this.modelIds[this.showModelIndex];
        // this.wingModel.setData(this.currentModelId);
        showModelId = this.modelIds[this.showModelIndex];
        this.wingModel.setData(showModelId);
        this.scaleModel();
        this.updateChangeModelBtn();
        // this.stageTxt.text = FuiUtil.getStageStr(this.showModelIndex + 1) + "阶";
        if(this.showModelIndex == this.currentModelIndex){
            this.stageTxt.text = FuiUtil.getStageStr(this.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
        }else{
            let showStage: number = ConfigManager.mgStrengthenEx.getModelFirstStage(this.strengthenType, showModelId);
            this.stageTxt.text = FuiUtil.getStageStr(showStage) + "阶" + FuiUtil.getStageStr(0) + "星";
        }
        this.nameLoader.load(URLManager.getModuleImgUrl(`Wing/${this.currentModelId}.png`, PackNameEnum.MagicWare));
    }

    /**
     * 更新按钮状态
     */
    private updateChangeModelBtn(): void {
        let isFirst: boolean = this.showModelIndex == 0;
        let isLast: boolean = this.showModelIndex == this.modelIds.length - 1 || this.showModelIndex == this.currentModelIndex + 1;
        this.leftBtn.visible = !isFirst;
        this.rightBtn.visible = !isLast;
    }

    /**
     * 更新开启文本
     */
    private updateOpenTxt(): void {
        this.openTxt.text = ConfigManager.mgOpen.getOpenCondDesc(PanelTabType[PanelTabType.Wing]);
        let conditionCfg: any = ConfigManager.strengthenExActivateConfig.getByType(EStrengthenExType.EStrengthenExTypeWing);
        if (conditionCfg != null) {
            let activeCount: number = CacheManager.role.getStrengthenExActiveCount(EStrengthenExType.EStrengthenExTypeWing);
            this.openTxt.text = HtmlUtil.br(conditionCfg["desc"][activeCount + 1]);
        }
    }

    protected clickChangeBtn(): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWingChange, { "roleIndex": this.roleIndex });
        this.stopOneKey();
    }

     /**
	 * 获取道具
	 */
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}

    private scaleModel(): void {
        let scale: number = 1;
        if (this.currentModelId == 4009) {
            scale = 1.1;
        } else if (this.currentModelId == 4010) {
            scale = 1.2;
        }
        this.wingModel.scaleX = scale;
        this.wingModel.scaleY = scale;
    }
}