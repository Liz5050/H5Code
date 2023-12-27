//怪物类型
enum EBossType
{
	EBossTypeNomarl          = 0,    //普通怪
	EBossTypeCollection      = 1,    //采集怪
	EBossTypeStop            = 2,    //阻挡怪
	EBossTypePass            = 3,    //通道怪
	EBossTypeMount           = 4,    //坐骑怪
	EBossTypeCoin            = 5,    //金币怪
	EBossTypeTrap            = 6,	   //目标陷阱（有目标才释放攻击）
	EBossTypeMarch           = 7,	   //花车
	EBossTypeMechine         = 8,	   //机械单位
	EBossTypeQuestion        = 9,	   //答题怪
	EBossTypeOre             = 10,   //矿石
	EBossTypeLifeBoss        = 11,   //生命怪物
	EBossTypeMulKill         = 12,   //共同击杀怪
	EBossTypeMulCollection   = 13,   //共同采集怪
	EBossTypeDrama           = 14,   //剧情怪
	EBossTypeSpecialSummon   = 15,   //特殊召唤怪
	EBossTypeNormalFollow    = 16,   //普通怪跟随玩家的
	EBossTypePatrol          = 17,   //酱油怪(就会走)
	EBossTypeLoveTaskCar     = 18,   //情缘任务怪
	EBossTypeDeadForBuff     = 19,   //死亡使用技能的怪物
	EBossTypeHideAndSeek     = 20,   //抓迷藏怪
	EBossTypeWordGameLose    = 21,   //诗山文海怪(顺序刷)
	EBossTypeWordGameOrder   = 22,   //诗山文海怪(缺失刷)
	EBossTypeTimeTrap        = 23,   //时间陷阱（定时释放攻击）
	EBossTypeTombstone       = 24,   //墓碑（显示刷怪倒计时）
	EBossTypeCrystal         = 25,   //五行神殿水晶怪
	EBossTypeDefenseTower    = 26,   //守护塔
    EBossTypeMiner    	  	 = 27,   //矿工
};