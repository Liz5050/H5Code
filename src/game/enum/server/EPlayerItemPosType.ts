/************************
* 玩家物品存储位置类型
************************/
enum EPlayerItemPosType
{
    EPlayerItemPosTypeBag = 0,                //背包
    EPlayerItemPosTypeWarehouse = 1,            //仓库
    EPlayerItemPosTypeGMGift = 2,                //GM赠送
    EPlayerItemPosTypeRole = 3,                //角色
    EPlayerItemPosTypeTask = 4,                //任务（存放任务物品）
    EPlayerItemPosTypeBagExtendBar = 5,        //背包扩展栏
    EPlayerItemPosTypeWarehouseExtendBar = 6, //仓库扩展栏
    EPlayerItemPosTypeMount = 7,                //坐骑栏
    EPlayerItemPosTypePet = 8,                //宠物栏
    EPlayerItemPosTypeStall = 9,                //摆摊
    EPlayerItemPosTypePetStorage = 10,        //宠物交友仓库
    EPlayerItemPosTypePetWarehouse = 11,        //宠物扩展仓库
    EPlayerItemPosTypeGuildWarehouse = 12,    //仙盟私人仓库（存放分配到和申请到的物品）
    EPlayerItemPosTypeRunBusiness = 13,        //跑商背包
    EPlayerItemPosTypeLottery = 14,            //宝藏仓库
    EPlayerItemPosTypeFish = 15,                //钓鱼背包
    EPlayerItemPosTypeCopyBox = 16,            //副本箱子背包
    EPlayerItemPosTypeDelegate = 17,            //副本委托背包
    EPlayerItemPosTypePetExplore = 18,        //宠物闯关背包
    EPlayerItemPosTypeTower = 19,                //爬塔背包
    EPlayerItemPosTypeGuildBox = 20,            //仙盟神兽宝箱背包
    EPlayerItemPosTypeWardrobe = 21,            //时装和翅膀衣柜
    EPlayerItemPosTypeRune = 22,                //符文背包
    EPlayerItemPosTypePetLifeStypePut = 23,    //宠物命格放置背包
    EPlayerItemPosTypePetLifeStypeHunt = 24,    //猎命背包
    EPlayerItemPosTypeStarFortune = 25,        //星运背包
    EPlayerItemPosTypeFarmSeed = 26,            //仙园种子背包
    EPlayerItemPosTypeFarmPet = 27,            //宠物仓库
    EPlayerItemPosTypeQuestionReward = 28,    //问答活动奖励背包
    EPlayerItemPosTypeEquipCopyBag = 29,    //装备副本背包
    EPlayerItemPosTypeJewelBag = 30,    //宝石背包
    EPlayerItemPosTypeJewelWareHouse = 31,  // 宝石仓库
    EPlayerItemPosTypeJewelGuildWarehouse = 32, //仙盟宝石仓库
    EPlayerItemPosTypeMagicWare = 33,       // 法宝背包
    EPlayerItemPosTypeMagicWareHouse = 34,  // 法宝仓库
    EPlayerItemPosTypeShapeEquip = 35,      // 外形装备背包
    EPlayerItemPosTypeSoul = 36,            // 灵魂背包
    EPlayerItemPosTypeBeast = 37,           // 神兽背包
    EPlayerItemPosTypeProp = 38,           // 道具
    EPlayerItemPosTypeLotteryRune = 39,            //战纹寻宝仓库
    EPlayerItemPosTypeLotteryTrends = 40,            //传世寻宝仓库
    EPlayerItemPosTypeLotteryAncient = 41,            //混元寻宝仓库
    EPlayerItemPosTypePetEquipBase = 1000,  // 宠物装备背包(基数)
};