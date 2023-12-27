enum EKickOutReason {
    EKickOutReasonByCloseGate = 0,     //重启网关服务器
    EKickOutReasonByCloseCell = 1,       //重启CELL服务器
    EKickOutReasonByCloseGateMgr = 2,     //重启网关管理服务器
    EKickOutReasonByCloseInterMgr = 4, //共用服务器关闭
    EKickOutReasonByCloseDbApp = 5,    //数据库关闭
    EKickOutReasonByElseLogin = 6,     //用户重新登录
    EKickOutReasonByIssmThreeHour = 7,    // 在线3小时且未通过实名制
    EKickOutReasonByIssmOfflineTimeLessFiveHour = 8, //离线不足5小时且未通过实名制
    EKickOutReasonByLockPlayer = 9,  //锁定玩家
    EKickOutReasonByGMOperation = 10, //GM强制离线
    EKickOutReasonByDbUpdateFail = 11, //数据库更新失败
    EKickOutReasonByErrorVersion = 12,    //版本错误
    EKickOutReasonByPlugin = 13,        //检测到外挂。
}