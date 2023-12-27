class MagicArrayPanel extends ShapeBasePanel {

    protected modelContainer2: fairygui.GComponent;
    protected modelBody2: egret.DisplayObjectContainer;
    protected model2: ModelShow;
	
	protected levelUpBtn: fairygui.GButton;
	
    protected levelUpItemDatas: Array<ItemData>;
    protected upgradeItemDatas: Array<ItemData>;

     public constructor() {
        super();
        this.eShape = EShape.EShapeLaw;
    }

	public initOptUI(): void {
		super.initOptUI();

		this.modelContainer2 = this.getGObject("model_container2").asCom;
        this.model2 = new ModelShow(this.eShape);
        this.modelBody2 = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody2.addChild(this.model2);
        this.modelBody2.x = 20;
        this.modelBody2.y = 5;
        (this.modelContainer2.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody2);

		this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
        this.levelUpBtn.addClickListener(this.clickLevelUp, this);
	}

    public updateModel() {
        this.model.setData(1001);
        this.model2.setData(1002);
        if(CacheManager.magicArray.getInfo(this.roleIndex)) {
            this.model.setMcGrayed(false);
            this.model2.setMcGrayed(false);
        }
        else {
            this.model.setMcGrayed(true);
            this.model2.setMcGrayed(true);
        }
        this.nameLoader.load(URLManager.getModuleImgUrl("t1001.png", PackNameEnum.MagicArray));
    }

	/**
     * 更新道具
     */
    public updateProp(): void {
		super.updateProp();
		this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isLawUpLevelItem, ItemsUtil);
        this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isLawUpUpgradeItem, ItemsUtil);
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.magicArrayChange.checkTips(this.roleIndex));
		this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
		CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);

		CommonUtils.setBtnTips(this.changeBtn, CacheManager.magicArrayChange.checkTips(this.roleIndex));
	}

    protected clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.magicArrayChange, { "roleIndex": this.roleIndex });
        this.stopOneKey();
    }

	protected clickActiveBtn(): void {
        if(this.isOpen(true)) {
            ProxyManager.shape.shapeActivate(this.eShape, this.roleIndex);
        }
        //if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MagicLaw,true, true)) {
            
        //}
    }

    // protected updateActiveText() : void {
    //     this.active_text.text = CacheManager.magicArray.getActiveStr(this.roleIndex);
    // }

    protected clickLevelUp(): void {
        let tip: string;
		let upgradeTip: string = LangShapeBase.LANG20;
		let levelTip: string = LangShapeBase.LANG21;
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
					ProxyManager.pack.useItem(itemData.getUid(), 1, [], this.roleIndex);
				} else {
					Tip.showLeftTip(LangShapeBase.LANG22);
				}
			}, this);
		}
    }


    public getShapeCache() : ShapeBaseCache {
        return CacheManager.magicArray;
    }
 

}