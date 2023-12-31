enum EEntityType 
{
    EEntityTypePlayer = 1,  //玩家
    EEntityTypeBoss = 2,  //怪物
    EEntityTypePet = 3,  //宠物
    EEntityTypeDropItem = 4,  //掉落物品类型
    EEntityTypeTransport = 5,  //镖车
    EEntityTypeEscort = 6,  //护送
    EEntityTypeDefenseCopyItem = 7,  //防守副本道具
    EEntityTypeNpcShop = 8,  //NPC商店
    EEntityTypePetInExplore = 9,  //闯关宠物
    EEntityTypePetInArena = 10,  //斗兽宠物
    EEntityTypeDropLottery = 11,    //掉落抽奖
    EEntityTypeLifeBoss = 12,    //生命怪物
    EEntityTypePlayerMirror = 13, //玩家镜像
    EEntityTypePetMirror = 14,     //宠物镜像
    EEntityTypeCollectBuff = 15,//采集怪buff
    EEntityTypeNPC = 16,         //NPC
    EEntityTypePassPoint = 17,   //传送阵
    EEntityTypeSpirit = 18,   //法宝
    EEntityTypePlayerOfflineWork = 19, //离线挂机玩家
    EEntityTypeDropItemPrivate = 20,  //掉落物品类型(私有，只有客户端使用)
    EEntityTypeGroup = 50, //组队类型
    EEntityTypeGuild = 51,    //仙盟
    EEntityTypeBattle = 52,    //战场
    EEntityTypeSpa = 53,    //温泉
    EEntityTypeVIPHook = 54,    //VIP挂机
    EEntityTypeGuildWar = 55,    //仙盟战
    EEntityTypeArena = 56,   //竞技场
    EEntityTypeFairyland = 57,   //海底幻境
    EEntityTypePeaceField = 58,    //和平boss场景
    EEntityTypeWedding = 59,    //结婚庆典场景
    EEntityTypePetExplore = 60,    //宠物闯关场景
    EEntityTypeNewBattle = 61,    //新战场
    EEntityTypeGuildAltar = 62,    //仙盟祭坛
    EEntityTypeGuildStruggle = 63,    //仙盟副本
    EEntityTypeArenaCross = 64,    //跨服竞技场
    EEntityTypeSkyCity = 65,    //天空之城
    EEntityTypeCrossSpa = 66,    //跨服温泉
    EEntityTypeGuildPasture = 67,    //仙盟牧场
    EEntityTypeGuildDefense = 68,    //仙盟防守副本
    EEntityTypeCrossBeach = 69,    //跨服碧海银滩
    EEntityTypePetArena = 70,    //宠物斗兽
    EEntityTypeGangFights = 71,    //跨服竞技场3v3
    EEntityTypeRace = 72,    //跨服竞速赛
    EEntityTypeCrossBoss = 73,    //跨服boss
    EEntityTypeCrossStair = 74,    //跨服爬楼
    EEntityTypeWrestle = 75,    //跨服竞技场1v1
    EEntityTypeBossField = 76,    //怪兽战场
    EEntityTypeAngryMonsterKing = 78,//妖皇副本
    EEntityTypeMirror = 79,    //镜像地图
    EEntityTypeGuildBattle = 80,  //新仙盟战
    EEntityTypeCrossBossField = 81,    //跨服怪兽战场
    EEntityTypeLiarDice = 82,    //大话骰
    EEntityTypeFeudalHegemony = 83,    //皇帝争霸
    EEntityTypeSwornWedding = 84,    //结义庆典场景
    EEntityTypeGuildSumeruDreamland = 85, //仙盟副本封印古魔场景
    EEntityTypeNewMythMirrorBattle = 86,  //新版封神榜
    EEntityTypeEndlessBoss = 87,     //仙帝争霸
    EEntityTypeCopyRoom = 88,  //副本房间
    EEntityTypeEndlessStatue = 89,     //仙帝争霸(客户端使用)
    EEntityTypeThreeVsThree = 90,  //跨服3V3New
    EEntityTypeThreeVsThreeRestRoom = 91, //跨服3v3休息室
    EEntityTypeCrossGuildBattle = 92,    //跨服仙盟战
    EEntityTypeCrossCity = 93,            //跨服城战
    EEntityTypeWordGame = 94,            //诗山文海
    EEntityTypeWorldBoss = 95, //世界boss
    EEntityTypeSpaceBoss = 96, //场景boss
    EEntityTypeForceWar = 97,  //三界争霸
    EEntityTypeGuildBoss = 98, //仙盟boss
    EEntityTypeQuestionCopy = 99,  //答题副本
    EEntityTypeDefenseQingyun = 100,    //守卫青云
    EEntityTypePersonalPk = 101,    //跨服竞技
    EEntityTypeMgGuildWar = 102,    //仙盟争霸
    EEntityTypeExperienceCopy = 103,  //经验副本（恶魔副本）
    EEntityTypeMgSingleTower = 104,   //单人爬塔
    EEntityTypeNewWorldBoss = 105, //新世界boss
    EEntityTypeBossHome = 106, //boss之家
    EEntityTypeManHuangCopy = 107, //蛮荒禁地
    EEntityTypeMgGuildParty = 108, //仙盟宴会
    EEntityTypeMgGuildBeastGod = 109, //仙盟兽神
    EEntityTypeMgGuildPromotion = 110, //帮会争霸赛
    EEntityTypeMgBeastIsland = 111,	//神兽岛
    EEntityTypeMgGuildDefense = 112, //守卫仙盟
    EEntityTypeMgBattle = 113, //神魔战场
    EEntityTypeMgShenJi = 114, //上古神迹
    EEntityTypeMgGuildBattle = 115, //跨服盟战

    EEntityTypeSceneEffect = 10000,   //场景特效（客户端使用）
}