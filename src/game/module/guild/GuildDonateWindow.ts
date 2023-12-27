/**
 * 仙盟捐献窗口
 */
class GuildDonateWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private itemList: List;
	private equips: Array<ItemData>;

	public constructor() {
		super(PackNameEnum.Guild, "WindowGuildDonate");
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.itemList = new List(this.getGObject("list_item").asList);
	}

	public updateAll(data: any = null): void {
		this.equips = CacheManager.guild.getCanDonateEquips();
		if (this.equips.length > 0) {
			let showEquips: Array<any> = [].concat(this.equips);
			let minSize: number = 15;
			let len: number = minSize - this.equips.length;
			if (this.equips.length < minSize) {
				for (let i: number = 0; i < len; i++) {
					showEquips.push(ItemDataEnum.empty);
				}
			}
			this.itemList.data = showEquips;
			this.setToolTipSource();
		}
		this.c1.selectedIndex = this.equips.length == 0 ? 0 : 1;
	}

	/**
	 * 删除已捐献的物品。默认删除选中的
	 */
	public removeItem(itemData: ItemData): void {
		let baseItem: BaseItem = this.itemList.selectedItem as BaseItem;
		baseItem.itemData = null;
		baseItem.selected = false;
	}

	private setToolTipSource(): void {
		for (let baseItem of this.itemList.list._children) {
			(baseItem as BaseItem).toolTipSource = ToolTipSouceEnum.GuildDonateWindow;
		}
	}
}