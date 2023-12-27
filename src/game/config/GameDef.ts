/**
 * 游戏中定义枚举对应的中文名称
 */

class GameDef {
	public static EJewel = EJewel;
	public static ToolTipOptEnum = ToolTipOptEnum;
	public static ToolTipSouceEnum = ToolTipSouceEnum;
	public static MenuOperationEnum = MenuOperationEnum;
	public static EGuildWarehouseRecordType = EGuildWarehouseRecordType;

	/**物品大类 */
	public static ECategory: any = {
		"1": "装备",
		"2": "外形卡",
		"3": "药品",
		"4": "道具",
		"5": "宝石",
		"6": "材料",
		"7": "任务物品",
		"8": "符文"
	}

	/**金钱类型名称 */
	public static EPriceUnitName: any = {
		"1": "铜钱",
		"2": "元宝",
		"3": "绑定元宝",
		"4": "荣誉",
		"5": "金券",
		"6": "声望",
		"7": "礼券",
		"8": "副本积分",
		"9": "仙盟贡献",
		"10": "灵气",
		"11": "聚气",
		"12": "声望",
		"13": "五行聚魂值",
		"14": "新精力值",
		"15": "仙宠币",
		"16": "魔石",
		"17": "功勋（远古竞技场）",
		"18": "破碎元神(猎命)",
		"19": "龙宫币",
		"20": "天宫币",
		"21": "仙魂碎片",
		"22": "体力值",
		"23": "积分",
		"24": "紫色魂力",
		"25": "金色魂力",
		"26": "橙色魂力",
		"27": "EPriceUnitAdvantageIntimate",
		"28": "EPriceUnitActivityValue",
		"29": "仙盟贡献",
		"30": "仙盟资金",
		"31": "EPriceUnitReiki",
		"34": "符文精华",
		"35": "符文碎片",
		"44": "修为",
		"45": "初级必杀精华",
		"46": "高级必杀精华",
		"48": "图鉴经验",
		"49": "天赋经验",
		"50": "仙运",
		"51": "神兽强化经验",
		"52": "斗魂",
	};

	/**装备类型 */
	public static EEquip: any = {
		"1": "武器",
		"2": "项链",
		"3": "手镯",
		"4": "戒指",
		"5": "护符",
		"6": "护手",
		"7": "衣服",
		"8": "裤子",
		"9": "头盔",
		"10": "鞋子",
		"11": "守护",
		"12": "官印"
	}

	/**装备类型 */
	public static EShapePetEquipType: any = {
		"1": "灵簪",
		"2": "灵佩",
		"3": "灵冠",
		"4": "灵珠"
	}

	public static EShapeMountEquipType: any = {
		"1": "缰绳",
		"2": "鞍饰",
		"3": "马镫",
		"4": "足饰"
	}

	public static EShapeLawEquipType: any = {
		"1": "阵眼",
		"2": "阵灵",
		"3": "阵纹",
		"4": "阵决"
	}

	public static EShapeBattleEquipType : any = {
		"1": "阵魂",
		"2": "阵尘",
		"3": "阵芒",
		"4": "阵印"
	}

	public static EShapeSwordPoolEquipType : any = {
		"1": "剑刃",
		"2": "剑柄",
		"3": "剑格",
		"4": "剑穗"
	}

	/**装备类型 */
	public static EBeastEquipType: any = {
		"1": "兽角",
		"2": "兽牙",
		"3": "兽甲",
		"4": "兽爪",
		"5": "兽瞳"
	}
	
	/**装备基础属性名称 */
	public static EquipBaseAttrName: any = {
		[EEquipCombatAttr[EEquipCombatAttr.baseLife]]: "生命",
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalAttack]]: "攻击",
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalDefense]]: "防御",
		[EEquipCombatAttr[EEquipCombatAttr.basePass]]: "破甲",
		// "": "坚韧",
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalCrit]]: "暴击",
		// "": "闪避",
		// "": "命中"
	}

	/**装备基础属性对应的类型 */
	public static EquipBaseAttrType: any = {
		[EEquipCombatAttr[EEquipCombatAttr.baseLife]]: EJewel.EJewelLife,
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalAttack]]: EJewel.EJewelPhysicalAttack,
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalDefense]]: EJewel.EJewelPhysicalDefense,
		[EEquipCombatAttr[EEquipCombatAttr.basePass]]: EJewel.EJewelPass,
		[EEquipCombatAttr[EEquipCombatAttr.baseHit]]: EJewel.EJewelHit,
		[EEquipCombatAttr[EEquipCombatAttr.basePhysicalCrit]]: EJewel.EJewelPhysicalCrit,
		[EEquipCombatAttr[EEquipCombatAttr.baseJouk]]: EJewel.EJewelJouk,
		[EEquipCombatAttr[EEquipCombatAttr.baseToughness]]: EJewel.EJewelToughness
		// "": "闪避",
		// "": "命中"
	}

	public static NumberName: any = {
		"0": "零",
		"1": "一",
		"2": "二",
		"3": "三",
		"4": "四",
		"5": "五",
		"6": "六",
		"7": "七",
		"8": "八",
		"9": "九",
		"10": "十",
		"11": "十一",
		"12": "十二",
		"13": "十三",
		"14": "十四",
		"15": "十五",
		"16": "十六",
		"17": "十七",
		"18": "十八",
		"19": "十九",
		"20": "二十",
		"21": "二十一",
		"22": "二十二",
		"23": "二十三",
		"24": "二十四",
		"25": "二十五",
		"26": "二十六",
		"27": "二十七",
		"28": "二十八",
		"29": "二十九",
		"30": "三十"
	}

	/**ToolTip操作名称 ToolTipOptEnum*/
	public static ToolTipOptName: any = {
		[ToolTipOptEnum.Use]: "使用",
		[ToolTipOptEnum.Split]: "拆分",
		[ToolTipOptEnum.Sell]: "出售",
		[ToolTipOptEnum.Fetch]: "取出",
		[ToolTipOptEnum.Store]: "存入",
		[ToolTipOptEnum.Dress]: "装备",
		[ToolTipOptEnum.Undress]: "卸下",
		[ToolTipOptEnum.Replace]: "更换装备",
		[ToolTipOptEnum.Strengthen]: "强化",
		[ToolTipOptEnum.Putaway]: "上架",
		[ToolTipOptEnum.Buy]: "购买",
		[ToolTipOptEnum.Renew]: "续费",
		[ToolTipOptEnum.GuildKickOut]: "踢出仙盟",
		[ToolTipOptEnum.GuildTransferLeader]: "转让盟主",
		[ToolTipOptEnum.GuildPromoteDeputyLeader]: "升为副盟主",
		[ToolTipOptEnum.GuildPromotePresbyter]: "升为长老",
		[ToolTipOptEnum.GuildRelieveDeputyLeader]: "解除副盟主",
		[ToolTipOptEnum.GuildRelievePresbyter]: "解除长老",
		[ToolTipOptEnum.ViewPlayerInfo]: "查看信息",
		[ToolTipOptEnum.SendFlower]: "赠送鲜花",
		[ToolTipOptEnum.ChatStart]: "开始聊天",
		[ToolTipOptEnum.FriendAdd]: "添加好友",
		[ToolTipOptEnum.FriendDel]: "删除好友",
		[ToolTipOptEnum.GroupInvite]: "邀请入队",
		[ToolTipOptEnum.GroupApply]: "申请入队",
		[ToolTipOptEnum.FriendBlack]: "加入黑名单",
		[ToolTipOptEnum.Donate]: "捐献",
		[ToolTipOptEnum.Destroy]: "销毁",
		[ToolTipOptEnum.GuildWarehouseExchange]: "兑换",
		[ToolTipOptEnum.ComposeUnDress]: "卸下"

	}

	//来源类型对应操作列表
	public static ToolTipOptList: any = {
		[ToolTipSouceEnum.None]: [],
		[ToolTipSouceEnum.GuildDonateWindow]: [ToolTipOptEnum.Donate],
		[ToolTipSouceEnum.GuildWarehouse]: [ToolTipOptEnum.Destroy, ToolTipOptEnum.GuildWarehouseExchange],
		[ToolTipSouceEnum.ShopMall]: [ToolTipOptEnum.Buy]
	}

	//宝石小类、通用属性--
	public static EJewelName: any = {
		[EJewel.EJewelPhysicalAttack]: ["攻击", "攻击", "攻   击"],
		[EJewel.EJewelLife]: ["生命", "生命", "生   命"],
		[EJewel.EJewelPass]: ["破甲", "破甲", "破   甲"],
		[EJewel.EJewelPhysicalDefense]: ["防御", "防御", "防   御"],
		[EJewel.EJewelJouk]: ["闪避", "闪避", "闪   避"],
		[EJewel.EJewelHit]: ["命中", "命中", "命   中"],
		[EJewel.EJewelPhysicalCrit]: ["暴击", "暴击", "暴   击"],
		[EJewel.EJewelToughness]: ["坚韧", "坚韧", "坚   韧"],
		[EJewel.EJewelCritDamage]: ["暴击伤害", "暴击伤害", "暴击伤害"],

		[EJewel.EJewelWuxingAttack]: ["五行攻击", "五行攻击", "五行攻击"],
		[EJewel.EJewelWuxingDefense]: ["五行防御", "五行防御", "五行防御"],

		[EJewel.EJewelPhysicalAttackLevelAdd]: ["攻击加成", "攻击加成", "攻击加成"],
		[EJewel.EJewelLifeLevelAdd]: ["生命加成", "生命加成", "生命加成"],
		[EJewel.EJewelPassLevelAdd]: ["破甲加成", "破甲加成", "破甲加成"],
		[EJewel.EJewelPhysicalDefenseLevelAdd]: ["防御加成", "防御加成", "防御加成"],
		[EJewel.EJewelJoukLevelAdd]: ["闪避加成", "闪避加成", "闪避加成"],
		[EJewel.EJewelHitLevelAdd]: ["命中加成", "命中加成", "命中加成"],
		[EJewel.EJewelPhysicalCritLevelAdd]: ["暴击加成", "暴击加成", "暴击加成"],
		[EJewel.EJewelToughnessLevelAdd]: ["坚韧加成", "坚韧加成", "坚韧加成"],

		[EJewel.EJewelPhysicalAttackPercentage]: ["攻击加成", "攻击加成", "攻击加成"],
		[EJewel.EJewelLifePercentage]: ["生命加成", "生命加成", "生命加成"],
		[EJewel.EJewelPassPercentage]: ["破甲加成", "破甲加成", "破甲加成"],
		[EJewel.EJewelPhysicalDefensePercentage]: ["防御加成", "防御加成", "防御加成"],
		[EJewel.EJewelJoukPercentage]: ["闪避加成", "闪避加成", "闪避加成"],
		[EJewel.EJewelHitPercentage]: ["命中加成", "命中加成", "命中加成"],
		[EJewel.EJewelPhysicalCritPercentage]: ["暴击加成", "暴击加成", "暴击加成"],
		[EJewel.EJewelToughnessPercentage]: ["坚韧加成", "坚韧加成", "坚韧加成"],
		[EJewel.EJewelStrengthPercentage]: ["强化加成", "强化加成", "强化加成"],
		[EJewel.EJewelWuxingAttackPercentage]: ["五行攻击加成", "五行攻击加成", "五行攻击加成"],
		[EJewel.EJewelWuxingDefensePercentage]: ["五行防御加成", "五行防御加成", "五行防御加成"],
        [EJewel.EJewelOutputDamage]: ["伤害增加", "伤害增加", "伤害增加"],
        [EJewel.EJewelSufferDamage]: ["伤害减免", "伤害减免", "伤害减免"],
		[EJewel.EJewelSkyDamage]: ["剑气伤害"],
		[EJewel.EJewelSpringRecovery]: ["回春恢复"],
		[EJewel.EJewelDevialDamage]: ["修罗怒斩"],

		[EJewel.EJewelOutPutDamageRate]: ["伤害加深", "伤害加深", "伤害加深"],
		[EJewel.EJewelSufferDamageRate]: ["吸收伤害", "吸收伤害", "吸收伤害"],
		[EJewel.EJewelOutPutCritDamageRate]: ["暴击伤害", "暴击伤害", "暴击伤害"],
		[EJewel.EJewelSufferCritDamageRate]: ["受到暴击伤害", "受到暴击伤害", "受到暴击伤害"],
		[EJewel.EJewelDamageReboundRate]: ["伤害反弹", "伤害反弹", "伤害反弹"],
		[EJewel.EJewelPetOutPutDamageRate]: ["宠物输出伤害", "宠物输出伤害", "宠物输出伤害"],
		[EJewel.EJewelSpiritOutPutDamageRate]: ["法宝输出伤害", "法宝输出伤害", "法宝输出伤害"],
		[EJewel.EJewelCritRate]: ["暴击几率", "暴击几率", "暴击几率"],
		[EJewel.EJewelJoukRate]: ["闪避几率", "闪避几率", "闪避几率"],
		[EJewel.EJewelDropCoinRate]: ["掉落铜钱", "掉落铜钱", "掉落铜钱"],
		[EJewel.EJewelDropItemRate]: ["掉落物品", "掉落物品", "掉落物品"],
		[EJewel.EJewelDropExpRate]: ["杀怪经验", "杀怪经验", "杀怪经验"],

		[EJewel.EJewelKnowingRate]: ["会心几率", "会心几率", "会心几率"],
		[EJewel.EJewelBlockRate]: ["格挡几率", "格挡几率", "格挡几率"],
		[EJewel.EJewelArmorRate]: ["人物护甲", "人物护甲", "人物护甲"],
		[EJewel.EJewelCritDefenseRate]: ["暴击抵抗", "暴击抵抗", "暴击抵抗"],
		[EJewel.EJewelSkillHurtRate]: ["技能伤害", "技能伤害", "技能伤害"],

		[EJewel.EJewelArmorLifePercentage]: ["防具生命", "防具生命", "防具生命"],
		[EJewel.EJewelArmorDefensePercentage]: ["防具防御", "防具防御", "防具防御"],
		[EJewel.EJewelWeaponAttackPercentage]: ["武器攻击", "武器攻击", "武器攻击"],
		[EJewel.EJewelWeaponPassPercentage]: ["武器破甲", "武器破甲", "武器破甲"],
		[EJewel.EJewelJewelryAttackPercentage]: ["仙器攻击", "仙器攻击", "仙器攻击"],
		[EJewel.EJewelEquipAttackPercentage]: ["基础攻击", "基础攻击", "基础攻击"],
		[EJewel.EJewelEquipLifePercentage]: ["基础生命", "基础生命", "基础生命"],
		[EJewel.EJewelEquipPassPercentage]: ["基础破甲", "基础破甲", "基础破甲"],
		[EJewel.EJewelEquipDefensePercentage]: ["基础防御", "基础防御", "基础防御"],

		[EJewel.EJewelWeaponBasePercentage]: ["武器基础属性", "武器基础属性", "武器基础属性"],
		[EJewel.EJewelHelmetBasePercentage]: ["手镯基础属性", "手镯基础属性", "手镯基础属性"],
		[EJewel.EJewelWristletBasePercentage]: ["护符基础属性", "护符基础属性", "护符基础属性"],
		[EJewel.EJewelShoulderBasePercentage]: ["护腕基础属性", "护腕基础属性", "护腕基础属性"],
		[EJewel.EJewelClothesBasePercentage]: ["衣服基础属性", "衣服基础属性", "衣服基础属性"],
		[EJewel.EJewelBeltBasePercentage]: ["裤子基础属性", "裤子基础属性", "裤子基础属性"],
		[EJewel.EJewelGlovesBasePercentage]: ["头盔基础属性", "头盔基础属性", "头盔基础属性"],
		[EJewel.EJewelShoesBasePercentage]: ["鞋子基础属性", "鞋子基础属性", "鞋子基础属性"],

		[EJewel.EJewelHallowBasePercentage]: ["神器基础属性", "神器基础属性", "神器基础属性"],
		[EJewel.EJewelKnowingHurtRate]: ["会心伤害", "会心伤害", "会心伤害"],
		[EJewel.EJewelSkillReliefRate]: ["技能减伤", "技能减伤", "技能减伤"]
	}

	/**技能范围类型 */
	public static SkillTargetName: any = {
		"1": "单体目标",
		"2": "群体目标",
		"3": "扇形范围",
		"4": "直线范围",
		"6": "圆形范围"
	}

	/**技能使用类型 */
	public static ESkillUseTypeName: any = {
		"-1": "更新中...",
		"0": "主动技能",
		"1": "被动效果",
		"2": "被动效果",
		"4": "被动效果",
		"8": "被动效果",
		"16": "永久增益",
		"32": "被动效果",
		"64": "被动效果",
		"128": "被动效果",
		"256": "被动效果",
		"512": "主动技能",
		"1024": "被动效果",
		"2048": "被动效果"
	}

	/**外观名称 */
	public static EShapeName: any = {
		"1": "坐骑",
		"2": "宠物",
		"3": "神兵",
		"4": "翅膀",
		"5": "法阵",
		"6": "法宝",
		"8": "披风",
		"9": "战阵",
		"10": "剑池",
	}

	/**任务名称 */
	public static TaskGroupShortName: any = {
		"1": "主",
		"2": "支",
		"4": "护",
		"17": "转",
		"23": "赏",
		"24": "盟",
		"25": "引",
	}

	public static TaskGroupName: any = {
		"23": "赏金任务",
		"24": "仙盟任务",
	}

	/**外观名称 */
	public static ColorName: any = {
		"0": "灰色",
		"1": "白色",
		"2": "蓝色",
		"3": "紫色",
		"4": "橙色",
		"5": "红色",
		"6": "金色",
		"7": "粉色",
	}

	/**
	 * 装备类型对应位置
	 */
	public static EquipTypeIndex:any = {
		"1": 0,//武器
		"9": 1,//头盔
		"5": 2,//仙符，护符
		"7": 3,//衣服
		"6": 4,//护手
		"8": 5,//裤子
		"3": 6,//手镯
		"10": 7,//鞋子
	}

	// /**跳转名称 */
	// public static gotoEnumName:any = {
	// 	"Smelt": "熔炼装备",
	// 	"CopyMaterial": "材料副本",
	// 	"BossCountry": "参与击杀野外BOSS",
	// 	"Area": "王者争霸",
	// 	"GodBoss": "神域BOSS",
	// 	"Encounter": "击杀附近的人",
	// 	"TrainNobility": "爵位",
	// 	"Mining":"龙脉夺宝",
	// 	"CheckPoint": "通关关卡",
	// 	"Lottery":"寻宝",
	// 	"LotteryAncient":"寻宝",
	// 	"AncientSmelt":"合成",
	// 	"VIP10":"VIP10奖励",
	// 	"VIP9":"VIP9奖励",
	// 	"VIP8":"VIP8奖励",
	// 	"VIP7":"VIP7奖励",
	// 	"VIP6":"VIP6奖励",
	// 	"VIP5":"VIP5奖励",
	// 	"VIP4":"VIP4奖励",
	// 	"SecretBoss": "秘境BOSS",
	// 	"MagicWeaponCopy" : "法宝副本",
	// 	"CopySword" : "守护神剑",
	// 	"RechargeDay" : "每日充值",
	// 	"Team2": "跨服组队",
	// 	"MgRecharge" : "累计礼包",
	// 	"ToplistActiveOpen" : "冲榜排名",
	// 	"GamePlayExam" : "科举答题",
	// 	"GamePlayBattleField" : "阵地争夺",
	// 	"GamePlayCampBattle" : "血战五洲",
	// 	"SignIn" : "签到",
	// }
	/**玩家菜单操作按钮标题 */
	public static MenuOperationName:any = {
		[MenuOperationEnum.Chat]: "私  聊",
		[MenuOperationEnum.CheckInfo]: "查  看",
		[MenuOperationEnum.Shield]: "屏  蔽",
		[MenuOperationEnum.Friend]: "加好友",
	}

	public static TitleQualityName:any = {
		"1":"珍贵",
		"2":"国器",
		"3":"无双"
	}

	/**天赋品质名称 */
	public static EColorTalentName: any = {
		"1": "凡品",
		"3": "精品",
		"4": "极品",
		"5": "神品",
	}

	/**仙盟积分仓库操作记录 */
	public static GuildWarehouseRecord:any = {
		[EGuildWarehouseRecordType.EGuildWarehouseRecordTypeDonate]:"捐献",
		[EGuildWarehouseRecordType.EGuildWarehouseRecordTypeChange]:"兑换",
		[EGuildWarehouseRecordType.EGuildWarehouseRecordTypeDestory]:"销毁",
		[EGuildWarehouseRecordType.EGuildWarehouseRecordTypeSystem]:"",
	}

}