//特殊活动特殊标记（位运算关系）
enum ESpecialFlag
{
	ESpecialFlagRelyOnOpenDt = 1,                  //与开服日期相关联
	ESpecialFlagAheadDisplay = 2,                  //在非活动时间也提前显示
	ESpecialFlagRelyOnMerge = 4,                  //合服特有的活动
	ESpecialFlagIntervalTime = 8,                  //非连续时间（间隔时间）
};