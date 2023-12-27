/**副本相关枚举 */
class CopyEnum {
	// -------------- 特殊副本id枚举
	/**九幽副本 id*/
	public static CopyExp:number = 5103; //15103 5103
	public static CopyExpSingle:number = 15103; //15103 5103

	/**新的经验副本 */
	public static CopyExpNew:number = 701;

	/**诛仙塔 id*/
	public static CopyTower:number = 2001;
		
	/**世界boss副本id（野外boss） */
	public static CopyWorldBoss:number = 801;//5201;
	public static CopyWorldBoss2:number = 3900;//野外boss（新刷新规则）
	
	/**野外boss指引副本 */
	public static WorldBossGuide:number = 4001;
	/**秘境boss */
	public static CopySecretBoss:number = 802;
	/**boss之家副本id */
	public static CopyBossHome:number = 3400;
	/**神域boss副本id */
	public static CopyGodBoss:number = 3500;
	/**7001副本（首领试炼） */
	public static CopyLeader:number = 7001;
	public static CopyLeaderMapId:number = 201101;//对应副本地图id
	/**7002副本（降服小鬼怪） */
	public static CopyGhosts:number = 7002;
	public static CopyGhostsMapId:number = 201108;
	/**7003副本（心魔之乱） */
	public static CopyDisorderly:number = 7003;
	public static CopyDisorderlyMapId:number = 201105;
	/**20级个人boss的副本id */
	public static PERSONAL_BOSS_LV20:number = 601;

	/**守护神剑副本 所有SPlayCopy都是根据这个id查找 */
	public static CopyDefend:number = 2202;

	/**仙帝宝库副本 所有SPlayCopy都是根据这个id查找 */
	public static CopyMoney:number = 1008;
	/**神兽入侵 */
	public static CopyCrossGuildBoss:number = 6106;

	/**三界争霸 */
	public static CopyForceWar:number = 5001;
	/**圣灵副本 */
	public static CopyBlood:number = 5401;	
	/**法宝副本code */
	public static CopySpirit:number = 5701;
	/**双生乐园副本 */
	public static CopyLost:number = 6001;
	/**宠物副本 */
	public static CopyPet:number = 6701;

	/**玉清之巅 */
	public static CopyYuQing:number = 9000;
    /**关卡副本 id*/
    public static CopyCheckPoint:number = 901;
	/**王者争霸 */
	public static CopyKingBattle:number = 501;
	//附近的人（遭遇战副本）有多个副本code用最小的那个
	public static CopyEncounter:number = 1301;
	/**矿洞场景 */
	public static CopyMining:number = 1401;
	/**矿洞挑战 */
	public static CopyMiningChallenge:number = 1402;
	/**限时世界boss */
	public static TimeLimitBoss:number = 3600;

	/**阵地争夺 */
	public static CopyPositionExp:number = 6102;
	/**仙盟争霸 */
	public static CopyGuildBattle:number = 6104;
	
	/**仙盟组队副本，最小副本code */
	public static CopyGuildTeam:number = 6002;

	/**传奇之路 */
	public static CopyLegend:number = 2801;

	/**3V3 */
	public static CopyQualifying:number = 6108;
	/**
	 * 守护仙女 副本
	 */
	//public static DefendFairy:number = 7004;
	
	/**穹苍圣殿 */
	public static QiongCangBoss:number = 3601;
	/**穹苍幻境 */
	public static CopyQC:number = 3603;
	/**跨服组队 */
	public static CopyCrossTeam:number = 2901;
	/**暗之秘境 */
	public static DarkSecret:number = 3901;
	/**仙盟守护 */
	public static GuildDefend:number = 6003;

	//-------------- 其他常量枚举
	/**副本内加BUff类型 鼓舞 */
	public static BuffInspire:number = 1;
	/**副本内加BUff类型 效率 */
	public static BuffExp:number = 2;

	/**银两鼓舞每次消耗 */
	public static INSPIRE_COIN_COST:number = 2000;
	/**元宝鼓舞每次消耗 */
	public static INSPIRE_GOLD_COST:number = 5;
	// -------
	public static INSPRITE_COIN:number = 1;
	public static INSPRITE_GOLD:number = 2;

	/**材料副本可以直接免战斗的转数 */
	public static MATERIAL_ROLE_STATE:number = 	5;

	/**自动匹配进入副本 */
	public static ENTER_MODEL_AUTO:number = 0;
	/**单人进入副本 */
	public static ENTER_MODEL_SINGLE:number = 1;
	/**组队进入副本 */
	public static ENTER_MODEL_TEAM:number = 2;

	/**副本最大鼓励次数,元宝和金钱都是5次 */
	public static COPY_INSPIRE_MAX:number = 5;

	/**最大疲劳值 */
	public static TIRE_MAX_VALUE:number = 3;

	/**扫荡等级 */
	public static DELEGATE_LV:number = 300;
	/**副本九幽通行证(非绑) */
	public static ExpCopyItem:number = 41990001;
	/**扫荡卷id */
	public static DelegateItem:number = 42140002;
	/**扫荡副本消耗的物品数量 */
	public static DelegateItemCost:number = 3;

	//--------------副本扫荡类型的枚举

	/**通关一次就可以扫荡的副本 0 */
	public static DELEGATE_TYPE_FIGHT:number = 0;
	/**不需要打 就可以直接扫荡的副本 1 */
	public static DELEGATE_TYPE_ONLY:number = 1;
	/**守护神剑刷幸运boss最大次数 */
	public static DLG_DF_CP:number = 3;

	///------------副本时间提示类型
	/**离开副本倒计时 */
	public static TIME_TYPE1:number = 1;
	/**更新波数倒计时  */
	public static TIME_TYPE2:number = 2;
	/** 开启副本倒计时  */
	public static TIME_TYPE3:number = 3;			

}