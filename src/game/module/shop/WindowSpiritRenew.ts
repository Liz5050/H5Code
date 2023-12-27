/**
 * 守护续费
 */
class WindowSpiritRenew extends BaseWindow {
	private baseItem: BaseItem;
	private costTxt: fairygui.GTextField;
	private renewBtn: fairygui.GButton;
	private itemData: ItemData;
	private sellCfg: any;

	public constructor() {
		super(PackNameEnum.Shop, "WindowSpiritRenew");
	}

	public initOptUI(): void {
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.costTxt = this.getGObject("txt_cost").asTextField;
		this.renewBtn = this.getGObject("btn_renew").asButton;
		this.renewBtn.addClickListener(this.clickRenew, this);
	}

	public setItemData(itemData: ItemData): void {
		this.itemData = itemData;
	}

	public updateAll(): void {
		if (ItemsUtil.isTrueItemData(this.itemData)) {
			this.baseItem.itemData = new ItemData(ItemsUtil.getUnbindCode(this.itemData.getCode()));
			this.baseItem.showScoreCompare(false);
			this.sellCfg = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, ItemsUtil.getUnbindCode(this.itemData.getCode()));
			this.costTxt.text = this.sellCfg.price + "";
		}
	}

	private clickRenew(e: any): void {
		if (ItemsUtil.isTrueItemData(this.itemData)) {
			if (this.sellCfg) {
				if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.sellCfg.price)) {
					EventManager.dispatch(LocalEventEnum.ShopRenewSpirit, this.itemData);
				}
			}
		}
		this.hide();
	}
}