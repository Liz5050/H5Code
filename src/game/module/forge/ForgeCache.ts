/**
 * 锻造
 */
class ForgeCache {
	public constructor() {
	}

	/**
	 * 功能是否开放了
	 */
	public isOpen(): boolean {
		// let openLevel: number = ConfigManager.mgOpen.getByPk(10).openLevel;
		// return CacheManager.role.getRoleLevel() >= openLevel;
		return true;
	}

	public isCanStrengthen(roleIndex: number): boolean {
		return CacheManager.role.isCanUpgradeStrengthenEx(EStrengthenExType.EStrengthenExTypeUpgrade, roleIndex);
	}

	public checkTips(): boolean {
		let flag:boolean = false;
		if (!flag) {
			flag = StrengthenExUtil.checkCanStrengthen(EStrengthenExType.EStrengthenExTypeUpgrade);
		}
		if(!flag) {
			flag = StrengthenExUtil.checkCanStrengthen(EStrengthenExType.EStrengthenExTypeCast);
		}
		if(!flag) {
			flag = StrengthenExUtil.checkCanStrengthen(EStrengthenExType.EStrengthenExTypeRefine);
		}
		if(!flag) { //神兵
			flag = CacheManager.forgeImmortals.checkTip();
		}
		return flag;
	}

	public clear(): void {

	}
}