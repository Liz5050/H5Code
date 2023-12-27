enum ECmdGame
{
	ECmdGameLogin				= 100001,
	ECmdGameCreateRole			= 100002,
	ECmdGameLoginRole			= 100003,
	ECmdGameLoginGame			= 100010,
	ECmdGameMove				= 100020,	//移动 C2S_SMove
	ECmdGameFight				= 100030,	//战斗  Message::Public::SFightTo
	ECmdGameRevival				= 100040,	//复活	C2S_SRevival
	ECmdGameDress				= 100041,	//着装
	ECmdGameUndress				= 100042,	//卸装
	ECmdGamePass				= 100043,	//传送  C2S_SPass
	ECmdGameConvey				= 100044,	//传送到目的地 
	ECmdGameBeginCollect			= 100045,	//开始采集物品
	ECmdGameEndCollect			= 100046,	//结束采集物品
	ECmdGameAbortCollect			= 100047,	//终止采集
	ECmdGameSetMode             = 100048,  //战斗模式切换 C2S_SSetMode
	ECmdGamePickUpDropItem      = 100049,  //拾取掉落 C2S_SPickUpDropItem
	ECmdGameKeepActive 			= 100050,	//keep active  --  null

	ECmdGameGmUpdateMoney			= 100100,	//GM 命令：设置玩家钱币相关属性
	ECmdGameGmUpdateExp			= 100101,	//GM 命令：增加/减少玩家经验
	ECmdGameGmUpdateLevel			= 100102,	//GM 命令：设置玩家等级
	ECmdGameGmUpdateLifeOrMana		= 100103,	//GM 命令：设置玩家生命或法术等属性
	ECmdGameGmAddItem			= 100104,	//GM 命令：增加物品
	ECmdGameGmOperation			= 100105,	//GM 命令结构  C2S_SGmOperation
	ECmdGameGmTest				= 100106,	//原 GM 命令结构  C2S_SGmTest

	ECmdGameAddBagCapacity			= 100110,	//背包扩容
	ECmdGameMoveItemBetweenBag		= 100111,	//移动物品（背包/仓库/宝藏仓库间）
	ECmdGameSplitItem			= 100112,	//拆分物品
	ECmdGameTidyBag				= 100113,	//整理背包
	ECmdGameUseItem				= 100114,	//使用物品
	ECmdGameUseByItemCode	    = 100115,	//使用物品  C2S_SUseByItemCode
	ECmdGameMeltEquip                = 100116,	//熔炼装备 C2S_SMeltEquip
	ECmdGameMeltEquipSuccess         = 100117,	//熔炼成功 S2C_SMeltEquip
	ECmdGameDecomposeKill			= 100118,	//分解必杀碎片 C2S_SDecomposeKill
	ECmdGameDecomposeKillSuccess	= 100119,	//分解必杀碎片返回 S2C_SDecomposeKill
	ECmdGameExchangeKill			= 100120,	//兑换必杀碎片 C2S_SExchangeKill
	ECmdGameExchangeKillSuccess		= 100121,	//兑换必杀碎片返回 S2C_SExchangeKill
	ECmdGameExchangeKillFragment			= 100122,	//兑换必杀碎片精华 C2S_SExchangeKillFragment
	ECmdGameExchangeKillFragmentSuccess		= 100123,	//兑换必杀碎片精华返回 S2C_SExchangeKillFragment
	ECmdGameMoveBag							= 100124,	//背包转移 C2S_SMoveBag
	ECmdGameDecomposeItem			= 100125,	// 道具分解 C2S_SDecomposeItem
	ECmdGameDecomposeItemSuccess		= 100126,	//道具分解返回 S2C_SDecomposeItem

	ECmdGameBagItemTransfer			= 100127,	//道具转换（无损分解和合成） C2S_SItemTransfer 和 S2C_SItemTransfer
	ECmdGameBagSpecificItemTransDecompose	= 100128,	//指定物品的无损分解 C2S_SSpecificItemTransDecompose 和 S2C_SSpecificItemTransDecompose
	

	ECmdGameSellItem			= 100150,	//出售物品
	ECmdGameSellEquipOneKey			= 100151,	//一键出售装备
	ECmdGameBuyItemAndUse			= 100152,	//购买物品并使用物品  C2S_SBuyItemAndUse 
	ECmdGameBuyItem					= 100153,	//购买物品 C2C_SBuyItem
	ECmdGameSpiritRenewInBag		= 100154,	//精灵（小恶魔、小天使）续费 
	
	ECmdGameStrengthen			= 100200,	//装备强化
	ECmdGameActivateFashion			= 100201,	//时装--激活
	ECmdGameUpgradeFashion			= 100202,	//时装--升星
	ECmdGameDressFashion			= 100203,	//时装--装备
	ECmdGameUndressFashion			= 100204,	//时装--卸下
	ECmdGameDecomposeFashion		= 100205,	//时装--分解
	ECmdGameUpgradeFashionLevel		= 100206,	//时装--升级
	ECmdGameJewelEmbed			= 100207,	//宝石镶嵌
	ECmdGameJewelGetOff			= 100208,	//宝石卸下
	ECmdGameOpenRefresh			= 100209,	//装备洗练槽开启
	ECmdGameRefresh				= 100210,	//装备洗练
	ECmdGameRefineSmelt			= 100211,	//物品合成
	ECmdGameRefineSmeltEquip		= 100212,	//装备合成（玩家装备、神兽装备）
	ECmdGameGenerateGodEquip		= 100213,	//神装合成
	ECmdGameUpgradeGodEquip			= 100214,	//神装升级
	ECmdGameDecomposeGodEquip		= 100215,	//神装分解
	ECmdGameGetGenerateGodEquip		= 100216,	//获取对应合成的神装
	ECmdGameUpgradeEquip			= 100217,	//合成自动穿戴 升级装备
	ECmdGameUpgradeEquipEx			= 100218,	//装备（龙鳞甲和摄坤铃）进阶 C2S_SUpgradeEquipEx 和 S2C_SUpgradeEquipEx

	ECmdGameShapeUpgradeEx			= 100250,	//外形进阶扩展（神兵/翅膀/法宝）
	ECmdGameShapeUseDrug			= 100251,	//使用丹药
	ECmdGameShapeUpgrade			= 100252,	//外形进阶（宠物/坐骑）
	ECmdGameShapeUseAddLuckyItem		= 100253,	//使用增加幸运值道具
	ECmdGameShapeSwallowEquip		= 100254,	//装备吞噬
	ECmdGameShapeActivateChange		= 100255,	//激活化形（宠物/坐骑）
	ECmdGameShapeUpgradeChange		= 100256,	//激活/升级化形（神兵/翅膀/法宝）
	ECmdGameShapeUpgradeChangeEx		= 100257,	//升级化形（宠物/坐骑）
	ECmdGameShapeChangeUseModel		= 100258,	//幻化（宠物/坐骑/神兵/翅膀/法宝），改变使用的模型
	ECmdGameShapeChangeUseModelEx		= 100259,	//宠物/坐骑幻形中的 幻化，改变使用的模型
	ECmdGameShapeUseAddChangeLuckyItem	= 100260,	//使用增加化形幸运值道具
	ECmdGameShapeNotShow			= 100261,	//屏蔽外形
	ECmdGameShapeActivate			= 100262,	//外形激活 C2S_SShapeActivate 和 S2C_SShapeActivate
	ECmdGameShapeDressEquip			= 100263,	//穿戴外形装备 C2S_SDressShapeEquip 和 S2C_SDressShapeEquip
	ECmdGameShapeUpgradeEquip		= 100264,	//升级外形装备 C2S_SUpgradeShapeEquip 和 S2C_SUpgradeShapeEquip
	ECmdGameShapeUpgradeChangeSkill = 100265,	//升级化形技能 C2S_SUpgradeChangeSkill 和 S2C_SUpgradeChangeSkill

	ECmdGameRunedressRune			= 100280,	//装备符文
	ECmdGameRuneupgradeRune			= 100281,	//升级符文
	ECmdGameRunedecomposeRune		= 100282,	//分解符文
	ECmdGameRunelotteryRune			= 100283,	//符文寻宝
	ECmdGameRunesmeltRune			= 100284,	//符文合成
	ECmdGameRunedecomposeRuneEx		= 100286,	//分解符文（可指定符文的分解数量） C2S_SRunedecomposeRuneEx

	ECmdGameLearnSkill			= 100300,	//学习技能
	ECmdGameUpgradeRealmLevel       =100301, //提升境界 null
	ECmdGameOpenNewRealRole			= 100302,	//开启新角色
	ECmdGameDressByOnekey			= 100303,	//一键换装 C2S_SDressByOneKey
	ECmdGamePushPlayerStrengthenExInfo	= 100304,	//登录推送玩家新强化系统信息	S2C_SPlayerStrengthenExInfo
	ECmdGameUpgradeStrengthenEx		= 100305,	//强化升级新强化系统	C2S_SUpgradeStrengthenEx S2C_SUpgradeStrengthenEx
	ECmdGameActivateStrengthenEx		= 100306,	//激活新强化系统
	ECmdGameUpdatePlayerStrengthenExInfo	= 100307,	//更新推送玩家新强化系统信息
	ECmdGameStrengthenExGetReward		= 100309,	//领取升级奖励 C2S_SStrengthenExGetReward
	ECmdGameStrengthenExAccessoryEmbeded	= 100310,	//附属物装备 C2S_SStrengthenExAccessoryEmbeded
	ECmdGameStrengthenExAccessoryUpgrade	= 100311,	//附属物快速合成 C2S_SStrengthenExAccessoryUpgrade
	ECmdGameStrengthenExAccessoryTransfer	= 100312,	//附属物转换 C2S_SStrengthenExAccessoryTransfer
	ECmdGameSaveSysSetting			= 100400,	//保存系统设置
	ECmdGamePlayerGetSevenDayLoginReward	= 100405,	//领取七天登陆奖励 C2S_SGetSevenDayLoginReward or S2C_SStrengthenExAccessoryTransfer
	ECmdGamePlayerFind			= 100406,	//查询玩家 C2S_SFindPlayer 和 S2C_SFindPlayer
    ECmdGamePlayerPopFirstRecharge		= 100407,	//弹首冲引导消息推送 S2C_SPopFirstRecharge

	ECmdGameMosaicCheats			= 100380,	//秘籍镶嵌 C2S_SMosaicCheats
	ECmdGameExchangeCheats			= 100381,	//秘籍置换 C2S_SExchangeCheats
	ECmdGameCheatsInfo				= 100382,	//秘籍信息 S2C_SCheatsInfo
	ECmdGameMosaicCheatsRet			= 100383,	//秘籍镶嵌返回 S2C_SMosaicCheatsRet
	ECmdGameExchangeCheatsRet		= 100384,	//秘籍置换返回 S2C_SExchangeCheatsRet

	ECmdGameNpcTask				= 100500,	//查询 npc 身上任务（可接的、未完成的、已完成的）
	ECmdGameGetTask				= 100501,	//接任务
	ECmdGameEndTask				= 100502,	//交任务
	ECmdGameTalkToNpc			= 100503,	//与 npc 对话
	ECmdGameGetMgRingTask			= 100504,	//获取循环任务
	ECmdGameEndMgRingTask			= 100505,	//提交循环任务
    ECmdGameGetEndKillBossDropItemTask	= 100506,	//交杀怪掉落物品任务
	ECmdGameOneKeyRoleState3		= 100507,	//一键完成3转
	ECmdGameTaskHandEquip			= 100508,	//上交装备
	ECmdGameTaskAllTaskDone			= 100509, //所有任务完成
	ECmdGameTaskPushTimeLimitedTaskInfo	= 100510,	//玩家限时任务信息推送 S2C_SPlayerTimeLimitedTaskInfo
	ECmdGameTaskUpdateTimeLimitedTaskInfo	= 100511,	//玩家限时任务更新信息推送 S2C_SPlayerTimeLimitedTaskInfoUpdate
	ECmdGameTaskGetTimpLimitedTaskReward	= 100512,	//领取限时任务奖励 C2S_SGetPlayerTimeLimitedTaskReward
	
	ECmdGameEnterCopy			= 100600,	//进入副本   C2S_SEnterCopy
	ECmdGameLeftCopy			= 100601,	//离开副本   null
	ECmdGameInspireInExperienceCopy	= 100602,	//恶魔副本鼓舞 C2S_SInspireInExperienceCopy
	ECmdGameResetExperienceCopyCD	= 100603,	//重置恶魔副本冷却时间  null
	ECmdGameGetGameBossList			= 100604,	//获取游戏boss列表  null
	ECmdGameEnterGameBoss			= 100605,	//进入游戏boss副本  C2S_SEnterGameBoss
	ECmdGameGetGameBossDeathRecord	= 100606,	//获取游戏boss死亡记录  C2S_SGetGameBossDeathRecord
	ECmdGameGetGameBossDropRecord	= 100607,	//获取游戏boss掉落记录  C2S_SGetGameBossDropRecord
	ECmdGameGameBossDeathRecord 	= 100608,	//BOSS死亡记录 SeqGameBossDeathRecord
	ECmdGameGameBossDropRecord 		= 100609,	//BOSS掉落记录 SeqGameBossDropRecord
	ECmdGameStartDelegateNew        = 100610,   //扫荡 C2S_SStartDelegateNew S2C_SStartDelegateNew
	ECmdGameAddCopyNum              = 100611,   //添加副本次数 C2S_SAddCopyNum
	ECmdGameEnterForceWar           = 100612,   //进入三界争霸 null
	ECmdGameEnterMgPersonalBoss     = 100613,   //进入个人boss C2S_SEnterMgPersonalBoss
	ECmdGameContinueRuneCopy     	= 100614,   //继续挑战诛仙塔（副本内）
	ECmdGamePunchLeadCopySummon     = 100615,   //合击副本召唤伙伴 NULL
	
	ECmdGameCheckPointEnerge     = 100620,   //关卡能量值  Message::Public::SInt    [Message/Public/CdlPublic.cdl]

	ECmdGameMountBeckon			= 100700,	//上坐骑   null
	ECmdGameMountRecall			= 100701,	//下坐骑   null

	ECmdGameInteractiveChat			= 100800,	//聊天
	ECmdGameInteractiveChangeChatPhrase	= 100801,	//修改玩家常用语记录
	ECmdGamePlayerChatPhraseUpdate		= 100802,	//玩家常用语更新 Protocol_Game::SPhrase 推送
	ECmdGamePlayerChatPhraseList		= 100803,	//玩家常用语列表 Protocol_Game::SPhraseList 推送
	ECmdGameGetCachedInteractiveMsgs	= 100805,	//获取游戏缓存交互消息,	C2S_SGetCachedInteractiveMsgs 和 S2C_SGetCachedInteractiveMsgs
	ECmdGameGetFriendOfflineChatMsgs	= 100806,	//获取玩家的好友离线消息, C2S_SGetFriendOfflineChatMsgs, 通过 ECmdGateFriendOfflineChatMsgs 消息推送分批返回

	ECmdGameFriendApply			= 100850,	//申请好友 C2S_SFriendApply 和 S2C_SFriendReply
	ECmdGameFriendReply			= 100851,	//回复好友申请 C2S_SFriendReply 和 S2C_SFriendReply
	ECmdGameFriendRemove			= 100852,	//删除好友 C2S_SFriendRemove
	ECmdGameFriendMoveIntoList		= 100853,	//好友表间移动（只能将好友移到黑名单） C2S_SFriendMoveIntoList
	ECmdGameGetFriendList			= 100854,	//获取好友列表 C2S_SGetFriendList 和 S2C_SGetFriendList
	ECmdGameFriendAddToBlackList		= 100855,	//拉黑玩家 C2S_SFriendAddToBlackList 和 S2C_SFriendAddToBlackList
	 
	ECmdGameCreateGuild			= 100900,	//创建仙盟
	ECmdGameSearchGuilds			= 100901,	//搜索仙盟
	ECmdGameApplyGuild			= 100902,	//申请仙盟
	ECmdGameBatchApplyGuild			= 100903,	//批量申请仙盟
	ECmdGameDealApply			= 100904,	//处理仙盟申请
	ECmdGameGetGuildInfo			= 100905,	//获取仙盟信息
	ECmdGameGetGuildPurposeNoticeNum	= 100906,	//获取修改仙盟公告本周已通知次数
	ECmdGameChangeGuildPurpose		= 100907,	//修改仙盟公告
	ECmdGameGetApplyList			= 100908,	//查看仙盟申请列表
	ECmdGameGetGuildPlayerInfo		= 100909,	//获取仙盟玩家信息
	ECmdGameMemberOper			= 100910,	//成员操作
	ECmdGameDisbandGuild			= 100911,	//解散仙盟
  	ECmdGameOpenWareHouse			= 100915,	//打开仙盟仓库
	ECmdGameDonateEquip			= 100916,	//仙盟仓库-捐献装备 C2S_SDonateEquip
	ECmdGameChangeEquip			= 100917,	//仙盟仓库-兑换装备 C2S_SChangeEquip
	

	ECmdGameGetBeastGodInfo			= 100921,	//获取仙盟兽神信息
	ECmdGameDonateBeastGodFood		= 100922,	//捐献兽粮
	ECmdGameOpenGuildBeastGod		= 100923,	//开启仙盟兽神副本
	ECmdGameDonateMoney			= 100924,	//捐赠金钱 C2S_SDonateMoney S2C_SDonateMoney
	ECmdGameGetGuildLogs			= 100925,	//获取仙盟日志 请求结构:C2S_SGetGuildLogs ，返回结构： S2C_SGetGuildLogs
    ECmdGameGuildDonateFirewood		= 100926,	//捐献仙盟柴火 C2S_SDonateFirewood 和 S2C_SDonateFirewood
    ECmdGameGuildPlayerVeinInfos		= 100927,	//玩家仙盟心法信息推送（登录和更新） S2C_SPlayerGuildVeinInfos
	ECmdGameAllocateWareHouseItem	= 100928,	//仙盟仓库-分配仓库物品 SGuildAllocate
	ECmdGameOpenCreditWareHouse		= 100929,	//打开仙盟积分仓库 NULL

	ECmdGameQueryMail			= 101000,	//查询邮件
	ECmdGameReadMail			= 101001,	//阅读邮件
	ECmdGameBatchMailAttachment		= 101002,	//批量提取附件
	ECmdGameRemoveMail			= 101003,	//删除邮件
	ECmdGameBatchProcessMail		= 101005,	//一键处理邮件（未读和未领取） C2S_SBatchProcessMail 和 S2C_SBatchProcessMail

	ECmdGameGroupCreateGroup		= 101100,	//创建队伍
	ECmdGameGroupApply			= 101101,	//申请入队, 根据 entityId 入队
	ECmdGameGroupApplyEx			= 101102,	//申请入队, 根据 groupId 入队
	ECmdGameGroupInvite			= 101103,	//邀请组队
	ECmdGameGroupAgree			= 101104,	//同意组队
	ECmdGameGroupReject			= 101105,	//拒绝组队
	ECmdGameGroupLeft			= 101106,	//离开队伍
	ECmdGameGroupKickOut			= 101107,	//移除玩家
	ECmdGameGroupModifyCaptain		= 101108,	//移交队长
	ECmdGameGroupModifyGroupTarget		= 101109,	//修改队伍目标
	ECmdGameGroupGetApplyList		= 101110,	//获取申请列表
	ECmdGameGroupSetGroup			= 101111,	//设置队伍
	ECmdGameGroupWorldShow			= 101112,	//世界喊话
	ECmdGameGroupGetNearbyPlayerList	= 101113,	//获取附近玩家列表
	ECmdGameGroupGetGroupList		= 101114,	//获取队伍列表
	ECmdGameGroupGroupMatch			= 101115,	//自动匹配（队伍）
	ECmdGameGroupPlayerMatch		= 101116,	//自动匹配（个人）
	ECmdGameGroupCopyCheckConfirm		= 101117,	//副本进入确认

	ECmdGameGetAchievementOverview		= 101201,	//获取成就总览
	ECmdGameGetAchievementInfos		= 101202,	//获取成就信息
	ECmdGameGetAchievementReward		= 101203,	//获取成就奖励
	ECmdGameGetAchievementCodes		= 101204,	//获取已完成的成就编号 （未领取奖励）
	ECmdGameBatchGetAchievementReward	= 101205,	//一键获取成就奖励

	ECmdGameSwordPoolUpgrade		= 101301,	//剑池升级
	ECmdGameSwordPoolChangeModel		= 101302,	//剑池幻化
	ECmdGameSwordPoolGetActivityReward	= 101303,	//领取活跃度奖励
	ECmdGameSwordPoolNotShow		= 101304,	//剑池屏蔽模型

	ECmdGameStrengthenExWingChangeUseModel	= 100314, //使用翅膀幻化外形 C2S_SChangeWingChangeUseModel 和 S2C_SChangeWingChangeUseModel

	ECmdGameEnableTitle			= 101400,	//启用（佩戴）称号C2S_SEnableTitle
	ECmdGameHideTitle			= 101401,	//隐藏（卸下）称号

	ECmdGameGetToplist			= 101500,	//查看排行

	ECmdGameActiveRechargeDayReturnInfo	= 101550,	//天天返利信息推送（更新）S2C_SRechargeDayReturnInfo
	ECmdGameActiveRechargeDayReturnGetReward    = 101551,	//天天返利领取奖励 C2S_SRechargeDayReturnGetReward
	ECmdGameActivePushPlayerVipGiftPackageInfo = 101552,	//玩家 Vip 礼包信息推送（登录） S2C_SPushPlayerVipGiftPackageInfo
	ECmdGameActivePlayerVipGiftPackageInfoUpdate = 101553,	//玩家 Vip 礼包信息更新 S2C_SPlayerVipGiftPackageInfoUpdate
	ECmdGameActiveBuyVipGiftPackage = 101554,	//购买 Vip 礼包 C2S_SBuyVipGiftPackage

	ECmdGameActiveGetActivityReward = 101555,	//获取活跃点活动奖励 C2S_SGetActivityReward
	ECmdGameActivePushComposeRechargeActiveInfo = 101556,	//累冲返利活动信息推送（登录或更新） S2C_SPushComposeRechargeActiveInfo
	ECmdGameActiveGetComposeRechargeActiveReward = 101557,	//领取累冲返利活动奖励 C2S_SGetComposeRechargeActiveReward
	ECmdGameActiveGetDailyReward = 101558,  //领取连充奖励  C2S_SGetDailyRechargeReward
	ECmdGameActivePushComposeRechargeExActiveInfo = 101559,  //连充返利活动信息推送（登录或更新） SPlayerComposeRechargeExActiveInfo
	ECmdGameActiveGetComposeRechargeExActiveReward = 101560,  //领取连充返利活动奖励 C2S_SGetComposeRechargeExActiveReward

	ECmdGameActiveGetDeityBookInfo		= 101600,	//获取天书信息返回
	ECmdGameActiveGetDeityBookTargetReward	= 101601,	//领取天书目标奖励
	ECmdGameActiveGetDeityBookPageReward	= 101602,	//领取天书奖励

	ECmdGameUpdateGameBossInfo			= 101603,		//请求更新Boss信息
	ECmdGameGetNewExperienceExp			= 101604,		//领取经验副本奖励
    ECmdGameSkillUpgradeOneKey			= 101610,		//一键升级技能 C2S_SSkillUpgradeOneKey
	ECmdGameSkillUpgradeAll				= 101611,		//全部升级 C2S_SSkillUpgradeAll

	ECmdGameUpgradRoleState				= 101615,		//转生 		NULL
	ECmdGameUseRoleExp					= 101616,		//降级（获取修为）		NULL

	ECmdGameActivateSevenDayMagicWeapon	= 100617,	//激活七天法宝	C2S_SActivateSevenDayMagicWeapon
	ECmdGameSevenDayMagicWeapon			= 100618,	//返回七天法宝	C2S_SPushSevenDayMagicWeapon S2C_SSevenDayMagicWeapon

    ECmdGameRoleInfo					= 101620,		//多角色信息 S2C_SRoleInfo

	ECmdGameActiveGodPiece				= 101621,		//激活神器碎片 S2C_SActiveGodPiece
	ECmdGameActiveGodWeapon				= 101622,		//激活神器 S2C_SActiveGodWeapon
	ECmdGameGodWeaponInfo				= 101623,		//神器信息 S2C_SGodWeaponInfo[Role.proto]

	ECmdGameTalentSkillReset			= 101624,		// 天赋技能点重置 C2S_TalentSkillPointReset
	ECmdGameCultivateActive				= 101625,		//养成系统部位激活（升级)  SCultivateInfo
	ECmdGameCultivateInfo				= 101626,		//养成系统信息 S2C_SCultivateInfo
	ECmdGameImmortalsCmd				= 101627,		//神兵系统操作指令	C2S_SImmortalsCmd
	ECmdGameCultivateActiveRet			= 101628,		// 养成系统部位激活（升级) 返回 S2C_SCultivateActiveRet[Role.proto]
	ECmdGameTalentSkillUpgrade			= 101629,		// 天赋技能升级 C2S_TalentSkillUpgrade

	ECmdGameKingStifeMatch				= 101630,		//王者争霸匹配
	ECmdGameEnterKingStifeCopy			= 101631,		//进入王者争霸
	ECmdGameGetKingStifeRank			= 101632,		//获得王者争霸排行 Message::Public::SInt    [Message/Public/CdlPublic.cdl] valua:0 现在排行， 1：上期排行
	ECmdGameRefreshCopyDescNum			= 101634,		//请求刷新副本恢复次数
	ECmdGameGetRechargeFirstReward		= 101635,		//请求领取首充奖励

	ECmdGameLotteryRecord				= 101651,		//获取寻宝记录  C2S_SLotteryRecord  S2C_SLotteryRecord[Operation.proto]
	ECmdGameLottery						= 101652,		//寻宝 C2S_SLottery  S2C_SLottery[Operation.proto]
	ECmdGameLotteryInfo					= 101653,		//寻宝信息 S2C_SLotteryInfo[Operation.proto]
	ECmdGameGetLotteryWeekReward		= 101654,		//领取周累计次数奖励 C2S_SGetLotteryReward[Operation.proto]


    ECmdGameOfflineWorkShowReward		= 101650,		//离线挂机奖励
    ECmdGameGetVipLevelGift				= 101655,		//获取vip等级礼包 Message::Public::SInt    [Message/Public/CdlPublic.cdl]value: 等级
    ECmdGameGetPlayerPrivilegeCardReward = 101658,		//领取特权月卡奖励
	ECmdGameGetRuneCopyReward = 101660,	//领取诛仙塔每日奖励 NULL C2S领取,S2C表示可领取
	ECmdGameRuneCopyReward = 101661,	//诛仙塔每日奖励 ::Message::Public::SSeqReward [Message/Public/GamePublic.cdl]
	ECmdGameRuneCopyRewardForShow = 101662,	//诛仙塔每日奖励展示 C2S - NULL   S2C - ::Message::Public::SSeqReward [Message/Public/GamePublic.cdl]
	ECmdGameGetShareReward = 101663,	//领取分享奖励 Message::Public::SInt    [Message/Public/CdlPublic.cdl]
	ECmdGameShareRewardInfo = 101664,	//分享奖励领取信息 S2C_SShareRewardInfo    [Player.proto]
    ECmdGameEncounterChallenge			= 101665,		//遭遇战 挑战   C2S ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
	ECmdGameGetEncounterInfo			= 101666,		//获取遭遇战信息 C2S - NULL   S2C - ::Message::Public::SEncounterInfo [Message/Public/GamePublicEx.cdl]
    ECmdGameGetEncounterRank			= 101667,		//获取遭遇战排名 C2S - NULL   S2C - ::Message::Public::SeqEncounterRank [Message/Public/GamePublicEx.cdl]
    ECmdGameEncounterClearPk 			= 101668,		//遭遇战 清除pk值 C2S Message::Public::SInt    [Message/Public/CdlPublic.cdl] value: 花费元宝
	ECmdGameCheckFashionEndDt			= 101680,		//时装--请求检测时装时效
    ECmdGameEnterMiningCopy				= 101681,		//挖矿--进入挖矿副本	   C2S_SEnterMiningCopy
	ECmdGameEnterMiningChallengeCopy	= 101682,		//挖矿--进入挖矿挑战副本   C2S_SEnterMiningChallengeCopy
	ECmdGameOperateMining				= 101683,		//挖矿--开始挖矿 		Message::Public::SInt    [Message/Public/CdlPublic.cdl
	ECmdGameOperateUpgradeMining		= 101684,		//挖矿--提升挖矿品质 	Message::Public::SInt    [Message/Public/CdlPublic.cdl value: 0 ：花费元宝  1：使用道具
	ECmdGameOperateComleteMining		= 101685,		//挖矿--快速完成挖矿
	ECmdGameOperateGetMiningReward		= 101686,		//挖矿--领取挖矿奖励 	Message::Public::SInt    [Message/Public/CdlPublic.cdl value: 1 双倍
	ECmdGameOperateGetMiningRecord		= 101687,		//挖矿--获取挖矿记录
	ECmdGameModifyRoleName              = 101688,       //改名

	ECmdGameCopyEnterMgNewGuildWar		= 101690,		//新仙盟战-- 进入仙盟战 C2S_SEnterMgNewGuildWar
	ECmdGameCopyGetMgNewGuildScoreReward= 101691,		//新仙盟战-- 领取目标积分奖励 Message::Public::SInt    [Message/Public/CdlPublic.cdl
	ECmdGameCopyGetMgNewGuildRank		= 101692,		//新仙盟战-- 获取积分排行 Message::Public::SInt    [Message/Public/CdlPublic.cdl  0 : 帮会排行榜， 1：个人排行榜
	ECmdGameCopyStartMgNewGuildCollect	= 101693,		//新仙盟战-- 开始采集
	ECmdGameCopyGetMgNewGuildDailyReward= 101694,		//新仙盟战-- 领取每日奖励

	ECmdGameLotteryRuneCopy				= 101700,		//诛仙塔转盘 C2S - Message::Public::SInt [Message/Public/CdlPublic.cdl] value: lottery type  S2C - S2C_SRuneCopyLottery
	ECmdGameLotteryRuneCopyInfo			= 101701,		//诛仙塔转盘 S2C - S2C_SRuneCopyLotteryInfo
	ECmdGameGetSpiritReward             = 101702,       //领取法宝副本奖励 C2S - Message::Public::SInt [Message/Public/CdlPublic.cdl] 值为1,2,3对应3中奖励
	ECmdGameDelegateSpirit              = 101703,       //扫荡法宝副本 C2S_SStartDelegateNew
	ECmdGameDefenseCopyRefreshLuckyBoss	= 101704,		//守卫神剑--刷新幸运boss
	ECmdGameEnterQiongCangCopy          = 101706,       //进入穹苍幻境  C2S - SEnterQiongCangDreamland
	ECmdGameGetQiongCangCopyReward      = 101707,       //领取穹苍幻境奖励 NULL

	ECmdGameGetOnlineTime				= 101710,       //获取在线时间 NULL   S2C - ECmdGateTodayOnlineTime
	ECmdGameGetOnlineReward				= 101711,       //获取在线奖励  C2S_SGetOnlineReward  S2C - ECmdGateOnlineReward

    ECmdGameCopyGetPeakArenaInfo		= 101720,		//获取戴峰赛季赛况
	ECmdGameCopyGetPeakArenaRecord		= 101721,		//获取戴峰赛季比赛记录 C2S_SGetPeakArenaRecord
	ECmdGameCopyGetPeakArenaBetRecord	= 101722,		//获取戴峰赛季下注赛况
	ECmdGameCopyGetPeakArenaOwnRecord	= 101723,		//获取戴峰赛季海选自己记录 SInt state
	ECmdGameCopyGetPeakArenaPopularityRank = 101724,	//获取戴峰赛季人气排行
	ECmdGameCopyGetPeakArenaSignUp		= 101725,		//戴峰赛季报名
	ECmdGameCopyGetPeakArenaWorship		= 101726,		//戴峰赛季膜拜 Message::Public::SEntityId cdl]
	ECmdGameCopyGetPeakArenaLike		= 101727,		//戴峰赛季点赞 Message::Public::SEntityId cdl]
    ECmdGameCopyGetPeakArenaBet			= 101728,		//戴峰赛季下注 Message::Public::SEntityId [Message/Public/GamePublicEx.cdl]

	ECmdGameGetInvestActiveReward       = 101730,       //领取投资活动奖励 C2S_SGetInvestActiveReward
	ECmdGameCopyRefreshNewWorldBoss		= 101731,		//刷新野外boss  SRefreshNewWorldBoss
	
	ECmdGameSmeltTalentEquip = 100129,	// 天赋装备合成 C2S_SSmeltTalentEquip
	ECmdGameSmeltTalentEquipRet = 100130,	// 天赋装备合成返回 S2C_SSmeltTalentEquipRet 

	ECmdGameClientShowStateInfo	= 101734, //客户端显示状态（服务器客户端两用 SClientShowStateInfo）

	ECmdGameBeastEquipDress		    = 101740,		//穿戴神兽装备 C2S_SBeastEquipDress
	ECmdGameBeastEquipUndress	    = 101741,		//卸下神兽装备 C2S_SBeastEquipUndress
	ECmdGameBeastEquipUndressAll	    = 101742,		//一键卸下神兽装备 C2S_SBeastEquipUndressAll
	ECmdGameBeastBeckon		    = 101743,		//神兽助战 C2S_SBeastBeckon
	ECmdGameBeastRecall		    = 101744,		//神兽召回 C2S_SBeastRecall
	ECmdGameBeastAddMaxBeckonNum	    = 101745,		//增加助战上限 C2S_SAddMaxBeckonNum 和 S2C_SAddMaxBeckonNum
	ECmdGameBeastEquipStrengthen	    = 101746,		//强化神兽装备 C2S_SBeastEquipStrengthen 和 S2C_SBeastEquipStrengthen
	ECmdGameBeastEquipDecompose	    = 101747,		//神兽装备分解 C2S_SBeastEquipDecompose
	ECmdGameAcceptLevelRoleExp          = 101755,   //领取等级修为 成功服务器返回对应消息
  	ECmdGameAcceptCheckPointRoleExp        = 101756,    //领取关卡修为 成功服务器返回对应消息
	ECmdGameRoleExpAcceptInfo          = 101757,    //服务器登陆推送  等级修为 关卡修为领取信息 S2C_SRoleExpAcceptInfo
	ECmdGameEnterGuildBossIntruderCross = 101760,		//进入神兽入侵副本 C2S_SEnterGuildBossIntruderCross
	ECmdGamePlayerGuildBossIntruderInfo = 101761,		//玩家神兽入侵副本信息 SSeqInt
	ECmdGameGetCachedDropLogMsgs	    = 101762,		//获取游戏缓存掉落日志,	C2S_SGetCachedDropLogMsgs 和 S2C_SGetCachedDropLogMsgs
	ECmdGameNewDropLogNotice	    = 101763,		//新掉落日志通知 SInt 

	ECmdGameRoleExp 				= 101765,	//修为  S2C_SRoleExp

	ECmdGameMgGuildDefenseEnter	    = 101766,		//进入守卫仙盟（仙盟灯会）副本
	ECmdGamePrivilegeCardMultiSetting   = 101767,  // 特权月卡双倍收益设置 Message::Public::SPrivilegeCardMultiSetting
	ECmdGamePrivilegeCardMultiSettingRetSuccess   = 101768,  // 特权月卡双倍收益设置成功返回 Message::Public::SPrivilegeCardMultiSetting
	ECmdGamePrivilegeCardMultiSettingInfo  = 101769,  // 登录服务器推送月卡双倍收益设置信息 Message::Public::SeqPrivilegeCardMultiSetting
	
	ECmdGamePlayerPopMultiRoles		= 100408,// 显示多角色tips
}