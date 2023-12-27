class ContestMainRankWindow extends BaseWindow {
    private rankList: List;
    private myRankTxt: fairygui.GRichTextField;
    private myScoreTxt: fairygui.GRichTextField;

    public constructor() {
        super(PackNameEnum.Contest, "ContestMainRankWindow");
    }

    public initOptUI(): void {
        this.myRankTxt = this.getGObject("txt_my_rank").asRichTextField;
        this.myScoreTxt = this.getGObject("txt_my_score").asRichTextField;
        this.rankList = new List(this.getGObject("list_rank").asList);
    }

    public updateAll(data?:any): void {
        let info:any = CacheManager.contest.contestInfo;
        let list:any[] = info.ranks ? info.ranks.data : [];
        this.rankList.setVirtual(list);
        this.myRankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG7,
            info.signUp_B ? (info.rank_I > 0 ? info.rank_I : LangContest.LANG40) : LangContest.LANG39);
        let myRec:any = list[info.rank_I-1];
        this.myScoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG16,
            info.signUp_B ? "1V" + (myRec ? (myRec.value_I < 8 ? myRec.value_I+1:8):LangContest.LANG40) : LangContest.LANG39);
    }

}