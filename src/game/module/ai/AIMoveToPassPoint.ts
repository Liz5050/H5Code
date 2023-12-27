class AIMoveToPassPoint extends AIBase
{
    private passPointId: number;
    private toMapId: number;
    private passPoint:any;
    private gridX: number;
    private gridY: number;

    public constructor(data?: any)
    {
        super(data);
        let passPoint: any;
        if (data.passPointId)
        {
            this.passPointId = data.passPointId;
            passPoint = ConfigManager.map.getPassPointById(CacheManager.map.mapId, this.passPointId);
        }
        if (data.toMapId)
        {
            this.toMapId = data.toMapId;
            passPoint = ConfigManager.map.getPassPoint(CacheManager.map.mapId, this.toMapId);
        }
        if (passPoint != null)
        {
            this.passPoint = passPoint;
            this.gridX = passPoint.point.x;
            this.gridY = passPoint.point.y;
        }
    }

    public isComplete(data?: any): boolean
    {
        return PathUtils.isInRange(this.gridX, this.gridY, 0);
    }

    public update(...params): boolean
    {
        if (super.update())
        {
            if (!this.passPoint)
                return false;
            let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
            if (kingEntity != null && !kingEntity.isDead())
            {
                if (this.isComplete())
                {
                    kingEntity.stopMove();
                    let entityId: string = EntityUtil.getPassPointEntityId(this.passPoint);
                    this.addAI(AIType.ClickEntity, {"entityId": entityId});
                    return true;
                }
                AI.addAI(AIType.Move, { "x": this.gridX, "y": this.gridY, "distance": 0});
            }
        }
        return false;
    }
}