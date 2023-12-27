class PeakGambleInfoItem extends ListRenderer {
    private c1: fairygui.Controller;//0亏损1获利
    private roundTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;
    private moneyTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.roundTxt = this.getChild("txt_round").asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.moneyTxt = this.getChild("txt_money").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.c1.selectedIndex = data.result_I > 0 ? 1 : (data.result_I < 0 ? 0 : 2);
        this.moneyTxt.text = data.result_I > 0 ? data.betNum_I + '' : (data.result_I < 0 ? '-' + data.betNum_I : App.StringUtils.substitude(LangPeak.GAMBLE15, data.betNum_I));
        this.nameTxt.text = data.name_S;
        let roundStr:string = PeakCache.getRoundStr(data.state_I, CacheManager.peak.isCrossOpen, index+1);
        this.roundTxt.text = roundStr.substr(0, roundStr.length - 4);
    }

}