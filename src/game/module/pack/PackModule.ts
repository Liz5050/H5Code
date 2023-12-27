/**
 * 背包
 */
class PackModule extends BaseTabModule {
    private c1: fairygui.Controller;
    private bgLoader: GLoader;

    public constructor() {
        super(ModuleEnum.Pack, PackNameEnum.Pack);
    }

    public initOptUI(): void {
        super.initOptUI();
        this.c1 = this.getController("c1");
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.bgLoader.load(URLManager.getModuleImgUrl("bg/popup_bg.png", PackNameEnum.Common));
        this.className = {
            [PanelTabType.PackEquip]: ["PackEquipPanel", PackEquipPanel],
            [PanelTabType.PackProp]: ["PackPropPanel", PackPropPanel],
            [PanelTabType.PackRune]: ["PackRunePanel", PackRunePanel],
            [PanelTabType.TrainIllustrate]: ["TrainIllustratePanel", TrainIllustratePanel, PackNameEnum.TrainIllustratePanel],
            [PanelTabType.PackSmelt]: ["PackSmeltPanel", PackSmeltPanel],
        };
        this.indexTitle = false;

    }

    //根据缓存更新
    public updateAll(): void {
        this.checkBtnRedTip();
        this.tabBgType = TabBgType.Default;
    }

    /**
     * tab标签切换
     */
    protected onSelectBtnChange(): void {
        super.onSelectBtnChange();
        if (this.curPanel instanceof PackEquipPanel) {
            this.tabBgType = TabBgType.Default;
        }
        else if(this.curPanel instanceof TrainIllustratePanel) {
            this.tabBgType = TabBgType.Default;
        }
        else {
            this.tabBgType = TabBgType.None;
        }
        
    }

    protected onMainTabChanged(e: any): void {
    }

    protected updateSubView(): void {
        this.c1.selectedIndex = this.curIndex;
	}

    public updateItems(): void {
        if (this.curPanel instanceof PackEquipPanel) {
            this.curPanel.updateItems();
        } else if (this.curPanel instanceof PackPropPanel) {
            this.curPanel.updateItems();
        } else if (this.curPanel instanceof PackRunePanel) {
            this.curPanel.updateItems();
        } else if (this.curPanel instanceof PackSmeltPanel) {
            this.curPanel.updateAll();
        }
    }

    public updatePropPackTips():void{
        this.updateItems();
        this.setBtnTips(PanelTabType.PackProp, CacheManager.pack.propCache.isHadCanUseItem);
    }

    public updateCapacity(): void {
        if (this.curPanel instanceof PackEquipPanel) {
            this.curPanel.updateCapacity();
            this.curPanel.updateBtnTips();
        }
    }

    public updateSmletCate(data: any): void {
        if (this.curPanel instanceof PackSmeltPanel) {
            this.curPanel.extendCate(data);
        }
    }

    public updateSmeltType(data: any): void {
        if (this.curPanel instanceof PackSmeltPanel) {
            this.curPanel.onChangeType(data);
        }
    }

    /**背包更新 */
    public onPackChange(): void {
        if (this.isTypePanel(PanelTabType.TrainIllustrate)) {
            this.curPanel.onPackPropChange();
        }
        this.checkBtnRedTip();
    }

    private checkBtnRedTip(): void {
        this.setBtnTips(PanelTabType.PackProp, CacheManager.pack.propCache.isHadCanUseItem);
        this.setBtnTips(PanelTabType.PackRune, CacheManager.pack.runePackCache.isHadCanUseItem);
        this.setBtnTips(PanelTabType.PackSmelt, CacheManager.pack.isCanSmelt());
        this.updateIllustrateTips();
    }

    private updateIllustrateTips(): void {
        this.setBtnTips(PanelTabType.TrainIllustrate, CacheManager.cultivate.checkIllustrateTips(true));
    }

    public updateIllustrate(): void {
        if (this.isTypePanel(PanelTabType.TrainIllustrate)) {
            this.curPanel.updateIllustrate();
            App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
        }
        this.updateIllustrateTips();
    }

    public updateIllustrateFight(): void {
        if (this.isTypePanel(PanelTabType.TrainIllustrate)) {
            this.curPanel.updateFight();
        }
    }

    public updateIllustrateExp(): void {
        if (this.isTypePanel(PanelTabType.TrainIllustrate)) {
            this.curPanel.updateIllustrateExp();
        }
        this.updateIllustrateTips();
    }

    public setTabType(type : number) {
        this.tabBgType = type;
    }

}