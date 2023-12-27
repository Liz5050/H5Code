class MiningPanel extends BaseTabView {
    private miningTxt: fairygui.GRichTextField;
    private robTxt: fairygui.GRichTextField;
    private enterBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.miningTxt = this.getGObject("txt_mining").asRichTextField;
        this.robTxt = this.getGObject("txt_rob").asRichTextField;
        this.enterBtn = this.getGObject("btn_enter").asButton;
        this.enterBtn.addClickListener(this.onClickEnter, this);

        GuideTargetManager.reg(GuideTargetName.MiningPanelEnterBtn, this.enterBtn);
    }

    public updateAll(data?:any):void {
        let info:any = CacheManager.mining.myMiningInfo;
        let stCfg:any = ConfigManager.mining.getMiningStaticData();
        let miningCount:number = ConfigManager.mining.getMiningStaticMiningCount(CacheManager.welfare2.isPrivilegeCard);
        let leftMiningCount:number = miningCount - info.miningTimes_I;
        let miningCountStr:string = (leftMiningCount>0?leftMiningCount:0) + '/' + miningCount;
        if (leftMiningCount<=0) miningCountStr = HtmlUtil.html(miningCountStr, Color.Red);
        this.miningTxt.text = App.StringUtils.substitude(LangMining.LANG2, miningCountStr);
        let leftRobCount:number = stCfg.robTimes - info.robTimes_I;
        let robCountStr:string = (leftRobCount>0?leftRobCount:0) + '/' + stCfg.robTimes;
        if (leftRobCount<=0) robCountStr = HtmlUtil.html(robCountStr, Color.Red);
        this.robTxt.text = App.StringUtils.substitude(LangMining.LANG3, robCountStr);
    }

    public hide():void {
        super.hide();
    }

    // private onClickProblem() {
    //     EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangMining.LANG1});
    // }

    private onClickEnter() {
        EventManager.dispatch(LocalEventEnum.ReqEnterMiningCopy, CopyEnum.CopyMining, 0);
    }
}