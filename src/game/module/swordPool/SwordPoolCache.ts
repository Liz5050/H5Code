class SwordPoolCache extends ShapeBaseCache {

	public constructor() {
		super();
		this.eShape = EShape.EShapeSwordPool;
		this.openModuleName = MgOpenEnum.SwordPool;
	}

	public getShapeChangeCache() : ShapeBaseChangeCache{
		return CacheManager.swordPoolChange;//重写该方法来获取幻形cache
	}

	public checkTipsByRoleIndex(roleIndex: number): boolean {
		let flag: boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SwordPool, false)){
			return false;
		}
		if (!flag) {
			flag = this.isCanActive(roleIndex);
		}
		if (!flag) {
			flag = this.isCanUpgrade(roleIndex);
		}
		if (!flag) {
			flag = this.isCanUseDrug(roleIndex);
		}
		if (!flag) {
			flag = this.isRoleHasEquipTip(roleIndex);
		}
		if (!flag) {
			flag = CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isSwordPoolUpItem, ItemsUtil) > 0;
		}
		if(!flag){
			flag = this.getShapeChangeCache().checkTips(roleIndex);
		}
		return flag;
	}
}