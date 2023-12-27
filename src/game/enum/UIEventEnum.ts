/**
 * 界面操作发送的事件
 */
enum UIEventEnum {
    /**打开模块 */
    ModuleOpen = 70000, // 可以发 {tabIndex:,cName:,} 选择 控制器
    /**关闭模块 */
    ModuleClose,
    /**打开了模块 */
    ModuleOpened,
    /**关闭了模块 */
    ModuleClosed,
    /**模块打开/关闭 */
    ModuleToggle,
    /**视图打开了 */
    ViewOpened,
    ViewClosed,
    /**fui包加载成功 */
    PackageLoaded,
    /**打开剧情页 */
    StoryOpen,
    /**打开欢迎页 */
    WelcomeOpen,
    /** 显示导航栏*/
    NavbarOpen,

    /**战斗/非战斗切换 */
    SwitchUI,
    HomeTopIconShowChange,

    /**显示物品ToolTip */
    ToolTipShowItem,
    /**显示ToolTip */
    ToolTipShow,


    /**点击战斗界面技能按钮 */
    ClickMainSkillItem,

    //===============场景===============
    SceneClickNpc,
    /**场景地图已更新 */
    SceneMapUpdated,
    /**主角坐标改变 */
    SceneRolePosUpdated,

    //===============主界面=============
    HomeAddTaskTrace,
    HomeSwitchMount,
    /**主界面显示战斗力增加 */
    HomePlayFightAdd,
    HomeOpened,
    /**打开变强窗口 */
    HomeStrongerOpen,
    /**显示战斗面板 */
    HomeBattlePanelShow,
    /**冲榜排名图标更新 */
    HomeActicityRankIcon,
    ShowGM,

    //===============背包===============
    /**打开熔炼窗口 */
    PackSmeltOpen,
    /**打开拆分窗口 */
    PackSplitOpen,
    /**打开批量使用窗口 */
    PackUseOpen,
    /**打开自选礼包使用窗口 */
    PackChooseGiftBagWindowOpen,

    /**打开扩展窗口 */
    PackExtendOpen,
    /**关闭扩展窗口 */
    PackExtendHide,
    /**背包快速使用物品 */
    PackQuickUseItem,
    /**播放背包特效 */
    PackPlayEffect,

    //===============人物===============
    // PlayerOpenRoleWindowOpen,
    PlayerOnekeyEquip, //一键换装: {derssPosAll:[]} 所有穿戴位置
    PlayerModifyNameWindowShow,//显示改名窗口

    //===============任务===============
    TaskTraceOpen,
    TaskTraceClick,//点击任务追踪
    TaskFlyReward,//飘任务奖励


    //===============外形===============
    /**打开吞噬窗口 */
    PetSwallowOpen,
    /**打开技能视图 */
    ShapeSkillTipViewOpen,
    /**打开套装详情 */
    PetSuitDetailViewOpen,
    /**幻形道具tip */
    ShapeChangePropTip,
    /**打开装备替换窗口 */
    ShapeEquipReplaceOpen,

    //===============副本===============
    CopyClickBuff, //副本请求添加buff (鼓舞/效率) 参数:buff类型 1 鼓舞 2 效率
    CopyExpClearCd,//点击清除副本cd按钮(九幽)
    CopyAddTime,//点击增加副本次数按钮
    CopyEnterModle,//点击组队中的进入模式按钮,参数:模式枚举 CopyEnum.ENTER_MODEL_XX ,副本id;
    CopyInspire, //鼓舞 参数：鼓舞类型 CopyEnum.INSPIRE_XX
    CopyReqReceiveExpCopy, //领取经验副本奖励，参数：倍数 
    BossExplainShow, //显示玩法说明;参数:{desc:""}
    BossShowAttr, //显示boss属性数据 ,参数:
    BossReqKillRecord,//获取击杀记录:copyCode bossCode
    BossSetOpen,//打开boss设置界面
    BossRewardPanelOpen,//打开boss奖励界面
    TimeLimitBossRewardOpen,//打开限时世界boss奖励界面
    CopyLegendStrategedOpen,//打开传奇之路攻略界面
    QiongCangBossRewardOpen,//打开穹苍阁Boss副本奖励界面
    BossComingRewardOpen,//Boss来袭奖励界面
    //===============创角===============
    CreateReturn,
    //============聊天    
    ChatShowCopyMsg,//显示一个复制按钮 复制聊天内容
    ChatClickLink,//点击聊天区域的链接
    //ChatEditLang,//编辑常用语
    ChatSaveLang,//修改保存常用语
    ChatClickSend,//点击发送
    ChatEditeChange,//常用语编辑状态改变;参数:id,editeStaute

    //===============世界地图===============
    WorldMapShowRegionMap,
    WorldMapShowProposeMap,

    //===============商店===============
    /**打开守护续费 */
    ShopRenewSpiritOpen,
    /**购买 */
    ShopBuyOpen,
    /**快速购买 */
    QuickShopBuyOpen,
    /**快速合成（伪装成购买） */
    QuickComposeBuyOpen,
    /**打开极品装备预览 */
    BestEquipOpen,

    //===============仙盟===============
    /**点击仙盟按钮 */
    GuildClickIcon,
    /**打开创建仙盟 */
    GuildCreateOpen,
    /**打开仙盟公告 */
    GuildNoticeOpen,
    GuildApplySetOpen,
    /**打开仙盟捐献窗口 */
    GuildDonateWindownOpen,
    /**仙盟道具获取窗口 */
    GuildPropGetWindownOpen,

    //===============符文===============
    /**打开符文背包 */
    RunePackOpen,
    RunePandectOpen,
    /**打开符文属性详情 */
    RuneDetailOpen,
    /**关闭符文背包 */
    RunePackClose,

    //===============好友===============
    /**查找好友窗口 */
    SearchFriendOpen,
    /**打开邮件详情 */
    MailDetailOpen,
    /**邮件图标的显示 */
    MailIconUpdate,

    //===============VIP===============
    /**打开VIP续费 */
    VipRenewOpen,
    /**打开VIP体验 */
    VipExperienceOpen,
    /**VIP3奖励 */
    Vip3RewardOpen,

    //===============组队===============
    /**打开组队目标点修改界面 */
    TeamTargetChangeOpen,
    /**打开邀请队员界面 */
    TeamInvitePlayerOpen,
    /**打开邀请总界面 */
    TeamInviteSendOpen,
    /**打开申请列表界面 */
    TeamApplyListOpen,
    /**点击模型打开信息界面 */
    TeamModelTipsOpen,
    /**打开跨服组队图标 */
    Team2IconBar,
    /**跨服组队图标倒计时 */
    Team2IconBarCount,

    //===============功能开启/预告===============
    OpenPreviewWindowOpen,
    /**飘功能图标开始 */
    OpenFlyIconStart,
    /**开启功能开始 */
    OpenFunStart,
    /**开启功能结束 */
    OpenFunEnd,

    //===============转职===============
    /**打开阶段目标界面 */
    ChangeCareerStageOpen,

    //===============日常===============
    DailyUpWindowOpen,

    //===============指引===============
    GuideByStepInfo,
    /**指引下一步 */
    GuideNextStep,
    /**刷新当前指引 */
    GuideRefreshCurrent,
    /**跳过当前指引 */
    GuideSkip,
    /**清除指引 */
    GuideClear,
    /**点击遮罩 */
    GuideMaskClick,
    /**显示遮罩模块 */
    GuideShow,

    //===============开服冲榜===============
    /**排行榜 */
    RankRushRankOpen,

    /**获取修为界面 */
    OpenRoleStateExpExchange,
    CloseRoleStateExpExchange, //关闭获取修为界面

    //===============神装===============
    /**打开神装分解窗口 */
    GodEquipDecomposeOpen,
    ShuraDecomposeOpen,

    //===============系统设置===============
    SyssetWindowOpen,

    //===============竞技场===============
    //王者争霸排名界面
    OpenKingBattleRank,
    //王者争霸段位奖励
    OpenKingBattleReward,
    //遭遇战奖励
    OpenEncounterReward,

    //挖矿结果界面
    OpenMiningResult,
    OpenMiningRob,
    OpenMiningRevenge,
    OpenMiningRecord,
    //===============必杀===============
    UniqueSkillDetailOpen,
    UniqueSkillChipDecomposeOpen,
    UniqueSkillExchangeOpen,
    UniqueSkillSuitPreviewOpen,
    UniqueSkillChipExchangeOpen,
    UniqueSkillAttrOpen,
    UniqueSkillPanelOnOpen,

    //===============寻宝===============
    /**打开寻宝仓库 */
    LotteryPackOpen,
    /**打开寻宝累计次数奖励 */
    LotteryNumRewardOpen,
    /**概率显示 */
    LotteryProbilityOpen,

    //===============我要升级===============
    /**打开升级窗口 */
    UpgradeGuideOpen,
    /**关闭升级窗口 */
    UpgradeGuideClose,

    //仙盟争霸
    GuildBattleRankOpen,//打开仙盟争霸排名
    GuildBattleOwnerRewardOpen,//查看盟主奖励
    GuildBattleDayRewardOpen,//查看每日奖励
    GuildBattleMemberOpen,//本盟成员战况
    GuildAllotRewardOpen,//仙盟仓库奖励分配
    AllotMemberSelectedOpen,//奖励分配人员界面
    GuildScoreWarehouseOpen,//打开仙盟积分兑换仓库

    //仙盟组队副本
    GuildTeamCopyRankOpen,//打开仙盟组队副本排名

    //法宝升星
    SkillInfoOpen,
    MagicWeaponDetailOpen,

    //跨服BOSS
    CrossBossShowOpen,
    CrossBossRewardOpen,
    CrossBossResultOpen,

    //心法
    HeartSkillWindowOpen,
    HeartDecpWindowOpne,
    HeartLvlUpOpen,
    HeartInfoOpen,

    //实名制
    SMStatesUpdate,

    //法阵
    LawSkillOpen,
    //巅峰
    PeakGambleOpen,
    PeakGambleInfoOpen,
    PeakPopRankOpen,

    //1VN竞技
    ContestWin,//打开界面，带类型

    //3V3竞技
    QualifyingWin,//打开界面，带类型

    //===============科举答题===============
    /**打开科举答题排行榜界面 */
    ExamRankOpen,
    /**科举答题图标 */
    ExamIconBar,
    /**打开科举界面 */
    ExamEnter,
    /**科举红点更新 */
    ExamBtnTips,

    //==============
    FirstRechargeOpen,//打开首充界面

    //===============神兽===============
    BeastEquipReplaceWindowOpen, //打开装备替换窗口
    BeastEquipReplaceWindowHide, //关闭装备替换窗口
    BeastEquipDecomposeWindowOpen, //打开装备分解窗口
    BeastExtendWindowOpen, //打开扩展窗口

    GoToGetIllustrate,

    ShowPrivilegeCardExpWindow,

    TempCardCheckWinClose,


}