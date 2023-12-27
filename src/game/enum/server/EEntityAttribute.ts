enum EEntityAttribute {
	//玩家相关
	EAttributeGateChannelId = 0, //网关频道ID
	EAttributeServerId = 1,      //服务器组ID 在跨服中使用
	EAttributeCellId = 2,        //CELL ID
	EAttributePlayerId = 3,      //玩家ID
	EAttributeUsername = 4,      //账号名字
	EAttributeSex = 5,           //性别 ESex
	EAttributeType = 6,          //类型 EEntityType
	EAttributeCode = 7,          //编码
	EAttributeName = 8,          //名字
	EAttributeTitles = 9,        //称号
	EAttributeCamp = 10,         //阵营 ECamp
	EAttributeAvatar = 11,       //头像
	EAttributeSpaceId = 12,      //地图ID
	EAttributePointX = 13,       //玩家位置
	EAttributePointY = 14,       //玩家位置
	EAttributeGrowth = 15,       //灵根
	EAttributeRoleId = 16,       //角色ID
	EAttributeLevel = 17,        //等级
	EAttributeCareer = 18,       //职业 ECareer
	EAttributeExperience = 20,   //经验
	EAttributeExperienceAdd = 21,       //经验增加
	EAttributeFightMode = 22,           //战斗模式
	EAttributeFightModeCdSecond = 23,   //战斗模式
	EAttributeExperienceDel = 24,         //减少经验
	EAttributeStatus = 25,              //状态
	EAttributeFighting = 26,            //战斗状态 0:非战斗状态 1:战斗状态
	EAttributeUpdatePositionReason = 27,//更新位置原因
	EAttributeGroupStatus = 28,         //组队状态 ::Message::BroadCast::EGroupStatus
	EAttributeDirection = 29,           //方向
	EAttributeGrowthPower = 30,         //力量灵根
	EAttributeGrowthAgile = 31,         //敏捷灵根
	EAttributeGrowthHabitus = 32,      //体质灵根
	EAttributeGrowthBrains = 33,      //智力灵根
	EAttributeGrowthSpiritual = 34,      //精神灵根
	EAttributeGuild = 35,                  // 仙盟
	EAttributeVIPType = 36,             //VIP类型
	EAttributeGuildLevel = 37,         //仙盟等级
	EAttributeGuildPosition = 38,      //仙盟职位
	EAttributeExperienceDelay = 39,      //防守副本经验
	EAttributeExperienceAddDelay = 40,   //增加经验(防守副本)
	EAttributeCharm = 41,            //魅力值
	EAttributeNewEnergy = 42,         //新精力值
	EAttributeNewEnergyAdd = 43,      //增加新精力值(+)
	EAttributeNewEnergyMax = 44,      //新精力值上限
	EAttributeTodayFlowerExperience = 45,   //当天鲜花经验
	EAttributePixelX = 46,              //像素坐标X
	EAttributePixelY = 47,              //像素坐标Y

	//装备相关
	EAttributeHalo = 48,         // -- 时装气息
	EAttributeTrack = 49,         // -- 时装足迹
	EAttributeWeapon = 50,         //武器
	EAttributeHelmet = 51,         //头盔
	EAttributeClothes = 52,         //衣服
	EAttributeShapePet = 53,      //外形宠物
	EAttributeShapeMagic = 54,      //外形神兵
	EAttributeShapeSpirit = 55,      //外形法宝
	EAttributeShapeLaw = 56,      //外形阵法
	EAttributeShapeSoul = 57,      //外形龙魂
	EAttributeFashion = 58,         //时装
	EAttributeMounts = 59,         //坐骑


	//称号相关
	EAttributeTitleMain = 60,      //主称号
	EAttributeTitleSecond = 61,    //附加称号
	EAttributeTalk = 62,           //对话属性

	//装备相关
	EAttributeModel = 63,         //人物模型（幻化丹）
	EAttributeNotShowFashion = 64,   //屏蔽时装
	EAttributeWeaponStrengthenPrefectLevel = 65,  //武器强化完美等级
	EAttributeWing = 66,   //翅膀
	EAttributeWingStrengthenPrefectLevel = 67,  //翅膀强化完美等级
	EAttributeNotShowWing = 68,   //屏蔽翅膀

	//CD时间相关
	EAttributeAttackCd = 70,       //普通攻击CD
	EAttributeSkillPublicCd = 71,  //技能公共CD
	EAttributeAttackCdDt = 72,     //普通攻击CD时间
	EAttributeSkillPublicCdDt = 73,//技能公共CD时间


	//装备相关
	EAttributeNotShowFashionHalo = 75,       // -- 屏蔽时装气息
	EAttributeNotShowFashionTrack = 76,       // -- 屏蔽时装足迹
	EAttributeNotShowFashionWeapon = 77,   //屏蔽武器时装  
	EAttributeNotShowTitle = 78,      //屏蔽称号显示  
	EAttributeNotShowPetTitle = 79,      //屏蔽宠物称号显示

	// 宠物相关
	EAttributePetStatus = 80,         // 宠物状态
	EAttributePetExperience = 81,   // 宠物经验
	EAttributePetLevel = 82,         // 宠物等级
	EAttributePetLifespan = 83,      // 宠物寿命
	EAttributePetEnergy = 84,         // 宠物精力
	EAttributeTalent = 85,         //宠物-资质，护送、镖车-品质
	EAttributeModelId = 86,         //宠物模型
	EAttributePetGrowth = 87,      // 宠物成长
	EAttributePetSpirit = 88,      // 宠物灵性
	EAttributePetAttrExperience = 89,   //宠物灵性属性经验

	//技能BUFF相关
	EAttributeSkillCd = 90,        //技能CD时间更新
	EAttributeBufferCd = 91,       //状态CD时间更新

	//坐骑相关
	EAttributeMountStrengthenLevel = 95,   //坐骑等阶

	//宠物闯关头像(也可以作为其他头像更新属性)
	EAttributeAvatarCode = 96,   //幻化宠物头像

	EAttributeExperienceAddKillBoss = 97, //杀怪增加经验（客户端展现用的一个特殊功能）-wzh

	EAttributeSpirit = 99,   //精灵（小天使、小恶魔）

	//战斗相关
	EAttributeLife = 100,           //生命
	EAttributeMana = 101,           //魔法
	EAttributeSpeed = 102,          //速度
	EAttributePhysicalAttack = 103, //物理攻击
	EAttributeMagicAttack = 104,    //魔法攻击
	EAttributePower = 105,          //力量
	EAttributeAgile = 106,          //敏捷
	EAttributeHabitus = 107,        //体质
	EAttributeBrains = 108,         //智力
	EAttributeSpiritual = 109,      //精神
	EAttributeMaxLife = 110,        //最大生命
	EAttributeMaxMana = 111,        //最大法力
	EAttributePhysicalHurt = 112,   //物理伤害
	EAttributeMagicHurt = 113,      //法伤
	EAttributePhysicalDefense = 114,//物理防御
	EAttributeMagicDefense = 115,   //物理防御
	EAttributePhysicalRelief = 116, //物免
	EAttributeMagicRelief = 117,    //法免
	EAttributeRelief = 118,         //全免
	EAttributeHit = 119,            //命中
	EAttributeJouk = 120,           //闪避
	EAttributePass = 121,           //穿透
	EAttributeBlock = 122,          //格挡
	EAttributePhysicalCrit = 123,   //物爆
	EAttributeMagicCrit = 124,      //法爆
	EAttributeSpeededUp = 125,      //急速
	EAttributeToughness = 126,      //韧性
	EAttributeAttackSpeed = 127,    //攻击速度
	EAttributeAttackDistance = 128, //攻击距离
	EAttributeWuxingType = 129,      //五行类型
	EAttributeMaxLifeShield = 130,  //最大生命护盾 更新的value 放在SAttributeUpdate : valueStr
	EAttributeLifeShield = 131,     //已破生命护盾 更新的value 放在SAttributeUpdate : valueStr

	EAttributeLifeAdd = 150,        //血量增加
	EAttributeManaAdd = 151,        //法力增加

	EAttributeWarfare = 152,      //战斗力
	EAttributeMaxWarfare = 153,      //历史最高战斗力

	//金钱相关
	EAttributeCoin = 200,           //铜钱
	EAttributeCoinBind = 201,       //绑定铜钱
	EAttributeGold = 202,           //金币
	EAttributeGoldBind = 203,       //绑定金币
	EAttributeHonour = 204,         //荣誉
	EAttributeArena = 205,          //竞技场金券
	EAttributePrestige = 206,       //声望
	EAttributePoint = 207,             //礼券
	EAttributeCopyScore = 208,      //副本积分
	EAttributeEnergy = 209,         //精力值
	EAttributeNimbus = 210,         //灵气值
	EAttributeAccumulation = 211,   //聚气值
	EAttributeInterHonour = 212,   //跨服荣誉
	EAttributeWuxingEnergyValue = 213,  //五行值
	EAttributePetCoin = 214,         //珍兽币
	EAttributeMagicStone = 215,         //魔石（远古竞技场）
	EAttributeMerit = 216,             //功勋（远古竞技场）
	EAttributeBrokenSoul = 217,         //破碎元神
	EAttributeIntegralOne = 218,      //龙宫币
	EAttributeIntegralTwo = 219,      //天宫币

	//增加金钱
	EAttributeCoinAdd = 220,        //铜钱+
	EAttributeCoinBindAdd = 221,    //绑定铜钱+
	EAttributeGoldAdd = 222,        //金币+
	EAttributeGoldBindAdd = 223,    //绑定金币+
	EAttributeHonourAdd = 224,      //荣誉+
	EAttributeArenaAdd = 225,       //竞技场金券+
	EAttributePrestigeAdd = 226,    //声望+
	EAttributePointAdd = 227,          //礼券+
	EAttributeCopyScoreAdd = 228,   //副本积分+
	EAttributeEnergyAdd = 229,      //精力值+
	EAttributeContributionAdd = 230, //仙盟贡献+
	EAttributeNimbusAdd = 231,      //灵气值+
	EAttributeInterHonourAdd = 232,   //跨服荣誉+   
	EAttributeStarFortunePurple = 233, //星运碎片
	EAttributeMythScore = 234,         //封神榜积分
	EAttributePurpleFortune = 235,      //紫色命力
	EAttributeGoldFortune = 236,      //金色命力
	EAttributeOrangeFortune = 237,         //橙色全力

	EAttributeSwordPoolExp = 238,   //剑池经验
	EAttributeSwordPoolExpAdd = 239, //增加剑池经验

	//增加物品
	EAttributeItemAdd = 240,  //增加物品

	EAttributeSwordPool = 241, //剑池

	EAttributeWarehouseAdd = 242, //仙盟仓库积分+

	EAttributeLotteryScore = 243,  //宝藏寻宝积分
	EAttributeRuneExp = 244,   //符文经验+
	EAttributeRuneCoin = 245,  //符文碎片+
	EAttributeSoulExp = 246,   //灵魂经验
	EAttributeSoulStone = 247, //灵魂石
	EAttributeRuneCrystal = 248,	//符文魔晶

	//外形屏蔽相关
	EAttributeNotShowShapePet = 250,      //屏蔽外形宠物
	EAttributeNotShowShapeMagic = 251,      //屏蔽外形神兵
	EAttributeNotShowShapeSpirit = 252,      //屏蔽外形法宝
	EAttributeNotShowShapeSoul = 254,      //屏蔽外形龙魂
	EAttributeNotShowSwordPool = 255,      //屏蔽剑池模型

	//战斗相关
	EAttributeAttackType = 300,     //攻击类型EAttackType
	EAttributeAttackSkill = 301,    //攻击技能0表示没有技能 有技能
	EAttributeWuxing = 304,         //五行攻击 
	EAttributeWuxingValue = 305,    //五行攻击数值

	EAttributeHurtType = 310,       //伤害类型EHurtType
	EAttributeHurt = 311,           //伤害数据

	EAttributeKillBoss = 320,       //杀死怪物
	EAttributeBuffer = 321,       //BUFF更新

	EAttributeNotNeedBeginFight = 322, //不需要 BeginFight
	EAttributeEscertStep = 323, //护送步数
	EAttributeCopySuccess = 324, //副本成功 value副本ID
	EAttributeCopyFail = 325, //副本失败
	EAttributeCloseCopy = 326, //副本关闭 value副本ID
	EAttributeCopyProcess = 327, //副本进度
	EAttributeCopyProcessMax = 328, //副本进度最大值

	EAttributeStall = 340,   //摆摊
	EAttributeRecharge = 341,   //充值

	EAttributeKillTransportTimes = 350,   //劫镖（灵兽抢夺）次数

	EAttributeAction = 360,   //行为（位运算：跑商|刺探|...）

	EAttributeFriendIntimate = 370,  //好友亲密度

	EAttributeFavoriteGame = 380,   //收藏游戏

	EAttributeArenaMarkWeek = 390,  //竞技场周积分

	// 监控相关
	EAttributeMoniterTalk = 400,   //禁言
	EAttributeMoniterLock = 401,   //封号
	EAttributeMoniterKickout = 402,   //踢人

	// 仙盟相关
	EAttributeGuildContribution = 420,  //仙盟贡献
	EAttributeGuildMoney = 421,  //仙盟资源
	EAttributeGuildReiki = 422,  //仙盟灵气值
	EAttributeGuildTreeRipeTime = 423,  //仙盟灵气树成熟剩余时间（秒）
	EAttributeGuildTreeWorm = 424,  //仙盟灵气树虫子
	EAttributeGuildReikiDel = 425,  //仙盟灵气值 -
	EAttributeGuildSkillLearnTimes = 426,  //仙盟个人技能学习次数
	EAttributeWarehouse = 427,	//仙盟仓库积分

	//好友相关
	EAttributeOneKeyMakeFriends = 430,   //一键征友
	EAttributeFriendCanRemoveNum = 431, //当天还能删除好友数
	EAttributeForceUpdate = 432,   // 更新势力
	EAttributeFriendType = 433,   //好友类型

	//成就
	EAttributeFinishCopy = 440,			// 完成某个副本（已弃用）
	EAttributeFinishWedding = 441,		// 完成婚礼相关（已弃用）
	EAttributeBattleWinCamp = 442,		// 战场胜利    （已弃用）
	EAttributeAchievementProcess = 443,	// 成就进度更新

	//勋章
	EAttributeMedal = 460,  //勋章

	//双职业
	EAttributeCareerSecond = 470,      //第二职业
	EAttributeCareerEnable = 471,      //当前启用职业

	//占星系统
	EAttributeStarFortuneLevel = 475,   //可以占星等级
	EAttributeStarFortune = 476,      //占星界面的星运
	EAttributeBadStarFortune = 477,      //卖掉的厄运
	EAttributeCallNPCTimes = 478,      //召唤仙命次数

	//VIP相关
	EAttributeVipLevel = 480,         //vip等级

	//伴侣相关
	EAttributeMateName = 490,           // 伴侣名字
	EAttributeMateHeartLockLevel = 491, // 伴侣同心锁等级
	EAttributeMateIntimate = 492,       // 伴侣友好度

	//第一次技术测试活动
	EAttributeCreateRole = 500,         //创号
	EAttributeLoginSign = 501,         //签到
	EAttributeOnlineTimeOnHour = 502,   //在线
	EAttributeUpgradeLevel = 503,      //升级

	//手游新增需求
	EAttributeEnterCopyCurrFloorDt = 520,   //进入当前层时间(爬塔)
	EAttributeKillBossNum = 521,   //当前副本层杀怪数
	EAttributeNormalCopyBossClear = 522,   //普通副本怪打打完

	EAttributeBossFieldItemCode = 530,      //怪兽战场怪兽模型
	EAttributeWuxingElement = 531,         //五行副本五行元素
	EAttributeXpSkillCdTime = 532,         //xp技能冷却时间

	//下载副本
	EAttributeDownloadCopyExp = 540,      //下载副本的当前经验

	//装备副本体力值
	EAttributeEquipCopyEnergy = 541,        // 装备副本体力值

	//仙盟战第一属性
	EAttributeGuildBest = 542,      //仙盟战第一属性（只在仙盟战内有效）

	EEntityAttributeMainFiveElementType = 543,  // 新五行主魂属性

	EAttributeActivityValue = 544,        // -- 修真活跃值

	//国家
	EAttributeCountryPosition = 545,    //国家职位

	EAttributeCountryContribution = 546,    //国贡

	EAttributeCountryTitleShow = 547,   //官职称号显示
	EAttributeDownloadReward = 548,     //在线奖励领取标识
	EAttributeGuildBossLevel = 549,     //当前仙盟BOSS等级
	EAttributeEndlessBossTitle = 550,       //仙帝争霸仙帝称号

	EAttributeReiki = 551,         //坐骑灵气值

	//法宝
	EAttributeMagicWareMainPos = 552,   //主法宝itemCode

	//跨服迷宫
	EAttributeCrossMazeCopyInfo = 553,   //跨服迷宫副本信息

	//诗山文海
	EAttributeWordGameQuestionType = 554,   //题目类型(1,2)
	EAttributeWordGameQuestionIndex = 555,   //文字位置
	EAttributeWordGameQuestionResuld = 556, //副本结果

	//境界
	EAttributeRealmLevel = 557,            //境界等级

	//掉落归属
	EAttributeIsDropOwner = 558,     //是否掉落归属

	//诛仙塔通关层数
	EAttributeRuneCopyPassFloor = 559,     //诛仙塔通关层数

	//玩家相关（占用560-599）
	EAttributeTire = 560,               //疲劳值
	EAttributeTireAdd = 561,            //疲劳值++
	EAttributeKillValue = 562,          //红名pk值
	EAttributeAddKillValue = 563,       //增加红名pk值
	EAttributeDestinyAwakeLevel = 564,  //天命觉醒等级
	EAttributeCrystalOneNum = 565,      //神兽岛采集大水晶数
	EAttributeCrystalOneNumAdd = 566,   //神兽岛采集大水晶数++
	EAttributeCrystalTwoNum = 567,      //神兽岛采集小水晶数
	EAttributeCrystalTwoNumAdd = 568,   //神兽岛采集小水晶数++
	EAttributeBeastIslandTire = 569,    //神兽岛疲劳值
	EAttributeBeastIslandTireAdd = 570, //神兽岛疲劳值++
	EAttributeHeartLockLevel = 571,     //同心锁等级
	EAttributeDragonSpirit = 572,       //龙魂值
	EAttributeDragonSpiritAdd = 573,    //龙魂值增加
	EAttributeDragonAwakeLevel = 574,   //龙神觉醒等级
	EAttributeHallowCivilization = 575, //诛仙强化石
	EAttributeHallowFighting = 576,     //封神强化石
	EAttributeHallowRegulus = 577,      //洪荒强化石
	EAttributeHallowAncient = 578,      //混沌强化石
	EAttributeShenJiTire = 579,         //上古神迹疲劳值
	EAttributeShenJiTireAdd = 580,      //上古神迹疲劳值++
	EAttributeShapeMantle=581,			//外形披风
	EAttributeNotShowShapeMantle = 582, //屏蔽外形披风
	EAttributePlayerAttributeMax = 599,   //玩家相关最大值（占位用）
	EAttributeHallowEquip = 600,      //装备强化石
	EAttributeRoleExp = 601,      //修为
	EAttributeKillFragmentJunior = 602,	//初级必杀碎片精华
	EAttributeKillFragmentSenior = 603,	//高级必杀碎片精华
	EAttributeTrainScore = 604,			//历练
	EAttributeShowCheckPoint = 605,		//关卡收益显示
	EAttributeIllustratedExp = 606,		//图鉴经验
	EAttributeForeverEquipSuit = 607,			//混元套装外形 
	EAttributeStrengthenExLordLevel = 608,		//爵位等级
    EAttributeCollectTimes = 609,         //新跨服boss采集次数
    EAttributeCollectTimesUse = 610,      //新跨服boss采集次数--
    EAttributeBossTimes = 611,         //新跨服boss归属次数
    EAttributeBossTimesUse = 612,      //新跨服boss归属次数--//服务端用，不会推送
	EAttributeTalentExp = 613,      //天赋经验
	EAttributeQiongCangOwnerTimes = 614,         //穹苍阁可获取归属次数更新
	EAttributeQiongCangOwnerTimesUse = 615,      //穹苍阁可获取归属次数消耗//服务端用，不会推送
    EAttributeTriggerSkillOrBuf = 616, // 触发技能或者buf
	EAttributeShapeBattle = 617,//战阵外形
	EAttributeShapeSwordPool = 618, //剑池外形
    EAttributeJeton	=	619,	//筹码
    EAttributeNotShowAttacked = 620, //不显示被攻击
    EAttributeBeastEquipExp = 621,         //玩家神兽装备强化经验
	EAttributeCrossBossCoTimes = 622,         //新跨服 Boss 可获取协助奖励次数更新
	EAttributeCrossBossCoTimesUse = 623,      //新跨服 Boss 可获取归属协助奖励次数消耗（后端用）
	EAttributeQiongCangCoTimes = 624,         //穹苍阁协助奖励次数更新
	EAttributeQiongCangCoTimesUse = 625,      //穹苍阁协助奖励次数消耗（后端用）
	EAttributeFightingSpirit = 626,      //斗魂
	

	//***类型只能往下定义***//
	EEntityAttributeMax = 30000,    //最大值，注意：定义不允许超过这个数 
};