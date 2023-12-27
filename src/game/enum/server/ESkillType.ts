//技能类型
enum ESkillType
{
	ESkillTypeDirectDamage = 1,            // 直接伤害          [无]
	ESkillTypeComboDamage = 2,             // 连续伤害
	ESkillTypeSplitDamage = 3,             // 分裂伤害
	ESkillTypeChainDamage = 4,             // 连环伤害
	ESkillTypeRageDamage = 5,              // 陨爆伤害          [special_effect_1:附加伤害百分比+固定值][special_effect_2:目标需要拥有的状态类型]
	ESkillTypeKillDamage = 6,              // 斩杀              [special_effect_1:斩杀概率百分比][special_effect_2:目标需要拥有的状态ID][special_effect_3:目标最大血量百分比]
	
	ESkillTypeAppendState = 11,            // 附加状态          [addition_state:状态]
	ESkillTypeProfessionalism = 12,        // 职业特性          [addition_state:状态]
	ESkillTypeRemoveException = 13,        // 移除异常
	ESkillTypeBreakUp = 14,                // 驱散              [special_effect_1:BUFFER等级][special_effect_2:BUFFER数量][special_effect_3:BUFFER类型]
	ESkillTypeSwitchBuff = 15,				// 切状态组
	
	ESkillTypeMarry = 28,					// 仙侣技能
	ESkillTypeNormal = 29,                 // 普通攻击
	
	ESkillTypeCure = 31,                   // 治疗              [hurt_effect_type:计算方式ESkillEffectType][hurt_effect_value:回血百分比+固定值]
	ESkillTypeRecoverBlue = 32,            // 回蓝
	ESkillTypeSuckBlood = 33,              // 吸血
	ESkillTypeAttackRecoverLife = 34,      // 攻击恢复生命
	ESkillTypeSuckBlue = 35,               // 吸蓝
	ESkillTypeBurnBlue = 36,               // 烧蓝
	ESkillTypeShareLife = 37,              // 分血液
	
	ESKillTypeBeatBack = 51,               // 击退              [special_effect_1:击退距离][special_effect_2:击退坐标计算方式]
	ESkillTypeRushForward = 52,            // 冲锋
	ESkillTypePull = 53,                   // 拉人              [无]
	ESKillTypeTransfer = 54,               // 传送
	
	ESKillTypeSummon = 62,                 // 召唤(刷怪方案)    [special_effect_1:刷怪方案plan]
	ESkillTypeSummonBoss = 63,				// 召唤(单个怪物)    [special_effect_1:小怪code][special_effect_2:攻击力百分比+固定值][goal_num:小怪数量][pos_select:小怪位置类型][pos_select_detail:小怪位置配置]
	ESkillTypeCopyBody = 64,               // 分身
	ESkillTypeChangeBody = 65,             // 变身
	
	ESkillTypeSelfDestruction = 81,        // 自爆              [range:爆炸范围半径]
	ESkillTypeBlew	= 82,					// 自爆(自己先死)
	ESKillTypeCheatDeath = 83,             // 诈尸
	ESkillTypeRecoverLife = 84,            // 复活
	ESkillTypeBewilder = 85,				// 迷惑
	ESkillTypePunch = 91,        			// 合击
};