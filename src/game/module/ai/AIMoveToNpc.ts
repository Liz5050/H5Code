/**
 * 移动到npc附近
 */
class AIMoveToNpc extends AIBase {
    private npcId: number;
    private mapId: number;
    private gridX: number;
    private gridY: number;
    private distance:number = 2;

    // private pickUpDelay: number = -1;
    public constructor(data?: any) {
        super(data);
        this.frameHold = 5;
        this.npcId = data.npcId;

        let npc: any = ConfigManager.map.getNpc(this.npcId);
        if (npc != null) {
            this.mapId = !data.isClick ? npc.mapId : 0;
            this.gridX = npc.point.x;
            this.gridY = npc.point.y;
        }
    }

    public isComplete(data?: any): boolean {
        return false;
    }

    private isArrived():boolean{
        return (this.mapId == 0 || CacheManager.map.mapId == this.mapId || CacheManager.map.getMapResId() == this.mapId) && PathUtils.isInRange(this.gridX, this.gridY, this.distance);
    }

    public update(...params): boolean {
        if (super.update())
        {
            // if(CacheManager.map.hasPrivateDrops) {
            //     this.pickUpDelay += this.frameHold;
            //     if(this.pickUpDelay * 17 >= 1500) {
            //         //新手期间有掉落，简单处理，先捡掉落
            //         this.addAI(AIType.PickUp);
            //         this.pickUpDelay = -1;
            //     }
            //     return false;
            // }
            let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
            if (kingEntity != null && !kingEntity.isDead()) {

                //寻路到NPC前，先选中它
                let entity: RpgGameObject = CacheManager.map.getEntity(this.npcId.toString());
                if (entity != null) {
                    // EventManager.dispatch(LocalEventEnum.SceneClickEntity, entity);
                    kingEntity.battleObj = entity;
                }

                if (this.isArrived()) {
                    kingEntity.stopMove();
                    this.addAI(AIType.ClickEntity, {"entityId": this.npcId});
                    return true;
                }
                this.addAI(AIType.Route, { "mapId": this.mapId, "x": this.gridX, "y": this.gridY, "distance": this.distance });
            }
        }
        return false;
    }
}