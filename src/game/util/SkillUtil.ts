class SkillUtil {
    public constructor() {
    }

    /**
     * 是否为主动技能
     */
    public static isActiveSkill(skill: any): boolean {
        return SkillUtil.getUseType(skill) == ESkillUseType.ESkillUseTypeInitiative;
    }

    /**
     * 是否为普通攻击
     */
    public static isNormalSkill(skill: any): boolean {
        return skill.skillType == ESkillType.ESkillTypeNormal;
    }

    /**
     * 使用类型
     */
    public static getUseType(skill: any): number {
        if (skill && skill.useType != null) {
            return skill.useType;
        }
        return 0;
    }

    public static chooseSkill(roleIndex:number, battleObj: RpgGameObject, rule: EBattleSkillRule): number {
        let skills: Array<SkillData> = CacheManager.skill.getBattleSkills(roleIndex);
        if (skills == null || battleObj == null) {
            return 0;
        }
        let chooseId:number = 0;
        let rangeTargets:RpgGameObject[];
        if (rule == EBattleSkillRule.RULE1) {
            let radius:number = CacheManager.battle.getSkillRule1Radius(CacheManager.role.getRoleCareerByIndex(roleIndex));
            let forceObjType:RpgObjectType = battleObj.objType == RpgObjectType.Monster ? RpgObjectType.Monster : null;
            rangeTargets = CacheManager.map.getTargetsSortByDis(roleIndex, radius, forceObjType);
        }
        let skillData: SkillData;
        let skillId: number;
        let goalSingle: boolean;
        for (skillData of skills) {
            skillId = skillData.skillId;
            if (skillId == SkillCache.SKILLID_XP) {
                continue;
            }
            if (rule == EBattleSkillRule.RULE1
                && (skillId / 1000 > 9 || skillId % 1000 != 1)//无视普攻
                && skillData.targetType != ESkillTargetType.ESkillTargetTypeSelfWeak) {//无视加血技能
                goalSingle = skillData.isGoalSingle;
                if ((rangeTargets.length > 1 && goalSingle) || (rangeTargets.length <= 1 && !goalSingle)) {//大于1使用群体,小于等于1使用单体
                    continue;
                }
            }
            if (EntityUtil.checkEntityIsCanAttackBySkill(battleObj, skillId)) {
                chooseId = skillId;
                break;
            }
        }
        return chooseId;
    }

    /**
     * 播放技能特效
     */
    public static playSkill(skillId: number, fromObj: RpgGameObject, toObj: RpgGameObject, toObjList: Array<RpgGameObject>, targetPointX: number, targetPointY: number): void {
        // if (App.DeviceUtils.AppInBackground) return;//最小化时其实已经停帧
        if (!fromObj || !CacheManager.map.isMapRendering || ControllerManager.scene.sceneState != SceneStateEnum.AllReady) {
            return;
        }
        if (skillId == SkillCache.SKILLID_XP && UIManager.isOpenModule()) {//打开模块时不渲染全屏技能
            return;
        }
        let skillData: any;
        let effectListIds: number[];
        if (skillId > 0) {
            skillData = ConfigManager.skill.getSkill(skillId);
            effectListIds = ConfigManager.skill.getSkillEffects(skillId)
        }
        let effectListId:number;
        if (effectListIds) {
            for (let i:number=0;i < effectListIds.length;i++) {//一个技能可能对应多个特效表现
                effectListId = effectListIds[i];
                let effectListVo: EffectListData = ConfigManager.effectList.getVo(effectListId, i);//技能到特效组映射
                if (effectListVo) {
                    if (effectListVo.effectList.length <= 0) return;//配了特效又不填表现，可能是暂时屏蔽该特效
                    let effectType: number = effectListVo.effectType;
                    let player: ISkillPlayer = ObjectPool.pop("SkillPlayer_" + effectType);
                    player.play(skillId, effectListVo, fromObj, toObj, toObjList, targetPointX, targetPointY);
                }
            }
        } else {
            SkillUtil.playSkillSound(skillData, fromObj, 100);
            SkillUtil.playSkillName(skillData, fromObj);
        }

    }

    /**
     * 播放技能声音
     */
    public static playSkillSound(skillData: any, fromObj: RpgGameObject, delay: number = 100): void {
        if (fromObj
            && fromObj.entityInfo
            && EntityUtil.isMainPlayerOther(fromObj.entityInfo.entityId) >= 0
            && skillData != null && skillData.sound)
        {
            let rate: number = 1;
            if (skillData.skillId != SkillCache.SKILLID_XP) {
                if (CacheManager.role.roles.length == 2) {
                    rate = 0.5;
                }
                else if (CacheManager.role.roles.length == 3) {
                    rate = 0.3;
                }
            }
            if (Math.random() > rate) return;
            egret.setTimeout(() => {
                App.SoundManager.playSkill(skillData.sound);
            }, this, delay);
        }
    }

    /**
     * 播放技能名字
     */
    public static playSkillName(skillData: any, fromObj: RpgGameObject): void {
        if (fromObj
            && fromObj.entityInfo
            && EntityUtil.isMainPlayerOther(fromObj.entityInfo.entityId) >= 0
            && skillData) {
            if (skillData.skillId != SkillCache.SKILLID_XP) {
                if (skillData.skillTalk != 1) return;
                SkillUtil.entityTalk(fromObj, skillData.skillName);
            } else if (fromObj.isLeaderRole) {
                if (BaseSkillPlayer.xpSkillName == null)
                    BaseSkillPlayer.xpSkillName = new BattleXPSkillNameItem;
                let item: BattleXPSkillNameItem = BaseSkillPlayer.xpSkillName;
                item.play(skillData.skillId, LayerManager.UI_XP_SKILL_UP);
            }
        }
    }

    /**
     * 播放buff名字
     */
    public static playBuffName(stateData: any, fromObj: RpgGameObject): void {
        if (fromObj
            && fromObj.entityInfo
            && EntityUtil.isMainPlayerOther(fromObj.entityInfo.entityId) >= 0
            && stateData && stateData.stateTalk == 1) {
            SkillUtil.entityTalk(fromObj, stateData.name);
        }
    }

    public static entityTalk(fromObj: RpgGameObject, content: string): void {
        if (!fromObj || !fromObj.entityInfo || !content) return;
        let baseCareer: number = CareerUtil.getBaseCareer(fromObj.entityInfo.career_SH);
        content = HtmlUtil.html(content, Color["CAREER_COLOR_" + baseCareer]);
        fromObj.talk(content);
    }
}