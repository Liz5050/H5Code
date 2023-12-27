/**
 * 宝石镶嵌
 */
class StonePanel extends BaseTabPanel{
	private stoneInlay: Array<StoneInlayItem>;
	private stoneEquipList: List;
	private seletedItem: BaseItem;

	private inlayBtn: fairygui.GButton;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.stoneInlay = [];
		this.stoneEquipList = new List(this.getGObject("list_equipment").asList);
		this.seletedItem = <BaseItem>this.getGObject("BaseItem_SecletedEquipment");
		this.inlayBtn = this.getGObject("btn_set").asButton;
		this.seletedItem.enableToolTipOpt = false;
		this.stoneEquipList.list.addEventListener(fairygui.ItemEvent.CLICK, this.selectItem, this);

		this.stoneInlay = [];
		for (let i = 0; i < 6; i++) {
			let stoneInlayItem: StoneInlayItem = <StoneInlayItem>this.getGObject("stoneInlay" + i);
			this.stoneInlay.push(stoneInlayItem);
			stoneInlayItem.inlayData = {"pos": i, "vip": 0, "unLock": 0};
			switch(i){
				case 0:
					stoneInlayItem.inlayData["vip"] = 1;
					break;
				case 3:
					stoneInlayItem.inlayData["unLock"] = 7;
					break;
				case 4:
					stoneInlayItem.inlayData["unLock"] = 9;
					break;
				case 5:
					stoneInlayItem.inlayData["unLock"] = 11;
					break;
			}
		}
	}

	public updateAll(): void{
		this.updateStoneEquip();
		CommonUtils.setBtnTips(this.inlayBtn, CacheManager.refine.checkInlayTip());
	}

	/**镶嵌后更新 */
	public updateItem(itemdata: ItemData): void{
		let data: any = this.stoneEquipList.selectedData;
		data["itemData"] = itemdata;
		this.stoneEquipList.updateListItem(this.stoneEquipList.selectedIndex, data);
		this.selectItem();
	}

	/**镶嵌或卸下之后，背包更新时红点提示 */
	public updateEquipTip(): void{
		if(this.stoneEquipList.list.numItems){
			let selected: number = this.stoneEquipList.selectedIndex;
			let data: Array<any> = this.stoneEquipList.data;
			for(let i = 0; i < data.length; i++){
				data[i]["isBtnTip"] = CacheManager.refine.isCanInlay(data[i]["itemData"]);
			}
			this.stoneEquipList.data = data;
			this.stoneEquipList.selectedIndex = selected;
			this.selectItem();
		}
		CommonUtils.setBtnTips(this.inlayBtn, CacheManager.refine.checkInlayTip());
	}

	/**更新镶嵌装备 */
	public updateStoneEquip(): void{
		let items: Array<any> = [];
		for(let i = 1; i < EDressPos.EDressPosSpirit; i++){
			if(CacheManager.pack.rolePackCache.getItemAtIndex(i)){
				// items.push(CacheManager.pack.rolePackCache.getItemAtIndex(i));
				items.push({"itemData": CacheManager.pack.rolePackCache.getItemAtIndex(i), "isBtnTip": false});
			}
		}
		items = this.sortStone(items);
		this.stoneEquipList.data = items;
		this.stoneEquipList.selectedIndex = 0;
		this.selectItem();
	}

	/**更新选择装备 */
	public selectItem(): void{
		this.seletedItem.itemData = this.stoneEquipList.selectedData["itemData"];
		this.updateStoneInlay();
		this.updateCheckBox();
	}

	private updateCheckBox(): void{
		if(this.stoneEquipList.list.numItems){
			for(let i = 0; i < this.stoneEquipList.list.numItems; i++){
				let equipItem: StoneEquipItem = <StoneEquipItem>this.stoneEquipList.list.getChildAt(i);
				equipItem.setSelected(false);
				if(this.stoneEquipList.selectedIndex == i){
					equipItem.setSelected(true);
				}
			}
		}
	}

	/**更新镶嵌的宝石 */
	public updateStoneInlay(): void{
		if(this.stoneEquipList.selectedData == null){
			for(let stoneInlayItem of this.stoneInlay){
				stoneInlayItem.setData(0);
			}
		}
		else{
			let itemData: ItemData = this.stoneEquipList.selectedData["itemData"];
			let holeData: Array<any> = (itemData.getItemExtInfo().hole) ? itemData.getItemExtInfo().hole : [];
			let selectedItem: StoneEquipItem = <StoneEquipItem>this.stoneEquipList.selectedItem;
			for(let stoneInlayItem of this.stoneInlay){
				let pos: number = stoneInlayItem.inlayData["pos"];
				stoneInlayItem.inlayData["color"] = selectedItem.data["itemData"].getStoneColor();
				stoneInlayItem.inlayData["equipUid"] = itemData.getUid();
				if(holeData.length > 0 && holeData[pos]){
					stoneInlayItem.setData(holeData[pos]);
				}
				else{
					if(this.seletedItem.itemData.getItemLevel() < stoneInlayItem.inlayData["unLock"] || (stoneInlayItem.inlayData["vip"] && CacheManager.vip.vipLevel < 5)){
						stoneInlayItem.setData(0);
					}
					else{
						stoneInlayItem.setData(1);
					}
				}
			}
		}
	}

	/**可镶嵌的装备排序 */
	public sortStone(items: Array<any>): Array<any>{
		if(items && items.length > 0){
			items.sort((a: any, b:any): number =>{
				return this.getStoneSort(a) - this.getStoneSort(b);
			});
		}
		return items;
	}

	private getStoneSort(data: any):number{
		if(CacheManager.refine.isCanInlay(data["itemData"])){
			data["isBtnTip"] = true;
			return 1;
		}
		return 10;
	}

	// private isCanInlay(itemData: ItemData): boolean{
	// 	let stoneItems: Array<ItemData> = [];
	// 	stoneItems = CacheManager.pack.backPackCache.getByCT(ECategory.ECategoryJewel, itemData.getStoneColor());
	// 	if(stoneItems.length > 0){
	// 		for(let stoneItem of stoneItems){
	// 			if(stoneItem.getItemLevel() > itemData.getStoneMinLevel()){
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
}