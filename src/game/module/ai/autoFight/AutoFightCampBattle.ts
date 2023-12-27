class AutoFightCampBattle extends AutoFightNormal {
	private battleObj:RpgGameObject;
	public constructor() {
		super();
	}

	public isComplete(data?: any): boolean {
        return CacheManager.bossNew.battleObj == null;
    }

	public update(...params): boolean {
		if(CacheManager.battle.isNearAttack) {
			if(super.update()) {
				return true;
			}
		}
		else if(this.isComplete()){
            EventManager.dispatch(LocalEventEnum.AIStop);
			return true;
		}
	}

	public findTargetToAttack():RpgGameObject {
		let target:RpgGameObject = CacheManager.bossNew.battleObj;
		if(CacheManager.battle.isNearAttack) {
			if(!target) {
				let list:RpgGameObject[] = CacheManager.map.getTargetsSortByDis(CacheManager.king.leaderIndex);
				if(list.length > 0) {
					target = list[0];
					CacheManager.bossNew.battleObj = target;
				}
			}
		}
        return target;
    }
}