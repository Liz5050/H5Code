enum EMoveStatus
{
	EMoveStatusNomarl      = 0,  //普通(行走或者其它)状态
	EMoveStatusCollect     = 1,  //采集状态
	EMoveStatusStall       = 2,  //摆摊状态
	EMoveStatusZazen       = 3,  //单人修炼状态
	EMoveStatusDoubleZazen = 4,  //双人修炼状态,和toEntitys配合使用
	EMoveStatusFish        = 5,  //钓鱼状态
	EMoveStatusRoastFish   = 6,     //烤鱼状态
	EMoveStatusMarch         = 7,  //游行状态
	EMoveStatusSilence      = 8,     //沉默状态
	EMoveStatusStand        = 9,  //战立状态
	EMoveStatusFly              = 10, //飞行状态
	EMoveStatusSunBath      = 11, //日光浴状态
	EMoveStatusHorse          = 12, //坐骑
	EMoveStatusDoubleHorse  = 13, //双人坐骑(副座)
	EMoveStatusCruiseSingle = 14, //情缘任务 单人巡游状态
	EMoveStatusShieldOthers = 15, //屏蔽同屏其他玩家
	EMoveStatusCruiseDouble = 16, //情缘任务 双人巡游状态
	EMoveStatusFairyPetParade = 17,        //仙宠巡游状态
	EMoveStatusGuildBattleOccupied = 18,   //占领祭坛状态
	EMoveStatusFollowWeddingCar = 19,   //跟随花车状态
	EMoveStatusRideBird = 20 ,    //骑鸟状态
	EMoveStatusRideSword = 21 , //御剑状态
	EMoveStatusLoveZazen = 22,     //情愿区修炼状态
};