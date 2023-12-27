class ContestScoreRankItem2 extends ListRenderer {
    private c1: fairygui.Controller;//0123代表123名其他
    private nameTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
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
        this.scoreTxt = this.getChild("txt_score").asTextField;
    }

    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this.c1.selectedIndex = index > 3 ? 3 : index;
        this.rankTxt.text = index + 1 + "";
        this.vipTxt.text = data.player.vipLevel_I > 0 ? `V` : ""; //${data.player.vipLevel_I}
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        this.scoreTxt.text = data.value_I + "";
    }
}