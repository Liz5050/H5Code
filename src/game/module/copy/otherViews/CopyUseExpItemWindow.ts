/**
 * 点击效率要弹出的窗口
 */
class CopyUseExpItemWindow extends CopyBasePopupWin{
	private drug_list:List;
	public constructor() {
		super(PackNameEnum.Copy,"WindowCopyefficiency",false);
	}

	public initOptUI():void{
		super.initOptUI();
		this.drug_list = new List(this.getGObject("list_drug").asList);
		this.drug_list.list.scrollPane.bouncebackEffect = false;
	}

	public updateAll():void{
		var listData:ItemData[] = CacheManager.pack.backPackCache.getByCT(ECategory.ECategoryDrug,EProp.EPropEquipRefineMaterial);
		if(listData.length<=0){
			var item:ItemData = new ItemData(40030011);
			item.itemAmount = 1;
			listData.push(item);
		}
		this.drug_list.data = listData;
	}

}