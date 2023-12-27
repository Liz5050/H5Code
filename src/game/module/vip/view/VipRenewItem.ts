class VipRenewItem extends ListRenderer
{
    private item: BaseItem;
    private nameTxt: fairygui.GRichTextField;
    private goldTxt: fairygui.GRichTextField;
    private buyBtn: fairygui.GButton;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);

        this.item = <BaseItem>this.getChild("BaseItem");
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.goldTxt = this.getChild("txt_cost").asRichTextField;
        this.buyBtn = this.getChild("btn_buy").asButton;
        this.buyBtn.addClickListener(this.onClickBuy,this);
    }

    public setData(data:any, index:number):void
    {
        this._data = data;
        let itemData:ItemData = new ItemData(data.itemCode);
        this.item.setData(itemData);
        this.nameTxt.text = itemData.getName(true);
        let shopSell:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_VIP+","+data.itemCode);
        let color:string = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, shopSell.price, false) ? Color.BASIC_COLOR_4 : Color.BASIC_COLOR_7;
        this.goldTxt.text = shopSell ? HtmlUtil.html(shopSell.price+"", color) : "0";
    }

    private onClickBuy(e:any)
    {
        let data:VipShopItemData = this._data as VipShopItemData;
        let shopSell:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_VIP+","+data.itemCode);
        if (shopSell && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, shopSell.price))
        {
            EventManager.dispatch(LocalEventEnum.ShopBuyAndUse, new ItemData(data.itemCode), ShopType.SHOP_VIP);
        }
    }
}