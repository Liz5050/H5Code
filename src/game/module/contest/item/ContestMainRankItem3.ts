class ContestMainRankItem3 extends ListRenderer {
    private c1: fairygui.Controller;//012代表123名
    private nameTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
    }

    // sequence<SContestPlayerValue> SeqContestRank;						//value - 阶段
    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this.c1.selectedIndex = index;
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        if (data.value_I < 8)
            this.scoreTxt.text = App.StringUtils.substitude(LangContest.LANG18, data.value_I + 1);
        else
            this.scoreTxt.text = App.StringUtils.substitude(LangContest.LANG19);
    }
}