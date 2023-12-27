class AIPickUp extends AIBase
{
	public constructor(data?: any) 
	{
		super(data);
		this.frameHold = 15;
	}

	public isComplete(data?: any): boolean 
	{
		return !CacheManager.map.hasPublicDrops && !CacheManager.map.hasPrivateDrops;
	}

	public update(...params): boolean 
	{
		if(super.update())
		{
			if(this.isComplete()) {
				return true;
			}
			let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
			if (kingEntity == null
                || kingEntity.entityInfo == null
                || Action.isActionLock(kingEntity.action)
                || kingEntity.currentState == EntityModelStatus.ScaleTween
                // || king.isCollecting()
                || kingEntity.isDead()
				|| !CacheManager.sysSet.isAutoPick()) {
                return false;
            }
			if(kingEntity != null)
			{
				if(kingEntity.action == Action.Stand)
				{
					let _drop:RpgGameObject;
					let _key:string;
					if(CacheManager.map.hasPublicDrops) {
						// kingEntity.isPickUp = true;
						_drop = CacheManager.map.getCanPickUpDrop();
					}
					else if(CacheManager.map.hasPrivateDrops && !kingEntity.hasSprite)
					{
						_key = CacheManager.map.dropPrivateKeys[0];
						// kingEntity.isPickUp = true;
						_drop = CacheManager.map.getEntity(_key);//this.privateDrops[0];
					}
					if(!_drop) {
						return false;
					}
					this.addAI(AIType.MoveToDrop,{drop:_drop});
				}
			}
		}
		return false;
	}
}