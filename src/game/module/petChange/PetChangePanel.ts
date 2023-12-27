/**
 * 宠物幻形（2018.10.16）
 */
class PetChangePanel extends BaseTabView {
    private controller: fairygui.Controller;
    private nameLoader: GLoader;
    private talentSkill: ShapeSkillItem;
    private skillList: List;
    private changeList: List;
    private starList: List;
    private luckyBar: UIProgressBar;//祝福值
    private curAttr: fairygui.GTextField;
    private nextAttr: fairygui.GTextField;
    private finalAttrTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private costTxt: fairygui.GRichTextField;
    private activeBtn: fairygui.GButton;
    private onekeyBtn: fairygui.GButton;
    private autoBuyBtn: fairygui.GButton;
    private changeBtn: fairygui.GButton;
    private upDrugLoader: GLoader;
    private goldLoader: GLoader;
    private fightPanel: FightPanel;
    private changeIconLoader: GLoader;

    /**模型展示 */
    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;

    private upBtn: fairygui.GButton;
    private downBtn: fairygui.GButton;
    private listViewNum: number = 4;

    private mcSuccess: UIMovieClip;
    private mcUpStar: UIMovieClip;
    private changeBtnController: fairygui.Controller;

    private eShape: EShape = EShape.EShapePet;
    private curData: any;
    private star: number;
    private starMax: number = 10;
    private lastStage: number = -1;//上一次显示阶

    private isCanUpgrade: boolean;
    private isMax: boolean;

    /**是否一键提升中 */
    private isOneKeyPromoteing: boolean = false;
    private isCanContinuePromote: boolean = true;

    public constructor() {
        super();
    }
    public initOptUI(): void {
        this.controller = this.getController("c1");
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.talentSkill = this.getGObject("talentSkill") as ShapeSkillItem;
        this.skillList = new List(this.getGObject("list_skill").asList);
        this.changeList = new List(this.getGObject("list_change").asList);
        this.starList = new List(this.getGObject("list_star").asList);
        this.luckyBar = <UIProgressBar>this.getGObject("progressBar_lucky");
        this.luckyBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Shape, "shape_bar"), URLManager.getPackResUrl(PackNameEnum.Shape, "shape_progressBg"), 644, 31, 18, 5, UIProgressBarType.Mask, true);
        this.luckyBar.labelType = BarLabelType.Current_Total;
        this.luckyBar.labelSize = 20;
        this.luckyBar.progressTxt.y += 2;
        this.curAttr = this.getGObject("txt_curAttr").asTextField;
        this.nextAttr = this.getGObject("txt_nextAttr").asTextField;
        this.finalAttrTxt = this.getGObject("txt_finalAttr").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.onekeyBtn = this.getGObject("btn_upgrade").asButton;
        this.autoBuyBtn = this.getGObject("btn_autoBuy").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.changeBtnController = this.changeBtn.getController("c1");
        this.upDrugLoader = <GLoader>this.getGObject("loader_upDrug");
        this.goldLoader = <GLoader>this.getGObject("loader_gold");
        this.changeIconLoader = <GLoader>this.getGObject("loader_changeIcon");
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");

        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(EShape.EShapePet);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 20;
        this.modelBody.y = 5;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.changeList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickChange, this);
        this.activeBtn.addClickListener(this.clickActiveBtn, this);
        this.onekeyBtn.addClickListener(this.clickOnekey, this);
        this.autoBuyBtn.addClickListener(this.clickAutoBuy, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.upDrugLoader.addClickListener(this.onTouchCostIconHandler, this);
        this.changeIconLoader.addClickListener(this.clickChangeProp, this);

        this.changeList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onTabListScroll, this);
        this.changeList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onTabListScrollEnd, this);
        this.upBtn = this.getGObject("btn_up").asButton;
        this.upBtn.addClickListener(this.onUpBtnClick, this);
        this.downBtn = this.getGObject("btn_down").asButton;
        this.downBtn.addClickListener(this.onDownBtnClick, this);
    }

    public updateAll(): void {
        this.lastStage = -1;
        this.changeList.selectedIndex = 0;
        this.updatePanel();
    }

    public hide(): void {
        super.hide();
        this.stopOneKey();
    }

    public updatePanel(): void {
        this.updateChangeList();
        this.onTabListScroll();
        this.onTabListScrollEnd();
        this.updateModel();
        this.updateAttr();
        this.updateStar();
        this.updateLucky();
        this.updateProp();
        this.updateStatus();

    }

    private onClickChange(): void {
        this.lastStage = -1;
        this.stopOneKey();
        this.updatePanel();

    }

    private clickActiveBtn(): void {
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeActivateChange(this.eShape, this.curData.change);
        } else {
            Tip.showOptTip(LangShapeBase.LANG25);
        }
    }

    private clickAutoBuy(): void {
        this.updateProp();
    }

    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curData.cfg.costItemCode);
    }

    private clickChangeProp(): void {
        ToolTipManager.showByCode(this.curData.cfg.activateProp);
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

	/**
     * 停止一键提升
     */
    private stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
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
            ProxyManager.shape.shapeUpgradeChangeEx(this.eShape, this.curData.change, this.curData.cfg.costItemCode, this.autoBuyBtn.selected);
        } else {
            if (!isAuto) {//一键提升材料不足时不谈窗
                if (this.autoBuyBtn.selected) {
                    MoneyUtil.alertMoney(GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold]);
                } else {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curData.cfg.costItemCode });
                }
            }
            let itemCfg: any = ConfigManager.item.getByPk(this.curData.cfg.costItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            this.stopOneKey();
        }
    }

    private updateOneKeyBtn(): void {
        if (this.isOneKeyPromoteing) {
            this.onekeyBtn.text = LangShapeBase.LANG3;
        } else {
            this.onekeyBtn.text = LangShapeBase.LANG4;
        }
    }

	/**
     * 提升成功后触发
     */
    public onSuccess(info: any): void {
        if (info.result) {//升星成功
            this.luckyBar.setValue(this.curData.cfg.luckyMax, this.curData.cfg.luckyMax);
            App.TimerManager.remove(this.onUpgrade, this);
            App.TimerManager.doDelay(100, this.onUpgrade, this);
            this.stopOneKey();
        } else {
            this.updatePanel();
        }
        this.isCanContinuePromote = true;
        if (this.isOneKeyPromoteing) {
            App.TimerManager.doDelay(50, this.clickPromote, this);
        }
    }

    private onUpgrade(): void {
        this.updatePanel();
        if (this.curData.cfg.star != 0) {//进阶成功不显示升星特效
            this.playStarMc();
        }
        // this.stopOneKey();
    }

    public updateChangeList(): void {
        let selectedIndex: number = this.changeList.selectedIndex;
        if (selectedIndex == -1) {
            selectedIndex = 0;
        }
        this.changeList.data = CacheManager.petChange.getChangesData(this.eShape);
        this.changeList.selectedIndex = selectedIndex;
        this.changeList.scrollToView(selectedIndex);

        this.curData = this.changeList.selectedData;
    }

    public updateStatus(): void {
        if (this.curData.isActived) {
            this.controller.selectedIndex = 1;

        } else {
            this.controller.selectedIndex = 0;
        }
        if (this.isMax) {
            this.controller.selectedIndex = 2;
        }
    }

    public updateModel(): void {
        let showModelId: number = this.curData.cfg.modelId;
        if(showModelId == 2100){
            this.model.scaleX = 1.1;
            this.model.scaleY = 1.1;
        }else{
            this.model.scaleX = 1;
            this.model.scaleY = 1;
        }
        this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId) ? 1 : 0;

        this.star = this.curData.cfg.star ? this.curData.cfg.star : 0;
        this.levelTxt.text = FuiUtil.getStageStr(this.curData.cfg.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
        this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.PetChange));
    }

    private updateAttr(): void {
        let level: number = this.curData.level;
        let change: number = this.curData.change;
        let attrListData: Array<AttrInfo> = MgShapeChangeExConfig.getAttrListData(this.eShape, change, level);
        let curStr: string = "";
        let nextStr: string = "";
        for (let attr of attrListData) {
            curStr += `${attr.name}: ${attr.value}\n`;
            nextStr += `${attr.name}: ${attr.nextValue}\n`;
        }
        this.curAttr.text = curStr;
        this.nextAttr.text = nextStr;
        this.finalAttrTxt.text = curStr;
        if (this.curData.isActived) {
            this.fightPanel.updateValue(this.curData.info.warfare_L64);
        } else {
            this.fightPanel.updateValue(0);
        }

        this.isMax = level >= ConfigManager.mgShapeChangeEx.getMaxLevel(this.eShape, change);

        if (this.lastStage != -1 && this.curData.cfg.stage > this.lastStage) {
            //升阶了，停止一键
            this.stopOneKey();
            this.playSuccessMc();
        }

        if (this.isMax) {//达到最高等级
            this.stopOneKey();
        }

        this.lastStage = this.curData.cfg.stage;
    }

    private updateSkill(): void {
        let skillIds: Array<number> = CacheManager.petChange.getSkills(this.curData.change);
        this.skillList.data = skillIds;
        this.talentSkill.setData(CacheManager.petChange.getTalentSkill(this.curData.change));
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
        if (this.curData.isActived) {
            this.luckyBar.setValue(this.curData.info.lucky_I, this.curData.cfg.luckyMax);
        }
    }

	/**
     * 更新道具
     */
    public updateProp(): void {
        if (this.curData.cfg == null) {
            return;
        }
        let ownedValue: number = 0;//拥有数值
        let costValue: number = 0;//显示的消耗数值
        let count: number = CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.costItemCode);
        let costNum: number = this.curData.cfg.costItemNum ? this.curData.cfg.costItemNum : 0;
        let shopCell: any = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, this.curData.cfg.costItemCode);
        let propSellPrice: number = 0;
        let materialData: any = ConfigManager.item.getByPk(this.curData.cfg.costItemCode);
        if (shopCell != null) {
            propSellPrice = shopCell["price"];
        }

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

        if (!this.curData.isActived) {
            this.changeIconLoader.load(URLManager.getIconUrl(this.curData.change, URLManager.Shape_Change_Icon));
            ownedValue = CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.activateProp);
            costValue = this.curData.cfg.activateNum;
        }

        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        this.upDrugLoader.load(URLManager.getIconUrl(materialData.icon, URLManager.ITEM_ICON));
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isMax && !this.isOneKeyPromoteing);
        CommonUtils.setBtnTips(this.activeBtn, ownedValue >= costValue && !this.curData.isActived);

        if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }

        this.updateSkill();//天赋技能升级需要道具
    }

    public refreshChangeList(): void {
        this.changeList.refresh();
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

    /**发送幻化请求 */
    private clickChangeBtn(): void {
        if (this.changeBtnController.selectedIndex == 0) {
            EventManager.dispatch(LocalEventEnum.ShapeChangeModel, { "shape": EShape.EShapePet, "change": this.curData.change });
        } else {
            EventManager.dispatch(LocalEventEnum.ShapeChangeModelCancel, { "shape": EShape.EShapePet });
        }
    }

    private onTabListScroll(): void {
        if (this.changeList.data.length < this.listViewNum + 1) {
            this.upBtn.visible = false;
            this.downBtn.visible = false;
            return;
        }

        let percY: number = this.changeList.list.scrollPane.percY;
        if (percY == 0) {
            this.upBtn.visible = false;
            this.downBtn.visible = true;
        }
        else if (percY == 1) {
            this.upBtn.visible = true;
            this.downBtn.visible = false;
        } else {
            this.upBtn.visible = true;
            this.downBtn.visible = true;
        }
    }

    private onTabListScrollEnd(): void {
        if (this.changeList.data.length < this.listViewNum + 1) {
            return;
        }
        let upTip: boolean = false;
        let downTip: boolean = false;
        let firstIdx: number = this.changeList.list.getFirstChildInView();
        let item: ShapeChangeItem;
        for (let i = 0; i < this.changeList.data.length; i++) {
            if (!this.changeList.isChildInView(i)) {
                item = this.changeList.list.getChildAt(this.changeList.list.itemIndexToChildIndex(i)) as ShapeChangeItem;
                if (item && item.hasTip) {
                    if (i <= firstIdx) {
                        upTip = true;
                    }
                    else {
                        downTip = true;
                    }
                }
            }
        }
        CommonUtils.setBtnTips(this.upBtn, upTip, 25, -15, false);
        CommonUtils.setBtnTips(this.downBtn, downTip, -20, 5, false);
    }

    private onUpBtnClick(): void {
        let idx: number = this.changeList.list.getFirstChildInView();
        idx -= this.listViewNum;
        idx < 0 ? idx = 0 : null;

        this.changeList.scrollToView(idx, true, true);

        App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
    }

    private onDownBtnClick(): void {
        let idx: number = this.changeList.list.getFirstChildInView();
        idx += this.listViewNum;
        idx > this.changeList.data.length - 1 ? idx = this.changeList.data.length - 1 : null;

        this.changeList.scrollToView(idx, true, true);

        App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
    }
}