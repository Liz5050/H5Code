/**
 * 普通挂机子控制器
 * @author Chris
 */
class AutoFightNormal implements IAutoFight
{
    protected updateDelay:number = 0;
    protected data:any;
    protected selectMonster:RpgGameObject;
    protected hasFindMon:boolean;
    protected hasFindMonPos:boolean;
    protected searchDis:number = -1;
    protected bossCode: number = -1;
    /**挂机是否强制优先找到boss攻击(忽略距离) */
    protected isForceFindBoss:boolean;
    //外部数据
    protected mapId: number;
    protected x: number;
    protected y: number;
    protected distance: number = 0;
    protected findMonPosRadius: number = 0;//搜索怪物点像素半径

    public constructor(data?:any)
    {
        this.data = data;
        this.searchDis = CacheManager.battle.autoBattleSearchDis;//距离太短会导致怪就在屏幕内但就是选不到
        if (data)
        {
            this.bossCode = data.bossCode;
            this.mapId = data.mapId;
            this.x = data.x;
            this.y = data.y;
            if (data.distance != null)
            {
                this.distance = data.distance;
            }
        }
        this.isForceFindBoss = false;
    }

    public update():boolean
    {
        if (this.findMonster())
        {
            this.hasFindMon = true;
            return true;
        }
        else if (!this.hasFindMon && this.findMonsterPoint())//打过怪的不再找怪物点
        {
            this.hasFindMonPos = true;
        }
        return false;
    }

    public updateOnMoving():void
    {
        this.hasFindMonPos && this.findMonster();Log.trace(Log.FIGHT, "updateOnMoving")
    }

    protected findMonster():boolean
    {//Log.trace(Log.FIGHT, "findMonster0", CacheManager.king.kingEntity.action)
        if (!this.isNeedSearch())
        {//Log.trace(Log.FIGHT, "findMonster000.5")
            return true;
        }
        this.selectMonster = this.findTargetToAttack();
        //console.log("主--->findMonster233333333", this.selectMonster == null, this.selectMonster && this.selectMonster.x)
        if (this.selectMonster != null && !this.selectMonster.isDead())
        {
            CacheManager.king.leaderEntity.battleObj = this.selectMonster;//Log.trace(Log.FIGHT, "findMonster1", this.hasFindMonPos)
            if (this.hasFindMonPos)
            {
                AI.removeAI(AIType.Move);
                AI.removeAI(AIType.Route);
            }
            return true;
        }
        return false;
    }

    protected findMonsterPoint():boolean
    {//Log.trace(Log.FIGHT, "findMonsterPoint0")
        if (this.hasFindMonPos || this.x < 0)
            return false;
        if (this.isArrived == false)
        {
            AI.addAI(AIType.Route, {"mapId":this.mapId, "x": this.x, "y": this.y, "distance": this.distance, "autoFightCtrl":this });Log.trace(Log.FIGHT, "findMonsterPoint1")
            return true;
        }
        return false;
    }

    public get isArrived():boolean
    {
        return this.data == null || PathUtils.isInPixRange(this.x, this.y, this.findMonPosRadius);
    }

    protected isNeedSearch(): boolean
    {
        return this.selectMonster == null || this.selectMonster.isDead() || this.selectMonster != CacheManager.king.leaderEntity.battleObj;
    }

    public getBossCode():number
    {
        return this.bossCode;
    }

    public findTargetToAttack():RpgGameObject
    {
        return CacheManager.map.getNearestMonster(this.searchDis, this.bossCode,this.isForceFindBoss);
    }

    public setUpdateDelay(delay:number):void
    {
        let curTime:number = CacheManager.copy.enterCopyTime;
        if(!curTime) curTime = egret.getTimer();
        this.updateDelay = curTime + delay;
    }

    public getUpdateDelay():number
    {
        return this.updateDelay;
    }
}