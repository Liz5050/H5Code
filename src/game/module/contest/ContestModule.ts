/**
 * 1VN模块
 * @author Chris
 */
class ContestModule extends BaseTabModule {
    private tipBtn: fairygui.GButton;

    public constructor() {
        super(ModuleEnum.Contest, PackNameEnum.Contest);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.ContestQualification]:["ContestQualificationPanel",ContestQualificationPanel]
            , [PanelTabType.ContestMain]:["ContestMainPanel",ContestMainPanel]
            , [PanelTabType.ContestReward]:["ContestRewardPanel",ContestRewardPanel]
            , [PanelTabType.ContestShop]:["ContestShopPanel",ContestShopPanel]
            , [PanelTabType.ContestExchange]:["ContestExchangePanel",ContestExchangePanel]
            
        };

        this.tipBtn = this.getGObject("btn_des").asButton;
        this.tipBtn.addClickListener(this.onOpenTips,this);
    }

    protected updateSubView():void {
        // if (this.isTypePanel(PanelTabType.PeakReward)
        //     || this.isTypePanel(PanelTabType.PeakShop)
        //     || this.isTypePanel(PanelTabType.PeakChipsShop)
        // ) {
        //     this.bottomArea = false;
        // } else {
        //     this.bottomArea = true;
        // }
        if  (this.isTypePanel(PanelTabType.ContestReward)
            || this.isTypePanel(PanelTabType.ContestShop)
            || this.isTypePanel(PanelTabType.ContestExchange)){
            this.bottomArea = false;
        }
        this.tipBtn.visible = this.isTypePanel(PanelTabType.ContestQualification) || this.isTypePanel(PanelTabType.ContestMain);
    }

    public onShow(data?:any):void {
        super.onShow(data);
    }

    public updateAll(data?: any): void {
        this.checkAllTips();
    }

    public updateQualificationInfo() {
        if (this.isTypePanel(PanelTabType.ContestQualification)) {
            this.bottomArea = this.curPanel.updateInfo();
        }
    }

    public updateContestInfo() {
        if (this.isTypePanel(PanelTabType.ContestMain)) {
            this.bottomArea = this.curPanel.updateInfo();
        }
    }

    public checkChangeContestTab():void {
        if (this.isTypePanel(PanelTabType.ContestQualification)) {
            this.setIndex(PanelTabType.ContestMain);
        }
    }

    public updateContestPairInfo() {
        if (this.isTypePanel(PanelTabType.ContestMain)) {
            this.curPanel.updatePairInfo();
        }
    }

    public updateRoundInfo() {
        if (this.isTypePanel(PanelTabType.ContestQualification)
            || this.isTypePanel(PanelTabType.ContestMain)) {
            this.curPanel.updateRoundInfo();
        }
    }

    public updateContestBetInfo() {
        if (this.isTypePanel(PanelTabType.ContestMain)) {
            this.curPanel.updateContestBetInfo();
        }
    }

    public updateExchangePanel(): void{
        if(this.curPanel instanceof ContestExchangePanel){
            this.curPanel.updateInfo();
        }
    }

     public updateShopPanel(): void{
        if(this.curPanel instanceof ContestShopPanel){
            this.curPanel.updateInfo();
        }
    }

    private checkAllTips():void {
        // this.setBtnTips(PanelTabType.PeakWorship, CacheManager.peak.checkWorshipTips());
    }

    private onOpenTips():void {
        let tips:string = this.isTypePanel(PanelTabType.ContestQualification) ? LangContest.LANG9 : LangContest.LANG15;
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.colorSubstitude(tips)});
    }

}