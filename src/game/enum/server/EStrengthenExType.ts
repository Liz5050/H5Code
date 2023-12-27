/**
 * 强化类型枚举
 */
enum EStrengthenExType {
	EStrengthenExTypeSKill = 0, //技能,目前只有客户端有，特殊的类型不是通过强化表控制的,强化表也不能添加类型为0的 
	EStrengthenExTypeUpgrade = 1,	//强化
	EStrengthenExTypeCast = 2,		//铸造
	EStrengthenExTypeLord = 3,		//爵位
	EStrengthenExTypeDragonSoul = 4,	//龙魂
	EStrengthenExTypeNerve = 5,		//经脉
	EStrengthenExTypeInternalForce = 6,	//内功
	EStrengthenExTypeSpecialRing = 7,	//特戒
	EStrengthenExTypeWing = 8,		//翅膀
	EStrengthenExTypeRefine = 9,	//精炼
	EStrengthenExTypeMedal = 10,	//勋章	
	EStrengthenExTypeColorStone = 11, //五色石

	//客户端自己添加类型 从 1000 开始	
	EStrengthenExTypeHeartMethod = 1001, //心法

}