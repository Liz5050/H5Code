/**
 * 道具商店
 */

class ShopPropPanel extends BaseTabView {
	private goodList: List;

	public constructor() {
		super();
	}

	public initOptUI(): void{
		this.goodList = new List(this.getGObject("list_good").asList);
	}

	public updateAll(): void{
		this.updateList();
	}

	public updateList(): void{
		let goodsData: any = ConfigManager.shopSell.select({"shopCode": ShopType.SHOP_NORMAL});
		goodsData = this.sortGoods(goodsData);
		this.goodList.data = goodsData;
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