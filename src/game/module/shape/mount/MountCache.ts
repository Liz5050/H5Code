/**
 * 坐骑
 */

class MountCache extends ShapeBaseCache {

	public constructor() {
		super();
		this.eShape = EShape.EShapeMount;
		this.openModuleName = MgOpenEnum.Mount;
	}

	public checkTipsByRoleIndex(roleIndex: number): boolean{
		let flag: boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Mount, false)){
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
		if(!flag){
			flag = CacheManager.mountChange.checkTips(roleIndex);
		}
		return flag;
	}
}