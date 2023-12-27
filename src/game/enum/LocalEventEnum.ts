/**
 * 客户端本地操作事件相关的枚举
 * id从50000开始
 */
enum LocalEventEnum {
    LoadingProgressUpdate = 50000,
    AppInited,
    //===============APP 切换后台有关===============
    /** app进入后台，暂停了 */
    AppPause,
    /** app从后台返回前台，恢复了 */
    AppResume,

    GameInit,
    GameReSize,
    GameViewOpen,
    GMOpen,//前端开启gm

    //===============登录===============
    Login,
    /** php重新登陆，除了原来的断线移除外，额外移除主角和场景 */
    ReloginCloseGameView,
    GameCrossDay,
    ChangeNoticeTitle,

    //===============人物===============
    PlayerOpenNewRole,
    PlayerOpenReplaceEquip, //打开更装备界面;参数:itemdata
    PlayerNewRoleUpdated,//新角色开启更新
    PlayerStrengthExActive,// 人物属性激活
    PlayerStrengthExUpgrade,// 人物属性强化
    PlayerStrengthExUseDrug,// 使用丹药;type: EStrengthenExType, roleIndex: number, drugType: number, useNum: number
    PlayerOneKeyEquip,//一键装备
    PlayerModifyName,//角色改名
    PlayerFirstDead,//角色第一次死亡

    //===============公共===============
    /**查看玩家信息 */
    CommonViewPlayerInfo,
    /**打开玩家菜单 */
    CommonViewPlayerMenu,
    CommonShowRuleTips, //显示通用的玩法说明
    //=============home==========
    HomeSetBtnTip, //设置模块按钮红点提示:参数：key(ModuleEnum定义的模块或实例名),是否红点(bool),key是否是实例名称(bool,默认false)
    HomeShowReceiveIcoEff,//  一个通用的获得某类物品、碎片的动画提示；参数:图标url,名称name
    HomeShowReceiveItemTips, //显示一个获得红装的提示
    HomeShowReceiveNormalItemTips,//显示一个获得普通物品的提示
    ActivationShow,//显示通用的激活界面;参数:urlModel,urlName
    AddHomeIcon,//新增功能图标
    RemoveHomeIcon,//移除功能图标
    HomeIconSetTip,//Home图标红点设置
    HomeIconSetTime,//图标设置倒计时
    HomeIconClick,//点击功能图标
    HomeIconUpdateEffect,//图标特效
    HomeHejiOk,//合击技能能力满
    CheckPointInfoShow,//关卡效率信息是否显示更新
    HomeAfterClickReturn,//点击了返回按钮
    HomeSetTrainRedTip,//设置日常红点
    HomeLoginRewardUpdate,//登录奖励更新
    HomeFriendIconUpdate,//好友图标更新
    HomeHejiOpenEffect,//合击技能播放特效
    //HomeAddGuildDefendIco, //仙盟守护图标

    //===============gm测试===============
    ShowLog,
    ShowLoadLog,
    ShowResLog,

    //===============任务===============
    TaskTraceUpdate,
    /**玩家任务初始化 */
    TaskUpdateMy,
    /**可接任务已更新 */
    TaskCanGetUpdated,
    /**玩家任务已更新 */
    TaskPlayerTaskUpdated,
    /**npc身上任务更新了 */
    TaskNpcTasksUpdated,
    /**与npc对话 */
    TaskTalkToNpc,
    /**提交任务 */
    TaskSubmit,
    /**领取任务 */
    TaskGet,
    /**接循环任务 */
    TaskRingGet,
    /**提交循环任务 */
    TaskRingEnd,
    /**跑去完成指定任务 */
    TaskGoto,
    /**主动前往任务 */
    TaskGotoActive,
    /**任务完成 */
    TaskFinished,
    /**设置NPC任务状态 */
    TaskNpcState,
    /**开启任务更新 */
    TaskOpenEndUpdated,
    /**任务删除 */
    TaskRemoved,
    /**提交杀怪掉落物品任务 */
    TaskKillBossDropSubmit,
    /**前往赏金任务 */
    TaskGotoMoneyRing,
    /**前往仙盟任务 */
    TaskGotoGuildRing,
    /**前往护送任务 */
    TaskGotoEscort,
    /**任务开始 */
    TaskStart,
    /**任务停止 */
    TaskStop,
    /**上交装备 */
    TaskHandInEquip,
    /**任务完成 */
    TaskComplete,
    /**所有任务完成 */
    TaskAllComplete,

    //===============限时任务===============
    /**限时任务信息更新 */
    TimeLimitTaskUpdateAll,
    /**单个限时任务更新 */
    TimeLimitTaskUpdate,

    //===============地图/场景===============
    /**寻路走到指定格子 */
    SceneRouteToNpc,
    SceneRouteToGrid,
    SceneBeginCollect,
    SceneAbortCollect,
    SceneCollectUpdate,//采集信息更新
    SceneConvey,
    /**点击地面 */
    SceneClickGround,
    SceneClickGroundPos,
    /**切换地图 */
    SceneChangeMap,
    SceneClickEntity,
    /** 场景寻路路径格子(大格子数)，附带数组：PathNode[] */
    SceneFindPathNodes,
    /** 场景主角行动更新, 附带(Action)：currentAction, lastAction */
    SceneMainPlayerActionUpdate,
    SceneShowMaskEffect, //显示场景切换淡出效果
    /** 主角进入/离开安全区 */
    SafeZoneChange,
    /**小飞鞋传送完成 */
    SceneConveyComplete,
    LeaderRoleChange,
    LeaderRoleMove,
    OtherPlayerDied,//有其他玩家死亡
    OtherPlayerUpdate,//其他玩家更新
    MonsterDied,//有怪物死亡
    ScenePlayerMirrorAdd,//场景添加玩家镜像
    AIPickUpComplete,//拾取掉落完毕
    ConveyToMainCity, //传送到主城
    ConveyToCheckpoint,//传送到关卡
    SwitchBossLifeBarVisible,//切换boss血条显示状态

    //===============AI===============
    AIStart,
    AIStop,
    AIAdd,
    AIAutoPath,//参数:是否寻路完成
    KingStartAttack,//主角开始战斗

    //===============自动Auto===============
    AutoStartFight,
    AutoStopFight,
    /**自动挂机状态改变 */
    AutoFightChange,
    /**自动任务流程开始 */
    AutoStartTask,
    /**自动任务流程结束 */
    AutoStoptTask,


    //===============人物装备===============
    /**穿人物装备 */
    EquipToRole,
    /**脱人物装备 */
    EquipUndressRole,
    EquipReplaceRole,

    //===========传世装备=====
    AncientEquipShowComposeWin,//显示传世装备的合成窗口;参数:{type}
    AncientEquipShowSmeltWin,//显示传世装备的分解窗口;参数:{type}
    AncientEquipShowGainWin,//显示传世装备获取途径窗口;参数:{itemCode:}
    AncientEquipHideSecondWin,//关闭传世装备弹出的所有二级界面
    AncientEquipReqCompose,//请求合成传世装备;参数:{itemCode:,oper:}
    AncientEquipReqSmelt,//请求分解传世装备,参数:{uids:[],posType:}
    AncientEquipShowSuitTip,//显示套装信息,参数:{roleIndex:}
    AncientEquipShowSkillTip,//显示套装信息,参数:skillCfg

    //=======道具获取=======
    PropGetGotoLink,//获取道具 点击跳转;参数:{type:}
    //===============背包===============

    /**使用 */
    PackUse,
    PackUseByCode,
    /**存入仓库 */
    PackStore,
    /**从仓库取出 */
    PackFetch,
    PackSale,
    /**出售多个 */
    PackSaleMore,
    PackSaleOneKey,
    PackSplit,
    PackTidy,
    /**检测守护过期 */
    PackCheckSpiritExpire,
    PackQuickUseEquip, //新手阶段快速使用装备
    /**检测是否装备了小鬼怪 */
    PackCheckSpiritExpEquip,
    PackSmletCate, //选中一个熔炼的大类
    PackSmletType, //选中一个熔炼的小类
    ShowSmeltTipsWin,//背包不足提示熔炼
    MovePackItemList,//背包间物品列表移动
    PackGetItemTip,//获得物品弹框提示
    PackCheckPropTips,//检查道具背包界面红点
    PackUpdateCode,//背包获得道具
    PackHookGetTips,//挂起快捷使用窗口（弹结算界面的时候暂时隐藏）;参数:true or false
    //------------ 商城 ----
    ShopBuyItem,
    /**购买并立即使用 */
    ShopBuyAndUse,
    /**守护续费 */
    ShopRenewSpirit,
    /**更新神秘商店免费刷新 */
    MysteryShopFreeRefresh,

    /**发送扩容请求 */
    PackExtendSend,

    //===============炼器（强化）===============
    Strength,

    //===============外形===============
    ShapeListUpdate,//外形列表更新
    ShapeUpdate,//外形更新
    ShapeUpgrade,//外形进阶（宠物/坐骑）(祝福值更新)
    ShapeUpgradeEx,//外形进阶扩展（神兵/翅膀/法宝）(祝福值更新)
    ShapeActivate,//外形激活
    ShapeDressEquip,//穿戴外形装备
    ShapeUpgradeEquip,//升级外形装备
    ShapeUpgradeChangeEx,//升级化形（宠物/坐骑）
    ShapeChangeModel,//幻化模型
    ShapeChangeModelSuccess,//幻化模型成功
    ShapeChangeModelCancel,//取消幻化模型
    ShapeChangeModelCancelSuccess,//取消幻化模型成功
    

    //===============复活===============
    Revive, // 参数：{revivalType:ERevivalType.ERevivalTypeInSitu,priceUnit:EPriceUnit.EPriceUnitGold}
    ReviveShowTireWin,// 显示回城cd
    //=============
    BuffChange,//buff 改变
    //===============广播/消息===============
    ShowRollTip,
    ShowBroadStory,//显示客户端自定义的剧情广播;{msg:广播内容,isFirst:是否插入开头(true 播完正在显示的会立刻播放该条)}
    ShowBroadTopTip,//顶部缩放提示
    ShowBroad,//发送客户端自定义广播
    //===============场景===============
    ChangeMapAndPosition,
    ChangeMap,
    SceneTestJump,
    RoleScaleHide,//主角切地图缩小缓动
    PetTalk,//宠物说话
    BossBuffUpdate,//Boss无敌buff更新
    BossLifeViewHide,//隐藏boss血条
    RoleJumpComplete,//角色跳跃结束
    //===============技能===============
    SkillUpgradeOneKey,//一键升级技能
    /**技能位置更新了 */
    SKillPosUpdated,
    SkillUpgradeAll,//全部升级技能

    //===============系统设置===============
    SysSettingInit,//初始化
    HideOther,//屏蔽其他玩家
    NoShake,//屏蔽震屏
    HideEffect,
    HideTitle,//屏蔽称号
    HideMonster,//屏蔽野怪
    HaveNoSound,//静音
    MusicVolume,//背景音乐音量
    EffectVolume,//特效音量
    Onhook_Point,//定点挂机
    AutoPickUp,//自动拾取
    PickUpWhite,//白色装备
    PickUpBlue,//蓝色装备
    PickUpPurple,//紫色装备
    PickUpOrange,//橙色装备
    PickUpCopper,//铜钱
    PickUpOther,//其他
    AutoSell,//自动出售
    AutoRecycle,//宠物自动吞噬低分紫装（背包格子<5）
    AutoTeam,//离线组队
    AutoRelive,//自动买活
    SysSettingGuide,//设置面板引导红点
    BossFollow,//boss关注设置
    BossSetList,//是否设置过boss关注状态
    AutoXP,//自动释放合击
    AutoCopyStateChange,//是否可自动进入各种副本的状态改变
    SetFightMode, //设置战斗模式
    HideOtherEffect,//屏蔽其他玩家特效

    //=====秘籍
    CheatsShowPreviewWin, //秘籍显示总览界面
    CheatsShowSelectwWin, //秘籍显示选中镶嵌界面
    CheatsShowExchangewWin, //秘籍显示置换界面
    CheatsReqEmbed, //请求秘籍镶嵌
    CheatsReqExchange, //请求秘籍置换
    CheatsAddToEmned,//添加镶嵌的秘境;参数:ItemData
    CheatsItemTips,//秘境图标tips;参数:ItemData
    CheatsHidePreviewWin,//关闭秘境总览图标tips;

    //============副本===============
    CopyReqExit,//请求退出副本
    CopyReqEnter, //请求进入副本 参数为副本code
    CopySwitchHomeStatu,//进入副本 切换主界面状态 参数：要切换到的控制器下标值（目前就 0 1(进入副本发1)）
    CopyDelegate,//请求扫荡副本;参数:副本code,key1,是否询问
    CopyGetTowerDayReward,//领取诛仙塔每日奖励
    CopyTowerReqLottery,//诛仙塔抽奖;参数:lotteryType
    CopyGetTowerDayRewardForOpen,//领取诛仙塔每日奖励
    CopyShowExpEffect, //显示领取经验的特效; 参数:开始点（全局坐标）
    CopyDefendDlg, //显示守护副本的扫荡
    CopyShowCallBoss, //显示守护副本的召唤boss
    CopyShowQCRank, //显示穹苍幻境副本的排行
    CopyTowerDie,
    copyShowExpReward,
    copyHideExpReward,
    copyReqAssit,//请求协助
    //CopyGuildDefendStart,//仙盟守护副本开始倒计时进入挂机
    //CopyGuildDefendStop,//仙盟守护副本停止倒计时挂机
    CopyGuildShowAtkBoss,//仙盟守护副本boss出现了;参数:{entityInfo:(null表示boss死了)}
    AddCopyEnterNum,//增加副本次数
    ShowGetExpEffect,//显示获得经验
    RefreshCopyCDTime,//请求刷新副本恢复次数
    PlayerCopyInfoUpdate, //副本进度信息更新
    PlayerCopyCheckPoint, //通关关卡
    CloseCopyView,//副本中掉线，强制关闭副本信息界面
    ComboViewUpdate,//副本连斩
    //============Boss副本===============
    BossReqEnterCopy, //请求进入boss副本
    BossRouteToBossGrid,//寻路到boss点并挂机 参数:bossCode,mapId
    BossRefrishNotice, //boss刷新前一分钟提示
    BossReqEnterPersonalBoss,//请求进入个人boss
    BossHideBossInfoWin,//显示隐藏boss信息
    WorldBossAutoFight,//自动挑战野外boss
    BossReqSecretRoundDice,//请求摇骰子
    BossSecretHideDice,//隐藏色子界面
    BossSecretHideLeave,//隐藏离开界面
    TimeLimitBossEnter,//请求进入限时世界boss副本
    TimeLimitBossAddBuff,//限时boss鼓舞请求
    TimeLimitBossDropUpdate,//限时世界boss掉落更新
    TimeLimitBossShowDropBtn,//显示抢奖励按钮
    TimeLimitBossBetterEffect,//抢到红装特效
    HideBossRefreshTips,//隐藏boss刷新提示
    HideActivityWarTips,//隐藏战场活动开启提示

    EnterQiongCangBoss,//进入穹苍Boss副本
    ShowQiongCangAlert,//穹苍boss二级提示
    //============跨服Boss副本===============
    CrossBossReqEnterCopy, //请求进入跨服boss副本
    CrossBossListUpdate, //跨服boss列表更新
    CrossBossCanclOwn, //跨服boss取消归属
    CrossBossResult, //跨服boss结算
    CrossTips, //跨服boss红点
    CrossBossGuildRewardWin, //跨服神兽入侵 奖励窗口
    CrossReqGuildBoss, //请求进入神兽入侵boss副本
    CrossReqDropLog, //请求掉落记录
    //==================聊天========
    ChatSendPos, //发送坐标
    ChatHomePanelVisible, //设置主界面聊天区域的显示或者隐藏:true or false
    ChatAppendText, //把聊天内容添加都输入框末尾 : text
    ChatReplaceText, //把输入框的内容替换成该内容 : text
    ChatSendText, //直接发送内容
    ChatAddItem, //添加物品到聊天
    /**发送消息; 参数:{content:,chatType:}  */
    ChatSendMsg, //
    ChatSendKf, //发送客服
    ChatUnreadUpdate,//未读信息更新 参数:chanel,unreadNum
    ChatAddChanelMsg,//客户端添加聊天消息
    ChatAddToBroad,//把聊天内容放在广播显示:
    ChatGetChanelCacheMsg,//获取聊天的离线缓存数据;参数:chatType pageSize（每页的数量,默认是每个频道最大数量50） pageIndex(第几页 0开始,默认是0)
    ChatPrivateUpdate,//私聊消息更新;参数:{entityId:entityId,talkDt:msg.chatDt}
    ChatDelPlayerMsg,//删除某个玩家的消息;参数:{entityId:entityId}
    //============战斗===============
    TestUseSkill,//测试技能
    UseSkill,//使用技能
    CoolSkill,//冷却技能
    CheckBattleObj,//定时检测战斗目标
    FocusAttack,//多角色全部集中攻击某个单位
    BattleObjChange,//攻击目标改变
    LockAttack,//锁定攻击
    NearAttackSwitch,//就近攻击挂机模式切换

    //===============小地图===============
    /**前往挂机点 */
    WorldMapGotoPropose,

    //===============仙盟===============
    GuildCreate,
    GuildGetInfo,
    /**获取仙盟申请列表 */
    GuildGetApplyList,
    /**获取仙盟成员列表 */
    GuildGetMemberList,
    GuildSearch,
    GuildApply,
    GuildApplyOneKey,
    GuildSaveNotice,
    /**获取公告次数 */
    GuildGetNoticeNum,
    /**处理申请 */
    GuildDealApply,
    /**保存申请设置 */
    GuildApplySetSave,
    /**自动批准保存 */
    GuildApplyAutoAgreeSave,
    GuildUpgrade,
    GuildGetDailyReward,
    GuildExit,
    GuildDisband,
    /**踢出仙盟 */
    GuildKickOut,
    /**转让盟主 */
    GuildTransferLeader,
    /**升级为副盟主 */
    GuildPromoteDeputyLeader,
    /**升级为长老 */
    GuildPromotePresbyter,
    /**解除副盟主 */
    GuildRelieveDeputyLeader,
    /**解除长老 */
    GuildRelievePresbyter,
    /**升级心法 */
    GuildVeinUpgrade,
    /**获取仓库数据 */
    GuildWarehouseGetData,
    /**捐献装备 */
    GuildDonateEquip,
    /**兑换装备 */
    GuildChangeEquip,
    /**兑换物品 */
    GuildChangeItem,
    /**销毁物品 */
    GuildDestroyEquip,
    /**获取神兽信息 */
    GuildBeastGodInfoGet,
    /**捐献兽粮 */
    GuildBeastGodFoodDonate,
    /**挑战神兽 */
    GuildBeastGodOpen,

    //-----新仙盟
    GuildNewOpenSearchWin, //还没加入仙盟打开的搜索结果界面
    GuildNewOpenLookupAply, //查看申请列表
    GuildNewReqAplyJoin, //请求加入仙盟
    GuildNewOpenCreate, //打开创建仙盟界面
    GuildNewReqCreate, //请求创建仙盟
    GuildNewReqGuildInfo, //请求仙盟信息
    GuildNewReqGuildMember, //请求仙盟成员信息
    GuildNewReqGuildAplyList, //请求仙盟申请列表
    GuildNewReqApplySetSave, //请求保存设置
    GuildNewReqAutoAgree, //请求保存自动同意设置
    GuildNewReqDealAply, //处理玩家申请入会
    GuildNewReqExit, //退出仙盟
    GuildNewReqSaveNotice, //保存公告
    GuildNewOpenModifyNotice, //打开修改公告窗口
    GuildNewOpenDonateWin, //打开捐献窗口
    GuildNewReqDonate, //请求捐献,参数:option,num
    GuildNewReqChangePosition, //请求改变职位,参数:toPlayerId,opt
    GuildNewReqUpgradeGuild, //请求升级仙盟
    GuildNewReqSearch, //请求搜索仙盟 { "name": "", "includeFull": true }
    GuildNewReqGuildLog, //请求仙盟日志 {pageSize:pageSize,pageIndex:pageIndex}
    GuildNewPlayerGuildInfoUpdate, //仙盟信息更新了
    GuildAllocateItemUpdate,//分配物品数量选择更新
    GuildReqAllocateItem,//请求分配物品

    //===============仙盟活动===============
    GuildDonateFirewood, //捐献柴火

    SevenDaysReqGetReward, //七天登录请求领奖
    //===============VIP===============
    VipUpdate,
    VipReqVipReward,
    VipRewardUpdate,
    VipGiftTips,
    //===============VIP礼包===============
    VipGiftInfoUpdate,

    //===============炼器===============
    /**开启洗炼槽 */
    OpenRefresh,
    //历练
    TrainGodWPAttrDetail, //神器属性窗口
    TrainActGodWeapon, //激活神器;code
    TrainActGodWeaponPiece, //激活神器碎片;code,piece
    TrainGodWeaponInfo,//神器信息返回
    OpenShowDetailPanel,//打开神器收集器界面
    TrainShowIllustrateUpgrateView,//打开图鉴升级界面
    TrainHideIllustrateUpgrateView,//打开图鉴升级界面
    TrainShowIllustrateDecomposeView,//打开图鉴分解界面
    TrainShowIllustrateSuitTip,//打开图鉴套装详情界面
    TrainIllustrateDecomposeClick,//点击图鉴分解
    TrainGetStageReward,//领取达到固定阶的奖励，例如：爵位奖励；参数：type:EStrengthenExType,level:当前等级
    TrainNewGodWeaponActive,//新神器激活
    TrainGodWeaponInfoUpdate,//神器数据更新
    TrainShowGetWindow, //图鉴获取途径
    TrainHideGetWindow, //关闭图鉴获取途径
    TrainGetDailyScore,//领取历练值 参数：事件类型
    //===============组队===============
    /**创建队伍 */
    CreateTeam,
    /**退出队伍 */
    ExitTeam,
    /**踢出队伍 */
    KickOutMember,
    /**申请入队 根据 队长entityId 入队*/
    ApplyEnterTeam,
    /**申请入队 根据 groupId 入队 */
    ApplyExEnterTeam,
    /**改变队伍目标点 */
    TeamTargetChange,
    /**获取队伍列表 */
    TeamListRefresh,
    /**自动匹配 */
    TeamAutoMatch,
    /**队伍世界喊话 */
    TeamWorldShow,
    /**进副本确认 */
    TeamEnterCopyCheck,
    /**变更队伍自动化设置 */
    TeamAutoSettingChange,
    /**处理申请入队信息 */
    TeamApplyDeal,
    /**邀请玩家入队 */
    TeamInvitePlayer,
    /**请求附近玩家列表 */
    GetNearbyPlayerList,
    /**忽略所有组队邀请 */
    TeamAllIgnoreInvite,
    /**更新Home队伍图标小红点 */
    TeamTipsIconUpdate,
    /**组队发送聊天邀请 */
    TeamInviteSend,

    //===============组队2===============
    /**创建队伍 */
    CreateTeamCross,
    /**请求队伍列表 */
    GetTeamListCross,
    /**退出队伍 */
    ExitTeamCross,
    /**踢出队伍 */
    KickOutMemberCross,
    /**申请入队 根据 队长entityId 入队*/
    ApplyEnterTeamCross,
    /**开启副本*/
    EnterCopyCross,
    /**快速加入*/
    QuickJoinTeamCross,
    /**打开队伍界面 */
    TeamCrossOpen,
    /**关闭队伍界面 */
    TeamCrossHide,
    /**关闭队伍界面 */
    TeamCrossInfoUpdate,
    /**队员列表更新 */
    TeamMemberListUpdate,
    /**跨服世界邀请 */
    TeamCrossInviteWorld,
    /**跨服帮派邀请 */
    TeamCrossInviteGuild,
    /**跨服好友邀请 */
    TeamCrossInviteFriend,

    //===============转职===============
    /** 一键完成*/
    ChangeCareerOneKey,

    //===============成就===============
    /**获取成就信息 */
    GetAchievementInfos,
    /**领取成就奖励 */
    AchievementRewardGet,
    /**一键领取成就奖励 */
    AchievementRewardGetALL,
    /**获取成就总览信息 */
    GetAchievementAllInfo,

    //===============日常===============
    /**前往日常事件 */
    DailyGotoEvent,
    /**剑池升级 */
    DailySPUpgrade,
    DailySPChangeModel,
    DailySPGetActivityReward,
    DailySPNotShow,

    //===============合成===============
    ComposeSelectedEquip,
    ComposeUnDressEquip,
    ComposeReqPlan,//参数:smeltPlanCode 

    //========神羽===============
    GodWingReqQickSmelt, //请求快速合成 参数:roleIndex:number,StrengthenExType:number,type:number
    GodWingReqEmbeded, //请求装备神羽 参数：roleIndex:number,StrengthenExType:number,type:number
    GodWingReqTransfer,//请求转换神羽 参数:StrengthenExType:EStrengthenExType,fromItemCode:number,toItemCode:number,amount:number
    GodWingLookupMaster, //查看神羽大师;参数:roleIndex
    //===============指引===============
    GuideTest,
    GuideAfterTask,
    /**根据任务指引 */
    GuideByTask,
    GuideCodeProcess,
    GuideTaskTrace,//指引任务追踪
    GuideHeji,//指引合击
    GuideHejiHide,//隐藏合击指引
    GuideCheckPoint,//指引关卡挑战
    GuideOnTaskTraceClick,//任务追踪点击了

    GuidePanelShow,//显示通用的指引模型界面;数据在 GuideOpenUtils.getGuideData()
    GuidePanelHide,
    GuideSelectAutoXp,//指引选中自动必杀
    GuideNavbarReturn,//指引返回
    //===============称号===============
    /**佩戴称号 */
    TitleUse,
    /**卸下称号 */
    TitleUnload,

    //===============福利===============
    WelfareUpdate,
    ReqPrivilegeReward,
    MonthCardInfoUpdate,
    PrivilegeCopySetOpen,//打开特权月卡设置界面

    //===============排行榜=============
    /**请求排行榜数据 */
    GetRankList,
    /**排行榜数据更新 */
    GetRankInfoUpdate,

    //===============关卡=============
    /**挑战关卡 */
    EnterPointChallenge,
    /**能量改变特效 */
    ShowEnergyEffect,
    /**关卡进度更新 */
    CheckPointUpdate,
    /**关卡进度更新 */
    CheckPointCanChellengeUpdate,

    //===============三角色引导=======
    PunchLeadCopyResetFlag,
    OpenRoleModuleShow,

    OpenCheckNext,

    //===============转生=============
    /**转生请求 */
    Reincarnation,
    /**等级换取修为 */
    UseRoleExp,
    /**关卡换修为 */
    UseCheckPointExp,

    //==========platform========
    PlatformShowMicorReward,
    PlatformShowFollowReward,
    PlatformShowShareReward,

    //===============神装=============
    /**获取对应合成的神装 */
    GetGenerateGodEquip,

    //===============Tip=============
    TipAdd,

    //=============充值
    RechargeReqSDK,
    RechargeActInfo,
    //===============竞技场=============
    //王者争霸开始匹配
    KingBattleMatching,
    //进入战斗
    EnterKingBattle,
    //王者争霸数据更新
    KingBattleInfoUpdate,
    /**请求排行榜数据 */
    GetBattleRankInfo,

    //=========强化=========
    ForgeImmortalOpt, //显示神兵操作;参数:roleIndex,cmdType,subType
    ForgeImmortalShowSkillTips, //显示技能tips 参数:{roleIndex:,subType:}
    
    //===============邮件=============
    MailQuery,
    //===============寻宝=============
    LotteryRequest,//寻宝请求
    LotteryGetLog,//获取寻宝日志
    LotteryGetCountReward,//领取累计寻宝次数奖励

    //===============活动=============
    /**活动通用领奖事件 */
    ActivityGetReward,
    /**天天返利活动领奖 */
    ActivityRebateGetReward,
    /**每日累充领奖 */
    ActivityDayRechargeReward,
    /**移除活动 */
    ActivityRemove,
    /**新增活动 */
    ActivityAdd,
    /**查看冲榜排名 */
    CheckActivityRank,
    /**显示积分兑换窗口 */
    ActivityScoreExcWin,
    ExchangeWinShow,
    /**每日充值快捷入口 */
    OpenDayRecharge,
    /**每日充值直升丹展示界面 */
    OpenDayRechargeShow,

    //==============遭遇战===============
    ReqEncounterInfo,
    ReqEncounterRank,
    ReqEncounterChallenge,
    EncounterResult,
    EncounterTipChange,
    EncounterOpen,
    EncounterClose,

    //==============龙脉夺宝===============
    ReqEnterMiningCopy,
    ReqEnterMiningChallengeCopy,
    ReqOperateMining,
    ReqUpgradeMining,
    ReqFastMining,
    ReqGetMiningReward,
    ReqGetMiningRecord,
    UpdateMyMiningInfo,
    UpdateMiningInfo,
    UpdatePlayerMiningInfo,
    UpdateMiningMaxFloor,
    UpdateMiningRecord,
    UpdatePlayerMiningRecord,
    UpdateMyMiningHireInfo,
    MiningResult,
    MiningResultClose,
    UpdateMyMiningCountdown,
    StartMyNewMine,
    UpdateMyRecordTips,

    //==============玩法===============
    EnterGamePlay,//请求进入阵地争夺
    GamePlayWindowOpen,//打开玩法入口界面

    //==============七天法宝===============
    GetSevenDayMagicWeapon,//向服务器请求法宝数据

    //==============好友===============
    GetFriendListByType,//获取好友列表(类型 EFriendFlag)
    FriendRemove,//删除好友
    FriendAddToBlackList,//拉黑玩家
    FriendAddPrivateChat,//添加一个私聊玩家到最近联系人列表;参数: {player:this.playerData.miniPlayer,talkDt:0}
    FriendReqOfflineMsg,//请求离线玩家消息
    FriendRemoveReadMsgId,//删除一个已经读消息玩家的id(离线列表和在线未读列表);参数:玩家id
    FriendCrossShield,//添加跨服场景临时黑名单，参数：playerId
    //==============符文===============
    RuneDecompose,//符文分解

    //=============法器强化===========
    UpLevelMgaicWeapon,//法器强化
    MagicWeaponUpdate,
    MagicShapeDataUpdate,
    MagicUIClose,
    MagicShowCSSkill,//显示五色石技能tips

    //心法系统
    ActiveHeartMethod,
    UpLevelHeartMethod,
    ReplaceHeartMethod,
    EquipHeartMethod,
    HeartMethodDecompose,

    //=============天赋===========
    TalentReplaceWindowOpen,//打开天赋装备窗口
    TalentReplaceWindowHide,//关闭天赋装备窗口
    TalentAttrDetailViewOpen,//打开属性详情
    TalentSkillResetViewOpen,//打开技能点重置
    TalentSkillTipOpen,//打开技能tips

    //===========实名验证===========
    CertificationOpenWindow,
    CertificationOpenGiftWindow,
    CertificationSend,

    //领取在线奖励
    GetOnlineReward,
    //在线奖励领取状态更新
    OnlineRewardStateUpdate,
    //
    EquipToLaw,

    //=============巅峰竞技===========
    PeakGetPeakInfo,		//获取戴峰赛季赛况
    PeakGetPeakRecord,		//获取戴峰赛季比赛记录
    PeakGetPeakBetRecord,		//获取戴峰赛季下注赛况
    PeakGetPeakOwnRecord,		//获取戴峰赛季海选自己记录
    PeakGetPeakPopularityRank,	//获取戴峰赛季人气排行
    PeakSignUp,		//戴峰赛季报名
    PeakWorship,		//戴峰赛季膜拜
    PeakLike,		//戴峰赛季点赞
    PeakBet,		//戴峰赛季下注
    PeakStateUpdated,		//状态已更新
    PeakStateChanged,		//状态改变
    PeakBetUpdate,	//下注更新
    PeakTipsChanged,	//红点更新
    PeakCountdownUpdated,	//倒计时更新

    //===============1VN竞技===============
    ContestStateUpdate,
    ContestQualificationInfoUpdate,
    ContestInfoUpdate,
    ContestReqSign,
    ContestReqQualificationInfo,
    ContestReqContestInfo,
    ContestReqRoundInfo,
    ContestReqPairInfo,
    ContestReqBet,
    ContestReqBetInfo,
    ContestMatchCountdownUpdate,
    ContestStateChanged,
    ContestCheckIcon,

    //===============3V3竞技===============
    QualifyingStateUpdate,
    QualifyingInfoUpdate,
    QualifyingCopyInfo,
    QualifyingCopyInfoUpdate,

    QualifyingReqInfo,
    QualifyingReqMatch,
    QualifyingReqCancelMatch,
    QualifyingReqEnterCopy,
    QualifyingReqRanks,
    QualifyingReqGetDayRewards,
    QualifyingReqGetGoalReward,
    QualifyingReqFriendList,
    QualifyingStateChanged,
    QualifyingTipsChanged,

    //战场活动开启提醒
    ActivityWarTipsUpdate,
    /**青云之巅楼层改变提示 */
    ShowCrossStairFloorTips,
    /**隐藏玩家战斗列表 */
    HidePlayerFightView,

    //=============神兽助战===========
    BeastBattleDressEquip, //装备
    BeastBattleUndressEquip, //卸下装备
    BeastBattleUndressEquipAll, //卸下所有装备
    BeastBattleBeckon, //出战
    BeastBattleRecall, //召回
    BeastBattleAddMaxBeckonNum, //增加出战上限
    BeastBattleStrengthenEquip, //强化装备
    BeastBattleDecomposeEquip, //分解装备
    BeastShowSkillTips,//显示神兽技能tip

    //-----------微信小游戏
    WXGetSeverListSuccess,//获取服务器列表成功后的事件
    WXLoadConfigSecondStart,//微信小游戏开始加载配置
    WXLoadConfigSecondFinish,//微信小游戏加载完成

    //-----------外观进阶、激活成功展示界面
    OpenUpgradeSuccessView,
}