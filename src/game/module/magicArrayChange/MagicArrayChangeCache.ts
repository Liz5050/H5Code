class MagicArrayChangeCache extends ShapeBaseChangeCache{
	
	public constructor() {
		super();
		this.shape = EShape.EShapeLaw;
	}

	
	public getShapeCache() : ShapeBaseCache {
		return  CacheManager.magicArray;;
	}

}