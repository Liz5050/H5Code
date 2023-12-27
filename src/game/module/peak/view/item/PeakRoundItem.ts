class PeakRoundItem extends ListRenderer {
    private roundCtl: fairygui.Controller;
    private lineCtl: fairygui.Controller;
    private timeTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.roundCtl = this.getController('c1');
        this.lineCtl = this.getController('c2');
        this.timeTxt = this.getChild("txt_time").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.lineCtl.selectedIndex = index != 4 ? 1 : 0;
        this.roundCtl.selectedIndex = index;
        this.timeTxt.text = App.DateUtils.formatDate(data as number, DateUtils.FORMAT_CN_HH_MM);
    }

}