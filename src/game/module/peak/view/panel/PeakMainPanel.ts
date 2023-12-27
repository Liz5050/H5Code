/**
 * 巅峰主界面<包括报名和排位>
 * @author Chris
 */
class PeakMainPanel extends BaseTabView {
    private viewCtl: fairygui.Controller;
    private applyPanel: PeakApplyPanel;
    private rankingPanel: PeakRankingPanel;
    private applyBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.viewCtl = this.getController('c1');
        this.applyPanel = new PeakApplyPanel(this.getGObject('p_apply').asCom);
        this.applyBtn = this.getGObject("btn_apply").asButton;
        this.applyBtn.addClickListener(this.onClickApply, this);
        this.rankingPanel = new PeakRankingPanel(this.getGObject('p_ranking').asCom);
    }

    public updateAll(data?: any): void {
        this.updatePanel();
    }

    public updatePanel(data?: any) {
        if (CacheManager.peak.curState != EPeakArenaState.EPeakArenaStateSignUp) {
            this.viewCtl.selectedIndex = 1;
            // this.rankingPanel.updateAll();
            if (!data) EventManager.dispatch(LocalEventEnum.PeakGetPeakInfo);
            else this.rankingPanel.updateAll(data);
        } else {
            this.viewCtl.selectedIndex = 0;
            this.applyPanel.updateAll(CacheManager.peak.openDtList);
            this.updateSign();
            this.rankingPanel.hide();
        }
    }

    public updateBetResult():void {
        if (this.viewCtl.selectedIndex == 1) {
            this.rankingPanel.updateBetResult();
        }
    }

    public updateLikeResult():void {
        if (this.viewCtl.selectedIndex == 1) {
            this.rankingPanel.updateLikeResult();
        }
    }

    public updateSign():void {
        if (this.viewCtl.selectedIndex == 0) {
            let isSign:boolean = !!CacheManager.peak.isSign;
            CommonUtils.setBtnTips(this.applyBtn, !isSign);
            App.DisplayUtils.grayButton(this.applyBtn, isSign, isSign);
        }
    }

    private onClickApply() {
        EventManager.dispatch(LocalEventEnum.PeakSignUp);
    }

    public hide():void {
        super.hide();
        this.rankingPanel.hide();
    }
}