/**
 * 上交装备
 */
class TaskHandEquip extends TaskBase {
	private toolTipData: ToolTipData;
	private color: number;
	private itemLevel: number;

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		if (contents != null && contents.length > 0) {
			this.color = contents[0];
			let colorName: string = GameDef.ColorName[this.color];
			this.itemLevel = contents[1];
			desc = `上交<font color='${targetColor}'>${this.itemLevel}阶</font>以上<font color='${Color.getItemColr(contents[0] + "")}'>${colorName}</font>装备 0/1`;
		}
		return desc;
	}

	public executeTask(isConvey: boolean = false): void {
		if (!this.toolTipData) {
			this.toolTipData = new ToolTipData();
		}
		let itemDatas: Array<ItemData> = [];
		let equips: Array<ItemData> = CacheManager.pack.backPackCache.getItemsByFun(ItemsUtil.isEquipItem, ItemsUtil);
		for (let itemData of equips) {
			if (!ItemsUtil.isEquipSpritItem(itemData) && itemData.getItemLevel() >= this.itemLevel && itemData.getColor() >= this.color) {
				itemDatas.push(itemData);
			}
		}
		this.toolTipData.data = itemDatas;
		this.toolTipData.type = ToolTipTypeEnum.HandInEquip;
		ToolTipManager.show(this.toolTipData);
	}
}