class MountChangeCache extends ShapeBaseChangeCache{

	public constructor() {
		super();
		this.shape = EShape.EShapeMount;
	}

	public getShapeCache() : ShapeBaseCache {
		return  CacheManager.mount;
	}
}