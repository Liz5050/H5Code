/**
 * 3V3模块
 * @author Chris
 */
class QualifyingModule extends BaseTabModule {
    private tipBtn: fairygui.GButton;

    public constructor() {
        super(ModuleEnum.Qualifying, PackNameEnum.Qualifying);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.QualifyingMain]:["QualifyingMainPanel",QualifyingMainPanel]
            , [PanelTabType.QualifyingRank]:["QualifyingRankPanel",QualifyingRankPanel]
            , [PanelTabType.QualifyingStandard]:["QualifyingStandardPanel",QualifyingStandardPanel]
            , [PanelTabType.QualifyingStage]:["QualifyingStagePanel",QualifyingStagePanel]

        };

        this.tipBtn = this.getGObject("btn_des").asButton;
        this.tipBtn.addClickListener(this.onOpenTips,this);
    }

    protected updateSubView():void {
        this.bottomArea = !this.isTypePanel(PanelTabType.QualifyingRank);
        this.tipBtn.visible = this.isTypePanel(PanelTabType.QualifyingMain);
    }

    public onShow(data?:any):void {
        super.onShow(data);
    }

    public updateAll(data?: any): void {
        this.checkAllTips();
    }

    public updateQualifyingInfo(data:any) {
        if (this.isTypePanel(PanelTabType.QualifyingMain)) {
            this.curPanel.updateInfo(data);
        } else if (this.isTypePanel(PanelTabType.QualifyingStage)) {
            this.curPanel.updateDailyRewardFlag(data);
        } else if (this.isTypePanel(PanelTabType.QualifyingStandard)) {
            this.curPanel.updateFlags(data);
        }
        this.checkAllTips();
    }

    public updateQualifyingTeam(teamInfo:any) {
        if (this.isTypePanel(PanelTabType.QualifyingMain)) {
            this.curPanel.updateTeam(teamInfo);
        }
    }

    public updateQualifyingRanks(rankInfo:simple.SQualifyingRanks) {
        if (this.isTypePanel(PanelTabType.QualifyingRank)) {
            this.curPanel.updateRanks(rankInfo);
        }
    }

    public updateQualifyingGoalGet() {
        if (this.isTypePanel(PanelTabType.QualifyingStandard)) {
            this.curPanel.updateFlags(CacheManager.qualifying.info);
        }
    }

    private checkAllTips():void {
        this.setBtnTips(PanelTabType.QualifyingStandard, CacheManager.qualifying.checkFunTips(PanelTabType.QualifyingStandard));
        this.setBtnTips(PanelTabType.QualifyingStage, CacheManager.qualifying.checkFunTips(PanelTabType.QualifyingStage));
    }

    private onOpenTips():void {
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.colorSubstitude(LangQualifying.LANG34)});
    }

}