class LangCommon {
    public static LANG1:string = "进入安全区域";
    public static LANG2:string = "离开安全区域";
    public static LANG3:string = "距离太近，不要浪费小飞鞋哦";
    public static LANG4:string = "小飞鞋数量不足";

    public static LANG10:string = "灰色";
    public static LANG11:string = "白色";
    public static LANG12:string = "蓝色";
    public static LANG13:string = "紫色";
    public static LANG14:string = "橙色";
    public static LANG15:string = "红色";
    public static LANG16:string = "粉色";
    public static LANG17:string = "金色";

    public static LANG20:string = "GPU Size：{0}\n" +
        "UI Size：{1}\n" +
        "UI ratio：{2}\n" +
        "同屏玩家数：{3}\n" +
        "场景单位数：{4}\n" +
        "场景特效数：{5}";
    public static L21:string = "数量：<c8>{0}</c8>";
    public static L22:string = "等级：<c8>{0}</c8>";
    public static L23:string = "单个积分：<c8>{0}</c8>";
    public static L24:string = "请复活后再操作";
    public static L25:string = "玩法说明";
    public static L26:string = "确  定";
    public static L27:string = "取  消";
    public static L28:string = "今日不再提示";
    public static L29:string = "活动尚未开启";
    /**倒计时 */
	public static L48:string = "{0}S";

    private static PANEL_TAB_NAME:any = {
        [PanelTabType.Skill]:"技能",
        [PanelTabType.InnerPower]:"内功",
        [PanelTabType.Nerve]:"经脉",
        [PanelTabType.SkillCheats]:"秘籍",
        [PanelTabType.Player]:"角色",
        [PanelTabType.RoleState]:"转生",
        [PanelTabType.UniqueSkill]:"必杀",
        [PanelTabType.KingBattle]:"王者争霸",
        [PanelTabType.Encounter]:"附近的人",
        [PanelTabType.Mining]:"龙脉夺宝",
        [PanelTabType.GamePlay]:"玩法",
        [PanelTabType.PersonalBoss]:"个人",
        [PanelTabType.WorldBoss]:"野外",
        [PanelTabType.SecretBoss]:"秘境",
        [PanelTabType.BossHome]:"BOSS之家",
        [PanelTabType.GodBoss]:"神域",
        [PanelTabType.CopyHallMaterial]:"材料副本",
        [PanelTabType.CopyHallDaily]:"日常副本",
        [PanelTabType.CopyHallTower]:"诛仙塔",
        [PanelTabType.CopyHallLegend]:"五洲探险",
        [PanelTabType.TrainGodWeapon]:"神器",
        [PanelTabType.TrainNobility]:"爵位",
        [PanelTabType.TrainDaily]:"日常",
        [PanelTabType.TrainMedal]:"勋章",
		[PanelTabType.TrainIllustrate]:"图鉴",
        [PanelTabType.GodWingEquip]:"装备",
        [PanelTabType.GodWingCompose]:"合成",
        [PanelTabType.GodWingTransform]:"转换",
        [PanelTabType.Strengthen]:"强化",
        [PanelTabType.Refine]:"精炼",
        [PanelTabType.Casting]:"铸造",
        [PanelTabType.Immortals]:"神兵",
        [PanelTabType.MagicLaw]:"法阵",
        [PanelTabType.LotteryEquip]:"装备",
        [PanelTabType.LotteryRune]:"符文",
        [PanelTabType.LotteryAncient]:"混元",
        [PanelTabType.DragonSoul]:"龙炎甲",
        [PanelTabType.ColorStone]:"五色石",
        [PanelTabType.Wing]:"翅膀",
        [PanelTabType.HeartMethod]:"心法",
        [PanelTabType.ShopProp]:"道具商店",
        [PanelTabType.ShopMystery]:"神秘商店",
        [PanelTabType.FriendMail]:"邮件",
        [PanelTabType.GodEquip]:"神装",
        [PanelTabType.Shura]:"修罗",
        [PanelTabType.RuneInlay]:"镶嵌",
        [PanelTabType.RuneDecompose]:"分解",
        [PanelTabType.GuildNewBasics]:"基础",
        [PanelTabType.GuildNewManager]:"管理",
        [PanelTabType.GuildNewMember]:"成员",
        [PanelTabType.GuildNewList]:"列表",
        [PanelTabType.FashionTitle]:"称号",
        [PanelTabType.FashionClothes]:"衣服",
        [PanelTabType.FashionWeapon]:"武器",
        [PanelTabType.FashionWing]:"翅膀",
        [PanelTabType.GuildVein]:"心法",
        [PanelTabType.GuildBonfire]:"盛会",
        [PanelTabType.VipActive]:"VIP",
        [PanelTabType.VipGiftPackage]:"VIP礼包",
        [PanelTabType.FriendContact]:"最近",
        [PanelTabType.Friend]:"好友",
        [PanelTabType.FriendApply]:"申请",
        [PanelTabType.FriendShield]:"屏蔽",
        [PanelTabType.MagicWeaponStarUp] : "升星",
        [PanelTabType.MagicWeaponCopy] : "副本",
        [PanelTabType.Pet] : "宠物",
        [PanelTabType.QiongCangBoss] : "穹苍圣殿",
        [PanelTabType.QiongCangCopy] : "穹苍幻境",
        [PanelTabType.QCSmelt] : "圣物合成",
        [PanelTabType.CrossBoss] : "宠物岛",
        [PanelTabType.CrossDropLog] : "跨服掉落",
        [PanelTabType.CrossBossCross] : "宠物岛",
        [PanelTabType.CrossBossGuild] : "凶兽入侵",
        [PanelTabType.CrossEntrance] : "跨服战场",
        [PanelTabType.TalentCultivate] : "天赋",
        [PanelTabType.PeakMain] : "巅峰赛季",
        [PanelTabType.PeakReward] : "赛季奖励",
        [PanelTabType.PeakShop] : "巅峰商城",
        [PanelTabType.PeakChipsShop] : "仙运商城",
        [PanelTabType.PeakWorship] : "膜拜",
        [PanelTabType.ContestQualification] : "资格赛",
        [PanelTabType.ContestMain] : "守擂赛",
        [PanelTabType.ContestReward] : "守擂奖励",
        [PanelTabType.ContestShop] : "守擂商城",
        [PanelTabType.ContestExchange] : "兑换",
        [PanelTabType.Team2] : "跨服组队",
        [PanelTabType.GuildTeam]:"仙盟BOSS",
        [PanelTabType.PackEquip] : "装备",
        [PanelTabType.PackProp] : "道具",
        [PanelTabType.PackRune] : "符文",
        [PanelTabType.PackSmelt] : "合成",
        [PanelTabType.ShapeBattle]: "战阵",
        [PanelTabType.Mount] : "坐骑",
        [PanelTabType.ShapeSwordPool] : "剑池",
        [PanelTabType.BeastBattle] : "神兽助战",
        [PanelTabType.QualifyingMain] : "匹配",
        [PanelTabType.QualifyingRank] : "排行",
        [PanelTabType.QualifyingStandard] : "达标",
        [PanelTabType.QualifyingStage] : "段位"
    };

    public static getTabName(type:PanelTabType):string {
        let tabName:string = LangCommon.PANEL_TAB_NAME[type];
        if(!tabName) return PanelTabType[type];
        return tabName;
    }
}