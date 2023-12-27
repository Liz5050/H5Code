/**
 * 本地图内移动到目标点
 */
class AIMove extends AIBase
{
    private gridX: number;
    private gridY: number;
    private distance: number = 0;
    private autoFightCtrl: IAutoFight;

    public constructor(data?: any)
    {
        super(data);
        this.frameHold = 5;
        this.gridX = data.x;
        this.gridY = data.y;
        if (data.distance)
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
        var flag:boolean = PathUtils.isInRange(this.gridX, this.gridY, this.distance);
        if(flag){
            EventManager.dispatch(LocalEventEnum.AIAutoPath,true);
        }
        return flag;
    }

    public update(...params): boolean
    {
        if (super.update())
        {
            let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
            if (kingEntity != null && !kingEntity.isDead())
            {
                if (this.isComplete())
                {
                    kingEntity.stopMove();
                    return true;
                }
                else
                {
                    if (CacheManager.buff.hasInterruptMoveBuff(0))
                        return false;//无法移动
                    if (!kingEntity.isMoving())
                    {
                        //上坐骑
                        EventManager.dispatch(UIEventEnum.HomeSwitchMount, MountEnum.UpMount);
                        kingEntity.gotoGrid(this.gridX, this.gridY);
                    }
                    else
                    {//移动中
                        if (this.autoFightCtrl)
                        {
                            this.autoFightCtrl.updateOnMoving();
                        }
                    }
                }
            }
        }
        return false;
    }
}