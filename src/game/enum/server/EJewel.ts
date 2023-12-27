/**装备/宝石属性 */
enum EJewel {
	EJewelPhysicalAttack = 1,     //物理攻击（攻击）
	EJewelLife = 2,               //生命
	EJewelPass = 3,               //破甲
	EJewelPhysicalDefense = 4,    //物理防御（防御）
	EJewelJouk = 5,               //闪避
	EJewelHit = 6,                //命中
	EJewelPhysicalCrit = 7,       //物理暴击（暴击）
	EJewelToughness = 8,          //坚韧
	EJewelCritDamage = 9,      	  //暴击伤害
	
	EJewelWuxingAttack = 11,      //五行攻击
	EJewelWuxingDefense = 12,     //五行防御
    EJewelOutputDamage = 21,   	  //输出伤害（固定值）
    EJewelSufferDamage = 22,	  //受到伤害（固定值）
	EJewelSkyDamage = 23,
	EJewelSpringRecovery = 25,
	EJewelDevialDamage = 24,	
	
	EJewelPhysicalAttackLevelAdd = 31,    //[属性值*1000+等级]物理攻击
	EJewelLifeLevelAdd = 32,              //[属性值*1000+等级]生命
	EJewelPassLevelAdd = 33,              //[属性值*1000+等级]破甲
	EJewelPhysicalDefenseLevelAdd = 34,   //[属性值*1000+等级]物理防御
	EJewelJoukLevelAdd = 35,              //[属性值*1000+等级]闪避
	EJewelHitLevelAdd = 36,               //[属性值*1000+等级]命中
	EJewelPhysicalCritLevelAdd = 37,      //[属性值*1000+等级]物暴
	EJewelToughnessLevelAdd = 38,         //[属性值*1000+等级]坚韧

	EJewelPhysicalAttackPercentage = 51,  //[万分比]物理攻击
	EJewelLifePercentage = 52,            //[万分比]生命
	EJewelPassPercentage = 53,            //[万分比]破甲
	EJewelPhysicalDefensePercentage = 54, //[万分比]物防
	EJewelJoukPercentage = 55,            //[万分比]闪避
	EJewelHitPercentage = 56,             //[万分比]命中
	EJewelPhysicalCritPercentage = 57,    //[万分比]物暴
	EJewelToughnessPercentage = 58,       //[万分比]坚韧
	EJewelStrengthPercentage = 59,        //[万分比]强化
	EJewelWuxingAttackPercentage = 61,    //[万分比]五行攻击
	EJewelWuxingDefensePercentage = 62,   //[万分比]五行防御
	EJewelHallowBasePercentage = 63,      //[万分比]圣器基础属性加成
	EJewelCritDamagePercentage = 64,      //[万分比]暴击伤害
	
	EJewelOutPutDamageRate = 71,          //[万分比]输出伤害
	EJewelSufferDamageRate = 72,          //[万分比]受到伤害
	EJewelOutPutCritDamageRate = 73,      //[万分比]输出暴击伤害
	EJewelSufferCritDamageRate = 74,      //[万分比]受到暴击伤害
	EJewelDamageReboundRate = 75,         //[万分比]伤害反弹
	EJewelPetOutPutDamageRate = 76,       //[万分比]宠物输出伤害
	EJewelSpiritOutPutDamageRate = 77,    //[万分比]法宝输出伤害
	EJewelCritRate = 78,                  //[万分比]暴击率
	EJewelJoukRate = 79,                  //[万分比]闪避率
	EJewelDropCoinRate = 80,              //[万分比]掉落铜钱
	EJewelDropItemRate = 81,              //[万分比]掉落物品
	EJewelDropExpRate = 82,				  //[万分比]掉落经验
	EJewelKnowingRate = 85,               //[万分比]会心率
	EJewelBlockRate = 86,                 //[万分比]格挡率
	EJewelArmorRate = 87,                 //[万分比]护甲
	EJewelCritDefenseRate = 88,           //[万分比]暴击抵抗率
	EJewelSkillHurtRate = 89,             //[万分比]技能伤害率
	EJewelSkillReliefRate = 90,           //[万分比]技能减伤率
	EJewelKnowingHurtRate = 91,           //[万分比]会心伤害
	EJewelDizzyRate = 92,                 //[万分比]眩晕率
	EJewelDizzyDefenseRate = 93,          //[万分比]眩晕抵抗率
	
	/*
	EJewelMana = 1001,                //法力----手游不使用
	EJewelPower = 1002,               //力量----手游不使用
	EJewelAgile = 1003,               //敏捷----手游不使用
	EJewelHabitus = 1004,             //体质----手游不使用
	EJewelBrains = 1005,              //智力----手游不使用
	EJewelSpiritual = 1006,           //精神----手游不使用
	EJewelMagicAttack = 1007,         //法力攻击----手游不使用
	EJewelMagicDefense = 1008,        //法术防御----手游不使用
	EJewelMagicCrit = 1009,           //法术暴击----手游不使用
	EJewelBlock = 1010,               //档格----手游不使用
	EJewelSpeededUp = 1011,           //急速----手游不使用
	EJewelRelief = 1012,              //免伤----手游不使用
	EJewelSpeededUpRate = 1013,       //急速率----手游不使用
	
	EJewelHitRate = 1014,             //命中率----手游不使用
	EJewelPassRate = 1015,            //穿透率----手游不使用
	EJewelBlockRate = 1016,           //档格率----手游不使用
	
	EJewelToughnessRate = 1017,       //坚韧率----手游不使用
	EJewelReliefRate = 1018,          //免伤率----手游不使用
	EJewelPhysicalReliefRate = 1019,  //物免率----手游不使用
	EJewelMagicReliefRate = 1020,     //法免率----手游不使用
	*/
	
	EJewelArmorLifePercentage = 1002,       //[万分比]防具生命
	EJewelArmorDefensePercentage = 1004,    //[万分比]防具防御

	EJewelWeaponAttackPercentage = 2001,    //[万分比]武器攻击
	EJewelWeaponPassPercentage = 2003,      //[万分比]武器破甲
	
	EJewelJewelryAttackPercentage = 3001,   //[万分比]仙器攻击
	
	EJewelEquipAttackPercentage = 4001,     //[万分比]基础攻击(等级属性+转职等级属性+装备基础属性)
	EJewelEquipLifePercentage = 4002,       //[万分比]基础生命(等级属性+转职等级属性+装备基础属性)
	EJewelEquipPassPercentage = 4003,       //[万分比]基础破甲(等级属性+转职等级属性+装备基础属性)
	EJewelEquipDefensePercentage = 4004,    //[万分比]基础防御(等级属性+转职等级属性+装备基础属性)

	EJewelWeaponBasePercentage = 5001,      //[万分比]武器基础属性加成( mod 1000 的值对应 EDressPos 中的枚举值，这里的英文也是跟 EEquip 那边将错就错)
	EJewelHelmetBasePercentage = 5003,      //[万分比]手镯基础属性加成
	EJewelWristletBasePercentage = 5005,    //[万分比]护符基础属性加成
	EJewelShoulderBasePercentage = 5006,    //[万分比]护腕基础属性加成
	EJewelClothesBasePercentage = 5007,     //[万分比]衣服基础属性加成
	EJewelBeltBasePercentage = 5008,        //[万分比]裤子基础属性加成
	EJewelGlovesBasePercentage = 5009,      //[万分比]头盔基础属性加成
	EJewelShoesBasePercentage = 5010,       //[万分比]鞋子基础属性加成
}