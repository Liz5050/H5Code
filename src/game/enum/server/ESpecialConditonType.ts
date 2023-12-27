//特殊活动条件类型
enum ESpecialConditonType
{
	ESpecialConditonTypeRoleSuit = 1,               //角色身上套装
	ESpecialConditonTypeRoleEquipColorAndNum = 2,      //角色身上装备颜色与件数
	ESpecialConditonTypeRandPetSkill = 3,               //刷忆魂石奖励
	ESpecialConditonTypeMountAdvance = 4,            //坐骑进阶（港澳版本需求）
	ESpecialConditonTypeEquipStrengthen = 5,         //装备强化（港澳版本需求）
	ESpecialConditonTypeShopBuy = 6,               //商城购买（港澳版本需求）
	ESpecialConditonTypeWedding = 7,               //庆典婚礼
	ESpecialConditonTypeRootTargetShow = 8,            //根骨目标展示（结合普通活动的根骨目标）
	ESpecialConditonTypeEquipPerfectStrengLvAndNum = 9,         //角色装备完美强化等级和件数(多个目标可同时领取)
	ESpecialConditonTypeEmbedJewelLevelAndNum = 10,            //镶嵌宝石等级和件数(多个目标可同时领取)
	ESpecialConditonTypeEquipRefreshAttrAndStarNum = 11,         //角色装备洗炼属性和星个数(多个目标可同时领取)
	ESpecialConditonTypePetGrowthValue = 12,           //宠物成长值(多个目标可同时领取)
	ESpecialConditonTypePetSpiritValue = 13,           //宠物灵性值(多个目标可同时领取)
	ESpecialConditonTypeAcupointLevelAndNum = 14,      //经脉等级和数量(多个目标可同时领取)
	ESpecialConditonTypeRoleEquipColorAndNumEx = 15,   //角色身上装备颜色与件数(多个目标可同时领取)
	ESpecialConditonTypeRoleSuitEx = 16,               //角色身上四象装备颜色与件数(多个目标可同时领取)
	
	//------ 新活动 ------
	ESpecialConditonTypeCollectItem = 100,             //物品收集活动(全服次数控制)
	ESpecialConditonTypeMgRechargeOnce = 101,          //充值领奖（领取一次）手动领 (严格限制只配一档)
	ESpecialConditonTypeLogin = 102,									  //登陆有礼
	ESpecialConditonTypeExchangeItem = 103,            //物品收集活动（个人每天次数控制）
	ESpecialConditonTypeMoreExp = 104,                 //活动标签显示用（实际用EActiveTypeMoreExp控制）
	ESpecialConditonTypeRankConsume = 105,             //消费排行
	ESpecialConditonTypeActivity = 106,            		//活跃度活动
	ESpecialConditonTypeBuyProp = 107,                 //购买道具
	ESpecialConditonTypeSmelt = 108,                 	//活动合成
	ESpecialConditonTypeMgConsume = 109,               //消费有礼
	ESpecialConditonTypeSeckill = 110,                 //秒杀
	ESpecialConditonTypeCopyReward = 111,              //副本双倍
	ESpecialConditonTypeMgRecharge = 112,          		//累计礼包
	ESpecialConditonTypeRankCharm = 113,               //魅力值排行
	ESpecialConditonTypeRankCharmFemale = 114,         //魅力值排行(女榜)
	ESpecialConditonTypeMarry = 115,        						//结婚有礼活动
	ESpecialConditonTypeLoginVIP = 116,                //登陆有礼
	ESpecialConditonTypePanicBuy = 117,               //限时抢购
	ESpecialConditonTypeBuffer = 118,                  //给buff
	ESpecialConditonTypeInvestEx = 119,                //投资
	ESpecialConditonTypeMagpie = 120,                  //鹊桥
	ESpecialConditionTypePreferentialGift = 121,		//特惠礼包
	ESpecialConditonTypeRechargeCondDayCount = 122,        //连续充值（其实不是连续，是在xx天内累计充值yy天，每天充值达zz条件）
	ESpecialConditonTypeRechargeDayReturn = 123,        //累计充值（天天返利活动，独立功能）
	ESpecialConditonTypeBossTask = 124,                 //全民 boss （使用原来的天书寻主中 boss 页的独立功能）
	ESpecialConditonTypeRechargeToday = 125,            //每日累充（只做显示）
	ESpecialConditonTypeToplistActiveOpen = 126,            //开服冲榜（只做显示）
	ESpecialConditonTypeReachGoal = 127,            //开服达标
	ESpecialConditonTypeVipGiftPackage = 128,           //Vip 礼包（长期和限时）
	ESpecialConditonTypeComposeRecharge = 129,          //累冲返利（复合累冲活动，独立功能）
	ESpecialConditonTypeComposeRechargeEx = 130,          //连充返利（复合累冲天数活动，独立功能）
	ESpecialConditonTypeBossExtraDrop = 131,          //Boss 额外掉落活动（Boss 献礼活动，独立功能）
	ESpecialConditionTypeNewServerLimitBuy = 170,		//开服限购
	ESpecialConditionTypeLevelReward	= 171,		    //等级礼包（同时只开一个）
	ESpecialConditionTypeBossScore = 172,          //积分兑换
	ESPecialConditionTypeParadiesLost = 173,       //失乐园
	ESpecialConditionTypeSpiritSports = 174,       //法宝竞技
	ESpecialConditionTypeMgNewGuildWar = 175,		   //仙盟争霸
	ESpecialConditionTypeInvestPlan = 176,             //投资计划
	ESpecialConditionTypeRechargeGroup = 177,             //充值团购
	ESpecialConditionTypeFlashRecharge = 178,          //限时充值
	ESpecialConditionTypePreferentialGiftNormal = 179,//特惠礼包（暖冬福利活动）

	
	//------ 合服活动 ------
	ESpecialConditonTypeInvest = 500,              //投资
	ESpecialConditonTypeLuckRotary = 501,          //幸运转盘
	ESpecialConditonTypeActivityMerge = 502,       //合服活跃度活动 
	ESpecialConditonTypeMgRechargeMerge = 503,      //合服充值有礼  
	ESpecialConditonTypeMgConsumeMerge = 504,       //消费有礼
	ESpecialConditonTypeGuildPromotion1 = 505,      //合服仙盟争霸1
	ESpecialConditonTypeGuildPromotion2 = 506,      //合服仙盟争霸2	
	ESpecialConditonTypeSeckillMerge = 508,         //合服秒杀
		

	ESpecialConditonTypeFristRecharge = 1000,          //首次充值（领取一次）
	ESpecialConditonTypeOnceRecharge = 1001,           //单次充值（领取多次）
	ESpecialConditonTypeCountRecharge = 1002,          //累计充值（领取一次）邮件发送
	ESpecialConditonTypeCountRechargeMore = 1003,      //累计充值（领取多次）
	ESpecialConditonTypeFristExplore40 = 2000,         //首次抽40仙境（领取一次）
	ESpecialConditonTypeFristExplore60 = 2001,         //首次抽60仙境（领取一次）
	ESpecialConditonTypeOnceExplore = 2002,            //单次抽仙境（领取多次）
	ESpecialConditonTypeCountExplore40 = 2003,         //累计抽40仙境（领取一次）
	ESpecialConditonTypeCountExplore60 = 2004,         //累计抽60仙境（领取一次）
	ESpecialConditonTypeCountExploreMore = 2005,       //累计抽仙境（领取多次）
	ESpecialConditonTypeCountExploreRepeat = 2006,     //累计抽仙境（重复领取） 
	
	//--------显示用的活动----------- 
	ESpecialConditonTypeShowDrop = 5000,           //掉落活动
	ESpecialConditonTypeShowCloudBuy = 5001,       //云购
	ESpecialConditonTypeShowPeaceField = 5002,     //战场之魂
	ESpecialConditonTypeShowShopSeckill = 5003,     //秒杀
	ESpecialConditonTypeShowBossActive = 5004,     //BOSS来袭
	ESpecialConditonTypeShowLotteryTreasure = 5005,//鉴宝
	ESpecialConditonTypeShowLuckyStick = 5006,      //上上签
	ESpecialConditonTypeFireworkProp = 5007,        //烟花道具活动
	ESpecialConditonTypeShowCrossToplistCharm = 5008, //跨服魅力排行
	
	ESpecialConditonTypeShowIcon = 10000,     //活动图标显示
	
	ESpecialConditonTypeTopListBase = 100000,         //排行榜起始（10w以上的特殊活动都是排行榜活动）         
}