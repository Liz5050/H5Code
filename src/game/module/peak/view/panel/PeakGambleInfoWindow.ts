class PeakGambleInfoWindow extends BaseWindow {
    private allScoreTxt: fairygui.GRichTextField;
    private itemList: List;

    public constructor() {
        super(PackNameEnum.Peak, "PeakGambleInfoWindow");
    }

    public initOptUI(): void {
        this.allScoreTxt = this.getGObject("txt_all").asRichTextField;
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?:any): void {
        if (!data) {
            EventManager.dispatch(LocalEventEnum.PeakGetPeakBetRecord);
        } else {
            //更新下注详情
            let totalBet:string = HtmlUtil.html(CacheManager.peak.totalBet + "", Color.Color_6);
            let gainLang:string = CacheManager.peak.totalGain >= 0 ? LangPeak.GAMBLE2 : LangPeak.GAMBLE3;
            let totalGain:string = HtmlUtil.html(App.StringUtils.substitude(gainLang, CacheManager.peak.totalGain), Color.Color_6);
            let totalBetCount:number = CacheManager.peak.totalBetCount;
            let isBefore16State:boolean = CacheManager.peak.isCrossOpen && CacheManager.peak.recordState < EPeakArenaState.EPeakArenaStateEliminate64Free
                || (!CacheManager.peak.isCrossOpen && CacheManager.peak.recordState < EPeakArenaState.EPeakArenaStateEliminate16Free);
            this.allScoreTxt.text = isBefore16State ? LangPeak.GAMBLE22 : App.StringUtils.substitude(LangPeak.GAMBLE1, totalBetCount, totalBet, totalGain);
            this.itemList.data = data;
        }
    }

}