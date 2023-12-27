/**
 * 扩展UI组件管理
 */
class UIExtensionManager {
	public static WXIPhoneXtop: number = 44;
	public static WXIPhoneXbottom: number = 34;

	/**
	 * 所有扩展组件
	 */
	private static extensions: any = {
		[PackNameEnum.Common]: [
			["TimerButton", TimerButton],
			["BaseItem", BaseItem],
			["IconButton", IconButton],
			["NumberInput", NumberInput],
			["GuideTip", GuideTip],
			// ["Slider", Slider],
			["ModuleTopPanel", ModuleTopPanel],
			["ModuleTopPanel2", ModuleTopPanel2],
			["MainSkillItem", MainSkillItem],
			["SkillItem", BaseSkillItem],
			// ["GCheckBox", GCheckBox],
			["TabButtonTop", TabButtonTop],
			["TabButtonOne", TabButtonOne],
			// ["TxtOpt", TxtOpt],
			["EquipStoneAttr", EquipStoneAttr],
			// ["EquipStoneAttrItem", EquipStoneAttrItem],
			["ToolTipShop", ToolTipShop],
			["UIProgressBar", UIProgressBar],
			["RoleItem", RoleItem],
			["RoleItemPanel", RoleItemPanel],
			["ToolTipEquipAttrItem", ToolTipEquipAttrItem],
			["FightPanel", FightPanel],
			["StrengthenExAttrItem", StrengthenExAttrItem],
			["TabButtonItem", TabButtonItem],
			["StarItem", StarItem],
			["TipRollItem", TipRollItem],
			["MoneyIco", MoneyIco],
			["MainIconButton", MainIconButton],
			["ChangePropSkillItem", ChangePropSkillItem],
			["ShapeEquipItem", ShapeEquipItem],
			["ShapeReplaceItem", ShapeReplaceItem],
			["ProgressBar1", ProgressBar1],
			["RuneItem", RuneItem],
			["WarehouseExchangeCom",WarehouseExchangeCom],
			["LegendStrategyItem", LegendStrategyItem],
			["PrivilegeSetBtn",PrivilegeSetBtn]
			
		],
		[PackNameEnum.Login]: [
			["ServerInterval", ServerInterval],
			["ServerItem", ServerItem],
		],
		[PackNameEnum.Scene]: [
			["BattleSkillNameItem", BattleSkillNameItem],
			["SkillTalkItem", SkillTalkItem],
			["SceneCollectBarView", SceneCollectBarView]

		],
		[PackNameEnum.FightPlayers]: [
			["RpgFightPlayerItem", RpgFightPlayerItem],
			["PlayerInfoBarView", PlayerInfoBarView],
			["MurdererListView",MurdererListView],
			["AttackTargetView",AttackTargetView]
		],
		[PackNameEnum.Home]: [
			["TaskTracePanel", TaskTracePanel],
			// ["BuffItem", BuffItem],
			// ["BattlePanel", BattlePanel],
			// ["NumberInput", NumberInput],
			// ["FunctionForecast", FunctionForecast],
			// ["FightModeChoose", FightModeChoose],
			//["HomeChatMsgItem", HomeChatMsgItem],
			["VipBubble", VipBubble],
			["TeamIconBar", TeamIconBar],
			["ExamIconBar", ExamIconBar],
			// ["TeamMemberIcon", TeamMemberIconItem],
			// ["AchievementReach", AchievementReachView],
			["OpenServerActiveItem", OpenServerActiveItem],
			["SkillOpen", SkillOpenItem],
			["HomeTopPanel", HomeTopPanel],
			["BossComingIcon",BossComingIcon],
			["HomeBottomIconBar",HomeBottomIconBar],
            ["LoginRewardIcon", LoginRewardIcon],
			["HomeMapIcon", HomeMapIcon],
			["HomeFriendIcon", HomeFriendIcon],
			["MonthCardExpCom", MonthCardExpCom],
		],

		[PackNameEnum.HomeChat]: [			
			["HomeChatMsgItem", HomeChatMsgItem],		
		],
		
		[PackNameEnum.BattlePanel]: [
			// ["Joystick", JoyStick]
		],

		[PackNameEnum.Pack]: [
			["PackGiftItem", PackGiftItem],
			["SmeltCateItem", SmeltCateItem],
			["SmeltMaterialsItem", SmeltMaterialsItem],
			["SmeltTypeItem", SmeltTypeItem],
			["SmeltTypeShowItem", SmeltTypeShowItem],
		],

		[PackNameEnum.Navbar]: [
			["CircleProgressBar", CircleProgressBar],
			["LifeBall", LifeBall],
			["MainIconButton", MainIconButton],
            ["UIProgressBar", UIProgressBar],
		],

		[PackNameEnum.Player]: [
			["PlayerReplaceItem", PlayerReplaceItem],
		],

		[PackNameEnum.GuildNewCreate]: [
			["GuildNewCreatItem", GuildNewCreatItem],
			["GuildNewDonateItem", GuildNewDonateItem],
			["GuildNewSearchItem", GuildNewSearchItem],

		],

		[PackNameEnum.GuildNewManager]: [
			["GuildNewManageLogItem", GuildNewManageLogItem],
		],

		[PackNameEnum.GuildNewBasics]: [
			["GuildNewBasicsMemberItem", GuildNewBasicsMemberItem],
			["GuildNewAplyItem", GuildNewAplyItem],
		],

		[PackNameEnum.GuildNewMember]: [
			["GuildNewMemberItem", GuildNewMemberItem],
			["GuildNewListPanelItem", GuildNewListPanelItem],
		],
		[PackNameEnum.Reincarnation]: [
			["ReincarnationAttrItem", ReincarnationAttrItem],
			["ReincarnationAttrItemNow", ReincarnationAttrItemNow],
			["ReincarnationItem", RoleStateExchangeItem],
			["ReincarnationOpenItem",ReincarnationOpenItem]
		],

		[PackNameEnum.Skill]: [
			["SkillListItem", SkillListItem],
			["SkillListMenuItem", SkillListMenuItem],
			["CurrentAttrItem", NerveAttrNowItem],
			["NextAttrItem", NerveAttrNextItem],
		],

		[PackNameEnum.Task]: [
			["TaskListItem", TaskListItem]
		],

		[PackNameEnum.TimeLimitTask]: [
			["TimeLimitTaskItem", TimeLimitTaskItem]
		],

		[PackNameEnum.Fashion]: [
			["FashionItem", FashionItem]
		],

		[PackNameEnum.Copy]: [
			//["TowerCopyItem", TowerCopyItem],
			//["RuneCopyItem", RuneCopyItem],
			["BossInformation", BossInformation],
			["StarListItem", StarListItem],
			["HurtRankItemView", HurtRankItemView],
			["CampBattleRankItem", CampBattleRankItem],
			["CampBattleRankRewardItem", CampBattleRankRewardItem],
			["CampBattleScoreRewardItem", CampBattleScoreRewardItem],
			["GuildBattleMemberItem", GuildBattleMemberItem],
			["TowerOpenItem", TowerOpenItem],
			["GuildBattleCollectBarView", GuildBattleCollectBarView],
			["LegendBossHeadItem", LegendBossHeadItem],
			["GuildTeamCopyBossItem",GuildTeamCopyBossItem],
			["CrossStairRewardItem",CrossStairRewardItem],
			["CrossStairRankItem",CrossStairRankItem],
			["MiningCopyFloorItem",MiningCopyFloorItem],

		],
		[PackNameEnum.Copy2]: [
			["ExpPositionItemView", ExpPositionItemView],
			["DefendSkillItem", DefendSkillItem],
			["RoleStatusItem", RoleStatusItem],
			["ExpPositionResultItem", ExpPositionResultItem],
			["ExpPositionRankItemView",ExpPositionRankItemView],			
			["ExpPositionRankItemMini",ExpPositionRankItemMini],
			["GuildDefendItem",GuildDefendItem],
			["GuildDefendAtkItem",GuildDefendAtkItem],
			["GuildDefendRankItem",GuildDefendRankItem]
		],
		[PackNameEnum.CopyResult]: [
			["CampBattleResultItem", CampBattleResultItem],
			["ResultHeadItem", ResultHeadItem],
			["GuildDenfendResultItem", GuildDenfendResultItem],
		],
		[PackNameEnum.CopyHall]: [
			["CopyItem", CopyItem]
		],
		[PackNameEnum.CopyDaily]: [
			["DailyCopyItem", DailyCopyItem],
			["ExpReceiveWinItem", ExpReceiveWinItem],
			//["ExpMultipleItem", ExpMultipleItem],
			//["CopyDefendLogItem", CopyDefendLogItem],
		],
		[PackNameEnum.CopyTower]: [
			["RuneCopyItem", RuneCopyItem],
			["TowerRankItem", TowerRankItem],
			["TowerRankWinItem", TowerRankWinItem],
			["TowerRewardItem", TowerRewardItem]
		],
		[PackNameEnum.CopyLengend]: [
            ["LegendCopyItem", LegendCopyItem]
		],
		[PackNameEnum.CopyQualifying]: [
            ["QualifyingHeadItem", QualifyingHeadItem],
            ["HomeCollectBarView", HomeCollectBarView]
		],

		[PackNameEnum.Shape]: [
			["ShapeChangeItem", ShapeChangeItem],
			["ShapeSkillItem", ShapeSkillItem],
			["ShapeDrugItem", ShapeDrugItem]
		],

		[PackNameEnum.WorldMap]: [
			["MapNpcListItem", MapNpcListItem],
			["MapBossListItem", MapBossListItem],
			["MapProposePanel", MapProposePanel]
		],

		[PackNameEnum.WorldBoss]: [
			["BossHeadItem", BossHeadItem],
			["PropertyText", PropertyText],
			["RecordText", RecordText],

		],

		[PackNameEnum.SevenDays]: [
			["SevenDayItem", SevenDayItem]
		],
		[PackNameEnum.CreateRole]: [
			["BaseRoleItem", BaseRoleItem]
		],

		[PackNameEnum.Refine]: [
			["StoneEquipItem", StoneEquipItem],
			["StoneInlayItem", StoneInlayItem],
			["RefreshEquipItem", RefreshEquipItem],
			["RefreshAttrItem", RefreshAttrItem]
		],

		[PackNameEnum.Test]: [
            ["MemDisplay", MemDisplay],
			["TestItem", TestItem],
			["TestResourceItem", TestResourceItem],
			["TestSearchItem", TestSearchItem],
			["TestSearchItem2", TestSearchItem2],
			["LogItem", LogItem],
			["InputItem", InputItem],
			["TestGM8", TestGM8],
			["TestCmdCom", TestCmdCom],
		],

		[PackNameEnum.Rune]: [
			["RuneInlayItem", RuneInlayItem],
			["RunePackItem", RunePackItem],
			["RunePandectItem", RunePandectItem],
			["RuneLvItem", RuneLvItem],
			["RuneDecomposeItem", RuneDecomposeItem],
		],
		[PackNameEnum.RuneShop]: [
			["RuneExchangeItem", RuneExchangeItem]
		],

		[PackNameEnum.Guild]: [
			["GuildFlagItem", GuildFlagItem],
			["GuildListApplyItem", GuildListApplyItem],//仙盟申请列表
			["GuildApplyListItem", GuildApplyListItem],//仙盟成员申请列表
			["GuildMemberListItem", GuildMemberListItem],
			["GuildSkillItem", GuildSkillItem],
			["GuildWarehouseRecordItem", GuildWarehouseRecordItem],
			["GuildPropGetItem", GuildPropGetItem]
		],

		[PackNameEnum.Chat]: [
			["ChatItem0", ChatItem2],
			["ChatItem1", ChatItem],
			["ChatItem2", ChatItem3],
			["ChatMsgItem", ChatMsgItem],
			["ChatMsgItem1", ChatMsgItem1],
			["ChatMsgItem2", ChatMsgItem2],
			["ChatMsgItem3", ChatMsgItem3],
			//["ChatExtendView", ChatExtendView],			
			["ChatLanguageItem", ChatLanguageItem],
			["ChatChanelItem", ChatChanelItem]
		],
		[PackNameEnum.ChatFaceView]:[
			["ChatFaceItem", ChatFaceItem],
		],
		[PackNameEnum.Mail]: [
			["MailItem", MailItem]
		],

		[PackNameEnum.VIP]: [
			["VipCardItem", VipCardItem],
			["VipRenewItem", VipRenewItem],
			["VipDescribeItem", VipDescribeItem],
			["VipTweenItem", VipDescribeTweenItem]
		],

		[PackNameEnum.Team]: [
			["Slider_level", Slider],
			["TeamItem", TeamItem],
			["TeamMemberItem", TeamMemberItem],
			["TargetBtnItem", TargetBtnItem],
			["PlayerIcon", ConfirmPlayerIcon],
			["ApplyPlayerItem", TeamApplyPlayerItem],
			["InvitePlayerItem", TeamInvitePlayerItem],
			["TeamBeinviteItem", TeamBeInviteItem],
			["TeamModelItem", TeamModelItem],
		],

		[PackNameEnum.Shop]: [
			["ShopGoodItem", ShopGoodItem],
			["ShopMysteryItem", ShopMysteryItem],
			["ShopTabButtonItem", ShopTabButtonItem]

		],

		[PackNameEnum.Daily]: [
			["DailyItem", DailyItem],
			["DailyActiveItem", DailyActiveItem]
		],

		[PackNameEnum.ChangeCareer]: [
			["ChangeCareerSkillItem", ChangeCareerSkillItem],
			["ChangeStageItem", ChangeCareerStageItem],
		],

		[PackNameEnum.Compose]: [
			["ComposeTypeItem", ComposeTypeItem],
			["ComposeMaterialItem", ComposeMaterialItem]
		],

		[PackNameEnum.Achievement]: [
			["AchievementCategoryBtn", AchievementCategoryBtn],
			["AchievementPointItem", AchievementPointItem],
			["AchievementReceiveItem", AchievementReceiveItem],
		],

		[PackNameEnum.Title]: [
			["TitleCategoryItem", TitleCategoryItem],
			["TitleItem", TitleNameItem],
		],

		[PackNameEnum.Welfare]: [
			["WelfareUpgradeItem", WelfareUpgradeItem],
			["WelfareDailyItem", WelfareDailyItem],
			["WelfareMonthItem", WelfareMonthItem],
		],

		[PackNameEnum.Rank]: [
			["RankItemFirstView", RankItemFirstView],
			["RankTypeItem", RankTypeItem],
			["RankItemView", RankItemView]
		],

		[PackNameEnum.BibleActivity]: [
			["BibleActivityItem", BibleActivityItem],
			["BossItem", BossItem],
		],
		
		[PackNameEnum.ActivityScore]: [
			["ActivityScoreItem", ActivityScoreItem],
		],
		
		[PackNameEnum.Boss]: [
			["BossHeadItem", WorldBossItem],
			["BossSetItem", BossSetItem],
			["BossRewardItem", BossRewardItem],
			["PersonnalBossItem", PersonnalBossItem],
		],

		[PackNameEnum.BossHome]: [
			["BossHomeEnterItem", BossHomeEnterItem],
			["BossHomeItem", BossHomeItem],
			["BossHomeTopItem", BossHomeTopItem],
			["BossHomeDetailsView", BossHomeDetailsView],
		],

		[PackNameEnum.ForgeStrengthen]: [
			["ForgeStrengthenItem", ForgeStrengthenItem],
		],

		[PackNameEnum.ForgeRefine]: [
			["ForgeRefineItem", ForgeRefineItem],
		],

		[PackNameEnum.ForgeImmortals]: [
			["ForgeImmortalsItem", ForgeImmortalsItem],
			["ForgeImmortSoulItem", ForgeImmortSoulItem],
			["ImmortalsAttrItem", ImmortalsAttrItem],
			["ImmSkillTipPosNameItem", ImmSkillTipPosNameItem],
			["AttrCompareItem", AttrCompareItem]
		],
		//
		[PackNameEnum.AncientEquip]: [
			["AncientEquipItem", AncientEquipItem],
			["AncientEquipAttrItem", AncientEquipAttrItem],
			["AncientGainItem", AncientGainItem],
			["AncientSmeltItem", AncientSmeltItem],
			["AncientSkillItem", AncientSkillItem],
		],
		[PackNameEnum.Recharge]: [
			["RechargeItem", RechargeItem],
		],

		[PackNameEnum.RechargeFirst]: [
			["RechargeFirstItem", RechargeFirstItem],
			["RechargeFirstRewardItem", RechargeFirstRewardItem],
		],

		[PackNameEnum.GodEquip]: [
			["GodEquipDecomposeItem", GodEquipDecomposeItem],
			["GodEquipItem", GodEquipItem]

		],

		[PackNameEnum.VipGift]: [
			["VipGiftPackageTabItem", VipGiftPackageTabItem],

		],

		[PackNameEnum.TrainGodWeaponPanel]: [
			["PieceItem", GodWeaponPieceItem]
		],

		[PackNameEnum.GodWingPanel]: [
			["GodWingComposeTypeItem", GodWingComposeTypeItem],
			["GodWingItem", GodWingItem]
		],
		[PackNameEnum.GodWingEquipPanel]: [
			["GodWingEquipItem", GodWingEquipItem]
		],
		[PackNameEnum.TrainNobilityPanel]: [
			["NoBilityMissionItem", NoBilityMissionItem],
			["TrainDailyMissionItem", TrainDailyMissionItem]
		],
		//TrainMedalItem
		[PackNameEnum.TrainMedalPanel]: [
			["TrainMedalItem", TrainMedalItem]
		],
		[PackNameEnum.TrainIllustratePanel]: [
			["TrainIllustrateItem", TrainIllustrateItem],
			["TrainIllustrateSubTypeItem", TrainIllustrateSubTypeItem],
			["IllustrateDecomposeItem", IllustrateDecomposeItem],
			["IllustrateSuitTipItem", IllustrateSuitTipItem],
			["PropGetItem", PropGetItem],
		],
		[PackNameEnum.MagicWare]: [
			["MWSkillItem", MWSkillItem],
			["MWDrugItem", MWDrugItem],
			["HeartMethodDecomposeItem" , HeartMethodDecomposeItem],
			["SkillDescItem", SkillDescItem],
			["ColorStoneChooseItem", ColorStoneChooseItem],
			["ColorStoneDrugItem", ColorStoneDrugItem],
			["ColorStoneSkillItem", ColorStoneSkillItem],
			["HeartMethodItem", HeartMethodItem]
		],

		[PackNameEnum.KingBattle]: [
			["BattleRankItem", BattleRankItem],
			["BattleRankRewardItem", BattleRankRewardItem],
		],

		[PackNameEnum.PropGet]: [
			["PropGetItem", PropGetItem]
		],

		[PackNameEnum.CrossBossGuild]:[
			['GuildBossHeadItem',GuildBossHeadItem],	
			['CrossDropLogItem',CrossDropLogItem],	
		],
		
		[PackNameEnum.Operating]:[
			["OperatingBtnItem",OperatingBtnItem]
		],

		[PackNameEnum.UniqueSkill]: [
			["UniqueSkillExchangeItem", UniqueSkillExchangeItem]
		],
		[PackNameEnum.MagicWeaponCopy]: [
			["SpiritMultipleItem", SpiritMultipleItem]
		],
		[PackNameEnum.SkillCheats]: [
			["CheatsItem", CheatsItem],
			["SkillCheatsItem", SkillCheatsItem],
			["CheatsSelectWinComItem", CheatsSelectWinComItem],
			["CheatsSelectWinItem", CheatsSelectWinItem],
		],

		[PackNameEnum.Lottery]: [
			["LotteryEquipLogItem", LotteryEquipLogItem],
			["LotteryAncientProgress", LotteryAncientProgress],
			["LotteryAncientBox", LotteryAncientBox],
			["LotteryProbailityItem", ItemLotteryProb],
			["LotteryLvlItem", LotteryLvlItem],
			["LotteryBetterItem",LotteryBetterItem]
		],

		[PackNameEnum.InnerPower]: [
			["InnerPowerBall", InnerPowerBall]
		],
		[PackNameEnum.Activity]: [
			["ActivityButtonItem", ActivityButtonItem],
		],
		[PackNameEnum.ActivityShop]: [
			["NewServerBuyItem", NewServerBuyItem],
		],
		[PackNameEnum.ActivityIII]: [
			["RewardButton", RewardButton],
			["DayRechargeItem", ActivityDayRechargeItem],
			["RechargeAddBtnItem",RechargeAddBtnItem],
			["RechargeAddItem",RechargeAddItem]
		],
		[PackNameEnum.ActivityIV]: [
			["ActivityRebateItem", ActivityRebateItem],
			["RebatePreviewItem", RebatePreviewItem],
			["RechargeRebateItem",RechargeRebateItem],
			["ActivityHolidayRechargeBtn",ActivityHolidayRechargeBtn],
			["ActivityHolidayRechargeItem",ActivityHolidayRechargeItem]
		],
		[PackNameEnum.ActivityBoss2]: [
			["ActivityBossItem", ActivityBossItem],
		],

		[PackNameEnum.ActivityRank]: [
			["ActivityRankRewardItem", ActivityRankRewardItem],
			["RankFirstView", ActivityRankFirstView],
			["ActivityDayTargetItem", ActivityDayTargetItem],
			["ActivityRankItem", ActivityRankItem],
			["ActivityUpgradeLvItem", ActivityUpgradeLvItem],
			["ActivityUpgradeFaBaoItem", ActivityUpgradeFaBaoItem],
			["ActivityRankGetWayItem",ActivityRankGetWayItem]
		],
		[PackNameEnum.ActGroupBuy]:[
			["ActGroupBuyCateItem",ActGroupBuyCateItem],
			["ActGroupBuyRewardItem",ActGroupBuyRewardItem],
		],
		[PackNameEnum.ActivitySeven]:[
			["ActivitySevenCategoryBtn",ActivitySevenCategoryBtn],
			["ActivitySevenRewardItem",ActivitySevenRewardItem],
			["ActivityDayButton",ActivityDayButton],
			["ActivityScoreRewardItem",ActivityScoreRewardItem]
		],

		[PackNameEnum.ActivityInvest]:[
			["ActivityInvestItem",ActivityInvestItem]
		],

		[PackNameEnum.ActivityLimitRecharge]:[
			["LimitRechargeBtnItem",LimitRechargeBtnItem]
		],
		[PackNameEnum.ActivityDayRecharge]:[
			["DayRechargeExRewardItem",DayRechargeExRewardItem],
			["DayRechargeTabButton",DayRechargeTabButton],
		],
		
		[PackNameEnum.Welfare2]: [
			["Welfare2ButtonItem", Welfare2ButtonItem],
			["noticeTxt",noticeTxt],
		],

		[PackNameEnum.WelfareSignIn]: [
			["SignInItem", SignInItem],
			["SignInDaysItem", SignInDaysItem],
		],

		[PackNameEnum.WelfareLoginReward]: [
			["LoginRewardItem", LoginRewardItem],
		],
		[PackNameEnum.OnlineReward]:[
			["OnlineRewardItem",OnlineRewardItem],
		],

		[PackNameEnum.PlayerOther]: [
			["OtherRoleItem", OtherRoleItem],
		],

		[PackNameEnum.UpgradeGuide]: [
			["UpgradeItem", UpgradeItem],
		],

		[PackNameEnum.Encounter]: [
			["EncounterPlayerItem", EncounterPlayerItem],
			["EncounterRewardItem", EncounterRewardItem],
		],

		[PackNameEnum.FashionTitle]: [
			["TitleItemView", TitleItemView],
			["TitlePropertyItemView", TitlePropertyItemView],
			["TitlePropertyItem", TitlePropertyItem]
		],

		[PackNameEnum.FashionPlayer]: [
			["FashionPlayerItem", FashionPlayerItem],
		],

		[PackNameEnum.MiningHire]: [
			["MiningHireItem", MiningHireItem],
			["MiningManItem", MiningManItem],
			["MiningRecordItem", MiningRecordItem],
			["MiningRobbedItem", MiningRobbedItem],
		],

		[PackNameEnum.GamePlay]: [
			["GamePlayItemView", GamePlayItemView],
		],

		[PackNameEnum.SevenDayMagicWeapon]: [
			["MagicWeaponActiveItem", MagicWeaponActiveItem],
			["MagicWeaponFuseItem", MagicWeaponFuseItem],
		],

		[PackNameEnum.GuildVein]: [
			["GuildVeinItem", GuildVeinItem]
		],

		[PackNameEnum.GuildHome]: [
			["GuildHomeRankItem", GuildHomeRankItem],
			["AllotMemberHeadItem", AllotMemberHeadItem],
			["AllotMemberItemView", AllotMemberItemView],
			["GuildStorePropAllotItem", GuildStorePropAllotItem],
			["GuildScoreWareHouseLogItem",GuildScoreWareHouseLogItem]
		],

		[PackNameEnum.Shura]: [
			["ShuraItem", ShuraItem],
			["ShuraDecomposeItem", ShuraDecomposeItem]
		],

		[PackNameEnum.Friend]: [
			["FriendListItem", FriendListItem],
			["ApplyFriendItem", ApplyFriendItem],
			["ShieldFriendItem", ShieldFriendItem],
			["FriendContactChatItem", FriendContactChatItem],
			["FriendContactItem", FriendContactItem],
			["FriendMailItem", FriendMailItem]
		],
		[PackNameEnum.GuildBattle]: [
			["GuildRankItemView", GuildRankItemView],
			["GuildRankRewardItem", GuildRankRewardItem],
			["PlayerRankItemView", PlayerRankItemView],
			["PlayerRankRewardItem", PlayerRankRewardItem],
			["PlayerScoreRewardItem", PlayerScoreRewardItem],
		],
		[PackNameEnum.GuildCopy]:[
			["GuildTeamCopyItem",GuildTeamCopyItem],
			["GuildTeamRankRewardItem",GuildTeamRankRewardItem],
			["GuildTeamMemberItem",GuildTeamMemberItem],
			["GuildTeamCopyRankItem",GuildTeamCopyRankItem]
		],
		[PackNameEnum.CrossBoss]: [
			["CrossBossItem", CrossBossItem],
			["CrossBossRewardItem", CrossBossRewardItem],
			["CrossBossPanel", CrossBossPanel],
		],

		[PackNameEnum.MagicWeaponStrengthen]: [
			["SkillInfoItem", SkillInfoItem],
		],

		[PackNameEnum.Pet]: [
			["PetSuitDetailItem", PetSuitDetailItem],
			["PetEquipItem", PetEquipItem]
		],

		[PackNameEnum.RpgTeam]: [
            ["RpgTeamHeadItem", RpgTeamHeadItem]
		],

		[PackNameEnum.QiongCangBoss]:[
			["TowerImgView",TowerImgView],
			["TowerImgView2",TowerImgView2],
			["QiongCangBossRewardItem",QiongCangBossRewardItem]
		],
		[PackNameEnum.QiongCangSmelt]:[
			['QCSmeltItem',QCSmeltItem],
			['QCSmeltMaterItem',QCSmeltMaterItem],
		],

		[PackNameEnum.QiongCangCopy]:[
			["QCCopyFloorItem",QCCopyFloorItem],
			["QCCopyRankItem",QCCopyRankItem],
			["QCWinRankItem",QCWinRankItem],
			["QCCopyFloorRewardItem",QCCopyFloorRewardItem],
		],
		[PackNameEnum.TalentCultivate]:[
			["TalentTaskPanel",TalentTaskPanel],
			["TalentCultivatePanel",TalentCultivatePanel],
			["TalentCareerBtn",TalentCareerBtn],
			["TalentEquipItem",TalentEquipItem],
			["TalentTaskItem",TalentTaskItem],
			["TalentExpBall", TalentExpBall],
			["TalentReplaceItem", TalentReplaceItem],
			["TalentSkillItem", TalentSkillItem]
		],
        [PackNameEnum.Peak]:[
            ["PeakRewardItem",PeakRewardItem],
            ["PeakReport1Item",PeakReport1Item],
            ["PeakReport2Item",PeakReport2Item],
            ["PeakRoundItem",PeakRoundItem],
            ["PeakRankItem",PeakRankItem],
            ["PeakGambleInfoItem",PeakGambleInfoItem],
            ["PeakGamblePlayerItem",PeakGamblePlayerItem],
            ["PeakShopItem",PeakShopItem],
        ],
        [PackNameEnum.Team2]:[
            ["Team2TeamItem",Team2TeamItem],
            ["Team2CopyItem",Team2CopyItem],
			["DropRecordItem",DropRecordItem],
        ],

		[PackNameEnum.BossComing]:[
			["BossComingItem",BossComingItem],
			["BossComingRewardItem",BossComingRewardItem]
		],

		[PackNameEnum.Exam]:[
			["ExamRankItem",ExamRankItem],
			["ExamAnswerItem",ExamAnswerItem],
			["ExamRankWinItem",ExamRankWinItem],
			["ExamRankRewardItem",ExamRankRewardItem]
		],

		[PackNameEnum.BeastBattle]:[
			["BeastItem",BeastItem],
			["BeastEquipItem",BeastEquipItem],
			["BeastEquipReplaceItem", BeastEquipReplaceItem],
			["BeastSkillItem",BeastSkillItem],
			["BeastDecomposeItem",BeastDecomposeItem],
		],

        [PackNameEnum.Contest]:[
            ["ContestApplyView",ContestApplyView],
            ["ContestScoreRankItem",ContestScoreRankItem],
            ["ContestScoreRankItem2",ContestScoreRankItem2],
            ["ContestVictoryRankItem",ContestVictoryRankItem],
            ["ContestMainRankItem",ContestMainRankItem],
            ["ContestMainRankItem2",ContestMainRankItem2],
            ["ContestMainRankItem3",ContestMainRankItem3],
            ["ContestChallengerItem",ContestChallengerItem],
            ["ContestGambleInfoItem",ContestGambleInfoItem],
            ["ContestGambleItem",ContestGambleItem],
            ["ContestOpponentItem",ContestOpponentItem],
            ["ContestRewardItem",ContestRewardItem],
			["ContestExchangeItem",ContestExchangeItem],
			["ContestShopItem",ContestShopItem],
			["ContestQualificationEndItem",ContestQualificationEndItem],
			["ContestQualificationEndView",ContestQualificationEndView],
			["ContestMainEndItem",ContestMainEndItem],
			["ContestMainEndView",ContestMainEndView],
        ],

        [PackNameEnum.Qualifying]:[
            ["QualifyingTeamModelItem",QualifyingTeamModelItem],
            ["QualifyingInviteItem",QualifyingInviteItem],
            ["QualifyingRankItem",QualifyingRankItem],
            ["QualifyingStandardItem",QualifyingStandardItem],
            ["QualifyingStageItem",QualifyingStageItem],
            ["QualifyingStageRewardItem",QualifyingStageRewardItem],
            ["QualifyingLogo",QualifyingLogo],
        ],

        [PackNameEnum.QualifyingResult]:[
            ["QualifyingResultItem",QualifyingResultItem],
        ],
	};

	public static init(): void {
		fairygui.UIObjectFactory.setLoaderExtension(GLoader);//这里可以考虑用池，需要修改引擎

		//微信小游戏并且是iPhoneX系列的处理
		if (App.DeviceUtils.IsWXGame && App.DeviceUtils.IsIPhoneX) {
			fairygui.GRoot.inst.height = App.StageUtils.getHeight() - this.WXIPhoneXtop - this.WXIPhoneXbottom;
			fairygui.GRoot.inst.y = this.WXIPhoneXtop;
			
			let stage: egret.Stage = App.StageUtils.getStage();
            let topSp = new egret.Sprite;
            topSp.graphics.beginFill(0x000000);
            topSp.graphics.drawRect(0, 0, App.StageUtils.getWidth(), this.WXIPhoneXtop);
            topSp.graphics.endFill();
            stage.addChild(topSp);
            let bottomSp = new egret.Sprite;
            bottomSp.graphics.beginFill(0x000000);
            bottomSp.graphics.drawRect(0, 0, App.StageUtils.getWidth(), this.WXIPhoneXbottom );
            bottomSp.graphics.endFill();
			bottomSp.y = App.StageUtils.getHeight() - this.WXIPhoneXbottom;
            stage.addChild(bottomSp);
		}
	}

	/**
	 * 注册包内所有扩展组件
	 */
	public static register(pkgName: string): void {
		let extensions: Array<any> = UIExtensionManager.extensions[pkgName];
		if (extensions != null) {
			for (let e of extensions) {
				UIExtensionManager.reg(pkgName, e[0], e[1]);
			}
		}
	}


	/**
	 * 注册扩展组件。这里表示从库中创建所有resname的组件的实现类将变为clazz
	 * @param pkgName
	 * @param resName
	 * @param clazz 自定义组件类 
	 */
	private static reg(pkgName: string, resName: string, clazz: any): void {
		let itemUrl: string = fairygui.UIPackage.getItemURL(pkgName, resName);
		if (itemUrl) {
			fairygui.UIObjectFactory.setPackageItemExtension(itemUrl, clazz);
		} else {
			Log.trace(Log.UI, "注册自定义组件失败：", `${pkgName}-${resName}`);
		}
	}
}