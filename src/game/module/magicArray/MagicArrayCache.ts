class MagicArrayCache extends ShapeBaseCache {

	public constructor() {
		super();
		this.eShape = EShape.EShapeLaw;
		this.openModuleName = MgOpenEnum.MagicLaw;
	}

	public getShapeChangeCache() : ShapeBaseChangeCache{
		return CacheManager.magicArrayChange;//重写该方法来获取幻形cache
	}

	public checkTipsByRoleIndex(roleIndex: number): boolean {
		let flag: boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MagicLaw, false)){
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
			flag = CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isLawUpItem, ItemsUtil) > 0;
		}
		if(!flag){
			flag = this.getShapeChangeCache().checkTips(roleIndex);
		}
		return flag;
	}

}