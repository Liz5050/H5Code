class ShapeBattleChangeCache extends ShapeBaseChangeCache{

	public constructor() {
		super();
		this.shape = EShape.EShapeBattle;
	}

	
	public getShapeCache() : ShapeBaseCache {
		return  CacheManager.battleArray;;
	}

}