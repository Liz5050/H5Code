/**
 * 副本挂机子控制器
 * @author Chris
 */
class AutoFightCopy extends AutoFightNormal implements IAutoFight
{
    protected waitPoint:any;
    public constructor(data:any)
    {
        super();
        this.data = data;
        this.bossCode = data && data.bossCode?data.bossCode:-1;        
        if(this.data && this.data.waitPointX!=null && this.data.waitPointY!=null){
            if(!this.waitPoint){
                this.waitPoint = {};
            } 
            this.waitPoint.x = this.data.waitPointX;
            this.waitPoint.y = this.data.waitPointY;
        }else{
            this.waitPoint = CopyUtils.getWaitPoint(CacheManager.copy.curCopyCode);
        }        
        this.isForceFindBoss = CopyUtils.isFindBossCopy(CacheManager.copy.curCopyCode);
        this.searchDis = -1;
        if(this.waitPoint){ //某些副本玩家在某个点挂机等待怪物进入挂机范围
            this.searchDis = CacheManager.battle.autoBattleSearchDis;            
        }
        if(data && data.searchDis){ //自定义搜索距离
            this.searchDis = data.searchDis;
        }
        
    }

    public update():boolean
    {
        if(this.bossCode>0){
            let isBossDead:boolean = this.selectMonster && this.selectMonster.entityInfo.code_I==this.bossCode && this.selectMonster.isDead();
            let entityInfo:EntityInfo = CacheManager.map.getEntityByBossCode(this.bossCode) as EntityInfo;
            if(isBossDead || !entityInfo || (entityInfo && entityInfo.life_L64<=0)){ //当前选中的boss死了
                this.bossCode = -1;
                if(this.data && this.data.searchDisBossDead){ //搜索某个特定怪，打死后的挂机搜索距离
                    this.searchDis = this.data.searchDisBossDead;
                }
            }
        }
        var flag:boolean = this.findMonster();        
        if(!flag && this.waitPoint && !PathUtils.isInRange(this.waitPoint.x, this.waitPoint.y,0)){
            AI.addAI(AIType.Move,this.waitPoint);
        }
        return flag;
    }

    public updateOnMoving():void
    {
    }

}