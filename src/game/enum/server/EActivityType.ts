/*
* 活跃度(完成度)类型
*/
enum EActivityType
{
	EActivityTypeKillBoss = 1,      //击杀BOSS(copyType,copyType...)
	EActivityTypeRuneLottery = 2,   //符文寻宝
	EActivityTypeLottery = 3,       //装备寻宝(装备寻宝：101；符文寻宝：102)
	EActivityTypePray = 4,          //祈福(type)
	EActivityTypeTask = 5,          //任务(taskGroup)
	EActivityTypeCopy = 6,          //副本(copyType)
	EActivityTypeUseProp = 7,       //使用道具(itemCode)
	EActivityTypeSmeltJewel = 9,     //宝石合成(宝石等级)
	EActivityTypeRecharge = 10,     //充值(充值数量)
	EActivityTypeLogin = 11,     //累计登录
	EActivityTypeWildBoss = 12,     //野外BOSS挑战(copyType)(要独立一个类型，因为野外BOSS 和 神域BOSS 使用同一个 copy type)
	EActivityTypeCopySuccess = 13,  //通关副本(copyType)(包括扫荡)
	EActivityTypeExpCopyGetReward = 14,  //经验副本奖励领取(领取 code )
	EActivityTypeMoneyCost = 15,  //金钱消耗(金钱类型)
	EActivityTypeSecretBoss = 16,     //秘境BOSS挑战(copyType)
	EActivityTypeRechargeRMB = 17,     //充值(充值数量，单位：元)
	EActivityTypeKingStifeMatch = 18,     //王者争霸匹配
	EActivityTypeActiveCopyEnterDayCount = 19,     //活动副本参与(copyType)(每天只算一次)
	EActivityTypeHireMiner = 20,     //聘请矿工(矿工类型)
	EActivityTypeGuildDonateMoney = 21,     //仙盟捐献(捐献类型)
	EActivityTypeGuildDonateFirewood = 22,     //仙盟捐献篝火
};