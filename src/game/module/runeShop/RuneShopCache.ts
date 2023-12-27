class RuneShopCache implements ICache{
	public constructor() {
	}

	public checkExchangeTips(): boolean{
		let runeShop: Array<any> = ConfigManager.shopSell.select({"shopCode": 1008});
		for(let data of runeShop){
			let isPassTower: boolean = !data.copyFloor || CacheManager.copy.getCopyProcess(CopyEnum.CopyTower) >= data.copyFloor;
			if(CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin) >= data.price && isPassTower){
				return true;
			}
		}
		return false;
	}

	public clear(): void {

	}
}