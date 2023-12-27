/**
 * 符文小类
 */
enum ERune
{
	ERuneZero = 0, //符文精华
	ERuneAttack = 1, //攻击符文
	ERuneDefense = 2, //防御符文
	ERuneLife = 3,	//生命符文
	ERunePass = 4, //破甲符文
	ERuneExp = 5,	//经验符文
	ERuneJouk = 6, //闪避符文
	ERuneArmorLife = 7, //防具生命符文
	ERuneHit = 8, //命中符文
	ERuneArmorDefense = 9, //防具防御符文
	ERuneWeaponPass = 10, //武器破甲符文
	ERuneWeaponAttack = 11, //武器攻击符文
	ERuneJewelryAttack = 12, //仙器攻击符文
	ERuneBasePass = 13,	//基础破甲符文
	ERuneBaseLife = 14, //基础生命符文
	ERuneBaseDefense = 15, //基础防御符文
	ERuneBaseAttack = 16, //基础攻击符文
	ERuneJewelryAttackAndExpAdd = 17, //仙器攻击+经验加成
	ERuneLifeAndArmorLife = 18,         //生命+防具生命
	ERuneDefenseAndArmorDefense = 19,   //防御+防具防御
	ERuneAttackAndWeaponAttack = 20,    //攻击+武器攻击
	ERuneHitAndJouk = 21,               //命中+闪避
	ERuneBaseLifeAndBaseDefense = 22,   //基础生命+基础防御
	ERunePassAndWeaponPass = 23,        //破甲+武器破甲
	ERuneWeaponBase = 24,      //光武(武器基础属性)
	ERuneHelmetBase = 25,      //灵镯(手镯基础属性)
	ERuneWristletBase = 26,    //仙符(护符基础属性)
	ERuneShoulderBase = 27,    //战碗(护腕基础属性)
	ERuneClothesBase = 28,     //神甲(衣服基础属性)
	ERuneBeltBase = 29,        //无影(裤子基础属性)
	ERuneGlovesBase = 30,      //战盔(头盔基础属性)
	ERuneShoesBase = 31,       //逐日(鞋子基础属性)
	ERuneAttackAndPass = 32,   //神力(攻击和破甲)
	ERuneAttackAndPassAndLife = 33,   //强攻(攻击和破甲和生命)
	ERuneAttackAndPassAndDefense = 34,   //毁灭(攻击和破甲和防御)
	ERuneLifeAndDefense = 35,   //泰坦(生命和防御)
	ERuneCoin = 36,   //财神(铜钱百分比)
	ERuneAttackAndBaseAttack = 37,   //崇武(攻击和基础攻击)
	ERuneLifeAndBasePass = 38,   //仙魂(生命和基础破甲)
	ERuneAttackAndPassAndLifeEx = 39,        //破军(攻击和破甲和生命)
	ERuneAttackAndPassAndDefenseEx = 40,      //铁壁(攻击和破甲和防御)
	ERuneLifeAndDefenseEx = 41,       //帷幕(生命和防御)
	ERuneWeaponBaseAndWristletBase = 42,   //止殇(武器和护符基础属性)
	ERuneGlovesBaseAndColthesBase = 43,   //金甲(头盔和衣服基础属性)
	ERuneHelmetBaseAndBeltBase = 44,   //坠星(手镯和裤子基础属性)
	ERuneShoulderBaseAndShoesBase = 45,   //流云(护腕和鞋子基础属性)
	ERuneOutputDamageAndSufferDamage = 46,   //阴阳(固定伤害和固定减伤)
	ERuneCoinAndExp = 47,   //善财(经验和铜钱百分比)
};