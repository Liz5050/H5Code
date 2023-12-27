class RuneShopModule extends BaseModule {
	// private numTxt: fairygui.GTextField;
	private runeList: List;
	private runeShop: Array<any>;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.RuneShop);
	}

	public initOptUI():void {
		// this.numTxt = this.getGObject("txt_num").asTextField;
		this.runeList = new List(this.getGObject("list_rune").asList);
	}

	public updateAll():void {
		this.updateRuneList();
		this.updateCoin();
	}

	/**更新符文碎片 */
	private updateCoin(): void{
		// this.numTxt.text = CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin).toString();
	}

	/**更新可兑换的符文列表 */
	private updateRuneList(): void{
		this.runeShop = ConfigManager.shopSell.select({"shopCode": 1008});
		let itemDatas: Array<ItemData> = [];
		this.sortRuneShop();
		this.runeList.setVirtual(this.runeShop);
	}

	/**可兑换符文排序 */
	public sortRuneShop():void{
		if(this.runeShop && this.runeShop.length > 0){
			this.runeShop.sort((a: any, b:any): number =>{
				return this.getRuneSort(a) - this.getRuneSort(b);
			});
		}
	}

	private getRuneSort(data:any):number{
		return data.orderId;
	}
}