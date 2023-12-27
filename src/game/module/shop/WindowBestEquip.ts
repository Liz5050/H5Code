/**
 * 极品预览
 */
class WindowBestEquip extends BaseWindow {
	private equipList: List;
	private bestEquipDatas:Array<ItemData> = [];

	public constructor() {
		super(PackNameEnum.Shop, "WindowBestEquip");
	}

	public initOptUI(): void {
		this.equipList = new List(this.getGObject("list_equip").asList);
	}

	public updateAll(): void {
		this.updateList();
	}

	private updateList(): void{
		if(this.bestEquipDatas.length == 0){
			let bestEquipCodes: Array<number> = ConfigManager.client.getMysteryShopBestEquip();
			for(let code of bestEquipCodes){
				let itemData: ItemData = new ItemData(code);
				if(ItemsUtil.isTrueItemData(itemData)){
					this.bestEquipDatas.push(itemData);
				}
			}
		}
		this.equipList.setVirtual(this.bestEquipDatas, this.setItemRenderer, this);
	}

	private setItemRenderer(index: number, baseItem: BaseItem): void {
		let itemData: ItemData = this.bestEquipDatas[index];
		itemData.itemAmount = 1;
		baseItem.setData(itemData);
		baseItem.txtName.fontSize = 20;
	}
}