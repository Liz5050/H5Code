/**
 * 技能类型5 - 多个点连接特效
 * @author Chris
 */
class SkillPlayer_5 extends BaseSkillPlayer
{
    static TYPE_FABAO:number = 1;
    static TYPE_PLAYER:number = 2;

    public constructor()
    {
        super();
    }

    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {//console.log("playEffect5---", effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
        let startPoint:egret.Point;
        if (this.fromObj)
        {
            if (effectVo.type == SkillPlayer_5.TYPE_FABAO) {
                this.fromObj.spiritPlayAttack();
                startPoint = this.fromObj.spiritPos.add(this.fromObj.pixPoint);
            } else {
                startPoint = this.fromObjPos.add(new egret.Point(effectVo.x||0, effectVo.y||0));
            }
        }
        else
        {
            startPoint = this.fromObjPos;
        }
        if (this.toObjList && this.toObjList.length)
        {
            let effect:Effect;
            let startObj:RpgGameObject = this.fromObj;
            let target:RpgGameObject;
            let linkPoint:egret.Point;
            for (target of this.toObjList)
            {
                if (target && target.entityInfo)
                {
                    linkPoint = target.bodyHeartPos.add(target.pixPoint);//Log.trace(Log.FIGHT, `bodyHeartPos=${target.bodyHeartPos.x},${target.bodyHeartPos.y}`)
                    effect = ObjectPool.pop("Effect");
                    effect.setEffectTarget(this.skillEffectTargetVo);
                    effect.playStretchEffect(effectVo.effectId, startPoint, linkPoint, startObj, effectVo.layer);
                    effect = ObjectPool.pop("Effect");
                    effect.setEffectTarget(this.skillEffectTargetVo);
                    effect.playNormalEffect(306010012, startPoint, startPoint, startObj, 0, 0, effectVo.layer);
                    startPoint = linkPoint;
                    startObj = target;
                }
            }
        }
        this.tryToReset();
    }
}