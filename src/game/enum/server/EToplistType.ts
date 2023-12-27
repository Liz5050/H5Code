/*******************
* 排行榜类型 以后废弃类型新增过来记得删除注释
*******************/
enum EToplistType
{
	EToplistTypePlayerLevel            = 101,    // 个人等级排行
	EToplistTypePlayerFight         = 102,    // 个人战力排行
	EToplistTypePlayerPrestige    = 103,    // 个人声望排行--（废弃）
	EToplistTypePlayerPetFight    = 104,    // 宠物战力排行--（废弃）
	EToplistTypePlayerFightCareer1 = 105,    // 战士战力排行
	EToplistTypePlayerFightCareer2 = 106,    // 法师战力排行
	EToplistTypePlayerFightCareer3 = 107,    // 道士战力排行
	EToplistTypePlayerFightCareer4 = 108,    // 天机战力排行--（废弃）
	EToplistTypePlayerTotalJewelOpen = 109, 	//开服-个人宝石等级和
	EToplistTypePlayerRechargeOpen = 110,		//开服-个人充值排行
	EToplistTypePlayerLevelOpen = 111, 			//开服-个人等级排行
	EToplistTypePlayerFightOpen = 112,			//开服-个人战力排行
	EToplistTypeShapeMountOpen = 113,			//开服-外形坐骑排行
	EToplistTypeShapePetOpen = 114,				//开服-外形宠物排行

	//新增冲榜排行活动类型 2018年7月19日21:27:38 lizhi
	EToplistTypeStrengthenExCastOpen = 115, 	//开服-铸造总等级排行
	EToplistTypeStrengthenExDragonSoulOpen = 116,		//开服-龙鳞甲总等阶排行
	EToplistTypeStrengthenExWingOpen = 117, 			//开服-翅膀总等阶排行
	EToplistTypeHandbookOpen = 118,			//开服-图鉴总战力排行//没用
	EToplistTypeIllustrated   = 2017, //  图鉴战力排行榜
	EToplistTypeRoleStateOpen = 119,			//开服-转生等级排行
	EToplistTypeTotalEquipScoreOpen = 120,				//开服-装备总评分排行
	EToplistTypeStrengthenExNerveOpen = 121,				//开服-经脉总等级排行
	/**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

	EToplistTypeGuildLevel            = 201,    // 仙盟等级排行
	EToplistTypeGuildBloom            = 202,    // 仙盟繁荣度排行--（废弃）
	EToplistTypeGuildAsset            = 203,    // 仙盟资产排行--（废弃）
	EToplistTypeGuildWarCredit    = 204,    // 仙盟战积分排行--（废弃）
	EToplistTypeGuildDefence    = 205,    //仙盟防守排行--（废弃）
	EToplistTypeCreditLoopTask    = 301,    // 循环任务积分排行--（废弃）
	EToplistTypeCreditKillBoss    = 302,    // 杀怪积分排行--（废弃）
	EToplistTypeCreditTransport    = 303,    // 运镖积分排行--（废弃）
	EToplistTypeCreditCopy            = 304,    // 副本积分排行--（废弃）
	EToplistTypeCreditArena            = 305,    // 竞技积分排行--（废弃）
	EToplistTypeCreditBattleField    = 306,// 战场积分排行--（废弃）
	EToplistTypeCreditServerBattle= 307,// 服战积分排行--（废弃）
	EToplistTypeBattleFieldWeekHonor = 401, //战场--周荣誉排行--（废弃）
	EToplistTypeBattleFieldKillPlayer = 402, //战场--杀人排行--（废弃）
	EToplistTypeBattleFieldKillMonster = 403, //战场--杀怪排行--（废弃）
	EToplistTypeBattleFieldEvenCut = 404, //战场--连斩排行--（废弃）
	EToplistTypeFlowerWeekProtect = 501,    //每周护花榜--（废弃）
	EToplistTypeFlowerWeek = 502,    //每周鲜花榜--（废弃）
	EToplistTypeFlowerProtect = 503,    //护花榜--（废弃）
	EToplistTypeFlower = 504,    //鲜花榜--（废弃）
	EToplistTypeFlowerLastWeekProtect = 505,  //上周护花榜--（废弃）
	EToplistTypeFlowerLastWeek = 506,    //上周鲜花榜--（废弃）
	EToplistTypeFlowerDailyProtect = 507,    //每日护花榜--（废弃）
	EToplistTypeFlowerDaily = 508,        //每日鲜花榜--（废弃）
	EToplistTypeCopyMagicTower = 601,    //爬塔副本(诛仙阵)--（废弃）
	ETopListTypeCopyTowerSixty = 602,    //诛神阵--（废弃）
	EToplistTypeAcupoint = 701,            //经脉排行--（废弃）
	EToplistTypeRoot = 702,                //根骨排行--（废弃）
	EToplistTypeSavvy = 703,            //悟性排行--（废弃）
	EToplistTypePetTalent = 801,        //宠物资质排行--（废弃）
	EToplistTypePetGrowth = 802,        //宠物成长排行--（废弃）
	EToplistTypePetSpirit = 803,        //宠物灵性排行--（废弃）
	EToplistTypePetIllusion = 804,  //宠物幻化排行--（废弃）
	EToplistTypeGuildWarPlayerMerits = 901,      // 仙盟战--玩家战功排行--（废弃）
	EToplistTypeGuildWarGuildMark = 902,         // 仙盟战--仙盟积分排行--（废弃）
	EToplistTypeGuildWarGuildMarkWeek = 903,     // 仙盟战--仙盟周积分排行--（废弃）
	EToplistTypeCopyCoinEvenCut = 1001,        //女娲秘境-- 连斩榜单--（废弃）
	EToplistTypeCopyCoinMoney = 1002,        //女娲秘境-- 铜钱榜单（铜钱副本排行）--（废弃）
	EToplistTypeArenaMark = 1003,         //竞技场积分榜--（废弃）
	EToplistTypeLastArenaMark = 1004,         //上周竞技场积分榜--（废弃）
	EToplistTypeWeaponScore = 1010,        //武器排行榜--（废弃）
	EToplistTypeJewelryScore = 1011,    //饰品排行榜--（废弃）
	EToplistTypeArmorScore = 1012,        //装备排行榜(八件套)--（废弃）
	EToplistTypeWuXingFight = 1101,        //五行战力排行榜--（废弃）
	EToplistTypeWuXingAttributeMax = 1102,        //五行改命排行榜--（废弃）
	EToplistTypeWuXingEnergy = 1103,    //五行灵力排行榜--（废弃）
	EToplistTypeLoadDays = 1201,        //累计登陆排行榜--（废弃）
	EToplisttypeAchievement = 1301,        //成就排行--（废弃）
	EToplistTypePlayerVipLevel = 1400,        //玩家VIP等级排行--（废弃）
	EToplistTypeMyth = 1401,        //封神榜排行--（废弃）
	EToplistTypeMount = 1501,            //    坐骑排行--（废弃）
	EToplistTypeCutMoney = 1502,  // 天降 横财排行--（废弃）
	EToplistTypeFeudalHegemony    = 1503,   //皇帝争霸--（废弃）
	EToplistTypeCatastrophe = 1601,        //个人排行（渡劫排行）--（废弃）
	EToplistTypeShapeMount    = 2001,        //外形排行榜--坐骑
	EToplistTypeShapePet        = 2002,        //外形排行榜--宠物
	EToplistTypeShapeMagic    = 2003,        //外形排行榜--神兵
	EToplistTypeShapeWing        = 2004,        //外形排行榜--翅膀
	EToplistTypeShapeLaw        = 2005,        //外形排行榜--战阵--（废弃）
	EToplistTypeShapeSpirit    = 2006,        //外形排行榜--法宝
	EToplistTypeShapeSoul        = 2007,        //外形排行榜--龙魂--（废弃）
	EToplistTypeOfflineWorkExpEffect = 2008,  //离线挂机效率排行
	EToplistTypeCopyMgRune = 2009,  //诛仙塔排行
	EToplistTypeAchievementPoint = 2010,  //成就点排行
	EToplistTypeCharmMan = 2011, //跨服魅力每日排行（男）
	EToplistTypeCharmWomanMan = 2012, //跨服魅力每日排行（女）
	EToplistTypeShapeMantle   = 2013, //  外形排行榜--披风
	EToplistTypeLord   = 2014, //  爵位排行榜--爵位
	EToplistTypeMedal   = 2015, //  勋章排行榜--勋章
	// EToplistTypeEncounter   = 2016, //  杀戮榜排行榜--遭遇战
	EClientToplistTypeEncounter = 2016,//客户端自定义排行榜类型
	ETopListTypeQiongCangDreamland = 2018, //穹苍幻境排行榜
	EToplistTypeShapeSwordPool = 2019,  //外形排行榜--剑池
	EToplistTypeShapeBattle = 2020, //外形排行榜--战阵		
	
	EToplistTypeCrossBase = 100000,            //跨服排行榜base

};