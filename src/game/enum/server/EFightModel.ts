enum EFightModel
{
	EFightModelFree				= 0,		// 自由模式(不限制PK)
	EFightModelTeam				= 1,		// 组队模式(不可以攻击队友)
	EFightModelGuild			= 2,		// 仙盟模式(不可以攻击仙盟成员)
	EFightModelCamp				= 4,		// 阵营模式(不可以攻击本阵营玩家)
	EFightModelCampUnion		= 8,		// 阵营联盟(不可以攻击联盟阵营玩家)
	EFightModelGuildUnion		= 16,		// 仙盟联盟(不可以攻击联盟仙盟玩家)
	EFightModelForce			= 32,		// 势力(不可以攻击同势力玩家)
	EFightModelServer			= 64,		// 服务器（不可以攻击同服玩家）
	EFightModelPeace			= 128,		// 全阵型和平模式 （不可攻击玩家）
	EFightModelTarget			= 256,		// 目标模式（只可攻击选定目标，此模式下客户端每个技能都要传目标id过来）
};