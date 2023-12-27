class InputItem extends ListRenderer {
    private txt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.txt = this.getChild("title").asTextField;
    }

    public setData(data: any, index: number): void {
        this.txt.text = data;
    }

    public getData(): any {
        return this.txt.text;
    }
}