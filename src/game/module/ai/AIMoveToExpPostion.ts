class AIMoveToExpPostion extends AIBase {
	private posCfg:any;
	private gridX: number;
    private gridY: number;
	private distance:number = 0;
	public constructor(data?: any) {
		super(data);
		this.frameHold = 1;
		this.posCfg = data.posCfg;
		if(this.posCfg != null) {
			this.gridX = this.posCfg.posX;
			this.gridY = this.posCfg.posY;
		}
	}

	public isComplete(data?: any): boolean {
        return false;
    }

    private isArrived():boolean{
        return PathUtils.isInRange(this.gridX, this.gridY, this.distance);
    }

	public update(...params): boolean {
        if (super.update()) {
            let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
            if (kingEntity != null && !kingEntity.isDead()) {
                if (this.isArrived()) {
					let occupyInfo:any = CacheManager.posOccupy.getOccupyInfo(this.posCfg.posId);
					if(!occupyInfo) {
						return true;
					}
					if(EntityUtil.isMainPlayer(occupyInfo.entityId)) {
						return true;
					}
					let entity:RpgGameObject = CacheManager.map.getOtherPlayer(occupyInfo.entityId);
					if(entity) {
						CacheManager.bossNew.battleObj = entity;
						// EventManager.dispatch(LocalEventEnum.FocusAttack,entity);
					}
                    return true;
                }
				if (CacheManager.buff.hasInterruptMoveBuff(0)) {
					return false;//无法移动
				}
				if(!kingEntity.isMoving()) {
					kingEntity.gotoGrid(this.gridX, this.gridY);
					// this.addAI(AIType.Move, {"x": this.gridX, "y": this.gridY, "distance": this.distance });
				}
            }
        }
        return false;
    }
}