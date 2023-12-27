class ShopSellConfig extends BaseConfig {
	public constructor() {
		super("t_shop_sell","shopCode,itemCode");
	}

	public getShopList(st:ShopType):any[] {
        let goodsData: any = ConfigManager.shopSell.select({"shopCode": st});
        goodsData = this.sortGoods(goodsData);
        return goodsData;
    }

    private sortGoods(goods: Array<any>): Array<any>{
        if(goods && goods.length > 0){
            goods.sort((a: any, b: any) =>{
                return a.orderId - b.orderId;
            });
        }
        return goods;
	}
}