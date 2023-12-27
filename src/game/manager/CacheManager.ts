/**缓存管理 */
class CacheManager {
	public static serverTime: ServerTimeCache;
	public static player: PlayerCache;
	public static role: RoleCache;
	public static buff: BuffCache;
	public static pack: PackCache;
	public static packQuickUse:PackQuickUseCache;
	public static msg: MsgBoardcastCache;
	public static refine: RefineCache;
	public static wing: WingCache;
	public static skill: SkillCache;
	public static spirit: SpiritCache;
	public static magic: MagicCache;
	public static cloak: CloakCache;
	public static sysSet: SysSetCache;
	public static map: MapCache;
	public static ancientEquip:AncientEquipCache;
	public static battle: BattleCache;
	public static task: TaskCache;
	public static timeLimitTask: TimeLimitTaskCache;
	public static copy: CopyCache;
	public static towerTurnable:TowerTurntableCache;
	public static cheats:SkillCheatsCache;
	public static king: KingCache;
	public static res: ResCache;
	public static clothesFashion: ClothesFashionCache;
	public static weaponFashion: WeaponFashionCache;
	public static boss: BossCache;
	public static worldMap: WorldMapCache;
	public static guild: GuildCache;
	public static guildNew:GuildnewCache;
	public static vip: VipCache;
	public static vipGift: VipGiftCache;
	public static rune: RuneCache;
	public static chat: ChatCache;
	public static effect: EffectCache;
	public static team: TeamCache;
	public static shop: ShopCache;
	public static daily: DailyCache;
	public static achievement: AchievementCache;
	public static realm: RealmCache;
	public static title: TitleCache;
	public static welfare: WelfareCache;
	public static rank: RankCache;
	public static checkPoint: CheckPointCache;
	public static sevenDay: SevenDaysCache;
	public static bibleActivity: BibleActivityCache;
	public static bossNew: BossNewCache;
	public static forge: ForgeCache;
	public static forgeImmortals:ForgeImmortalsCache;
	public static godEquip: GodEquipCache;
	public static godWing:GodWingCache;
	public static magicWare: MagicWareCache;
	public static train: TrainCache;
	public static godWeapon: GodWeaponCache;
	public static platform:PlatformCache;
	public static medal:MedalCache;
	public static arena: ArenaCache;
	public static cultivate: CultivateCache;
	public static guide: GuideCache;
	public static nobility:NoBilityCache;
	public static lottery:LotteryCache;
	public static uniqueSkill: UniqueSkillCache;
	public static recharge:RechargeCache;
	public static activity:ActivityCache;
	public static mail: MailCache;
	public static welfare2: Welfare2Cache;
	public static encounter: EncounterCache;
	public static fashionPlayer: FashionPlayerCache;
	public static timeLimitBoss:TimeLimitBossCache;
	public static mining:MiningCache;
	public static posOccupy:ExpPosOccupyCache;
	public static sevenDayMagicWeapon: SevenDayMagicWeaponCache;
	public static guildActivity: GuildActivityCache;
	public static campBattle:CampBattleCache;
	public static guildDefend:GuildDefendCache;
	public static shura: ShuraCache;
	public static qcCopy:QCCopyCache;
	public static friend: FriendCache;
	public static guildBattle:GuildBattleCache;
	public static crossBoss:CrossBossCache;
	public static magicWeaponStrengthen : MagicWeaponStrengthenCache;
	public static shape: ShapeCache;
	public static pet: PetCache;
	public static petChange: PetChangeCache;
	public static mount: MountCache;
	public static mountChange: MountChangeCache;
	public static resurgence: ResurgenceCache;
	public static activitySeven:ActivitySevenCache;
	public static heartMethod : HeartMethodCache;
	public static talentCultivate: TalentCultivateCache;
	public static peak: PeakCache;
	public static certification : CertificationCache;
	public static team2 : Team2Cache;
	public static magicArray : MagicArrayCache;
	public static magicArrayChange : MagicArrayChangeCache;
	public static magicWeaponChange: MagicWeaponChangeCache;
	public static battleArray : BattleArrayCache;
	public static battleArrayChange : ShapeBattleChangeCache;
	public static guildCopy : GuildCopyCache;
	public static swordPool : SwordPoolCache;
	public static swordPoolChange : SwordPoolChangeCache;
	public static exam: ExamCache;
	public static compose: ComposeCache;
	public static shapeWing : MagicWingCache;
	public static shapeWingChange : MagicWingChangeCache;
	public static crossStair:CrossStairCache;
	public static beastBattle: BeastBattleCache;
    public static contest: ContestCache;
    public static qualifying: QualifyingCache;
	public static runeShop: RuneShopCache;

	public static isInit:boolean = false;
	public static init() {
		CacheManager.serverTime = new ServerTimeCache();
		if (!CacheManager.player) {
			CacheManager.player = new PlayerCache();
		}
		if (!CacheManager.role) {
			CacheManager.role = new RoleCache();
		}
		CacheManager.buff = new BuffCache();
		CacheManager.pack = new PackCache();
		CacheManager.packQuickUse = new PackQuickUseCache();
		CacheManager.msg = new MsgBoardcastCache();
		CacheManager.refine = new RefineCache();
		CacheManager.wing = new WingCache();
		CacheManager.skill = new SkillCache();
		CacheManager.spirit = new SpiritCache();
		CacheManager.magic = new MagicCache();
		CacheManager.cloak = new CloakCache();
		CacheManager.sysSet = new SysSetCache();
		CacheManager.map = new MapCache();
		CacheManager.qcCopy = new QCCopyCache();
		CacheManager.ancientEquip = new AncientEquipCache();
		CacheManager.battle = new BattleCache();
		CacheManager.task = new TaskCache();
		CacheManager.timeLimitTask = new TimeLimitTaskCache();
		CacheManager.copy = new CopyCache();
		CacheManager.towerTurnable = new TowerTurntableCache();
		CacheManager.cheats = new SkillCheatsCache();
		CacheManager.king = new KingCache();
		if (!CacheManager.res) {
			CacheManager.res = new ResCache();
		}
		// CacheManager.res = new ResCache();
		CacheManager.clothesFashion = new ClothesFashionCache();
		CacheManager.weaponFashion = new WeaponFashionCache();
		CacheManager.boss = new BossCache();
		CacheManager.worldMap = new WorldMapCache();
		CacheManager.guild = new GuildCache();
		CacheManager.guildNew = new GuildnewCache();
		CacheManager.vip = new VipCache();
		CacheManager.vipGift = new VipGiftCache();
		CacheManager.rune = new RuneCache();
		CacheManager.chat = new ChatCache();
		CacheManager.effect = new EffectCache();
		CacheManager.team = new TeamCache();
		CacheManager.shop = new ShopCache();
		CacheManager.daily = new DailyCache();
		CacheManager.achievement = new AchievementCache();
		CacheManager.realm = new RealmCache();
		CacheManager.title = new TitleCache();
		CacheManager.welfare = new WelfareCache();
		CacheManager.rank = new RankCache();
		CacheManager.checkPoint = new CheckPointCache();
		CacheManager.sevenDay = new SevenDaysCache();
		CacheManager.bibleActivity = new BibleActivityCache();
		CacheManager.bossNew = new BossNewCache();
		CacheManager.forge = new ForgeCache();
		CacheManager.forgeImmortals = new ForgeImmortalsCache();
		CacheManager.godEquip = new GodEquipCache();
		CacheManager.godWing = new GodWingCache();
		CacheManager.magicWare = new MagicWareCache();
		CacheManager.train = new TrainCache();
		CacheManager.godWeapon = new GodWeaponCache();
		CacheManager.platform = new PlatformCache();
		CacheManager.medal = new MedalCache(); 
		CacheManager.arena = new ArenaCache();
		CacheManager.cultivate = new CultivateCache();
		CacheManager.guide = new GuideCache();
		CacheManager.nobility = new NoBilityCache();
		CacheManager.lottery = new LotteryCache();
		CacheManager.uniqueSkill = new UniqueSkillCache();
		CacheManager.recharge = new RechargeCache();
		CacheManager.activity = new ActivityCache();
		CacheManager.mail = new MailCache();
		CacheManager.welfare2 = new Welfare2Cache();
		CacheManager.encounter = new EncounterCache();
		CacheManager.fashionPlayer = new FashionPlayerCache();
		CacheManager.timeLimitBoss = new TimeLimitBossCache();
		CacheManager.mining = new MiningCache();
		CacheManager.posOccupy = new ExpPosOccupyCache();
		CacheManager.sevenDayMagicWeapon = new SevenDayMagicWeaponCache();
		CacheManager.guildActivity = new GuildActivityCache();
		CacheManager.campBattle = new CampBattleCache();
		CacheManager.guildDefend = new GuildDefendCache();
		CacheManager.shura = new ShuraCache();
		CacheManager.friend = new FriendCache();
		CacheManager.guildBattle = new GuildBattleCache();
		CacheManager.crossBoss = new CrossBossCache();
		CacheManager.magicWeaponStrengthen = new MagicWeaponStrengthenCache();
		CacheManager.shape = new ShapeCache();
		CacheManager.pet = new PetCache();
		CacheManager.petChange = new PetChangeCache();
		CacheManager.mount = new MountCache();
		CacheManager.mountChange = new MountChangeCache();
		CacheManager.resurgence = new ResurgenceCache();
		CacheManager.activitySeven = new ActivitySevenCache();
		CacheManager.heartMethod = new HeartMethodCache();
		CacheManager.talentCultivate = new TalentCultivateCache();
		CacheManager.peak = new PeakCache();
		CacheManager.certification = new CertificationCache();
		CacheManager.team2 = new Team2Cache();
		CacheManager.magicArray = new MagicArrayCache();
		CacheManager.magicArrayChange = new MagicArrayChangeCache();
		CacheManager.magicWeaponChange = new MagicWeaponChangeCache();
		CacheManager.battleArray = new BattleArrayCache();
		CacheManager.battleArrayChange = new ShapeBattleChangeCache();
		CacheManager.guildCopy = new GuildCopyCache();
		CacheManager.swordPool = new SwordPoolCache();
		CacheManager.swordPoolChange = new SwordPoolChangeCache();
		CacheManager.exam = new ExamCache();
		CacheManager.compose = new ComposeCache();
		CacheManager.shapeWing = new MagicWingCache();
		CacheManager.shapeWingChange = new MagicWingChangeCache();
		CacheManager.crossStair = new CrossStairCache();
		CacheManager.beastBattle = new BeastBattleCache();
		CacheManager.contest = new ContestCache();
		CacheManager.qualifying = new QualifyingCache();
		CacheManager.runeShop = new RuneShopCache();

		CacheManager.isInit = true;
        EventManager.addListener(NetEventEnum.SocketClose,CacheManager.onSocketClostHandler,CacheManager);
	}

	public static initCreateRole(): void {
		if (!CacheManager.role) {
			CacheManager.role = new RoleCache();
		}
		if (!CacheManager.player) {
			CacheManager.player = new PlayerCache();
		}
		if (!CacheManager.res) {
			CacheManager.res = new ResCache();
		}
	}

	public static initPlayer(): void {
		CacheManager.player = new PlayerCache();
	}


	private static onSocketClostHandler():void {
		Log.trace(Log.RPG,"onSocketClostHandler断开连接");
		CacheManager.clear();
	}

	private static clear():void {
		if(!CacheManager.isInit) return;
		CacheManager.copy.clear();
        CacheManager.timeLimitBoss.clear();
        CacheManager.posOccupy.clear();
        CacheManager.campBattle.clear();
		CacheManager.guildBattle.clear();
		CacheManager.guildCopy.clear();
		CacheManager.team2.clear();
		CacheManager.bossNew.clear();
	}
}