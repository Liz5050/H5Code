enum EGateCommand {
	ECmdGatePlayerItemUpdate = 100,     //玩家物品信息  ::Message::Game::SSeqPlayerItemUpdate
	ECmdGateRoleUpdate = 101,     //角色更新      ::Message::Public::SAttributeUpdate
	ECmdGateMoneyUpdate = 102,     //玩家钱包更新  ::Message::Public::SAttributeUpdate
	ECmdGateTaskUpdate = 103,     //任务更新		 ::Message::Game::SSeqPlayerTaskUpdate

	ECmdGateChatMsgMoniter = 12002,	 //聊天消息监控	 ::Message::Game::SChatMsgMoniter
	ECmdGateBag = 12005,   //背包信息      ::Message::Game::SBag
	ECmdGateBagIndex = 12006,	 //背包位置信息	 ::Message::Game::SBagIndex
	ECmdGateChatMsg = 12007,   //聊天消息      ::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]
	ECmdGateSkillUpdate = 12008,   //技能更新
	ECmdGateSkill = 12009,   //技能给客户端  ::Message::Game::SSkillMsg
	ECmdGateBufferUpdate = 12010,   //BUFF更新
	ECmdGateBuffer = 12011,   //BUFF给客户端  ::Message::Game::SBufferMsg
	ECmdGateFriendApply = 12012,	 //好友申请      ::Message::Game::SApplyMsg
	ECmdGateFriendReply = 12013,   //好友申请回复	 ::Message::Game::SReplyMsg
	ECmdGateTaskOpenEndList = 12014,   //功能开启已结束任务列表 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdGateTaskCanGet = 12015,	 //可接任务		 ::Message::Game::SSeqTask
	ECmdGateTaskMy = 12016,	 //当前任务		 ::Message::Game::SSeqPlayerTask            
	ECmdGateFriendRecord = 12017,   //好友记录      ::Message::Game::SFriendRecordMsg [Message/Game/GameMsg.cdl]          
	ECmdGateFriendOnlineStatus = 12018,  //好友在线状态  ::Message::Game::SFriendOnlineStatusMsg [Message/Game/GameMsg.cdl]
	ECmdGateMailNotice = 12019,	 //邮件通知		 ::Message::Game::SMailNotice [Message/Game/GameMsg.cdl]

	ECmdGateDrop = 12020,   //普通掉落      ::Message::Game::SAttributeUpdate 
	//              EAttributeKillBoss             杀死怪物
	//              EAttributeExperienceAdd        增加经验
	//              EAttributeCoinAdd              增加铜钱
	//              EAttributeCoinBindAdd          增加绑定铜钱
	//              EAttributeGoldAdd              增加金币
	//              EAttributeGoldBindAdd          增加绑定金币
	//              EAttributeHonourAdd            增加荣誉
	//              EAttributeArenaAdd             增加竞技场金券
	//              EAttributePrestigeAdd          增加声望
	ECmdGateChatMsgPrivate = 12021,   //私聊聊天消息      ::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]
	ECmdGateSysSetting = 12022,	 //系统设置		Message::Game::SSysSetting [Message/Game/GameMsg.cdl]
	ECmdGateLookUpPlayerRequest = 12023,	//查看玩家请求 Message::Game::SLookupPlayerRequest [Message/Game/GameMsg.cdl]
	ECmdGateLookUpPlayerReply = 12024,	// 查看玩家响应		Message::Game::SLookupPlayerReply [Message/Game/GameMsg.cdl]
	ECmdGateAutoFightSetting = 12025,	//自动战斗设置 Message::Game::SAutoFightSetting [Message/Game/GameMsg.cdl]
	ECmdGateShortcut = 12026,	//玩家快捷键设置 Message::Game::SShortcut [Message/Game/GameMsg.cdl]
	ECmdGateTaskRewardItemGuide = 12027, //任务奖励物品指引 Message::Game::STaskRewardItemGuide [Message/Game/GameMsg.cdl]
	ECmdGateTaskRemove = 12028,			//移除任务 Message::Game::STaskRemove [Message/Game/ITask.cdl]
	ECmdGateLookUpPetReply = 12029,	// 查看宠物返回	Message::Game::EPetInfo [Message/Game/GameMsg.cdl]

	ECmdGatePositionUpdate = 12030,   //更新玩家位置 ::Message::Public::SSeqAttributeUpdate
	ECmdGateIssm = 12031,   //更新实名制信息 ::Message::Game::SIssmMsg       
	ECmdGateFriendRemove = 12032,   //删除好友		 ::Message::Game::SFriendRemoveMsg                          
	ECmdGateBagCapacityChange = 12033,   //“背包”容量更新 ::Message::Game::SBagCapacityChangeMsg
	ECmdGateOperationOnline = 12034,	 //在线操作		::Message::Game::SOperationOnlineMsg [Message/Game/GameMsg.cdl]
	ECmdGatePetBag = 12035,		// 宠物背包给客户端 ::Message::Game::SPetBag
	ECmdGatePetUpdate = 12036,		// 更新宠物     ::Message::Game::SPetUpdate
	ECmdGatePetStatusUpdate = 12037,		// 更新宠物状态 ::Message::Game::SPetStatusUpdate
	ECmdGatePetAttributeUpdate = 12038,		// 更新宠物字段 ::Message::Public::SSeqAttributeUpdate
	ECmdGateChatMsgSpace = 12039,	  // 场景聊天 ::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]
	ECmdGateChatMsgGroup = 12040,    // 队伍聊天 ::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]

	ECmdGateOperOnlineModifyRoleName = 12041,	 //在线修改玩家名 ::Message::Game::SOperationOnlineMsg [Message/Game/GameMsg.cdl]
	ECmdGateUpdateCredit = 12042,	 //更新玩家积分   ::Message::Game::SSeqSPlayerCreditUpdate	[Message/Game/GameMsg.cdl]    

	ECmdGateOperationOnlineSystem = 12043,	//在线操作（系统接收） ::Message::Game::SOperationOnlineMsg [Message/Game/GameMsg.cdl]     
	ECmdGateChatMsgMoniterOper = 12044,	//聊天监控操作 ::Message::Game::SChatMoniterOper [Message/Game/GameMsg.cdl]  

	ECmdGateSkillUpdateList = 12045,	//技能更新列表 ::Message::Public::SSeqSkillUpdate [Message/Public/EntityUpdate.cdl]

	ECmdGateKillPlayer = 12050,	 //杀死玩家       ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdGateKillByPlayer = 12051,	 //玩家被杀       ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
	ECmdGateKilledWhenAttackTransport = 12052, //攻击镖车中被杀 NULL 
	ECmdGateKillByEntity = 12053,	// 被实体对象杀死 ::Message::Public::SEntityKillerInfo [Message/Public/GamePublic.cdl]

	ECmdGateLiveWorldBossList = 12054,	//存活的世界boss列表 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdGateWorldBossLive = 12055,	//世界boss存活 Message::Public::SIntDate [Message/Public/CdlPublic.cdl]
	ECmdGateWorldBossDead = 12056,	//世界boss死亡 Message::Public::SIntDate [Message/Public/CdlPublic.cdl]
	ECmdGateWorldBossGuildHurtRank = 12057, //世界boss仙盟伤害排名 Message::Game::SSeqWorldBossGuildHurtRank [Message/Game/GameMsg.cdl]

	ECmdEscortEntityDeath = 12060,	 //护送对象死亡		NULL
	ECmdEscortEntitySuccess = 12061,	 //护送成功		    NULL
	ECmdEscortEntityPoint = 12062,   //护送目标位置   ::Message::BroadCast::SEntityMoveInfo
	ECmdEscortEntityUpdate = 12063,   //护送目标位置   ::Message::BroadCast::SEntityMoveInfo

	ECmdGateLookUpPlayerRequestCrossToplist = 12064, //查看跨服排行榜玩家请求 
	//Message::Game::SLookupPlayerRequest [Message/Game/GameMsg.cdl]
	ECmdGateLookUpPlayerRequestCrossToplistFromSnapshot = 12065,
	ECmdGateLookUpPlayerReplyCrossToplist = 12066,
	ECmdGateLookUpPlayerReplyCrossToplistFromSnapshot = 12067,
	ECmdGateLookUpPlayerCrossToplistErrorMsg = 12068,

	ECmdGatePanicBuyItem = 12070,   //抢购物品数量更新 ::Message::Game::SPanicBuyItemMsg
	ECmdGatePanicBuyRefresh = 12071,   //抢购特区配置更新 ::Message::Game::SPanicBuyRefreshMsg
	ECmdGatePanicBuyPlayer = 12072,   //玩家抢购记录 ::Message::Game::SPanicBuyPlayerMsg

	ECmdGateSpaceBossList = 12073,	//场景boss列表 Message::Public::SDictIntBoolDate [Message/Public/CdlPublic.cdl]
	ECmdGateSpaceBoss = 12074,	//场景boss Message::Public::SIntBoolDate [Message/Public/CdlPublic.cdl]
	ECmdGateSpaceBossHurtRank = 12075, //场景boss伤害排名 Message::Game::SSeqSpaceBossHurtRank [Message/Game/GameMsg.cdl]

	ECmdGateWildKillBossMoreExp = 12076, //野外杀怪多倍经验 Message::Public::SActiveOpen [Message/Public/GamePublic.cdl]
	ECmdGateWildKillBossMoreExpClose = 12077,	//野外杀怪多倍经验结束 NULL

	ECmdGateOnlineReward = 12080,   //在线奖励更新  S2C_SOnlineReward [Player.proto]

	ECmdGateShowReward = 12081,	//奖励信息展示 ::Message::Public::SSeqReward [Message/Public/GamePublic.cdl]

	ECmdGateChapterCopyNumAndAddNumDt = 12082, //章节副本副本次数和下次增加次数的时间 Message::Public::SIntDate [Message/Public/CdlPublic.cdl]
	ECmdGateChapterCopyStarInfo = 12083, //章节副本章节ID和星级 Message::Public::SDictIntInt [Message/Public/CdlPublic.cdl]
	ECmdGateChapterCopyStarTarget = 12084,	//章节副本目标奖励 Message::Game::SIntType [Message/Public/GameMsgEx.cdl]

	ECmdGateLevelCopyTimeInfo = 12085, //关卡副本关卡ID和通关时间(格式：秒数, 0表示未通关过) Message::Public::SIntDate [Message/Public/CdlPublic.cdl]

	ECmdGateCoinCopyInfo = 12086,			//铜钱副本信息 Message::Public::SCoinCopyInfo [Message/Game/GameMsg.cdl]
	ECmdGateCoinCopyJumpRingTip = 12087,	//铜钱副本跳波提示 Message::Public::SSeqInt（xx秒内，目标波数）[Message/Public/CdlPublic.cdl]

	ECmdGateTaskExtradReward = 12088,	//任务额外奖励 Message::Public::SSeqInt（任务分组，物品code，每日最大次数）[Message/Public/CdlPublic.cdl]

	ECmdGateFriendInfoUpdateToInter = 12089, //由InterApp通知玩家的好友，玩家的信息有更新 Message::Game::SNoticeFriendPlayerUpdate [Message/Game/GameMsg.cdl]
	ECmdGateFriendInfoUpdate = 12090,	// 玩家信息更新	::Message::Public::SSeqAttributeUpdate
	ECmdGatePlayerTransport = 12091,	//玩家运镖 ::Message::Game::SPlayerTransport [Message/Public/GameMsg.cdl]
	ECmdGatePlayerLoopBook = 12092,	//玩家循环任务书 ::Message::Game::SPlayerLoopBook [Message/Public/GameMsg.cdl]

	ECmdGateVeinInfo = 12093,	//灵脉信息 Message::Game::SVeinInfo [Message/Game/GameMsg.cdl]

	ECmdGateRewardNow = 12094, //副本当前奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdGateShopLimit = 12095,	//商店限购 Message::Public::SAttribute（只需要关注valueStr） [Message/Public/EntityUpdate.cdl]

	ECmdGateTransportReward = 12096,	//运镖奖励 Message::Public::STransportReward [Message/Game/ITask.cdl]

	ECmdGateTodayOnlineTime = 12097,	//今天在线时间 Message::Public::SSeqInt（数组只会有一个元素，在线时间，单位：秒） [Message/Public/CdlPublic.cdl]

	ECmdGateTodayOnlineDays = 12098,	//在线天数 Message::Public::SSeqInt（数组只会有一个元素，在线天数） [Message/Public/CdlPublic.cdl]

	ECmdGateDrugCanUseDt = 12100,    // 药品cd结束时间  ::Message::Game::SDrugCanUseDtMsg

	ECmdGateShapeList = 12101,	//外形列表 Message::Game::SShapeList [Messate/Game/IShape.cdl]
	ECmdGateShape = 12102,	//外形 Message::Game::SShape [Messate/Game/IShape.cdl]
	ECmdGateShapeWarfare = 12103,	//外形战斗力 Message::Public::SSeqInt（外形，战斗力）[Message/Public/CdlPublic.cdl]

	ECmdGateUpgradeGrowthInfo = 12110,    //  提升灵根信息  ::Message::Game::SUpgradeGrowthInfoMsg

	ECmdGateChatMsgGuild = 12111,		// 仙盟聊天	::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]
	ECmdGateGuildNotice = 12112,		// 仙盟广播 ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]
	ECmdGateComprehensionTarget = 12115,			// 修真目标更新 ::Message::Game::SComprehensionTargetState [Messge/Game/GameMsg.cdl]
	ECmdGateComprehensionTargetNew = 12116,		// 新修真目标更新 ::Message::Game::SComprehensionTargetStateNew [Messge/Game/GameMsg.cdl]

	//好友祝贺成功（被祝贺成功）
	ECmdGateFriendBlessSucess = 12140, // ::Message::Public::SFriendBlessSucess [Message/Public/FriendBlessPublic.cdl]
	//好友祝贺提示
	ECmdGateFriendBlessTips = 12141, // ::Message::Public::SFriendBlessInfo [Message/Public/FriendBlessPublic.cdl]
	//好友祝贺列表（玩家收到的好友祝贺列表）
	ECmdGateFriendBlessList = 12142, // ::Message::Public::SeqFriendBlessInfo [Message/Public/FriendBlessPublic.cdl]

	//好友祝福经验瓶
	ECmdGateFriendBlessExpBottle = 12143, // ::Message::Public::SFriendBlessExpBottle [Message/Public/FriendBlessPublic.cdl]

	//宠物信息(传闻)
	ECmdGatePetInfo = 12144,	// ::Message::Game::SPetInfo [Messate/Game/GateMsg.cdl]

	//打坐奖励（双修）
	ECmdGateZazenRewardInfo = 12145,	// ::Message::Game::SZazenReward [Messate/Game/GateMsg.cdl]
	//寻宝任务是否开始挖宝              
	ECmdGateStartTreasureHunt = 12146, // ::Message::Game::SStartTreasureHunt [Message/Game/ITask.cdl]

	//查看宠物仓库中宠物信息
	ECmdGateWarehousePetInfo = 12147,	// ::Message::Game::SPetInfo [Messate/Game/GateMsg.cdl]

	//药包信息
	ECmdGateDrugBagInfo = 12148,// ::Message::Game::SDrugBagInfo [Message/Game/GameMsg.cdl]

	//评价玩家
	ECmdVotePlayer = 12149, //	::Message::Game::SVotePlayer [Message/Game/GameMsg.cdl]

	//玩家被评价
	ECmdPlayerVoted = 12150, // ::Message::Game::SVotePlayer [Message/Game/GameMsg.cdl]

	//玩家VIP信息
	ECmdGateVIPInfo = 12151, // ::Message::Game::SVIPInfo [Message/Game/GameMsg.cdl]

	//玩家推广卡使用情况
	ECmdGatePromotionCardInfo = 12152, // ::Message::Game::SPromotionCardInfo [Message/Game/GameMsg.cdl]

	//玩家VIP体验卡信息
	ECmdGateTestVIPCard = 12153, // ::Message::Game::STestVIPCard [Message/Game/GameMsg.cdl]

	//宠物药包信息
	ECmdGateDrugBagPetInfo = 12154, // ::Message::Game::SDrugBagInfo [Message/Game/GameMsg.cdl]

	//宠物复活信息
	ECmdGatePetRecover = 12155, // ::Message::Game::SPetRecover [Message/Game/GameMsg.cdl]

	//玩家VIP升级
	ECmdGateVIPUpgrade = 12156, // ::Message::Game::SVIPUpgrade [Message/Game/GameMsg.cdl]

	ECmdGateKillTransportReward = 12160, //劫镖奖励 ::Message::Game::SKillTransportReward [Message/Game/GameMsg.cdl]			

	//收到鲜花
	ECmdGateRecerveFlowerAddCharm = 12164, // ::Message::Game::SHandselFlowerInfo [Message/Game/GameMsg.cdl]
	ECmdGateReceiveFlower = 12165, // ::Message::Game::SHandselFlowerInfo [Message/Game/GameMsg.cdl]

	//鲜花--接收方不在线
	ECmdGateReceiveFlowerOffline = 12166, // ::Message::Game::SHandselFlowerInfo [Message/Game/GameMsg.cdl]

	ECmdGateKissBack = 12167, //回吻 Message::Public::SMiniPlayer[Message/Public/GamePublic.cdl]

	ECmdGateCostFlower = 12168, //通知发送方扣物品 ::Message::Game::SHandselFlowerInfo [Message/Game/GameMsg.cdl]

	ECmdGateFlowerSuccess = 12169, //赠送成功	::Message::Game::SHandselFlowerInfo [Message/Game/GameMsg.cdl]

	ECmdGateNoticeToMyGuild = 12170,	//向自己的仙盟发信息 ::Message::Public::SPublicNotice [Message/Public/GamePublic.cdl]

	ECmdGateServerOpenDate = 12180, //开服时间 ::Message::Public::SServerOpenDate [Message/Game/GameMsg.cdl]

	ECmdGateServerSysDate = 12181, //服务器时间 ::Message::Public::SDate [Message/Public/CdlPublic.cdl]

	ECmdGatePlayerGuildTask = 12190, //玩家仙盟任务     ::Message::Game::SPlayerGuildTask [Message/Public/GameMsg.cdl]

	ECmdGatePlayerTreasureHunt = 12191, //玩家寻宝刺探任务     ::Message::Game::SPlayerTreasureHunt [Message/Public/GameMsg.cdl]

	ECmdGateTransportFail = 12192, //灵兽护送失败         ::Message::Public::STransportFailReward [ Message/Public/GameMsg.cdl]

	ECmdGateTransportHelp = 12193, //灵兽护送求教         ::Message::Public::STransportHelpInfo [ Message/Public/GameMsg.cdl] 

	ECmdGateOperOnlineMailNoticeByCond = 12200, //后台条件邮件通知     ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateSpringInteractCount = 12210, //温泉互动次数信息		::Message::Public::SpringInteractCount [ Message/Public/GameMsg.cdl] 

	ECmdGateSpringInteractRequest = 12211, //温泉互动请求 		::Message::Public::SpringInteractInfo [ Message/Public/GameMsg.cdl] 

	ECmdGateSpringInteractReceive = 12212, //接受温泉互动 		::Message::Public::SpringInteractInfo [ Message/Public/GameMsg.cdl]

	ECmdGateSpringInteractSuccess = 12213, //温泉互动成功			::Message::Public::SpringInteractInfo [ Message/Public/GameMsg.cdl]

	ECmdGateSpringInteractMsg = 12214, //温泉互动场景显示		::Message::Public::SSpringInteractMsg [ Message/Public/GameMsg.cdl]

	ECmdGateSpringGroupInfo = 12215, //温泉队伍实体			::Message::Public::SSpringGroupInfo [ Message/Public/GameMsg.cdl]

	ECmdGateRevivalPropNotEnough = 12220, //复活道具不足			NULL

	ECmdGateGuildFlameReward = 12225, //仙盟圣火奖励（15秒） ::Message::Public::SGuildFlameInfo [ Message/Public/GameMsg.cdl]

	ECmdGateGuildFlameInfo = 12226, //仙盟圣火信息         ::Message::Public::SGuildFlameInfo [ Message/Public/GameMsg.cdl]

	ECmdGateAddFireWood = 12227, //添加柴火             ::Message::Public::SGuildFlameInfo [ Message/Public/GameMsg.cdl]

	ECmdGateAcupointInfo = 12228, //穴位信息        		::Message::Game::SAcupointInfo [Message/Game/GameMsg.cdl]

	ECmdGateSavvyRate = 12229, //悟性提升成功率     	::Message::Game::SSavvyRate [Message/Game/GameMsg.cdl]

	ECmdGateGuildFlameBig = 12230, //火焰变大             NULL

	ECmdGateGuildFlameShort = 12231, //火焰变小             NULL

	ECmdGateFishItems = 12232, //钓鱼获得物品     	::Message::Game::SFishItems [Message/Game/GameMsg.cdl] 

	ECmdGateKillEvilCanGetInfo = 12235, //可接诛邪任务信息		::Message::Game::SKillEvilCanGetInfo [Message/Game/GameMsg.cdl]

	ECmdGateKillEvilReleaseInfo = 12236, //诛邪任务发布信息		::Message::Game::SKillEvilReleaseInfo [Message/Game/GameMsg.cdl]

	ECmdGateMyKillEvilGetInfo = 12237, //玩家领取诛邪任务信息	::Message::Game::SMyKillEvilGetInfo [Message/Game/GameMsg.cdl]

	ECmdGatePlayerKillEvil = 12238, //玩家诛邪任务			::Message::Game::SPlayerKillEvil [Message/Game/GameMsg.cdl]

	ECmdGateAddPlayerTask = 12239, //	添加玩家任务		::Message::Game::SAddPlayerTask [Message/Game/GameMsg.cdl]

	ECmdGateSetPetGoal = 12240, // 设置宠物目标		::Message::Public::SEntityId	[Message/Public/GamePublic.cdl]  

	ECmdGatePetCollections = 12241, // 收集宠物列表		::Message::Game::SPetCollections	[Message/Game/GameMsg.cdl]
	ECmdGatePetIllusions = 12242, // 宠物化形列表 		

	ECmdGatePlayerLockStatus = 12245, // 玩家密码锁状态		::Message::Game::SPlayerLockStatus	[Message/Game/GameMsg.cdl] 
	ECmdGatePlayerLockError = 12246, // 玩家密码锁错误	    ::Message::Game::SPlayerLockError	[Message/Game/GameMsg.cdl] 
	ECmdGatePlayerLockIsLocked = 12247, // 玩家密码锁处于锁保护状态	    NULL

	ECmdGateHadHandleGoOutTaskIssue = 12250,	//已处理完过时的发布任务（诛邪令）

	ECmdGateSystemGetTaskIssue = 12251,	//被接取发布任务（诛邪令）::Message::Game::SSystemGetTaskIssue [Message/Game/GameMsg.cdl]

	ECmdGateCompleteKillEvilTask = 12252,	//完成或取消诛邪令任务	  ::Message::Game::SCompleteKillEvilTask [Message/Game/GameMsg.cdl]

	ECmdGateEndFishStatus = 12269,	//结束钓鱼状态			NULL

	ECmdGatePlayerSchoolTask = 12280,	//玩家师门任务 	   ::Message::Game::SPlayerSchoolTask [Message/Game/GameMsg.cdl]

	ECmdGateMyTitles = 12290,	//玩家当前称号 ::Message::Game::SSeqTitle [Message/Game/ITitle.cdl]
	ECmdGateTitleTimeOut = 12291,	//称号到期	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
	ECmdGateTitleGet = 12292,	//获得称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
	ECmdGateTitieRemove = 12293,	//移除称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
	ECmdGateTitleUpdate = 12294,	//称号更新	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
	ECmdGateUseTitle = 12295,	//佩戴称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]

	ECmdGatePlayerCycleTask = 12310,    //玩家跑环任务 ::Message::Game::SPlayerCycleTask [Message/Public/GameMsg.cdl]

	ECmdGateTaskGroupNum = 12311,	//任务分组次数 Message::Game::STaskGroupNum [Message/Public/GameMsg.cdl]

	ECmdGateIssmKickOutThreeHour = 12320,    //实名制踢人（在线3小时）	NULL
	ECmdGateIssmKickOutOfflineTimeLessFiveHour = 12321,	//实名制踢人（离线不足5小时）	NULL

	ECmdGateFunctionControlList = 12322,	//功能控制列表 SFunctionControlList [Message/Public/GameMsg.cdl]

	ECmdGateMarketSearch = 12333,	//搜索市场记录		::Message::Game::SSeqMarketItem [Message/Game/IMarket.cdl]
	ECmdGateMarketGetMySells = 12334,	//获得我的上架记录	::Message::Game::SSeqMarketItem [Message/Game/IMarket.cdl]
	ECmdGateMarketResultBuyItem = 12335,	//购买操作结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketResultSellItem = 12336,	//上架操作结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketSearchCancelSell = 12337,	//下架操作结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketGetMySeekBuys = 12338,		//获得我的求购记录	::Message::Game::SSeqMarketItem [Message/Game/IMarket.cdl]
	ECmdGateMarketCancelSeekBuy = 12339,		//取消求购结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketResultSeekBuy = 12340,		//求购操作结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketResultSellSeekItem = 12341,	//售物操作结果返回	::Message::Game::SMarketResult  [Message/Game/IMarket.cdl]
	ECmdGateMarketQuickSearch = 12342,		//快速卖物搜索	::Message::Game::SSeqMarketItem [Message/Game/IMarket.cdl]

	ECmdGateGMAndGuideFlag = 12345,	//更新玩家新手指导员标志	::Message::Game::SPlayerGmAndGuide [Message/Public/GameMsg.cdl]
	ECmdGateGMFlag = 12346,	//更新玩家GM标志	::Message::Game::SPlayerGmAndGuide [Message/Public/GameMsg.cdl]
	ECmdGateGuideFlag = 12347,	//更新玩家新手指导员标志	::Message::Game::SPlayerGmAndGuide [Message/Public/GameMsg.cdl]

	ECmdGateUseItem = 12350,	//使用道具	Message::Public::SUseItem[Message/Public/GamePublic.cdl]
	ECmdGateMakeItem = 12351,	//合成道具	Message::Public::SUseItem[Message/Public/GamePublic.cdl]
	ECmdGateUseSocoreInDefense = 12352, //使用积分  Message::Public::SPoint [Message/Public/GamePublic.cdl]

	ECmdGateGmCloseWorldChat = 12360,	//gm关闭世界聊天频道	NULL
	ECmdGateGmOpenWorldChat = 12361,	//gm开启世界聊天频道	NULL

	ECmdGateOperOnlineWorldChat = 12365,	//后台世界聊天控制     ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateUpdateShopCostReturn = 12370,	//更新商场消费返还	   ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateActiveConsumeCount = 12371,	//活动累计消费	::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateUpdatePlayerToplistTitle = 12375,	//更新玩家排行榜称号	   ::Message::Public::SPlayerToplistTitleUpdate [Message/Public/GameMsg.cdl]

	ECmdGateMagicTowerGetQuestion = 12380,	//获取爬塔题目	NULL
	ECmdGateMagicTowerResetQuestion = 12381,	//重置爬塔题目	NULL

	ECmdGateContinuousLoad = 12385,	//连续登陆天数			::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//特殊活动（活动管理员）
	ECmdGateSpecialActiveUpdate = 12390,	//特殊活动更新 Message::Public::SSeqSpecialActiveInfo [Message/Public/ActiveDef.cdl]
	ECmdGateSpecialActiveAllCode = 12391,	//所有的特殊活动编码 Message::Public::SSpecialActiveAllCode [Message/Public/ActiveDef.cdl]
	ECmdGateSpecialActiveDetail = 12392,	//特殊活动详情【已废弃】 Message::Public::SSpecialActiveInfo [Message/Public/ActiveDef.cdl]

	ECmdGateActiveNumberUpdate = 12393,	//序列号活动更新 Message::Public::SSeqSActiveNumber [Message/Public/ActiveDef.cdl]
	ECmdGatePlayerActiveNumberUpdate = 12394,	//玩家序列号活动更新 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateMediaUpdate = 12396,	//媒体推广更新 Message::Public::SMeidaUpdate [Message/Public/ActiveDef.cdl]

	ECmdGateNotShowFashion = 12400,	//屏蔽时装 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateActivity = 12410,	//活跃度	::Message::Game::SPlayerActivity	[Message/Game/GameMsg.cdl]
	ECmdGateActivityActive = 12411,	//完成度活动	::Message::Game::SActivityActive	[Message/Game/GameMsg.cdl]

	ECmdGatePetRentSearch = 12430,	//搜索宠物雇佣	::Message::Game::SPetRentInfos  [Message/Game/IPetRent.cdl]
	ECmdGatePetRentMyRents = 12431,	//玩家的宠物出租信息 ::Message::Game::SPetRentInfos  [Message/Game/IPetRent.cdl]
	ECmdGatePetRentRentPet = 12432,	//出租宠物返回	::Message::Game::SPetRentResult	 [Message/Game/IPetRent.cdl]
	ECmdGatePetRentBorrowPet = 12433,	//雇佣宠物返回	::Message::Game::SPetRentResult	 [Message/Game/IPetRent.cdl]
	ECmdGatePetRentDetailInfo = 12434,	//查看宠物详细信息 ::Message::Game::SPetInfo [Message/Game/GameMsg.cdl]
	ECmdGatePetRentQueryMyWallet = 12435,	//查询我的当前赚取 ::Message::Game::SPetRentWallet [Message/Game/IPetRent.cdl]
	ECmdGatePetRentGetMyWallet = 12436,	//领取我的当前赚取 ::Message::Game::SPetRentWallet [Message/Game/IPetRent.cdl]
	ECmdGatePetRentAddMyWallet = 12437,	//增加我的当前赚取 ::Message::Game::SPetRentWallet [Message/Game/IPetRent.cdl]
	ECmdGatePetRentLog = 12438,	//查看被雇佣日志   ::Message::Game::SPlayerPetRentLog	[Message/Game/IPetRent.cdl]
	ECmdGateAddPetRentLog = 12439,	//添加雇佣日志	   ::Message::Game::SPetRentLog	[Message/Game/IPetRent.cdl]
	ECmdGatePetBorrowCount = 12440,	//每天雇佣次数	   ::Message::Game::SPetRentBorrowCount	[Message/Game/IPetRent.cdl]
	ECmdGatePetBorrowPriceChanged = 12441,	//雇用价格被更改		NULL
	ECmdGatePetRentChangePrice = 12442,	//更改出租价格结果	::Message::Game::SPetRentResult	 [Message/Game/IPetRent.cdl]
	ECmdGateCheristmasCard = 12445,	//圣诞贺卡		// ::Message::Game::SCheristmSPetRentLogasCard [Message/Game/GameMsg.cdl]



	ECmdGateCostCheristmasCard = 12446,	//通知发送方扣物品 ::Message::Game::SCheristmasCard [Message/Game/GameMsg.cdl]

	ECmdGateChristmasInfo = 12447,	//收到圣诞贺卡 Message::Game::SReceiveCheristmasCard [Message/Game/GameMsg.cdl]
	ECmdGateCheristMasCardKissBack = 12448,	//回吻 Message::Game::SCheristmasCard[Message/Game/GameMsg.cdl]
	ECmdGateCheristMasCardSuccess = 12449,	//赠送成功	::Message::Game::SCheristmasCard [Message/Game/GameMsg.cdl]

	ECmdGateChristmasOffline = 12450,	//接收方不在线 ::Message::Game::SCheristmasCard [Message/Game/GameMsg.cdl]

	ECmdGateMakeFunTargetInfo = 12455,    //整蛊道具使用对象信息 ::Message::Game::SMakeFunTargetInfo [Message/Game/GameMsg.cdl]
	ECmdGateMakeFunTargetStatus = 12456,    //整蛊对象状态         ::Message::Game::SMakeFunTargetStatus [Message/Game/GameMsg.cdl]
	ECmdGateMakeFunCasterInfo = 12457,	//整蛊道具施放者信息   ::Message::Game::SMakeFunCasterInfo [Message/Game/GameMsg.cdl]
	ECmdGateEquipScoreUpdate = 12460,	//装备评分信息	::Message::Game::SEquipScoreMsg [Message/Game/GameMsg.cdl]
	ECmdGateEquipScoreToInterUpdate = 12461,	//装备评分信息	::Message::Game::SEquipScoreMap [Message/Game/GameMsg.cdl]
	ECmdGateEquipScoreToAllGateUpdate = 12462,	//同步各Gate间需要移除的uid ::Message::Game::SEquipScoreMap [Message/Game/GameMsg.cdl]

	ECmdGateFairylandParade = 12465,	//无边海炫耀	::Message::Game::SFairyLandDropItems [Message/Game/GameMsg.cdl]		
	ECmdGateRandPetSkillFree = 12470,	//每天免费刷宠物技能	::Message::Game::SRandPetSkillFree [Message/Game/GameMsg.cdl]	

	ECmdGateMyDelegate = 12475,	//我的委托	::Message::Game::SMyDelegate [Message/Game/IDelegate.cdl]
	ECmdGateCanDelegate = 12476,	//可委托	::Message::Game::SCanDelegate [Message/Game/IDelegate.cdl]
	ECmdGateCompleteDelegate = 12477,	//完成委托	::Message::Game::SMyDelegate [Message/Game/IDelegate.cdl]

	ECmdGatePetWarehouseSkills = 12480,	//宠物仓库技能	::Message::Game::MapPetSkills [Message/Game/GameMsg.cdl]

	ECmdGateSuitLockInfo = 12485,	//套装锁定	::Message::Game::SSuitLockInfo [Message/Game/GameMsg.cdl]
	ECmdGateSuitSkillInfo = 12486,	//套装技能信息	::Message::Game::SSuitSkillInfo [Message/Game/GameMsg.cdl]
	ECmdGateSuitSkillUpgradeRate = 12487,	//套装技能升级成功率	::Message::Game::SSuitSkillUpgradeRate [Message/Game/GameMsg.cdl]
	ECmdGateSuitLockTip = 12488,	//套装锁定提示	::Message::Game::SSuitLockTip [Message/Game/GameMsg.cdl]

	ECmdGateRomanicAddFlower = 12500,	//浪漫值增加鲜花数【服务端使用】
	ECmdGateRomanicReward = 12501,	//浪漫值奖励【服务端使用】
	ECmdGateRomanicEnd = 12502,	//浪漫值活动结束
	ECmdGateRomanicData = 12503,	//浪漫值信息 ::Message::Game::SRomanic [Message/Game/GameMsg.cdl]
	ECmdGateRomanicTouchReward = 12504,	//出发浪漫值节点奖励【服务端使用】

	ECmdGateCivilizationInfo = 12510,	//阵营文明度信息 ::Message::Game::SCampCivilizationInfo [Message/Game/GameMsg.cdl]
	ECmdGatePlayerCombatCapabilities = 12511,	//玩家战斗力信息 ::Message::Game::SPlayerCombatCapabilitiesInfo [Message/Game/GameMsg.cdl]
	ECmdGatePlayerCampChangeInfo = 12512,	//玩家转移阵营消息 ::Message::Game::SPlayerCampChangeInfo [Message/Game/GameMsg.cdl]
	ECmdGateChangeCampSuccess = 12513,	//转移阵营成功 ::Message::Game::SPlayerCampChangeInfo [Message/Game/GameMsg.cdl]
	ECmdGateChangeCampFail = 12514,	//转移阵营失败  NULL
	ECmdGateCampNumChanged = 12515,	//阵营已转入人数 ::Message::Game::SCampNumChanged [Message/Game/GameMsg.cdl]

	ECmdGateWorldLevel = 12520,	//世界等级	:Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]

	ECmdGateArenaGiftWish = 12526,	//竞技场礼包心愿值	:Message::Game::SArenaGiftWish [Message/Game/GameMsg.cdl]

	ECmdGateRandPetSkillActive = 12530,	//刷忆魂石送礼包活动	:Message::Game::SRandPetSkillActive [Message/Game/GameMsg.cdl]

	ECmdGateChatMsgForce = 12540,	//势力聊天::Message::Game::SChatMsg [Messge/Game/GameMsg.cdl]
	ECmdGateWeaponFashionCollection = 12543,	//武器时装模型收集 ::Message::Game::SPlayerWingCollection [Messge/Game/GameMsg.cdl]
	ECmdGateFashionCollection = 12544,	//时装模型收集 ::Message::Game::SPlayerWingCollection [Messge/Game/GameMsg.cdl]
	ECmdGateWingCollection = 12545,	//翅膀模型收集 ::Message::Game::SPlayerWingCollection [Messge/Game/GameMsg.cdl]

	ECmdGateCrossFlowerToplistStatue = 12546,	//跨服鲜花榜雕像 ::Message::Public::SCrossFlowerToplistStatues [Messge/Game/Arena.cdl]

	ECmdGateCakeMaterialNum = 12550,	//当天提交蛋糕材料数 Message::Public::SAttribute [Messge/Game/GameMsg.cdl]
	ECmdGateStoneMaterialNum = 12551,	//当天提交石碑材料数 Message::Public::SAttribute [Messge/Game/GameMsg.cdl]

	ECmdGatePlayerSysShortcut = 12555,	//玩家系统快捷键设置 Message::Game::SSysShortcut [Messge/Game/GameMsg.cdl]

	ECmdGatePlayerRuneInfo = 12556,	//（废弃）玩家符文信息 Message::Game::SPlayerRuneInfo [Messge/Game/GameMsg.cdl]

	ECmdGatePlayerRuneNew = 12557,	//玩家符文信息 Message::Public::SPlayerRune [Message/Game/IRune.cdl]

	// 成就
	ECmdGateAchievementUpdate = 12560,	//更新成就（已弃用）
	ECmdGateHasAchievementComplete = 12561,	//有成就已完成	Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdGateRootTargetBreakthrough = 12570,	//根骨目标突破	::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGatePlayerAvatarUpdate = 12575,	//玩家头像 ::Message::Public::SSeqAttributeUpdate [Message/Public/EntityUpdate.cdl]
	ECmdGatePlayerPhotoUpdate = 12576,    // 玩家自定义照片  ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	//数据格式:value为1时,表示客户端有自定义照片,为0时,表示客户端没有自定义照片			

	// 仙侣技能
	ECmdGateUseSkillPassToMate = 12580,	// 仙侣技能(获取坐标) Message::Public::SEntityId[[Message/Public/GamePublic.cdl]
	ECmdGateUseSkillPass = 12581,	// 仙侣技能(传送到坐标) Message::Public::SPoint[Message/Public/GamePublic.cdl]
	ECmdGateUseSkillAddLife = 12582,	// 仙侣技能(加血)
	ECmdGateUseSkillImitate = 12583,	// 仙侣技能(模仿化形)
	ECmdGateUseSkillImitateCancle = 12584,	// 仙侣技能(取消化形)
	ECmdGateUseSkillLove = 12585,	// 仙侣技能(打情骂俏)

	//累计登录奖励
	ECmdGateTotalLoad = 12590,	    //累计登陆天数			::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	//数据格式:value为玩家累计登录天数,valueStr格式形如(2,1),其中逗号前为当前可以领取奖励的累计天数,
	//如果有很多累计天数没有领,就下推最早那个
	//逗号后为今天是否可以领取额外奖励,0表示不可以,1表示可以,
	//命格
	ECmdGateSwallExp = 12600,        //吞噬之命中的经验 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl],value为吞噬之命中的经验
	ECmdGateHunterLevel = 12601,        //可以猎命的信息集合,::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
	//格式:value 今日猎命次数,valueStr可以猎命的等级集合1,2,3,4
	ECmdGateHunterDetail = 12602,        //一键猎命过程,::Message::Game::SHuntDetail  [ Message/Game/SHuntDetail]
	ECmdGateHunterTaskEnd = 12603,        //完成元神指引任务

	//等级封印
	ECmdGateLevelSeal = 12610,	//封印等级	:Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]
	//格式：value为当前封印等级, valueStr为:第一个到达封印等级玩家id#第一个到达封印等级玩家名字(没有玩家时,用=作占位符)#开启下个封印等级日期(totalDay形式,服务端使用)#等级封印经验加成百分比
	ECmdGateFirstReachLevelSeal = 12611,    //[服务端使用]第一个玩家到达封印等级	:Message::Game::SUpdateMsg [Message/Game/GameMsg.cdl]
	//格式：value为当前封印等级, valueStr为:第一个到达封印等级玩家id#第一个到达封印等级玩家名字#还有多少天开启新等级#玩家经验加成信息

	ECmdGatePlayerDramaGuide = 12620,	//剧情副本指引 :Message::Game::SPlayerDramaGuide [Message/Game/GameMsg.cdl]

	ECmdGateFlyRewardInfo = 12625, //飞行奖励 ::Message::Game::SZazenReward [Messate/Game/GateMsg.cdl]	
	ECmdGateConsumeYBRetEveryday = 12626, //消耗YB返回奖励 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	ECmdGateReceiveFlowCross = 12630,	//跨服收到鲜花 ::Message::Game::SHandselFlowerCrossInfo [Messate/Game/GateMsg.cdl]
	ECmdGateCostFlowerCross = 12631,	//通知发送方扣物品 ::Message::Game::SHandselFlowerCrossInfo [Messate/Game/GateMsg.cdl]
	ECmdGateKissBackCross = 12632,	//跨服回吻 ::Message::Game::SHandselFlowerCrossInfo [Messate/Game/GateMsg.cdl]
	ECmdGateReceiveFlowerCrossOffline = 12633, // ::Message::Game::SHandselFlowerCrossInfo [Message/Game/GameMsg.cdl]

	ECmdGateExploreShopInfo = 12635,	//仙境商店信息 ::Message::Game::SExploreShopInfo [Messate/Game/GateMsg.cdl]
	ECmdGateExploreShopHistory = 12636,	//仙境商店历史记录	::Message::Game::SExploreShopHistory [Messate/Game/GateMsg.cdl]

	ECmdGatePetBlessValue = 12640,	// 祝福暴涨数值	Message::Public::SAttributeUpdate [Message/Public/EntityUpdate.cdl]

	ECmdGateSevenDayLoginReward = 12642,	//七天登陆奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	//宠物称号
	ECmdGatePetTitleGet = 12645,	//宠物称号获得 ::Message::Game::SSeqPetTitle [Message/Game/IPetTitle.cdl]
	ECmdGatePetTitleRemove = 12646,	//宠物称号移除 ::Message::Game::SSeqPetTitle [Message/Game/IPetTitle.cdl]
	ECmdGatePetTitleUpdate = 12647,	//宠物称号更新 ::Message::Game::SSeqPetTitle [Message/Game/IPetTitle.cdl]
	ECmdGateSevenDayOpenServerActive = 12650,	//七天开服活动Message::Public::SAttribute[Message/Public/EntityUpdate.cdl]

	ECmdGateSpaceSkill = 12659,		//技能重置  ::Message::Game::SSkillMsg [Message/Game/GameMsg.cdl]
	//占星系统
	ECmdGateStarFortuneInfo = 12660,		//可以占星的信息集合,::Message::Public::SeqAttributeUpdate [Message/Public/EntityUpdate.cdl]								

	//背包冷却时间
	ECmdBagColdTime = 12661,				//背包冷却时间,::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]

	//第一次技术测试活动
	ECmdGateTestLoginGoldReward = 12662,	//第一次技术测试活动,::Message::Public::STestActiveMsg [Message/Public/PublicCommand.cdl]
	ECmdGateNewGuideProcess = 12663,		//新手指引进度下推 ::Message::Game::DictIntInt[Message/Public/EntityUpdate.cdl]
	ECmdUpdateCareer = 12664,	//转职时记录 ::Message::Public::SProfessionCount[Message/Public/GamePublic]

	ECmdGateSweepTodayAccomplish = 12665,	//最大可扫荡层数::Message::Public::SSweepTodayAccomplish
	ECmdGateLoginReward = 12666,					//每日登陆奖励领取结构::Message::Public::SLoginRewardSatus [Message/Public/GamePublic.cdl]
	ECmdGateGoldRewardInfo = 12667,					//消费或者充值奖励结构::Message::Public::SGoldRewardInfo [Message/Public/GamePublic.cdl]

	ECmdGatePlayerMarketItemSellSuccess = 12668, //玩家市场物品售出成功

	//精英副本提示
	ECmdGateCopyHeroWarningTip = 12670,	//精英副本提示信息 ::Message::Game::SEnterHeroCopyTip[Messate/Game/GateMsg.cdl]


	//仙盟篝火对酒盟友
	ECmdGateGuildToastPeople = 12671, //仙盟篝火对酒盟友 ::Message::Game::SSeqToastPeople[Message/Game/IGuild.cdl]

	//首充信息下推
	ECmdGateFristRechargeInfo = 12675, //Message::Game::SFristRechargeInfo[Message/Game/GameMsg.cdl]

	//开服抢购活动下推
	ECmdGateNewOpenPanicBuy = 12676,	// Message::Game::SPanicBuyShopForMsg[Message/Game/GameMsg.cdl]

	//等级奖励
	ECmdGateLevelReward = 12677, 	//Message::Game::SLevelReward[Message/Game/GameMsg.cdl]

	//好友VIP信息更新
	ECmdGateFriendVip = 12678,

	//好友推荐
	ECmdGateFriendRecommand = 12679,		//NULL

	//凡人基金消息
	ECmdFoundationInfo = 12680,				//NULL

	// 仙盟对酒获得BUFF
	ECmdGateGuildToastPeopleGetBuff = 12681,		// 仙盟对酒获得BUFF Message::Game::SToastPeople[Message/Game/GameMsg.cdl]

	// 仙盟对酒获得经验
	ECmdGateGuildToastPeopleGetExp = 12682,		// 仙盟对酒获得经验 Message::Game::SToastPeople[Message/Game/GameMsg.cdl]

	ECmdGateSpringInteractCoolingSec = 12683,	// 梦幻海滩互动冷却 Message::Game::SSpringInteractCooling[Message/Game/GameMsg.cdl

	ECmdGateRechargeInfo = 12684,				// 充值信息 Message::Game::SRechargeInfo[Message/Game/GameMsg.cdl]

	ECmdGateCanLockSuitCodes = 12685,			// 可锁定套装code Message::Game::SCanLockSuitCode[Message/Game/GameMsg.cdl
	ECmdGateLoveTaskAutoCruise = 12686,			// 情缘任务 告知为自动巡游 NULL
	ECmdGateLoveTaskFindParnerInfo = 12687,		// 情缘任务 Message::Game::SFindPartnerInfo[Message/Game/ITask.cdl
	ECmdGateLoveTaskCruiseTip = 12688,			// 情缘任务 巡游弹窗提示 Message::Game::SCruiseTip[Message/Game/ITask.cdl
	ECmdGateLoveTaskCruiseShowChooseCruiseType = 12689, // 情缘任务 当选择巡游方式时掉线再上线时，进行弹窗 NULL
	ECmdGateLoveTaskCruisePartnerLeft = 12690,	//巡游时，友伴结束了 NULL
	ECmdGateLoveTaskRemoveIcon = 12691,			//巡游开始后，移除其他被邀请者的侣字图标
	ECmdGateLoveTaskAcceptedInfo = 12692,		//情缘任务：发给B方关于A方的信息
	ECmdGateMarkPhoneForbidTakeState = 12695,	// 设置锁定玩家机子状态 Message::Game::SMarkPhoneForbidTalkState[Message/Game/GameMsg.cdl]
	ECmdGateGuildFlameUseCount = 12696,			// 仙盟对酒已经使用次数下推 Message::Game::SGuildFlameUseCount[Message/Game/IGuild.cdl]
	ECmdGateLoginGeneralState = 12697,			// 登陆时候返回一些简单状态 Message::Game::SLoginStatesBack[Message/Game/GameMsg.cdl]

	ECmdGateWeaponSoulOpen = 12698,				//集齐橙色装备启动器魂技能

	// 探寻天机
	ECmdGateExploreSecret = 12699,				//探寻天机信息 Message::Game::SExploreSecretMsg[Message/Game/GameMsg.cdl]

	// -- 日常分享
	ECmdGateDailyShare = 12700,					// -- 日常分享 Message::Game::SDailyShareMsg[Message/Game/GameMsg.cdl]

	ECmdGateLoveTaskInviteeInfo = 12701,		// 剩余可被邀请次数 SLoveTaskInviteeInfo[GameMsg.cdl]
	ECmdGateLoveTaskFriendInfo = 12702,			// 好友信息 SLoveTaskInviteeInfo[GameMsg.cdl]
	ECmdGateLoveTaskRemoveCruiseInvite = 12703, 	// -- 发起方结束巡游时 解除对未前来巡游的接收方的巡游邀请
	ECmdGateLoveTaskBuildContactAfterAgree = 12704, 	// -- 接收方“愿意”之后 建立双方entity链接

	// -- 时装足迹 
	ECmdGateFashionTrackCollection = 12705,		//时装足迹模型收集 ::Message::Game::SPlayerWingCollection [Messge/Game/GameMsg.cdl]

	// -- 时装气息 
	ECmdGateFashionHaloCollection = 12706,		//时装气息模型收集 ::Message::Game::SPlayerWingCollection [Messge/Game/GameMsg.cdl]

	// -- 时装着装度
	ECmdGateFashionDressingDegree = 12707,		// 时装着装度Info ::Message::Game::SFashionDressingDegree [Messge/Game/GameMsg.cdl]


	ECmdGateLoveTaskCriuseStatusClear = 12708, 	// clear 传送中所用CriuseStatus = false！
	EcmdLoveTaskInviterLeftBeforeGift = 12709,	// -- inviter在invitee“愿意”之后， 送礼巡游之前掉线 告知 invitee

	//--祝福活动
	ECmdGateHandselBless = 12710,				//祝福活动  Message::Public::SBlessActive[Message/Public/GamePublic.cdl]
	ECmdGateHandselBlessCost = 12711,			//祝福活动消耗 （仅服务端用）Message::Public::SBlessActive[Message/Public/GamePublic.cdl]
	ECmdGateBlessKissBack = 12712,				//祝福活动 Message::Public::SBlessActive[Message/Public/GamePublic.cdl]
	ECmdGateHandselBlessSuccess = 12713,		//成功祝福 Message::Public::SBlessActive[Message/Public/GamePublic.cdl]

	ECmdGateMailToFirendAfterModifyName = 12714,	//玩家改名之后 通知Inter处理发送通知邮件！

	ECmdGateLoveTaskClearContactOnGetMyTask = 12720,	// --invitee不响应巡游 接取自己的任务 清除“愿意”建立的contact
	ECmdGateLoveTaskRemoveInviteBeforeAgree = 12721,	// --在收到 任何“愿意”之前 掉线 通知client移除情缘邀请 
	ECmdGateLoveTaskClearAgreeStatus = 12722,			// -- 清除“愿意”状态
	ECmdGateLoveTaskInviteeGiveUpCruise = 12723,		// -- invitee主动放弃巡游！
	ECmdGateLoveTaskConfirmInviteeContact = 12724,		// -- invite发送命令到Inter找到invitee Gate返回确认contact再下推ECmdPublicLoveTaskStartCruise给invitee
	ECmdGateLoveTaskConfirmInviteeGiveUpCruise = 12725, 	// -- invitee主动放弃“巡游” 通过inter找到invite 确认并告知！
	ECmdGateLoveTaskInviteOffline = 12726,							// -- invite离线, 通知invitee!

	ECmdGateLevelPurchaseInfo = 12727,							// -- 利用为下推等级付费购买记录

	ECmdGateSoulMarkTargetInfo = 12730,							// -- 宝石刻印目标Info
	ECmdGateInitPlayerPetParade = 12731,						// -- 登陆检测并初始玩家仙宠巡游	

	ECmdGatePromotionBuyRecordInfo = 12732,								// -- 促销活动购买INFO	

	ECmdGateRefreshDefenseCopyNextRing = 12733,								// -- 立即刷出下一波怪
	ECmdGateMagicTowerShopItemInfo = 12734,	//--玩家镇妖塔商店物品信息 Message::Public::SMagicFloorItemInfo[GamePublic.cdl]

	ECmdGateTaskHint = 12735,								//退出游戏提醒 Message::Game::STaskHint[GameMsg.cdl]

	ECmdGateMagicTowerFloorInfo = 12736,// --玩家爬塔今日最高层数info Message::Game::SMagicTowerFloorInfo[GameMsg.cdl]
	ECmdBibleModel = 12737, //--修仙宝典完成任务下推 Message::Game::SBibleModel[GameMsg.cdl]
	ECmdGateActiveGoldenWeapon = 12738,                     //金装活动奖励信息::Message::Public::STestActiveMsg [Message/Public/PublicCommand.cdl]
	ECmdGateActivePetGrowth = 12739,                        //宠物成长活动奖励信息下推::Message::Public::STestActiveMsg [Message/Public/PublicCommand.cdl]
	ECmdGateActivePetSpirit = 12740,                        //宠物灵性活动奖励信息下推::Message::Public::STestActiveMsg [Message/Public/PublicCommand.cdl]

	ECmdGateFiveElementInfo = 12750,	// 玩家新五行Info下推 ::Message::Game::SFiveElementInfo
	ECmdGateRefreshSoulInfo = 12751,	// 玩家聚魂info下推 ::Message::Game::SRefreshSoulInfo
	ECmdGateUpdateFiveElement = 12752,	// 更新玩家新五行To cell Message::Public::SFiveElementAttribute

	ECmdGateActiveGuildUpgrade = 12753,                     //仙盟活动信息下推 NULL
	ECmdGateActiveHideAndSeek = 12754,			//抓迷藏活动消息推送 Message::Game::SHideAndSeekNotice
	ECmdGateActiveHideAndSeekInfo = 12755,					//抓迷藏具体消息下推 Message::Game::SHideAndSeekInfo
	ECmdGateLevelGiftInfo = 12756,                          //等级礼包信息下推 
	ECmdGateSignRewardsInfo = 12757,				//签到奖励信息下推 Message::Public::SDailySignRewardInfo[Message/Public/GamePublic.cdl]
	ECmdGateOfflineExpInfo = 12758,               //离线经验信息下推	Message::Game::SOfflineExpMsg[GameMsg.cdl]
	ECmdGateWarehouseMoneyInfo = 12759,			//仙园仓库金钱信息下推 Message::Game::SWarehouseMoney[Message/Game/IBag.cdl]
	ECmdGateCardsInfo = 12760, 				//飞仙令牌信息下推   Message::Game::MapCardsInfo[IAchievement.cdl]
	ECmdGateGetNewCard = 12761,				//获得新的飞仙令牌  Message::Game::SCompleteCards[IAchievement.cdl]
	ECmdGateOperationOnlineActiveConsume = 12762,         //消费活动后台增加消费额度  ::Message::Game::SOperationOnlineMsg [Message/Game/GameMsg.cdl]
	ECmdGateOperationOnlineActiveRecharge = 12763,        //充值活动后台增加充值额度  ::Message::Game::SOperationOnlineMsg [Message/Game/GameMsg.cdl]
	ECmdGateMountNeidanInfo = 12764,    				//坐骑内丹信息下推				::Message::Game::SMountNeidanMsg	[Message/Game/GameMsg.cdl]
	ECmdGatePetTopSkillUpdate = 12765,		// 宠物技能提升更新     ::Message::Game::SPetUpdate
	ECmdGateFashionPurifyInfo = 12766,                           //时装精魂信息下推     ::Message::Game::SfashionPurifyMsg [Message/Game/GameMsg.cdl]
	ECmdGateMoneyTraceInfo = 12767,			//元宝流通信息下推 ::Message::Public::SMonsterKingMoneyInfo [Message/Game/GamePublic]
	ECmdGateHookCopyInfo = 12768,			//挂机副本信息下推 ::Message::Game::SHookCopyInfo [Message/Game/GameMsg.cdl]
	ECmdGateMirrorBattleInfos = 12769,     //封神挑战消息下推  ::Message::Public::SMirrorBattleInfos [Message/Public/CopyInfo]
	ECmdGateMirrorBattleEnergyUpdate = 12770, //封神挑战活力值更新 ::Message::Public::SMirrorBattleEnergyValue [Message/Public/CopyInfo]
	ECmdGateMirrorBattleRecordInfos = 12771, //战斗记录相关下推 ::Message::Public::SMirrorBattleRecordInfos[Message/Public/CopyInfo]
	ECmdGateMirrorBattleTopListInfos = 12772,//排名消息相关下推 ::Message::Public::SMirrorBattleTopListInfos[Message/Public/CopyInfo]
	ECmdGateMirroeBattleBaseDataInfo = 12773,//单个镜像装备信息 ::Message::Public::SMirrorBattleBaseDataInfo[Message/Public/CopyInfo]
	EcmdGateMirrorBattleRankUpdate = 12774,           //封神竞技排名变更   Message::Game::SMirrorBattleRankInfo[Message/Public/CopyDef.cdl]

	ECmdGatePromptFlg = 12791,//温馨提示（升级技能标识）下推 ::Message::Game::SPromptFlgInfo [Message/Game/GameMsg.cdl]
	ECmdGateDownLoadRewardInfo = 12792,		//下载分包奖励::Message::Public::SAttributeUpdate
	ECmdGatePushMoonActiveInfo = 12793,		//中秋在线活动下推

	ECmdGatePushFarmOperationInfo = 12794,		//下推仙园收获信息 Message::Public::SeqReward [Message::Public::GamePublic.cdl]
	ECmdGatePushJXYFoundInfo = 12795,		//下推剑仙缘基金信息 Message::Game::SFristRechargeInfo [Message::Game::GameMsg]
	ECmdGateEnergyUpdate = 12796,		//精力增加下推

	ECmdGatePetAwakeInfo = 12797,			//宠物觉醒数据

	// ======================================================法宝 12800 ~ 12850 begin======================================================
	ECmdGateMagicWareCurSuitID = 12800,				//法宝当前套装id下推 SMagicWareCurSuitId [Message/Game/IMagicWare.cdl]
	ECmdGateMagicWareSuitColletion = 12801,			//法宝套装收集下推 SMagicWareSuitColletion [Message/Game/IMagicWare.cdl]
	ECmdGateMagicWareMainPosIndex = 12802,			//主法宝位置下推 SMagicWareMainPosIndex [Message/Game/IMagicWare.cdl]
	ECmdGateMagicWareFightAdd = 12803,				//法宝模块属性加成 SMagicWareFightAdd [Message/Game/IMagicWare.cdl]
	// ======================================================法宝 12780 ~ 12880 end========================================================

	ECmdGateLotterCountInfo = 12881,				//仙境探险剩余次数下推 ::Message::Game::DictIntInt[Message/Public/EntityUpdate.cdl]

	ECmdGatePetIllusionUpgrade = 12882,				//宠物幻化升级
	//===============================================跨服挖宝 12900 - 12910=====================================================
	ECmdGatePushTreasurePos = 12900,				//下推宝藏坐标信息 
	ECmdGateNoticeCellCreateBoss = 12901,			//通知cell创建boss
	ECmdGatePushMeritMedalInfo = 12902,				//下推玩家功勋勋章等级
	ECmdGatePushMountEquipInfo = 12903,				//下推坐骑装备信息

	ECmdGateGuildVein = 12905,				//仙盟心法信息 Message::Public::SSeqInt（guildVeinLevel、guildVeinIndex）

	ECmdGateGuildVeinNew = 12906,			//新仙盟心法 Message::Public::SDictIntInt[属性类型,等级] [Message/Public/CdlPublic.cdl]

	ECmdGateNewGuildWarehouseItems = 12907, //新仙盟仓库物品列表 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]

	ECmdGateNewGuildWarehouseRecords = 12908, //新仙盟仓库记录列表 Message::Game::SNewGuildWarehouseRecordList [Message/Game/IGuild.cdl]

	ECmdGateNewGuildWarehouseRecordOne = 12909, //新仙盟仓库记录 Message::Game::SNewGuildWarehouseRecordList [Message/Game/IGuild.cdl]

	ECmdGateMagicTowerProcessInfo = 12910,		//爬塔副本进度信息 Message::Game::SMagicTowerProcessInfo

	ECmdGateNewGuildWarehouseItemAdd = 12911, //新仙盟仓库物品 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]

	ECmdGateNewGuildWarehouseItemDel = 12912, //新仙盟仓库物品 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]


	ECmdGateWelcomeRewardInfo = 12915,		//首次登陆欢迎奖励领取信息 Message::Game::SWelcomeRewardInfo

	ECmdGateFashionInfo = 12916,	//时装信息 Message::Game::SFashionInfo [Message/Game/GameMsg.cdl]
	ECmdGateFashionList = 12917,	//时装列表 Message::Game::SFashionList [Message/Game/GameMsg.cdl]

	ECmdGateSwordPoolInfo = 12920,	//剑池信息 Message::Game::SWordPool [Message/Game/ISWordPool.cdl]
	ECmdGateSwordPoolEventUpdate = 12921, //剑池事件更新 Message::Public::SDictIntInt [Message/Public/CdlPublic.cdl]
	ECmdGateSwordPoolExpUpdate = 12922,	//剑池经验更新 Message::Public::SSeqAttributeUpdate [Message/Game/EntityUpdate.cdl]
	ECmdGateSwordPoolActivityInfo = 12923, //剑池活跃度已领取奖励列表 Message::Game::SSWordPoolActivity [Message/Game/ISWordPool.cdl]

	ECmdGatePlayerStrenghtenInfo = 12925, //玩家装备部位强化信息 Message::Public::SDictSeqInt<装备类型,[强化等级,幸运值]> [Message/Public/CdlPublic.cdl]

	ECmdGatePlayerGmReportNum = 12926, //玩家意见反馈次数 Message::Public::SSeqInt[今日次数,每日最大次数] [Message/Public/CdlPublic.cdl]

	ECmdGateGameBossList = 12930,	//游戏boss列表 Message::Public::SDictIntBoolDate [Message/Public/CdlPublic.cdl]
	ECmdGateGameBoss = 12931,		//游戏boss Message::Public::SIntBoolDate [Message/Public/CdlPublic.cdl]
	

	ECmdGateVIPInvalid = 12934,		//VIP失效
	ECmdGateDeityBookTargetComplete = 12935,    // 天书目标完成

	ECmdGateBossMapRevivalTire = 12936, // BOSS地图复活疲劳   Message::Public::SIntDate [Message/Public/CdlPublic.cdl]

	ECmdGatePrayInfoAll = 12937,        // 所有祈福信息   Message::Game::SPrayInfos [Message/Game/ActiveDef.cdl]
	ECmdGatePrayInfoUpdate = 12938,     // 更新祈福信息   Message::Game::SPrayInfos [Message/Game/ActiveDef.cdl]

	ECmdGateRechargeRewardInfo = 12939,	// 充值奖励信息   Message::Game::SRechargeRewardInfo [Message/Game/GameMsg.cdl]
	ECmdGateInvestMensualInfo = 12940,	// 月卡投资信息   Message::Game::SInvestMensualInfo [Message/Game/Invest.cdl]
	
	ECmdGateRechargeActiveInfo = 12941,	// 充值活动信息（首冲和每日累冲）   Message::Game::SRechargeActiveInfo [Message/Game/IActive.cdl]
	ECmdGateRechargeTotalHadGetList = 12942,// 开服累冲已领取列表   Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdGateRechargeTotalNum = 12943,		// 开服累冲已充值数量   Message::Public::SInt    [Message/Public/CdlPublic.cdl]

	ECmdGateRuneLotteryNextFreeDt = 12945,	//符文寻宝下一次免费寻宝时间 Message::Public::SDate [Message/Public/CdlPublic.cdl]
	ECmdGateOpenRunBoxShowReward = 12946, //开启符文宝箱奖励展示 Message::Public::SSeqReward [Message/Public/GamePublic.cdl]

	ECmdGateCopyAssistResult = 12947,    //副本阵战结果 Message::Public::SSeqInt[ECopyAssistResult类型,助阵次数]    [Message/Public/CdlPublic.cdl]

	ECmdGateAutoUndressEquipType = 12948,    //脱下装备 Message::Public::SInt[装备类型]    [Message/Public/CdlPublic.cdl]
	ECmdGatePlayerLevelWhen3State = 12949,    //玩家三转时候的等级 Message::Public::SInt[等级]    [Message/Public/CdlPublic.cdl]
	ECmdGateRefreshFreeTime = 12950,    //洗练剩余免费次数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveMoreExp = 12951, //双倍经验1开启0结束 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateSpecialActiveGetInfo = 12952, //特殊活动已领取标志 Message::Public::SDictSeqInt    [Message/Public/CdlPublic.cdl]
	ECmdGateSpecialActiveGetInfoUpdate = 12953, //特殊活动已领取标志 Message::Public::SDictSeqInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveRechargeNum = 12954, //活动期间充值数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveRechargeNum2 = 12955, //活动期间充值数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveRechargeNumMerge = 12956, //活动期间充值数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]

	ECmdGatePlayerSoul = 12960,			// 玩家灵魂信息 Message::Public::SPlayerSoul [Message/Game/ISoul.cdl]

	ECmdGateNaturalGift = 12965,		// 玩家天赋信息 Message::Public::SNaturalGift [Message/Game/GameMsg.cdl]

	ECmdGateSpecialActiveUpdatePart = 12966,	//特殊活动更新(不清除原来的活动) Message::Public::SSeqSpecialActiveInfo [Message/Public/ActiveDef.cdl]

	ECmdGateActiveActivityPoint = 12967, //活跃点数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveActivityInfo = 12968, //活跃度信息 Message::Public::SPlayerActivityInfo    [Message/Game/IActive.cdl]

	ECmdGateActiveHallUpdate = 12969,	//限时活动更新 Message::Public::SDictIntInt [Message/Public/CdlPublic.cdl]

	ECmdGateOpenGiftBagShowReward = 12970, //开启固定+随机礼包奖励展示 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]

	ECmdGateBeastInfos = 12971,			// 神兽信息		Message::Game::SBeastInfos [Message/Game/IBeast.cdl]
	ECmdGateBeastInfoUpdate = 12972,	// 神兽信息更新	Message::Game::SBestInfo [Message/Game/IBeast.cdl]
	ECmdGateActiveConsumeNum = 12973, //活动期间消费数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveConsumeNumMerge = 12974, //活动期间消费数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateUseLimit = 12980,			//使用物品数量限制 Message::Public::SDictIntInt [Message/Public/CdlPublic.cdl]

	ECmdGateShopSeckillEndDt = 12981,			//秒杀关闭时间  Message::Game::SShopSeckillInfo [Message/Public/CdlPublic.cdl]
	ECmdGateActiveInvest = 12982,			//活动投资状态 Message::Public::SInt [Message/Public/CdlPublic.cdl]
	ECmdGateActiveInvestRewardInfo = 12983,			//活动投资奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]

	ECmdGateActiveActivityPointMerge = 12984, //合服活跃点数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	// ECmdGateActiveActivityInfoMerge = 12985, //合服活跃度信息 Message::Public::SDictIntInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveActivityInfoMerge = 12985, //合服活跃度信息 Message::Public::SPlayerActivityInfo [Message/Game/IActive.cdl]
	ECmdGateActiveLotteryTreasure = 12986, //鉴宝图标 开启 结束 Message::Game::SLotteryTresure    [Message/Public/CdlPublic.cdl]
	ECmdGateLotteryLuck = 12987, //抽奖幸运值 Message::Public::SDictIntInt    [Message/Public/CdlPublic.cdl]

	ECmdGateChildrenList = 12988,	//仙娃列表 Message::Game::SChildrenList [Message/Game/GameMsg.cdl]
	ECmdGateShopSeckillEndDtMerge = 12989,			//合服秒杀关闭时间 Message::Game::SShopSeckillInfo [Message/Public/CdlPublic.cdl]

	ECmdGateLoveBoxRequest = 12990,		//爱情宝匣请求购买 NULL
	ECmdGateDragonSpirit = 12991,			//龙魂 Message::Game::SDragonSpirit [Message/Game/GameMsg.cdl]

	ECmdGatePlayerRegainList = 12992,		//资源找回  Message::Game::SPlayerRegainList [Message/Game/GamePublic.cdl]
	ECmdGatePlayerRegainListUpdate = 12993,	//资源找回  Message::Game::SSeqInt

	ECmdGateReturnPlayerLogin = 12994, //回归玩家登录 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateeReturnPlayerBuff = 12995, //回归玩家BUFF Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveInvestEx = 12996,			//活动投资状态 Message::Public::SInt [Message/Public/CdlPublic.cdl]
	ECmdGateActiveInvestRewardInfoEx = 12997,			//活动投资奖励 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	ECmdGateActiveLuckyStickOpen = 12998, //上上签图标开启Message::Game::SLotteryTresure    [Message/Public/CdlPublic.cdl]
	ECmdGateActiveLuckyStickClose = 12999, //上上签图标结束

	ECmdGateHallowInfos = 13010,		// 圣器信息列表	Message::Game::SHallowInfos [Message/Game/IHallow.cdl]
	ECmdGateHallowInfoUpdate = 13011,	// 圣器信息更新	Message::Game::SHallowInfo  [Message/Game/IHallow.cdl]
	ECmdGateMagpieDonateNum = 13012, //个人捐献 Message::Public::SInt [Message/Public/CdlPublic.cdl]
    ECmdGateVIPLevelGiftBagRewardInfo = 13042, //vip等级礼包 Message::Game::SSVIPGiftBagInfos [Message/Game/GameMsg.cdl]
	ECmdGateActiveRechargeCondDayCount = 13043, //连续充值已充值天数 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
    ECmdGatePlayerMonthCardInfo			= 13044,//月卡信息   Message::Game::SMonthCardInfo [Message/Game/GameMsg.cdl]

    ECmdGatePunchLeadCopyCanSummon    = 13046,   //开始召唤伙伴 NULL
	ECmdGateSGuildLogAppend = 13047,	//公会日志更新追加 Message::Game::SGuildLog [Message/Public/GamePublicEx.cdl]

	ECmdGateIllustratedWarfare	= 13049,	// 图鉴战力 	Message::Public::SInt    [Message/Public/CdlPublic.cdl]

	ECmdGateMyMysteryShop = 13050,	//神秘商店信息	Message::Game::SSeqMysteryShop	[Message/Game/IShop.cdl]
	ECmdGateMyMysteryShopTime = 13051,	//神秘商店免费刷新时间	Message::Game::SMysteryShopTime	[Message/Game/IShop.cdl]

	ECmdGateFriendApplyList		  = 13052,	//好友申请列表      ::Message::Game::SApplyMsgList
    ECmdGateFriendApplyDel		  = 13053,	//好友申请移除      ::Message::Public::SeqInt
	ECmdGateFriendOfflineChatFriendId	    = 13054,	//好友离线消息好友Id列表 ::Message::Public::SSeqInt
	ECmdGateFriendOfflineChatMsgs	    = 13055,	//好友离线消息列表 ::Message::Public::SChatMsgList

	ECmdGateSpiritCopyGetReward       = 13056,  //法宝副本是否有奖励领取 Message::Public::SBool   [Message/Public/CdlPublic.cdl]
	ECmdGateActiveBossScore = 13057,  //下推boss积分 Message::Public::SAttributeUpdate  [Message/Public/CdlPublic.cdl]
	ECmdGatePushQiongCangCopyMsg = 13059, //下推穹苍副本 ::Message::Public::SQiongCangMsg  
	ECmdGatePushQiongCangCopyMsgList    = 13060,        //下推穹苍副本通关列表 ::Message::Public::SQiongCangMsgList	
	ECmdGateIssmRewardInfo = 13061,
	ECmdGateInvestRewardInfo = 13062, //投资计划活动奖励领取情况 Message::Game::SInvestActive  [Message/Game/GameMsg.cdl]
	ECmdGateRefreshNewWorldBoss = 13063, //刷新新野外boss Message::Game::SInt  [Message/Public/CdlPublic.cdl]
    ECmdGateSmeltLimit = 13064,		//合成限制 Message::Public::SAttribute
    ECmdGatePushContinueLoginFlag = 13065, //下推是否错过奖励(true: 没错过, false: 错过) Message::Public::SBool   [Message/Public/CdlPublic.cdl]

	ECmdGateActiveRechargeNum4 = 13066, //限时充值活动期间充值数 Message::Public::SInt    

	//仙盟积分仓库
	ECmdGateGuildCreditWarehouseItems = 13070, //仙盟积分仓库物品列表 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]
	ECmdGateGuildCreditWarehouseRecords = 13071, //仙盟积分仓库记录列表 Message::Game::SNewGuildWarehouseRecordList [Message/Game/IGuild.cdl]
	ECmdGateGuildCreditWarehouseRecordOne = 13072, //仙盟积分仓库记录 Message::Game::SNewGuildWarehouseRecordList [Message/Game/IGuild.cdl]
	ECmdGateGuildCreditWarehouseItemAdd = 13073 , //仙盟积分仓库物品 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]
	ECmdGateGuildCreditWarehouseItemDel = 13074 , //仙盟积分仓库物品 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]
	ECmdGateGuildCreditWarehouseItemUpdate = 13075 , //仙盟积分仓库物品 Message::Public::SSeqPlayerItem [Message/Public/GamePublic.cdl]

	ECmdGatePushReachGoalRechargeNum = 13077, //下推冲榜达标充值金额(开服活动冲榜达标冲榜排名用)Message::Public::SInt  

}