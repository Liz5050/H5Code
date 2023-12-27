enum EGmOpType {
    EGmOpTypeUpdateMoney = 1,	    // { int uint, int amount, } { 货币单位（类型）；数量（最终更新完成对数值） }
    EGmOpTypeUpdateExp = 2,	    // { int exp, } { 增加/减少的经验值 }
    EGmOpTypeUpdateLevel = 3,	    // { int level, } { 角色等级 }
    EGmOpTypeUpdateLifeOrMana = 4,  // { int type, int value, } { 类型（生命/法术）；数量（最终更新完成对数值） }
    EGmOpTypeAddItem = 5,	    // { int itemCode, int amount, } { 物品代码；数量（最终更新完成对数值） }
    EGmOpTypeCompleteOneTask = 6,   // { int taskCode, } { 任务代码；}
    EGmOpTypeCompletePreTask = 7,   // { int taskCode, } { 任务代码；}
    EGmOpTypeEndTask = 8,	    // { int taskCode, int count, } { 任务代码；完成次数 } （ 当为 111 时，开启全部 功能开启 任务 ）
    EGmOpTypeEndOpenFuncTask = 9,   // { int taskCode, } { 任务代码；} （ 当为 111 时，开启全部 功能开启 任务 ）
    EGmOpTypeUpdateConfigData = 10, // 热更配置
    EGmOpTypeResetCopyTimes = 11, // { int copyType, } { 副本类型 }
    EGmOpTypeClearOrFillUpBag = 12, // { int code, } { 清空：111；填满：222 }
    EGmOpTypeAddASetOfEquips = 13,  // { int item_level, int color, int star, } { 阶数；颜色；必出多少星； }
    EGmOpTypeModifyVipLevel = 14,   // { int vipLevel, int minutes, } { vip等级；时间（分钟）； }
    EGmOpTypeModifyVipExp = 15,	    // { int vipExp, } { vip经验； }
    EGmOpTypeModifyRoleState = 16,  // { int roleState, int roleSubState, } { 转数（-1：不转职，只显示当前信息）；转职章节（可不填）； }
    EGmOpTypeModifyTire = 17, // { int tire }
    EGmOpTypeTestBroadcastCachedPriority = 18, // { string prioritySeq; } { 优先级广播序列（如：110345110，每个数字代表优先级，按顺序产生
}