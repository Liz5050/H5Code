class SwordPoolChangeCache extends ShapeBaseChangeCache{
	
	public constructor() {
		super();
		this.shape = EShape.EShapeSwordPool;
	}

	
	public getShapeCache() : ShapeBaseCache {
		return  CacheManager.swordPool;
	}

}