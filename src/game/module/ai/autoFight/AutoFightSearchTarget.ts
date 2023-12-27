class AutoFightSearchTarget extends AutoFightNormal {
	public constructor() {
		super();
	}

	public findTargetToAttack():RpgGameObject {
		let target:RpgGameObject;
		target = CacheManager.bossNew.battleObj;
		if(!target) {
			let list:RpgGameObject[] = CacheManager.map.getTargetsSortByDis(CacheManager.king.leaderIndex);
			if(list.length > 0) {
				target = list[0];
				CacheManager.bossNew.battleObj = target;
			}
		}
		// if(!target) {
		// 	target = CacheManager.map.getNearestMonster();
		// }
        return target;
    }
}