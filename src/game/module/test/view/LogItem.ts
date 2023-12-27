class LogItem extends ListRenderer {
    private logTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.logTxt = this.getChild("txt_log").asTextField;
    }

    public setData(data: any, index: number): void {
        this.logTxt.text = data;
    }
}