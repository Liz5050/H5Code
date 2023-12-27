/**
 * 背包道具界面
 */
class PackPropPanel extends BaseTabView {

	private itemList: List;

	private itemDatas: Array<ItemData>;

	public initOptUI(): void {
		this.itemList = new List(this.getGObject("list_item").asList);
		this.itemList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Common, "BaseItem");
		this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
	}

	//根据缓存更新
	public updateAll(): void {
		this.updateItems();
	}

    /**
     * 更新所有物品
     */
	public updateItems(): void {
		this.itemDatas = CacheManager.pack.propCache.itemDatas;
		let minSize: number = 35;
		let maxSize: number = 0;
		let showItems: Array<ItemData> = [];
		let ownSize: number = this.itemDatas.length;
		if (ownSize <= minSize) {
			maxSize = minSize;
		} else {
			let remainder: number = ownSize % 5;
			if (remainder != 0) {
				maxSize = ownSize + (5 - remainder);
			} else {
				maxSize = ownSize;
			}
		}
		for (let i: number = 0; i < maxSize; i++) {
			if (i < ownSize) {
				showItems.push(this.itemDatas[i]);
			} else {
				showItems.push(null);
			}
		}
		this.itemList.setVirtual(showItems, this.setItemRenderer, this);
	}

	private setItemRenderer(index: number, item: BaseItem): void {
		let itemData: ItemData = this.itemDatas[index];
		item.setData(itemData);
		item.enableToolTipOpt = true;
		item.showBind();
		item.toolTipSource = ToolTipSouceEnum.Pack;
		if (itemData != null) {
			let isTips:boolean = ItemsUtil.isRedTipCanUse(itemData);			
			CommonUtils.setBtnTips(item,isTips);
		}
		item.bgUrl = `ui://${PackNameEnum.Pack}/item_bg`;
	}


	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = <BaseItem>e.itemObject;
		// if (!baseItem.itemData) {
		// 	this.itemList.selectedIndex = -1;
		// }
		this.itemList.selectedIndex = -1;
	}
}