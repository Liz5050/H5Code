class MiningRobbedItem extends ListRenderer {
    private robbedTxt: fairygui.GRichTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.robbedTxt = this.getChild("txt_robbed").asRichTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.robbedTxt.text = String(data);
    }
}