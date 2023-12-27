class ShuraDecomposeWindow extends BaseWindow {
	private controller: fairygui.Controller;
	private equipList: List;
	private itemDatas: Array<ItemData>;

	public constructor() {
		super(PackNameEnum.Shura, "WindowDecomposeShura");
	}
	
	public initOptUI(): void{
		this.controller = this.getController("c1");
		this.equipList = new List(this.getGObject("list_equipDecompose").asList);
	}

	public updateAll(): void{
		this.itemDatas = WeaponUtil.getShuraCanDecompose();
		this.updateEquipList();
	}

	// public updateItemDatas(uid: string): void{
	// 	if(this.itemDatas.length > 0){
	// 		for(let i = 0; i < this.itemDatas.length; i++){
	// 			if(this.itemDatas[i].getUid() == uid){
	// 				this.itemDatas.splice(i, 1);//删除已分解的装备
	// 				break;
	// 			}
	// 		}
	// 		this.updateEquipList();
	// 	}
	// }

	private updateEquipList(): void{
		if(this.itemDatas.length > 0){
			this.controller.selectedIndex = 1;
		}else{
			this.controller.selectedIndex = 0;
		}
		this.equipList.setVirtual(this.itemDatas);
	}
}