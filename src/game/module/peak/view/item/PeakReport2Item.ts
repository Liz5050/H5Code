class PeakReport2Item extends ListRenderer {
    private c1: fairygui.Controller;//n局
    private winnerTxt: fairygui.GTextField;
    private roundTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.winnerTxt = this.getChild("txt_name").asTextField;
        this.roundTxt = this.getChild("txt_round").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;

        let succName:string;
        if (EntityUtil.isSame(data.player1.entityId, data.successEntityId)) {
            succName = data.player1.name_S;
        } else {
            succName = data.player2.name_S;
        }
        this.winnerTxt.text = succName;
        this.roundTxt.text = App.StringUtils.substitude(LangPeak.RECORD1, index+1);
    }

}