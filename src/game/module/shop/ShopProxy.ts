class ShopProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**购买并使用物品
	 * C2S_SBuyItemAndUse
	 */
	public buyAndUseItem(npcId: number, shopCode: number, itemCode: number, amount: number, useAmount: number, discountCardCode: number, useDiscountCard: number): void {
		this.send("ECmdGameBuyItemAndUse", {
			npcId: npcId, shopCode: shopCode, itemCode: itemCode,
			amount: amount, useAmount: useAmount, discountCardCode: discountCardCode, useDiscountCard: useDiscountCard
		});
	}

	/**购买物品
	 * C2S_SBuyItem
	 */
	public buyItem(npcId: number, shopCode: number, itemCode: number, amount: number, discountCardCode: number, useDiscountCard: boolean): void {
		this.send("ECmdGameBuyItem", {
			"npcId": npcId, "shopCode": shopCode, "itemCode": itemCode,
			"amount": amount, "discountCardCode": discountCardCode, "useDiscountCard": useDiscountCard
		});
	}

	/**
	 * 续费守护
	 */
	public renewSpirit(uid: string): void {
		this.send("ECmdGameSpiritRenewInBag", { "uid": uid });
	}

	/**
	 * 神秘商店刷新请求
	 */
	public refreshMysteryShop(): void {
		this.send("ECmdGameRefreshMysteryShop", {});
	}

	/**
	 * 购买神秘商店物品
	 * @param itemCodes {"data_I": Array<number>}
	 * @param amounts {"data_I": Array<number>}
	 */
	public bugMysteryShopItem(itemCodes: any, amounts: any): void {
		this.send("ECmdGameBugMysteryShopItemAll", { "itemCodes": itemCodes, "amounts": amounts });
	}

}