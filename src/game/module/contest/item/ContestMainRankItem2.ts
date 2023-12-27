class ContestMainRankItem2 extends ListRenderer {
    private c1: fairygui.Controller;//0123代表123名其他
    private nameTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GRichTextField;
    private vipTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.vipTxt = this.getChild('txt_vip').asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.scoreTxt = this.getChild("txt_score").asRichTextField;
    }

    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this.c1.selectedIndex = index > 3 ? 3 : index;
        this.rankTxt.text = index + 1 + "";
        this.vipTxt.text = data.player.vipLevel_I > 0 ? `V` : "";//${data.player.vipLevel_I}
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        if (data.value_I < 8)
            this.scoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG14, data.value_I + 1);
        else
            this.scoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG17);
    }

}