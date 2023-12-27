enum EPassType {
	EPassTypeByPassPoint = 0,       //按照传送点传送
	EPassTypeCopy = 1, //走特定进副本协议，旧的服务端定义---EPassTypeNpc = 1,       //按照NPC传送
	EPassTypeGuildTask = 2,	   //按仙盟任务传送
	EPassTypeTransportHelp = 3,	   //运镖求救传送	
	EPassTypeToCopyNpc = 4,		 //传送到副本NPC
	EPassTypeTreasureHelp = 5,              //寻宝任务传送
	EPassTypeFreePoint = 6,				//特定点免费传送
	EPassTypeBackToXuanwu = 7,		//资源缺失情况下直接扔到玄武城
	EPassTypeCountryCall = 8, 		//国家召唤传送
	EPassTypeThreeVsThree = 9,     //传送到3v3地图
	EPassTypeRandomEvent = 10,	   //进入传送阵触发随机事件
	EPassTypeCrosstreasure = 11,	//跨服夺宝传送
}