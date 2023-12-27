/*******************
* 奖励、掉落、礼包、宝箱等类型
*******************/
enum EReward
{
	ERewardExperience = 1,      //奖励经验（1,0,数量）
	ERewardMoney = 2,           //奖励货币（2,货币类型,数量）
	ERewardItem = 3,            //奖励物品（3,物品code,数量）
	ERewardBaseExpRate = 4,     //奖励基准经验百分比（4,0,百分比>=100）（奖励经验 = num * 经验配置表中玩家对应等级的base_exp / 100）
	ERewardRuneBox = 5,         //奖励符文宝箱 (5,0,数量)
	
	ERewardOfflineWork = 10,    //奖励离线挂机时间（10,0,分钟数）
	ERewardTitle = 11,          //奖励称号（11,称号code,1）
	ERewardBufferGroup = 15,    //奖励buffer组（15,buff组,增加的毫秒数）
	ERewardMgGuildBattleCredit = 16,  //跨服盟战奖励（16,0,数量）
	
	ERewardBloom = 100,         //仙盟繁荣（100,0,数量）
};