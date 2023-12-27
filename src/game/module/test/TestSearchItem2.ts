class TestSearchItem2 extends ListRenderer {
    private descTxt: fairygui.GTextField;
    private itemData: ItemData;
    private desc: string;

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.descTxt = this.getChild("txt_desc").asTextField;
    }

    public setData(data: any) {
        this.itemData = data;
        this.desc = "";
        this.desc += `uid: ${this.itemData.getUid()}\n`;
        this.desc += `name: ${this.itemData.getName()}\n`;
        this.desc += `num: ${this.itemData.getItemAmount()}\n`;
        this.desc += `posType: ${this.itemData.getPosType()}`;
        this.descTxt.text = this.desc;
    }
}