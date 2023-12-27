class ContestScoreRankWindow extends BaseWindow {
    private rankList: List;
    private myRankTxt: fairygui.GRichTextField;
    private myScoreTxt: fairygui.GRichTextField;

    public constructor() {
        super(PackNameEnum.Contest, "ContestScoreRankWindow");
    }

    public initOptUI(): void {
        this.myRankTxt = this.getGObject("txt_my_rank").asRichTextField;
        this.myScoreTxt = this.getGObject("txt_my_score").asRichTextField;
        this.rankList = new List(this.getGObject("list_rank").asList);
    }

    public updateAll(data?:any): void {
        let info:any = CacheManager.contest.qualificationInfo;
        let list:any[] = info.ranks ? info.ranks.data : [];
        this.rankList.setVirtual(list);
        this.myRankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG7, info.signUp_B ? info.rank_I : LangContest.LANG39);
        this.myScoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG8, info.score_I);
    }

}