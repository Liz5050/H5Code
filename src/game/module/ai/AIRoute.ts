/**
 * 寻路到目标点
 */
class AIRoute extends AIBase
{
    private mapId: number;//地图id，0代表本地图
    private gridX: number;
    private gridY: number;
    private distance: number = 0;
    private waitFrame: number = 60;//等待帧数，防止传送点切图多次调用
    private leftTime: number = 0;
    private autoFightCtrl: IAutoFight;//移动中挂机控制器

    public constructor(data?: any)
    {
        super(data);
        this.mapId = data.mapId;
        this.gridX = data.x;
        this.gridY = data.y;
        if ((this.gridX == undefined || this.gridY == undefined) && this.isSameMap())
        {
            Log.trace(Log.FATAL, "移动数据出错!!!");
            EventManager.dispatch(LocalEventEnum.AIStop);
            return;
        }
        if (data.distance != null)
        {
            this.distance = data.distance;
        }
        if (data.autoFightCtrl)
        {
            this.autoFightCtrl = data.autoFightCtrl;
        }
    }

    public isComplete(data?: any): boolean
    {
        let isArrive: boolean = this.isSameMap() && PathUtils.isInRange(this.gridX, this.gridY, this.distance);
        return isArrive;
    }

    private isSameMap(): boolean
    {
        return this.mapId == 0 || CacheManager.map.mapId == this.mapId || CacheManager.map.getMapResId() == this.mapId;
    }

    public update(...params): boolean
    {
        if (this.isComplete())
        {
            super.onComplete();
            return true;
        }
        if(ControllerManager.scene.sceneState != SceneStateEnum.AllReady)
            return false;
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntity == null || kingEntity.action == Action.Attack)
            return false;
        if (this.isSameMap())
        {//同场景内移动
            AI.addAI(AIType.Move, {
                "x": this.gridX,
                "y": this.gridY,
                "distance": this.distance,
                "autoFightCtrl": this.autoFightCtrl
            });
        }
        else if (kingEntity.currentState != EntityModelStatus.ScaleTween)
        {//寻路到传送点
            AI.addAI(AIType.MoveToPassPoint, {toMapId: this.mapId});
        }
        return false;
    }
}