/**
 * 技能类型3 - 点到点扇形
 * @author Chris
 */
class SkillPlayer_3 extends BaseSkillPlayer
{
    /**
     * 角度偏移，长度
     */
    private static mathList:Array<any> = [];
    private pos:egret.Point = new egret.Point(0, 0);
    private math:Array<any>;
    private effChildIndex:number;
    private offAngleRatio:number;

    public constructor()
    {
        super();
    }

    public execute()
    {
        if (SkillPlayer_3.mathList[this.listVo.listId] == null)
            SkillPlayer_3.mathList[this.listVo.listId] = SkillPlayer_3.calcList(this.listVo.effectList);
        this.math = SkillPlayer_3.mathList[this.listVo.listId];
        this.effChildIndex = 0;
        this.calcToAngle();
        super.execute();
    }

    protected calcToAngle():void
    {
        super.calcToAngle();
        let toDir:Dir = RpgGameUtils.computeDir8(180 * this.toAngle / Math.PI);
        if (toDir == Dir.Top || toDir == Dir.Bottom) {
            this.offAngleRatio = 1;
        } else if (toDir == Dir.Left || toDir == Dir.Right) {
            this.offAngleRatio = 0.65;
        } else {
            this.offAngleRatio = 0.85;
        }
    }


    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {//console.log("playEffect3---", effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
        let mathData:any = this.math[effectIdx];
        let posAngle:number = this.toAngle + mathData.offAngle * this.offAngleRatio;
        let posDis:number = mathData.dis;
        this.pos.x = this.fromObjPos.x + posDis * Math.cos(posAngle);
        this.pos.y = this.fromObjPos.y + posDis * Math.sin(posAngle);
        let effect:Effect = ObjectPool.pop("Effect");//Log.trace("my="+this.fromObjPos.x, this.fromObjPos.y, "idx="+effectIdx, "pos="+pos.x,pos.y)
        effect.setEffectTarget(this.skillEffectTargetVo);
        effect.playNormalEffect(effectVo.effectId, this.pos, null, this.fromObj, 0, 0, effectVo.layer, 1, 0, this.effChildIndex);
        if (effectIdx == 0 && effect.parent) {//固定添加在第一次添加的层次
            this.effChildIndex = this.toAngle > Math.PI && this.toAngle < 2 * Math.PI ? effect.parent.numChildren-1 : 0;
        }
        this.tryToReset();
    }

    private static calcList(effectList:Array<any>):any[]
    {
        let mathList:Array<any> = [];
        let effectVo:any;
        let angle:number;
        let dis:number;
        let myAngle:number = MathUtils.getPositiveAngle(MathUtils.ZEOR_RADIAN);
        for (let i:number = 0; i < effectList.length; i++)
        {
            effectVo = effectList[i];
            angle = MathUtils.getPositiveAngle(Math.atan2(effectVo.y, effectVo.x));
            dis = Math.sqrt(effectVo.y * effectVo.y + effectVo.x * effectVo.x);
            mathList[i] = {offAngle:angle - myAngle, dis:dis};
        }
        return mathList;
    }
}