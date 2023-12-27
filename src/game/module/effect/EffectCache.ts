/**
 * 特效
 */
class EffectCache implements ICache
{
    /** 玩家技能播放最大个数*/
    private static COUNT_SKILL_EFFECT_OTHER_PLAYER:number = 6;
    /** 怪物技能播放最大个数*/
    private static COUNT_SKILL_EFFECT_MONSTER:number = 3;

    private skill_list_other_player:Array<EffectTargetVo> = [];
    private skill_list_monster:Array<EffectTargetVo> = [];

    public constructor()
    {
    }

    public addEffect(effectTargetVo:EffectTargetVo):void
    {
        if (effectTargetVo.isKing)
            return;
        // Log.trace(Log.FIGHT, "addEffect:", effectTargetVo.targetType)
        switch (effectTargetVo.targetType)
        {
            case EEntityType.EEntityTypePlayer:
            case EEntityType.EEntityTypePet:
                if (this.skill_list_other_player.length < EffectCache.COUNT_SKILL_EFFECT_OTHER_PLAYER)
                    this.skill_list_other_player.push(effectTargetVo);
                break;
            default:
                if (this.skill_list_monster.length < EffectCache.COUNT_SKILL_EFFECT_MONSTER)
                    this.skill_list_monster.push(effectTargetVo);
                break;
        }
    }

    public removeEffect(effectTargetVo:EffectTargetVo):void
    {
        let list:Array<EffectTargetVo> = this.getList(effectTargetVo.targetType);
        let idx:number = list.indexOf(effectTargetVo);
        if (idx != -1) list.splice(idx, 1);
        // Log.trace(Log.FIGHT, "removeEffect:", effectTargetVo.targetType, idx)
    }

    private getList(entityType:EEntityType):Array<EffectTargetVo>
    {
        let list:Array<EffectTargetVo>;
        switch (entityType)
        {
            case EEntityType.EEntityTypePlayer:
            case EEntityType.EEntityTypePet:
                list = this.skill_list_other_player;
                break;
            default:
                list = this.skill_list_monster;
                break;
        }
        return list;
    }

    public canPlayEffect(effectTargetVo:EffectTargetVo):boolean
    {
        if(CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideEffect])) {
            return false;
        }
        if (effectTargetVo == null || effectTargetVo.isKing || effectTargetVo.isBoss)
            return true;
        if (effectTargetVo == null || effectTargetVo.targetType == EEntityType.EEntityTypePlayer || effectTargetVo.targetType == EEntityType.EEntityTypePet)
        {//判断屏蔽
            if (CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther])
                || CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOtherEffect]))
            {
                return false;
            }
        }

        let list:Array<EffectTargetVo> = this.getList(effectTargetVo.targetType);
        return list.indexOf(effectTargetVo) != -1;
    }

    public log():void
    {
        Log.trace(Log.FIGHT, `特效播放控制=p${this.skill_list_other_player.length},m${this.skill_list_monster.length}`);
    }

    public clear():void
    {
    }
}