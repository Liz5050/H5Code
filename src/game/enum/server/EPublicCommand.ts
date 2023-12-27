enum EPublicCommand {
	ECmdPublicErrorMsg = 131,  //错误消息    ::Message::Public::SErrorMsg [Message/Public/GamePublic.cdl]
	ECmdPublicNoticeMsg = 132,  //提示消息	  ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]

	//----- 恶魔副本（经验副本）------
	ECmdPublicMgExperienceCopyInfo = 133,  //副本信息 Message::Public::SExperienceCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgExperienceCopyInspire = 134,  //副本鼓舞 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicConnectCrossCopyAppReason = 206,	//链接跨服副本App的原因 ::Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicClosedCrossCopyAppReason = 207,	//关闭跨服副本App的原因 ::Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicCheckLoginIp = 208, //检测登录IP Message::Public::SCheckLoginIp [Message/Public/GamePublic.cdl]

	ECmdPublicMLChatMsg = 209, //机器学习聊天信息 Message::Public::SMLChatMsg [Message/Public/GamePublic.cdl]
	ECmdPublicMLChatAdvert = 210, //机器学习聊天发广告 Message::Public::SInt  [Message/Public/CdlPublic.cdl]

	//属性更新
	ECmdPublicFightAttributeBase = 20001,  //基础战斗属性    ::Message::Public::SFightAttribute [Message/Public/FightRole.cdl]
	ECmdPublicFightAttributeAdd = 20002,  //基础附加战斗属性::Message::Public::SFightAttribute [Message/Public/FightRole.cdl]
	ECmdPublicFightAttribute = 20003,  //最终战斗属性    ::Message::Public::SFightAttribute [Message/Public/FightRole.cdl]
	ECmdPublicFightAttributeEx = 20004,  //扩展战斗属性    ::Message::Public::SFightAttributeEx [Message/Public/FightRole.cdl]
	ECmdPublicFightAttributeNotShow = 20005,	// 最终战斗属性(不飘字)::Message::Public::SFightAttribute [Message/Public/FightRole.cdl]

	//设置玩家位置
	ECmdPublicRolePoint = 20010,  //玩家位置        ::Message::Public::SPoint [Message/Public/GamePublic.cdl]
	ECmdPublicResetRolePoint = 20011,  //修正玩家位置    ::Message::Public::SMovePoint [Message/Public/GamePublic.cdl]
	ECmdPublicRoleMoveTo = 20012,  //主角移动到point ::Message::Public::SPoints
	ECmdPublicAddForbidOrLockWord = 20013,  //添加禁言或锁号关键字 ::Message::Public::SAddForbidOrLockWord [Message/Public/GamePublic.cdl]

	ECmdPublicUpdateOpenDt = 20014, //更新开服时间 Message::Public::SIntDate [Message/Public/CdlPublic.cdl]

	ECmdPublicCrossCopyChannelUpdate = 20015,  //跨服副本channel更新 ::Message::Public::SSeqSCrossCopyChannel [Message/Public/GamePublic.cdl]

	ECmdPublicLogBossCreateDropOwn = 20016, //boss创建、掉落归属 ::Message::Public::SLogBossCreateDropOwn [Message/Public/GamePublic.cdl]

	ECmdPublicReloadConfigData = 20017, //热加载配置文件

	ECmdPublicLoginPhoneInfo = 20018, //登录手机信息 Message::Public::SSeqString [Message/Public/CdlPublic.cdl]

	//错误消息
	ECmdPublicErrorMsgToGate = 20019,  //错误消息    ::Message::Public::SErrorMsg [Message/Public/GamePublic.cdl]

	ECmdPublicReloadBoss = 20020, //重置怪物/刷怪 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicPlayerRechargeReturn = 20021, //玩家充值返利（特殊需求）Message::Public::SPlayerRechargeReturn [Message/Public/GamePublic.cdl]

	ECmdPublicGiveItemOnlineOrMail = 20023, //在线或邮件给予物品 Message::Public::SGiveItemOnlieOrMail [Message/Public/GamePublic.cdl]

	ECmdPublicGiveItemToGuildWarehouse = 20024, //仙盟仓库给予物品 Message::Public::SGiveItemToGuildWarehouse [Message/Public/GamePublic.cdl]

	ECmdPublicBusinessApplySucess = 20029,  //交易申请成功 NULL
	//交易信息
	ECmdPublicBusiness = 20030,  //交易消息    ::Message::Public::SBusiness [Message/Public/Business.cdl]

	//摆摊消息
	ECmdPublicStallStart = 20031,	//开始摆摊 ::Message::Public::SStallInfo [Message/Public/Business.cdl]
	ECmdPublicStallEnd = 20032,	//结束摆摊 NULL
	ECmdPublicStallItemUpdate = 20033,	//摆摊物品更新 ::Message::Public::SBusinessItemUpdate [Message/Public/Business.cdl]
	ECmdPublicStallOpen = 20034,	//打开摆摊 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicStallOpenRet = 20035,	//打开摆摊返回 ::Message::Public::SStallInfo [Message/Public/Business.cdl]
	ECmdPublicStallClose = 20036,	//关闭摆摊 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicStallBuy = 20037,	//摆摊购买 ::Message::Public::SStallBuy [Message/Public/Business.cdl]
	ECmdPublicStallLeaveWordUpdate = 20038,    //摊位留言更新  ::Message::Public::SSeqSStallLeaveWord [Message/Public/Business.cdl]
	ECmdPublicStallBuyReslut = 20039,	//摆摊购买结果 ::Message::Public::SStallBuy [Message/Public/Business.cdl]

	//系统公告
	ECmdPublicPublicNotice = 20040,	//系统公告		 ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]

	//显示登陆消息
	ECmdPublicLoginInfoShow = 20041,	//显示登陆消息		::Message::Public::SLoginInfoShow [Message/Public/GamePublic.cdl]

	// 更新排行榜
	ECmdPublicToplistUpdate = 20042,	// 排行榜更新	::Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]
	ECmdPublicUpdateToplist = 20043,	// 更新排行榜

	ECmdPublicToplistTopTenCombatCapabilities = 20044,	//战斗力排行榜前10玩家 ::Message::Public::STopTenCombatCapabilities [Message/Public/GamePublic.cdl]

	// 公共信息更新
	ECmdPublicPublicInfo = 20045,  //玩家公共数据更新 ::Message::Public::SAttribute

	ECmdPublicPublicNoticeToGate = 20046,  //系统公告ToGate ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
	ECmdPublicCrossPublicNoticeToGate = 20047,	//跨服系统公告ToGate	::Message::Public::SCrossPublicNotice [Message/Public/GamePublic.cdl]

	//队伍消息
	ECmdPublicGroupApply = 20050,//申请组队 ::Message::Public::SGroupInvite [Message/Public/GamePublic.cdl]
	ECmdPublicGroupInvite = 20051,//邀请组队 ::Message::Public::SGroupInvite [Message/Public/GamePublic.cdl]
	ECmdPublicGroupAgree = 20052,//同意组队 ::Message::Public::SGroupAgree [Message/Public/Group.cdl]
	ECmdPublicGroupLeft = 20053,//离开队伍 ::Message::Public::SGroupEntityLeft [Message/Public/Group.cdl]
	ECmdPublicGroupKickOut = 20054,//踢出玩家 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicGroupModifyCaptain = 20055,//移交队长 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicGroupModifyAllocation = 20056,//修改分配 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicGroupOffline = 20057,//玩家下线 NULL
	ECmdPublicGroupInviteEx = 20058,//邀请扩展 ::Message::Public::SGroupInviteEx [Message/Public/Group.cdl]
	ECmdPublicGroupRecject = 20059,//拒绝     ::Message::Public::SGroupAgree [Message/Public/Group.cdl]

	ECmdPublicGroupInfo = 20060,//队伍信息 ::Message::Public::SGroup [Message/Public/Group.cdl]
	ECmdPublicGroupEntityInfo = 20061,//成员信息 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicGroupRecjectApply = 20062,//拒绝申请 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicGroupRecjectInvite = 20063,//拒绝邀请 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicGroupCreateGroup = 20065,//创建队伍 ::Message::Public::SGroupTarget [Message/Public/Group.cdl]
	ECmdPublicGroupDisbandGroup = 20066,//解散队伍	NULL
	ECmdPublicGroupCreateCopy = 20067,//开启副本 ::Message::Public::SAttribute 
	ECmdPublicGroupSetGroup = 20068,//设置队伍 Message::Public::SGroupSetting [Message/Public/Group.cdl]
	ECmdPublicGroupAutoGroup = 20069,//快速入伍  Message::Public::SGroupAuto [Message/Public/Group.cdl]

	ECmdPublicGroupPoints = 20071, //队员坐标 ::Message::Public::SEntityPointInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGroupEquipInfo = 20072, //队员装备 ::Message::Public::SGroupEquipInfo [Message/Public/Group.cdl]

	ECmdPublicGroupApplyList = 20073, //申请列表 ::Message::Public::SSeqGroupInvite [Message/Public/Group.cdl]
	ECmdPublicGroupNearbyList = 20074, //附近玩家列表 ::Message::Public::SSeqPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicGroupList = 20075, //队伍列表 ::Message::Public::SSeqMiniGroup [Message/Public/Group.cdl]
	ECmdPublicGroupModifyTarget = 20076, //队伍目标修改 ::Message::Public::SGroupTarget [Message/Public/Group.cdl]
	ECmdPublicGroupWorldShow = 20077, //世界喊话 NULL
	ECmdPublicGroupApplyEx = 20078, //申请组队 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicGroupMatchGroup = 20079, //队伍匹配 Message::Public::SBool [Message/Public/CdlPublic.cdl]
	ECmdPublicGroupMatchPlayer = 20080, //个人匹配 Message::Public::SBool [Message/Public/CdlPublic.cdl]
	ECmdPublicGroupCheckCopy = 20081, //副本确认状态 ::Message::Public::SCopyCheckStatus [Message/Public/Group.cdl]
	ECmdPublicGroupCheckError = 20082, //确认错误广播 ::Message::Public::SErrorMsg
	ECmdPublicGroupCheckCondition = 20083, //检查副本条件是否满足  Message::Public::SCopyCheck [Message::Public::GamePublic.cdl]

	ECmdPublicCreateGuildBoss = 20090,	//创建仙盟boss副本（只服务端用） Message::Public::SCreateGuildBoss [Message/Public/GamePublic.cdl]
	ECmdPublicResetOneGuildBoss = 20091,	//重置某仙盟boss副本（只服务端用） Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildBossBossDead = 20092,	//某仙盟boss副本boss死亡（只服务端用） Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildBossRewardShow = 20093,	//某仙盟boss副本奖励展示 Message::Public::SGuildBossRewardShow [Message/Public/GamePublic.cdl]
	ECmdPublicGuildBossLife = 20094,	//某仙盟boss副本boss血量 Message::Public::SGuildBossLife [Message/Public/GamePublic.cdl]
	ECmdPublicGuildBossHurtBoss = 20095,	//仙盟boss副本玩家对boss的累计伤害 Message::Public::SSeqLong（数组只有1个元素） [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildBossProgress = 20096,	//仙盟boss副本进度 Message::Public::SCreateGuildBoss [Message/Public/GamePublic.cdl]

	ECmdPublicFightRecord = 20099,	// 战报	Message::Broadcast::SFightRecord [Message/Broadcast/Broadcast.cdl]

	//副本命令
	ECmdPublicCopyEnterHell = 20100, //进入大厅 RMI
	ECmdPublicCopyLeftHell = 20101, //离开大厅 RMI
	ECmdPublicCopyFindPlayer = 20102, //查找玩家 RMI & ::Message::Public::SCopyPlayerRet [Message/Public/CopyDef.cdl]
	ECmdPublicCopyFindGroup = 20103, //查找队伍 RMI & ::Message::Public::SCopyFindGroupRet [Message/Public/CopyDef.cdl]
	ECmdPublicCopyCreateGroup = 20104, //创建队伍 RMI
	ECmdPublicCopyViewGroup = 20105, //查看队伍 RMI
	ECmdPublicCopyJoinGroup = 20106, //进入队伍 RMI
	ECmdPublicCopyLeftGroup = 20107, //离开队伍 RMI
	ECmdPublicCopyGroupApply = 20108, //申请入队 RMI & ::Message::Public::SGroupInvite [Message/Public/Group.cdl]
	ECmdPublicCopyGroupInvite = 20109, //邀请入队 RMI & ::Message::Public::SGroupInviteEx [Message/Public/Group.cdl]
	ECmdPublicCopyGroupAgree = 20110, //同意邀请 RMI
	ECmdPublicCopyGroupRecject = 20111, //拒绝     ::Message::Public::SGroupAgree [Message/Public/Group.cdl]
	ECmdPublicCopyGroupRecjectApply = 20112, //拒绝申请 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicCopyGroupRecjectInvite = 20113, //拒绝邀请 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]

	//队长权限
	ECmdPublicCopyEnterCopy = 20120, //进入副本 NULL , 更新玩家位置
	ECmdPublicCopyKickOutGroup = 20121, //踢出队伍     ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicCopyModifyGroupCaptain = 20122, //更换队长     ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicCopyModifyGroupAllocation = 20123, //更换分配方案 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCopyModifyGroup = 20124, //修改队伍信息 ::Message::Public::SGroup [Message/Public/Group.cdl]

	//副本队伍信息
	ECmdPublicCopyGroupInfo = 20130,//队伍信息 ::Message::Public::SGroup [Message/Public/Group.cdl]
	ECmdPublicCopyGroupEntityInfo = 20131,//成员信息 ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicCopyGroupMiniInfo = 20132,//最小信息 ::Message::Public::SGroup [Message/Public/Group.cdl]
	ECmdPublicCopyInfo = 20133,//副本信息 ::Message::Public::SDictPlayerCopy [Message/Public/Group.cdl]
	ECmdPublicCopyGroupCheck = 20134,//组队副本检查  ::Message::Public::SCopyCheck
	ECmdPublicCopyGroupError = 20135,//组队副本检查报错 ::Message::Public::SErrorMsg
	ECmdPublicCopyGroupErrorBroadcast = 20136,//组队副本错误广播 ::Message::Public::SErrorMsg
	ECmdPublicCopyGroupCheckResponse = 20137,//组队副本检查返回 ::Message::Public::SCopyCheck
	ECmdPublicCopyOperationRoom = 20138,//进出大厅	::Message::Public::SCopyRoomOperation
	ECmdPublicCopyWaitingInfo = 20139,//大厅信息	::Message::Public::SCopyWaitingInfo


	//副本操作信息
	ECmdPublicCopyPassPlayerIntoCopy = 20140,//传送玩家进入副本
	ECmdPublicCopyLeftCopy = 20141,//退出副本 NULL
	ECmdPublicCopyRefreshAiderBoss = 20142,//刷新帮助怪 ::Message::Public::SRefreshBoss [Message/Public/CopyDef.cdl]
	ECmdPublicCopyDisband = 20143,//解散副本
	ECmdPublicCopyMsg = 20144,//副本消息   ::Message::Public::SCopyMsgInfo [Message/Public/CopyDef.cdl]
	ECmdPublicCopyRePassPlayerIntoCopy = 20145,//传送玩家进入副本(不扣次数)
	ECmdPublicCopyEvent = 20146,//副本通关 ::Message::Public::SCopyEventInfo [Message/Public/CopyDef.cdl]
	ECmdPublicCopyDefeceInfo = 20147,//防守副本信息 ::Message::Public::SCopyDefenseInfo [Message/Public/CopyDef.cdl]
	//精英副本
	ECmdPublicCopyHeroGroupCheck = 20148,//精英队员进入副本
	ECmdPublicCopyInviteJoin = 20149,//邀请符合条件的玩家加入精英副本

	//仙盟操作
	ECmdPublicGuildUpdateInfo = 20150,//更新玩家仙盟信息 ::Message::Game::SPlayerGuildInfo [Message/Game/IGuild.cdl]
	ECmdPublicGuildPushInviteInfo = 20151,//推送邀请信息 (待定)
	ECmdPublicUpdateGuildMap = 20152,//初始化/更新仙盟领地 ::Message::Public::SGuildMap [Message/Public/GamePublic.cdl]
	ECmdPublicRemoveGuildMap = 20153,//移除仙盟领地 	Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicGuildShopUpdate = 20154,//更新仙盟商店信息 ::Message::Game::SGuildShopUpdate [Message/Game/IGuild.cdl]
	ECmdPublicGuildStructureInfo = 20159,//仙盟建筑信息更新     ::Message::Game::SGuildStructureInfo [Message/Game/IGuild.cdl]
	ECmdPublicGuildApplyNum = 20160,//仙盟申请人数   ::Message::Game::SGuildApplyNum  [Message/Game/IGuild.cdl]
	ECmdPublicGuildWelcome = 20161,//欢迎仙盟新成员     ::Message::Game::SGuildWelcome [Message/Game/IGuild.cdl]
	ECmdPublicGuildNewMember = 20162,//新会员加入（弹欢迎窗口） ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicGuildLeaderImpeachInfo = 20164,//推送盟主弹劾信息 ::Message::Game::SGuildLeaderImpeach[Message/Game/IGuild.cdl]
	ECmdPublicGuildLeaderImpeachEnd = 20165,//盟主弹劾结束		NULL
	ECmdPublicGuildPartyOpen = 20166,//仙盟宴会开始	::Message::Game::SGuildPartyOpen [Message/Game/IGuild.cdl]
	ECmdPublicGuildPartyClose = 20167,//仙盟宴会结束	NULL
	ECmdPublicGuildPartyHot = 20168,//仙盟宴会气氛值	::Message::Game::SGuildPartyHot [Message/Game/IGuild.cdl]
	ECmdPublicGuildPartyHotAdd = 20169,//增加仙盟宴会气氛值 ::Message::Game::SGuildPartyHotAdd [Message/Game/IGuild.cdl]
	ECmdPublicGuildTreeWorm = 20172,//增加仙盟摇钱树刷虫 ::Message::Game::SGuildTreeRing [Message/Game/IGuild.cdl]
	ECmdPublicGuildTreeRipe = 20173,//增加仙盟摇钱树成熟 ::Message::Game::SGuildTreeRing [Message/Game/IGuild.cdl]
	ECmdPublicGuildTreeShake = 20174,//摇钱树摇一摇 NULL
	ECmdPublicGuildAttributeUpdate = 20175,//仙盟属性更新 ::Message::Public::SSeqAttributeUpdate [Message/Public/EntityUpdate.cdl]
	ECmdPublicGuildBeastInfo = 20176,//仙盟神兽信息 ::Message::Game::SGuildBeastInfo [Message/Game/IGuild.cdl]
	ECmdPublicGuildAltarOpen = 20177,//仙盟祭坛开启 ::Message::Game::SGuildAltarInfo [Message/Game/IGuild.cdl]
	ECmdPublicGuildAltarClose = 20178,//仙盟祭坛关闭 NULL
	EcmdPublicGuildBossBeKilled = 20179,//仙盟boss被击杀 ::Message::Game::SGuildBeastKilled [Message/Game/IGuild.cdl]					                       
	ECmdPublicGuildCallTogether = 20180,//仙盟召集令   ::Message::Game::SGuildCallTogetther [Message\Game\IGuild.cdl]
	ECmdPublicGuildEnterGuildAltar = 20181,//进入仙盟祭坛	NULL
	ECmdPublicGuildCallTogetherSuccess = 20182,//成功发送仙盟召集令	
	ECmdPublicGuildBookParty = 20183,//仙盟宴会预定 ::Message::Game::SGuildBookParty [Message/Game/IGuild.cdl]
	ECmdPublicGuildAltarBoxReward = 20191,//仙盟祭坛宝箱奖励 ::Message::Game::SGuildAltarBoxReward [Message/Game/IGuild.cdl]
	ECmdPublicGuildPushGuildMoney = 20192,//仙盟资源飘字下推 
	ECmdPublicGuildWarehouseItems = 20193,//仙盟仓库物品列表 ::Message::Game::SGuildWarehouseItems [Message/Game/IGuild.cdl]
	ECmdPublicGuildWarehouseApplys = 20194,//仙盟仓库申请列表 ::Message::Game::SGuildWarehouseApplys [Message/Game/IGuild.cdl]
	ECmdPublicGuildWarehouseRecords = 20195,//仙盟仓库记录列表 ::Message::Game::SGuildWarehouseRecords [Message/Game/IGuild.cdl]
	ECmdPublicGuildPurposeNoticeNum = 20196,//仙盟公告本周已通知次数 ::Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicDoubleZazenInvite = 20200,//邀请双修
	ECmdPublicDoubleZazenReply = 20201,//同意双修
	ECmdPublicDoubleZazenCanMove = 20202,//满足双修条件，可以移动到对方位置 ::Message::Public::SApplyZazen [Message/Public/ZazenPublic.cdl]
	ECmdPublicDoubleZazenToPlayerInfo = 20203,//双修对象信息  ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]

	//国运活动信息
	ECmdPublicCampTransportInfo = 20300,//国运活动时间     ::Message::Public::SCampTransportInfo [Message/Public/GamePublic.cdl]
	//宠物信息列表(缓存宠物信息)
	ECmdPublicPetInfoList = 20305, //	::Message::Game::SPetInfo [Message/Game/GateMsg.cdl]
	ECmdPublicPetModelList = 20306, // 宠物模型列表 ::Message::Game::SPetModelList[Message/Game/GameMag.cdl]

	ECmdPublicOpenBattleField = 20320,	 //开启战场 Message::Public::SBattlefieldOpen[Message/Public/Battlefield.cdl]
	ECmdPublicCloseBattleField = 20321,	 //关闭战场 NULL
	ECmdPublicGetBattleFieldList = 20322,	 //获取战场列表 NULL
	ECmdPublicGetBattleFieldResult = 20323,	 //获取战场结果 NULL
	ECmdPublicBattleFieldCampCredit = 20324,	 //战场阵营积分	Message::Public::SBattlefieldScore[Message/Public/Battlefield.cdl]
	ECmdPublicBattleFieldPlayerCredit = 20325, //战场个人积分	Message::Public::SMyScore[Message/Public/Battlefield.cdl]
	ECmdPublicBattleFieldList = 20326,	 //战场列表 Message::Public::SSeqBattlefieldInfo[Message/Public/Battlefield.cdl]
	ECmdPublicBattleFieldResult = 20327,	 //战场结果	Message::Public::SBattlefieldPlayerScores[Message/Public/Battlefield.cdl]
	ECmdPublicTreasureHunterDead = 20328,   //刺探任务挖宝者死亡 Message::Game::STreasureHunterDeadInfo [Message/Game/ITask.cdl]
	ECmdPublicBattleFieldBeKill = 20329,	 //战场被杀 Message::Public::SMiniPlayer[Message/Public/GamePublic.cdl]
	ECmdPublicBattleFieldEnter = 20330,	 //进入战场 NULL
	ECmdPublicBattleFieldLeft = 20331,	 //离开战场 NULL
	ECmdPublicVotePlayerUpdate = 20332,	 //更新玩家评价后状态 Message::Game::SVotePlayer[Message/Game/GameMsg.cdl]
	ECmdPublicComprehensionCanEnd = 20333,   //修真目标可完成
	ECmdPublicBattleFieldRankReward = 20334,	 //战场排名奖励	Message::Public::STreasureInfo[Message/Public/GamePulic.cdl]

	ECmdPublicRunBusinessUpdate = 20340,	//更新跑商信息 Message::Public::SRunBusinessInfo [Message/Game/RunBusiness.cdl]
	ECmdPublicRunBusinessStart = 20341,	//开始跑商 NULL
	ECmdPublicRunBusinessEnd = 20342,	//结束跑商 NULL
	ECmdPublicRunBusinessPlayer = 20343,	//玩家跑商 Message::Public::SPlayerRunBusiness [Message/Game/RunBusiness.cdl]
	ECmdPublicRunBusinessRefreshDt = 20344,	//跑商信息刷新时间 Message::Public::SRunBusinessRefreshDt [Message/Game/RunBusiness.cdl]
	ECmdPublicRunBusinessKillByPlayer = 20345,	//跑商中被玩家劫杀 Message::Public::SRunBusinessRefreshDt [Message/Game/RunBusiness.cdl]

	ECmdPublicCreditCount = 20350,	//统计战场阵营信息 Message::Public::SSeqPlayerCredit [Message/Public/GamePublic.cdl]

	ECmdPublicFightModelCampUnion = 20360,	// 阵营联盟	Message::Public::SAttribute

	ECmdPublicReceiveFlowerInfo = 20365,		//收花信息提示 Message::Game::SReceiveFlowerInfo [Message/Game/GameMsg.cdl]
	ECmdPublicFloatFlower = 20366,		//飘花提示	Message::Game::SFloatFlower [Messate/Game/GateMsg.cdl]
	ECmdPublicWreathEffect = 20367,		//光圈效果 Message::Game::SFloatFlower [Message/Game/GameMsg.cdl]
	ECmdPublicFloatFlowerCross = 20368,		//跨服飘花  Message::Game::SFloatFlower [Message/Game/GameMsg.cdl]
	ECmdPublicOnDropTreasureItem = 20370,		//开箱子获得宝物  Message::Public::STreasureInfo [Message/Public/GamePublic.cdl]
	ECmdPublicRefreshBoss = 20371,		//刷boss Message::Public::SBossRefreshInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAddTreasureShowItem = 20372,		//添加将要显示的物品 Message::Public::SSeqSLotteryInfo [Message/Public/GamePublic.cdl]

	ECmdPublicCrossCopyInitChannelError = 20375, // 跨服副本initchanel error Message::Public::SCrossCopyInitChannelError [Message/Public/GamePublic.cdl]

	ECmdPublicLoadSpecailActiveInnerTest = 20376,  //内网加载特殊活动 NULL

	ECmdPublicUpdateFromAddress = 20377,			//修改来源地址 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdPublicLoadOperationOnlineInnerTest = 20378, //内网加载在线操作记录 NULL

	//铜钱FB消息处理
	ECmdPublicCoinCopyCoinNum = 20400,		//副本铜钱数量 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCoinCopyCoinBeginPlay = 20401,		//开始摇奖
	ECmdPublicCoinCopyCoinEndPlay = 20402,		//结束摇奖,拾取金币怪时间 value时间(s) ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCoinCopyKillCoinBoss = 20403,		//杀死铜钱怪
	ECmdPublicCoinCopyRefreshBoss = 20404,		//BOSS刷新  value第几个BOSS ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//和平场景（战场之魂）
	ECmdPublicPeaceFieldList = 20420,		// 和平场景列表（废弃）	Message::Public::SPeaceFieldList[Message/Public/GamePublic.cdl]
	ECmdPublicPeaceFieldHurtList = 20421,		// 和平场景伤害列表	Message::Public::SPeaceFieldHurtList[Message/Public/GamePublic.cdl]
	ECmdPublicPeaceFieldRewardItem = 20422,		// 和平场景奖励道具（服务端用） Message::Public::SSeqPlayerItem[Message/Public/GamePublic.cdl]
	ECmdPublicPeaceFieldRankReward = 20423,		// 和平场景排名奖励（暂未用到） Message::Public::SSeqSPeaceFieldReward[Message/Public/GamePublic.cdl]
	ECmdPublicPeaceFieldOpen = 20424,		// 和平场景开启 Message::Public::SBattlefieldOpen[Message/Public/Battlefield.cdl]
	ECmdPublicPeaceFieldClose = 20425,		// 和平场景关闭 NULL
	ECmdPublicPeaceFieldRefreshBossTime = 20426,		// 和平场景刷boss倒计时 Message::Public::SDate [Message/Public/CdlPublic.cdl]
	ECmdPublicPeaceFieldCloseSpace = 20427,		// 和平场景退出副本倒计时 Message::Public::SDate [Message/Public/CdlPublic.cdl]

	//活动
	ECmdPublicCrossActiveList = 20449,		//跨服活动列表
	ECmdPublicActiveList = 20450,		// 活动列表
	ECmdPublicActiveListToClient = 20451,		// 活动列表给客户端
	ECmdPublicOlympicGuess = 20452,        //奥运竞猜   Message::Game::SPlayerOlympicGuessInfo [Message/Game/IActive.cdl]
	ECmdPublicGetPlayerOlympicGuessInfo = 20453,        //获取玩家奥运竞猜信息 Message::Game::SGetPlayerOlympicGuessInfo [Message/Game/IActive.cdl]

	ECmdPublicUpdateExplorerControl = 30373,		// 更新仙境控制	Message::Public::SExplorerControlUpdate [Message/Public/GamePublic.cdl]
	ECmdPublicPushExplorerControl = 30374,		// 推送仙境控制信息	Message::Public::SExplorerControlInfo	[Message/Public/GamePublic.cdl]
	ECmdPublicLotteryCopyStatus = 30375,		// 仙境副本状态（是否开启）	Message::Public::SLotteryCopyStatus	[Message/Public/GamePublic.cdl]
	ECmdPublicExplorerBroadcast = 30376,		// 仙境广播 Message::Public::SeqSPublicNotice

	ECmdPublicSpaCreateNewSpace = 30380,		//  开启温泉场景 Message::Public::SSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicSpaCloseSpace = 30381,		//  关闭温泉场景 Message::Public::SSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicSpaGetSpaList = 30382,		//  获取温泉列表 Message::Public::SSeqSSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicSpaUpdateInfo = 30383,		//  更新温泉信息 Message::Public::SSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicSpaOpen = 30384,		//	温泉系统开启	Message::Public::SSpaOpen
	ECmdPublicSpaClose = 30385,		//	温泉系统关闭	NULL

	ECmdPublicGuildFlameOpen = 30390,		//	仙盟圣火系统开启	Message::Public::SGuildFlameOpen
	ECmdPublicGuildFlameClose = 30391,		//	仙盟圣火系统关闭	NULL

	ECmdPublicBossRefreshPlan = 30410,	// 执行刷怪方案	Message::Public::SBossRefreshPlan[Message/Public/GamePublic.cdl]
	ECmdPublicBossRefreshByRing = 30411,	// 通过环数刷怪	Message::Public::SBossRefreshByRing[Message/Public/GamePublic.cdl]
	ECmdPublicBossRefreshEx = 30412,	// 执行刷怪方案(根据cell中人数决定刷怪方案)	Message::Public::SBossRefreshEx[Message/Public/GamePublic.cdl]
	ECmdPublicMagicTowerInfo = 30420,	// 爬塔副本信息 Message::Public::SMagicTowerInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMagicTowerStatue = 30421,	// 爬塔副本雕像信息 Message::Public::SMagicTowerStatues[Message/Public/GamePublic.cdl]
	ECmdPublicMagicTowerStory = 30422,	//剧情信息	
	ECmdPublicMagicTowerSweepInfo = 30423,	//扫荡信息Message::Public::SSweepInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildWarOpen = 30435,	//开始仙盟战 NULL、Message::Public::SGuildWarOpen [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarClose = 30436,	//停止仙盟战 
	ECmdPublicGuildWarScore = 30437,    //仙盟战分数            Message::Public::SGuildWarScore [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarCopyInfos = 30438,    //仙盟战副本信息        Message::Public::SGuildWarCopyInfos [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarScoreList = 30439,    //仙盟战仙盟和个人排行  Message::Public::SGuildWarScoreList [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarPlayerReward = 30440,    //个人奖励  Message::Public::SGuildWarPlayerReward [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarAllRewards = 30441,    //仙盟战奖励（服务端使用）  Message::Public::SGuildWarAllRewards [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarInfoNow = 30442,    //当前仙盟战信息  Message::Public::SGuildWarInfoNow [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarSignUpTime = 30443,    //仙盟战报名时间  Message::Public::SGuildWarSingUpTime [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarSignUp = 30444,    //仙盟战报名（服务器）Message::Public::SGuildWarSingUp [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarSignUpRemove = 30445,    //仙盟战删除报名（服务器）Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicGuildWarSignUpInfo = 30446,    //仙盟战报名信息 Message::Public::SGuildWarSingUpInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildWarEnter = 30447,    //仙盟战进入 Message::Public::SGuildWarEnter [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarEndEnter = 30448,    //仙盟战进入时间结束 NULL
	ECmdPublicGuildWarAutoEnter = 30449,    //仙盟战自动进入（服务器使用） NULL
	ECmdPublicGuildWarSetNotice = 30450,    //仙盟战报名信息通知（服务器） Message::Public::SGuildWarSetNotice [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarNextRing = 30451,    //仙盟战进入下一轮 Message::Public::SGuildWarNextRing [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarWaitNextRing = 30452,    //仙盟战等待下一轮 NULL
	ECmdPublicGuildWarLeftNum = 30453,    //仙盟战仙盟人数 Message::Public::SGuildWarLeftNum [Message/Public/GuildWar.cdl]
	ECmdPublicGuildWarCheckEnd = 30454,    //仙盟战检查是否结束(服务器使用) Message::Public::SEntityId [Message/Public/GamePublic.cdl]

	ECmdPublicToplistTitleUpdate = 30456,	//更新排行榜称号  ::Message::Game::SToplistTitleUpdate [Message/Game/GameMsg.cdl]

	ECmdPublicNpcTalk = 30457,	//NPC说话  ::Message::Public::SNpcTalk [Message/Public/GamePublic.cdl]

	ECmdPublicBattleApply = 30460,    //申请切磋  Message::Public::SBattleApply  [Message/Public/GamePublic.cdl]
	ECmdPublicBattleReply = 30461,    //回复切磋  Message::Public::SBattleReply  [Message/Public/GamePublic.cdl]
	ECmdPublicBattleStart = 30462,    //切磋等待  Message::Public::SBattleStart  [Message/Public/GamePublic.cdl]
	ECmdPublicBattleResult = 30463,    //切磋结果  Message::Public::SBattleResult [Message/Public/GamePublic.cdl]

	ECmdPublicArenaWatchFightRecord = 30467,	//观看竞技场战报(服务端使用)  Message::Public::SArenaCrossOptionMsg [Message/Public/Arena.cdl] 
	ECmdPuclicArenaFightRecords = 30468,	//获取竞技场战报 Message::Public::SArenaCrossFightRecords [Message/Public/Arena.cdl]
	ECmdPublicArenaSaveFightRecord = 30469,	//保存竞技场战报(服务端使用) NULL
	ECmdPublicArenaOpen = 30470,    //开启竞技场  Message::Public::SArenaOpen [Message/Public/Arena.cdl]
	ECmdPublicArenaClose = 30471,    //关闭竞技场  NULL
	ECmdPublicArenaBattles = 30472,    //竞技场比赛  Message::Public::SArenaBattles [Message/Public/Arena.cdl]
	ECmdPublicArenaMatch = 30473,    //竞技场配对  Message::Public::SArenaMatch [Message/Public/Arena.cdl]
	ECmdPublicArenaResult = 30474,    //竞技场比赛结果 Message::Public::SArenaResult [Message/Public/Arena.cdl]
	ECmdPublicArenaSignUp = 30475,    //竞技场报名（服务器使用） Message::Public::SArenaSignUpState [Message/Public/Arena.cdl]
	ECmdPublicArenaGiveUp = 30476,    //竞技场认输（服务器使用） NULL
	ECmdPublicArenaStart = 30477,    //竞技场比赛开始 Message::Public::SArenaStart [Message/Public/Arena.cdl]
	ECmdPublicArenaWillOpen = 30478,    //竞技场即将开始，提前10分钟出现  NULL 
	ECmdPublicArenaWaitingNum = 30479,    //竞技场等待配对人数 Message::Public::SArenaWaitingNum [Message/Public/Arena.cdl]
	ECmdPublicArenaSingUpState = 30480,    //竞技场报名状态 Message::Public::SArenaSignUpState [Message/Public/Arena.cdl]
	ECmdPublicArenaMyInfo = 30481,    //我的竞技场信息 Message::Public::SMyArenaInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaMoney = 30482,    //竞技场声望 Message::Public::SArenaMoney [Message/Public/Arena.cdl]
	ECmdPublicArenaToplist = 30483,    //竞技场排行 Message::Public::SArenaToplists [Message/Public/Arena.cdl]
	ECmdPublicArenaGetToplist = 30484,    //获取竞技场排行（服务器使用） Message::Public::SArenaGetToplist [Message/Public/Arena.cdl]
	ECmdPublicArenaMode = 30485,    //竞技场对战模式 Message::Public::SArenaMode [Message/Public/Arena.cdl]
	ECmdPublicArenaGroup = 30486,    //竞技场组成员 Message::Public::SArenaGroup [Message/Public/Arena.cdl]
	ECmdPublicArenaPause = 30487,    //竞技场暂停 NULL
	ECmdPublicArenaEndPause = 30488,    //竞技场结束暂停 NULL
	ECmdPublicArenaWeekReward = 30489,    //竞技场周奖励活动 NULL	

	//聚宝盆
	ECmdPublicGetMyCornucopia = 30490,	//获取我的聚宝盆（服务器使用） NULL
	ECmdPublicGetMyCornucopiaReward = 30491,	//领取我的聚宝盆奖励（服务器使用） NULL
	ECmdPublicCornucopiaReward = 30492,	//聚宝盆奖励（服务器使用） Message::Public::SSeqReward [Message/Public/GamePublic.cdl]
	ECmdPublicBlessToFriendCornucopia = 30493,	//向好友发送聚宝盆祝福（服务器使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicFriendBlessToMyCornucopia = 30494,	//有好友向我的聚宝盆发送了祝福 Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicMyCornucopiaInfo = 30495,	//我的聚宝盆信息 Message::Public::SMyCornucopiaInfo [Message/Public/FriendBlessPublic.cdl]
	ECmdPublicOneWayRemoveFriendRelation = 30496,	//单向解除好友关系 Message::Game::SOneWayRemoveFriendRelation [Message/Game/GameMsg.cdl]
	ECmdPublicOneKeyBlessFriendCornucopia = 30497,	//一键向好友发送聚宝盆祝福（服务器用）Message::Public::SOneKeyCornucopiaInfo[Message/Public/FriendBlessPublic.cdl]

	ECmdPublicFairylandOpen = 30500,    //苍澜海开启  Message::Public::SFairylandRing [Message/Public/GamePublic.cdl]
	ECmdPublicFairylandClose = 30501,    //苍澜海关闭  NULL
	ECmdPublicFairylandCopys = 30502,    //苍澜海副本信息  Message::Public::SFairylandCopys [Message/Public/GamePublic.cdl]
	ECmdPublicFairylandKill = 30503,    //苍澜海杀人消息  Message::Public::SFairylandKill [Message/Public/GamePublic.cdl]
	ECmdPublicFairylandTask = 30504,	//苍澜海任务 Message::Public::SFairyLandTaskInfo [Message/Public/GamePublic.cdl]
	ECmdPublicFairylandTaskSubmit = 30505,	//苍澜海提交 Message::Public::SFairylandTaskCode [Message/Public/GamePublic.cdl]

	ECmdPublicTotalFunctionCount = 30510,    //副本日志 Message::Public::SSeqTotalFunctionCount [Message/Public/GamePublic.cdl]
	ECmdPublicLogFunctionCount = 30511,	//后台功能统计日志 Message::Public::SSeqLogFunctionCount [Message/Public/GamePublic.cdl]

	ECmdPublicToplistSpecialActive = 30515,	//排行榜--特殊活动	Message::Public::SToplistSpecialActiveInfo [Message/Public/GamePublic.cdl]

	ECmdPublicFireworkOpen = 30520,	//烟花开启 Message::Public::SFireworkOpen [Message/Public/GamePublic.cdl]
	ECmdPublicFireworkClose = 30521,	//烟花关闭 
	ECmdPublicFireworkBright = 30522,	//烟花璀璨度 Message::Public::SFireworkBright [Message/Public/GamePublic.cdl]
	ECmdPublicFireworkAddEvent = 30523,	//烟花事件,服务器用 Message::Game::SFireworkEvent [Message/Game/IInteractive.cdl] 
	ECmdPublicFireworkEventRecord = 30524,	//烟花事件记录	Message::Game::SFireworkEventRecord [Message/Game/IInteractive.cdl]
	ECmdPublicFireworkEffect = 30525,	//烟花特效	Message::Public::SFireworkEffect [Message/Public/GamePublic.cdl]
	ECmdPublicFireworkAddBuff = 30526,	//烟花增加Buff	NULL

	// 结婚系统
	ECmdPublicMarryPlayerMarry = 30527,	// 玩家结婚信息	Message::Public::SPlayerMarry [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingCarStart = 30528,	// 喜车巡游开始  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingCarEnd = 30529,	// 喜车巡游结束  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingStart = 30530,	// 婚礼开始  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingEnd = 30531,	// 婚礼结束  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryRegistSuccess = 30532,	// 注册结婚成功  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingBookSuccess = 30533,	// 预约婚礼成功  Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryCeremony = 30534,	// 拜堂  Message::Public::SMarryCeremony [Message/Public/GamePublic.cdl]
	ECmdPublicMarryApply = 30535,	// 结婚申请  Message::Public::SMarryApply [Message/Public/GamePublic.cdl]
	ECmdPublicMarryReply = 30536,	// 结婚回复  Message::Public::SMarryReply [Message/Public/GamePublic.cdl]
	ECmdPublicMarryGuestInfos = 30537,	// 宾客列表  Message::Public::SMarryGuestInfos [Message/Public/GamePublic.cdl]
	ECmdPublicMarryEndCeremony = 30538,	// 拜堂结束  NULL
	ECmdPublicMarryWeddingResult = 30539,	// 拜堂结果  SMarryWeddingResult
	ECmdPublicMarryWeddingBook = 30540,	// 预约婚礼（服务器用）Message::Public::SBookWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingStatus = 30541,	// 婚礼状态	Message::Public::SWeddingStatus [Message/Public/GamePublic.cdl]
	ECmdPublicMarryEnterWedding = 30542,	// 进入婚礼场景 NULL
	ECmdPublicMarrySendMoney = 30543,	// 婚礼送钱 Message::Public::SMarryBless [Message/Public/GamePublic.cdl]
	ECmdPublicMarryReceiveMoney = 30544,	// 婚礼收钱 Message::Public::SMarryBless [Message/Public/GamePublic.cdl]
	ECmdPublicMarryGuests = 30545,	// 婚礼宾客 Message::Public::SGuestNames [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingApply = 30546,	// 索要请帖玩家 Message::Public::SWeddingApplicators [Message/Public/GamePublic.cdl]
	ECmdPublicMarryInWedding = 30547,	// 结婚庆典副本中（服务器用） NULL
	ECmdPublicMarryWeddingGuestInfo = 30548,	// 婚礼宾客信息 Message::Public::SWeddingGuestInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingCanEnter = 30549,	// 庆典开始给宾客弹框 Message::Public::SWedding [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingRepply = 30550,	// 索要请帖回复 Message::Public::SWeddingReply [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingFirework = 30551,	// 婚礼特效烟花 Message::Public::SWeddingFirework [Message/Public/GamePublic.cdl]
	ECmdPublicMarryCeremonyHadStart = 30552,	// NULL
	ECmdPublicMarryWeddingNpcShop = 30553,	// NULL
	ECmdPublicMarryWeddingMaxSweet = 30554,	// 婚礼最大甜蜜度奖励 Message::Public::SSWeddingSweetMax [Message/Public/GamePublic.cdl]
	ECmdPublicMarryInCeremony = 30555,	// 拜堂中（服务器用） NULL
	ECmdPublicMarryDivorceApply = 30556,	// 离婚申请（服务器用）Message::Public::SMarryDivorce [Message/Public/GamePublic.cdl]
	ECmdPublicMarryDivorceResult = 30557,	// 离婚申请（服务器用）Message::Public::SMarryDivorce [Message/Public/GamePublic.cdl]
	ECmdPublicMarryHasWeddingApply = 30558,	// 有索要请帖请求 NULL
	ECmdPublicMarryTestCloseWeddingCopy = 30559,	// 结束婚礼仪式(服务器内部使用)
	ECmdPublicMarryUpdateInfo = 30560,	// 玩家婚礼信息更新
	ECmdPublicMarryApplyTimeout = 30561,	// 结婚申请超时 NULL
	ECmdPublicMarryPlayerMarryTree = 30562,	// 姻缘树 Message::Public::SPlayerMarryTree [Message/Public/GamePublic.cdl]
	ECmdPublicMarryWeddingInfo = 30563,	// 婚宴信息 Message::Public::SWeddingCopyInfo [Message/Public/GamePublic.cdl]

	ECmdPublicPetExploreInfo = 30570,	//宠物闯关信息 Message::Public::SPetExploreInfo [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreStart = 30571,	//宠物闯关开始（服务器用） Message::Public::SPetExploreStart [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreResult = 30572,	//宠物闯关结果 Message::Public::SPetExploreResult [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreCheckEnd = 30573,	//宠物闯关,结束检查（服务器用） Message::Public::SPetExploreCheckEnd [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreEnd = 30574,	//宠物闯关结束（服务器用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicPetExploreInFight = 30575,	//当前闯关宠物 Message::Public::SPetExploreInFight [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreRecord = 30576,	//宠物闯关记录 Message::Public::SPetExploreRecord [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreRecords = 30577,	//宠物闯关记录 Message::Public::SPetExploreRecords [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreCards = 30578,	//宠物闯关技能卡片 Message::Public::SPetExploreCards [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreUseCard = 30579,	//使用技能卡片（服务器用） Message::Public::SPetExploreUseCard [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreDrawRewards = 30580,	//宠物闯关领取过的区域 Message::Public::SPetExploreDrawRewards [Message/Public/PetExplore.cdl]
	ECmdPublicPetExploreStartWatch = 30585,	//进入观看宠物闯关	NULL
	ECmdPublicPetExploreStopWatch = 30586,	//停止观看宠物闯关	NULL

	//国家宝藏相关命令
	ECmdPublicTreasureSignUpStart = 30600,	//开始报名 Message::Public::STreasureCommonInfo [Message/Public/TreasureDef.cdl]
	//InterApp->GateApp, Client
	ECmdPublicTreasureStart = 30601,	//开始
	//InterApp->GateApp, CellApp, Client
	ECmdPublicTreasureEnd = 30602,	//结束
	//InterApp->GateApp, CellApp, Client
	ECmdPublicTreasureSignUpUpdate = 30603,	//报名信息更新
	//InterApp->GateApp, Client
	ECmdPublicTreasurePlayerSignUp = 30604,	//玩家报名
	//GateApp->InterApp
	ECmdPublicTreasureRestBoss = 30605,	//宝藏剩余boss Message::Public::STreasureRestBoss [Message/Public/TreasureDef.cdl]
	//CellApp->InterApp
	ECmdPublicTreasurePlayerGuard = 30606,	//玩家守护宝藏 Message::Public::STreasureGuardOrSeize [Message/Public/TreasureDef.cdl]
	//GateApp->InterApp
	ECmdPublicTreasurePlayerSeize = 30607,	//玩家抢夺宝藏 Message::Public::STreasureGuardOrSeize [Message/Public/TreasureDef.cdl]
	//GateApp->InterApp			
	ECmdPublicTreasurePlayerInfo = 30608,	//玩家宝藏信息 Message::Public::STreasurePlayerInfo [Message/Public/TreasureDef.cdl]
	//GateApp->Client
	ECmdPublicCampInfoUpdate = 30609,	//所有阵营信息更新 Message::Public::SDictSTreasureCampInfo [Message/Public/TreasureDef.cdl]
	//InterApp->GateApp, Client
	ECmdPublicCampTreasureDead = 30610,	//宝藏活动中玩家死亡 Message::Public::SCampTreasureDead [Message/Public/TreasureDef.cdl]
	//GateApp->InterApp
	ECmdPublicKillCampTreasure = 30611,	//杀死宝藏活动中玩家 Message::Public::SCampTreasureDead [Message/Public/TreasureDef.cdl]
	//InterApp->GateApp
	ECmdPublicTreasureInitMap = 30612,	//初始化地图 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	//InterApp->CellApp
	ECmdPublicTreasurePass = 30613,	//宝藏传送 Message::Public::STreasurePass [Message/Public/TreasureDef.cdl]
	//GateApp->CellApp  CellApp->CellApp
	ECmdPublicTreasureCollect = 30614,	//宝藏采集 Message::Public::STreasureCollect [Message/Public/TreasureDef.cdl]
	//CellApp->GateApp
	ECmdPublicTreasureCollectFail = 30615,	//宝藏采集失败 Message::Public::STreasureCollectFail [Message/Public/TreasureDef.cdl]
	//GateApp->CellApp  
	ECmdPublicTreasureBroadcastKillCount = 30616,	//宝藏连斩广播 Message::Public::STreasureBroadcast [Message/Public/TreasureDef.cdl]	
	//GateApp->CellApp 
	ECmdPublicTreasureBroadcastGuard = 30617,	//宝藏护宝广播 Message::Public::STreasureBroadcast [Message/Public/TreasureDef.cdl]
	//GateApp->CellApp 
	ECmdPublicTreasureBroadcastSeize = 30618,	//宝藏夺宝广播 Message::Public::STreasureBroadcast [Message/Public/TreasureDef.cdl]
	//GateApp->CellApp 
	ECmdPublicTreasureEndAllCampInfo = 30619,	//结束时，所有阵营的活动信息 Message::Public::SDictSTreasureCampInfo [Message/Public/TreasureDef.cdl]
	//InterApp->GateApp

	//Inter发给Gate的公共信息
	ECmdPublicGateNotice = 30620,	//gate通知

	ECmdPublicTreasureRevive = 30621,	//宝藏复活 Message::Public::STreasurePass [Message/Public/TreasureDef.cdl]
	//GateApp->CellApp  CellApp->CellApp
	ECmdPublicTreasureHounour = 30622,	//国家宝藏荣誉 Message::Public::STreasureHonour [Message/Public/TreasureDef.cdl]

	ECmdPublicNewBattleFieldCloseMail = 30623,			//活动结束的天神战场邮件通知Message::Public::SNewBattleFieldCloseMail[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldOver = 30624,					//未进入的战场已关闭 NULL
	ECmdPublicNewBattleFieldAddTime = 30625,				//进入天神战场消耗一次次数
	ECmdPublicNewBattleFieldEnd = 30626,						//关闭天神战场NULL
	ECmdPublicNewBattleFieldStart = 30627,					//开启天神战场NULL
	ECmdPublicNewBattleFieldEnter = 30628,				//通知报名战场的玩家进入战场Message::Public::SNewBattleSignupMsg[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldOneReward = 30629,	// 新战场单发奖励	Message::Public::SNewBattleFieldRankReward[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldList = 30630,	// 新战场列表		Message::Public::SNewBattleFieldList[Message/Public/GamePublic.cdl]
	ECmdPublicOpenNewBattleField = 30631,	// 开启新战场		Message::Public::SNewBattleFieldOpen[Message/Public/GamePublic.cdl]
	ECmdPublicCloseNewBattleField = 30632,	// 关闭新战场		NULL
	ECmdPublicGetNewBattleFieldList = 30633,	// 获取新战场列表	NULL
	ECmdPublicNewBattleForceCredit = 30634,	// 新战场势力积分	Message::Public::SNewBattleFieldScore[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleForceResult = 30635,	// 新战场结果		Message::Public::SNewBattlePlayerScores[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattlePlayerCredit = 30636,	// 新战场个人积分	Message::Public::SNewBattleMyScore[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldReward = 30637,	// 新战场奖励		Message::Public::SNewBattleFieldRewardList[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldMyResult = 30638,	// 个人结果			Message::Public::SNewBattleFieldMyResult[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldPersonalInspire = 30639,	// 鼓舞信息			Message::Public::SNewBattleFieldInspireInfo[Message/Public/GamePublic.cdl]


	ECmdPublicWildBossInfo = 30640,	//  野外boss信息	Message::Public::SWildBossInfo[Message/Public/GamePublic.cdl]
	ECmdPublicPassMap = 30641,	//	传送地图		Message::Public::SPassInfo[Message/Public/GamePublic.cdl]
	ECmdPublicPassPointInfo = 30642,	//	传送点信息		Message::Public::SMapPassPointList[Message/Public/GamePublic.cdl]
	ECmdPublicMoveToPassPoint = 30643,	//	移动到传送点	Message::Public::SMoveToPassPoint[Message/Public/GamePublic.cdl]
	ECmdPublicShowPass = 30644,	//  传送效果表现 Message::Public::SShowPass [Message/Public/GamePublic.cdl]

	ECmdPublicWorldLevel = 30645,	//	世界等级	:Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]
	ECmdPublicSeventyCopyReviveTime = 30646,	//	70副本可复活次数	Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicSeventyCopyRemainTime = 30647,	//	70副本剩余时间		Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicSeventyCopyNextPassId = 30648,	//	70副本下一关		Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdPublicFriendAmoutLimit = 30650,	//	好友数量已满	NULL				 
	ECmdPublicFriendInTargetBackList = 30651,	//	在对方黑名单	NULL

	ECmdPublicNewBattleFieldAllInspire = 30660,	// 全体鼓舞信息 Message::Public::SNewBattleFieldInspireInfo[Message/Public/GamePublic.cdl]
	ECmdPublicNewBattleFieldKickOut = 30661,	// 打坐踢出天神战场 NULL

	ECmdPublicUpdateWuXing = 30670,		//更新五行属性(客户端、服务器共同使用) Message::Public::SWuXinAttribute[Message/Public/FightRole.cdl]
	ECmdPublicUpdatePlayerWuXingAttr = 30671,	//更新玩家五行信息(客户端使用)	Message::Public::SAttributeInfoMsg[Message/Game/IWuXing.cdl]
	ECmdPublicUpdatePlayerWuXingDice = 30672,	 //五行骰子信息(客户端使用) Message::Public::SWuXingDice[Message/Public/GamePublic.cdl]
	ECmdPublicUpdatePlayerWuXingRefresh = 30673,	//更新玩家五行洗练信息（客户端用） Message::Public::SAttributeInfoMsg[Message/Game/IWuXing.cdl]

	ECmdPublicAddWuXingAttribute = 30680,	//幻化五行属性 Message::Public::SAddWuXingAttribute

	ECmdPublicUpdateExpDice = 30685,     //经验骰子信息 Message::Public::SWuExpDice[Message/Public/GamePublic.cdl]

	ECmdPublicGetBossQuestion = 30690,	//答题怪问题 Message::Public::SGetBossQuestion
	ECmdPublicAnswerBossQuestion = 30691,	//答题怪问题回答(服务器) Message::Public::SAnswerBossQuestion
	ECmdPublicAnswerBossQuestionRes = 30692,	//答题怪问题回答结果 Message::Public::SAnswerBossQuestionRes

	ECmdPublicGuildStruggleOpen = 30700,	//开启仙盟副本  NULL(客户端) Message::Public::SGuildStruggleInfo(服务器)
	ECmdPublicGuildStruggleInfo = 30701,	//仙盟副本信息 Message::Public::SGuildStruggleInfo
	ECmdPublicGuildStruggleProcess = 30702,	//仙盟副本进度 Message::Public::SGuildStruggleProcess
	ECmdPublicGuildStruggleBest = 30703,	//仙盟副本最好成绩记录 Message::Public::SGuildStruggleInfo
	ECmdPublicGuildStruggleClose = 30704,	//关闭仙盟副本  NULL
	ECmdPublicGuildStrugglePersonalResult = 30705,	// 仙盟副本经验贡献提示	Message::Public::SSeqAttributeUpdate[Message/Public/EntityUpdate.cdl]

	ECmdPublicUpdateRuneAttribute = 30710,	//更新符文属性(客户端、服务器共同使用) Message::Public::SRuneAttribute[Message/Public/FightRole.cdl]

	ECmdPublicToplistCrossLocalToCross = 30720,	//发送本地数据至跨服进程 Message::Public::SMapToplistCross[Message/Public/GamePublic.cdl]
	ECmdPublicToplistCrossCrossToLocal = 30721,	//发送跨服进程数据至本地 Message::Public::SMapToplistCross[Message/Public/GamePublic.cdl]
	ECmdPublicToplistCrossUpdate = 30722,		//跨服排行榜更新	::Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]

	// 跨服竞技场
	ECmdPublicArenaCrossOpen = 30730,    //[跨服]开启竞技场  Message::Public::SArenaCrossOpen [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossClose = 30731,    //[跨服]关闭竞技场  NULL
	ECmdPublicArenaCrossBattles = 30732,    //[跨服]竞技场比赛  Message::Public::SArenaCrossBattles [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossMatch = 30733,    //[跨服]竞技场配对  Message::Public::SArenaCrossMatch [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossResult = 30734,    //[跨服]竞技场比赛结果 Message::Public::SArenaCrossResult [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossSignUp = 30735,    //[跨服]竞技场报名（服务器使用） Message::Public::SArenaCrossSignUpState [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossRegist = 30736,    //[跨服]报名获得参赛资格（伪）（服务器使用） Message::Public::SArenaCrossRegist [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossStart = 30737,    //[跨服]竞技场比赛开始 Message::Public::SArenaCrossStart [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossWillOpen = 30738,    //[跨服]竞技场即将开始，提前10分钟出现  Message::Public::SArenaCrossOpen [Message/Public/Arena.cdl] 
	ECmdPublicArenaCrossBattteRecords = 30739,    //[跨服]获取比赛记录 Message::Public::SArenaCrossBattleRecords [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossSingUpState = 30740,    //[跨服]竞技场报名状态 Message::Public::SArenaCrossSignUpState [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossMyInfo = 30741,    //[跨服]我的竞技场信息 Message::Public::SMyArenaCrossInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGetToplist = 30742,    //[跨服]获取竞技场排行（服务器使用） Message::Public::SArenaCrossGetToplist [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossToplist = 30743,    //[跨服]竞技场排行 Message::Public::SArenaCrossToplists [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossInfo = 30744,    //[跨服]竞技场信息 Message::Public::SArenaCrossInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossRecords = 30745,    //[跨服]竞技场记录 Message::Public::SArenaCrossRecords [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGetInfo = 30746,    //[跨服]获取竞技场信息（服务端使用） Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicArenaCrossOffline = 30747,    //[跨服]竞技场离线（服务端使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicArenaCrossRewards = 30748,    //[跨服]竞技场比赛结束后的奖励（服务端使用） Message::Public::SArenaCrossRewards [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossRecordsToGate = 30749,    //[跨服]竞技场记录(广播给所有本服gate) (服务器使用)
	ECmdPublicArenaCrossChooseGroup = 30750,    //[跨服]小组赛选组  Message::Public::SArenaCrossChooseGroup [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGroupMembers = 30751,    //[跨服]小组赛组成员  Message::Public::SArenaCrossGroupMembers [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossPlayerInfo = 30752,    //[跨服]玩家信息(装备、五行、宠物等)  Message::Public::SArenaCrossPlayerInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossFocus = 30753,    //[跨服]关注玩家（服务端使用）  Message::Public::SArenaCrossOptionMsg [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGroupBattles = 30754,    //[跨服]小组赛程  Message::Public::SArenaCrossGroupBattles [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossSendFlower = 30755,    //[跨服]送花 (客户端NULL)  (服务端Message::Public::SArenaCrossSendFlower) [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossBattleInfo = 30756,    //[跨服]比赛信息(玩家、粉丝、鲜花等)  Message::Public::SArenaCrossBattleInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossFlowerNum = 30757,    //[跨服]鲜花数  Message::Public::SArenaCrossFlowerNum [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGroupRingTime = 30758,    //[跨服]小组赛下一环时间  Message::Public::SArenaCrossGroupRingTime [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossUpdatePlayerInfo = 30759,    //[跨服]更新玩家信息  Message::Public::SArenaCrossPlayerInfo [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossGroupBattleEnd = 30760,    //[跨服]比赛结束  Message::Public::SArenaCrossGroupBattleEnd [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossPlayerGroups = 30761,    //[跨服]小组赛选组结果  Message::Public::SArenaCrossPlayerGroups [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossChooseFinalPos = 30762,    //[跨服]决赛选位置  Message::Public::SArenaCrossChooseFinalPos [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossFinalBattles = 30763,    //[跨服]决赛赛程  Message::Public::SArenaCrossFinalBattles [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossBet = 30764,    //[跨服]决赛下注(服务端使用)  Message::Public::SArenaCrossOptionMsg [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossTablet = 30765,    //[跨服]竞技场石碑名单  Message::Public::SArenaCrossFinalBattles [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossBetToplists = 30766,    //[跨服]竞技场身价排行  Message::Public::SArenaCrossBetToplists [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossBetPlayerInfos = 30767,    //[跨服]竞技场下注玩家信息  Message::Public::SArenaCrossBetPlayerInfos [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossDrawBetReward = 30768,    //[跨服]竞技场领取下注奖励 （客户端：空）（服务端：Message::Public::SArenaCrossDrawBetReward） [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossMyBetInfos = 30769,    //[跨服]竞技场我的下注列表  Message::Public::SArenaCrossMyBetInfos [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossFightRecords = 30770,    //[跨服]竞技场获取比赛录像  Message::Public::SArenaCrossFightRecords [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossWatchFightRecord = 30771,    //[跨服]竞技场观看比赛录像(服务端使用)  Message::Public::SArenaCrossOptionMsg [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossSendBetProfits = 30772,    //[跨服]竞技场发下注奖励(服务端使用)  Message::Public::SArenaCrossSendBetProfits [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossStatues = 30773,    //[跨服]竞技场雕像 Message::Public::SArenaCrossStatues [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossMainToplist = 30774,    //[跨服]竞技场主要排行（服务端使用） Message::Public::SArenaCrossMainToplist [Message/Public/Arena.cdl]
	ECmdPublicArenaCrossUpdateChannelId = 30775,    //[跨服]竞技场更新服的channelId（服务端使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicArenaCrossOnDeath = 30776,    //[跨服]竞技场死亡（服务端使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]


	//跨服温泉
	ECmdPublicCrossSpaOpen = 30780,	//跨服温泉开启 Message::Public::SCrossSpaOpen [Message/Public/GamePublic.cdl]
	ECmdPublicCrossSpaClose = 30781,	//跨服温泉关闭 NULL
	ECmdPublicCrossSpaList = 30782,	//跨服温泉列表 Message::Public::SCrossSpaList [Message/Public/GamePublic.cdl]

	// 场景烟花喜庆
	ECmdPublicCellHappyAdd = 30790,	//增加喜庆度 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCellHappyTouchReward = 30791,	//触发某喜庆度奖励 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCellHappyFullReward = 30792,	//喜庆度满载奖励 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicCellHappyUpdate = 30793,	//喜庆度更新 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//修石碑活动
	ECmdPublicFixStoneAdd = 30795,	//增加提交道具人数 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicFixStoneTouchReward = 30796,	//触发某奖励（对单个玩家）Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//制作蛋糕活动
	ECmdPublicMakeCakeAdd = 30800,	//增加制作值 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicMakeCakeTouchReward = 30801,	//触发某制作值奖励（对整个cell玩家） Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicMakeCakeUpdate = 30802,	//制作值更新 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//仙盟牧场
	ECmdPublicGuildPastureOpen = 30810,	//仙盟牧场开启 Message::Public::SGuildPastureInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureClose = 30811,	//仙盟牧场关闭 Message::Public::SGuildPastureInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureRefreshBoss = 30812,	//仙盟牧场刷怪 Message::Public::SGuildPastureInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureKillCollectBoss = 30813,	//仙盟牧场结束采集 Message::Public::SGuildPastureKillCollectBoss [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureExp = 30814,	//仙盟牧场采集经验 Message::Public::SGuildPastureExp [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureRefreshCollectBoss = 30815,	//仙盟牧场刷采集怪 Message::Public::SGuildPastureInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPastureClearCollectBoss = 30816,	//仙盟牧场刷采集怪 Message::Public::SGuildPastureInfo [Message/Public/GamePublic.cdl]

	//仙盟防守
	ECmdPublicGuildDefenseOpen = 30820,	//仙盟防守开启（服务器） Message::Public::SGuildDefenseOpen [Message/Public/GamePublic.cdl]
	ECmdPublicGuildDefenseClose = 30821,	//仙盟防守关闭（服务器） Message::Public::SGuildDefenseClose [Message/Public/GamePublic.cdl]
	ECmdPublicGuildDefenseInfo = 30822,	//仙盟防守信息（客户端） Message::Public::SGuildDefenseInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildEnterGuildDefense = 30823,	//进入仙盟防守副本（服务器）NULL
	ECmdPublicGuildDefenseCopyInfo = 30824,	//仙盟防守副本信息（客户端）Message::Public::SGuildDefenseCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildDefenseStructure = 30825,	//仙盟防守副本建筑（客户端）Message::Public::SGuildDefenseStructure [Message/Public/GamePublic.cdl]
	ECmdPublicGuildDefenseStructureUpdate = 30826,	//仙盟防守副本建筑更新（客户端）Message::Public::SGuildDefenseStructure [Message/Public/GamePublic.cdl]

	//钓鱼也疯狂
	ECmdPublicGuildFishRefresh = 30830,	//仙盟领地刷青鱼精 NULL
	ECmdPublicGuildFishNum = 30831,	//仙盟领地刷定水珠数量 Message::Public::SCrazyFishNum
	ECmdPublicGuildGetFishNum = 30832,	//获取仙盟领地刷定水珠数量（用于在仙盟领地刷新登陆） NULL

	//天空之城
	ECmdPublicSkyCityOpen = 30840,	//天空之城开启 Message::Public::SSkyCityOpen [Message/Public/GamePublic.cdl]
	ECmdPublicSkyCityClose = 30841,	//天空之城关闭 NULL
	ECmdPublicSkyCityList = 30842,	//天空之城列表 Message::Public::SSkyCityList [Message/Public/GamePublic.cdl]

	//情缘任务
	ECmdPublicFindPartner = 30850,  //寻找有缘人 Message::Game::SPartnerInfo [Message/Game/ITask.cdl]
	ECmdPublicInvitePartner = 30851,  //邀请对方情缘任务 Message::Game::SInvitePartner [Message/Game/ITask.cdl]
	ECmdPublicPartnerReply = 30852,  //有缘人回复 Message::Game::SPartnerReply [Message/Game/ITask.cdl]
	ECmdPublicPartnerStart = 30853,  //开始情缘 Message::Public::SPartnerReply [Message/Game/ITask .cdl]
	ECmdPublicPartnerEnd = 30854,  //结束情缘 NULL [Message/Public/EntityUpdate.cdl]
	ECmdPublicPartnerSendItem = 30855,  //发送物品 Message::Game::SPartnerReply [Message/Game/ITask.cdl]
	ECmdPublicPartnerComment = 30856,  //发送评语 Message::Game::SPartnerReply [Message/Game/ITask.cdl]
	ECmdPublicPartnerInfo = 30857,  //有缘人信息 Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicLovePlayerStart = 30858,  //有玩家开始情缘任务 NULL (gate to cell)		
	ECmdPublicLoveAddBuffer = 30859,  //给情缘任务玩家加buffer Message::Game::SPartnerReply [Message/Game/ITask.cdl]

	//跨服碧海银滩
	ECmdPublicCrossBeachOpen = 30860,	//跨服碧海银滩开启 Message::Public::SCrossBeachOpen [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBeachClose = 30861,	//跨服碧海银滩关闭 NULL
	ECmdPublicCrossBeachList = 30862,	//跨服碧海银滩列表 Message::Public::SCrossBeachList [Message/Public/GamePublic.cdl]			 
	ECmdPublicCrossBeachRefreshBoss = 30863,	//跨服碧海银滩刷怪 

	ECmdPublicLoveCellStart = 30865,  //场景情缘开启 (cell to all gate)
	ECmdPublicLoveCellEnd = 30866,  //场景情缘结束 (cell to all gate)

	// 称号
	ECmdPublicAddUniversalBuff = 30870,	// 全民buff	Message::Public::SUniversalBuff	[Message/Public/GamePublic.cdl]

	//跨服斗兽（客户端需要用到）
	ECmdPublicPetArenaSearch = 30880,	// 宠物斗兽查询 Message::Game::SPetArenaInfos [Message/Game/IPetArena.cdl]
	ECmdPublicPlayerPetArena = 30881,	// 玩家斗兽信息 Message::Game::SPlayerPetArena [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaJoinResult = 30882,	// 玩家斗兽报名结果 Message::Game::SPetArenaResult [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaChallengeResult = 30883,	// 玩家斗兽挑战结果 Message::Game::SPetArenaResult [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaDetailInfo = 30884,	// 宠物斗兽详细信息 ::Message::Game::SPetInfo [Message/Game/GameMsg.cdl]
	ECmdPublicPetArenaLog = 30885,	// 玩家斗兽日志 Message::Game::SMyPetChallengeLog [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaDetailInfoResult = 30886,	// 查看玩家宠物结果 Message::Game::SPetArenaResult [Message/Game/IPetArena.cdl]
	ECmdPublicPlayerPetArenaEx = 30887,	// 玩家斗兽信息扩展 Message::Game::SPlayerPetArenaEx [Message/Game/IPetArena.cdl]

	//跨服斗兽（服务端用） GateApp->CellApp
	ECmdPublicPetArenaJoin = 30888,	// 宠物斗兽报名 Message::Game::SPetArenaInfos [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaGetDetailInfo = 30889,	// 获取详细信息 Message::Game::SPetArenaGetDetailInfo [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaGetRewards = 30890,	// 宠物斗兽领奖 Message::Game::SGetPetArenaRewards [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaChallenge = 30891,	// 宠物斗兽挑战 Message::Game::SPetArenaChallenge [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaObserve = 30892,	// 宠物斗兽观战 Message::Game::SPetArenaObserve [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaChallengeStrat = 30893,	// NULL
	ECmdPublicPetArenaChallengeEnd = 30894,	// 宠物斗兽挑战结束 Message::Game::SPetArenaChallengeEnd [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaLoginOut = 30895,	// NULL 			Message::Public::SEntityId[Message/Public/GamePublic.cdl]
	ECmdPublicPetArenaClose = 30896,	// 宠物斗兽关闭 	Message::Game::SPetArenaObserve [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaLockAttribute = 30897,	// 宠物斗兽锁定属性 Message::Game::SPetArenaInfos [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaDailyReward = 30898,	// 宠物斗兽日排名 	NULL
	ECmdPublicPetArenaDailyRewardNotice = 30899,	// 宠物斗兽日排名提醒 	NULL
	ECmdPublicPetArenaCountReward = 30900,	// 宠物斗兽大结算奖励 	Message::Game::SPetArenaCountReward  [Message/Game/IPetArena.cdl]
	ECmdPublicPetArenaCountRewardStart = 30901,	// 宠物斗兽大结算开始 	NULL
	ECmdPublicPetArenaCountRewardEnd = 30902,	// 宠物斗兽大结算结束 	NULL
	ECmdPublicPetArenaBuyInsurance = 30903,	// 宠物斗兽购买保险 	NULL
	ECmdPublicPetArenaBuyInsuranceFail = 30904,	// 宠物斗兽购买保险失败 NULL
	ECmdPublicPetArenaAccumulateRewardInfo = 30905,	// 宠物斗兽累积奖励信息 Message::Game::SPetArenaAccumulateRewardInfo  [Message/Game/IPetArena.cdl]

	// 跨服3V3
	ECmdPublicGangFightsRoomOpen = 31000,	// 3V3房间开启(服务器使用)	Message::Public::SGangFightsRoom[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsRoomClose = 31001,	// 3V3房间关闭(服务器使用)	Message::Public::SGangFightsRoom[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsRoomUpdate = 31002,	// 3V3房间更新(服务器使用)	Message::Public::SGangFightsRoom[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsMyInfo = 31003,	// 3V3获取我的信息	Message::Public::SGangFightsMyInfo[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsUpdateMyInfo = 31004,	// 3V3更新我的信息(服务器使用)	Message::Public::SGangFightsMyInfo[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsCreateTeam = 31005,	// 3V3创建战队 (客户端NULL) Message::Public::SGangFightsMinTeamInfo[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsModifyTeam = 31006,	// 3V3修改战队资料 (客户端NULL) Message::Public::SGangFightsMinTeamInfo[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsDisbandTeam = 31007,	// 3V3解散战队(服务器使用)	Message::Public::SGangFightsMinTeamInfo [Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsApplyTeam = 31008,	// 3V3申请战队(服务器使用)	Message::Public::SGangFightsApplyTeam[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsInvitePlayer = 31009,	// 3V3邀请玩家(服务器使用)	Message::Public::SGangFightsInvitePlayer[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsDealApply = 31010,	// 3V3处理申请(服务器使用)	Message::Public::SGangFightsDealApply[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsDealInvite = 31011,	// 3V3处理邀请(服务器使用)	Message::Public::SGangFightsDealInvite[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsMemberOper = 31012,	// 3V3战队成员处理(服务器使用)	Message::Public::SGangFightsMemberOper[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsGetTeamInfo = 31013,	// 3V3获取战队信息(服务器使用)	Message::Public::SGangFightsMinTeamInfo[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsTeamInfo = 31014,	// 3V3战队信息	Message::Public::SGangFightsTeamInfo[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsGetToplist = 31015,	// 3V3获取排行(服务器使用)	Message::Public::SGangFightsToplist[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsToplist = 31016,	// 3V3排行榜	Message::Public::SGangFightsToplist[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsOffline = 31017,	// 3V3玩家离线(服务器使用)	Message::Public::SEntityId[Message/Public/GamePublic.cdl] 
	ECmdPublicGangFightsReceiveApply = 31018,	// 3V3收到战队申请	Message::Public::SGangFightsApplyTeam[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsReceiveInvite = 31019,	// 3V3收到战队邀请	Message::Public::SGangFightsInvitePlayer[Message/Public/GangFights.cdl]


	ECmdPublicGangFightsOpen = 31020,    // 开启3V3  Message::Public::SGangFightsOpen[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsClose = 31021,    // 关闭3V3  NULL
	ECmdPublicGangFightsWillOpen = 31022,    // 3V3即将开始 NULL
	ECmdPublicGangFightsSignUp = 31023,	// 3V3报名	Message::Public::SGangFightsSignUp[Message/Public/GangFights.cdl]
	ECmdPublicGangFightsBattles = 31024,    // 3V3比赛 Message::Public::SGangFightsBattles[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsMatch = 31025,    // 3V3配对 Message::Public::SGangFightsMatch[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsStart = 31026,    // 3V3比赛开始 Message::Public::SGangFightsStart[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsResult = 31027,    // 3V3比赛结果 Message::Public::SGangFightsResult[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsGroup = 31028,    // 3V3组成员 Message::Public::SGangFightsGroup[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsAccount = 31029,    // 3V3结算时间 Message::Public::SGangFightsAccount[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsEnter = 31030,	// 3V3玩家进入竞技场(服务器使用)	Message::Public::SPublicMiniPlayer[Message/Public/GamePublic.cdl] 
	ECmdPublicGangFightsLeft = 31031,	// 3V3玩家离开竞技场(服务器使用)	Message::Public::SEntityId[Message/Public/GamePublic.cdl] 
	ECmdPublicGangFightsUpdateChannelId = 31032,   // 3V3更新服的channelId（服务端使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicGangFightsChangeGroup = 31033,    // 3V3队伍改变（服务端使用）  NULL
	ECmdPublicGangFightsAwards = 31034,    // 3V3奖励(服务器使用) Message::Public::SGangFightsAwards[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsAwardsOnline = 31035,    // 3V3给在线玩家奖励(服务器使用) Message::Public::SGangFightsAwards[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsGetTeamMark = 31036,	// 3V3获取房间信息	Message::Public::SGangFightsGetTeamMark[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsGetRooms = 31037,	// 3V3获取房间信息	Message::Public::SGangFightsGetRooms[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsMyInfoEx = 31038,	// 3V3获取我的信息(扩展)	Message::Public::SGangFightsMyInfoEx[Message/Public/GangFights.cdl] 
	ECmdPublicGangFightsKickOut = 31039,	// 3V3踢人，禁止进入	NULL
	ECmdPublicGangFightsDie = 31040,	// 3V3死亡 Message::Public::SEntityId[Message/Public/GamePublic.cdl] 

	//邮件
	ECmdPublicMailDeleteSuccess = 31041,    //邮件删除成功  Message::Game::SMailId[ Message/Game/IMail.cdl]

	//根骨活动
	ECmdPublicRootTargetOnce = 31050,	// 到达某等级（只会奖励一次） NULL

	ECmdPublicDramaStep = 31060,	// 剧情步骤	Message::Public::SDramaStep	[Message/Public/GamePublic.cdl]
	ECmdPublicDramaReward = 31061,	// 剧情奖励	Message::Public::SSeqPlayerItem	[Message/Public/GamePublic.cdl]
	ECmdPublicDramaGetReward = 31062,	// 获取剧情奖励	NULL
	ECmdPublicDramaTaskStep = 31063,//	//剧情步骤	Message::Public::SDramaStep	[Message/Public/GamePublic.cdl]
	ECmdPublicDramaTaskProcess = 31064,   //剧情步骤+1

	// 跨服竞速赛
	ECmdPublicRaceCountdown = 31070,	// 竞速赛倒计时 Message::Public::SRaceSchedule [Message/Public/GamePublic.cdl]
	ECmdPublicRaceStart = 31071,	// 竞速赛开始 Message::Public::SRaceSchedule [Message/Public/GamePublic.cdl]
	ECmdPublicRaceEnd = 31072,	// 竞速赛结束 NULL
	ECmdPublicRaceReachPoint = 31073,	// 竞速赛到达某点（流程点或终点）Message::Public::SRaceReachPoint [Message/Public/GamePublic.cdl]
	ECmdPublicRaceLastBest = 31074,	// 竞速赛上一次排名 Message::Public::SRaceLastBest [Message/Public/GamePublic.cdl]
	ECmdPublicRaceRooms = 31075,	// 竞速赛房间列表 Message::Public::SRaceRooms [Message/Public/GamePublic.cdl]
	ECmdPublicRaceSkillDrops = 31076,	// 竞速赛技能掉落 Message::Public::SRaceSkillDrops [Message/Public/GamePublic.cdl]
	ECmdPublicRaceUseSkill = 31077,	// 竞速赛使用技能(服务端使用) Message::Public::SRaceUseSkill [Message/Public/GamePublic.cdl]
	ECmdPublicRacePerfectRewards = 31078,	// 竞速赛完胜奖励 Message::Public::SRacePerfectRewards [Message/Public/GamePublic.cdl]
	ECmdPublicRaceRoomInfo = 31079,	// 竞速赛房间信息 Message::Public::SRaceRoomInfo [Message/Public/GamePublic.cdl]
	ECmdPublicRaceRoomPlayerNum = 31080,	// 竞速赛房间人数 Message::Public::SRaceRoomPlayerNum [Message/Public/GamePublic.cdl]
	ECmdPublicRaceResult = 31081,	// 竞速赛比赛结果 Message::Public::SRaceResult [Message/Public/GamePublic.cdl]
	ECmdPublicRaceRoomStart = 31082,	// 竞速赛房间开始比赛 NULL

	//跨服Boss
	ECmdPublicCrossBossStart = 31090,	// 跨服Boss开始 		NULL
	ECmdPublicCrossBossEnd = 31091,	// 跨服Boss结束 		NULL
	ECmdPublicCrossBossPrepare = 31092,	// 跨服Boss准备 		NULL
	ECmdPublicCrossBossJoin = 31094,	// 跨服Boss报名 		Message::Public::SCrossBossJoins [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBossJoinInfo = 31095,	// 跨服Boss报名信息 	Message::Public::SCrossBossJoinInfos [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBossKillBoss = 31096,	// 跨服boss击杀boss		Message::Public::SEntityId[Message/Public/GamePublic.cdl] 
	ECmdPublicCrossBossWaitingRoomOpen = 31097,	// 跨服Boss休息室开放 	Message::Public::SCrossBossWaitingRoomOpen [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBossWaitingRoomOpenNotice = 31098,	// 跨服Boss休息室开放提示
	ECmdPublicCrossBossHatredInfo = 31099,	// 跨服Boss仇恨实体列表 Message::Public::SCrossBossHatredInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGetCrossBossGuildList = 31100,	// 获取跨服Boss仙盟信息 Message::Public::SGetCrossBossGuildList [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBossGuildList = 31101,	// 获取跨服Boss仙盟信息 Message::Public::SCrossBossGuildList [Message/Public/GamePublic.cdl]
	ECmdPublicCrossBossGuildInfos = 31102,	// 跨服Boss仙盟信息 Message::Public::SCrossBossGuildInfos [Message/Public/GamePublic.cdl]

	//剧情副本抽奖
	ECmdPublicLotteryInfo = 31110,	// 抽奖物品信息 Message::Game::SDramaLotteryInfo [Message/Game/GameMsg.cdl]
	ECmdPublicCloseLottery = 31111,	// 关闭抽奖 NULL
	ECmdPublicLotteryHistory = 31112,	// 历史抽奖信息  Message::Game::SSeqLotteryItemInfo [Message/Game/GameMsg.cdl]

	// 80副本
	ECmdPublicEightyCopyInfo = 31120,	// 80副本信息 Message::Public::SEightyCopyInfo [Message/Public/GamePublic.cdl]

	//天降横财
	ECmdPublicPrizeFallOpen = 31125,	// 天降横财开始		NULL
	ECmdPublicPrizeFallClose = 31126,	// 天降横财结束		NULL

	//爬楼（青云之巅）
	// ECmdPublicCrossStairOpen = 31140,	//跨服爬楼开启 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairClose = 31141,	//跨服爬楼关闭 Message::Public::SBool [Message/Public/CdlPublic.cdl]
	// ECmdPublicCrossStairInfo = 31142,	//跨服爬楼信息 Message::Public::SCrossStairInfo [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairRank = 31143,	//跨服爬楼排行信息 Message::Public::SCrossStairRanks [Message/Public/GamePublic.cdl]

	ECmdPublicGetCrossStairRank = 31144,	//[服务端用]获取跨服爬楼排名 Message::Public::SGetCrossStairRanks [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairRevial = 31145,	//[服务端用]跨服爬楼复活 Message::Public::SCopyPassInto [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairPass = 31146,	//[服务端用]跨服爬楼传送 Message::Public::SCopyPassInto [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairReward = 31147,	//[服务端用]跨服爬楼奖励 Message::Public::SCrossStairReward [Message/Public/GamePublic.cdl]

	// ECmdPublicCrossStairOpenNotice = 31148,	//跨服爬楼开启通知 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]

	ECmdPublicCrossStairCloseNotice = 31149,	//[服务端用]跨服爬楼关闭通知 NULL
	ECmdPublicCrossStairTitleInfo = 31150,	//跨服爬塔当然秘宝玩家信息 Message::Public::SCrossStairTitleInfo [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairUseSkill = 31151,	//[服务端用]跨服爬塔使用技能 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicCrossStairSkill = 31152,	//跨服爬塔技能信息 Message::Public::SCrossStairSkill [Message/Public/GamePublic.cdl]

	// ECmdPublicCrossStairMyRank = 31153,	//跨服爬楼自己排名 Message::Public::SCrossStairMyRank [Message/Public/GamePublic.cdl]
	
	ECmdPublicCrossStairInspire = 31154,	//跨服爬楼激励 Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	ECmdPublicLogCrossFunctionOpen = 31155,	//[服务端用]跨服功能开启 Message::Public::SLogCrossFunctionOpen [Message/Public/GamePublic.cdl] 
	ECmdPublicCrossStairRewardEx = 31156,	//跨服爬楼奖励 Message::Public::SCrossStairReward [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairLeftCopy = 31157,  //跨服爬楼退出副本，数组第一个值表示倒计时秒数 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	//爬楼（青云之巅）------新
	ECmdPublicCrossStairOpen				= 31140,	//跨服爬楼开启 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairClose				= 31141,	//跨服爬楼关闭 Message::Public::SBool [Message/Public/CdlPublic.cdl]
	ECmdPublicCrossStairInfo				= 31142,	//跨服爬楼信息 Message::Public::SCrossStairInfo [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairRank				= 31143,	//跨服爬楼排行信息 Message::Public::SCrossStairRanks [Message/Public/GamePublic.cdl]		
	ECmdPublicCrossStairOpenNotice	= 31148,	//跨服爬楼开启通知 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairMyRank			= 31153,	//跨服爬楼自己排名 Message::Public::SCrossStairMyRank [Message/Public/GamePublic.cdl]
	ECmdPublicCrossStairLeftCopy    = 31157,  //跨服爬楼退出副本，数组第一个值表示倒计时秒数 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicCrossStairAcceptReward    = 31158,  //跨服爬楼领取奖励
	ECmdPublicCrossStairAcceptRewardSuccessRet    = 31159,  //跨服爬楼领取奖励成功返回


	//化妆舞会
	ECmdPublicMakeUpBattleMatch = 31160,	//化妆舞会切磋匹配
	ECmdPublicMakeUpKillMatch = 31161,	//化妆舞会击杀匹配

	ECmdPublicCrossStairEnter    = 31168,  //跨服爬楼进入
	ECmdPublicCrossStairLog = 31169,	//跨服爬楼日志 Message::Public::SCrossStairLog [Message/Public/GamePublic.cdl]

	//积分商店
	ECmdPublicIntegralShopInfo = 31170,	//积分商店信息 Message::Public::SIntegralShopInfo [Message/Public/GamePublic.cdl]
	ECmdPublicIntegralShopInfos = 31171,	//积分商店信息 Message::Public::SIntegralShopInfos [Message/Public/GamePublic.cdl]
	ECmdPublicIntegralExchangeRecords = 31172,	//积分兑换记录 Message::Public::SIntegralExchangeRecords [Message/Public/GamePublic.cdl]

	//宠物称号
	ECmdPublicPetAreanRankInfo = 31175,	//宠物争霸排名信息 Message::GameSPetArenaRankInfo [Message/Game/IPetTitle.cdl]

	ECmdPublicCrossDomainParseOK = 31176,	//跨服域名解析成功

	ECmdPublicCopyCheckServerMerge = 31177,	//跨服副本检测合服数据 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	// 副本显示结算奖励
	ECmdPublicCopyShowReward = 31178,	//副本显示结算奖励 Message::Public::SCopyShowReward [Message/Public/GamePublic.cdl]

	// 副本第一次开启时间
	ECmdPublicCopyFirstOpenDt = 31179,	//副本第一次开启时间(开服时间开始算起) Message::SCopyFirstOpenDt [Message/Public/GamePublic.cdl]

	// 跨服竞技场1V1
	ECmdPublicWrestleRoomOpen = 31180,	// 1v1房间开启(服务器使用)	Message::Public::SWrestleRoom[Message/Public/GangFights.cdl]
	ECmdPublicWrestleRoomClose = 31181,	// 1v1房间关闭(服务器使用)	Message::Public::SWrestleRoom[Message/Public/GangFights.cdl]
	ECmdPublicWrestleRoomUpdate = 31182,	// 1v1房间更新(服务器使用)	Message::Public::SWrestleRoom[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleOpen = 31183,    // 1v1开启  Message::Public::SWrestleOpen[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleClose = 31184,    // 1v1关闭  NULL
	ECmdPublicWrestleWillOpen = 31185,    // 1v1即将开始 NULL
	ECmdPublicWrestleMyInfo = 31186,	// 1v1获取我的信息	Message::Public::SWrestleMyInfo[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleMyInfoEx = 31187,	// 1v1获取我的信息(扩展)	Message::Public::SWrestleMyInfoEx[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleUpdateMyInfo = 31188,	// 1v1更新我的信息(服务器使用)	Message::Public::SWrestleMyInfo[Message/Public/GangFights.cdl]
	ECmdPublicWrestleGetToplists = 31189,	// 1v1获取排行(服务器使用)	Message::Public::SWrestleToplists[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleToplists = 31190,	// 1v1排行榜	Message::Public::SWrestleToplists[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleEnter = 31191,	// 1v1玩家进入竞技场(服务器使用)	Message::Public::SPublicMiniPlayer[Message/Public/GamePublic.cdl] 
	ECmdPublicWrestleLeft = 31192,	// 1v1玩家离开竞技场(服务器使用)	Message::Public::SEntityId[Message/Public/GamePublic.cdl] 
	ECmdPublicWrestleOffline = 31193,	// 1v1玩家离线(服务器使用)	Message::Public::SEntityId[Message/Public/GamePublic.cdl] 
	ECmdPublicWrestleSignUp = 31194,	// 1v1报名	Message::Public::SWrestleSignUp[Message/Public/GangFights.cdl]
	ECmdPublicWrestleBattles = 31195,    // 1v1比赛 Message::Public::SWrestleBattles[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleMatch = 31196,    // 1v1配对 Message::Public::SWrestleMatch[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleStart = 31197,    // 1v1比赛开始 Message::Public::SWrestleStart[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleResult = 31198,    // 1v1比赛结果 Message::Public::SWrestleResult[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleAccount = 31199,    // 1v1结算时间 Message::Public::SWrestleAccount[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleUpdateChannelId = 31200,    // 1v1更新服的channelId（服务端使用） Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicWrestleAwards = 31201,    // 1v1奖励(服务器使用) Message::Public::SWrestleAwards[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleAwardsOnline = 31202,    // 1v1给在线玩家奖励(服务器使用) Message::Public::SWrestleAwards[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleGetMark = 31203,	// 1v1获取房间信息(服务器使用)	Message::Public::SWrestleGetTeamMark[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleGetRooms = 31204,	// 1v1获取房间信息	Message::Public::SWrestleGetRooms[Message/Public/GangFights.cdl] 
	ECmdPublicWrestleKickOut = 31205,	// 1v1踢人，禁止进入(服务器使用)	NULL
	ECmdPublicWrestleGiveup = 31206,	// 1v1放弃比赛（服务器用）， NULL
	ECmdPublicWrestleOpenForDebug = 31207,	// 1v1开启游戏

	ECmdPublicFarmUpdate = 31210,	// 仙园信息更新  Message::Public::SFarmMsg[Message/Public/GamePublic.cdl]
	ECmdPublicShopTreasureUpdate = 31211,	// 秘境商店物品更新 Message::Public::SShopTreasureMsg[Message/Public/GamePublic.cdl]
	ECmdPublicOpenVip = 31212,	// 帮好友开通vip Message::Public::SOpenFriendVip[Message/Public/GamePublic.cdl]
	ECmdPublicFarmInfo = 31213,	//仙园下推消息,::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl] value为0可种植， 1可收获
	ECmdProfessionCount = 31214,//每个职业人数,::Message::Public::SProfessionCount[Message/Public/GamePublic.cdl]

	//怪兽战场
	ECmdPublicGetBossFieldList = 31220,	// 获取战场列表, ::Message::Public::SBossFieldList[Message/Public/Battlefield.cdl]
	ECmdPublicGetBossFieldResult = 31221,	// 获取战场玩家结果, ::Message::Public::SBossFieldPlayerScores[Message/Public/Battlefield.cdl]
	ECmdPublicSubmitBossFieldTask = 31222,	// 提交战场任务, NULL
	ECmdPublicBossFieldPersonalInspire = 31223,	// 祈福,::Message::Public::SNewBattleFieldInspireInfo[Message/Public/GamePublic.cdl]
	ECmdPublicOpenBossField = 31224,	// 战场开启, ::Message::Public::SBossFieldOpen[Message/Public/Battlefield.cdl]
	ECmdPublicCloseBossField = 31225,	// 战场关闭, NULL
	ECmdPublicBossFieldForceCredit = 31226,	// 势力排行, ::Message::Public::SBossFieldScore[Message/Public/Battlefield.cdl]
	ECmdPublicBossFieldPlayerCredit = 31227,	// 个人排行, ::Message::Public::SBossFieldMyScore[Message/Public/Battlefield.cdl]
	ECmdPublicBossFieldEnter = 31228,	// 进入战场, NULL
	ECmdPublicBossFieldLeft = 31229,	// 离开战场, NULL
	ECmdPublicBossFieldList = 31230,	// 战场列表, ::Message::Public::SBossFieldList[Message/Public/Battlefield.cdl]
	ECmdPublicBossFieldResult = 31231,	// 战场玩家结果, ::Message::Public::SBossFieldPlayerScores[Message/Public/Battlefield.cdl]

	ECmdPublicBossFieldBossList = 31232,	// 怪兽列表,  ::Message::Public::SBossFieldBossInfo[Message/Public/Battlefield.cdl]
	ECmdPublicBossFieldPickupBoss = 31233,	// 选择怪兽, ::Message::Public::SBossFieldPickup[Message/Public/Battlefield.cdl]
	ECmdPublicBossFieldBossItemCode = 31234,	// 怪兽战场怪兽模型, ::Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]

	//精英副本邀请组队
	ECmdPublicHeroCopyInvite = 31240,		//精英副本组队邀请 ::Message::Public::SGroupInviteCopy[Message/Public/Group.cdl]
	ECmdPublicHeroKickOutLimit = 31241,  	//踢出不符合组队副本要求的玩家 ::Message::Public::
	ECmdPublicGroupMemberEnterCopy = 31242, //队长开启副本后,队员再相继进入副本Message::Public::SGroupSetting [Message/Public/Group.cdl]
	ECmdPublicFarmPlantLevelUp = 31243,			//仙园摇钱树的等级升级 ::Message::Public::SFarmPlayerLevel[Message/Public/GamePublic.cdl]

	ECmdPublicOpenActive = 31244,			//内网开启活动 SOpenActive [Message::Game::GameMsg.cdl]

	ECmdPublicFarmHarvestedMessage = 31246,		//仙园登录推送接收信息 ::Message::Public::SFarmPlantHarvest[Message/Public/GamePublic.cdl]

	ECmdPublicMagicTowerSweepEnd = 31247,			//扫荡结束 NULL

	ECmdPublicCopyHeroKickOut = 31248,		//精英副本踢出仙侠 NULL

	//庆典
	ECmdPublicCelebrateEnter = 31249,				//进入庆典 NULL
	ECmdPublicCelebrateLeave = 31250,				//离开庆典 null
	ECmdPublicCelebrateFire = 31251,				//燃放礼花 ::Message::Public::SCelebrateItemValue [Message/Public/ActiveDef.cdl]
	ECmdPublicCelebrateMove = 31252,				//取出物品 ::Message::Public::SCelebrateItemValue [Message/Public/ActiveDef.cdl]
	ECmdPublicCelebrateUpdate = 31253,				//庆典更新 ::Message::Public::SCelebrateInfo [Message/Public/ActiveDef.cdl]
	ECmdPublicCelebrateItem = 31254,				//庆典物品 ::Message::Public::SCelebrateItemValue [Message/Public/ActiveDef.cdl]
	ECmdPublicCelebrateNotice = 31255,				//全服庆典 NULL

	ECmdPublicCutMoneyInfo = 31260,                      //天降横财　历史成绩::Message::Public::SCutMoneyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicCutMoneyOpen = 31261,                      //天降横财　活动开启 NULL
	ECmdPublicCutMoneyClose = 31262,                     //天降横财　活动结束 ::Message::Public::SCutMoneyMark [Message/Public/GamePublic.cdl]

	ECmdPublicChapterCopy = 31270,					//章节副本 ::Message::Public::SChapterCopyInfo [Message/Public/GamePublic.cdl]

	ECmdPublicFarmPushInfo = 31271,				//仙园信息下推消息 NULL

	ECmdPublicFarmCount = 31272,				//仙园一键次数
	ECmdPublicAngryMonsterKingStart = 31273,					//妖王之怒活动开始 NULL
	ECmdPublicAngryMonsterKingEnd = 31274,						//妖王之怒活动结束 NULL
	ECmdPublicCreateAngryMonsterKingSpace = 31275,				//妖王之怒活动相关创建 ::Message::Public::SAngryMonsterKingInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingWin = 31276,						//妖王之怒活动胜利 NULL
	ECmdPublicAngryMonsterKingFail = 31277,						//妖王之怒活动失败 NULL
	ECmdPublicAngryMonsterKingHurtRankInfo = 31278,				//妖王之怒活动伤害排名 ::Message::Game::SBossHurtRank [Message/Game/GameMsg.cdl]
	ECmdPublicAngryMonsterKingPlayerHurtUpdate = 31279,			//妖王之怒活动玩家伤害更新 ::Message::Game::SBossHurtInfo [Message/Game/GameMsg.cdl]
	ECmdPublicAngryMonsterKingAppear = 31280,					//妖王出现 NULL
	ECmdPublicAngryMonsterKingBossHurtReward = 31281,			//妖王之怒活动造成伤害回赠 ::Message::Game::SBossHurtInfo [Message/Game/GameMsg.cdl]
	ECmdPublicAngryMonsterKingBossAttectReward = 31282,			//妖王之怒攻击奖励 NULL
	ECmdPublicAngryMonsterKingBossLifeRecord = 31283,			//妖王之怒怪的血量记录 ::Message::Public::SAngryMonsterKingLife [Message/Public/GamePublic.cdl]

	ECmdPublicLoveTaskStartCruise = 31284,               //情缘任务 开始巡游 ::Message::Game::SCruiseParnter [Message/Game/ITask.cdl]
	ECmdPublicLoveTaskEndCruise = 31285,               //情缘任务 结束巡游 ::Message::Game::SCruiseParnter [Message/Game/ITask.cdl]

	ECmdPublicAngryMonsterKingPushSkillItem = 31286,			//妖王之怒技能下推
	ECmdPublicAngryMonsterKingGetList = 31287,					//妖皇之怒获取房间列表 Message::Public::SSeqSSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingPlayerInfo = 31288,				//妖皇之怒玩家信息 Message::Public::SSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingEnterCheck = 31289,				//妖皇之怒活动进入检查 Message::Public::SMonsterKingEnterCheck [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingSpaceHasEnded = 31290,			//妖皇之怒活动房间已经结束 NULL
	ECmdPublicAngryMonsterKingForceEnd = 31291,					//妖皇之怒活动时间结束 NULL

	ECmdPublicFairyPetParadeReady = 31292,						//仙宠巡游活动准备 NULL Message::Public::SSeqSSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicFairyPetParadeStart = 31293,						//仙宠巡游活动开始 NULL
	ECmdPublicFairyPetParadeEnd = 31294,						//仙宠巡游活动结束 NULL Message::Public::SSeqSSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicFairyPetParadeNear = 31295,						//仙宠巡游玩家在仙宠附近 Message::Public::SSeqSSpaInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingUpdateMoney = 31296,				//妖皇之怒活动增加银两 Message::Public::SMonsterKingMoneyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicAngryMonsterKingStartNotice = 31297,				//妖皇之怒活动开始通知 NULL

	ECmdPublicLoveTaskGotTask = 31298,                                      //情缘任务 已接任务 NULL
	ECmdPublicFairyPetParadeLeft = 31299,						//离开仙宠巡游活动 Message::Public::SPlayerIdInfo [Message/Public/GamePublic.cdl]
	ECmdPublicFairyPetParadeJoin = 31300,						//玩家加入仙宠下凡活动
	ECmdPublicFairyPetParadeSendGift = 31301,					//仙宠下凡活动赠送礼品
	ECmdPublicGuildAltarResetTimes = 31302,                           //仙盟BOSS重置次数
	ECmdPublicGuildAltarUpdateFightMembers = 31303,                   // 更新仙盟BOSS参与人员 Message::Game::SGuildBossUpdateFight [Message/Game/IGuild.cdl]
	ECmdPublicBossRoutePoints = 31304,							//怪的走路点 Message::Public::SBossRoutePoints [Message/Public/GamePublic.cdl]
	ECmdPublicDoubleActiveOpen = 31305,                               //双倍活动开启 Message::Public::SDoubleActive [Message/Public/GamePublic.cdl]
	ECmdPublicDailyLoginGetReward = 31306,						//玩家登陆领取礼包（包括vip和非vip）
	ECmdPublicGuildFlameLeftTime = 31307,           //添柴对酒剩余时间  Message::Public::SGuildFlameUseCount [Message/Public/GamePublic.cdl]
	ECmdPublicGuildBossAssumon = 31308,                   //召唤仙盟BOSS
	ECmdPublicGuildWarSignUpBatch = 31309,                //仙盟战报名批量操作（服务器）Message::Game::SGuildApplyNum [Message/Game/IGuild.cdl](1为已经报名，0为未报名)
	ECmdPublicShieldInfo = 31310,								//屏蔽信息 Message::Public::SShieldInfo [Message/Public/GamePublic.cdl]
	ECmdPublicShopTreasureAddtional = 31311,					//秘境额外加成 Message::Public::SShopTreasureItem [Message/Public/GamePublic.cdl]
	ECmdPublicServerDate = 31312,								//服务器时间 Message::Game::SServerDate [Message/Game/GameMsg.cdl]
	ECmdPublicGetCatastropheList = 31313,						//获取劫难列表 Message::Public::SCatastropheInfo [Message/Public/GamePublic.cdl]
	ECmdPublicCatastropheResult = 31314,						//劫难结果 Message::Public::SCatastropheFailInfo [Message/Public/GamePublic.cdl]
	ECmdPublicPromotionActivityInfo = 31315,                                //促销功能SPromotionActivityInfo [Message/Public/GamePublic.cdl]	  
	ECmdPublicCatastropheNextRound = 31316,	//劫难开始下一Round NULL
	ECmdPublicGuildDefenseEnd = 31317, //仙盟副本结束 Message::Public::SGuildDefenseClose [Message/Public/GamePublic.cdl]
	ECmdPublicEnergyCopyInfo = 31318, //推图本信息更新 Message::Public::SCopyRoomOperation[Message/Public/GamePublic.cdl]

	//31320~31340 镜像系统占用
	ECmdPublicMirrorLoginUpdate = 31320,						//登陆更新镜像数据 Message::Public::SFightRoleMirror [Messsage/Public/FightRole.cdl]
	ECmdPublicMirrorFightResult = 31321,						//挑战镜像结果  Message::Public::SMirrorCopyInfo [Message/Public/CopyDef.cdl]
	ECmdPublicMirrorSkill = 31322,								//镜像技能 Message::Public::SMirrorSkill [Message/Public/CopyDef.cdl]
	ECmdPublicMirrorLookup = 31323,								//镜像战斗信息 Message::Public::SMirrorInfoLookup [Message/Public/CopyDef.cdl]
	ECmdPublicMythInfo = 31324,									//封神榜玩家信息 Message::Public::SMythInfo [Message/Public/CopyDef.cdl]
	ECmdPublicMythFightRecord = 31325,							//封神榜挑战记录 Message::Public::SMythRecordInfo [Message/Public/CopyDef.cdl]
	ECmdPublicMythToplist = 31326,								//封神榜排行榜 Message::Public::SMythToplistInfo [Message/Public/CopyDef.cdl]
	ECmdPublicMythReward = 31327,								//封神榜奖励 Message::Public::SSeqReward [Message/Public/CopyDef.cdl]
	ECmdPublicMythChallengeInfo = 31328,								//封神榜挑战信息 Message::Public::SMythCd [Message/Public/CopyDef.cdl]
	ECmdPublicMythNoticeClientGet = 31329,								//通知客户端更新玩家信息 NULL
	ECmdPublicMythInspire = 31330,								//封神榜镜像鼓舞百分比(内部使用)
	ECmdPublicRemovePromotionActivity = 31341,                              //内部使用 移除促销活动SRemovePromotionActivity [GameMsg.cdl]
	ECmdPublicEquipCopyReward = 31342,                          //装备副本奖励 Message::Public::SEnergyCopyInfo[Message/Public/GamePublic.cdl]
	ECmdPublicEquipCopyEnergyTimes = 31343,                     //装备副本体力兑换次数Message::Game::SGeneralState[GameMsg.cdl]
	ECmdPublicSubmitQuestionAnswer = 31345,                                 //由cell向inter提交答题答案 内部使用 SPlayerAnswerInfo [GameMsg.cdl]
	ECmdPublicLoveTaskJionCruise = 31346,                                 //友伴参加巡游 内部使用 SLoveTaskJoinCruise [GameMsg.cdl]
	ECmdPublicEquipCopyResult = 31347,                        //装备副本结果                Message::Public::SeqSEnergyCopyResult[Message/Public/GamePublic.cdl]

	ECmdPublicEquipCopySweepStart = 31348,                      //装备副本开始扫荡Message::Game::SSweepInfo[GameMsg.cdl]
	ECmdPublicEquipCopySweepInfo = 31349,                      //装备副本扫荡信息Message::Game::SSweepInfo[GameMsg.cdl]
	ECmdPublicEquipCopySweepEnd = 31350,                        //装备副本结束扫荡Message::Game::SSweepDrop[GameMsg.cdl]
	ECmdPublicEquipCopyRecorde = 31351,                         //装备副本记录更新(内部使用)

	ECmdPublicGuildBattleIcon = 31360,          //新仙盟战图标message::public::SGuildBattleCountdown [guildWar.cdl]
	ECmdPublicGuildBattleStart = 31361,          //新仙盟战开始message::public::SGuildBattleProfile [guildWar.cdl]
	ECmdPublicGuildBattleEnterInfo = 31362,          //当前新仙盟战消息message::public::SGuildBattleProfile [guildWar.cdl]
	ECmdPublicGuildBattleAltarInfo = 31363,          //新仙盟战祭坛消息更新message::public::SGuileBattleAltarInfo [guildWar.cdl]

	ECmdPublicGuildBattleReward = 31364,          //新仙盟战奖励信息message::public::SGuildBattleReward [guildWar.cdl]
	ECmdPublicGuildBattleEnd = 31365,          //新仙盟战结束
	ECmdPublicGuildBattleClose = 31366,          //新仙盟战关闭
	ECmdPublicGuildBattleScoreList = 31367,          //新仙盟战结算信息message::public::SGuildWarScoreList [guildWar.cdl]
	ECmdPublicGuildBattleCopyInfo = 31368,          //新仙盟战副本消息message::public::SGuildBattlePanelInfo [guildWar.cdl]
	ECmdPublicGuildBattleSignUpInfo = 31369,          //新仙盟战报名信息message::public::SGuildBattleSignUpInfo [guildWar.cdl](服务器内部使用)
	ECmdPublicGuildBattleEnter = 31370,     //新仙盟战进入仙盟副本(内部使用)
	ECmdPublicGuildBattleUpdatePlayerStatus = 31371,    //新仙盟战玩家状态更新(内部使用)
	ECmdPublicGuildBattleLeftCopy = 31372,    //新仙盟战玩家离开副本
	ECmdPublicGuildBattleOffline = 31373,    //新仙盟战玩家离线（内部使用）
	ECmdPublicGuildBattleEnterCheck = 31374,    //新仙盟战玩家进入副本检查(内部使用)
	ECmdPublicCatastropheCopyInfo = 31375,
	//渡劫副本信息Message::Public::SCatastropheCopyInfo [GamePublic.cdl]
	ECmdPublicGuildBattleAltarNumber = 31376,       //Message::Public::SSeqInts [GamePublic.cdl] 当前出现的祭坛

	ECmdPublicGuildTreeInfo = 31380,		//仙盟神树聚灵信息Message::Public::SGuildTreeInfo [IGuild.cdl]
	ECmdPublicGuildTreeGains = 31381,		//仙盟神树统计信息Message::Public::SGuildTreeGains [IGuild.cdl]
	ECmdPublicGuildTreeOpen = 31382,		//仙盟神树开启 NULL
	ECmdPublicGuildTreeClose = 31383,		//仙盟神树结束 NULL
	ECmdPublicGuildTreeResult = 31384,		//仙盟神树结算信息Message::Public::SGuildTreeGains [IGuild.cdl]

	ECmdPublicModifyRankingOverlordName = 31390,                            // 通知霸主副本所在cell对应霸主更名 SSeqAttributeUpdate
	ECmdPublicNewPetEgg = 31391,						//新宠物蛋可以免费领取通知 NULL
	ECmdPublicFarmTimes = 31392,						//仙园次数信息Message::Public::SFarmTimes [GamePublic.cdl]
	ECmdPublicFestivalClockInfo = 31393,						//新年钟声 Message::Public::SFestivalClock [ActiveDef.cdl]
	ECmdPublicFestivalBlessInfo = 31394,						//新年祝福 Message::Public::SFestivalBless [ActiveDef.cdl]
	ECmdPublicFestivalClockOpen = 31395,						//打开新年钟声NULL(服务器用）
	ECmdPublicFestivalClockLeave = 31396,						//离开新年钟声NULL(服务器用）
	ECmdPublicFestivalClockOper = 31397,						//敲响新年钟声NULL(服务器用）
	ECmdPublicFestivalBlessGet = 31398,						//获取新年祝福NULL(服务器用）
	ECmdPublicFestivalBlessOper = 31399,						//新年祝福NULL(服务器用）

	ECmdPublicGuildBattleTopPlayer = 31400,            //新仙盟战排名第一玩家Message::Public::SPublicMiniPlayer[GamePublic.cdl]
	ECmdPublicGroupEquipCopyInvited = 31500,           //装备副本组队好友邀请（内部使用）::Message::Public::SGroupAgree[group.cdl]
	ECmdPublicGroupEquipCopyCancel = 31501,            //装备副本组队取消邀请（内部使用）::Message::Public::SGroupAgree[group.cdl]
	ECmdPublicGuildBattleLog = 31502,            //新仙盟战统计日志
	ECmdPublicGuildBattleSettlement = 31503,            //新仙盟战结算面板
	ECmdPublicEquipCopyeEnergyActiveOpen = 31504,       //装备副本体力值领取开始
	ECmdPublicEquipCopyeEnergyActiveClose = 31505,       //装备副本体力值领取结束
	ECmdPublicSuitReward = 31506,       //套装奖励领取
	ECmdPublicEndLoveTaskRecordNum = 31507,       //完成情缘任务记录双方完成次数

	//怪兽战场[跨服] 31520~31549
	ECmdPublicGetCrossBossFieldList = 31520,	// 获取战场列表, ::Message::Public::SBossFieldList[Message/Public/Battlefield.cdl]
	ECmdPublicGetCrossBossFieldResult = 31521,	// 获取战场玩家结果, ::Message::Public::SBossFieldPlayerScores[Message/Public/Battlefield.cdl]
	ECmdPublicSubmitCrossBossFieldTask = 31522,	// 提交战场任务, NULL
	ECmdPublicCrossBossFieldPersonalInspire = 31523,	// 祈福,::Message::Public::SNewBattleFieldInspireInfo[Message/Public/GamePublic.cdl]
	ECmdPublicOpenCrossBossField = 31524,	// 战场开启, ::Message::Public::SBossFieldOpen[Message/Public/Battlefield.cdl]
	ECmdPublicCloseCrossBossField = 31525,	// 战场关闭, NULL
	ECmdPublicCrossBossFieldForceCredit = 31526,	// 势力排行, ::Message::Public::SBossFieldScore[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldPlayerCredit = 31527,	// 个人排行, ::Message::Public::SBossFieldMyScore[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldEnter = 31528,	// 进入战场, NULL
	ECmdPublicCrossBossFieldLeft = 31529,	// 离开战场, NULL
	ECmdPublicCrossBossFieldList = 31530,	// 战场列表, ::Message::Public::SBossFieldList[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldResult = 31531,	// 战场玩家结果, ::Message::Public::SBossFieldPlayerScores[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldBossList = 31532,	// 怪兽列表,  ::Message::Public::SBossFieldBossInfo[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldPickupBoss = 31533,	// 选择怪兽, ::Message::Public::SBossFieldPickup[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldBossItemCode = 31534,	// 怪兽战场怪兽模型, ::Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicCrossBossFieldServerData = 31535,	// 怪兽战场服务器数据 ::Message::Public::SCrossBossServerData[Message/Public/Battlefield.cdl]
	ECmdPublicCrossBossFieldDivdeWarZone = 31536,	// 怪兽战场战区划分 NULL

	ECmdPublicMythRewardNoticeToClient = 31550,	// 封神榜奖励通知 NULL
	ECmdPublicMythFightNoticeToClient = 31551,	// 封神榜挑战通知 NULL

	ECmdPublicMoneyTreeCanShakeFreeNoticeToClient = 31552, //摇钱树可以免费摇通知 ::Message::Game::MoneyTreeShakeTimes[Message/Game/GameMsg.cdl]

	ECmdPublicWeddingCarFollowJoin = 31553, //婚礼花车巡游::Message::Public::SMarryFollowStatus [Message/Public/GamePublic.cdl]服务器内部使用
	ECmdPublicWeddingCarFollowing = 31554, //是否有参加花车巡游 (服务器内部使用)
	ECmdPublicWeddingSendGiftToFollow = 31555, // 结婚物品奖励(服务器内部使用)
	ECmdPublicWeddingDistanceCheck = 31556, //花车巡游开始距离判断(服务器内部使用) Message::Public::SMarryReply
	ECmdPublicGangFightsTeamInvite = 31557,   // --3v3战队邀请成员 SGangFightsInviteMsg[GangFights.cdl]
	ECmdPublicWeddingTimesGet = 31558, // 结婚次数判断(服务器内部使用)Message::Public::SBookWedding
	ECmdPublicRecordPlayerSweetDegree = 31559,      //记录玩家结婚甜蜜度(服务器使用)Message::Public::SWeddingFirework
	ECmdPublicRuneUpgradeTimes = 31560,					//天赋技能吸引经验剩余次数 [Message/Public/GamePublic.cdl]

	//欢乐修仙骰 31561~31600
	ECmdPublicLiarDiceRoomList = 31561,		// 房间列表, ::Message::Public::SLiarDiceRoomList [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceCloseSence = 31562,		// 清除界面更新列表[服务端] NULL
	ECmdPublicLiarDiceJoinGame = 31563,		// 加入游戏 [服务端] ::Message::Public::SLiarDiceRoomPos [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceGiveUp = 31564,		// 放弃游戏 [服务端] NULL
	ECmdPublicLiarDiceZoomRoom = 31565,		// 缩小界面 [服务端] NULL 
	ECmdPublicLiarDiceInvation = 31566,		// 邀请游戏 ::Message::Public::LiarDiceRoomId [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceKickOut = 31567,		// 踢出游戏 NULL[服务端]
	ECmdPublicLiarDiceClosePos = 31568,		// 关闭位置 [服务端]::Message::Public::SLiarDiceRoomPos [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceAssignMaster = 31569,		// 委任房主 [服务端][NULL] 
	ECmdPublicLiarDiceShake = 31570,		// 摇骰子 [服务端] NULL
	ECmdPublicLiarDiceCall = 31571,		// 叫骰子 ::Message::Public::SLiarDiceCall [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceShow = 31572,		// 开骰子 [服务端]NULL
	ECmdPublicLiarDicePlayer = 31573,		// 玩家信息	::Message::Public::SLiarDicePlayer [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDicePlayerList = 31574,		// 玩家列表 ::Message::Public::SLiarDicePlayerList [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceOperatorInfo = 31575,		// 玩家操作 ::Message::Public::SLiarDiceOperatorInfo [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceResult = 31576,		// 骰子结果 ::Message::Public::SLiarDiceResult [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDicePlayerScore = 31577,		// 结算统计 ::Message::Public::SLiarDicePlayerScoreList [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceMyInfo = 31578,		// 个人信息 [服务端]::Message::Public::SLiarDiceMyInfo [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceClosePosList = 31579,		// 位置关闭 ::Message::Public::SLiarDiceClosePos [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceRoomLock = 31580,		// 房间挂起 ::Message::Public::SLiarDiceLockRoom [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceOpenPos = 31581, 		// 打开位置 [服务端]::Message::Public::SLiarDiceRoomPos [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceReady = 31582,		// 游戏准备 NULL
	ECmdPublicLiarDiceAbort = 31583,		// 游戏中止准备阶段 NULL 	
	ECmdPublicLiarDiceNextPos = 31584,		// 下次叫骰子的位置 ::Message::Public::SLiarDiceRoomPos [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceScore = 31585,		// 结算信息 [服务端]::Message::Public::SLiarDiceMyInfo [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceKickoutMaster = 31586,		// 踢房主 NULL
	ECmdPublicLiarDiceKickoutAbort = 31587,		// 中止踢房主 
	ECmdPublicLiarDiceNoticeZoom = 31588,		// 通知缩小玩家 
	ECmdPublicLiarDiceRefuseInvite = 31589,		// 拒绝邀请游戏 ::Message::Public::LiarDiceRoomId [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDiceSetSystem = 31590,		// 房间托管 NULL 服务端用
	ECmdPublicLiarDiceCallList = 31591,		// 骰子列表 
	ECmdPublicLiarDiceEndZoom = 31592,		// 非缩小界面了 [服务端]NULL
	ECmdPublicLiarDiceShakeTime = 31593,		// 换骰子倒计时
	ECmdPublicLiarDiceReward = 31594,		// 	大话骰奖励[服务端] ::Message::Public::SLiarDiceReward [Message/Public/CrossGame.cdl]
	ECmdPuclicLiarDiceStatus = 31595,		// 房间状态 ::Message::Public::SLiarDiceStatus [Message/Public/CrossGame.cdl]
	ECmdPublicLiarDicePause = 31596,		// 大话骰活动中止 [服务端] NULL
	ECmdPublicLiarDiceRestart = 31597,		// 大话骰活动start
	ECmdPublicLiarDicePersonInfo = 31598,		// 个人房间信息 ::Message::Public::SInviteLiarDiceRoomId [Message/Public/CrossGame.cdl]
	ECmdPublicKickOutLiarDicePlayerByOnlineOper = 31599,		//在线强制踢出玩家 NULL
	//欢乐修仙骰 31561~31600
	ECmdPublicWeddingExtend = 31601,          // 仙缘系统下推 ::Message::Game::SWeddingExtend [Message/Game/GameMsg.cdl]
	ECmdPublicWeddingMemorial = 31602,          //结婚纪念 ::Message::Game::SWeddingMemorial [Message/Game/GameMsg.cdl]
	ECmdPublicWeddingMemorialCheck = 31603,           //结婚纪念领取检查 ::Message::Game::SWeddingMemorial [Message/Game/GameMsg.cdl]
	ECmdPublicClearWeddingTimes = 31604,           //清除结婚次数

	//31610-31650皇帝争霸功能使用
	ECmdPublicCheckFeudalHegemony = 31610,            //进入皇帝争霸检查
	ECmdPublicFeudalHegemonyStart = 31611,            //皇帝争霸开始
	ECmdPublicFeudalHegemonyEnd = 31612,            //皇帝争霸结束
	ECmdPublicFeudalHegemonyScoreList = 31613,           //积分信息 ::Message::Public::SGuildWarScoreList[Message/Public/GuildWar.cdl]
	ECmdPublicFeudalHegemonyReward = 31614,             //奖励结算 ::Message::Public::SSeqReward[Message/Public/GamePublic.cdl](服务器内部使用)
	ECmdPublicFeudalHegemonyGetInfo = 31615,             //获取皇帝争霸信息 ::Message::Public::SFeudalHegemonyEnterInfo[Message/Public/GamePublic.cdl]
	ECmdPublicFeudalHegemonyIcon = 31616,             //皇帝争霸图标
	ECmdPublicFeudalHegemonyPanel = 31617,             //皇帝争霸个人面板显示 ::Message::Public::SFeudalHegemonyPanelInfo[Message/Public/GamePublic.cdl]
	ECmdPublicFeudalHegemonyLeft = 31618,             //玩家离开
	ECmdPublicNoticeFlagPosition = 31619,             //推送彩旗位置信息 ::Message::Public::spoint[Message/Public/GamePublic.cdl]
	ECmdPublicFeudalHegemonyEnter = 31620,             //玩家进入 
	ECmdPublicFeudalHegemonyClientReward = 31621,             // 客户端最后结算奖励 ::Message::Public::SFeudalHegemonyReward  [Message/Public/GamePublic.cdl]
	ECmdPublicFeudalHegemonyCityTitle = 31622,             //主城盟主名字 ::Message::Public::SFeudalHegemonyGuildName [Message/Public/GamePublic.cdl]
	ECmdPublicFeudalHegemonyEnermyGuild = 31623,             //敌对仙盟ID ::Message::Public::SFeudalHegemonyEnermyGuild [Message/Public/GamePublic.cdl]

	ECmdPublicActivateHideAndSeekBoss = 31650,		//激活捉迷藏boss 
	ECmdPublicDeactivateHidAndSeekBoss = 31651,		//关闭抓迷藏boss
	ECmdPublicTickHideAndSeekBoss = 31652,		//玩家点击抓迷藏boss
	ECmdPublicMarketTrace = 31653,        //玩家市场交易

	ECmdPublicDynamicActiveUpdateTime = 31654,        //活动配置更新命令


	//31655-31670结义系统使用
	ECmdPublicSwornInfo = 31655,			//玩家结义信息下推 ::Message::public::SSwornRecordInfo [Message/public/GamePublic.cdl]
	ECmdPublicSwornWeddingInfo = 31656,		//玩家结义典礼信息下推 ::Message::Public::SSwornWeddingInfo [Message/public/GamePublic.cdl]
	ECmdPublicSwornDisbandInfo = 31657,		//结义解散消息下推 ::Message::Public::SSwornRecordInfo [Message/public/GamePublic.cdl]

	ECmdPublicSwornInvitFriendInfo = 31659,		//邀请玩家结义下推 ::Message::Public::SSwornInvitInfo [Message/Public/GamePublic.cdl]
	ECmdPublicSwornWeddingStart = 31660,		//结义开启场景 ::Message::Public::SSwornToVCell [Message/public/Gamepublic.cdl]
	ECmdPublicSwornWeddingEnd = 31661,		//结义典礼结束 ::Message::Public::SSwornToVCell [Message/public/Gamepublic.cdl]
	EcmdPublicSwornWeddingResult = 31662,		//结义典礼结果 ::Message::Public::SMarryWeddingResult [Message/public/Gamepublic.cdl]
	ECmdPublicSwornEnterWedding = 31663, 		//进入结义场景 ::Message::Public::SEnterWedding [Message/public/Gamepublic.cdl]
	ECmdPublicGetSwornWeddingGuests = 31664,	//获取结义典礼宾客信息 ::Message::public::SMarryGuestInfos [Message/public/GamePublic.cdl]
	ECmdPublicStartSworn = 31665,			//手动开始结义典礼 NULL
	ECmdPublicSwornStart = 31666,			//典礼开始 NULL
	ECmdPublicSwornTitle = 31667,			//结义专属称号下推 ::Message::Public::SSwornTitle [Message/public/GamePublic.cdl]
	ECmdPublicAllSwornWedding = 31668,		//所有的正在举行的结义典礼下推 ::Message::Public::SwornWeddingInfo [Message/public/Gamepublic.cdl]
	ECmdPublicRejectInvit = 31669,			//邀请结果下推 ::Message::public::SReplyMsg [Message/Game/GameMsg.cdl]

	ECmdPublicSpaStart = 31670,		// 活动开始
	ECmdPublicSpaEnd = 31671,		// 活动结束

	ECmdPublicActiveMarry = 31672,        //结婚活动相关 ::Message::public::SActiveMarryMsg [Message/Game/GameMsg.cdl]
	ECmdPublicTalkInSworn = 31673,		//结义群聊 Message::Game::SChatMsg [Message/Game/GameMsg.cdl]
	ECmdPublicSwornFriendInfo = 31674,	//满足结义条件的好友下推 Message::Public::SSwornFriend [Message/Public/GamePublic]

	ECmdPublicCountryAppointCd = 31699,		//下推职位任命cd ::Message::Game::SCountryAppointCd [Message/Game/ICountry.cdl]
	ECmdPublicCountryUpdateInfo = 31700,    //更新玩家国家信息 ::Message::Game::SPlayerCountryInfo [Message/Game/ICountry.cdl]
	ECmdPublicCountryCallTogether = 31701,    //国家召集令 ::Message::Game::SCountryCallTogether [Message/Game/ICountry.cdl]
	ECmdPublicUpdateOfficerInfo = 31702,    //更新官员信息 ::Message::Game::SOfficerInfo [Message/Game/ICountry.cdl]
	ECmdPublicForbidTalking = 31703,    //禁言消息 Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicCountryCallTogetherSuccess = 31704,      //成功发送国家召集令
	ECmdPublicCountryBuff = 31705,      //国家buff开启消息::Message::Game::SCountryBuffInfo [Message/Game/ICountry.cdl]
	ECmdPublicCountryStart = 31706,      //国家功能开启
	ECmdPublicOfficerInfoUpdate = 31707,    //国家官职信息更新
	ECmdPublicCountryPrivilegeInfo = 31708,    //国家特权使用消息::Message::Game::SCountryPrivilegeInfo [Message/Game/ICountry.cdl]
	ECmdPublicCountryMoneyUpdate = 31709,    //国库资金更新 Message::Game::SCountryMoneyUpdate [Message/Game/ICountry.cdl]
	ECmdPublicCountryMoneyRecord = 31710,    //国库资金记录 Message::Game::SCountryMoneyRecord [Message/Game/ICountry.cdl]
	ECmdPublicCountryContriAssist = 31711,    //助功获得战功 Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicCountryAddContribution = 31712,    //增加战功 Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]

	ECmdPublicSwornCeremonyEnd = 31713,		//结义仪式结束 NUll
	ECmdPublicSwornCeremonyStart = 31714,		//结义仪式开始 Message::public:: SSwornRecordInfo [message/public/gamepublic.cdl]
	ECmdPublicInSwornWedding = 31715,			//处于典礼中 Message::game::SNotileClientHaveWeddingMsg[message/Game/GameMsg.cdl]
	ECmdPublicInSwornCeremony = 31716,		//处于仪式中 NULL 

	ECmdPublicFriendStrengthInfo = 31717,		//好友赠送体力信息下推 Message::Public::SFriendStrength [Message/public/GamePublic.cdl]


	ECmdPublicPlantSeed = 31720,            // 天澜大陆种树
	ECmdPublicPlantWeed = 31721,            // 天澜大陆砍树
	ECmdPublicPlantGetLimitPrize = 31722,   // 天澜大陆获得限次奖励
	ECmdPublicPlantGetValuePrize = 31723,   // 天澜大陆获得限次奖励
	ECmdPublicPlantGetPlantInfo = 31724,   // 天澜大陆获得限次奖励
	ECmdPublicGuildSumeruDreamlandOpen = 31725,    //仙盟副本，须弥梦幻开启（服务器） Message::Public::SGuildSumeruDreamlandOpen [Message/Public/GamePublic.cdl]
	ECmdPublicGuildSumeruDreamlandInfo = 31726,    //仙盟副本，须弥梦幻信息（客户端） Message::Public::SGuildSumeruDreamlandInfo [Message/Public/GamePublic.cdl]
	ECmdPublicInviteFriendInfo = 31727,		//获取邀请好友列表  Message::Public::SeqPublicMiniPlayer [Message/public/GamePublic.cdl]
	ECmdPublicInviteFriendUpdateInfo = 31728,  //邀请好友列表更新 Message::Game::SFriendInviteInfoUpdateMsg [Message/Game/GameMsg.cdl]
	ECmdPublicGuildEnterSumeruDreamland = 31729,    //进入仙盟副本,须弥幻境（服务器） Message::Public::SGuildSumeruDreamlandOpen [Message/Public/GamePublic.cdl]
	ECmdPublicGuildSumeruDreamLandClose = 31730,    //仙盟副本，须弥幻境关闭（服务器） Message::Public::SGuildSumeruDreamlandClose [Message/Public/GamePublic.cdl]
	ECmdPublicGuildSumeruDreamlandAddAttr = 31731,    //仙盟副本，须弥梦幻信息（客户端） Message::Public::SGuildSumeruDreamlandInfo 
	ECmdPublicLogBossGuildDrop = 31732, //仙盟归属的boss创建、掉落归属
	ECmdPublicSwornHaveWedding = 31733,//通知客户端有正在举行的仪式[Message/Public/GamePublic.cdl]Message::Game::SNotileClientHaveWeddingMsg [Message/Game/GameMsg.cdl]

	//玩家跨服Inter
	ECmdPublicCrossInterUpPlayer = 31734,//玩家上线上传玩家信息至跨服
	//单服Inter注册至跨服Inter
	ECmdPublicCrossInterRegistInter = 31735,//单服Inter注册至跨服Inter

	//---------------封神竞技[31736-31742]---------------------------------
	ECmdPublicMirrorBattleWeekReward = 31736,           //封神竞技周奖励命令 Message::Game::SCrossMirrorBattleReward[Message/Public/GameMsg.cdl]
	ECmdPublicMirrorBattleWeekTitle = 31737,            //封神竞技周奖励称号命令 Message::Game::SCrossMirrorBattleTitle [Message/Public/GameMsg.cdl]
	ECmdPublicMirrorBattleActiveReward = 31738,         //封神竞技活动奖励命令  Message::Game::SCrossMirrorBattleActiveReward[Message/Public/GameMsg.cdl]
	//---------------封神竞技[31736-31742]---------------------------------

	ECmdPublicEliteCopySweepInfo = 31743,                       //精英副本扫荡信息 Message::Game::SSeqSweepInfo
	ECmdPublicEliteCopySweepStart = 31744,                      //开始精英副本扫荡
	ECmdPublicEliteCopySweepEnd = 31745,                        //精英副本扫荡结束

	ECmdPublicLoginNeedQueue = 31746,		//登录排队下推，进入排队
	ECmdPublicLoginQueueEnd = 31747,		//登录排队结束，进入选择角色

	ECmdPublicPushRingInfo = 31748,			//推图本刷挂广播 ::Message::Public::SCopyMsgInfo [Message/Public/CopyDef.cdl]

	//---------------在线抽奖[31749-31759]---------------------------------
	ECmdPulicActiveDrawMsg = 31749,                            //在线抽奖面板信息Message::Game::SActiveOnlineDrawMsg[Message/Public/IActivity.cdl]
	ECmdPublicActiveDrawResult = 31750,                        //抽奖结果Message::Game::SActiveOnlineDrawRecord[Message/Public/IActivity.cdl]
	ECmdPublicActiveDrawRewardGive = 31751,                    //发放抽奖奖励Message::Game::SActiveOnlineDrawRecord[Message/Public/IActivity.cdl]
	ECmdPublicActiveDrawStart = 31752,                         //开始摇奖 NULL
	ECmdPublicActiveDrawEnd = 31753,                           //结束摇奖 NULL
	EcmdPublicActiveCheckReward = 31754,                       //奖励检查，防止中途掉线，奖励无法发送
	ECmdPublicActiveGoldUpdate = 31755,                        //元宝更新Message::Game::SActiveOnlineDrawTotalGold[Message/Public/IActivity.cdl]
	ECmdPublicActiveRecordUpdate = 31756,                      //抽奖记录更新Message::Game::SActiveOnlineDrawRecord[Message/Public/IActivity.cdl]
	ECmdPublicActiveDrawTimesUpdate = 31757,                 //抽奖记录更新Message::Game::SActiveOnlineDrawTimes[Message/Public/IActivity.cdl]
	ECmdPublicActiveDrawTimesReward = 31758,                //抽奖记录更新Message::Game::SActiveOnlineDrawReward[Message/Public/IActivity.cdl]
	ECmdPulicActiveDrawMsgToAllPlayer = 31759,        //在线抽奖面板信息Message::Game::SActiveOnlineDrawMsg[Message/Public/IActivity.cdl]
	//---------------在线抽奖[31749-31759]---------------------------------

	ECmdPublicRequestMapShield = 31760,                //客户端请求地图屏蔽可见

	ECmdPublicPromotionBuyLimitTimeNew = 31761,    //限时促销活动信息（客户端） Message::Game::SNewPromotionBuyItemsMsg [Message/Game/GameMsg.cdl]
	ECmdPublicPromotionBuyShopNew = 31762,    //商城促销活动信息（客户端） Message::Game::SNewPromotionBuyItemsMsg [Message/Game/GameMsg.cdl]
	ECmdPublicPromotionBuyLimitTimeNewUpdate = 31763,    //商城促销活动信息更新（客户端） Message::Game::SNewPromotionBuyItemsMsg [Message/Game/GameMsg.cdl]

	ECmdPublicDefenseCopyScoreUpdate = 31764,    //防守副本传送门能量更新 Message::Game::SDefenseCopyScoreUpdate [Message/Game/GameMsgEx.cdl]

	//-------------------------------------------仙盟BOSS
	ECmdPublicGuildBossNewInfo = 31765, //仙盟BOSS信息Message::Game::SGuildBossNewInfo [Message/Game/IGuild.cdl]

	//---------------任务目标[31766-31776]---------------------------------
	ECmdPublicTaskTargetInfoUpdate = 31766,     //任务目标更新Message::Game::STaskTargitInfo[Message/Game/ITaskTargit.cdl]
	ECmdPublicTaskTargetHurtAngryMonsterKing = 31767, //给魔君造成了伤害 NULL
	ECmdPublicTaskTargetHaveRewardsToGet = 31768,      //有奖励可领
	ECmdPublicTaskTargetNoRewardsToGet = 31769,       //没有奖励可领
	//---------------任务目标[31766-31776]---------------------------------

	//---------------副本房间和仙盟资源副本[31780-31800] begin---------------------------------
	ECmdPublicMyCopyRoom = 31780,		//下推自己房间 Message::Game::SMyRoom[Message/Game/ICopyRoom.cdl]
	ECmdPublicInviteInfo = 31781,		//下推发给自己的房间邀请 Message::Game::SInviteInfo[Message/Game/ICopyRoom.cdl]
	ECmdPublicAllCopyRoom = 31782,		//下推全部房间列表 Message::Game::SCopyRooms[Message/Game/ICopyRoom.cdl]
	ECmdPublicCopyRoomsUpdate = 31783,	//下推房间列表更新部分 Message::Game::SCopyRooms[Message/Game/ICopyRoom.cdl]
	ECmdPublicInviteList = 31784,		//下推盟友可邀请列表 Message::Game::SRoomInviteList[Message/Game/ICopyRoom.cdl]
	ECmdPublicRefuseInvite = 31785,		//下推拒绝邀请的信息 Message::Game::SRefuseInviteInfo[Message/Game/ICopyRoom.cdl]

	ECmdPublicCreateCopyRoom = 31786,	//创建房间信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]			
	ECmdPublicEnterCopyRoom = 31787,	//进入房间信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]			
	ECmdPublicCopyRoomkickOut = 31788,	//踢出房间信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyRoomCreateCopy = 31789,	//创建副本信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyRoomLeaveRoom = 31790,	//离开房间信息
	ECmdPublicCopyRoomInvite = 31791,		//邀请玩家信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyRoomAgreeInvited = 31792,		//同意邀请信息 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyRoomUpdateRoomCopyInfo = 31793,	//更新房间副本的玩家信息 Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicCopyRoomMirrorEnterCopy = 31794,		//镜像玩家进入副本 Message::Public::SFightRoleMirror[Message/Public/FightRole.cdl]
	ECmdPublicCopyShowPlayerPrize = 31795,			//显示副本奖励 Message::Game::SCopyPrizeInfo[Message/Game/GameMsgEx.cdl]
	ECmdPublicCopyRoomUpdateMirror = 31796,			//请求更新玩家镜像
	ECmdPublicOpenWinOpMsg = 31797,			//打开窗口操作 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyRoomUpdateWeapons = 31798,			//同步当前使用装备
	ECmdPublicCopyRoomCopyEnd = 31799,			//副本结束Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	//---------------副本房间和仙盟资源副本[31780-31800] end-----------------------------------

	//---------------仙帝争霸[31801-31820] begin---------------------------------
	ECmdPublicEndlessInfos = 31801,    //下推所有仙帝信息 Message::Game::SAllEndlessBossInfo[Message/Game/IEndlessBoss.cdl]
	ECmdPublicEndlessCoolTime = 31802,//下推挑战冷却时间 Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicEndlessInfo = 31803,    //挑战成功时下推当前BOSS信息 Message::Game::SEndlessBossInfo[Message/Game/IEndlessBoss.cdl]
	ECmdPublicEndlessleftTime = 31804,//下推挑战剩余时间 Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicEndlessResult = 31805,//下推挑战剩余时间 Message::Game::SEndlessBossChallengeResult[Message/Game/IEndlessBoss.cdl]
	ECmdPublicEndlessTitle = 31806,			//是否可用称号Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]
	ECmdPublicEndlessClientResult = 31807,		//下推挑战结果(客户端)Message::Game::SEndlessBossChallengeClientResult[Message/Game/IEndlessBoss.cdl]
	//---------------仙帝争霸[31801-31815] end-----------------------------------




	ECmdPublicDoubleChargeReward = 31816,     //充值双倍(固定为开服前 1-7 ， 9-15 天， 合服后一直生效) NULL 
	ECmdPublicActiveGoldConsumption = 31817,  //消费排行活动
	EcmdPublicLoveZazenTimeLeft = 31818,	  //情缘区修炼剩余时间
	ECmdPublicActiveGoldConsumeCross = 31819,  //跨服消费排行活动

	//---------------跨服喇叭[31820-31830] begin---------------------------------
	ECmdPublicCrossChatMsg = 31820,				//跨服喇叭广播 Message::Game::SChatMsg [Message/Game/GameMsg.cdl]
	ECmdPublicCrossChatMsgLogin = 31821,		//跨服喇叭登录获取 Message::Game::SChatMsg [Message/Game/GameMsg.cdl]
	ECmdPublicCrossChat2CrossInter = 31822,		//跨服喇叭gate2CrossInter Message::Game::SChatMsg [Message/Game/GameMsg.cdl]
	//---------------跨服喇叭[31820-31830] end-----------------------------------

	//----------------练功房[31831- 31845] begin----------------------------------
	ECmdPublicBreakTo40Level = 31831,			//玩家突破到40级
	ECmdPublicGetTrainRoomInfo = 31832,		//获取练功房信息
	ECmdPublicPushTrainRoomInfo = 31833,		//下推练功房信息
	ECmdPublicEnterTrainRoom = 31834,			//进入练功房
	ECmdPublicPushPlayerTrainRoomGain = 31835,	//下推玩家练功房收益
	ECmdPublicTrainRoomDrawRewardRemind = 31836,	//提醒玩家领取练功房收益
	ECmdPublicCloseTrainRoomWindow = 31837,			//通知服务器窗口关闭，停止下推
	//----------------练功房[31831- 31845] end----------------------------------

	//---------------60级副本[31846-31856] begin---------------------------------
	ECmdPublic60CopyRecordInfo = 31846,				//60级副本记录信息
	ECmdPublic60CopyRecordInfoInCopy = 31847,		//在副本里推送
	ECmdPublic60CopyBossRefreshPush = 31848,		//刷怪下推
	//---------------60级副本[31846-31856] end-----------------------------------

	ECmdPublicCrossPromotionCard2CrossInter = 31857,	//跨服推广卡 Message::Game::SCrossPromotionCard [Message/Game/GameMsgEx.cdl]
	ECmdPublicCrossPromotionCard = 31858,				//跨服推广卡 Message::Game::SCrossPromotionCard [Message/Game/GameMsgEx.cdl]

	ECmdPublicFightAttributeAddThisInCell = 31859,		// cell中计算的附加属性，在计算百分比加成的时候会使用到 ::Message::Public::SFightAttribute [Message/Public/FightRole.cdl]

	//----------------------------镜像组队[31860 - 31870]------------------------
	ECmdPublicMirrorInvtiListInfo = 31860,				//镜像组队邀请列表下推  Message::Public::SSeqSGroupInvite [Message/Public/IGroup.cdl]
	ECmdPublicMirrorEnterCopy = 31861,					//镜像进入副本 Message::Public::SFightRoleMirror [Message/Public/FightRole.cdl]
	ECmdPublicResetMirrorTimes = 31862,					//重置镜像援助次数（测试用） 	
	ECmdPublicGetMembersLeftTimes = 31863,				//好友剩余次数 Message::Public::SDictIntInt [Message/public.cdlPublic]
	ECmdPublicGetMemberLeftTimerFromGate = 31864,		//从对应gate获取是否完成副本	

	//----------------------------双人坐骑[31871 - 31873]------------------------
	ECmdPublicDoubleMountInvited = 31871,				//双人坐骑邀请  Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicDoubleMountReply = 31872,				//双人坐骑邀请回复 
	ECmdPublicDoubleMountDisband = 31873,				//双人坐骑离开或解散
	//----------------------------跨服获取单服信息[31874 - 31895]------------------------
	ECmdPublicGetSingleServerInfo = 31874,			//获取单服信息

	//----------------------------3V3[31876 - 31896]------------------------
	ECmdPublicPushAllRoomsInfo = 31876,				//下推所有房间信息  Message::Game::SAllRoomsInfo [Message/Inter/IInterCrossThreeVsThree.cdl]
	ECmdPublicRoomInfoUpdate = 31877,				//单个房间更新信息  Message::Game::SRoomInfo [Message/Inter/IInterCrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeOpen = 31878,             //3v3开启 NULL
	ECmdPublicThreeVsThreeClose = 31879,            //3v3关闭 NULL
	ECmdPublicThreeVsThreeInitInfo = 31880,         //3v3初始化信息 Message::Game::SRPlayerThreeVsThreeInitInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeInvite = 31881,           //邀请 Message::Game::SPlayerThreeVsThreeInviteInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeEnterCopy = 31882,        //3v3进入副本 Message::Game::SPlayerEnterCopyInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreePlayerRoomIdUpdate = 31883,     //3v3玩家房间id更新 Message::Game::SPlayerRoomIdUpdateInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreePlayerJoinTimesUpdate = 31884,  //3v3玩家剩余次数更新 Message::Game::SPlayerLeftJoinTimesUpdateInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreePreparePanelInfos = 31885,       //准备战斗面板消息 Message::Game::SPreparePanelInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeFightEndInfo = 31886,       //战斗结束消息 Message::Game::SThreeVsThreeFightEndInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeFightEndPanelInfos = 31887,  //战斗结束面板消息体 Message::Game::SThreeVsThreeFightEndInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeWin = 31888,                  //赢得一场战斗 NULL
	ECmdPublicThreeVsThreeFail = 31889,                  //输一场战斗 NULL
	EcmdPublicThreeVsThreeItemReward = 31890,            //3v3物品奖励发放 Message::Game::SThreeVsThreeRewardInfo[Message/Game/ICrossThreeVsThree.cdl]
	EcmdPublicThreeVsThreeTitleReward = 31891,            //3v3物品奖励发放 Message::Game::SThreeVsThreeRewardInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeTargetChangeInfo = 31892,       //3v3目标切换 Message::Game::SThreeVsThreeTargetChangeInfo[Message/Game/ICrossThreeVsThree.cdl]
	ECmdPublicThreeVsThreeReadyBroadCast = 31893,         //3v3准备广播
	ECmdPublicThreeVsThreeOpenBroadCast = 31894,          //3v3开启广播
	//----------------------------3V3[31876 - 31896]------------------------

	ECmdPublicMail = 31897,							//邮件信息（用于不具备邮件发送能力的进程转交邮件给其他进程 ） Message::Public::SPlayerMail
	ECmdPulbicUpdateRankList = 31898,				//更新排行榜信息 Message::Public::SPlayerToplist


	//---------------跨服主城[31900-31910]-----------------------
	ECmdPublicLeftCrossMainCell = 31900,				//通知玩家离开跨服主城
	ECmdPublicCloseCrossMainCell = 31901,				//通知单服关闭跨服主城
	ECmdPublicPushCrossMainCellKingInfo = 31902,		//向跨服推送昊天城主信息
	ECmdPublicGetCrossMainCellKingInfo = 31903,		//获取昊天城主信息
	ECmdPublicUpdateCrossMainCellKingInfo = 31904,		//更新昊天城主信息
	ECmdPublicPushPlayerAdoreInfo = 31905,				//下推玩家崇拜相关信息
	ECmdPublicPushPlayerTicketInfo = 31906,			//下推玩家跨服主城门票信息
	ECmdPublicGetCityBidKingInfo = 31907,				//获取参与竞拍一级城的皇帝信息
	ECmdPublicPushCityBidKingInfo = 31908,				//推送参与竞拍一级城的皇帝信息



	//------------------------------------跨服组队 31920 - 31960--------------------------------------------
    ECmdPublicCrossTeamErrorInfo 	= 31920,         	//抛错处理    	Message::public::SErrorInfo [Message/Public/Group.cdl]
    ECmdPublicCrossTeamCreate 		= 31921,         	//创建团队      Message::Public::SCrossTeamCreate[Message/Public/Group.cdl]
    ECmdPublicCrossTeamInfo 		= 31922,      		//团队信息      Message::public::SCrossTeam [Message/Public/Group.cdl]
    ECmdPublicCrossTeamGetList 		= 31923,      		//获取团队列表 	C2S:副本code Message::Public::SInt [Message/Public/CdlPublic.cdl]   S2C: Message::public::SSeqCrossTeam [Message/Public/Group.cdl]
    ECmdPublicCrossTeamApply		= 31924,           	//申请入队  	队伍id  Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicCrossTeamKickOut 		= 31925,            //踢人  		对方id  Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicCrossTeamLeft    		= 31926,            //离开团队 NULL
    ECmdPublicCrossTeamEnterCopy	= 31927,            //进入副本 NULL
    ECmdPublicCrossTeamQuickJoin	= 31928,            //快速加入 C2S:副本code Message::Public::SInt [Message/Public/CdlPublic.cdl]
    ECmdPublicCrossTeamGetInfo		= 31929,            //获取团队信息 C2S:副本code SInt [Message/Public/CdlPublic.cdl]   SPublicTinyPlayer [Message/Public/GamePublic.cdl]
    ECmdPublicCrossTeamOpen			= 31930,			//跨服组队开启 NULL
    ECmdPublicCrossTeamCrossOpen	= 31931,			//跨服组队跨服开启 NULL
    ECmdPublicCrossTeamCreateNotice	= 31932,         	//创建团队广播 SCrossTeamCreate[Message/Public/Group.cdl]
    ECmdPublicCrossTeamWorldInvite	= 31933,			//世界邀请 NULL
    ECmdPublicCrossTeamGuildInvite	= 31934,			//仙盟邀请 NULL
    ECmdPublicCrossTeamFriendInvite	= 31935,            //好友邀请 对方id SEntityId  推送:SCrossTeamFriendInvite [Message/Public/GamePublic.cdl]

    ECmdPublicCrossTeamChat 		= 31946,           //跨服队伍聊天 Message::Public::SChatMsg [Message::Public::GamePublic.cdl]

	//------------------------------------跨服仙盟战 31961 - 31980--------------------------------------------
	ECmdPublicCrossGuildBattleOpenRemind = 31961,  //跨服仙盟战开启提醒 NULL
	ECmdPublicCrossGuildGroupedInfo = 31962,       //分组消息推送 Message::Public::SSeqGuildBattleGroupedInfos [Message::Public::GuildWar.cdl] 
	ECmdPublicCrossGuildBattleStart = 31963,       //仙盟战开启 NULL
	ECmdPublicCrossGuildBattleCollectGuildInfos = 31964,     //仙盟战收集单服仙盟信息 NULL
	ECmdPublicCrossGuildBattleGuildInfos = 31965,            //仙盟战仙盟信息 Message::Public::SGuildBattleSignUpInfo[Message::Public::GuildWar.cdl]
	ECmdPublicCrossGuildBattleEnd = 31966,         //仙盟战结束 
	//------------------------------------跨服仙盟战 31961 - 31980--------------------------------------------

	ECmdPublicCrossPlayersInfo = 31971,			//下推跨服玩家信息

	//------------------------------------幻月迷宫 31981 - 31991----------------------------------------------
	ECmdPublicParaseleneMazeCopyInfo = 31981,			//副本信息
	ECmdPublicParaseleneMazeEventResult = 31982,		//事件结果
	ECmdPublicParaseleneMazeOpenChest = 31983,			//开宝箱
	ECmdPublicParaseleneMazeEventClear = 31984,			//通过小游戏
	ECmdPublicParaseleneMazeEventTrigger = 31985,		//触发事件 
	ECmdPublicParaseleneMazePassIntoCopy = 31986,		//进入副本
	EcmdPublicParaseleneMazePushQuestion = 31987,		//下推答题题目
	EcmdPublicParaseleneMazePassMaze = 31988,			//通关
	ECmdPublicParaseleneMazeFinalBossGameType = 31989,	//最终关游戏类
	ECmdPublicParaseleneMazeBroadCastNotice = 31990,	//广播飘字
	//------------------------------------幻月迷宫 31981 - 31991----------------------------------------------

	ECmdPublicOfferStrengthOneKey = 31992, 				//一键赠送体力

	ECmdPublicFightInfoUpdate = 31993,		//属性更新总推

	ECmdPublicKillAndDeadCount = 31994,                 //跨服统计的击杀结果用于国家荣誉的计算Message::Game::SKillAndDeadInfo[Message::Game::GameMsg.cdl]

	//-----------------------//城战 32000 - 32020占用-----------------------
	ECmdPublicCrossCityBidStart = 32000,	//竞拍开始 Message::Public::GamePublic.cdl [Message::Public::SCrossMassacreChoose]
	ECmdPublicCrossCityBidMsg = 32001,	//竞拍信息 Message::Public::GamePublic.cdl [Message::Public::SBidInfo ] 
	ECmdPublicCrossCityGetCityList = 32002,	//（服务端）获取城信息
	ECmdPublicCrossCityGetPlayerList = 32003,	//获取参战玩家 Message::Game ::CrossCity.cdl [Message::game::SSupportPlayerMsg]
	ECmdPublicCrossCityBossStatus = 32004,	//boss状态下推 Message::Game::CrossCity.cdl [Message::Game::SseqSBossStatus]
	ECmdPublicCrossCityGetFightStatusList = 32005,	//获取战况列表 Message::Game::CrossCity.cdl[Message::Game::SseqSFightStatus]
	ECmdPublicCrossCityGetSupportList = 32006,	//获取援助玩家列表 Message::Game::CrossCity.cdl [Message::Game::SSupportPlayerMsgSeq]
	ECmdPublicCrossCityPushCityOccupyInfo = 32007,	//(服务端) 城池占领信息下推 Message::Game::CrossCity.cdl [Message::game::SOccupyInfo]
	ECmdPublicCrossCityGetCityStatus = 32008,	// 获取城战状态 Message::Game::CrossCity.cdl [Message::Game::SSeqSCityStatus]
	ECmdPublicCrossCityStatus = 32009,	//下推城状态(场景内) Message::Game::CrossCity.cdl [Message::game::SCityStatus]
	ECmdPublicCrossCityClearData = 32010,	//清除数据（服务端）
	ECmdPublicCrossCityStartCmd = 32011,	//开活动 （服务端）
	ECmdPublicCrossCityHelpStart = 32012,	//援助开始
	ECmdPublicCrossCityHelpEnd = 32013,	//援助结束
	ECmdPublicCrossCityGiveWeekReward = 32014,	//周奖励发放（周一发放）
	ECmdPublicCrossCityCheckCanOpenCityFight = 32015,	//能否开启支援和设置战力 Message::Game::CrossCity.cdl [Message::Game::SCrossCityResult]
	ECmdPublicCrossCityGetInvitInfo = 32016,	//城战邀请（服务端）
	ECmdPublicCrossCitySupportNum = 32017,	//城战支援玩家人数下推 Message::Game::ICrossCity.cdl [Message::game::SSpportNum]
	ECmdPublicCrossCityPlayerForce = 32018,	//城战玩家所属势力 Message::game::IcrossCity.cdl [Message::Game::SSupportPlayerMsg]
	ECmdPublicCrossCityActive = 32019,	//跨服抢城活动开始
	ECmdPublicCrossCityInfo = 32020,	//跨服城战竞拍城信息更新Message::public::GamePublic.cdl[Message::public::SCorssCityCityInfos]
	ECmdPublicCrossCitySupportInfo = 32021,	//跨服城战支援
	ECmdPublicCrossCityBiddingInfo = 32022,	//竞标信息更新.Message::Public::GamePublic.cdl[Message::Public::SCrossCityBidInfos]
	ECmdPublicCrossCitySupportServerList = 32023,	//跨服城战可支援列表Message::Game::CrossCity.cdl[Message::Game::SSingleServerMsg]
	ECmdPublicCrossCityResult = 32024,	//跨服城战结果Message::Game::CrossCity.cdl[Message::Game::SCrossCityResult]
	ECmdPublicCrossCityUpdateCountryHounor = 32025,	//跨服城战更新国家荣誉值Message::GamePublic.cdl[Message::Public::SCrossMassacreCountryMoneyUpdate]
	ECmdPublicCrossCityUpdateCrossServerData = 32026,	//获取单服平均战力跨服inter到单服InterNULL
	ECmdPublicCrossCitySetFightCondition = 32027,	//设置出战条件,发送到单服InterMessage::Game::ICrossCity.cdl[Message::Game::SconditionInfo]
	ECmdPublicCrossCityServerBidInfo = 32028,	//推竞价到跨服InterMessage::Public::GanePublic.cdl[Message::Public::SCrossMassacreCountryMoneyUpdate]
	ECmdPublicCrossCityBidResult = 32029,	//竞拍结果下推Message::Public::GamePublic.cdl[Message::public::SBidResult]
	ECmdPublicCrossCityPushFinalBidResult = 32030,	//竞拍最终结果Message::Game::ICrossCity.cdl[Message::Game::SFinalBidRsult]
	ECmdPublicCrossCityGetCityInfoFromCrossInter = 32031,	//从跨服inter获取数据到跨服cell::Message::Public::GamePublic.cdl[Message::Public::SCorssCityCityInfos]
	ECmdPublicCrossCityInvitInfo = 32032,	//城战邀请Message::Game::CrossCity.cdl[Message::Game::SInvitMsg]
	ECmdPublicCrossCityInvitRsult = 32033,	//城战邀请结果Message::Game::CrossCity.cdl[Message::Game::SInvitRsult]
	ECmdPublicCrossCityErrorCodeInfo = 32034,	//错误码下推Message::Game::CrossCity.cdl[Message::Game::SErrorCodeMsg]
	ECmdPublicCrossCityEnterCopy = 32035,	//进入副本Message::Game::CrossCity.cdl[Message::Game::SEnterCrossCityMsg]
	ECmdPublicCrossCityGetSupportPlayer = 32036,	//跨服cell获取跨服inter支援玩家信息Message::Game::CrossCity.cdl[Message::Game::SSupportPlayerMsg]
	ECmdPublicCrossCityNoticeInterClearData = 32037,	//通知跨服inter清除数据　NULL
	ECmdPublicCrossCityNoticeInterEnterCopy = 32038,	//通知跨服inter，有玩家进入副本Message::Game::CrossCity.cdl[Message::Game::SSupportPlayerMsg]
	ECmdPublicCrossCitySendReward = 32039,	//发奖励邮件
	ECmdPublicApplyPayTaxes = 32040,	  // 申请纳税   Message::Game::SCrossCellIncome [Message/Game/ICrossMainCell.cdl]
	ECmdPublicIncomeStatistic = 32041,	  // 下推或请求收入统计数据 Message::Game::SCrossCellIncomeStatistic [Message/Game/ICrossMainCell.cdl]
	ECmdPublicOpenTaxesRewardActive = 32042,	  // 开启税收奖励活动  Message::Game::STaxReward [Message/Game/ICrossMainCell.cdl]
	ECmdPublicRefreshLeftTax = 32043,	  // 刷新剩余奖励  Message::Game::STaxReward [Message/Game/ICrossMainCell.cdl]
	ECmdPublicTaxesRewardActiveEnd = 32044,	  // 税收奖励活动结束
	ECmdPublicTaxesRewardActiveInfo = 32045,	  // 请求或下推税收奖励活动信息(剩余奖励和拾取的奖励)
	ECmdPublicSendActiveForwardToHost = 32046,
	ECmdPublicUpdateTaxRewardRank = 32047,	   // 更新玩家在活动中的收入排行榜  Message::Game::SMoneyRankTable [Message/Game/ICrossMainCell.cdl]
	ECmdPublicTaxesActivityLoginInfo = 32048,
	ECmdPublicCrossCellarBossHurtInfo = 32049, //跨服地洞boss伤害输出显示

	ECmdPublicPublicNoticeReward = 32050,	//公告奖励
	ECmdPublicToplistReward = 32051,		//排行榜奖励
	ECmdPublicEverAttrUseInfo = 32052,		//永久i属性丹使用信息

	//------------------------------------神秘商店 32053 - 32063----------------------------------------------
	ECmdPublicMysteryShopInfo = 32053,	// 神秘商店物品下推 Message::Public::SShopTreasureMsg[Message/Public/GamePublic.cdl]
	ECmdPublicMysteryShopSingleItemUpdateInfo = 32054, // 神秘商店单个物品更新下推 Message::Public::SShopTreasureMsg[Message/Public/GamePublic.cdl]
	//------------------------------------神秘商店 32053 - 32063----------------------------------------------

	//---------------------跨服练功房 32064- 32073------------------------------------------------------------
	ECmdPublicTrainRoomInfoUpdate = 32064,
	ECmdPublicLeaveCrossTrainRoom = 32065,			//离开跨服练功房
	ECmdPublicSuccessButCannotTake = 32066,			//虽然挑战成功但不是第一位完成的
	ECmdPublicTakePositionByChallenge = 32067,		//占领战败者的跨服位置
	EcmdPublicTrainRoomBattelResult = 32068,		//玩家挑战的战斗结果
	//---------------------跨服练功房 32064- 32073------------------------------------------------------------
	ECmdPublicCanNotEnterCopy = 32074,		//不能再进入副本

	ECmdPublicGmReponse = 32075,		//GM回复通知
	ECmdPublicWordGameInfo = 32076,		//诗山文海信息 Message::Game::SWordGameInfo[MsgEx.cdl]

	ECmdPublicAutoPetExploreEnd = 32077,    //自动闯关结束 NULL

	ECmdPublicPerformance = 32079,    //剧情表现 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	//副本队伍消息  
	//-- 原有消息：队伍信息：ECmdPublicGroupInfo   离开队伍：ECmdPublicGroupLeft		成员属性更新：ECmdPublicGroupEntityInfo
	ECmdPublicCopyGroupInviteNew = 32100,		//邀请组队	::Message::Public::SCopyGroupInvite [Message/Public/Group.cdl]
	ECmdPublicCopyGroupReject = 32101,		//拒绝邀请	::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdPublicCopyGroupAutoJoinBegin = 32102,		//开始匹配	::Message::Public::SCopyGroupCopy [Message/Public/Group.cdl]
	ECmdPublicCopyGroupAutoJoinEnd = 32103,		//结束匹配	NULL
	//服务端用
	ECmdPublicCopyGroupCreate = 32110,		//创建队伍	::Message::Public::SCopyGroupCopy [Message/Public/Group.cdl]
	ECmdPublicCopyGroupErrorMsg = 32111,		//错误消息  ::Message::Public::SCopyGroupErrorMsg [Message/Public/Group.cdl]
	ECmdPublicCopyGroupReply = 32112,		//回复邀请	::Message::Public::SCopyGroupReply [Message/Public/Group.cdl]
	ECmdPublicCopyGroupDisbandGroup = 32113,		//解散队伍	NULL
	ECmdPublicCopyGroupAutoJoin = 32114,		//随机组队	::Message::Public::SCopyGroupCopy [Message/Public/Group.cdl]
	ECmdPublicCopyGroupLeft = 32115,		//离开队伍	::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicCopyGroupKickOut = 32116,		//踢出玩家	::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdPublicCopyGroupCreateCopy = 32117,		//创建副本	::Message::Public::SCopyGroupCopy [Message/Public/Group.cdl]

	//--------------------个人竞技场 ---------------------------------------
	ECmdPublicImagePkRoles = 32150,				//角色列表 Message::Public::SImagePkRoles [Message/Public/GamePublic.cdl]
	ECmdPublicImagePkFight = 32151,				//进入战斗 Message::Public::SImagePkFight [Message/Public/GamePublic.cdl]
	ECmdPublicImagePkFightResult = 32152,		//战斗结果 Message::Public::SImagePkFightResult [Message/Public/GamePublic.cdl]
	ECmdPublicImagePkFightNum = 32153,			//挑战次数 Message::Public::SImagePkFightNum [Message/Public/GamePublic.cdl]
	ECmdPublicImagePkRankReward = 32154,		//排名奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicDefenseCopyScoreInfo = 32170,	//守护副本积分信息 Message::Public::SDefenseCopyScoreInfo [Message/Public/GamePublic.cdl]
	ECmdPublicDefenseCopyDefenderInfo = 32171,	//守护副本守卫信息 Message::Public::SDefenseCopyDefenderInfo [Message/Public/GamePublic.cdl]

	//------------------ 三界争霸 --------------------------
	ECmdPublicForceWarWillOpen = 32180,			//活动即将开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarOpen = 32181,				//活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarClose = 32182,			//活动结束 NULL
	ECmdPublicForceWarCopyInfo = 32183,			//副本信息 Message::Public::SForceWarCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarSkills = 32184,			//技能列表 Message::Public::SForceWarSkills [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarUseSkill = 32185,			//使用技能 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicForceWarRankList = 32186,			//排行榜 Message::Public::SForceWarRankList [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarReward = 32187,			//奖励 Message::Public::SForceWarReward [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarRewards = 32188,			//奖励列表 Message::Public::SForceWarRewards [Message/Public/GamePublic.cdl]
	ECmdPublicForceWarTaskReward = 32189,		//任务奖励 Message::Public::SSeqReward [Message/Public/GamePublic.cdl]

	//-----------------守卫青云--------------
	ECmdPublicDefenseQingyunOpen = 32200,   //活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicDefenseQingyunClose = 32201,	//活动结束 NULL
	ECmdPublicDefenseQingyunReady = 32202,	//即将开始倒计时 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] <数组第一个值传入倒计时秒数>
	ECmdPublicDefenseQingyunWillClose = 32203,	//即将关闭倒计时 Message::Public::SIntBoolDate [Message/Public/CdlPublic.cdl] <int：关闭秒数，bool：是否成功>
	ECmdPublicDefenseQingyunRefreshReward = 32204, //刷怪奖励【服务端用】 Message::Public::SSeqReward [Message/Public/GamePublic.cdl]

	//---------------- 答题副本 -----------------
	ECmdPublicQuestionCopyOpen = 32230,			//活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicQuestionCopyClose = 32231,		//活动关闭 NULL
	ECmdPublicQuestionCopyInfo = 32232,			//副本信息 Message::Public::SQuestionCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicQuestionCopyAsk = 32233,			//题目信息 Message::Public::SQuestionCopyAsk [Message/Public/GamePublic.cdl]
	ECmdPublicQuestionCopyAnswer = 32234,		//题目答案 Message::Public::SSeqLong [Message/Public/CdlPublic.cdl]
	ECmdPublicQuestionCopySkills = 32235,		//副本技能 Message::Public::SQuestionCopySkills [Message/Public/GamePublic.cdl]
	ECmdPublicQuestionCopyUseSkill = 32236,		//使用技能 Message::Cell::SPlayerFight [Message/Cell/ControlMsg.cdl]
	ECmdPublicQuestionCopyRewards = 32237,		//排名奖励 Message::Public::SQuestionCopyRewards [Message/Public/GamePublic.cdl]

	//---------------夺宝活动-----------------
	ECmdPublicTreasureOpen = 32240,						//活动开启 Message::Public::STreasureOpen [Message/Public/GamePublic.cdl]
	ECmdPublicTreasureClose = 32241,					//活动结束 NULL
	ECmdPublicTreasureNotice = 32242,					//刷新倒计时 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] <数组第一个值传入倒计时秒数>

	//奖励信息
	ECmdPublicSeqReward = 32245,							//奖励信息 Message::Public::[Message/Public/GamePublic.cdl]

	//---------------- 跨服竞技 -----------------
	ECmdPublicPersonalPkOpen = 32250,			//活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkClose = 32251,			//活动关闭 NULL
	ECmdPublicPersonalPkMyInfo = 32252,			//我的信息 Message::Public::SPersonalPkMyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkRankList = 32253,		//排行榜 Message::Public::SPersonalPkRankList [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkState = 32254,			//当前状态 Message::Public::SPersonalPkState [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkResult = 32255,			//比赛结果 Message::Public::SPersonalPkResult [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkSignUp = 32256,			//报名 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicPersonalPkMyInfoSync = 32257,		//我的信息同步 Message::Public::SPersonalPkMyInfoSync [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkPassEnter = 32258,		//传送进入战场 NULL
	ECmdPublicPersonalPkOffline = 32259,		//玩家离线 NULL
	ECmdPublicPersonalPkResultToInter = 32260,	//比赛结果发到inter Message::Public::SPersonalPkResult [Message/Public/GamePublic.cdl]
	ECmdPublicPersonalPkSeasonRewards = 32261,	//月结算奖励 Message::Public::SPersonalPkSeasonRewards [Message/Public/GamePublic.cdl]

	ECmdPublicUseMediaCardCross = 32270, //使用媒体卡（跨服）  ::Message::Public::SUseMediaCard [Message/Public/GamePublic.cdl]
	ECmdPublicUseMediaCard = 32271,			//使用媒体卡  ::Message::Public::SUseMediaCard [Message/Public/GamePublic.cdl]
	ECmdPublicUseMediaCardResult = 32272,		//使用媒体卡结果  ::Message::Public::SUseMediaCard [Message/Public/GamePublic.cdl]
	ECmdPublicMediaCardShowReward = 32273,	//媒体卡奖励展示 NULL

	//---------------- 仙盟争霸 ----------------
	ECmdPublicMgGuildWarOpen = 32280,			//活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildWarClose = 32281,		//活动关闭 NULL
	ECmdPublicMgGuildWarInfo = 32282,			//副本信息 Message::Public::SMgGuildWarInfo [Message/Public/GuildWar.cdl]
	ECmdPublicMgGuildWarRankInfo = 32283,	//排行信息 Message::Public::SMgGuildWarRank [Message/Public/GuildWar.cdl]
	ECmdPublicMgGuildWarResult = 32284,		//结算信息 Message::Public::SMgGuildWarResult [Message/Public/GuildWar.cdl]
	ECmdPublicMgGuildWarUpdateWinGuild = 32285,	//更新获胜仙盟 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicSublineList = 32295,	//获取分线列表 Message::Game::SSublineInfo [Message/Public/GameMsg.cdl]
	ECmdPublicChangeSubline = 32296, //切换分线 NULL

	ECmdPublicOfflineWorkSec = 32300,		//离线挂机剩余时间（秒） Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicOfflineWorkAddSec = 32301,	//离线挂机增加剩余时间（秒） Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicOfflineWorkReward = 32302,	//离线挂机奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicOfflineWorkShowReward = 32303,//离线挂机显示奖励 Message::Public::SOfflineWorkShowReward [Message/Public/GamePublic.cdl]
	ECmdPublicOfflineWorkCreate = 32304,	//离线挂机创建玩家 Message::Public::SOfflineWorkCreate [Message/Public/FightRole.cdl]
	ECmdPublicOfflineWorkFinal = 32305,		//离线挂机删除玩家 NULL
	ECmdPublicOfflineWorkDeath = 32306,		//离线挂机死亡 NULL

	ECmdPublicPickUpDropItem = 32310,		//拾取掉落 Message::Public::SPacket [Message/Public/GamePublic.cdl]

	ECmdPublicCopyPassToNextFloor = 32315,  //传送至下一层倒计时（秒） Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicTowerGroupCopyInfo = 32316,   //组队爬塔副本信息 Message::Public::STowerGroupCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicTowerSingleCopyInfo = 32317,  //单人爬塔副本信息 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicCopyKillBossNumDetail = 32318,//副本杀怪详细信息 Message::Public::SDictIntInt [Message/public.cdlPublic]

	ECmdPublicToplistActivePlayerAccCondUpdate = 32319, //排行活动玩家累计值条件更新 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicToplistActivePlayerCondUpdate = 32320, //排行活动玩家条件更新 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicToplistActivePlayerInfoList = 32321, //排行活动玩家信息列表 Message::Public::SToplistActivePlayerInfoList [Message/Public/GamePublic.cdl]
	ECmdPublicToplistActivePlayerInfo = 32322, //排行活动玩家信息 Message::Public::SToplistActivePlayerInfo [Message/Public/GamePublic.cdl]
	ECmdPublicToplistActiveReward = 32323, //排行活动奖励 Message::Public::SRewardInfo [Message/Public/GamePublic.cdl]

	// 特殊活动奖励数量
	ECmdPublicSpecialActiveRewardNumInfo = 32340,   // 特殊活动奖励领取情况       Message::Public::SCodeDictList [Message/Public/GamePublic.cdl]
	ECmdPublicSpecialActiveRewardNumUpdate = 32341, // 特殊活动奖励领取情况更新   Message::Public::SCodeDictList [Message/Public/GamePublic.cdl]

	// 等级奖励
	ECmdPublicLevelRewardNumInfo = 32345,       // 等级奖励领取情况       Message::Public::SDictIntInt [Message/Public/CdlPublic]
	ECmdPublicLevelRewardNumUpdate = 32346,     // 等级奖励领取情况更新   Message::Public::SDictIntInt [Message/Public/CdlPublic]

	ECmdPublicRuneCopyInfo = 32350,             // 符文塔副本信息 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdPublicManHuangCopyInfo = 32355,         // 蛮荒副本信息 Message::Public::SIntBoolDate [Message/Public/CdlPublic.cdl]
	ECmdPublicManHuangAddKillBossRage = 32356,  // 蛮荒副本击杀怪物增加怒气值 Message::Public::SInt [Message/Public/CdlPublic.cdl]

	//仙盟宴会
	ECmdPublicMgGuildPartyOpen = 32360,				//活动开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyClose = 32361,			//活动关闭 NULL
	ECmdPublicMgGuildPartyInfo = 32362,				//副本信息 Message::Public::SSeqLong [Message/Public/CdlPublic.cdl] 【数组 1：个人经验；2：个人贡献；3：是否已采集】
	ECmdPublicMgGuildPartyRank = 32363,				//排行信息 Message::Public::SGuildPartyRankInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyQuestion = 32364,   //答题题目 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] 数组第一个值对应题目id
	ECmdPublicMgGuildPartyAnswerInfo = 32365, //回答信息 ::Message::Public::SGuildPartyAnswerInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyReards = 32366,			//奖励发放 [服务端用] Message::Public::SGuildPartyRewardMsg [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyNotice = 32367,			//仙盟通知 [服务端用] Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyGuildChat = 32368,	//仙盟聊天(答题) [服务端用] ::Message::Public::SString [Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildPartyAddMoney = 32369, //仙盟资金奖励 [服务端用] Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] 数组第一个值对应题目id
	ECmdPublicMgGuildPartySimpleNotice = 32370,			//特定仙盟通知 [服务端用] Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyRankReward = 32371,			//仙盟排行奖励 [服务端用] Message::Public::SDictIntInt [Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildPartyGuildInfo = 32372,	//活动开启仙盟信息 [服务端用] Message::Public::SGuildPartyGuildInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPartyQuestionClose = 32373,			//答题结束 NULL

	ECmdPublicBossTalk = 32375,								//Boss说话 Message::Public::SBossTalk [Message/Public/GamePublic.cdl]

	// 五行神殿
	ECmdPublicFiveElementsCopyProperty = 32377,   //当前五行 Message::Public::SInt [Message/Public/CdlPublic.cdl] 

	//仙盟兽神
	ECmdPublicGuildBeastGodOpen = 32380,          //开始挑战兽神 Message::Public::SGuildBeastGodOpen [Message/Public/GamePublic.cdl]
	ECmdPublicGuildBeastGodFail = 32381,          //挑战失败 [服务端用] Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] [仙盟Id]
	ECmdPublicGuildBeastGodCloseCopy = 32382,     //即将关闭副本场景 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] [倒计时秒数]
	ECmdPublicGuildBeastGodClose = 32383,         //挑战结束 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] [仙盟Id]
	ECmdPublicGuildBeastGodLife = 32384,          //boss血量 Message::Public::SGuildBeastGodLife [Message/Public/GamePublic.cdl]
	ECmdPublicGuildBeastGodKillBoss = 32385,      //击杀boss成功 [服务端用] Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] [仙盟Id]
	ECmdPublicGuildBeastGodRefreshBossSec = 32386,//boss刷新倒计时 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl] [倒计时秒数]
	ECmdPublicGuildBeastGodBossRefreshDt = 32387, //boss刷新状态 Message::Public::SGuildBeastGodBossState [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildBeastGodOpenInfo = 32388,			//活动开启信息 Message::Public::SGuildBeastGodOpen [Message/Public/GamePublic.cdl]

	ECmdPublicBossRefreshDynamicInfo = 32390,     //动态刷怪信息 Message::Public::SBossRefreshDynamicInfo [Message/Public/GamePublic.cdl]
	ECmdPublicBossRefreshDynamicInfoEx = 32391,   //动态刷怪信息(神兽岛) Message::Public::SBossRefreshDynamicInfo [Message/Public/GamePublic.cdl]

	//仙盟红包
	ECmdPublicGuildRedPacketInfos = 32400,			//红包列表	Message::Public::SGuildRedPacketInfos [Message/Game/IGuild.cdl]
	ECmdPublicGuildRedPacketUpdate = 32401,			//红包更新	Message::Public::SGuildRedPacketInfo  [Message/Game/IGuild.cdl]
	ECmdPublicGuildRedPacketRemove = 32402,			//红包移除	Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildRedPacketPlayerNum = 32403,		//红包剩余次数	Message::Public::SInt [Message/Public/CdlPublic.cdl] 
	ECmdPublicAddGuildRedPacketSystem = 32405,		//添加系统红包[服务端用]	Message::Public::SGuildRedPacketInfos [Message/Game/IGuild.cdl]

	ECmdPublicGuildRedPacketGetRecordOne = 32406,	//获取记录	Message::Game::SGuildRedPacketGetRecord [Message/Game/IGuild.cdl]
	ECmdPublicGuildRedPacketGetRecords = 32407,		//获取记录列表	Message::Game::SGuildRedPacketGetRecordList [Message/Game/IGuild.cdl]


	//仙盟争霸赛
	ECmdPublicGuildPromotionMatchList = 32410,		//比赛名单 Message::Public::SGuildPromotionMatchList [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionDomination = 32411,		//王者圣殿 Message::Public::SGuildPromotionDomination [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionOpen = 32412,			//活动开启 Message::Public::SGuildPromotionOpen [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionClose = 32413,			//NULL			
	ECmdPublicGuildPromotionCopyInfo = 32414,		//副本信息 Message::Public::SGuildPromotionCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionMapInfo = 32415,		//小地图信息 Message::Public::SGuildPromotionMapInfo [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionResult = 32416,			//比赛结算 Message::Public::SGuildPromotionResult [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionRewards = 32417,		//比赛奖励 Message::Public::SGuildPromotionRewards [Message/Public/GamePublic.cdl]
	ECmdPublicGuildPromotionLeaderReward = 32418,	//冠军盟主奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildPromotionShowTips = 32419,		//显示玩法提示 NULL
	ECmdPublicGuildPromotionActiveRewardInfo = 32420,//活动奖励信息 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicGuildPromotionMakeActiveRewards = 32421,//生成活动奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	// 云购
	ECmdPublicCloudBuyOpen = 32430,					//活动开启 Message::Public::SCloudBuyOpen [Message/Public/ActiveDef.cdl]
	ECmdPublicCloudBuyClose = 32431,				//活动关闭 NULL
	ECmdPublicCloudBuyInfo = 32432,					//活动信息 Message::Public::SCloudBuyInfo [Message/Public/ActiveDef.cdl]
	ECmdPublicCloudBuySellRemainNum = 32433,		//总剩余份数 Message::Public::SInt [Message/Public/CdlPublic.cdl]
	ECmdPublicCloudBuyPersonBuyNum = 32434,			//个人购买份数 Message::Public::SInt [Message/Public/CdlPublic.cdl]
	ECmdPublicCloudBuyJoinRecordOne = 32435,		//参与记录 
	ECmdPublicCloudBuyJoinRecords = 32436,			//参与列表
	ECmdPublicCloudBuyRewardOwner = 32437,          //大奖得主
	ECmdPublicCloudBuyGrade = 32438, //档次

	//塔防副本
	ECmdPublicTowerDefenseOper = 32440,					//防守塔操作[服务端用] Message::Public::STowerDefenseOper [Message/Public/GamePublic.cdl]
	ECmdPublicTowerDefenseCopyInfo = 32441,			//塔防副本信息 Message::Public::STowerDefenseCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicTowerDefenseItemInfo = 32442,			//物品掉落信息 Message::Public::STowerDefenseItemInfo [Message/Public/GamePublic.cdl]
	ECmdPublicTowerDefenseBegin = 32443,				//手动开始刷怪[服务端用] NULL
	ECmdPublicTowerDefenseSpecialBoss = 32444,	//刷黄金BOSS[服务端用]
	ECmdPublicTowerDefenseSpecialBossFail = 32445, //刷新黄金BOSS失败[服务端用]
	ECmdPublicTowerDefenseUpgrade = 32446,			//塔升级 Message::Public::STowerDefenseUpgradeInfo [Message/Public/GamePublic.cdl]

	ECmdPublicActiveRankConsumeInfo = 32447,	//消费排行活动信息 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicActiveRankInfo = 32448, //排行活动信息 Message::Game::SSActiveRankInfo [Message/Public/CdlPublic.cdl]

	ECmdPublicModifyRoleNameFail = 32449,			//改角色名字失败 Message::Public::SString [Message/Public/CdlPublic.cdl]
	ECmdPublicUpdateGuildName = 32450,				//修改仙盟名字 Message::Public::SSeqString [Message/Public/CdlPublic.cdl]

	ECmdPublicKillByPlayerInNormal = 32455,			//玩家普通地图被杀	Message::Public::SInt [Message/Public/CdlPublic.cdl]

	ECmdPublicTreasureCollectFirst = 32456,			//青云夺宝采集第一个箱子 NULL

	ECmdPublicTowerDefenseTestFinishCopy = 32457, //塔防副本结算[测试] NULL

	//神兽岛
	ECmdPublicBeastIslandCopyInfo = 32460,			//副本信息 Message::Public::SBeastIslandCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicBeastIslandCopyConnect = 32461,   //副本连接开启
	ECmdPublicBeastIslandCopyClose = 32462,   	//副本连接关闭

	ECmdPublicUpdateMergeDt = 32463, //更新开服时间 Message::Public::SIntDate [Message/Public/CdlPublic.cdl]

	//守卫仙盟
	ECmdPublicMgGuildDefenseOpen = 32465,           //守卫仙盟开启 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseClose = 32466,          //守卫仙盟关闭 NULL
	ECmdPublicMgGuildDefenseCopyInfo = 32467,       //守卫仙盟副本信息 Message::Public::SMgGuildDefenseCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseRefreshBossDt = 32468,  //守卫仙盟刷新倒计时 Message::Public::SDate [Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildDefenseNextRefreshWave = 32469,//守卫仙盟下一波怪刷新倒计时 Message::Public::SInt [Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildDefenseRankInfo = 32470,       //守卫仙盟伤害排行信息 Message::Public::SMgGuildDefenseRankInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseReward = 32471,         //守卫仙盟结算信息 Message::Public::SMgGuildDefenseRewardInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseDefender = 32472,       //守卫仙盟守方怪 Message::Public::SMgGuildDefenseDefender [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseIconOpen = 32473,       //守卫仙盟图标开启 Message::Public::SWorldBossOpen [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefensePointsRankInfo = 32474,       //守卫仙盟积分排行信息 Message::Public::SMgGuildDefenseRankInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseCopyStage = 32840,           //守卫仙盟副本阶段信息 Message::Public::SMgGuildDefenseCopyStage [Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDefenseRewardBoxInfo = 32842,           //守卫仙盟赏灯阶段宝箱信息 Message::Public::SMgGuildDefenseRewardBoxInfo [Message/Public/GamePublic.cdl]
	// 好友
	ECmdPublicFriendInfoUpdate = 32475,			// 好友信息更新 Message::Public::SSeqAttributeUpdate
	ECmdPublicHandselFlower = 32476,			// 送花
	ECmdPublicReceiveFlower = 32477,			// 收花
	ECmdPublicFriendIntimateBuffAdd = 32478,	// 添加亲密度BUFF
	ECmdPublicFriendIntimateBuffRemove = 32479, // 移除亲密度BUFF
	ECmdPublicFriendIntimateGroup = 32480,		// 组队亲密度结算

	//仙盟广播消息
	ECmdPublicGuildPublicNotice = 32485,     //仙盟内广播消息 Message::Public::SGuildPublicNotice [Message/Public/GamePublic.cdl]

	//幸运转盘
	ECmdPublicLuckRotaryOpen = 32490,			//幸运转盘开启 Message::Public::SSeqLuckRotaryOpenIfno
	ECmdPublicLuckRotaryClose = 32491,			//幸运转盘关闭

	ECmdPublicBossActiveRefresh = 32495,	// 活动刷怪	Message::Public::SDictIntInt[Message/Public/GamePublic.cdl]
	ECmdPublicBossActiveRemainCount = 32496,	// 活动刷怪剩余数	Message::Public::SDictIntInt[Message/Public/GamePublic.cdl]
	ECmdPublicBossActiveClose = 32497,	// 活动结束
	ECmdPublicBossActiveRefreshUpdate = 32498, //活动刷怪数量更新	Message::Public::SDictIntInt[Message/Public/GamePublic.cdl]

	//怪物掉落
	ECmdPublicBossMakeDropInter = 32500,	// 怪物掉落inter处理 Message::Public::SBossMakeDropInter[Message/Public/GamePublic.cdl]
	ECmdPublicBossMakeDropCell = 32501,	// 怪物掉落cell处理 Message::Public::SBossMakeDropCell[Message/Public/GamePublic.cdl]
	ECmdPublicDropStarControl = 32502,	// 掉落星数控制 Message::Public::SDictIntInt[Message/Public/CdlPublic.cdl]

	ECmdPublicMarryActiveInfo = 32510,	// 结婚活动信息 Message::Public::SSeqString[Message/Public/CdlPublic.cdl]

	//天神战场
	ECmdPublicMgBattleOpen = 32520,		  // 天神战场开启 Message::Public::SMgBattleOpen[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleClose = 32521,		  // 天神战场结束 NULL
	ECmdPublicMgBattleInfo = 32522,		  // 天神战场信息 Message::Public::SMgBattleInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleRank = 32523,		  // 天神战场排名 Message::Public::SMgBattleRank[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleMyInfo = 32524,		  // 天神战场个人信息 Message::Public::SMgBattleMyInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleEndRank = 32525,		  // 天神战场结束排行 Message::Public::SMgBattleEndRank[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleMapInfo = 32526,		  // 天神战场小地图信息 Message::Public::SMgBattleMapInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleContinuedKill = 32527,		  // 天神战场连斩增加
	ECmdPublicMgBattleResult = 32528,		  // 天神战场结果 Message::Public::SMgBattleResult[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleActivePrepare = 32529,		  // 天神战场活动准备 Message::Public::SMgBattleActivePrepare[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleWorldLevelCollect = 32530,		  // 天神战场世界等级采集 
	ECmdPublicMgBattleWorldLevel = 32531,		  // 天神战场世界等级 Message::Public::SMgBattleWorldLevel[Message/Public/GamePublic.cdl]
	ECmdPublicMgBattleCrystalLife = 32532,		  // 天神战场水晶血量 Message::Public::SMgBattleCrystaLife[Message/Public/GamePublic.cdl]


	//情缘副本
	ECmdPublicCopyLoveProof = 32540,	// 默契考验 图片列表 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyLoveProofSelect = 32541,	// 默契考验 选择图片 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicCopyLoveAddCopyNumCheck = 32542,	// 增加副本次数检测 NULL
	ECmdPublicCopyLoveAddCopyNumPartner = 32543,	// 给伴侣增加副本次数 NULL
	ECmdPublicCopyLoveRequestAddCopyNum = 32544,	// 被邀请增加副本次数 NULL

	ECmdPublicDropBuff = 32550, //掉落加成BUFF

	ECmdPublicShenJiCopyInfo = 32555,         // 上古神迹副本信息 Message::Public::SShenJiCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicShenJiAddKillBossRage = 32556,  // 上古神迹副本击杀怪物增加怒气值 Message::Public::SInt [Message/Public/CdlPublic.cdl]

	//跨服盟战（32570--32590预留）
	ECmdPublicMgGuildDataGet = 32570,		  // 跨服盟战获取仙盟数据 NULL
	ECmdPublicMgGuildDataInit = 32571,		  // 跨服盟战仙盟数据 Message::Public::SMgGuildData[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildDataUpdate = 32572,		  // 跨服盟战仙盟数据更新 Message::Public::SMgGuildData[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleChoose = 32573,		  // 跨服盟战预约 Message::Public::SMgGuildBattleStart[Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildBattleMatch = 32574,		  // 跨服盟战匹配 Message::Public::SMgGuildBattleStart[Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildBattleStart = 32575,		  // 跨服盟战开始 Message::Public::SMgGuildBattleStart[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleEnd = 32576,		  // 跨服盟战结束 NULL
	ECmdPublicMgGuildBattlePass = 32577,		  // 跨服盟战传送 Message::Public::SSeqInt[Message/Public/CdlPublic.cdl]
	ECmdPublicMgGuildReward = 32578,		  // 跨服盟战仙盟奖励 Message::Public::SMgGuildBattleResult[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildPlayerReward = 32579,		  // 跨服盟战个人奖励 Message::Public::SMgGuildBattleResult[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildMonthReward = 32580,		  // 跨服盟战月结奖励 Message::Public::SMgGuildBattleResult[Message/Public/GamePublic.cdl]

	//以下客户端用
	ECmdPublicMgGuildInfo = 32581,		  // 跨服盟战仙盟信息 Message::Public::SMgGuildInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildMatchInfo = 32582,		  // 跨服盟战仙盟匹配信息 Message::Public::SMgGuildMatchInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleCopyInfo = 32583,		  // 跨服盟战仙盟副本信息 Message::Public::SMgGuildBattleCopyInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleMyInfo = 32584,		  // 跨服盟战仙盟玩家信息 Message::Public::SMgGuildBattleMyInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleEndRank = 32585,		  // 跨服盟战副本结束排名 Message::Public::SMgGuildBattleEndRank[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildBattleContinuedKill = 32586,		  // 跨服盟战副本连斩数 Message::Public::SInt[Message/Public/CdlPublic.cdl]	
	ECmdPublicMgGuildChooseInfo = 32587,		  // 跨服盟战仙盟预约信息 Message::Public::SMgGuildInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgGuildRankInfo = 32588,		  // 跨服盟战仙盟排行信息 Message::Public::SMgGuildInfo[Message/Public/GamePublic.cdl]  

	//鹊桥
	ECmdPublicMagpieCount = 32591, // 进度 Message::Public::SInt[Message/Public/CdlPublic.cdl]
	ECmdPublicMagpieMoreExpOpen = 32592, //鹊桥双倍经验开启 Message::Public::SDate [Message/Public/CdlPublic.cdl]
	ECmdPublicMagpieMoreExpClose = 32593,//鹊桥双倍经验结束 
	ECmdPublicMagpieCopyRewardOpen = 32594,//鹊桥双倍副本开启 Message::Public::SDate [Message/Public/CdlPublic.cdl]
	ECmdPublicMagpieCopyRewardClose = 32595,//鹊桥双倍副本结束
	ECmdPublicMagpieRefreshBoss = 32596, //刷新所有死亡BOSS
	ECmdPublicMagpieGetReward = 32597, //已领取档次列表 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdPublicCharmRankCrossBroadcast = 32598, //::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
	ECmdPublicCharmRankIcon = 32599, // Message::Public::SDate [Message/Public/CdlPublic.cdl]

	ECmdPublicUseFireworkProp = 32600,			//玩家使用烟花道具
	ECmdPublicUseFireworkPropOpen = 32601,		//玩家使用烟花道具开启
	ECmdPublicUseFireworkPropClose = 32602,		//玩家使用烟花道具关闭

	ECmdPublicCharmRankNum = 32603, // Message::Public::SInt [Message/Public/CdlPublic.cdl]

	ECmdPublicBossOwner		= 32604,	//boss归属者 ::Message::Public::SBossOwner [Message/Public/GamePublic.cdl]
	ECmdPublicOwnerReward	= 32605,	//boss归属奖励 ::Message::Public::SGameBossReward [Message/Public/GamePublic.cdl]
	ECmdPublicJoinReward	= 32606,	//boss参与奖励 ::Message::Public::SGameBossJoinReward [Message/Public/GamePublic.cdl]

	//个人boss
	ECmdPublicPersonalBossCopyInfo = 32611,	// 副本信息 Message::Public::SInt [Message/Public/CdlPublic.cdl]

	ECmdPublicMgNewExperienceCopyInfo = 32613,   //副本信息 Message::Public::SNewExperienceCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicMgNewExperienceGetExp		= 32614, //领取经验 Message::Public::SNewExperienceCopyInfo [Message/Public/GamePublic.cdl]
	ECmdPublicKingStifeMatchRet			= 32615, //王者争霸匹配结果   Message::Public::SPlayerKingStife [Message/Public/GamePublic.cdl]
	ECmdPublicPlayerKingStifeInfo		= 32616, //王者争霸玩家信息 Message::Public::SPlayerKingStifeInfo [Message/Public/GamePublic.cdl]
	ECmdPublicKingStifeRet 				= 32617, //王者争霸战斗结果 Message::Public::SPlayerKingStifeRet [Message/Public/GamePublic.cdl]
	ECmdPublicKingStifeRankReward			= 32618, //王者争霸排行奖励 Message::Public::SPlayerKingStifeReward [Message/Public/GamePublic.cdl]
	ECmdPublicKingStifeStageReward			= 32619, //王者争霸段位奖励  Message::Public::SPlayerKingStifeReward [Message/Public/GamePublic.cdl]
	ECmdPublicKingStifeRank				= 32620, //王者争霸排行信息   Message::Public::SKingStifeRank [Message/Public/GamePublic.cdl]
	//秘境boss
	ECmdPublicSecretGiftInfo			= 32640, //显示秘境BOSS副本宝箱 ::Message::Public::SSecretBossGift [Message/Public/GamePublic.cdl]
	ECmdPublicCloseSecretGift			= 32641, //关闭秘境BOSS副本宝箱
	ECmdPublicSecretGiftRandNum			= 32642, //随机秘境BOSS副本骰子
	ECmdPublicNewBossHomeRefresh 		= 32643, //新秘境boss刷新时间 Message::Public::SInt [Message/Public/CdlPublic.cdl]
    ECmdPublicEncounterRankReward 		= 32645, //遭遇战排行奖励 Message::Public::SEncounterRankReward [Message/Public/GamePublic.cdl]
    ECmdPublicEncounterInfo 			= 32646, //遭遇战信息 Message::Public::SEncounterInfo [Message/Public/GamePublic.cdl]
    ECmdPublicEncounterClose 			= 32647, //遭遇战结算 NULL

	//世界boss
	ECmdPublicWorldBossOpen                = 32655,		// 世界boss开启 Message::Public::SWorldBossOpen[Message/Public/Battlefield.cdl]
	ECmdPublicWorldBossClose               = 32656,		// 世界boss关闭 NULL
	ECmdPublicWorldBossEnter               = 32657,		// 进入世界boss
	ECmdPublicWorldBossLife			   	   = 32658,		// 获取boss血量 C2S - NULL   S2C - ::Message::Public::SWorldBossLife [Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossHurtList             = 32659,		// 世界boss伤害列表	Message::Public::SPeaceFieldHurtList[Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossReward		       = 32661,		// 世界boss结算奖励	Message::Public::SWorldBossReward[Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossInspire		       = 32662,		// 世界boss鼓舞	鼓舞类型（1铜钱，2元宝）Message::Public::SInt[Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossInspireInfo		   = 32663,		// 世界boss鼓舞	Message::Public::SWorldBossInspireInfo[Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossDropInfo		  	   = 32664,		// 掉落信息 Message::Public::SWorldBossDropInfo[Message/Public/GamePublic.cdl]
	ECmdPublicWorldBossDropClose	  	   = 32665,		// 掉落关闭 NULL
	ECmdPublicWorldBossPickDrop			   = 32666,  	// 抢奖励 NULL
	ECmdPublicWorldBossDropItem			   = 32667, 	// 抢到的掉落 Message::Public::SSeqReward[Message/Public/GamePublic.cdl]

    //挖矿
    ECmdPublicMiningCopyInfo			   = 32670,		// 挖矿信息			Message::Public::SMiningCopyInfo[Message/Public/GamePublic.cdl]
    ECmdPublicUpdatePlayerMiningInfo   	   = 32671,		// 更新挖矿信息		Message::Public::SPlayerMiningInfo[Message/Public/GamePublic.cdl]
    ECmdPublicUpdateMiningCopyMaxFloor     = 32672,		// 更新挖矿最大层	Message::Public::SInt [Message/Public/CdlPublic.cdl]
    ECmdPublicMiningRecord				   = 32673,		// 挖矿记录			Message::Public::SMiningCopyInfo[Message/Public/GamePublic.cdl]
    ECmdPublicUpdatePlayerMiningRecord	   = 32674,		// 更新挖矿记录 	Message::Public::SPlayerMiningRecord[Message/Public/GamePublic.cdl]
    ECmdPublicPlayerMinerRefrshInfo	   	   = 32675,		// 挖矿矿工刷新信息 Message::Public::SMinerRefreshInfo[Message/Public/GamePublic.cdl]

	//阵地争夺
	ECmdPublicPositionOpen                = 32680,		// 阵地争夺开启 Message::Public::SWorldBossOpen[Message/Public/GamePublic.cdl]
	ECmdPublicPositionClose               = 32681,		// 阵地争夺关闭 NULL
	ECmdPublicPositionEnter               = 32682,		// 进入阵地争夺 SPositionEnter
	ECmdPublicPositionOccupy	      	  = 32683,		// 阵地争夺占领信息 Message::Public::SPositionOccupyInfo[Message/Public/GamePublic.cdl]
	ECmdPublicPositionInfo				  = 32684,		// 阵地争夺个人信息  阵地id  Message::Public::SInt[Message/Public/GamePublic.cdl]
	ECmdPublicPositionReward		      = 32685,		// 阵地争夺结算奖励	Message::Public::SPositionRewardInfo[Message/Public/GamePublic.cdl]
	ECmdPublicPositionRankList		      = 32686,		// 阵地争夺排行榜	Message::Public::SPositionRewardInfo[Message/Public/GamePublic.cdl]

	//血战五洲
	ECmdPublicBattleBichOpen                = 32690,		// 血战比奇开启 Message::Public::SWorldBossOpen[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichClose               = 32691,		// 血战比奇关闭 NULL
	ECmdPublicBattleBichEnter               = 32692,		// 进入血战比奇
	ECmdPublicBattleBichScoreList           = 32693,		// 血战比奇积分列表	Message::Public::SBattleBichScoreList[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichInfo           		= 32694,		// 血战比奇信息	Message::Public::SBattleBichInfo[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichUpdate         		= 32695,		// 积分更新	Message::Public::SBattleBichUpdate[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichGetReward		    = 32696,		// 领取积分奖励	Message::Public::SInt[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichRankReward		    = 32697,		// 结算奖励	Message::Public::SBattleBichRankReward[Message/Public/GamePublic.cdl]

	//新仙盟战
	ECmdPublicMgNewGuildWarOpen				= 32700,		//新仙盟战开启 Message::Public::SMgNewGuildWarOPen [Message/Public/GamePublic.cdl]
	ECmdPublicMgNewGuildWarClose			= 32701,		//新仙盟战关闭 NULL
	
	ECmdPublicMgNewGuildWarUpdateCollectInfo= 32703,		//新仙盟战 更新采集信息  Sint(护盾剩余次数更新)
	ECmdPublicMgNewGuildWarGuildRank		= 32704,		//新仙盟战帮会排行 		Message::Public::SMgNewGuildRank	 [Message/Public/GamePublic.cdl]
	ECmdPublicMgNewGuildWarPlayerRank		= 32705,		//新仙盟战个人排行 		Message::Public::SMgNewGuildRank	 [Message/Public/GamePublic.cdl]	
	ECmdPublicMgNewGuildWarCollectInfo		= 32706,		//新仙盟战采集信息 		Message::Public::SMgNewGuildCollectInfo	 [Message/Public/GamePublic.cdl]	
	ECmdPublicMgNewGuildWarUpdateGuildScore	= 32707,		//新仙盟战更新帮会积分	Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
	ECmdPublicMgNewGuildWarUpdateOwnScore	= 32708,		//新仙盟战更新自己积分	Message::Public::SMgNewGuildPlayerScore	 [Message/Public/GamePublic.cdl]
	ECmdPublicMgNewGuildWarUpdatePlayerInfo = 32709,		//新仙盟战更新玩家情况	Message::Public::SMgNewGuildPlayerInfo	 [Message/Public/GamePublic.cdl]
	ECmdPublicMgNewGuildWarAllPlayerInfo 	= 32710,		//新仙盟战所有玩家情况	Message::Public::SMgNewGuildAllPlayerInfo[Message/Public/GamePublic.cdl]
	ECmdPublicMgNewGuildWarGetScoreRewardRet= 32711,		//新仙盟战领取目标奖励标志	Message::Public::SInt [Message/Public/GamePublicEx.cdl] 
	ECmdPublicMgNewGuildWarUpdatePlayerPoint= 32712,		//新仙盟战更新玩家战功	Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
	ECmdPublicMgNewGuildWarWinInfo			= 32716,		//新仙盟战胜利帮会 		Message::Public::SMgNewGuildWarResult	 [Message/Public/GamePublicEx.cdl]

	ECmdPublicCopyUpdatePlayerHurt			= 32719,		//更新玩家副本内伤害排行Message::Public::Slong [Message/Public/GamePublic.cdl]
	ECmdPublicCopyHurtRank					= 32720,		//副本内伤害排行		Message::Public::SHurtRank [Message/Public/GamePublic.cdl]

	ECmdPublicMgNewGuildWarLastWinGuild		= 32698,		//新仙盟战 上次胜利帮会 Message::Public::SMgNewGuildWarInfo	 [Message/Public/GamePublicEx.cdl]
	ECmdPublicMgNewGuildWarLastGetDailyReward= 32699,		//新仙盟战 领取每日奖励 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]

    //新跨服boss
    ECmdPublicNewCrossBossOpen				= 32721,		//新跨服boss开启 NULL
    ECmdPublicNewCrossBossClose				= 32722,		//新跨服boss关闭 NULL
    ECmdPublicNewCrossBossGetList			= 32723,		//获取战场列表 C2S - NULL  S2C - Message::Public::SNewCrossBossFieldList[Message/Public/GamePublic.cdl]
    ECmdPublicNewCrossBossEnter				= 32724,		//进入战场 C2S_SEnterGameBoss [Copy.proto]
    ECmdPublicNewCrossBossInitField			= 32725,		//初始化战场 NULL
    ECmdPublicNewCrossBossCrossOpen			= 32726,		//跨服开启 NULL
    ECmdPublicNewCrossBossCancelOwner		= 32727,		//取消归属 NULL
    ECmdPublicNewCrossBossReward			= 32728,		//归属奖励 Message::Public::SNewCrossBossReward[Message/Public/GamePublic.cdl]

	ECmdPublicMgNewGuildWarLastRank			= 32731,		//新仙盟战仙盟上次排名 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
	ECmdPublicMgDefenseCopyInfo				= 32732,		//守卫神剑信息 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
	ECmdPublicMgDeletePlayerMsg				= 32735,		//删除玩家聊天信息 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicRefreshNewWorldBoss			= 32736,		//刷新新野外boss   ::Message::Public::SRefreshNewWorldBoss [Message/Public/GamePublic.cdl]

    ECmdPublicMgPeakArenaLike				= 32738,		//巅峰赛季点赞 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakArenaWorship			= 32739,		//巅峰赛季膜拜
    ECmdPublicMgPeakArenaState				= 32740,		//巅峰赛季状态 Message::Public::SMgPeakArenaState	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaInfo				= 32741,		//巅峰赛季赛况 Message::Public::SMgPeakArenaInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaRecord				= 32742,		//巅峰赛季比赛记录 Message::Public::SMgPeakArenaRecords	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaBetRecord			= 32743,		//巅峰赛季下注记录 Message::Public::SMgPeakArenaBetRecords	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaOwnRecord			= 32744,		//巅峰赛季海选自己记录 Message::Public::SMgPeakArenaOwnRecord	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaPopularityRank		= 32745,		//巅峰赛季海选人气排行 Message::Public::SMgPeakArenaPopularityRank	 [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakArenaResetData			= 32746,		//巅峰赛季重置数据 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakArenaPlayerSign			= 32747,		//巅峰赛季报名信息 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakArenaPlayerWorship		= 32748,		//巅峰赛季膜拜次数 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakArenaEnterTimer			= 32749,		//巅峰赛季进入倒计时 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakTestOpen				= 32750,		//巅峰赛季进入测试开启接口 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakCancel					= 32751,		//巅峰赛季取消
    ECmdPublicMgPeakCancelMailNotice		= 32752,		//巅峰赛季取消邮件通知
    ECmdPublicMgPeakEnterCopy				= 32753,		//巅峰赛季进入 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakBattleResult			= 32754,		//巅峰赛季战斗结果 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicMgPeakChangeState				= 32755,		//巅峰赛季改变状态 Message::Public::SInt	 [Message/Public/GamePublicEx.cdl]
    ECmdPublicMgPeakArenaBet				= 32756,		//巅峰赛季下注
    ECmdPublicMgPeakArenaBetResult			= 32757,		//巅峰赛季下注结果
    ECmdPublicMgPeakArenaRankResult			= 32758,		//巅峰赛季排行奖励

	ECmdPublicGuildTeamOpen                	= 32762,		//仙盟组队开启 Message::Public::SGuildTeamOpen[Message/Public/GamePublic.cdl]
	ECmdPublicGuildTeamClose               	= 32763,		//仙盟组队关闭 NULL
	ECmdPublicGuildTeamGetRank             	= 32764,		//获取排行信息 NULL
	ECmdPublicGuildTeamRankInfo            	= 32765,		//排行信息 Message::Public::SGuildTeamRankInfo[Message/Public/GamePublic.cdl]
	ECmdPublicGuildTeamGetReward           	= 32766,		//领取奖励 NULL
	ECmdPublicRechargeGroupPlayerCount   	= 32771,		//充值人数 Message::Public::SInt[Message/Public/GamePublic.cdl]
	ECmdPublicRechargeGroupGetReward   		= 32772,		//领取奖励  领取id  Message::Public::SInt[Message/Public/GamePublic.cdl]
	ECmdPublicRechargeGroupInfo	   			= 32773,		//充值信息  Message::Game::SRechargeGroupInfo[Message/Game/IActive.cdl]
	
	ECmdPublicBossIntruderInfoUpdate	= 32774,		//BOSS 来袭信息更新 Message::Public::SSeqMgBossIntruderInfo [Message/Public/GamePublic.cdl]

	ECmdPublicGetQuestionInfo				= 	32780,		//	获取科举信息 C2S_SGetQuestionInfo
	ECmdPublicGetQuestionInfoRet			=  	32781,		// 获取科举信息返回 SGetNewQuestionInfoRet
	ECmdPublicAnswerQuestion				= 	32782,		// 科举答题 SAnswerNewQuestion
	ECmdPublicAnswerQuestionRet				= 	32783,		// 科举答题返回 SAnswerNewQuestionRet
	ECmdPublicPushQuestionRewardInfo		= 	32784,		// 科举答题奖励显示结果推送 SPushNewQuestionRewardInfo
	ECmdPublicPushRefreshRankList			= 	32785,		// 排行榜刷新推送 SPushNewQuestionRankList
	ECmdPublicPushQuestionOpen				= 	32786,		// 科举活动推送 SPushQuestionOpen
	ECmdPublicPushQuestionInfo				= 	32787,		// 登陆推送科举信息 SPushQuestionInfo

	//跨服血战比奇
	ECmdPublicBattleBichCrossOpen           = 32790,		// 跨服血战比奇开启 Message::Public::SWorldBossOpen[Message/Public/GamePublic.cdl]
	ECmdPublicBattleBichCrossClose          = 32791,		// 跨服血战比奇关闭 NULL
	ECmdPublicBattleBichCrossEnter          = 32792,		// 进入跨服血战比奇

	//跨服阵地争夺
	ECmdPublicCrossCopyOpen           = 32794,		// 阵地争夺跨服副本开启 Message::Public::SCrossCopyOpen[Message/Public/GamePublic.cdl]
	ECmdPublicCrossCopyClose          = 32795,		// 阵地争夺跨服副本关闭 SCrossCopyClose
	ECmdPublicHideBossInfo				= 32799,			//隐藏boss刷新时间	Message::Public::SInt[Message/Public/GamePublic.cdl] value: 0 :无隐藏boss  非0：隐藏boss可以进入的最后时间戳

	//协助奖励消息推送（穹苍阁）
	ECmdPublicCoReward			= 32803,		//::Message::Public::SGameBossReward [Message/Public/GamePublic.cdl]

	//1vN
    ECmdPublicContestOpen                	= 32810,		// 活动开启(服务端用) Message::Public::SContestOpen[Message/Public/GamePublic.cdl]
    ECmdPublicContestClose                	= 32811,		// S2C- NULL
    ECmdPublicContestState					= 32812,		// 1vN状态 S2C- Message::Public::SContestState	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestSign					= 32813,		// 报名 C2S- NULL 返回ECmdPublicContestQualificationInfo
    ECmdPublicContestQualificationInfo		= 32814,		// 资格赛信息 C2S- NULL   S2C- Message::Public::SContestQualificationInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestInfo					= 32815,		// 守擂赛信息 C2S- NULL   S2C- Message::Public::SContestInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestMatchInfo				= 32816,		// 进入匹配信息 S2C- Message::Public::SContestMatchInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestPairInfo				= 32817,		// 守擂者匹配信息 S2C- Message::Public::SContestPairInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestPairInfoUpdate			= 32818,		// 守擂者匹配信息更新 S2C- Message::Public::SContestPairInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestBet					= 32819,		// 下注 C2S- Message::Public::SContestBet	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestBetInfo				= 32820,		// 下注记录 C2S- NULL   S2C- Message::Public::SContestBetInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicContestEnterCopy				= 32821,		// 进入副本 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
    ECmdPublicContestBattleResult			= 32822,		// 战斗结果 ::Message::Public::SBool [Message/Public/GamePublic.cdl]
    ECmdPublicContestRoundInfo				= 32823,		// 场次信息 C2S- NULL ::Message::Public::SContestRoundInfo [Message/Public/GamePublic.cdl]

    //3v3
    ECmdPublicQualifyingOpen                	= 32850,		// 活动开启 Message::Public::SQualifyingOpen[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingClose                	= 32851,		// S2C- NULL
    ECmdPublicQualifyingNoticeMsg				= 32852,  		// 广播 ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingInfo					= 32853,		// 3v3信息 C2S- NULL   S2C- Message::Public::SQualifyingInfo	 [Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingMatch	    			= 32854,        // 匹配 NULL
    ECmdPublicQualifyingCancelMatch	  			= 32855,        // 取消匹配 NULL
    ECmdPublicQualifyingEnterCopy				= 32856,		// 进入副本 NULL
    ECmdPublicQualifyingCopyInfo				= 32857,		// 副本信息 Message::Public::SQualifyingCopyInfo[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingCopyShowReward			= 32858,		// 结算信息 Message::Public::SQualifyingCopyShowReward[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingCopyUpdate				= 32859,		// 副本更新 Message::Public::SQualifyingCopyUpdate[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingRanks					= 32860,		// 3v3排名 C2S- NULL   S2C- Message::Public::SQualifyingRanks[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingGetDayReward  			= 32861,        // 领取每日段位奖励 NULL
    ECmdPublicQualifyingGetGoalReward  			= 32862,        // 领取达标奖励 C2S 领取达标数量 Message::Public::SInt  [Message/Public/CdlPublic.cdl]
    ECmdPublicQualifyingFriendInfo  			= 32863,        // 好友3v3信息 C2S - SeqEntityId  S2C - SQualifyingFriendInfo[Message/Public/GamePublic.cdl]
    ECmdPublicQualifyingDayOpen                	= 32864,		// NULL 每日活动图标开启
    ECmdPublicQualifyingDayClose                = 32865,		// NULL 每日活动图标关闭
};