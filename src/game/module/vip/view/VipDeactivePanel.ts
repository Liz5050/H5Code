/**
 * Vip未激活标签
 */
class VipDeactivePanel extends BaseTabPanel
{
    private buyBtn: fairygui.GButton;
    private itemList:List;
    private itemDatas:Array<VipShopItemData>;
    private descpanel: VipDescribeItem;
    private titleTxt: fairygui.GTextField;
    private adLoader: GLoader;

    public initOptUI(): void
    {
        this.titleTxt = this.getGObject("txt_title").asTextField;
        this.buyBtn = this.getGObject("btn_buy").asButton;
        this.descpanel = this.getGObject("panle_describe") as VipDescribeItem;
        this.itemList = new List(this.getGObject("list_card").asList);
        this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
        this.adLoader = this.getGObject("loader_gg") as GLoader;
        this.buyBtn.addClickListener(this.onClickBuy,this);
    }

    public updateAll(): void
    {
        if (!this.itemDatas)
        {
            this.itemDatas = ConfigManager.vip.getVipShopItems(true);
            this.itemList.data = this.itemDatas;
        }
        this.itemList.selectedIndex = 0;
        this.itemList.scrollToView(0);
        let selectedItem:VipCardItem = this.itemList.selectedItem as VipCardItem;
        this.updateDesc(this.itemList.selectedData, selectedItem.getItemData());
    }

    private onClickItem(e:fairygui.ItemEvent):void
    {
        let item:VipCardItem = <VipCardItem>e.itemObject;
        let data:any = item.getData();
        this.updateDesc(data, item.getItemData());
    }

    private updateDesc(data:any, itemData:ItemData)
    {
        this.titleTxt.text = itemData.getName();
        this.descpanel.update(data.desc);
        this.adLoader.load(URLManager.getPackResUrl(PackNameEnum.VIP, "img_gg" + (this.itemList.selectedIndex+1)));
    }

    private onClickBuy(e:any)
    {
        let data:VipShopItemData = this.itemList.selectedData as VipShopItemData;
        let shopSell:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_VIP+","+data.itemCode);
        if (shopSell && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, shopSell.price))
        {
            EventManager.dispatch(LocalEventEnum.ShopBuyAndUse, new ItemData(data.itemCode), ShopType.SHOP_VIP);
        }
    }
}