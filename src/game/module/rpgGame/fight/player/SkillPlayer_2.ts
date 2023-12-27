/**
 * 技能类型2 - 点到点直线
 * @author Chris
 */
class SkillPlayer_2 extends BaseSkillPlayer
{
    public constructor()
    {
        super();
    }

    public execute()
    {
        this.calcToAngle();
        super.execute();
    }

    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {//console.log("playEffect2---", effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
        let effect:Effect = ObjectPool.pop("Effect");
        effect.setEffectTarget(this.skillEffectTargetVo);
        effect.playPoint2PointEffect(effectVo.effectId, this.fromObjPos, this.toObjPos, this.fromObj, effectVo.x, effectVo.y, effectVo.layer, effectVo.x, effectVo.y, this.toAngle, effectVo.layerSet);
        this.tryToReset();
    }

}