/**
 * 特效作用目标
 * @author chris
 */
class EffectTargetVo
{
    public static TYPE_SKILL:number = 0;

    public effectType:number = 0;
    public targetInfo:any;
    public targetId:string;
    public targetType:EEntityType;
    public isKing:boolean;

    public effectCount:number = 0;
    public isComp:boolean = false;

    public constructor(effectType:number, targetInfo:any)
    {
        this.effectType = effectType;
        this.targetInfo = targetInfo;
        if (targetInfo)
        {
            this.targetId = targetInfo.id;
            this.targetType = targetInfo.type;
            this.isKing = EntityUtil.isMainPlayerOther(targetInfo.entityId) >= 0;
        }
    }

    public play():void
    {
        this.effectCount++;
    }

    /**
     * 特效播放完成
     */
    public playComp():void
    {
        this.effectCount--;
        if (this.isComp && this.effectCount <= 0)
            CacheManager.effect.removeEffect(this);
    }

    /**
     * 特效组播放结束
     */
    public playEnd():void
    {
        this.isComp = true;
        if (this.isComp && this.effectCount <= 0)
            CacheManager.effect.removeEffect(this);
    }

    public allComp():void
    {
        CacheManager.effect.removeEffect(this);
    }

    public get isBoss():boolean
    {
        return EntityUtil.isBoss(this.targetInfo);
    }
}