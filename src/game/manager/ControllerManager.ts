class ControllerManager {
	public static loading: LoadingController;
	public static login: LoginController;
	public static scene: SceneController;
	public static rpgGame: RpgGameController;
	public static common: CommonController;
	public static home: HomeController;
	public static player: PlayerController;
	public static skill: SkillController;
	public static pack: PackController;
	public static test: TestController;
	public static msgBroadcast: MsgBroadcastController;
	public static resurgence: ResurgenceController;
	public static refine: RefineController;
	public static sysSet: SysSetController;
	public static task: TaskController;
	public static taskDialog: TaskDialogController;
	public static petChange: PetChangeController;
	public static mountChange: MountChangeController;
	public static copy: CopyController;
	public static map: MapController;
	public static ancientEquip: AncientEquipController;
	public static auto: AutoController;
	public static fashion: FashionController;
	public static fashionII: FashionControllerII;
	public static worldMap: WorldMapController;
	public static copyHall: CopyHallController;
	public static towerTurnable:TowerTurntableController;
	public static battle: BattleController;
	public static shop: ShopController;
	public static godWing:GodWingController;
	// public static worldBoss: WorldBossController;
	public static createRole: CreateRoleController;
	public static guild: GuildController;
	public static guildNew: GuildnewController;
	public static guildApply: GuildApplyController;
	public static vip: VipController;
	public static vip3Reward: Vip3RewardController;
	// public static vipGift: VipGiftController;
	public static rune: RuneController;
	public static runeShop:RuneShopController;
	public static effect: EffectController;
	public static chat: ChatController;
	public static rpgGameTips: RpgGameTipsController;
	public static mail: MailController;
	public static preload: PreloadController;
	public static team: TeamController;
	public static platform:PlatformController;
	public static open: OpenController;
	public static changeCareer: ChangeCareerController;
	public static compose: ComposeController;
	public static daily: DailyController;
	public static achievement: AchievementController;
	public static guide: GuideController;
	public static realm: RealmController;
	// public static welfare: WelfareController;
	public static rank: RankController;
	public static sevenDay: SevenDaysController;
	public static checkPoint: CheckPointController;
	// public static bibleActivity: BibleActivityController;
	public static bossNew: BossController;
	public static forge: ForgeController;
	public static forgeImmortals: ForgeImmortalsController;
	public static forgeImmUpgrade: ForgeImmUpgradeController;
	public static godEquip: GodEquipController;
	public static fluencyCheck: FluencyCheckController;
	public static tip: TipController;
	public static magicWare: MagicWareController;
	public static openRole: OpenRoleController;
	public static train: TrainController;
	public static arena: ArenaController;
	public static propGet: PropGetController;
	public static cultivate: CultivateController;
	public static uniqueSkill: UniqueSkillController;
	public static lottery:LotteryController;
	public static recharge:RechargeController;
	public static rechargeFirst:RechargefirstController;
	public static activity:ActivityController;
	public static activityBoss:ActivityBossController;
	public static welfare2:Welfare2Controller;
	public static online:OnlineOnceRewardController;
	public static playerOther:PlayerOtherController;
	public static upgradeGuide: UpgradeGuideController;
	public static timeLimitTask: TimeLimitTaskController;
	public static activation: ActivationController;
	public static timeLimitBoss:TimeLimitBossController;
	public static miningHire:MiningHireController;
	public static guildHome: GuildHomeController;
	public static guildActivity: GuildActivityController;
	public static sevenDayMagicWeapon: SevenDayMagicWeaponController;
	public static friend: FriendController;
	public static guildBattle:GuildBattleController;
	public static magicStenController : MagicWeaponStrengthenController;
	public static cross:CrossController;
	public static crossBoss:CrossBossController;
	public static shape: ShapeController;
	public static activitySeven:ActivitySevenController;
	public static qiongCang:QiongCangController;
	public static peak:PeakController;
	public static team2:Team2Controller;
	public static magicArrayChange : MagicArrayChangeController;
	public static magicWeaponChange: MagicWeaponChangeController;
	public static guildCopy:GuildCopyController;
	public static battleArrayChange: ShapeBattleChangeController;
	public static swordPool : SwordPoolController;
	public static swordPoolChange : SwordPoolChangeController;
	public static bossComing:BossComingController;
	public static exam: ExamController;
	public static gamePlay:GamePlayController;
	public static shapeWingChange :MagicWingChangeController;
	public static crossStair:CrossStairController;
	public static activityLimitRecharge:ActivityLimitRechargeController;
	public static keyboard: KeyboardController;
	public static contest: ContestController;
	public static qualifying: QualifyingController;
	public static specialEquip: SpecialEquipController;

	public constructor() {
	}

	public static init(): void {
		ControllerManager.initLogin();
		ControllerManager.scene = new SceneController();
		ControllerManager.rpgGame = new RpgGameController();
		ControllerManager.common = new CommonController();
		ControllerManager.battle = new BattleController();
		ControllerManager.home = new HomeController();
		ControllerManager.player = new PlayerController();
		ControllerManager.skill = new SkillController();
		ControllerManager.pack = new PackController();
		ControllerManager.test = new TestController();
		ControllerManager.resurgence = new ResurgenceController();
		ControllerManager.refine = new RefineController();
		ControllerManager.sysSet = new SysSetController();
		ControllerManager.task = new TaskController();
		ControllerManager.taskDialog = new TaskDialogController();
		ControllerManager.petChange = new PetChangeController();
		ControllerManager.mountChange = new MountChangeController();
		ControllerManager.ancientEquip = new AncientEquipController();
		ControllerManager.copy = new CopyController();
		ControllerManager.map = new MapController();
		ControllerManager.auto = new AutoController();
		ControllerManager.fashion = new FashionController();
		ControllerManager.fashionII = new FashionControllerII();
		ControllerManager.worldMap = new WorldMapController();
		ControllerManager.copyHall = new CopyHallController();
		ControllerManager.towerTurnable = new TowerTurntableController();
		ControllerManager.shop = new ShopController();
		ControllerManager.godWing = new GodWingController();
		// ControllerManager.worldBoss = new WorldBossController();
		ControllerManager.initCreateRole();
		ControllerManager.initMsgBroadcast();
		// ControllerManager.guild = new GuildController();
		ControllerManager.guildNew = new GuildnewController();
		ControllerManager.guildApply = new GuildApplyController();
		ControllerManager.vip = new VipController();
		// ControllerManager.vipGift = new VipGiftController();
		ControllerManager.vip3Reward = new Vip3RewardController();
		ControllerManager.rune = new RuneController();
		ControllerManager.runeShop = new RuneShopController();
		ControllerManager.chat = new ChatController();
		ControllerManager.effect = new EffectController();
		ControllerManager.rpgGameTips = new RpgGameTipsController();
		ControllerManager.mail = new MailController();
		ControllerManager.preload = new PreloadController();
		ControllerManager.team = new TeamController();
		ControllerManager.platform = new PlatformController();
		ControllerManager.open = new OpenController();
		ControllerManager.changeCareer = new ChangeCareerController();
		ControllerManager.compose = new ComposeController();
		//ControllerManager.daily = new DailyController();
		// ControllerManager.achievement = new AchievementController();
		ControllerManager.guide = new GuideController();
		ControllerManager.realm = new RealmController();
		// ControllerManager.welfare = new WelfareController();
		ControllerManager.rank = new RankController();
		ControllerManager.sevenDay = new SevenDaysController();
		ControllerManager.checkPoint = new CheckPointController();
		// ControllerManager.rankRush = new RankRushController();
		// ControllerManager.bibleActivity = new BibleActivityController();
		ControllerManager.bossNew = new BossController();
		ControllerManager.forge = new ForgeController();
		ControllerManager.forgeImmortals = new ForgeImmortalsController();
		ControllerManager.forgeImmUpgrade = new ForgeImmUpgradeController();
		ControllerManager.godEquip = new GodEquipController();
		ControllerManager.fluencyCheck = new FluencyCheckController();
		ControllerManager.tip = new TipController();
		ControllerManager.magicWare = new MagicWareController();
		ControllerManager.openRole = new OpenRoleController();
		ControllerManager.train = new TrainController();
		ControllerManager.arena = new ArenaController();
		ControllerManager.propGet = new PropGetController();
		ControllerManager.cultivate = new CultivateController();
		ControllerManager.uniqueSkill = new UniqueSkillController();
		ControllerManager.lottery = new LotteryController();
		ControllerManager.recharge = new RechargeController();
		ControllerManager.rechargeFirst = new RechargefirstController();
		ControllerManager.activity = new ActivityController();
		ControllerManager.activityBoss = new ActivityBossController();
		ControllerManager.welfare2 = new Welfare2Controller();
		ControllerManager.online = new OnlineOnceRewardController();
		ControllerManager.playerOther = new PlayerOtherController();
		ControllerManager.upgradeGuide = new UpgradeGuideController();
		ControllerManager.timeLimitTask = new TimeLimitTaskController();
		ControllerManager.activation = new ActivationController();
		ControllerManager.timeLimitBoss = new TimeLimitBossController();
		ControllerManager.miningHire = new MiningHireController();
		ControllerManager.guildHome = new GuildHomeController();
		ControllerManager.guildActivity = new GuildActivityController();
		ControllerManager.sevenDayMagicWeapon = new SevenDayMagicWeaponController();
		ControllerManager.friend = new FriendController();
		ControllerManager.guildBattle = new GuildBattleController();
		ControllerManager.magicStenController = new MagicWeaponStrengthenController();
		ControllerManager.cross = new CrossController();
		ControllerManager.crossBoss = new CrossBossController();
		ControllerManager.shape = new ShapeController();
		ControllerManager.activitySeven = new ActivitySevenController();
		ControllerManager.qiongCang = new QiongCangController();
		ControllerManager.peak = new PeakController();
		ControllerManager.team2 = new Team2Controller();
		ControllerManager.magicArrayChange = new MagicArrayChangeController();
		ControllerManager.magicWeaponChange = new MagicWeaponChangeController();
		ControllerManager.guildCopy = new GuildCopyController();
		ControllerManager.battleArrayChange = new ShapeBattleChangeController();
		ControllerManager.swordPool = new SwordPoolController();
		ControllerManager.swordPoolChange = new SwordPoolChangeController();
		ControllerManager.bossComing = new BossComingController();
		ControllerManager.exam = new ExamController();
		ControllerManager.gamePlay = new GamePlayController();
		ControllerManager.shapeWingChange = new MagicWingChangeController();
		ControllerManager.crossStair = new CrossStairController();
		ControllerManager.activityLimitRecharge = new ActivityLimitRechargeController();
		ControllerManager.keyboard = new KeyboardController();
		ControllerManager.contest = new ContestController();
		ControllerManager.qualifying = new QualifyingController();
		ControllerManager.specialEquip = new SpecialEquipController();
	}

	public static initLoading(): void {
		ControllerManager.loading = new LoadingController();
	}
	
	public static initCreateRole(): void {
		if (!ControllerManager.createRole) {
			ControllerManager.createRole = new CreateRoleController();
		}
	}

	public static initLogin(): void {
		if (!ControllerManager.login) {
			ControllerManager.login = new LoginController();
		}
	}

	public static initMsgBroadcast(): void {
		if (!ControllerManager.msgBroadcast) {
			ControllerManager.msgBroadcast = new MsgBroadcastController();
		}
	}

	public static getByName(name: string): BaseController {
		let controller: BaseController;
		switch (name) {
			case ModuleEnum[ModuleEnum.Task]:
				controller = ControllerManager.task;
				break;
			case ModuleEnum[ModuleEnum.Home]:
				controller = ControllerManager.home;
				break;
			case ModuleEnum[ModuleEnum.Pack]:
				controller = ControllerManager.pack;
				break;
			case ModuleEnum[ModuleEnum.Daily]:
				controller = ControllerManager.daily;
				break;
			case ModuleEnum[ModuleEnum.CopyHall]:
				controller = ControllerManager.copyHall;
				break;
			case ModuleEnum[ModuleEnum.Rune]:
				controller = ControllerManager.rune;
				break;
			case ModuleEnum[ModuleEnum.TaskDialog]:
				controller = ControllerManager.taskDialog;
				break;
			case ModuleEnum[ModuleEnum.Player]:
				controller = ControllerManager.player;
				break;
			case ModuleEnum[ModuleEnum.Train]:
				controller = ControllerManager.train;
				break;
		}
		return controller;
	}
}