class ContestQualificationEndView extends fairygui.GComponent {
    private rankTxt: fairygui.GRichTextField;
    private scoreTxt: fairygui.GRichTextField;
    private honorTxt: fairygui.GRichTextField;
    private rankList: List;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.rankTxt = this.getChild("txt_my_rank").asRichTextField;
        this.scoreTxt = this.getChild("txt_my_score").asRichTextField;
        this.honorTxt = this.getChild("txt_my_honor").asRichTextField;
        this.rankList = new List(this.getChild("list_rank").asList);
    }

    public update(data:any):void {
        this.rankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG51, data.signUp_B ? data.rank_I : LangContest.LANG39);
        this.scoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG52, data.score_I);
        this.honorTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG53, data.winCount_I, data.loseCount_I);
        this.rankList.data = data.ranks.data;
    }

}