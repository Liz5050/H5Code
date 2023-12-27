class AIMoveToDrop extends AIBase {
	private dropEntity:RpgGameObject;
	public constructor(data:any) {
		super(data);
		this.dropEntity = data.drop;
	}

	public isComplete(data?: any): boolean {
		if(!this.dropEntity) return true;
		return this.dropEntity.canPickUp;
	}

	public update(...params): boolean {
		if(super.update()) {
			let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
			if (kingEntity != null && !kingEntity.isDead() && this.dropEntity) {
				if(!this.dropEntity.entityInfo) {
					this.dropEntity = null;
					return true;
				}
				if(this.isComplete()) {
					if(this.dropEntity.objType == RpgObjectType.DropPublic) {
						kingEntity.pickUpDrop();
					}
					else {
						if(!(this.dropEntity as DropEntity).autoPickUp) {
							kingEntity.pickUpPrivateDrop();
							// egret.setTimeout(function(){
							// 	(this.dropEntity as DropEntity).pickUpDestory();
							// },this,300);
						}
						// this.dropEntity["pickUpDestory"]();
						
					}
					this.dropEntity = null;
					return true;
				}

				if(!kingEntity.isMoving()) {
					if(!kingEntity.goto(this.dropEntity.x, this.dropEntity.y)) {
						//无法移动到掉落点
						if(this.dropEntity.objType == RpgObjectType.DropPublic) {
							this.dropEntity.isPickUp = true;
							kingEntity.pickUpDrop([this.dropEntity.entityInfo.entityId]);
						}
						else {
							this.dropEntity["pickUpDestory"]();
							this.dropEntity = null;
						}
						Log.trace(Log.TEST,"无法移动到掉落点了，直接拾取该掉落,掉落坐标：",this.dropEntity.x,this.dropEntity.y,"主角坐标：",kingEntity.x,kingEntity.y);
						return true;
					}
					else if(!kingEntity.isOnMount){
						EventManager.dispatch(UIEventEnum.HomeSwitchMount,MountEnum.UpMount);
					}
					// this.addAI(AIType.Move, {"x": this.gridX, "y": this.gridY, "distance": this.distance });
				}
			}
		}
	}
}