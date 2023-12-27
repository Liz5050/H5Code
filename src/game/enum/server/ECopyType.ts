enum ECopyType {
    ECopyNormal = 0,    // 普通副本类型
    ECopyGuild = 1,    // 公会领地
    ECopyBattle = 2,    // 战场
    ECopySpa = 3,    // 温泉
    ECopyVIPHook = 4,  // VIP挂机
    ECopyGuildWar = 5,    // 仙盟战
    ECopyTower = 6,    // 爬塔副本
    ECopyDefense = 7,    // (新)防守副本
    ECopyCoin = 8,  // (新)打钱副本
    ECopySixty = 9,    // 60副本
    ECopyArena = 10, // 竞技场
    ECopyFairyland = 11, // 海底幻境
    ECopyPeaceField = 12, // 和平boss
    ECopyWedding = 13, // 结婚庆典
    ECopyPetExplore = 14, // 宠物闯关
    ECopyNewBattle = 15, // 新战场
    ECopySeventy = 16, // 70副本
    ECopy60Defense = 17, // 60防守副本
    ECopyGuildAltar = 18, // 仙盟祭坛
    ECopyGuildStruggle = 19, // 仙盟副本
    ECopyArenaCross = 20, // 跨服竞技场
    ECopySkyCity = 21, // 天空之城
    ECopyCrossSpa = 22, //   跨服温泉
    ECopyGuildPasture = 23, //   仙盟牧场
    ECopyGuildDefense = 24, // 仙盟防守副本
    ECopyCrossBeach = 25, // 跨服碧海银滩
    ECopyPetArena = 26, // 宠物斗兽
    ECopyGangFights = 27, // 跨服竞技场3V3
    ECopyDrama = 28, // 剧情副本
    ECopyRace = 29, // 竞速赛副本
    ECopyCrossBoss = 30, // 跨服boss
    ECopyEighty = 31, // 80副本
    ECopySeal = 32, // 封印副本
    ECopyCrossStair = 33, // 跨服爬楼（青云之巅）
    ECopyWrestle = 34, // 跨服竞技场1v1
    ECopyCrossUnique = 35, // 跨服普通地图
    ECopyBossField = 36, // 怪兽战场
    ECopyDownload = 37, // 下载副本
    ECopyWatchRecord = 50, // 观看录像副本
    ECopyCutMoney = 52, // 天降横财副本
    ECopyAngryMonsterKing = 53,//万妖王副本
    ECopyCatagrophe = 54,//渡劫
    ECopyMirror = 55,// 镜像副本
    ECopyEquip = 56,   //装备副本
    ECopyGuildBattle = 57,   //新仙盟战
    ECopyCrossBossField = 58,   //跨服怪兽战场
    ECopyLiarDice = 59,         //欢乐修仙骰
    ECopyFeudalHegemony = 60,     //皇城争霸赛
    ECopySwornWedding = 61,   //结义庆典
    ECopyGuildSumeruDreamLand = 62, //仙盟副本须弥幻境
    ECopyNonVIPHook = 63,      //水月洞天--普通玩家挂机副本
    ECopyVIPHook2 = 64,      //水月洞天--VIP玩家挂机副本
    ECopyNewMythFight = 65, //新版跨服封神榜
    ECopyEndlessBoss = 66, //仙帝争霸
    ECopyGuildAnima = 67, //仙盟灵脉
    ECopy60Copy = 68,//60级副本
    ECopyCrossThreeVsThree = 69,  //跨服3v3
    ECopyCrossQuestion = 70,//跨服答题
    ECopyCrossFairyland = 71, //跨服沧澜海
    ECopyCrossThreeVsThreeRestRoom = 72, //3v3休息室
    ECopyCrossGuildBattle = 73,          //跨服仙盟战
    ECopyParaseleneMaze = 74,   //幻月迷宫
    ECopyCrossCity = 75,  //跨服城战
    ECopyWordGame = 76,	//诗山文海

    ECopyMgChapter = 77, 		//章节副本（温志华）
    ECopyMgLevel = 78,      //关卡副本（陈历樟）
    ECopyMgMaterial = 79, 	//材料副本（温志华）
    ECopyMgPerson = 80,   	//个人boss副本（温志华）
    ECopyMgWorldBoss = 81, 	//世界boss副本（温志华）
    ECopyMgSpaceBoss = 82, 	//场景boss副本（温志华）
    ECopyMgForceWar = 83,  	//三界争霸（LiuZhibin）
    ECopyMgGuildBoss = 84,   	//仙盟boss副本（温志华）
    ECopyMgDefenseQingYun = 85,	//守卫青云（陈历樟）
    ECopyMgQuestionCopy = 86, // 答题副本（LiuZhibin）
    ECopyMgPersonalPk = 87, 	// 跨服竞技（LiuZhibin）
    ECopyMgGuildWar = 88,   	//仙盟争霸（陈历樟）
    ECopyMgExperience = 89,  	//恶魔副本（经验副本）
    ECopyMgNormalChapter = 90,//普通章节副本（温志华）
    ECopyMgNormal = 91,		//普通副本（梁仲英）
    ECopyMgRingBoss = 92,	    //刷怪副本（梁仲英）
    ECopyMgNormalDefense = 93,//防守副本（梁仲英）
    ECopyMgNewWorldBoss = 94, //新世界boss（温志华、刘志彬）
    ECopyMgBossHome = 95,		//boss之家（温志华、刘志彬）
    ECopyMgTowerSingle = 96,  //单人爬塔（陈历樟）
    ECopyMgTowerGroup = 97,   //组队爬塔--镇魔古迹（陈历樟）
    ECopyMgBloodMatrix = 98,	//圣灵血阵（梁仲英）
    ECopyMgNormalTask = 99,   //任务副本（梁仲英）
    ECopyMgRune = 100,        //符文塔（陈历樟）
    ECopyMgManHuang = 101,    //蛮荒禁地（陈历樟）
    ECopyMgGuildParty = 102,  //仙盟宴会（陈历樟）
    ECopyMgGuildBeastGod = 103, //仙盟兽神（陈历樟）
    ECopyMgFiveElements = 104,//五行神殿（梁仲英）
    ECopyMgGuildPromotion = 105,//帮会争霸赛（刘志彬）
    ECopyMgTowerDefense = 106, //塔防副本（陈历樟）
    ECopyMgBeastIsland = 107, //神兽岛[跨服]（陈历樟）
    ECopyMgGuildDefense = 108, //守卫仙盟（陈历樟）
    ECopyMgBattle = 109, //天神战场（肖倜）
    ECopyMgLove = 110,        //情缘副本（刘志彬）
    ECopyMgShenJi = 111,      //上古神迹副本（刘志彬）
    ECopyMgGuildBattle = 112,      //跨服盟战（肖倜）
    ECopyMgPersonalBoss = 117, //个人boss(郑楚镇)
    ECopyMgNewExperience = 118, //新经验副本（赵亚辉）
    ECopyMgKingStife 	= 119, 	  //王者争霸（赵亚辉）
    ECopyCheckPoint = 120, //关卡副本
    ECopyMgSecretBoss = 121, //秘境boss
    ECopyMgBossLead = 122,    //boss引导副本
    ECopyPunchLead = 123,    //合击引导副本
    ECopyMgNewBossHome = 124, //新boss之家（赵亚辉）
    ECopyEncounter = 125,	//遭遇战
    ECopyWorldBoss = 126, // 世界boss
    ECopyMgMining = 127,  // 挖矿
    ECopyMgMiningChallenge = 128,  // 挖矿挑战
    ECopyPosition = 129,  // 阵地争夺
    ECopyBattleBich = 130,//阵营战
    ECopyMgNewGuildWar = 131, //新仙盟战（赵亚辉）
    ECopyNewCrossBoss = 132, //新跨服BOSS
    ECopyMgSpirit = 133, //法宝副本
    ECopyMgParadiesLost = 134, //失乐园副本
    ECopyLegend = 135, //传奇之路
    ECopyMgQiongCangAttic = 136,  //穹苍阁
    ECopyMgQiongCangHall = 137,  //穹苍圣殿
    ECopyMgQiongCangDreamland = 138, //穹苍幻境
    ECopyMgPeakArena = 139, 			//巅峰赛季
    ECopyCrossTeam = 140,	  //跨服组队
    ECopyGuildTeam = 141,	  //仙盟组队
    ECopyMgBossIntruder = 142,  //Boss 来袭
    ECopyMgDarkSecretBoss = 143, //暗之秘境boss（赵亚辉）
    ECopyMgHideBoss = 144, 		//隐藏boss（赵亚辉）
    ECopyMgCrossGuildBossIntruder = 145,  //神兽入侵
    ECopyContest = 146, 			//1vN
    ECopyQualifying = 147, 			//3v3
    ECopyMgWildBossEntranceLead = 148, // 野外boss入口引导
};