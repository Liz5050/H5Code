/**
 * 技能类型4 - 点到点直线飞行
 * @author Chris
 */
class SkillPlayer_4 extends BaseSkillPlayer
{
    private realToPos:egret.Point = new egret.Point(0, 0);
    private realFromPos:egret.Point = new egret.Point(0, 0);

    public constructor()
    {
        super();
        this.toObjPosDis = 4;
    }

    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {//console.log("playEffect4---", effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
        if (effectVo.move)
        {
            let moveEffect:MoveEffect = ObjectPool.pop("MoveEffect");
            if (effectPosType == EffectPosEnum.PosStart)
            {
                this.realToPos.x = this.realToPos.y = 0;
                if (effectVo.layer < EffectLayerEnum.LayerObjUp)
                {
                    this.realFromPos.x = this.fromObjPos.x + effectVo.x;
                    this.realFromPos.y = this.fromObjPos.y + effectVo.y;
                    this.realToPos.x = effectVo.move.to[0] + this.fromObjPos.x;
                    this.realToPos.y = effectVo.move.to[1] + this.fromObjPos.y;
                }
                else
                {
                    this.realFromPos.x = this.realFromPos.y = 0;
                    this.realToPos.x = effectVo.move.to[0];
                    this.realToPos.y = effectVo.move.to[1];
                }
            }
            else
            {
                this.realFromPos.x = this.fromObjPos.x + effectVo.x;
                this.realFromPos.y = this.fromObjPos.y + effectVo.y;
                this.realToPos.x = this.toObjPos.x// + effectVo.x;//下面再做目标高度偏移
                this.realToPos.y = this.toObjPos.y// + effectVo.y;
            }
            moveEffect.setEffectTarget(this.skillEffectTargetVo);
            if (this.toObj && !effectVo.move.noObjHeight) {//目标高度偏移
                this.realToPos.x = this.realToPos.x + this.toObj.bodyHeartPos.x;
                this.realToPos.y = this.realToPos.y + this.toObj.bodyHeartPos.y;
            }
            moveEffect.movePointToPoint(effectVo.effectId, this.realFromPos, this.realToPos, this.toObj, effectVo.layer, 0, effectVo.move);
        }
        else
        {
            let effect:Effect = ObjectPool.pop("Effect");
            effect.setEffectTarget(this.skillEffectTargetVo);
            effect.playNormalEffect(effectVo.effectId, this.fromObjPos, this.toObjPos, this.fromObj, effectVo.x, effectVo.y, effectVo.layer, effectPosType);
        }
        this.tryToReset();
    }

}