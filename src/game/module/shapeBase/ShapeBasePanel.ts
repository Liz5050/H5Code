class ShapeBasePanel extends BaseTabView {

    protected controller: fairygui.Controller;
    protected nameLoader: GLoader;
    // protected talentSkill: ShapeSkillItem;
    protected skillList: List;
    protected drugList: List;
    protected starList: List;
    protected luckyBar: ProgressBar1;//祝福值
    protected curAttr: fairygui.GTextField;
    protected nextAttr: fairygui.GTextField;
    protected finalAttrTxt: fairygui.GTextField;
    protected levelTxt: fairygui.GTextField;
    protected costTxt: fairygui.GRichTextField;
    protected activeBtn: fairygui.GButton;
    protected onekeyBtn: fairygui.GButton;
    protected autoBuyBtn: fairygui.GButton;
    protected changeBtn : fairygui.GButton;
    protected getBtn: fairygui.GButton;
    protected upDrugLoader: GLoader;
    protected goldLoader: GLoader;
    protected equipCom : fairygui.GComponent;

    protected modelContainer: fairygui.GComponent;
    protected modelBody: egret.DisplayObjectContainer;
    protected model: ModelShow;

    protected mcSuccess: UIMovieClip;
    protected mcUpStar: UIMovieClip;

    protected curCfg: any;
    protected eShape: EShape = EShape.EShapeBattle;
    protected star: number;
    protected starMax: number = 10;
    protected isCanUpgrade: boolean;
    protected isMax: boolean;
    protected stage: number;
    protected lastStage: number = -1;//上一次显示阶
    protected modelId:number = -1;
    protected lastModelId:number = -1;//上一次的模型展示id

    protected isOneKeyPromoteing: boolean = false;
    protected isCanContinuePromote: boolean = true;

    protected activeTxt : fairygui.GTextField;

    protected equipItems: any;
    protected fightPanel : FightPanel;

    private _roleIndex: number = RoleIndexEnum.Role_index0;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.controller = this.getController("c1");
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        // this.talentSkill = this.getGObject("talentSkill") as ShapeSkillItem;
        this.skillList = new List(this.getGObject("list_skill").asList);
        this.drugList = new List(this.getGObject("list_drug").asList);
        this.starList = new List(this.getGObject("list_star").asList);
        this.luckyBar = <ProgressBar1>this.getGObject("progressBar_lucky");
        this.curAttr = this.getGObject("txt_curAttr").asTextField;
        this.nextAttr = this.getGObject("txt_nextAttr").asTextField;
        this.finalAttrTxt = this.getGObject("txt_finalAttr").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.onekeyBtn = this.getGObject("btn_upgrade").asButton;
        this.autoBuyBtn = this.getGObject("btn_autoBuy").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.getBtn = this.getGObject("btn_get").asButton;
        this.upDrugLoader = <GLoader>this.getGObject("loader_upDrug");
        this.goldLoader = <GLoader>this.getGObject("loader_gold");
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");

        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(this.eShape);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 20;
        this.modelBody.y = 5;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.activeTxt = this.getGObject("txt_open").asTextField;

        this.equipItems = {};
        for(let type of CacheManager.pet.petEquipType){
            let lawEquipItem: ShapeEquipItem = <ShapeEquipItem>this.getGObject(`petequip_${type}`);
            this.equipItems[type] = lawEquipItem;
        }

        this.activeBtn.addClickListener(this.clickActiveBtn, this);
        this.onekeyBtn.addClickListener(this.clickOnekey, this);
        this.autoBuyBtn.addClickListener(this.clickAutoBuy, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.getBtn.addClickListener(this.clickGet, this);
        this.upDrugLoader.addClickListener(this.onTouchCostIconHandler, this);

        GuideTargetManager.reg(GuideTargetName.SwordPoolPanelActiveBtn, this.activeBtn);
		GuideTargetManager.reg(GuideTargetName.SwordPoolPanelOnekeyBtn, this.onekeyBtn);
        
    }


    public updateAll(): void {
        this.updateAttr();
        this.updateSkill();
        this.updateModel();
        this.updateStatus();
        this.updateActiveText();
    }

    public hide(): void {
        super.hide();
        this.stopOneKey();
        if(this.mcSuccess) {
            this.mcSuccess.visible = false;
        }
    }

    public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.lastStage = -1;
        this.updateAll();
        this.stopOneKey();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}


    public updateModel() {
   
    }

    protected clickActiveBtn(): void {
        
    }

    protected clickOnekey(): void {
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

     protected stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
    }

    protected updateOneKeyBtn(): void {
        if (this.isOneKeyPromoteing) {
            this.onekeyBtn.text = "停  止";
        } else {
            this.onekeyBtn.text = "一键升星";
        }
        // if(this.curCfg && this.curCfg.star == 10) {
        //     this.onekeyBtn.text = "升  阶";
        // }
    }

    	/**
     * 提升
     * @param {boolean} isAuto 是否为自动点击的
     */
    protected clickPromote(isAuto: boolean = true): void {
        if (this.isMax) {
            Tip.showOptTip(LangShapeBase.LANG1);
            this.stopOneKey();
            return;
        }
        if (this.isCanUpgrade) {
            ProxyManager.shape.shapeUpgrade(this.eShape, this.autoBuyBtn.selected,this.roleIndex);
        } else {
            if (!isAuto) {//一键提升材料不足时不谈窗
                if (this.autoBuyBtn.selected) {
                    MoneyUtil.alertMoney(GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold]);
                } else {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curCfg.useItemCode });
                }
            }
            let itemCfg: any = ConfigManager.item.getByPk(this.curCfg.useItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            this.stopOneKey();
        }
    }

    protected clickAutoBuy(): void {
        this.updateProp();
    }

    /**
     * 提升成功后触发
     */
    public onSuccess(info: any): void {
        if (this.curCfg == null) {
            return;
        }
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

    protected onUpgrade(): void {
        this.updateAll();
        if (this.curCfg.star) {//进阶成功不显示升星特效
            this.playStarMc();
        }
    }

    public updateStatus(): void {
        if (this.getShapeCache().getInfo(this.roleIndex)) {
            this.controller.selectedIndex = 1;
        } else {
            this.controller.selectedIndex = 0;
        }
        if (this.isMax) {
            this.controller.selectedIndex = 2;
        }
    }

    protected updateAttr(): void {
        CommonUtils.setBtnTips(this.activeBtn, this.getShapeCache().isCanActive(this.roleIndex));
        let level: number = this.getShapeCache().getLevel(this.roleIndex);
        let attrListData: Array<AttrInfo> = MgShapeConfig.getAttrListData(this.eShape, level);
        let drugAttrCfg: any = MgShapeDrugAttrConfig.getDrugAttr(this.eShape);
        let drugUsed: any = this.getShapeCache().getDrugUsed(this.roleIndex);
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
            if(attr.type != EJewel.EJewelCritRate) {
                curStr += `${attr.name}: ${Math.floor(value)}\n`;
                nextStr += `${attr.name}: ${Math.floor(nextValue)}\n`;
            }
            else {
                curStr += `${attr.name}: ${Math.floor(value)/100}%\n`;
                nextStr += `${attr.name}: ${Math.floor(nextValue)/100}%\n`;
            }
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
            this.fightPanel.updateValue(this.getShapeCache().getWarfare(this.roleIndex));
            this.levelTxt.text = FuiUtil.getStageStr(this.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
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
                EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:this.eShape,roleIndex:this.roleIndex});
            }
        }

        if (this.isMax) {//达到最高等级
            this.stopOneKey();
        }

        this.lastStage = this.stage;
        this.lastModelId = this.modelId;
    }

    protected updateSkill(): void {
        let skills: Array<any> = this.getShapeCache().getSkills(this.roleIndex);
        this.skillList.data = skills;
        // this.talentSkill.setData(this.getShapeCache().getTalentSkill(this.roleIndex));
    }


    protected updateDrug(): void {
        let drugCodes: Array<number> = MgShapeDrugAttrConfig.getDrugCodes(this.eShape);
        let drugUsed: any = this.getShapeCache().getDrugUsed(this.roleIndex);
        let drugDatas: Array<any> = [];
        for (let i = 0; i < drugCodes.length; i++) {
            let useNum: number = drugUsed[drugCodes[i]] ? drugUsed[drugCodes[i]] : 0;
            let drugType: number = i + 1;
            let nextDrugLevel: number = MgShapeConfig.getNextDrugMaxLevel(this.eShape, this.getShapeCache().getLevel(this.roleIndex), drugType);
            drugDatas.push({
                "code": drugCodes[i],
                "used": useNum,
                "max": this.curCfg[`drug${drugType}ItemMax`],
                "drugType": drugType,
                "shape": this.eShape,
                "level": nextDrugLevel,
                "role" : this.roleIndex
            });
        }
        this.drugList.data = drugDatas;
    }

    /**
     * 更新星级
     */
    protected updateStar(): void {
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

    protected updateLucky(): void {
        this.luckyBar.progressTxt.visible = true;
        this.luckyBar.setValue(this.getShapeCache().getInfo(this.roleIndex).lucky_I, this.curCfg.luckyMax);
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
        let shopCell: any = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_QUICK, this.curCfg.useItemCode);
        let propSellPrice: number = 0;
        if (shopCell != null) {
            propSellPrice = shopCell["price"];
        }

        var itemcfg = ConfigManager.item.getByPk(this.curCfg.useItemCode);
        if(itemcfg) {
            this.upDrugLoader.load(URLManager.getIconUrl(itemcfg.icon ,URLManager.ITEM_ICON));
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

        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isOneKeyPromoteing);
        // CommonUtils.setBtnTips(this.talentSkill, this.getShapeCache().CheckTalentCanUpdate(this.roleIndex));

        if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }

        this.updateDrug();//属性药也是道具
        this.updateEquip();//宠物装备也在道具背包

    }

    /**
     * 播放成功特效
     */
    protected playSuccessMc(): void {
        if (this.mcSuccess == null) {
            this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
        }
        this.mcSuccess.visible = true;
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
    protected playStarMc(): void {
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

    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curCfg.useItemCode);
    }

    protected updateEquip(): void{
        let equipData: any;
        let equipInfo: any = this.getShapeCache().getEquips(this.roleIndex);
        for(let type of CacheManager.pet.petEquipType){
            let petEquipItem: ShapeEquipItem = <ShapeEquipItem>this.equipItems[type];
            if(equipInfo[type]){//已穿戴装备
                equipData = {"type": type, "itemCode": equipInfo[type], "roleIndex":this.roleIndex, "shape":this.eShape};
            }else{
                equipData = {"type": type, "roleIndex":this.roleIndex, "shape":this.eShape};
            }
            petEquipItem.setData(equipData);
            CommonUtils.setBtnTips(petEquipItem,this.getShapeCache().isCanReplaceEquip(this.roleIndex, type));
        }
    }

    protected clickChangeBtn(): void{

    }

    /**
	 * 获取道具
	 */
	protected clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curCfg.useItemCode });
	}

    protected updateActiveText() : void {
        this.activeTxt.text = this.getShapeCache().getActiveStr(this.roleIndex);
    }

    public getShapeCache() : ShapeBaseCache {
        return null;
    }

}