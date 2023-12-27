enum PanelTabType {
	/**技能模块 */
	Skill = 1,//技能
	InnerPower,//内功
	Nerve,//经脉
	SkillCheats,//秘籍

	/**角色模块 */
	Player,//角色
	RoleState,//转生
	UniqueSkill,//必杀

	/**背包模块 */
	PackEquip,//装备背包
	PackProp,//道具背包
	PackRune,//符文背包
	PackSmelt, //合成背包

	/**外观/外形模块 */
	Pet,//宠物
	Mount,//坐骑
	Wing,//翅膀

	/**宠物幻形 */
	PetChange,//宠物幻形

	RechargeFirstTips,//首充

	/**神装 */
	GodEquip,//神装
	Shura,//修罗

	/**符文 */
	RuneInlay,//符文镶嵌
	RuneDecompose,//符文分解
	
	/**竞技场 */
	KingBattle,//王者争霸
	Encounter,//遭遇战
	Mining,//挖矿
	GamePlay,//玩法

	/**副本 */
	CopyHallMaterial, //材料副本
	CopyHallDaily,//日常副本
	CopyHallTower, //诛仙塔
	CopyHallLegend, //传奇之路
	CopyDefend, //守护神剑
	Team2, //跨服组队

	/**跨服聊天 */
	ChatCross,
	/**炼器 */
	Strengthen,//强化
	Refine,//精炼
	Casting,//铸造
	Immortals,//神兵
	MagicLaw,//法阵

	/**Boss */
	PersonalBoss,//个人boss
	WorldBoss,//野外boss
	SecretBoss,//秘境boss
	darkSecret,//暗之秘境boss
	BossHome,//Boss之家
	GodBoss,//神域boss

	/**充值 */
	RechargeFirst,

	/**法器 */
	DragonSoul,//龙鳞甲
	HeartMethod,//心法
	ColorStone,//五色石
	BeastBattle,//神兽助战


	ShapeBattle,//战阵
	ShapeSwordPool,//剑池

	//运营礼包
	Focus,//关注
	Share,//分享,邀请
	//Certification,//实名认证
	SaveDesktop,//保存桌面
	MiniClient,//微端

	
	/**传世装备 */
	AncientEquip,

	//历练
	TrainGodWeapon, //神器
	TrainNobility, //爵位
	TrainDaily, //日常
	TrainMedal, //勋章
	TrainIllustrate, //图鉴
	//神羽
	GodWingEquip, //装备
	GodWingCompose,//合成
	GodWingTransform,//转换


	/**新的仙盟 行会 */
	GuildNewBasics, //基础
	GuildNewManager, //管理
	GuildNewMember, //成员
	GuildNewList, //列表

	/**商城 */
	ShopMystery,//神秘商店
	ShopProp,//道具商店

	/**好友 */
	FriendContact,//最近联系人
	Friend,//好友
	FriendApply,//好友申请
	FriendShield,//好友屏蔽
	FriendMail,//邮件

	/**寻宝 */
	LotteryEquip,//装备寻宝
	LotteryRune,//符文寻宝
	LotteryAncient,//混元寻宝

	/**VIP礼包 */
	VipActive,//vip已激活面板
	VipGiftPackage,//vip礼包

	/**活动 */
	//命名规则和ESpecialConditonType服务端定义的枚举一样
	ESpecialConditionTypePreferentialGift,//特惠礼包
	ESpecialConditionTypePreferentialGiftNormal,//特惠礼包（暖冬福利活动）
	ESpecialConditionTypeNewServerLimitBuy,//开服限购
	ESpecialConditonTypeMgRecharge,//累计充值
	ESpecialConditonTypeRechargeCondDayCount,//连续充值
	ESpecialConditonTypeRechargeDayReturn,//天天返利（独立活动协议）
	// ESpecialConditonTypeBossTask,//全民boss（原天书寻主）
	ESpecialConditonTypeRechargeToday,//每日累充(独立活动协议)
	ESpecialConditonTypeToplistActiveOpen,//冲榜排名
	ESpecialConditonTypeReachGoal,//冲榜达标
	ESpecialConditionTypeLevelReward,//冲级豪礼
	ESPecialConditionTypeParadiesLost,//双生乐园副本
	ESpecialConditionTypeBossScore,//积分兑换
	ESpecialConditionTypeSpiritSports,//法宝竞技
	ESpecialConditonTypeComposeRecharge,//累充返利（每日、7天混合充值活动）
	ESpecialConditionTypeMgNewGuildWar,//仙盟争霸
	ESpecialConditionTypeInvestPlan,//投资计划
	ESpecialConditionTypeRechargeGroup,//团购
	ESpecialConditonTypeComposeRechargeEx,//连充返利（3月初节日活动）
	ESpecialConditonTypeBossExtraDrop,//Boss献礼

    /**福利新版 */
	SignIn,//签到
	LoginReward,//登陆奖励
    GoldCard,//元宝月卡
    PrivilegeCard,//特权月卡
    ExCdKey,//激活码
	Notice,//公告
	OnlineReward,//在线奖励

	/**时装 */
	FashionTitle,//称号
	FashionClothes,//角色
	FashionWeapon,//武器
	FashionWing,//翅膀

    /**仙盟活动 */
    GuildVein,//心法
    GuildBonfire,//篝火

	/**仙盟副本 */
	GuildTeam,//仙盟组队副本

    /**跨服玩法 */
    CrossBoss,//跨服BOSS-单服
    CrossBossCross,//跨服BOSS-跨服
	CrossBossGuild,//跨服 仙盟抢boss
	CrossDropLog,//跨服 掉落记录
	CrossEntrance,//跨服玩法入口
	Qualifying,//3V3

	/**法器升星 */
	MagicWeaponStarUp,
	MagicWeaponCopy,

	/**穹苍系统 */
	QiongCangBoss,
	QiongCangCopy,
	QCSmelt, //天赋圣物合成
	TalentCultivate,//天赋培养

    /**巅峰玩法 */
    PeakMain,//巅峰赛季
    PeakReward,//巅峰奖励
    PeakShop,//巅峰商城
    PeakChipsShop,//筹码商城
    PeakWorship,//巅峰膜拜

    /**1VN玩法 */
    ContestQualification,//资格赛
    ContestMain,//擂台赛
    ContestReward,//奖励
	ContestShop,//商城
	ContestExchange,//兑换

    /**3V3玩法 */
    QualifyingMain,//主界面
    QualifyingRank,//排行
    QualifyingStandard,//达标
    QualifyingStage,//段位

	/**法阵幻形 */
	MagicArrayChange,
	

	MagicWeaponChange,//法宝幻形

	ShapeBattleChange,//法阵幻形

	SwordPoolChange,//剑池幻形

	MountChange,//坐骑幻形

	BossComing,//boss来袭（非页签，用于功能开启统一判断）
	ActivityLimitRecharge,//限时充值

	MagicWingChange,//翅膀幻形
}