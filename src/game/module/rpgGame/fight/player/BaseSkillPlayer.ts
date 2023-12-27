/**
 * 技能播放基类
 * @author Chris
 */
class BaseSkillPlayer implements ISkillPlayer
{
    /*** 使用池*/
    private static POOL:Array<BaseSkillPlayer> = [];
    /*** 技能名字*/
    public static xpSkillName:BattleXPSkillNameItem;
    /*** 技能背景*/
    private static xpBgMask: SceneMaskEffect;
    /*** 技能名字*/
    private static skillName:BattleSkillNameItem;
    /*** 技能特效类型*/
    private effectType:number;

    protected timeList:Array<number> = [];

    private hasReset:boolean;
    protected skillId:number;
    protected skillVo:any;
    protected listVo:EffectListData;
    protected listLen:number;
    protected fromObj:RpgGameObject;
    protected fromObjPos:egret.Point = new egret.Point(0, 0);
    protected toObj:RpgGameObject;
    protected toObjPos:egret.Point = new egret.Point(0, 0);
    protected toObjList:Array<RpgGameObject>;
    protected effectPlayCount:number=0;
    protected attackerIsLeaderRole:boolean;
    protected attackerIsRole:boolean;
    protected toAngle:number=0;
    protected skillEffectTargetVo:EffectTargetVo;
    protected toObjPosDis:number = 1;

    public constructor()
    {
    }

    public play(skillId:number, listVo:EffectListData, fromObj:RpgGameObject, toObj:RpgGameObject, toObjList:Array<RpgGameObject>, targetPointX:number, targetPointY:number):void
    {
        this.hasReset = false;
        this.skillId = skillId;
        this.skillVo = ConfigManager.skill.getSkill(skillId);
        this.effectType = listVo.effectType;
        if (BaseSkillPlayer.POOL.indexOf(this) == -1)
        {
            BaseSkillPlayer.POOL.push(this);
        }
        this.listVo = listVo;
        this.listLen = listVo.effectList.length;
        this.fromObj = fromObj;
        this.attackerIsLeaderRole = fromObj && fromObj.isLeaderRole;
        this.attackerIsRole = fromObj && fromObj.entityInfo && EntityUtil.isMainPlayerOther(fromObj.entityInfo.entityId) >= 0;
        if (this.fromObj)
        {
            this.fromObjPos.x = this.fromObj.x;
            this.fromObjPos.y = this.fromObj.y;
        }
        this.toObj = toObj;
        this.toObjList = toObjList;

        this.makeToObjPos(fromObj, targetPointX, targetPointY);
        this.addSkillEffectTarget(this.fromObj&&this.fromObj.entityInfo);

        this.playSkillName();
        this.playSkillSound();
        this.playSkillBg();
        this.shake();
        if (this.fromObj && (this.attackerIsLeaderRole || this.fromObj.getInCamera()) && this.canSkillMap())
            this.execute();
        else
            this.reset();
    }

    protected setTimeout(callFunc:Function, delay:number, ...args):void
    {
        let params:Array<any> = [callFunc, this, delay, ...args];
        let timeId:number = egret.setTimeout.apply(this, params);
        this.timeList.push(timeId);
    }

    /**
     * 执行特效播放
     */
    public execute():void
    {
        let effectList:Array<any> = this.listVo.effectList;
        let effectVo:any;
        for (let i:number = 0; i < effectList.length; i++)
        {
            effectVo = effectList[i];//console.log("!!!!!!!!!!!execute---", this.skillId, effectVo.effectId, CacheManager.map.mapId, CacheManager.copy.isInCopy)
            if (effectVo.delay > 0)
            {
                this.setTimeout(this.playEffect, effectVo.delay, effectVo, this.listVo.effectPos, i);
            }
            else
            {
                this.playEffect(effectVo, this.listVo.effectPos, i);
            }
        }
    }

    /**
     * 计算目标点
     */
    protected makeToObjPos(fromObj:RpgGameObject, targetPointX:number, targetPointY:number):void {
        if (this.toObj)
        {
            this.toObjPos = RpgGameUtils.convertCellToXY(this.toObj.gridPoint.x, this.toObj.gridPoint.y, this.toObjPos);
        }
        else if (fromObj && (fromObj.col == targetPointX && fromObj.row == targetPointY || (targetPointX == 0 && targetPointY == 0)))
        {
            let sP:any = RpgGameUtils.getToDirCell(fromObj.sPoint, fromObj.dir, this.toObjPosDis);
            this.toObjPos = RpgGameUtils.convertCellToXY(sP.x_SH, sP.y_SH, this.toObjPos);
        }
        else
        {
            this.toObjPos = RpgGameUtils.convertCellToXY(targetPointX, targetPointY, this.toObjPos);
        }
    }

    /**
     * 播放特效
     */
    public playEffect(effectVo:any, effectPosType:number, effectIdx:number):void
    {
    }

    /**
     * 震屏
     */
    protected shake():void
    {
        let shakes:any[] = this.listVo.shakes;
        if (this.attackerIsLeaderRole && shakes && CacheManager.map.isMapRendering)
        {
            let delay:number;
            let shakeType:number;
            for (let shakeVo of shakes) {
                delay = shakeVo.delay;
                shakeType = shakeVo.type;
                if (shakeType == ShakeConst.TYPE_DIR_SHAKE) {
                    this.calcToAngle();
                }
                App.ShakeUtils.shakeScene(delay, shakeType, 1, shakeVo, this.toAngle);
            }
        }
    }

    protected calcToAngle():void
    {
        if (this.toAngle == 0)
        {
            this.toAngle = MathUtils.getPositiveAngle(Math.atan2((this.toObjPos.y - this.fromObjPos.y), (this.toObjPos.x - this.fromObjPos.x)));
        }
    }

    /**
     * 播放技能名称
     */
    private playSkillName():void
    {
        if (this.attackerIsRole && this.fromObj.avatar)
        {
            SkillUtil.playSkillName(this.skillVo, this.fromObj);
        }
    }

    private playSkillSound():void
    {
        if (!this.listVo.isDependent) {
            let effectList:Array<any> = this.listVo.effectList;
            let effectVo0:any = effectList[0];
            SkillUtil.playSkillSound(this.skillVo, this.fromObj, effectVo0?effectVo0.delay:100);
        }
    }

    private playSkillBg():void
    {
        if (this.skillId == SkillCache.SKILLID_XP)
        {
            if (!BaseSkillPlayer.xpBgMask)
            {
                BaseSkillPlayer.xpBgMask = new SceneMaskEffect();
            }
            BaseSkillPlayer.xpBgMask.xpSkillShow();
        }
    }

    private canSkillMap():boolean
    {
        return this.attackerIsLeaderRole || (this.skillId != SkillCache.SKILLID_XP || !CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint));
    }

    private addSkillEffectTarget(entityInfo:any):void
    {
        this.skillEffectTargetVo = new EffectTargetVo(EffectTargetVo.TYPE_SKILL, entityInfo);
        CacheManager.effect.addEffect(this.skillEffectTargetVo);
    }

    private removeSkillEffectTarget():void
    {
        this.skillEffectTargetVo.playEnd();
        this.skillEffectTargetVo = null;
    }

    protected tryToReset()
    {
        this.effectPlayCount++;
        if (this.effectPlayCount == this.listLen)
        {
            this.reset();
        }
    }

    public reset():void
    {
        if (this.hasReset)
            return;
        while (this.timeList.length > 0)
        {
            egret.clearTimeout(this.timeList.pop());
        }
        this.hasReset = true;
        let idx:number = BaseSkillPlayer.POOL.indexOf(this);
        if (idx != -1)
        {
            BaseSkillPlayer.POOL.splice(idx, 1);
        }
        this.skillId = 0;
        this.listVo = null;
        this.listLen = 0;
        this.fromObj = null;
        this.fromObjPos.x = this.fromObjPos.y = 0;
        this.toObj = null;
        this.toObjPos.x = this.toObjPos.y = 0;
        this.toObjList = null;
        this.effectPlayCount = 0;
        this.attackerIsLeaderRole = false;
		this.attackerIsRole = false;
        this.toAngle = 0;
		this.removeSkillEffectTarget();
        ObjectPool.push(this);
    }

    public getEffectType():number
    {
        return this.effectType;
    }

    public static disposeAll():void
    {
        while (BaseSkillPlayer.POOL.length > 0)
        {
            BaseSkillPlayer.POOL.pop().reset();
        }
        BaseSkillPlayer.xpBgMask && BaseSkillPlayer.xpBgMask.hide();
    }
}