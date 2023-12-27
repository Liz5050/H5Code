class TestSearchItem extends ListRenderer {
    private baseItem: BaseItem;
    private buyBtn: fairygui.GButton;
    private numTxt: fairygui.GTextField;
    private itemData: ItemData;

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.numTxt = this.getChild("txt_num").asTextField;
        this.buyBtn = this.getChild("btn_buy").asButton;
        this.buyBtn.addClickListener(this.clickBuy, this);
    }

    public setData(data: any) {
        this.itemData = data;
        this.baseItem.itemData = this.itemData;
        this.baseItem.setNameText(this.itemData.getName(true));
    }

    private clickBuy(): void {
        if (this.itemData) {
            let num: number = Number(this.numTxt.text);
            if(num == 0) {
                num = 1;
            }
            ProxyManager.test.addItem(this.itemData.getCode(), num);
        }
    }
}