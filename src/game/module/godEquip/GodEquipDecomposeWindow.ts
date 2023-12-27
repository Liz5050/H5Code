/**
 * 神装分解
 */
class GodEquipDecomposeWindow extends BaseWindow {
	private controller: fairygui.Controller;
	private equipList: List;
	private lotteryBtn: fairygui.GButton;
	private itemDatas: Array<ItemData>;

	public constructor() {
		super(PackNameEnum.GodEquip, "WindowDecompose");
	}
	
	public initOptUI(): void{
		this.controller = this.getController("c1");
		this.equipList = new List(this.getGObject("list_equipDecompose").asList);
		this.lotteryBtn = this.getGObject("btn_lottery").asButton;
		this.lotteryBtn.addClickListener(this.clickLotteryBtn, this);
	}

	public updateAll(): void{
		this.itemDatas = WeaponUtil.getGodEquipCanDecompose();
		this.updateEquipList();
	}

	/**点击打开符文塔 */
	private clickLotteryBtn(): void{
		// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 0 , "cName": "c2"});
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Lottery, { "tabType": PanelTabType.LotteryEquip });
		this.hide();
	}

	public updateItemDatas(uid: string): void{
		if(this.itemDatas.length > 0){
			for(let i = 0; i < this.itemDatas.length; i++){
				if(this.itemDatas[i].getUid() == uid){
					this.itemDatas.splice(i, 1);//删除已分解的装备
					break;
				}
			}
			this.updateEquipList();
		}
	}

	private updateEquipList(): void{
		if(this.itemDatas.length > 0){
			this.controller.selectedIndex = 1;
		}else{
			this.controller.selectedIndex = 0;
		}
		this.equipList.setVirtual(this.itemDatas);
	}
}