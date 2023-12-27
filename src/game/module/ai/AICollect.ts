/**
 * 自动采集
 */
class AICollect extends AIBase {
	private bossCode: number;
	private mapId: number;
	private x: number;
	private y: number;
	private distance: number = 2;
	/**采集个数 */
	private num: number = -1;
	private currentNum: number = 0;

	public constructor(data?: any) {
		super(data);
		this.frameHold = 5;
		this.bossCode = data.bossCode;
		this.mapId = data.mapId;
		this.x = data.x;
		this.y = data.y;
		if (data.distance != null) {
			this.distance = data.distance;
		}
		if (data.num != null) {
			this.num = data.num;
		}
	}

	public isComplete(data?: any): boolean {
		if (this.num != -1 && this.currentNum == this.num) {
			return true;
		}
		return false;
	}

	public update(...params): boolean {
		if (super.update())
        {
            if (this.isComplete()) {
                return true;
            }
            if (CacheManager.king.collectEntity) {
                return false;
            }

            let entity: RpgMonster = CacheManager.map.getNearestCollect(-1, this.bossCode);
            if (entity && entity.entityInfo && CacheManager.king.leaderEntity) {
                // CacheManager.king.kingEntity.startCollect(entity);
                EventManager.dispatch(LocalEventEnum.SceneClickEntity, entity,true);
                this.currentNum++;
            } else {
                this.addAI(AIType.Route, { "mapId": this.mapId, "x": this.x, "y": this.y, "distance": this.distance });
            }
        }
        return false;
	}
}