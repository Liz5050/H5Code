/**配置管理 */
class ConfigManager {
	public static Data: any;
	public static client: ClientConfig;
	public static battle: BaseConfig;
	public static item: ItemConfig;//物品
	public static exp: ExperienceConfig;//经验
	public static expCopy: ExperienceCopyConfig;
	public static career: CareerConfig;//职业
	public static mgCareer: MgCareerNameConfig;//职业名称
	public static state: StateConfig;
	public static boss: BossConfig; //怪物配置
	public static npc: NpcConfig; //npc配置
	public static errorCode: ErrorCodeConfig;
	public static mgStrengthen: MgStrengthenConfig;
	public static mgTarget: MgTargetConfig;
	public static mgOpen: MgOpenConfig;
	public static mgShape: MgShapeConfig;
	public static mgShapeDrugAttr: MgShapeDrugAttrConfig;
	public static skill: SkillConfig;
	public static mgShapeOpen: MgShapeOpenConfig;
	public static task: TaskConfig;
	public static taskTalk: TaskTalkConfig;
	public static taskExtraReward: TaskExtraRewardConfig;
	public static timeLimitTask: TimeLimitTaskConfig;
	public static mgShapePetExp: MgShapePetExpConfig;
	public static specialRewardItem: SpecialRewardItemConfig;
	public static mgBestAttr: MgBestAttrConfig;
	public static mgShapeChange: MgShapeChangeConfig;
	public static mgShapeChangeEx: MgShapeChangeExConfig;
	public static shareReward: ShareRewardConfig;
	public static map: MapConfig;
	public static copy: CopyConfig;
	public static cheats: CheatsConfig;
	public static cheatsPos: CheatsPosConfig;
	public static effect: EffectConfig;
	public static effectList: EffectListConfig;
	public static mgFashion: MgFashionConfig;
	public static mgRuneCopy: MgRuneCopyConfig;
	public static itemQuickUse: ItemQuickUseConfig;
	public static shop: ShopConfig;
	public static shopSell: ShopSellConfig;
	public static mgGameBoss: MgGameBossConfig;
	public static mgHookPropose: MgHookPropose;
	public static copyStar: CopyStarConfig;
	public static petTalk: PetTalkConfig;
	public static bossTalk: BossTalkConfig;
	public static talkContent: TalkContentConfig;
	public static mgStrengthenExAccessory: MgStrengthenExAccessoryConfig;
	public static jewel: JewelConfig;
	public static const: ConstConfig;
	public static test: TestTypeConfig;
	public static mgRune: MgRuneConfig;
	public static guild: GuildConfig;
	public static guildDonate: GuildDonateConfig;
	public static chatFilter: ChatFilterConfig;
	public static chatPhrase: MgChatPhrase;
	public static vip: VipConfig;
	public static vipGift: VipGiftConfig;
	public static mgRefreshOrder: MgRefreshOrderConfig;
	public static mgRefreshCost: MgRefreshCostConfig;
	public static updateCode: UpdateCodeConfig;
	public static mgRefreshRate: MgRefreshRateConfig;
	public static mgRefreshAttrRate: MgRefreshAttrRateConfig;
	public static copyAddNum: CopyAddNumConfig;
	public static guildVein: GuildVeinConfig;
	public static roleState: RoleStateConfig;
	public static propertiesMsg: PropertiesMessageConfig;
	public static guildBeastGod: GuildBeastGodConfig;
	public static mgStronger: MgStrongerConfig;
	public static smeltCategory: SmeltCategoryConfig;
	public static smeltPlan: SmeltPlanConfig;
	public static smeltPlanEquip: SmeltPlanEquipConfig;
	public static changeCareer: ChangeCareerConfig;
	public static swordPool: SwordPoolConfig;
	public static swordPoolEvent: SwordPoolEventConfig;
	public static swordPoolActivity: SwordPoolActivityConfig;
	public static mgBloodMatrix: MgBloodMatrixConfig;
	public static achievement: AchievementConfig;
	public static achievementName: AchievementNameConfig;
	public static realm: MgRealmConfig;
	public static guide: GuideConfig;
	public static title: TitleConfig;
	public static titleCategory: TitleCategoryConfig;
	public static levelReward: LevelRewardConfig;
	public static mgSignDay: MgSignDayConfig;
	public static mgSignMonth: MgSignMonthConfig;
	public static rank: RankConfig;
	public static sevenDays: SevenDaysConfig;
	public static checkPoint: CheckPointConfig;
	public static toplistActive: ToplistActiveConfig;
	public static toplistActiveDatail: ToplistActiveDetailConfig;
	public static mapMaping: MapMapingConfig;
	public static mgDeityBookTarget: MgDeityBookTargetConfig;
	public static mgDeityBookPage: MgDeityBookPageConfig;
	public static mgDelegate: MgDelegateConfig;
	public static mgStrengthenEx: MgStrengthenExConfig;
	public static roleStateNew: RoleStateNewConfig;
	public static dropLevel: DropLevelConfig;//角色等级兑换修为配置
	public static medal: MedalConfig;
	public static mgGodEquipCost: MgGodEquipCostConfig;
	public static gmItem: GmItemConfig;
	public static itemTransfer: ItemTransferConfig;
	public static cultivateEffect: CultivateEffectConfig;
	public static mgRecharge: MgRechargeConfig;
	public static monthCardReward: MonthCardRewardConfig;
	public static rechargeFirst: RechargefirstConfig;
	public static strengthenExDrug: StrengthenExDrugConfig;
	public static mgOpenNewRoleCond: MgOpenNewRoleCondConfig;
	public static godWeapon: GodWeaponConfig;
	public static cltImmortal: CltImmortalConfig;
	public static propGet: PropGetConfig;
	public static mgKingStife: MgKingStifeConfig;
	public static kingRankReward: KingRankRewardConfig;
	public static kingStageReward: KingStageRewardConfig;
	public static cultivateSuit: CultivateSuitConfig;
	public static cultivate: CultivateConfig;
	public static secretGiftConfig: mgSecretBossGiftConfig;
	public static lottery: LotteryConfig;
	public static lotteryShow: LotteryShowConfig;
	public static lotteryType: LotteryTypeConfig;
	public static lotteryReward: LotteryRewardConfig;
	public static rechargeRebate: RechargeRebateConfig;
	public static mgGuideLevel: MgGuideLevelConfig;
	public static bossHomeReward: BossHomeRewardConfig;
	public static encounter: EncounterConfig;
	public static mgFashionStar: MgFashionStarConfig;
	public static mining: MiningConfig;
	public static worldBossBuff: WorldBossInspireConfig;
	public static gamePlay: GamePlayConfig;
	public static expPosition: ExpPositionConfig;
	public static sevenDayMagicWeapon: SevenDayMagicWeaponConfig;
	public static guildFire: GuildFireConfig;
	public static equipUpgrade: EquipUpgradeConfig;
	public static campBattleScoreCfg: CampBattleScoreRewardConfig;
	public static campBattleRankCfg: CampBattleRankRewardConfig;
	public static guildBattle: GuildBattleConfig;
	public static crossBoss: CrossBossConfig;
	public static activitySeven: ActivitySevenConfig;
	public static mgShapeEquip: MgShapeEquipConfig;
	public static copyLegend: CopyLegendConfig;
	public static chooseGiftBag: ChooseGiftBagConfig;
	public static talent: TalentConfig;
	public static online: OnlineRewardConfig;
	public static cultivateEffectType: CultivateEffectTypeConfig;
	public static team: TeamConfig;
	public static mgShapeChangeSkillUpgrade: MgShapeChangeSkillUpgradeConfig;
	public static activityInvest: ActivityInvestConfig;
	public static strengthenExActivateConfig: MgStrengthenExActivateConfig;
	public static peak: PeakConfig;
	public static mgShapeActiveOpen: MgShapeOpenActiveConfig;
	public static questionLib: QuestionLibConfig;
	public static questionRankReward: QuestionRankRewardConfig;
	public static crossStair: CrossStairConfig;
	public static mgBeast: MgBeastConfig;
	public static mgBeastEquip: MgBeastEquipConfig;
	public static mgBeastHole: MgBeastHoleConfig;
	public static mgBeastStrengthen: MgBeastStrengthenConfig;
	public static mgBeastBeckonNum: MgBeastBeckonNumConfig;
    public static contest: ContestConfig;
	public static mgDynamicRoleStateProp: MgDynamicRoleStatePropConfig;
	public static qualifying: QualifyingConfig;
	public static materialActiveLink: MaterialActiveLinkConfig;
	public static mgEquipUpgrade: MgEquipUpgradeConfig;

	public static init() {
		let startTime: number = egret.getTimer();
		ConfigManager.Data = RES.getRes("config_json");

		// App.GlobalData = ConfigManager.Data["global"];
		App.ServerList = ConfigManager.Data["server_list"];
		ConfigManager.client = new ClientConfig();
		ConfigManager.battle = ConfigManager.Data["battle_config"];
		ConfigManager.item = new ItemConfig();
		ConfigManager.exp = new ExperienceConfig();
		ConfigManager.expCopy = new ExperienceCopyConfig();
		ConfigManager.career = new CareerConfig();
		ConfigManager.mgCareer = new MgCareerNameConfig();
		ConfigManager.state = new StateConfig();
		ConfigManager.boss = new BossConfig();
		ConfigManager.npc = new NpcConfig();
		ConfigManager.errorCode = new ErrorCodeConfig();
		ConfigManager.mgStrengthen = new MgStrengthenConfig();
		ConfigManager.mgTarget = new MgTargetConfig();
		ConfigManager.mgOpen = new MgOpenConfig();
		ConfigManager.mgShape = new MgShapeConfig();
		ConfigManager.mgShapeDrugAttr = new MgShapeDrugAttrConfig();
		ConfigManager.skill = new SkillConfig();
		ConfigManager.mgShapeOpen = new MgShapeOpenConfig();
		ConfigManager.task = new TaskConfig();
		ConfigManager.taskTalk = new TaskTalkConfig();
		ConfigManager.taskExtraReward = new TaskExtraRewardConfig();
		ConfigManager.timeLimitTask = new TimeLimitTaskConfig();
		ConfigManager.mgShapePetExp = new MgShapePetExpConfig();
		ConfigManager.specialRewardItem = new SpecialRewardItemConfig();
		ConfigManager.mgBestAttr = new MgBestAttrConfig();
		ConfigManager.mgShapeChange = new MgShapeChangeConfig();
		ConfigManager.mgShapeChangeEx = new MgShapeChangeExConfig();
		ConfigManager.mapMaping = new MapMapingConfig();
		ConfigManager.map = new MapConfig();
		ConfigManager.copy = new CopyConfig();
		ConfigManager.cheats = new CheatsConfig();
		ConfigManager.cheatsPos = new CheatsPosConfig();
		ConfigManager.effect = new EffectConfig();
		ConfigManager.effectList = new EffectListConfig();
		ConfigManager.mgFashion = new MgFashionConfig();
		ConfigManager.mgRuneCopy = new MgRuneCopyConfig();
		ConfigManager.itemQuickUse = new ItemQuickUseConfig();
		ConfigManager.shop = new ShopConfig();
		ConfigManager.shopSell = new ShopSellConfig();
		ConfigManager.mgGameBoss = new MgGameBossConfig();
		ConfigManager.mgHookPropose = new MgHookPropose();
		ConfigManager.copyStar = new CopyStarConfig();
		ConfigManager.petTalk = new PetTalkConfig();
		ConfigManager.bossTalk = new BossTalkConfig();
		ConfigManager.talkContent = new TalkContentConfig();
		ConfigManager.jewel = new JewelConfig();
		ConfigManager.const = new ConstConfig();
		ConfigManager.test = new TestTypeConfig();
		ConfigManager.mgRune = new MgRuneConfig();
		ConfigManager.guild = new GuildConfig();
		ConfigManager.shareReward = new ShareRewardConfig();
		ConfigManager.guildDonate = new GuildDonateConfig();
		ConfigManager.chatFilter = new ChatFilterConfig();
		// if (!ConfigManager.chatFilter) {
		// 	ConfigManager.chatFilter = new ChatFilterConfig(true);
		// }
		ConfigManager.chatPhrase = new MgChatPhrase();
		ConfigManager.vip = new VipConfig();
		ConfigManager.vipGift = new VipGiftConfig();
		ConfigManager.medal = new MedalConfig();
		ConfigManager.mgRefreshOrder = new MgRefreshOrderConfig();
		ConfigManager.mgRefreshCost = new MgRefreshCostConfig();
		ConfigManager.updateCode = new UpdateCodeConfig();
		ConfigManager.mgRefreshRate = new MgRefreshRateConfig();
		ConfigManager.mgRefreshAttrRate = new MgRefreshAttrRateConfig();
		ConfigManager.copyAddNum = new CopyAddNumConfig();
		ConfigManager.guildVein = new GuildVeinConfig();
		ConfigManager.roleState = new RoleStateConfig();
		ConfigManager.propertiesMsg = new PropertiesMessageConfig();
		ConfigManager.guildBeastGod = new GuildBeastGodConfig();
		ConfigManager.mgStronger = new MgStrongerConfig();
		ConfigManager.smeltCategory = new SmeltCategoryConfig();
		ConfigManager.smeltPlan = new SmeltPlanConfig();
		ConfigManager.smeltPlanEquip = new SmeltPlanEquipConfig();
		ConfigManager.changeCareer = new ChangeCareerConfig();
		ConfigManager.swordPool = new SwordPoolConfig();
		ConfigManager.swordPoolEvent = new SwordPoolEventConfig();
		ConfigManager.swordPoolActivity = new SwordPoolActivityConfig();
		ConfigManager.mgBloodMatrix = new MgBloodMatrixConfig();
		ConfigManager.achievement = new AchievementConfig();
		ConfigManager.achievementName = new AchievementNameConfig();
		ConfigManager.realm = new MgRealmConfig();
		ConfigManager.guide = new GuideConfig();
		ConfigManager.title = new TitleConfig();
		ConfigManager.titleCategory = new TitleCategoryConfig();
		ConfigManager.levelReward = new LevelRewardConfig();
		ConfigManager.mgSignDay = new MgSignDayConfig();
		ConfigManager.mgSignMonth = new MgSignMonthConfig();
		ConfigManager.mgStrengthenExAccessory = new MgStrengthenExAccessoryConfig();
		ConfigManager.rank = new RankConfig();
		ConfigManager.checkPoint = new CheckPointConfig();
		ConfigManager.sevenDays = new SevenDaysConfig();
		ConfigManager.toplistActive = new ToplistActiveConfig();
		ConfigManager.toplistActiveDatail = new ToplistActiveDetailConfig();
		ConfigManager.mgDeityBookTarget = new MgDeityBookTargetConfig();
		ConfigManager.mgDeityBookPage = new MgDeityBookPageConfig();
		ConfigManager.mgDelegate = new MgDelegateConfig();
		ConfigManager.mgStrengthenEx = new MgStrengthenExConfig();
		ConfigManager.roleStateNew = new RoleStateNewConfig();
		ConfigManager.dropLevel = new DropLevelConfig();
		ConfigManager.mgGodEquipCost = new MgGodEquipCostConfig();
		ConfigManager.gmItem = new GmItemConfig();
		ConfigManager.itemTransfer = new ItemTransferConfig();
		ConfigManager.cultivateEffect = new CultivateEffectConfig();
		ConfigManager.mgRecharge = new MgRechargeConfig();
		ConfigManager.rechargeFirst = new RechargefirstConfig();
		ConfigManager.strengthenExDrug = new StrengthenExDrugConfig();
		ConfigManager.mgOpenNewRoleCond = new MgOpenNewRoleCondConfig();
		ConfigManager.godWeapon = new GodWeaponConfig();
		ConfigManager.cltImmortal = new CltImmortalConfig();
		ConfigManager.mgKingStife = new MgKingStifeConfig();
		ConfigManager.kingRankReward = new KingRankRewardConfig();
		ConfigManager.kingStageReward = new KingStageRewardConfig();
		ConfigManager.propGet = new PropGetConfig();
		ConfigManager.cultivateSuit = new CultivateSuitConfig();
		ConfigManager.cultivate = new CultivateConfig();
		ConfigManager.secretGiftConfig = new mgSecretBossGiftConfig();
		ConfigManager.monthCardReward = new MonthCardRewardConfig();
		ConfigManager.lottery = new LotteryConfig();
		ConfigManager.lotteryType = new LotteryTypeConfig();
		ConfigManager.lotteryShow = new LotteryShowConfig();
		ConfigManager.lotteryReward = new LotteryRewardConfig();
		ConfigManager.rechargeRebate = new RechargeRebateConfig();
		ConfigManager.mgGuideLevel = new MgGuideLevelConfig();
		ConfigManager.bossHomeReward = new BossHomeRewardConfig();
		ConfigManager.encounter = new EncounterConfig();
		ConfigManager.mgFashionStar = new MgFashionStarConfig();
		ConfigManager.mining = new MiningConfig();
		ConfigManager.worldBossBuff = new WorldBossInspireConfig();
		ConfigManager.gamePlay = new GamePlayConfig();
		ConfigManager.expPosition = new ExpPositionConfig();
		ConfigManager.sevenDayMagicWeapon = new SevenDayMagicWeaponConfig();
		ConfigManager.guildFire = new GuildFireConfig();
		ConfigManager.equipUpgrade = new EquipUpgradeConfig();
		ConfigManager.campBattleScoreCfg = new CampBattleScoreRewardConfig();
		ConfigManager.campBattleRankCfg = new CampBattleRankRewardConfig();
		ConfigManager.guildBattle = new GuildBattleConfig();
		ConfigManager.crossBoss = new CrossBossConfig();
		ConfigManager.activitySeven = new ActivitySevenConfig();
		ConfigManager.mgShapeEquip = new MgShapeEquipConfig();
		ConfigManager.copyLegend = new CopyLegendConfig();
		ConfigManager.chooseGiftBag = new ChooseGiftBagConfig();
		ConfigManager.talent = new TalentConfig();
		ConfigManager.online = new OnlineRewardConfig();
		ConfigManager.cultivateEffectType = new CultivateEffectTypeConfig();
		ConfigManager.team = new TeamConfig();
		ConfigManager.mgShapeChangeSkillUpgrade = new MgShapeChangeSkillUpgradeConfig();
		ConfigManager.activityInvest = new ActivityInvestConfig();
		ConfigManager.strengthenExActivateConfig = new MgStrengthenExActivateConfig();
		ConfigManager.peak = new PeakConfig();
		ConfigManager.mgShapeActiveOpen = new MgShapeOpenActiveConfig();
		ConfigManager.questionLib = new QuestionLibConfig();
		ConfigManager.questionRankReward = new QuestionRankRewardConfig();
		ConfigManager.crossStair = new CrossStairConfig();
		ConfigManager.mgBeast = new MgBeastConfig();
		ConfigManager.mgBeastEquip = new MgBeastEquipConfig();
		ConfigManager.mgBeastHole = new MgBeastHoleConfig();
		ConfigManager.mgBeastStrengthen = new MgBeastStrengthenConfig();
		ConfigManager.mgBeastBeckonNum = new MgBeastBeckonNumConfig();
		ConfigManager.contest = new ContestConfig();
		ConfigManager.mgDynamicRoleStateProp = new MgDynamicRoleStatePropConfig();
		ConfigManager.qualifying = new QualifyingConfig();
		ConfigManager.materialActiveLink = new MaterialActiveLinkConfig();
		ConfigManager.mgEquipUpgrade = new MgEquipUpgradeConfig();
		ClientConst.init();

		ConfigManager.Data = null;
		let ret: boolean = RES.destroyRes("config_json");//解析完表数据，把原始表资源销毁掉
		console.log("解析配置耗时:" + (egret.getTimer() - startTime) + "ms", ret);
	}
}