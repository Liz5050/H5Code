/**
 * 巅峰竞技模块
 * @author Chris
 */
class PeakModule extends BaseTabModule {

    public constructor() {
        super(ModuleEnum.Peak, PackNameEnum.Peak);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.PeakMain]:["PeakMainPanel",PeakMainPanel]
            , [PanelTabType.PeakReward]:["PeakRewardPanel",PeakRewardPanel]
            , [PanelTabType.PeakShop]:["PeakShopPanel",PeakShopPanel]
            , [PanelTabType.PeakChipsShop]:["PeakChipsShopPanel",PeakChipsShopPanel]
            , [PanelTabType.PeakWorship]:["PeakWorshipPanel",PeakWorshipPanel]
        };

        this.descBtn.visible = true;
    }

    protected updateSubView():void {
        if (this.isTypePanel(PanelTabType.PeakReward)
            || this.isTypePanel(PanelTabType.PeakShop)
            || this.isTypePanel(PanelTabType.PeakChipsShop)
        ) {
            this.bottomArea = false;
        } else if (this.isTypePanel(PanelTabType.PeakWorship)) {
            this.heightController.selectedIndex = 2;
        } else {
            this.bottomArea = true;
        }
    }

    public onShow(data?:any):void {
        super.onShow(data);
    }

    public updateAll(data?: any): void {
        this.checkAllTips();
    }

    public updateMain(data: any):void {
        if (this.isTypePanel(PanelTabType.PeakMain)) this.curPanel.updatePanel(data);
        if (this.isTypePanel(PanelTabType.PeakWorship)) this.curPanel.updateAll();
    }

    public updateSign() {
        if (this.isTypePanel(PanelTabType.PeakMain)) this.curPanel.updateSign();
    }

    public updateBetResult() {
        if (this.isTypePanel(PanelTabType.PeakMain)) this.curPanel.updateBetResult();
    }

    public updateWorship() {
        if (this.isTypePanel(PanelTabType.PeakWorship)) this.curPanel.updateWorshipCount();
        this.setBtnTips(PanelTabType.PeakWorship, CacheManager.peak.checkWorshipTips());
    }

    public updateLikeResult() {
        if (this.isTypePanel(PanelTabType.PeakMain)) this.curPanel.updateLikeResult();
    }

    private checkAllTips():void {
        // this.setBtnTips(PanelTabType.CrossBoss,CacheManager.crossBoss.checkTips(null, PanelTabType.CrossBoss));
        this.setBtnTips(PanelTabType.PeakWorship, CacheManager.peak.checkWorshipTips());
    }

    protected clickDesc(): void {
        let tipStr:string = LangPeak.MAIN21;
        /*if(this.isTypePanel(PanelTabType.CrossBoss)) {
            tipStr = LangCrossBoss.LANG11;
        }
        else if(this.isTypePanel(PanelTabType.CrossBossCross)) {
            tipStr = LangCrossBoss.LANG11;
        }*/
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
    }

    public updateJeton() {
        if (this.isTypePanel(PanelTabType.PeakChipsShop)) this.curPanel.updateJeton();
    }

    public updatePeak() {
        if (this.isTypePanel(PanelTabType.PeakShop)) this.curPanel.updatePeak();
    }

    public updatePeakShopLimit() {
        if (this.isTypePanel(PanelTabType.PeakShop)) this.curPanel.updatePeakLimit();
    }

    public updateItemCost() {
        if (this.isTypePanel(PanelTabType.PeakShop)) this.curPanel.updatePeakItemCost();
    }
}