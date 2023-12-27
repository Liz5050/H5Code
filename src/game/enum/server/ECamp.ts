/************************
 *阵营
************************/
enum ECamp {
	ECampNormal = 0,    //普通（玩家可攻击）
	ECampOne = 1,        //紫霄
	ECampTwo = 2,        //星辰
	ECampThree = 3,     //苍穹
	ECampNeutral = 4,   //中立（怪物可攻击、玩家不可攻击）
	ECampNpc = 5,        //NPC （怪物、玩家都不可攻击）
}