class VipShopItemData
{
    public id: number;
    public itemCode: number;
    public isVipCard: boolean;
    public desc: string;
    public constructor(data:any)
    {
        this.id = data.id;
        this.itemCode = data.itemCode;
        this.isVipCard = data.isVipCard == 1;
        this.desc = HtmlUtil.br(data.desc);
    }
}