/**
 * 移动到矿工附近
 */
class AIMoveToMiner extends AIBase {
    private miner: RpgMiner;
    private gridX: number;
    private gridY: number;
    private distance:number = 1;

    public constructor(data?: any) {
        super(data);
        this.frameHold = 1;
        this.miner = data.miner;

        if (this.miner != null) {
            this.gridX = this.miner.col;
            this.gridY = this.miner.row;
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
                    kingEntity.stopMove();
                    let entityId: string = this.miner && this.miner.entityInfo ? EntityUtil.getEntityId(this.miner.entityInfo.entityId) : null;
                    if (entityId) this.addAI(AIType.ClickEntity, {"entityId": entityId});
                    return true;
                }

                this.addAI(AIType.Route, { "mapId": 0, "x": this.gridX, "y": this.gridY, "distance": this.distance });
            }
        }
        return false;
    }
}