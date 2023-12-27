class VipCardItem extends ListRenderer
{
    private item: BaseItem;
    private nameTxt: fairygui.GRichTextField;
    private goldTxt: fairygui.GTextField;
    private itemData:ItemData;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml:any):void
    {
        super.constructFromXML(xml);

        this.item = <BaseItem>this.getChild("BaseItem");
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.goldTxt = this.getChild("txt_cost").asTextField;
    }

    public setData(data:any, index:number):void
    {
        this._data = data;
        this.itemData = new ItemData(data.itemCode);
        this.item.setData(this.itemData);
        this.nameTxt.text = this.itemData.getName(true);
        let shopSell:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_VIP+","+data.itemCode);
        this.goldTxt.text = shopSell ? shopSell.price+"" : "0";
    }

    public getItemData():ItemData{
        return this.itemData;
    }
}