/**
 * 与服务器推送事件相关自定义枚举。
 * 如果直接使用服务器推送本身的消息，枚举还是使用EGateCommand、EPublicCommand
 * id从60000开始
 */
enum NetEventEnum {
    roleSexChanged = 60000,
    roleCampChanged,
    roleNameChanged,
    roleCareerChanged,
    roleStateChanged,//转数改变
    roleAvatarChanged,
    roleLevelUpdate,
    roleExpUpdate,
    roleExpAdd,
    roleLifeUpdate,
    roleLifeAdd,//主角血量增加
    roleMaxLifeUpdate,
    roleManaUpdate,
    roleMaxManaUpdate,
    roleFightModel,
    roleDropOwner, //掉落归属
    /**战斗力 */
    roleCombatCapabilitiesUpdate,
    roleCombatCapabilitiesAdd,
    /**人物技能列表更新 */
    roleSkillListUpdated,
    /**人物技能单个更新 */
    roleSkillUpdated,
    /**人物技能信息 */
    roleSkillInfo,
    /**人物技能单个增加 */
    roleSkillAdded,
    /**境界等级更新 */
    roleRealmUpdateed,
    /**仙盟名字更新 : index*/
    roleGuildNameUpdated,
    roleTrainScoreUpdated,//历练值更新
    roleIllustrateExpUpdated,//图鉴经验更新
    // /**自己实体更新(包括副角色) */
    entityInfoMyselfUpdate,
    entityInfoUpdate,
    entityAvatarUpdate,//外观更新
    entityNotShowUpdate,//外观是否显示更新
    entityBuffUpdate,//场景实体buff显示更新
    propertyUpgrade,//属性提升
    // entityMountUpdate,//坐骑更新
    // entityLawUpdate,//法阵更新
    // entitySpiritUpdate,//更新法宝
    /**主角佩戴称号更新 */
    RoleTitleUpdate,
    RoleForceUpdate,//主角势力更新
    RoleBuffUpdate,//角色buff更新

    /**死亡/复活 */
    kingDie,
    kingRelived,

    //=====金钱======
    moneyCoinBindUpdate,
    moneyGoldUpdate,
    moneyGoldBindUpdate,
    moneyRuneExp,//符文经验
    moneyRuneCoin,//符文碎片
    moneyRuneCrystal,//符文水晶
    moneyHonourUpdate,//荣誉
    moneyHallowEquip,//装备强化石
    moneyRoleStateExp,//修为
    moneyKillFragmentJunior,//初级必杀碎片精华
    moneyKillFragmentSenior,//高级必杀碎片精华
    moneyTalentExp,//天赋经验
    moneyJeton,//筹码
    moneyBeastEquipExp,//神兽强化经验
    moneyFightingSpirit,//斗魂货币
    moenyAdd,

    //=====背包======
    packPosTypeBagChange,
    packPosTypeRoleChange,
    packPosTypeWarehouseChange,
    packPosTypeLotteryChange,
    packPosTypeLotteryRuneChange,
    packPosTypeLotteryAncientChange,
    packPosTypeDelegateChange,
    packPosTypeRuneChange,
    packPosTypeSoulChange,
    packPosTypeBeastChange,
    packPosTypeShapeEquipChange,
    packPosTypeBagCapacityChange,
    packPosTypeRoleCapacityChange,
    packPosTypeWarehouseCapacityChange,
    packPosTypePropChange,
    packBagColdTimeIndexChange,
    packBackAddItem,
    packBackTaskItemChange,
    packBackBagUpdateItem,
    packBackBeastUpdateItem,
    packBackTidySuccess,
    packBackPackItemsChange,
    packRolePackItemsChange,
    roleCombatCapabilitiesChanged,
    /**物品使用次数更新 */
    ItemUsedCountUpdate,

    //副本    
    copyProcess, //副本击杀进度
    copySuccess, //副本成功
    copyFail, //副本失败
    copyInfUpdate, //副本信息更新;
    copyEnter, //成功进入副本
    copyLeft, //成功推出副本
    copyDelegateResult, //扫荡结果返回
    copyEnterCheckPoint, //进入了关卡副本
    copyLeftCheckPoint, //进入了关卡副本
    copyTowerLotteryInfo, //诛仙塔抽奖信息更新
    copyDfSkillCDUpd,//守护神剑技能cd更新
    pickUpHeartMethond,
    //boss
    BossListInfUpdate, //boss列表信息更新
    BossInfUpdate, //boss单个信息更新
    BossComingInfoUpdate, //boss来袭单个信息更新
    BossInfTireValue, //疲劳值
    // BossOwnerEntityUpdate,//boss归属者实体属性更新
    EntityLifeUpdate,//实体血量更新
    BossOwnerChange,//boss掉落归属改变
    BossRewardResult,//boss副本结算
    BossLifeShieldChange,//boss护盾,信息更新 是否是
    BossHurtListUpdate,//伤害列表更新
    TimelimitBossUpate,//限时世界boss活动信息更新
    TimeLimitBossBuffUpdate,//世界boss活动buff加成更新
    //阵地争夺
    PositionOccupyInfosUpdate,//阵地争夺占领信息更新
    MyOccupyInfoUpdate,//自己占领信息更新
    ExpPositionRankListUpdate,//阵地争夺排名更新
    //阵营战
    BattleObjLifeUpdate,//正在攻击的目标血量更新
    CampBattleScoreListUpdate,//阵营战积分列表更新
    CampBattleScoreRewardUpdate,//积分奖励领取状态更新
    //仙盟争霸
    GuildScoreRankUpdate,//仙盟积分排名更新
    PlayerScoreRankUpdate,//玩家积分排名更新
    GuildBattleScoreRewardUpdate,//积分奖励领取状态更新
    MyGuildScoreUpdate,//自己仙盟积分更新
    GuildBattleMyScoreUpdate,//仙盟争霸自己积分更新
    GuildBattleScoreUpdate,//仙盟争霸战功更新
    GuildBattleCollectInfoUpdate,//仙盟争霸采集信息更新
    GuildBattleCollectShieldUpdate,//仙盟争霸采集护盾更新
    GuildBattleMemberPositionUpdate,//仙盟争霸中仙盟成员信息更新
    //聊天
    ChatHomeMsgUpdate, //更新主界面的缩略图消息显示

    /**组队 */
    /**匹配状态发送变化 */
    TeamMatchChange,
    /**队员信息更新 */
    TeamMemberUpdate,
    /**队伍信息更新 */
    TeamInfoUpdate,
    /**队伍队长更改 */
    TeamCaptainChange,

    /**剑池经验增加 */
    SwordPoolExpAdd,

    //===============必杀===============
    /**符文镶嵌升级更新 */
    RuneInlayUpdate,

    /**仙盟 */
    GuildScoreWarehouseItemUpdate,
    GuildScoreWarehouseRecordUpdate,

    /**关卡 */
    /**关卡信息更新 */
    CheckPointInfoUpdate,
    /**关卡杀怪数量更新 */
    CheckPointKillsUpdate,

    /**攻击玩家的实体列表更新 */
    FightEntitysUpdate,
    /**可攻击的玩家列表更新 */
    CanAttackPlayersUpdate,
    /**仇恨列表更新（击杀过我的玩家列表） */
    MurdererListUpdate,
    /**玩家属性强化提升了 */
    PlayerStrengthenExUpgraded,
    /**登录推送强化系统消息 */
    PlayerStrengthenExLoginInfo,
    /**玩家属性强化更新 */
    PlayerStrengthenExUpdated,
    /**玩家属性强化激活 */
    PlayerStrengthenExActived,

    /*****************竞技场****************/
    KingBattleMatchUpdate,//匹配结果更新

    /**断开连接 */
    SocketClose,
    /**xp技能冷却 */
    SkillXpCooldown,


    //===============养成系统===============
    CultivateInfoUpdateKill,
    CultivateInfoUpdateStrengExAccessory,
    CultivateInfoUpdateIllustrated,
    CultivateInfoUpdateImmortal,//神兵
	CultivateInfoUpdateAncientEquip,//传世装备
    CultivateInfoUpdateHeartMethod,
    CultivateInfoActiveHeartMethod,
    CultivateFightUpdate,//系统战力更新
    CultivateInfoUpdateTalent,//天赋培养系统

    //===============必杀===============
    /**必杀碎片分解成功 */
    KillDecomposeSuccess,
    //===============广播===============
    LotteryBroadcastUpdate,//寻宝广播更新
    //===============活动===============
    //活动列表更新
    ActivityInfoListUpdate,
    //活动领奖信息更新
    ActivityRewardInfoUpdate,
    
    /**开服、合服时间更新 */
    OpenServerDateUpdate,
    /**今日在线时长更新 */
    OnlineTimeTodayUpdate,
    /**查看玩家更新*/
    LookUpPlayerUpdate,

    //==============福利===============
    OnlineDaysUpdate,//在线天数更新

    //==============七天法宝===============
    SevenDayMagicWeaponUpdate,//七天法宝数据更新

    //==============跨服BOSS===============
    CrossBossCollectTimesUpdate,//采集次数
    CrossBossOwnTimesUpdate,//归属次数
    /**穹苍boss */
    QiongCangBossOwnerTimesUpdate,//剩余归属次数更新

    //===============合成===============
    /**限制合成数量更新 */
    ComposeLimitUpdate,
    /**战斗模式更新 */
    FightModeUpdated,

    //青云之巅
    CrossStairRankInfoUpdate,//排行榜信息更新
    CrossStairInfoUpdate,//通关层数、领奖信息更新
    CrossStairFloorRewardSuccess,//通关层数奖励领取成功

    //1VN
    ContestResult,//挑战结果
}