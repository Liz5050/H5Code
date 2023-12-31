//vip福利类型
enum EVipAddType
{
	EVipAddTypeBossExp = 1,                    //打怪经验加成
	EVipAddTypeZazenExp = 2,                //修炼经验加成
	EVipAddTypeDazanExp = 3,                //与VIP玩家双修时经验加成
	EVipAddTypeTeamLeaderExp = 4,            //队长是VIP玩家时经验加成
	EVipAddTypeOfflineExp = 5,                //离线经验加成
	EVipAddTypeTransportExp = 6,            //护送灵兽经验加成
	EVipAddTypeGuildTaskExp = 7,            //仙盟任务经验加成
	EVipAddTypeTrumpets = 21,                //免费大喇叭个数
	EVipAddTypeShoes = 22,                    //免费飞鞋个数
	EVipAddTypeEnterCopy = 23,                //免费进入副本次数
	EVipAddTypeRevive = 24,                    //免费复活次数
	EVipAddTypeBagCapacity = 25,            //免费背包容量个数
	EVipAddTypeBlessTime = 26,                //VIP祝福时间（分钟）
	EVipAddTypeBlessAdd = 27,                //VIP祝福加点（人物基础属性）
	EVipAddTypeBlessBuffer = 28,            //VIP祝福状态组组编号
	EVipAddTypeTransportTaskTimes = 29,        //免费运镖刷星次数
	EVipAddTypeLoopBookTaskTimes = 30,        //免费循环任务刷星次数
	EVipAddTypeFirstUseReward = 31,            //首次使用赠送物品code
	EVipAddTypeWeekendReward = 33,            //周六日送铜钱
	EVipAddTypeDrugChangeCode = 34,            //每天领取变身丸ID
	EVipAddTypeDrugChangeNum = 35,            //每天领取变身丸数量
	EVipAddTypeLoginReward = 36,            //每天登陆送元宝
	EVipAddTypeActiveLoginReward = 37,        //VIP活动礼包
	EVipAddTypeActiveLoginRewardEx = 38,    //新服VIP登陆礼包
	EVipAddTypePetRefreshRate = 51,            //宠物洗炼成功率加成
	EVipAddTypePetStrengthRate = 52,        //宠物强化成功率加成
	EVipAddTypeRechargeBack = 53,            //充值返还绑定元宝（每10元宝）
	EVipAddTypeBattleField = 54,            //战场荣誉加成
	EVipAddTypeNewBattleFieldHonour = 55,    //跨服战场荣誉加成
	EVipAddTypeLoveFlushCount = 56,            //情缘任务免费刷新次数
	EVipAddTypeSavvyUpgradeRate = 57,        //提升悟性成功率加成
	EVipAddTypePetUpgradeSpiritTimes = 60,    //宠物灵性提升免费次数
	EVipAddTypePetUpgradeGrowthTimes = 61,    //宠物成长提升免费次数
	EVipAddTypeMoneyTreeTotalTimes = 62,    //每日摇钱树次数增加
	EVipAddTypeMoneyTreeFreeTimes = 63,        //每日摇钱树免费次数增加
	EVipAddTypeFarmDisPlayer = 64,            //霸气仙园
	EVipAddTypeFarmPetNum = 65,                //每日宠物蛋领取数量增加
	EVipAddTypeAutoStarFortune = 66,        //一键寻仙
	EVipAddTypePetUpgradeGrowthBatch = 67,    //宠物成长批量
	EVipAddTypePetUpgradeSpiritBatch = 68,    //宠物灵性批量
	EVipAddTypeShopTreasureBuyTimes    = 69,    //秘境商店购买次数
	EVipAddTypeStarFortuneCallTimes = 70,    //仙命召唤次数
	EVipAddTypeFarmOneKeyGains = 80,        //一键收获
	EVipAddTypeUpgradeRoot        = 81,        //根骨提升概率加成
	EVipAddTypeFashionWing        = 82,        //翅膀时装提升概率加成
	EVipAddTypeNimbusTreeTimes    = 83,   //每日聚灵次数增加
	EVipAddTypeAcupointCoolDownForFree = 84,  //元神提升领取免费
	EVipAddTypeHangUp = 85,                   //vip挂机特权
	EVipAddMirrorBattle = 86,                 //跨服封神竞技VIP
	
	//---------新类型定义------------
	EVipAddOpenHole = 101,					// 开启特定宝石孔（温志华）
	EVipAddFreeConvey = 102,				// 免费小飞鞋（温志华）
	EVipAddBossExperience = 103,			// 杀怪经验加成
	EVipAddBuff = 105,						// BUFF加成
	EVipAddGuildTaskAuto = 106,				// 自动进行仙盟任务
	EVipAddTitle = 107,						// 专属称号
	EVipAddMarketTax = 108,					// 市场交易税（温志华）
	EVipAddSwallowEquip = 109,              // 宠物经验吞噬加成
	EVipAddPrayNum = 110,                   // 祈福次数加成
	EVipAddManHuangCopyNum = 111,           // 蛮荒圣地副本进入次数加成
	EVipAddCloudBuy = 112,					// 云购次数加成
	EVipAddShenJiCopyNum = 113,				// 上古神迹副本进入次数加成
	EVipAddShenJiTire = 114,				// 上古神迹副本最大疲劳值
	EVipAddBagCapacity = 115,         		// 背包格子数开启
	EVipAddPersonalBossCopyNum = 117,		// 个人boss副本进入次数加成
	EVipAddMaterialCopyNum = 118,           //材料副本进入次数加成
	EVipAddNewExperienceCopyNum = 119,      //新经验副本进入次数加成
	EVipAddNewWorldBossCopyNum = 120,       //世界boss进入次数加成
	EVipAddSecretBossCopyNum = 121,         //秘境boss进入次数加成
	EVipAddChatTab = 122, 
	EVipAddTypeRefreshNewWorldBoss = 123,	//野外boss刷新次数
}