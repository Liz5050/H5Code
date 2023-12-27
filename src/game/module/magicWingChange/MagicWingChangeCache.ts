class MagicWingChangeCache extends ShapeBaseChangeCache{
	
	public constructor() {
		super();
		this.shape = EShape.EShapeWing;
	}

	
	public getShapeCache() : ShapeBaseCache {
		return  CacheManager.shapeWing;
	}

}