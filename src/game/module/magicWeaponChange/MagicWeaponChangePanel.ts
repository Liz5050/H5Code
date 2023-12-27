class MagicWeaponChangePanel extends BaseTabView {
    private controller: fairygui.Controller;
    private nameLoader: GLoader;
    private talentSkill: ShapeSkillItem;
    private skillList: List;
    private changeList: List;
    private starList: List;
    private curAttr: fairygui.GTextField;
    private nextAttr: fairygui.GTextField;
    private finalAttrTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private costTxt: fairygui.GRichTextField;
    private activeBtn: fairygui.GButton;
    private onekeyBtn: fairygui.GButton;
    private changeBtn: fairygui.GButton;
    private upDrugLoader: GLoader;
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

    private eShape: EShape = EShape.EShapeSpirit;
    private curData: any;
    private star: number;
    private starMax: number = 10;
    private lastStage: number = -1;//上一次显示阶
    private lastStar: number = -1;//上一次显示星

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
        this.curAttr = this.getGObject("txt_curAttr").asTextField;
        this.nextAttr = this.getGObject("txt_nextAttr").asTextField;
        this.finalAttrTxt = this.getGObject("txt_finalAttr").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.onekeyBtn = this.getGObject("btn_upgrade").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.changeBtnController = this.changeBtn.getController("c1");
        this.upDrugLoader = <GLoader>this.getGObject("loader_upDrug");
        this.changeIconLoader = <GLoader>this.getGObject("loader_changeIcon");
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");

        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(this.eShape);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 20;
        this.modelBody.y = 5;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.changeList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickChange, this);
        this.activeBtn.addClickListener(this.clickActiveBtn, this);
        this.onekeyBtn.addClickListener(this.clickPromote, this);
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
        // this.stopOneKey();
    }

    public updatePanel(): void {
        this.updateChangeList();
        this.onTabListScroll();
        this.onTabListScrollEnd();
        this.updateModel();
        this.updateAttr();
        this.updateStar();
        this.updateProp();
        this.updateStatus();
    }

    private onClickChange(): void {
        this.lastStage = -1;
        this.lastStar = -1;
        this.updatePanel();

    }

    private clickActiveBtn(): void {
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeActivateChange(this.eShape, this.curData.change);
        } else {
            Tip.showTip("道具不足");
        }
    }

    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curData.cfg.useItemCode);
    }

    private clickChangeProp(): void {
        ToolTipManager.showByCode(this.curData.cfg.activeCode);
    }

	/**
     * 提升
     * @param {boolean} isAuto 是否为自动点击的
     */
    private clickPromote(isAuto: boolean = true): void {
        if (this.isMax) {
            Tip.showOptTip(LangShapeBase.LANG1);
            return;
        }
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeUpgradeChange(this.eShape, this.curData.change);
        } else {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curData.cfg.useItemCode });
            let itemCfg: any = ConfigManager.item.getByPk(this.curData.cfg.useItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
        }
    }

    public updateChangeList(): void {
        let selectedIndex: number = this.changeList.selectedIndex;
        if (selectedIndex == -1) {
            selectedIndex = 0;
        }
        this.changeList.data = CacheManager.magicWeaponChange.getChangesData(this.eShape);
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
        if (showModelId == 6004) {
            this.model.scaleX = 1.1;
            this.model.scaleY = 1.1;
        } else if (showModelId == 6005) {
            this.model.scaleX = 1.2;
            this.model.scaleY = 1.2;
        } else if (showModelId == 6006) {
            this.model.scaleX = 1.2;
            this.model.scaleY = 1.2;
        } else if (showModelId == 6007) {
            this.model.scaleX = 1.4;
            this.model.scaleY = 1.4;
        } else {
            this.model.scaleX = 1;
            this.model.scaleY = 1;
        }
        this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId) ? 1 : 0;

        this.star = this.curData.cfg.star ? this.curData.cfg.star : 0;
        this.levelTxt.text = FuiUtil.getStageStr(this.curData.cfg.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
        this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.MagicWeaponChange));
    }

    private updateAttr(): void {
        let level: number = this.curData.level;
        let change: number = this.curData.change;
        let attrListData: Array<AttrInfo> = MgShapeChangeConfig.getAttrListData(this.eShape, change, level);
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

        this.isMax = level >= ConfigManager.mgShapeChange.getMaxLevel(this.eShape, change);

        if (this.lastStage != -1 && this.curData.cfg.stage > this.lastStage) {
            this.playSuccessMc();
        } else if (this.lastStar != -1 && this.star != 0 && this.star > this.lastStar) {
            this.playStarMc();
        }

        this.lastStage = this.curData.cfg.stage;
        this.lastStar = this.star;
    }

    private updateSkill(): void {
        let skillIds: Array<number> = CacheManager.magicWeaponChange.getSkills(this.curData.change);
        this.skillList.data = skillIds;
        this.talentSkill.setData(CacheManager.magicWeaponChange.getTalentSkill(this.curData.change));
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

	/**
     * 更新道具
     */
    public updateProp(): void {
        if (this.curData.cfg == null) {
            return;
        }
        let ownedValue: number = 0;//拥有数值
        let costValue: number = 0;//显示的消耗数值
        let count: number = CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.useItemCode);
        let costNum: number = this.curData.cfg.useItemNum ? this.curData.cfg.useItemNum : 0;
        let shopCell: any = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, this.curData.cfg.useItemCode);
        let propSellPrice: number = 0;
        if (shopCell != null) {
            propSellPrice = shopCell["price"];
        }

        if (!this.curData.isActived) {
            this.changeIconLoader.load(URLManager.getIconUrl(this.curData.change, URLManager.Shape_Change_Icon));
            ownedValue = CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.activeCode);
            costValue = this.curData.cfg.activeNum;
        } else {
            ownedValue = count;
            costValue = costNum;
            this.onekeyBtn.title = costValue > 0 ? "升  星" : "升  阶";
            this.costTxt.visible = costValue > 0;
            this.upDrugLoader.visible = costValue > 0;
        }

        let itemCfg: any = ConfigManager.item.getByPk(this.curData.cfg.useItemCode);
        this.upDrugLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON))
        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isMax);
        CommonUtils.setBtnTips(this.activeBtn, ownedValue >= costValue && !this.curData.isActived);

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
            EventManager.dispatch(LocalEventEnum.ShapeChangeModel, { "shape": this.eShape, "change": this.curData.change });
        } else {
            EventManager.dispatch(LocalEventEnum.ShapeChangeModelCancel, { "shape": this.eShape });
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
        }
        else {
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