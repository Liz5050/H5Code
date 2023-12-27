class MagicWingCache extends ShapeBaseCache {

	public constructor() {
		super();
		this.eShape = EShape.EShapeWing;
		this.openModuleName = MgOpenEnum.Wing;
	}

	public getShapeChangeCache() : ShapeBaseChangeCache{
		return CacheManager.shapeWingChange;//重写该方法来获取幻形cache
	}

}