class PeakReport2Window extends BaseWindow {
    private reportList: List;
    private name0Txt: fairygui.GTextField;
    private name1Txt: fairygui.GTextField;
    private vsTxt: fairygui.GTextField;

    public constructor() {
        super(PackNameEnum.Peak, "PeakReport2Window");
    }

    public initOptUI(): void {
        this.name0Txt = this.getGObject("txt_name0").asTextField;
        this.name1Txt = this.getGObject("txt_name1").asTextField;
        this.vsTxt = this.getGObject("txt_vs").asTextField;
        this.reportList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data:any): void {
        let pair:any = data.records.pair;
        let records:any[] = data.records.records.data;
        this.name0Txt.text = pair.player1.name_S;
        this.name1Txt.text = pair.player2.name_S;
        let win0Num:number = 0;
        for (let rc of records) {
            win0Num += (EntityUtil.isSame(rc.successEntityId, pair.player1.entityId) ? 1 : 0);
        }
        this.vsTxt.text = win0Num + "v" + (records.length - win0Num);
        this.reportList.data = records;
    }

}