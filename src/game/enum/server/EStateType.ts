enum EStateType
{
    EStateLastDamage = 1,              // 持续伤害                  [hurt_effect_type:计算方式ESkillEffectType][hurt_effect_value:伤害百分比+固定值]
    EStateLastRecoverLife = 2,         // 持续恢复生命              [hurt_effect_type:计算方式ESkillEffectType][hurt_effect_value:回血百分比+固定值]
    EStateLastRecoverBlue = 3,         // 持续回蓝
    EStateLastDamageByLife = 4,		// 按生命持续伤害
    EStateLastBeSuck = 5,              // 持续吸血
    EStateLastRecoverInGate = 6,       // 持续回血（Gate）          [hurt_effect_value:回血百分比+固定值]

    EStateFrozen = 10,                 // 冰冻                      [无]
    EStateConfusion = 11,              // 混乱                      [无]
    EStateSleep = 12,                  // 睡眠                      [无]
    EStateGiddiness = 13,              // 眩晕                      [无]
    EStateMock = 14,                   // 嘲讽
    EStateHoldStill = 15,              // 定身                      [无]
    EStateChangeSheep = 16,            // 变羊
    EStateImmuneState = 17,            // 状态免疫                  [state_effect_1:免疫类型EStateEffect]
    EStateInvincible = 18,             // 无敌                      [无]
    EStateBanSkill = 19,               // 禁止使用技能（沉默）      [无]
    EStateCannotAttack = 20,           // 禁止攻击
    EStateSKillCanNotUse = 21,         // 技能不能使用
    EStateCannotBeMove = 22,           // 禁止被移位(被拉、被击退等)[无]

    EStateInOrDePhysicAttack = 31,     // 提升/降低物攻             [state_effect_1:属性百分比+固定值]
    EStateInOrDeLife = 32,             // 提升/降低生命             [state_effect_1:属性百分比+固定值]
    EStateInOrDePass = 33,             // 提升/降低破甲             [state_effect_1:属性百分比+固定值]
    EStateInOrDePhysicDefend = 34,     // 提升/降低物防             [state_effect_1:属性百分比+固定值]
    EStateInOrDeJouk = 35,             // 提升/降低闪避             [state_effect_1:属性百分比+固定值]
    EStateInOrDeHit = 36,              // 提升/降低命中             [state_effect_1:属性百分比+固定值]
    EStateInOrDePhysicCritical = 37,   // 提升/降低物暴             [state_effect_1:属性百分比+固定值]
    EStateInOrDeToughness = 38,        // 提升/降低韧性             [state_effect_1:属性百分比+固定值]
    EStateInOrDeMoveSpeed = 39,        // 提升/降低移动速度         [state_effect_1:属性百分比+固定值]
    EStateInOrDeHatred = 40,			// 提升/降低仇恨             [state_effect_1:属性百分比]
    EStateInOrDeWuxingAttack = 41,     // 提升/降低五行攻击         [state_effect_1:属性百分比+固定值]
    EStateInOrDeWuxingDefense = 42,    // 提升/降低五行防御         [state_effect_1:属性百分比+固定值]
    EStateInOrDeArmorRate = 43,        // 提升/降低护甲             [state_effect_1:属性百分比]
    EStateInOrDeCritDefenseRate = 44,  // 提升/降低暴击抵抗率       [state_effect_1:属性百分比]
    EStateInOrDeKnowingRate = 45,      // 提升/降低会心率           [state_effect_1:属性百分比]
    EStateInOrDeBlockRate = 46,        // 提升/降低格挡率           [state_effect_1:属性百分比]

    EStateInOrDeFightAttack = 50,      // 提升/降低战斗攻击         [state_effect_1:属性百分比+固定值][state_effect_2:自己生命百分比]
    EStateInOrDeFightPass = 51,        // 提升/降低战斗穿透         [state_effect_1:属性百分比+固定值][state_effect_2:自己生命百分比]
    EStateInOrDeFightHit = 52,         // 提升/降低战斗命中         [state_effect_1:属性百分比+固定值][state_effect_2:自己生命百分比]
    EStateInOrDeFightCrit = 53,        // 提升/降低战斗暴击         [state_effect_1:属性百分比+固定值][state_effect_2:自己生命百分比]
    EStateInOrDeOutPutDamage = 54,     // 提升/降低输出伤害         [state_effect_1:伤害百分比+固定值][state_effect_2:目标生命百分比]
    EStateInOrDeSufferDamage = 55,     // 提升/降低受到伤害         [state_effect_1:伤害百分比+固定值][state_effect_2:自己生命百分比]
    EStateInOrDeOutPutCritDamage = 56, // 提升/降低输出暴击伤害     [state_effect_1:暴击百分比][state_effect_2:目标生命百分比]
    EStateInOrDeSufferCritDamage = 57, // 提升/降低受到暴击伤害     [state_effect_1:暴击百分比][state_effect_2:自己生命百分比]
    EStateInOrDeCritRate = 58,         // 提升/降低暴击率           [state_effect_1:暴击率(百分比)][state_effect_2:目标需要拥有的状态类型]
    EStateInOrDePvpArmorRate = 59,     // 提升/降低PVP护甲          [state_effect_1:属性百分比]
    EStateInOrDeCure = 60,             // 提升/降低治疗量
    EStateInOrDeDrug = 61,             // 提升/降低药品恢复
    EStateInOrDeSufferFixDamage = 62,  // 提升/降低受到固定伤害     [state_effect_1:伤害百分比+固定值]
    EStateInOrDePvpCritRate = 63,      // 提升/降低PVP暴击率        [state_effect_1:暴击率(百分比)][state_effect_2:自己生命百分比][state_effect_3:目标生命百分比]
    EStateInOrDePvpJoukRate = 64,      // 提升/降低PVP闪避率        [state_effect_1:闪避率(百分比)][state_effect_2:自己生命百分比][state_effect_3:目标生命百分比]
    EStateInOrDePvpSufferDamage = 65,  // 提升/降低PVP受到伤害      [state_effect_1:伤害百分比+固定值]
    EStateInOrDeSkillHurt = 66,        // 提升/降低技能伤害         [state_effect_1:伤害百分比][state_effect_2:受多少怪物攻击][state_effect_3:自己生命百分比]
    EStateInOrDeBossMapOutPut = 67,    // 提升/降低BOSS地图输出伤害 [state_effect_1:伤害百分比+固定值]
    EStateInOrDeOutPutRageDamage = 68, // 提升/降低输出暴怒伤害     [state_effect_1:伤害百分比+固定值][state_effect_2:目标需要拥有的状态类型][state_effect_3:目标需要拥有的状态ID][state_effect_pvp:PVP伤害百分比+固定值]
    EStateInOrDePvpOutPutDamage = 69,  // 提升/降低PVP输出伤害      [state_effect_1:伤害百分比+固定值][state_effect_2:自己需要拥有的状态类型][state_effect_3:自己需要拥有的状态ID]
    EStateInOrDeJoukRate = 70,         // 提升/降低闪避率           [state_effect_1:闪避率(百分比)]

    EStateDamageSuck = 71,             // 伤害吸收(魔法盾)          [state_effect_1:吸收百分比+固定值]                               [state_effect_3:自己需要拥有的状态ID]
    EStateDamageRebound = 72,          // 伤害反弹                  [state_effect_1:反弹百分比+固定值][state_effect_2:自己生命百分比][state_effect_3:自己需要拥有的状态ID]
    EStateDamageReflex = 73,           // 伤害反射
    EStateDamageToCure = 74,           // 伤害转治疗
    EStateDamageSuckBlood = 75,        // 吸血                      [state_effect_1:吸血百分比+固定值][state_effect_2:自己生命百分比]
    EStateDamageHurtBack = 76,         // 反击
    EStateDamageCrit = 77,             // 必出暴击                  [无]
    EStateDamagePvpCureRebound = 78,   // PVP回血反弹               [state_effect_1:回血百分比+固定值][state_effect_2:反弹百分比+固定值]

    EStateMoreExperience = 81,         // 杀怪经验加成              [state_effect_1:经验加成百分比]
    EStateMoreExp = 82,				// 多倍经验丹
    EStateGuildFlameWine = 83,			// 仙盟篝火多倍经验酒
    EStateWorldLevel = 84,             // 世界等级 经验加成状态（客户端显示用）
    EStateMoreCoin = 85,               // 杀怪金币加成              [state_effect_1:金币加成百分比]
    EStateDropItemRateSelf = 86,       // 增加怪物自身物品掉率      [state_effect_1:掉落加成万分比]
    EStateMaxSufferDamage	= 87,		// 受到最大伤害百分比		 [state_effect_2:自己生命百分比]
    EStateSufferDamageEnd	= 88,		// 受到至生命%x为止		 	 [state_effect_1:自己生命百分比]
    EStateLifeShield		= 89,		// 生命护盾		 			 [state_effect_1:自己生命百分比]

    EStateLightring = 91,				// 光环                      [state_effect_1:加的状态id][state_effect_2:目标类型]
    EStateReState	= 92,				// 受击对方添加buff
    EStateLastSkill = 93,				// 持续使用技能              [state_effect_1:技能id]

    EStateHiding = 101,                // 隐身
    EStateRevival = 102,				// 复活
    EStateWeddingCandy = 103,			// 婚礼喜糖
    EStateFly = 104,					// 飞行
    EStateUseSkill	= 105,				// 技能读条
    EStateEnergy = 106,                // 体力值
    EStateRedName = 107,               // 红名(客户端显示用)
    EStateReduceSkillCd = 108,         // 减技能CD                  [state_effect_1:技能ID][state_effect_2:减少毫秒数]
    EStateNoPvpKillHurt = 109,         // PVP不受致命伤害（不屈）   [无]
    EStateReduceBufferCd = 110,        // 减Buffer CD               [state_effect_1:Buffer ID][state_effect_2:减少毫秒数]
    EStateReduceSkillCdPer = 111,      // 减所有主动技能CD（不含普攻）[state_effect_2:减少百分比]

    EStateShapeAttribute = 121,        // 天赋技能提升化形属性      [state_effect_1:化形类型][state_effect_2:触发的化形/化形等级][state_effect_3:属性百分比]
    EStateWeaponAttack = 122,          // 天赋技能提升武器攻击      [state_effect_1:属性百分比]
    EStateArmorLife = 123,             // 天赋技能提升防具生命      [state_effect_1:属性百分比]
    EStateOneBeastAttribute = 124,     // 提升当前助战神兽属性      [state_effect_1:属性类型][state_effect_2:属性百分比]
    EStateAllBeastAttribute = 125,     // 提升所有助战神兽属性      [state_effect_1:属性类型][state_effect_2:属性百分比]
    EStateDropRate = 126,  //提升掉落概率  [state_effect_1:百分比]
    EStateShapeOneAttribute = 127,     // 天赋技能提升化形单一属性  [state_effect_1:化形类型][state_effect_2:属性类型][state_effect_3:属性百分比]
    EStateWeaponAttribute = 128,       // 天赋技能提升武器属性      [state_effect_1:属性百分比]
    EStateArmorAttribute = 129,        // 天赋技能提升防具属性      [state_effect_1:属性百分比]
    EStateJewelryAttribute = 130,      // 天赋技能提升仙器属性      [state_effect_1:属性百分比]
    EStateStrengthenAttribute = 131,   // 天赋技能提升强化属性      [state_effect_1:属性百分比]
    EStateJewelAttribute = 132,        // 天赋技能提升宝石属性      [state_effect_1:属性百分比]
    EStateSuitAttribute = 133,         // 天赋技能提升套装属性      [state_effect_1:属性百分比]

    EStateInOrDeSkillRelief = 201,     // 提升/降低技能减伤         [state_effect_1:免伤百分比][state_effect_3:自己生命百分比]
}