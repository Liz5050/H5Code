class PeakReport1Item extends ListRenderer {
    private c1: fairygui.Controller;//0失败1成功
    private roundTxt: fairygui.GTextField;
    private nameTxt: fairygui.GRichTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.roundTxt = this.getChild("txt_round").asTextField;
        this.nameTxt = this.getChild("txt_name").asRichTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.roundTxt.text = PeakCache.getRoundStr(CacheManager.peak.recordState, CacheManager.peak.isCrossOpen, index + 1);
        let opponentName:string;
        let succ:boolean;
        if (EntityUtil.isMainPlayer(data.player1.entityId)) {
            opponentName = data.player2.name_S;
        } else {
            opponentName = data.player1.name_S;
        }
        succ = EntityUtil.isMainPlayer(data.successEntityId);
        if (opponentName && opponentName != "")
            this.nameTxt.text = HtmlUtil.html(opponentName, Color.Color_8);
        else
            this.nameTxt.text = HtmlUtil.html(LangPeak.RECORD7, Color.Color_5);
        this.c1.selectedIndex = succ ? 1 : 0;
    }

}