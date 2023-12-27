enum ESkillUseType
{
	ESkillUseTypeInitiative = 0,          // 主动
	ESkillUseTypeBeAttacked = 1,          // 被攻击触发
	ESkillUseTypeToAttack   = 2,          // 攻击触发
	ESkillUseTypeLifeLess   = 4,          // 生命少于%触发            [use_type_param:生命百分比]
	ESkillUseTypeDie        = 8,          // 死亡触发                 [use_type_param:全部相同的怪死亡触发]
	ESkillUseTypeLearn      = 16,         // 学习后马上触发
	ESkillUseTypeAddBuffer  = 32,         // 添加Buffer触发           [use_type_param:类型EStateEffect]
	ESkillUseTypeRemoveBufferId = 64,     // 移除BufferId触发         [use_type_param:Buffer的id]
	ESkillUseTypePvpCrit    = 128,        // PVP暴击触发
	ESkillUseTypePvpJouk    = 256,        // PVP闪避触发              [use_type_param:生命百分比]
	ESkillUseTypeUseSkill   = 512,        // 使用技能触发             [use_type_param:技能的id]
	ESkillUseTypePvpKillHurt = 1024,      // PVP受致命伤害触发
	ESkillUseTypePvpBeAttacked = 2048,    // PVP被攻击触发            [use_type_param:生命百分比]
};