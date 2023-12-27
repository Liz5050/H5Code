/*******************
 * 聊天类型
 *******************/
enum EChatType {
	EChatTypeTotal = 0,         //综合频道，后端没有这个类型
	EChatTypeWorld = 1,         //世界
	EChatTypeCamp = 2,             //阵营
	EChatTypePrivate = 4,       //私聊
	EChatTypeTrumpet = 8,        //大喇叭
	EChatTypeShow = 16,        //炫耀
	EChatTypeSpace = 32,        //场景
	EChatTypeTeam = 64,            //队伍
	EChatTypeGuild = 128,        //仙盟
	EChatTypeSystem = 256,        //系统
	EChatTypeRumor = 512,        //传闻
	EChatTypeGuildQuestion = 1024, //仙盟答题
	EChatTypeGroup = 2048,   //组队
	EChatTypeGuildRedPacket = 4096,   //仙盟红包
	EChatTypeBattleFiled = 8192,    //战场
	EChatTypeGuildPrivate = 16384,    //仙盟私聊公告
	EChatTypeVoiceMessage = 32768,    //语音信息
	EChatTypeGuildWar = 65536,    //仙盟战
	EChatTypeGuildRoll = 131072,    //仙盟掷骰子
	EChatTypeArena = 262144,        //竞技场
	EChatTypeMarket = 524288,        //市场
	EChatTypeCrossStair = 1048576,        //修武--24个这个类型暂时被事件，客户端占用了
	EChatTypeSendPos = 2097152,        //发坐标
	EChatTypeForce = 4194304,    // 势力
	EChatTypeCrossEx = 8388608, //服务器定义的跨服
	//以下是客户端自定义
	EChatTypeKF = 10000001,    // 客服 客户端特殊
	EChatTypeCross = 10000002,    // 跨服 客户端特殊


	//无用先暂时删除的聊天类型
	//EChatTypeVCampOne = 1024,    //阵营1（虚拟聊天类型，为了实现刺探挖宝的需求）
	//EChatTypeVCampTwo = 2048,    //阵营2（虚拟聊天类型，为了实现刺探挖宝的需求）
	//EChatTypeVCampThree = 4096,    //阵营3（虚拟聊天类型，为了实现刺探挖宝的需求）
	//EChatTypeCopy        = 32768,    //副本
	//EChatTypePeaceField = 524288,    //和平场景
	//EChatTypeBossSkill = 16777216,        //boss技能广播
	//EChatTypeSworn = 67108864,        //结义群聊
	//EChatTypeCrossTrumpet = 134217728, //跨服喇叭
	//EChatTypeCrossThreeVsThree = 268435456, //3v3聊天
}