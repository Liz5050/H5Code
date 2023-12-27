class VipRenewWindow extends BaseWindow
{
    private cardList: List;
    private itemDatas: Array<VipShopItemData>;

    public constructor()
    {
        super(PackNameEnum.VIP, "WindowVipRenew");
    }

    public initOptUI(): void
    {
        this.cardList = new List(this.getGObject("list_card").asList);
    }

    public updateAll(): void
    {
        if (!this.itemDatas)
        {
            this.itemDatas = ConfigManager.vip.getVipShopItems(true);
            this.cardList.data = this.itemDatas;
        }
    }
}