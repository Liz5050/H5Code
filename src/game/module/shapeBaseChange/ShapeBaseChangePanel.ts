/**
 * 外形幻形（2018.10.22）
 */
class ShapeBaseChangePanel extends BaseTabView{
	protected controller: fairygui.Controller;
    protected nameLoader: GLoader;
    protected talentSkill: ShapeSkillItem;
    protected skillList: List;
    protected changeList: List;
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
    protected changeBtn: fairygui.GButton;
    protected upDrugLoader: GLoader;
    protected goldLoader: GLoader;
    protected fightPanel: FightPanel;
	protected changeIconLoader: GLoader;

	/**模型展示 */
    protected modelContainer: fairygui.GComponent;
    protected modelBody: egret.DisplayObjectContainer;
    protected model: ModelShow;

	protected mcSuccess: UIMovieClip;
    protected mcUpStar: UIMovieClip;
    protected changeBtnController: fairygui.Controller;

	protected eShape: EShape = EShape.EShapeBattle;
	// protected curCfg: any;
	protected curData: any;
	protected star: number;
	protected starMax: number = 10;
	protected lastStage: number = -1;//上一次显示阶

	protected isCanUpgrade: boolean;
	protected isMax: boolean;

	 /**是否一键提升中 */
    protected isOneKeyPromoteing: boolean = false;
    protected isCanContinuePromote: boolean = true;

    protected _roleIndex: number = RoleIndexEnum.Role_index0;
    protected nowlucky: number = 0;


	public constructor() {
		super();
	}
	public initOptUI():void{
		this.controller = this.getController("c1");
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.talentSkill = this.getGObject("talentSkill") as ShapeSkillItem;;
        this.skillList = new List(this.getGObject("list_skill").asList);
        this.changeList = new List(this.getGObject("list_change").asList);
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
        this.changeBtnController = this.changeBtn.getController("c1");
        this.upDrugLoader = <GLoader>this.getGObject("loader_upDrug");
        this.goldLoader = <GLoader>this.getGObject("loader_gold");
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
        this.onekeyBtn.addClickListener(this.clickOnekey, this);
        this.autoBuyBtn.addClickListener(this.clickAutoBuy, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.upDrugLoader.addClickListener(this.onTouchCostIconHandler, this);
		this.changeIconLoader.addClickListener(this.clickChangeProp, this);
	}

	public updateAll(param:any = null):void{
        this.lastStage = -1;
        this.changeList.selectedIndex = 0;
        this.updatePanel();
	}

	public hide(): void {
        super.hide();
        this.stopOneKey();
    }

	public updatePanel(): void{
		this.updateChangeList();
		this.updateModel();
		this.updateAttr();
		this.updateStar();
		this.updateLucky();
		this.updateProp();
		this.updateStatus();
        CommonUtils.setBtnTips(this.talentSkill, this.getShapeChangeCache().isCanUpgradeTSkill(this.curData.change, this.roleIndex));
		
	}

	protected onClickChange(): void{
		this.lastStage = -1;
		this.stopOneKey();
		this.updatePanel();
		
	}

	protected clickActiveBtn(): void {
        if (this.isCanUpgrade){
		    ProxyManager.shape.shapeActivateChange(this.eShape, this.curData.change, this.roleIndex);
        }else{
            Tip.showOptTip(LangShapeBase.LANG25);
        }
    }

	protected clickAutoBuy(): void {
        this.updateProp();
    }

    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curData.cfg.costItemCode);
    }

	protected clickChangeProp(): void {
        ToolTipManager.showByCode(this.curData.cfg.activateProp);
    }

	/**点击一键提升/停止 */
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

	/**
     * 停止一键提升
     */
    protected stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
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
			ProxyManager.shape.shapeUpgradeChangeEx(this.eShape, this.curData.change, this.curData.cfg.costItemCode, this.autoBuyBtn.selected,this.roleIndex);
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

	protected updateOneKeyBtn(): void {
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
            this.nowlucky = this.curData.cfg.luckyMax;
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

    protected onUpgrade(): void {
        this.updatePanel();
        if (this.curData.cfg.star != 0) {//进阶成功不显示升星特效
            this.playStarMc();
        }
        // this.stopOneKey();
    }

	public updateChangeList(): void{
        let selectedIndex: number = this.changeList.selectedIndex;
		if(selectedIndex == -1) {
			selectedIndex = 0;
		}
		this.changeList.data = this.getShapeChangeCache().getChangesData(this.eShape, this.roleIndex);
		this.changeList.selectedIndex = selectedIndex;

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

	public updateModel(): void{
		let showModelId: number = this.curData.cfg.modelId;
		this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId, this.roleIndex)?1:0;
		this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.ShapeBattle));
	}

    

	protected updateAttr(): void {
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
		if(this.curData.isActived){
			this.fightPanel.updateValue(this.curData.info.warfare_L64);
		}else{
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

	protected updateSkill(): void {
        let skillIds: Array<number> =  this.getShapeChangeCache().getSkills(this.curData.change, this.roleIndex);
        this.skillList.data = skillIds;
        this.talentSkill.setData( this.getShapeChangeCache().getTalentSkill(this.curData.change, this.roleIndex));
    }

	/**
     * 更新星级
     */
    protected updateStar(): void {
        this.star = this.curData.cfg.star ? this.curData.cfg.star : 0;
		this.levelTxt.text = FuiUtil.getStageStr(this.curData.cfg.stage) + "阶" + FuiUtil.getStageStr(this.star) + "星";
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
    protected updateLucky(): void {
		if(this.curData.isActived){
            if(this.curData.info.lucky_I != 0) {
                this.luckyBar.setValue(this.curData.info.lucky_I, this.curData.cfg.luckyMax);
                this.nowlucky = this.curData.info.lucky_I;
            }
            else {
                if(this.nowlucky == this.curData.cfg.luckyMax||this.nowlucky == 0 ) { 
                    this.luckyBar.setValue(this.curData.info.lucky_I, this.curData.cfg.luckyMax);
                    this.nowlucky = this.curData.info.lucky_I;
                }
            }

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
        if(!shopCell) {
            shopCell = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_QUICK, this.curData.cfg.costItemCode);
        }
        let propSellPrice: number = 0;
        if (shopCell != null) {
            propSellPrice = shopCell["price"];
        }

        var itemcfg = ConfigManager.item.getByPk(this.curData.cfg.costItemCode);
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

		if(!this.curData.isActived){
			this.changeIconLoader.load(URLManager.getIconUrl(this.curData.change, URLManager.Shape_Change_Icon));
			ownedValue = CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.activateProp);
			costValue = this.curData.cfg.activateNum;
		}

        this.isCanUpgrade = ownedValue >= costValue;
        this.costTxt.text = MoneyUtil.getResourceText(ownedValue, costValue);
        CommonUtils.setBtnTips(this.onekeyBtn, count >= costNum && !this.isMax && !this.isOneKeyPromoteing);
        CommonUtils.setBtnTips(this.activeBtn, ownedValue >= costValue && !this.curData.isActived);

        if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }
        
		this.updateSkill();//天赋技能升级需要道具
        CommonUtils.setBtnTips(this.talentSkill,  this.getShapeChangeCache().isCanUpgradeTSkill(this.curData.change, this.roleIndex));
    }

    public refreshChangeList(): void{
        this.changeList.refresh();
    }

	/**
     * 播放成功特效
     */
    protected playSuccessMc(): void {
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

    /**发送幻化请求 */
	protected clickChangeBtn(): void {
        if(this.changeBtnController.selectedIndex == 0) {
		    EventManager.dispatch(LocalEventEnum.ShapeChangeModel, {"shape": this.eShape, "change": this.curData.change,"roleIndex":this.roleIndex});
        } else {
            EventManager.dispatch(LocalEventEnum.ShapeChangeModelCancel, {"shape": this.eShape,"roleIndex":this.roleIndex});
        }
	}

    public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
        this.lastStage = -1;
        this.stopOneKey();
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

    public getShapeChangeCache() : ShapeBaseChangeCache {
        return null;
    }


}