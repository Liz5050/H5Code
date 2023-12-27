class BattleArrayPanel extends ShapeBasePanel {

	protected levelUpBtn: fairygui.GButton;

	protected levelUpItemDatas: Array<ItemData>;
    protected upgradeItemDatas: Array<ItemData>;

    public constructor() {
        super();
        this.eShape = EShape.EShapeBattle;
    }

	public initOptUI(): void {
		super.initOptUI();

		this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
        this.levelUpBtn.addClickListener(this.clickLevelUp, this);

		GuideTargetManager.reg(GuideTargetName.BattleArrayPanelActiveBtn, this.activeBtn);
		GuideTargetManager.reg(GuideTargetName.BattleArrayPanelOnekeyBtn, this.onekeyBtn);
	}

    public updateModel() {
        this.model.setData(9001);
        if(CacheManager.battleArray.getInfo(this.roleIndex)) {
            this.model.setMcGrayed(false);
        }
        else {
            this.model.setMcGrayed(true);
        }
        this.nameLoader.load(URLManager.getModuleImgUrl("9001.png", PackNameEnum.ShapeBattle));
    }
		
	/**
     * 更新道具
     */
    public updateProp(): void {
		super.updateProp();
		this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isBattleUpLevelItem, ItemsUtil);
        this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isBattleUpUpgradeItem, ItemsUtil);
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.battleArrayChange.checkTips(this.roleIndex));
		this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
		CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);

		CommonUtils.setBtnTips(this.changeBtn, CacheManager.battleArrayChange.checkTips(this.roleIndex));
	}

    protected clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.ShapeBattleChange, { "roleIndex": this.roleIndex });
        this.stopOneKey();
    }

	protected clickActiveBtn(): void {
        if(this.isOpen(true)) {
            ProxyManager.shape.shapeActivate(this.eShape, this.roleIndex);
        }
    }

    protected clickLevelUp(): void {
        let tip: string;
		let upgradeTip: string = LangShapeBase.LANG14;
		let levelTip: string = LangShapeBase.LANG15;
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
					Tip.showLeftTip(LangShapeBase.LANG16);
				}
			}, this);
		}
    }

    public getShapeCache() : ShapeBaseCache {
        return CacheManager.battleArray;
    }
}