/**
 * 攻击移动到怪物
 * @author Chris
 */
class AIMoveToMonster extends AIBase
{
    private target: RpgGameObject;
    private targetX:number = -1;
    private targetY:number = -1;
    private distance: number = 0;
    private ignoreBlock:boolean  = false;
    private curGridX:number = -1;
    private curGridY:number = -1;
    private stepRush:boolean;
    private hasJumpDelay:boolean;

    public constructor(data?: any)
    {
        super(data);
        this.frameHold = 3;
        this.target = data.target;
        this.distance = data.distance;
        this.ignoreBlock = data.ignoreBlock;
        this.stepRush = data.stepRush;
    }

    public isComplete(data?: any): boolean
    {
        if (!this.target || this.target.isDead()) return true;
        let king:MainPlayer = CacheManager.king.leaderEntity;
        if (!king || king.isDead()) return true;
        let targetGrid:egret.Point = this.target.gridPoint;
        //Log.trace(Log.RPG, `isComplete?=p=${CacheManager.king.kingEntity.pixPoint}g=${CacheManager.king.kingEntity.gridPoint}->${this.targetGrid}|${this.target.pixPoint},dis=${this.distance}`);
        return king.hasInit && PathUtils.canAttackRange(king.gridPoint, targetGrid, this.distance, this.ignoreBlock, !EntityUtil.isCollectionMonster(this.target));
    }

    public update(...params): boolean
    {
        if (super.update())
        {
            let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
            if (kingEntity != null && !kingEntity.isDead())
            {
                if (this.curGridX == -1 || this.curGridY == -1) {
                    this.curGridX = kingEntity.gridPoint.x;
                    this.curGridY = kingEntity.gridPoint.y;
                }
                if (this.isComplete())
                {
                    kingEntity.stopMove();
                    this.target && !this.target.isDead() && EventManager.dispatch(LocalEventEnum.SceneClickEntity, kingEntity.battleObj);
                    return true;
                }
                else
                {
                    if (!kingEntity.isMoving() || this.targetX != this.target.gridPoint.x || this.targetY != this.target.gridPoint.y)
                    {
                        let moveType:EMoveType = EMoveType.EMoveTypeNormal;
                        if (this.checkCanRush(kingEntity, this.target)) {
                            if (kingEntity.lastAction == Action.Jump && !this.hasJumpDelay) {
                                this.delay += 133;//冲刺前缓冲
                                this.hasJumpDelay = true;
                                return;
                            }
                            moveType = EMoveType.EMoveTypeRush;
                        }
                        else if(this.checkOverRush(kingEntity, this.target)) {
                            //大于冲刺距离上坐骑
                            EventManager.dispatch(UIEventEnum.HomeSwitchMount,MountEnum.UpMount);
                        }
                        kingEntity.gotoGrid(this.target.gridPoint.x, this.target.gridPoint.y, moveType);
                        this.targetX = this.target.gridPoint.x;
                        this.targetY = this.target.gridPoint.y;

                    }
                    else if (kingEntity.moveType != EMoveType.EMoveTypeRush)
                    {//移动中
                        if (this.stepRush && (this.curGridX != kingEntity.gridPoint.x || this.curGridY != kingEntity.gridPoint.y))
                        {//位置变化，判断可不可以冲刺
                            this.curGridX = kingEntity.gridPoint.x;
                            this.curGridY = kingEntity.gridPoint.y;
                            if (this.checkCanRush(kingEntity, this.target)) {
                                kingEntity.gotoGrid(this.target.gridPoint.x, this.target.gridPoint.y, EMoveType.EMoveTypeRush);
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    private checkCanRush(fromEntity:RpgGameObject, targetEntity:RpgGameObject):boolean {
        if (EntityUtil.isCollectionMonster(targetEntity)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyContest)) return false;
        if (egret.getTimer() < CacheManager.battle.canRushTime) return false;
        let disNode: number = App.MathUtils.getDistance(fromEntity.gridPoint.x, fromEntity.gridPoint.y, targetEntity.gridPoint.x, targetEntity.gridPoint.y);
        // console.log("checkCanRush:", disNode, ConfigManager.battle["RushGridMin"], ConfigManager.battle["RushGridMax"], PathUtils.canLineRush(fromEntity.x, fromEntity.y, targetEntity.x, targetEntity.y))
        let baseCareer:number = CareerUtil.getBaseCareer(fromEntity.entityInfo.career_SH);
        return disNode > ConfigManager.battle["RushGridMin" + baseCareer]
            && disNode < ConfigManager.battle["RushGridMax"]
            && !PathUtils.checkBlock(fromEntity.gridPoint, targetEntity.gridPoint);//PathUtils.canLineRush(fromEntity.x, fromEntity.y, targetEntity.x, targetEntity.y);
    }

    /**
     * 是否超过冲刺距离
     */
    private checkOverRush(fromEntity:RpgGameObject, targetEntity:RpgGameObject):boolean {
        if (EntityUtil.isCollectionMonster(targetEntity)) return false;
        let disNode: number = App.MathUtils.getDistance(fromEntity.gridPoint.x, fromEntity.gridPoint.y, targetEntity.gridPoint.x, targetEntity.gridPoint.y);
        return disNode >= ConfigManager.battle["RushGridMax"];
    }
}