class PeakApplyPanel extends BaseView {
    private ruleTxt: fairygui.GRichTextField;
    private itemList: List;
    private hasContent: boolean;

    public constructor(component: fairygui.GComponent) {
        super(component);
    }

    public initOptUI(): void {
        this.ruleTxt = this.getGObject("txt_rule").asRichTextField;
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.hasContent) {
            let openDtList:simple.ISMgPeakArenaStateTime[] = data;
            let isCross:boolean = CacheManager.peak.isCrossOpen;
            let lang:string = isCross ? LangPeak.MAIN3 : LangPeak.MAIN2;
            let timeStrList:string[] = [];
            for (let dt of openDtList) {
                if (dt.state_I > 1 && dt.state_I % 2 == 1) continue;
                timeStrList.push(App.DateUtils.formatDate(dt.startDt_DT, DateUtils.FORMAT_CN_M_D_WEEKX_HH_MM));
                if (dt.state_I == EPeakArenaState.EPeakArenaStateSignUp) {
                    timeStrList.push(App.DateUtils.formatDate(dt.endDt_DT, DateUtils.FORMAT_CN_M_D_WEEKX_HH_MM));
                }
            }
            this.ruleTxt.text = App.StringUtils.substitude(lang, ...timeStrList);

            let rewardStr:string = ConfigManager.peak.getStaticData(isCross ? "showRewardCross" : "showReward");
            let rewardList:ItemData[] = RewardUtil.getStandeRewards(rewardStr);
            this.itemList.data = rewardList;

            this.hasContent = true;
        }
        // this.updateSign();
    }

    // public updateSign():void {
    //     let isSign:boolean = !!CacheManager.peak.isSign;
    //     CommonUtils.setBtnTips(this.applyBtn, !isSign);
    //     App.DisplayUtils.grayButton(this.applyBtn, isSign, isSign);
    // }
}