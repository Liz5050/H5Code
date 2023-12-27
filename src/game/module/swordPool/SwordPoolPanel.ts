
class SwordPoolPanel extends ShapeBasePanel {

	protected levelUpBtn: fairygui.GButton;

	protected levelUpItemDatas: Array<ItemData>;
    protected upgradeItemDatas: Array<ItemData>;

     public constructor() {
        super();
        this.eShape = EShape.EShapeSwordPool;
    }

	public initOptUI(): void {
		super.initOptUI();

		this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
        this.levelUpBtn.addClickListener(this.clickLevelUp, this);

		GuideTargetManager.reg(GuideTargetName.SwordPoolPanelActiveBtn, this.activeBtn);
		GuideTargetManager.reg(GuideTargetName.SwordPoolPanelOnekeyBtn, this.onekeyBtn);
	}

    public updateModel() {
        this.model.setData(100010);
        if(CacheManager.swordPool.getInfo(this.roleIndex)) {
            this.model.setMcGrayed(false);
        }
        else {
            this.model.setMcGrayed(true);
        }
        this.nameLoader.load(URLManager.getModuleImgUrl("10001.png", PackNameEnum.SwordPool));
    }

	/**
     * 更新道具
     */
    public updateProp(): void {
		super.updateProp();
		this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isSwordPoolUpLevelItem, ItemsUtil);
        this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isSwordPoolUpUpgradeItem, ItemsUtil);
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.swordPoolChange.checkTips(this.roleIndex));
		this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
		CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);

		CommonUtils.setBtnTips(this.changeBtn, CacheManager.swordPoolChange.checkTips(this.roleIndex));
	}

    protected clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.SwordPoolChange, { "roleIndex": this.roleIndex });
        this.stopOneKey();
    }

	protected clickActiveBtn(): void {
        if(this.isOpen(true)) {
            ProxyManager.shape.shapeActivate(this.eShape, this.roleIndex);
        }
    }

    protected updateActiveText() : void {
        this.activeTxt.text = CacheManager.swordPool.getActiveStr(this.roleIndex);
    }

     protected clickLevelUp(): void {
        let tip: string;
		let upgradeTip: string = LangShapeBase.LANG17;
		let levelTip: string = LangShapeBase.LANG18;
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
					Tip.showLeftTip(LangShapeBase.LANG19);
				}
			}, this);
		}
    }


    public getShapeCache() : ShapeBaseCache {
        return CacheManager.swordPool;
    }

}