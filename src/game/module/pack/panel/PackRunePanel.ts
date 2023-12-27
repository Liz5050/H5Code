/**
 * 背包符文界面
 */
class PackRunePanel extends BaseTabView {

	private itemList: List;
	private itemDatas: Array<ItemData>;

	public initOptUI(): void {
		this.itemList = new List(this.getGObject("list_item").asList);
		// this.itemList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Pack, "RuneItem");
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
		this.itemDatas = CacheManager.pack.runePackCache.itemDatas;
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
		this.itemDatas.sort((a: any, b: any): number => {
			return this.getRuneSort(a, b);
		});
		this.itemList.setVirtual(showItems, this.setItemRenderer, this);
	}

	private getRuneSort(a: ItemData, b: ItemData): number {
		if(ItemsUtil.isRuneZero(a) && !ItemsUtil.isRuneZero(b)){
			return -1;
		}else if(!ItemsUtil.isRuneZero(a) && ItemsUtil.isRuneZero(b)){
			return 1;
		}else{
			if(a.getColor() > b.getColor()){
				return -1;
			}else if(a.getColor() < b.getColor()){
				return 1;
			}else{
				if(a.getType() > b.getType()){
					return -1;
				}else if(a.getType() < b.getType()){
					return 1;
				}
			}
		}
		return 0;
	}

	private setItemRenderer(index: number, item: RuneItem): void {
		item.setData(this.itemDatas[index]);
		item.bgUrl = `ui://${PackNameEnum.Pack}/item_bg`;
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let runeItem: RuneItem = <RuneItem>e.itemObject;
		// if (!runeItem.itemData) {
		// 	this.itemList.selectedIndex = -1;
		// }
		this.itemList.selectedIndex = -1;
	}
}