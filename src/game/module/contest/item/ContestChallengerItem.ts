class ContestChallengerItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private fcTxt: fairygui.GTextField;
    private vipTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.vipTxt = this.getChild('txt_vip').asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.fcTxt = this.getChild("txt_fc").asTextField;
    }

    public setData(data: simple.ISContestPlayer, index: number): void {
        this.rankTxt.text = index + 1 + "";
        this.vipTxt.text = data.vipLevel_I > 0 ? `V` : "";//${data.vipLevel_I}
        this.nameTxt.text = ChatUtils.getPlayerName(data);
        this.fcTxt.text = App.MathUtils.formatNum(Number(data.warfare_L64));
    }

}