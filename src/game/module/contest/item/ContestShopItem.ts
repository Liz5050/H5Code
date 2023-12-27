class ContestShopItem extends ListRenderer {
    private shopItem: BaseItem;
    private nameTxt: fairygui.GRichTextField;
    private priceTxt: fairygui.GTextField;
    private buyBtn: fairygui.GButton;

    private limitNum: number;

    public constructor() {
        super();
    }

    public constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.shopItem = <BaseItem>this.getChild("baseItem");
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.priceTxt = this.getChild("txt_price").asTextField;
        this.buyBtn = this.getChild("btn_buy").asButton;
        this.buyBtn.addClickListener(this.click, this);

    }

    public setData(data: any): void {
        this._data = data;
        let itemData: ItemData = new ItemData(data.itemCode);
        itemData.itemAmount = 1;
        this.shopItem.itemData = itemData;
        this.shopItem.showBind();
        this.shopItem.txtName.visible = false;
        this.nameTxt.text = `<font color = ${Color.ItemColor[this.shopItem.itemData.getColor()]}>${this.shopItem.itemData.getName(false)}</font>`;
        this.priceTxt.text = data.price;
    }

    private click(): void {
        EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, this._data);
    }
}