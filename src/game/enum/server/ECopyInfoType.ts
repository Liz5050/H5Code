//副本信息类型
enum ECopyInfoType
{
	ECopyInfoTypeRing           = 0,   //副本环数     num1--当前环数 num2--下一环刷怪倒计时 num5--最大环数
	ECopyInfoTypeEnd            = 1,   //副本结束时间 num1--结束倒计时 num2--副本的停留时间（副本时间） num3--副本创建时间（绝对时间值，秒数）
	ECopyInfoTypeEvenCut        = 2,   //连斩副本显示 num1--当前连斩次数 num2--下一次连斩倒计时 num3--积分值 num4--最大连斩数 num5--杀怪数量 num6--副本排名
	ECopyInfoTypeExchange       = 4,   //兑换规则     num1--消耗积分数 num2--获得铜钱数 num3--副本ID num4--杀怪数量 num5--最大连斩 num6--积分排名
	ECopyInfoTypeBossRefresh    = 8,   //触发刷怪方案   num1--怪物id   num2--倒计时时间
	ECopyInfoTypeEvenCutEx      = 16,  //高级连斩FB显示   num1--当前连斩次数 num2--下一次连斩倒计时 
										//num3--最大连斩数 num4--小怪数量 num5--BOSS数量 num6--铜钱 num7-绑定铜钱
										//num8--历史最大连斩 num9--历史最大击杀BOSS
	ECopyInfoTypeEvenCutEnd     = 32,  //铜钱FB结束   num1--当前连斩次数 num2--下一次连斩倒计时 
										//num3--最大连斩数 num4--小怪数量 num5--BOSS数量 num6--铜钱 num7-绑定铜钱
										//num8--历史最大连斩 num9--历史最大收益数
	ECopyInfoTypeMark             = 64,    //副本评分 num1--杀怪数量 num2--获得经验 num3--时间  num4--进度(层数)  num5--环数  num6--积分 num7--铜钱 num8--副本code
	ECopyInfoTypeCount        = 128, //副本统计 num1--是否突破 num2--当前记录 num3--最高记录  num4--经验  str1--物品掉落(item1,item2...)
	ECopyInfoTypeCoin           = 256, //铜钱副本信息 num1--副本创建totalDay（副本使用） num2--历史最高波数  num3--通关波数  num4--挑战波数  num5--剩余时间（秒） num6--本波奖励铜钱  num7--累计奖励铜钱
};