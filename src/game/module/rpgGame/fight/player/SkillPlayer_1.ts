/**
 * 技能类型1 - 固定点播放
 * @author Chris
 */
class SkillPlayer_1 extends BaseSkillPlayer
{
    public constructor()
    {
        super();
    }

    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {//console.log("playEffect1---", effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
        let effect:Effect = ObjectPool.pop("Effect");
        effect.setEffectTarget(this.skillEffectTargetVo);
        effect.playNormalEffect(effectVo.effectId, this.fromObjPos, this.toObjPos, this.fromObj, effectVo.x, effectVo.y, effectVo.layer, effectPosType);
        this.tryToReset();
    }
}