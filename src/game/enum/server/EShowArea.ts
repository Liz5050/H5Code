/*******************
* 显示区域
*******************/
enum EShowArea {
	EShowAreaChat = 1,            //聊天区
	EShowAreaMiddle = 2,        //屏幕中央（走马灯）
	EShowAreaMiddleTop = 4,        //屏幕中央顶层
	EShowAreaHistory = 8,        //历史记录区（右下角）
	EShowAreaTrumpet = 16,        //大喇叭区
	EShowAreaExplorer = 32,        //仙境
	EShowAreaRightDown = 64,    //屏幕右下区域
	EShowAreaMiddleDown = 128,    //剧情 
	EShowAreaActiveExplorer = 256,    // 活动仙境
	EShowAreaMiddleDownEx = 512,//剧情(扩展)
	EShowAreaDramaLottery = 1024,    //剧情副本抽奖
	EShowAreaDramaLike = 2048,        //类似剧情广播，防止跟老剧情广播冲突，新建一个类型。
	EShowAreaDefenseCopy = 4096, //守卫神剑副本内的得到装备的广播
}