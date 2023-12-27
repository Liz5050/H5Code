class AutoFightKingBattle extends AutoFightNormal {
	public constructor() {
		super();
	}

	public findTargetToAttack():RpgGameObject {
        return CacheManager.map.getNearOtherPlayer();
    }
}