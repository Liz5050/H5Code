class ContestVictoryRankItem extends ListRenderer {
    private c1: fairygui.Controller;//0失败1胜利
    private rankTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
    }

    // sequence<SContestPlayerValue> SeqContestQualificationRecord;		//value - 1-赢  0-输
    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this.c1.selectedIndex = data.value_I == 0 ? 0 : 1;
        this.rankTxt.text = App.StringUtils.substitude(LangContest.LANG6, index+1);
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
    }
}