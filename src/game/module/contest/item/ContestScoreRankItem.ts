class ContestScoreRankItem extends ListRenderer {
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

    // sequence<SContestPlayerValue> SeqContestQualificationRank;      	//value - 积分
    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this.c1.selectedIndex = index;
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        this.scoreTxt.text = data.value_I + "";
    }
}