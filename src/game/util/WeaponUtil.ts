/**
 * 装备武器工具类
 */
class WeaponUtil {
	public static EJewel = EJewel;
	public static EEquip = EEquip;

	/**特殊装备小类对应的code */
	private static _specialEquipCode: any = {
		[EEquip.EEquipJewelry]: ItemCodeConst.RedJewelry,
		[EEquip.EEquipRing]: ItemCodeConst.RedRing
	};
	/**装备部位基础的属性的百分比属性 */
	private static _attrsAddPosBasePercentage: number[] = [
		EJewel.EJewelWeaponBasePercentage,      //[万分比]武器基础属性加成( mod 1000 的值对应 EDressPos 中的枚举值，这里的英文也是跟 EEquip 那边将错就错)
		EJewel.EJewelHelmetBasePercentage,      //[万分比]手镯基础属性加成
		EJewel.EJewelWristletBasePercentage,    //[万分比]护符基础属性加成
		EJewel.EJewelShoulderBasePercentage,    //[万分比]护腕基础属性加成
		EJewel.EJewelClothesBasePercentage,     //[万分比]衣服基础属性加成
		EJewel.EJewelBeltBasePercentage,        //[万分比]裤子基础属性加成
		EJewel.EJewelGlovesBasePercentage,      //[万分比]头盔基础属性加成
		EJewel.EJewelShoesBasePercentage,       //[万分比]鞋子基础属性加成
	];

	private static _specialEquipItem: any = {};

	/**装备中需要计算战力的配置属性 */
	private static combatAttrArr: string[] = [
		EEquipCombatAttr[EEquipCombatAttr.basePhysicalAttack],
		EEquipCombatAttr[EEquipCombatAttr.baseLife],
		EEquipCombatAttr[EEquipCombatAttr.basePass],
		EEquipCombatAttr[EEquipCombatAttr.basePhysicalDefense],
		EEquipCombatAttr[EEquipCombatAttr.baseJouk],
		EEquipCombatAttr[EEquipCombatAttr.baseHit],
		EEquipCombatAttr[EEquipCombatAttr.basePhysicalCrit],
		EEquipCombatAttr[EEquipCombatAttr.baseToughness]
	];
	/**计算战力的配置附加属性**/
	private static baseAttrList: string = "baseAttrList";

	/**
	 * 获取基础属性字典
	 * @param itemData 
	 * @param isAddRate 是否需要浮动值
	 * @returns {1: 20, 2:20}  键为属性类型
	 */
	public static getBaseAttrDict(itemData: ItemData, isAddRate: boolean = true): any {
		var dict: any = WeaponUtil.getBaseAttrInf(itemData, isAddRate, false);
		return dict;
	}
	/**
	 * 获取基础属性数组
	 */
	public static getBaseAttrArr(itemData: ItemData, isAddRate: boolean = true): any[] {
		var arr: any[] = WeaponUtil.getBaseAttrInf(itemData, isAddRate, true);
		return arr;
	}

	/**
	 * 获取装备的基础属性
	 * @param itemData
	 * @param isAddRate 是否需要浮动值
	 * @param isArr    是否返回数组；默认是false 返回字典;true则返回 [{type:,value:},...]
	 */
	private static getBaseAttrInf(itemData: ItemData, isAddRate: boolean = true, isArr: boolean = false): any {
		var dict: any = {};
		var attrArr: any[] = [];
		var baseRate: number = isAddRate ? itemData.getBaseAttrAddRate() : 0;
		if (itemData) {
			let itemInfo: any = itemData.getItemInfo();
			if (itemInfo[WeaponUtil.baseAttrList]) {
				let a: Array<string> = itemInfo.baseAttrList.split("#");
				for (let s of a) {
					if (s != "") {
						let ta: Array<string> = s.split(",");
						let taVal: number = WeaponUtil.calBaseAttr(Number(ta[1]), baseRate);
						if (isArr) {
							attrArr.push({ type: ta[0], value: taVal.toString() });
						} else {
							dict[ta[0]] = taVal.toString(); //原来是字符串 保持是字符串
						}
					}
				}
			} else {
				for (let attr of WeaponUtil.combatAttrArr) {
					//属性名称转成类型
					if (!itemInfo[attr]) {
						continue;
					}
					let taVal: number = WeaponUtil.calBaseAttr(Number(itemInfo[attr]), baseRate);
					let type: any = GameDef.EquipBaseAttrType[attr];
					if (isArr) {
						attrArr.push({ type: type, value: taVal.toString() });
					} else {
						dict[type] = taVal.toString();
					}
					if (GameDef.EquipBaseAttrType[attr] == null) {
						Log.trace(Log.UI, "base", attr);
					}
				}
			}
		}

		if (isArr) {
			return attrArr;
		}
		return dict;
	}
	public static calBaseAttr(attr: number, baseRate: number): number {
		let taVal: number = attr + attr * baseRate / 100;
		taVal = Math.ceil(taVal);
		return taVal;
	}
	/**
	 * 获取强化属性字典
     * TODO 强化属性需要根据新强化表
	 * @returns {1: 20, 2:20}  键为属性类型
	 */
	public static getStrengthenAttrDict(itemData: ItemData): any {
		var dict: any = {};
		if (itemData) {
			let conf: any = ConfigManager.mgStrengthen.getByTypeAndLevel(itemData.getType(), itemData.getStrengthenLevel());
			if (conf != null) {
				dict = this.getAttrDict(conf.attrList);
			}
		}
		return dict;
	}

	/**
	 * 获取新强化属性字典
	 * @param equipType装备类型
	 * @param strengthenLevel 强化等级
	 * @returns {"1": 20, "2": 40}
	 */
	public static getStrengthenExAttrDict(equipType: EEquip, strengthenLevel: number, strengExType: EStrengthenExType): Array<any> {
		let typeAttrDict: any = StrengthenExUtil.getShowAttrDict(strengExType, strengthenLevel);
		return typeAttrDict[equipType];
	}

	// /**
	//  * 获取基础属性串
	//  */
	// public static getBaseAttr(itemData: ItemData): string {
	// 	var attr: string = "";
	// 	let dict: any = WeaponUtil.getBaseAttrDict(itemData);
	// 	for (let key in dict) {
	// 		attr += `${GameDef.EquipBaseAttrName[key]}：${dict[key]}\n`;
	// 	}
	// 	return attr;
	// }

	/**
	 * 获取基础属性串
	 * @param itemData
	 * @param isAncientAttr 是否需要显示混元装备增加的属性
	 * @param roleIndex 获取混元装备增加的属性需要
	 */
	public static getBaseAttr(itemData: ItemData, isAncientAttr: boolean = false, roleIndex: number = -1, nameColor: string = "", valueColor: string = ""): string {
		var attr: string = "";
		let dict: any = WeaponUtil.getBaseAttrDict(itemData, false);
		var baseAttrAddRate: number = itemData.getBaseAttrAddRate() / 100;
		let ancientRate: number = 0;
		if (isAncientAttr && roleIndex > -1) {
			ancientRate = CacheManager.ancientEquip.getPosAddEquipAttrRate(roleIndex, itemData.getType());
		}
		for (let key in dict) {
			let value: string = "";
			if (WeaponUtil.isPercentageAttr(Number(key))) {//有些属性是万分比
				value = `+${Number(dict[key]) / 100}%`;
			} else {
				value = dict[key];
			}
			let perVal: number = Math.ceil(Number(dict[key]) * baseAttrAddRate); //浮动值
			let perStr: string = perVal > 0 ? "+" + perVal : "";
			let ancientAdd: number = (Number(dict[key]) + perVal) * ancientRate; //传世装备(混元装备) 增加的属性百分比值
			ancientAdd = Math.ceil(ancientAdd);
			let ancientAddStr: string = ancientAdd > 0 ? "+" + ancientAdd : "";
			// attr += `${GameDef.EJewelName[key][0]}：${value}${perStr}${ancientAddStr}` + HtmlUtil.brText;
			let nameStr: string = `${GameDef.EJewelName[key][0]}：`;
			let valueStr: string = `${value}${perStr}${ancientAddStr}`;
			if (nameColor != "") {
				nameStr = HtmlUtil.html(nameStr, nameColor);
			}
			if (valueColor != "") {
				valueStr = HtmlUtil.html(valueStr, valueColor);
			}
			attr += nameStr + valueStr + HtmlUtil.brText;
		}
		attr = attr.substr(0, attr.length - HtmlUtil.brText.length);
		return attr;
	}

	/**
	 * 获取装备类型名称
	 */
	public static getWeaponTypeName(type: number): string {
		//GameDef.NumberName[itemLevel] + "阶" +
		return GameDef.EEquip[type];
	}

	/**
	 * 获取综合评分
	 */
	public static getTotalScore(itemData: ItemData): number {
		let baseScore: number = WeaponUtil.getScoreBase(itemData);
		//TODO 计算
		return baseScore;
	}

	/**
	 * 获取基础评分
	 */
	public static getScoreBase(itemData: ItemData): number {
		if (!ItemsUtil.isTrueItemData(itemData)) {
			return 0;
		}
		let extInfo: any = itemData.getItemExtInfo();
		if (extInfo.scoreBase != null) {
			return extInfo.scoreBase;
		}
		let attrDict: any = WeaponUtil.getBaseAttrDict(itemData);
		let baseCombat: number = WeaponUtil.getCombat(attrDict);

		let specialAttrFactor: number = 0;
		let bestDict: any = {};
		if (extInfo != null && extInfo.best) {
			bestDict = extInfo.best;
		} else {
			let specail: any = ConfigManager.specialRewardItem.getByPk(itemData.getCode());
			if (specail != null) {
				bestDict = JSON.parse(specail.jsStr);
			}
		}
		for (let k in bestDict) {
			let bestAttrCfg: any = ConfigManager.mgBestAttr.getByPk(bestDict[k])
			if (bestAttrCfg != null) {
				specialAttrFactor += bestAttrCfg.factor;
			}
		}
		return Math.ceil(baseCombat * (1 + specialAttrFactor / 10000));
	}

	/**
	 * 获取属性字典{"1": 20, "2": 50}
	 * @param str 1,20#2,50#
	 */
	public static getAttrDict(str: string): any {
		let dict: any = {};
		if (str != null && str != "") {
			let arr = str.split("#");
			for (let a of arr) {
				if (a != "") {
					let attrArr = a.split(",");
					let type: number = Number(attrArr[0]);
					let value: number = Number(attrArr[1]);
					dict[type] = value;
				}
			}
		}
		return dict;
	}

	/**计算特殊属性参与战力公式的值 */
	public static calSpecialAttr(type: number, value: number, roleIndex: number): number {
		let fightAttr: any;
		if (WeaponUtil.isAddPosBaseAttr(type)) { //不参与计算战力的属性
			return 0;
		}
		if (roleIndex == -1) {
			return value;
		}
		switch (type) {
			case EJewel.EJewelCritDamage: //暴击伤害
				fightAttr = CacheManager.role.getRoleFightAttr(roleIndex);
				value = fightAttr ? Math.ceil(value * WeaponUtil.getAttrPercentVal(fightAttr.critRate_I)) : 0;
				break;
			case EJewel.EJewelCritDamagePercentage: //[万分比]暴击伤害; 暴击伤害百分比 * 暴击伤害*暴击率
				fightAttr = CacheManager.role.getRoleFightAttr(roleIndex);
				value = WeaponUtil.getAttrPercentVal(value);// 暴击伤害百分比
				let critRate_I: number = 0;//暴击率
				if (fightAttr) {
					critRate_I = WeaponUtil.getAttrPercentVal(fightAttr.critRate_I);
					let calCritDamage_L64: number = fightAttr.critDamage_L64 / (value + 1); //算出其他地方加的暴击伤害
					value = Math.ceil(value * calCritDamage_L64 * critRate_I);
				} else {
					value = 0;
				}
				break;
		}
		return value;
	}

	/**
	 * 把配置的属性列表数组转换成文本
	 * @param attrArr 通过 getAttrArray 获取到的数组
	 * @param valueColor 如果需要html 设置值的颜色
	 * @param nameColor	 如果需要html 设置属性名的颜色
	 */
	public static getAttrText(attrArr: any[], isHtml: boolean, valueColor: string = null, nameColor: string = null, newLine: boolean = true, needPlus: boolean = true, needName: boolean = true): string {
		var html: string = "";
		var len: number = attrArr.length;
		for (var i: number = 0; i < len; i++) {
			let nameStr: string = needName ? CommonUtils.getAttrName(attrArr[i][0]) + "：" : "";
			let valueStr: string;
			if (WeaponUtil.isPercentageAttr(Number(attrArr[i][0]))) {
				let str: string = `${Number(attrArr[i][1]) / 100}%`;
				valueStr = needPlus ? "+" + str : str;
			} else {
				valueStr = needPlus ? "+" + attrArr[i][1] : attrArr[i][1];
			}
			html += WeaponUtil.fmtAttrStr(nameStr, valueStr, isHtml, valueColor, nameColor, newLine);
		}
		return html;
	}
	/**
	 * 把配置的属性列表字典转换成文本
	 * @param dict 属性字典
	 * @param valueColor 如果需要html 设置值的颜色
	 * @param nameColor	 如果需要html 设置属性名的颜色
	 */
	public static getAttrText2(dict: any, isHtml: boolean, valueColor: string = null, nameColor: string = null,
		newLine: boolean = true, needPlus: boolean = true, needName: boolean = true, nameFix: string = "："): string {

		var html: string = "";
		for (let key in dict) {
			let type: number = Number(key);
			let num: number = Number(dict[key]);
			let nameStr: string = needName ? CommonUtils.getAttrName(type) + nameFix : "";
			let valueStr: string = "";
			if (WeaponUtil.isPercentageAttr(type)) {
				let str: string = `${num / 100}%`;
				valueStr = needPlus ? "+" + str : str;
			} else {
				valueStr = needPlus ? "+" + dict[key] : dict[key];
			}
			html += WeaponUtil.fmtAttrStr(nameStr, valueStr, isHtml, valueColor, nameColor, newLine);
		}
		return html;
	}


	public static fmtAttrStr(nameStr: string, valueStr: string, isHtml: boolean, valueColor: string = null, nameColor: string = null, newLine: boolean = true): string {
		var html: string = "";
		if (isHtml) {
			nameColor = nameColor || valueColor;
			html += HtmlUtil.html(nameStr, nameColor, false);
			html += HtmlUtil.html(valueStr, valueColor, false);
		} else {
			html = nameStr + valueStr;
		}
		if (newLine) {
			html += HtmlUtil.brText;
		}
		return html;
	}

	/**
	 * 属性显示，添加职业名称
	 */
	public static getAttrAndCareerNameStr(dict: any, career: number, isHtml: boolean, valueColor: string = null, nameColor: string = null, nameFix: string = "："): string {
		let html: string = "";
		let careerName: string = CareerUtil.getCareerName(career);
		for (let key in dict) {
			let type: number = Number(key);
			let num: number = Number(dict[key]);
			let nameStr: string = careerName + CommonUtils.getAttrName(type);
			let valueStr: string = "";
			if (WeaponUtil.isPercentageAttr(type)) {
				let str: string = `${num / 100}%`;
				valueStr = nameFix + str;
			} else {
				valueStr = nameFix + dict[key];
			}
			html += WeaponUtil.fmtAttrStr(nameStr, valueStr, isHtml, valueColor, nameColor);
		}
		return html;
	}

	/**
	 * 获取显示的属性
	 * @param str 1,20#2,50#
	 */
	public static getAttrDictStr(str: string, isHtml: boolean = true, nameColor: string = Color.Color_7, valueColor: string = Color.Color_8): string {
		let attrDict: any = WeaponUtil.getAttrDict(str);
		let result: string = "";
		for (let type in attrDict) {
			if (isHtml) {
				result += HtmlUtil.html(GameDef.EJewelName[type][0], nameColor) + "：" + HtmlUtil.html(attrDict[type] + "", valueColor) + "\n";
			} else {
				result += GameDef.EJewelName[type][0] + "：" + attrDict[type] + "\n";
			}
		}
		if (result.length > 1) {//去掉最后的换行
			result = result.substring(0, result.length - 1);
		}
		return result;
	}


	/**
	 * 获取属性数组[[1, 20], [2,50]]
	 * @param str 1,20#2,50#
	 */
	public static getAttrArray(str: string): Array<any> {
		let attrArray: Array<any> = [];
		if (str != null && str != "") {
			let arr = str.split("#");
			for (let a of arr) {
				if (a != "") {
					let attrArr = a.split(",");
					let type: number = Number(attrArr[0]);
					let value: number = Number(attrArr[1]);
					attrArray.push([type, value]);
				}
			}
		}
		return attrArray;
	}

	/**获取星级 */
	public static getStar(itemData: ItemData): number {
		if (!itemData || !itemData.getItemInfo()) {
			return 0;
		}
		let starNum: number = 0;
		let exInfo: any = itemData.getItemExtInfo();
		let best: any = null;
		let data: any = ConfigManager.specialRewardItem.getByPk(itemData.getCode());
		if (data) {
			best = JSON.parse(data["jsStr"]).best;
		}
		else if (exInfo && exInfo.best) {
			best = exInfo.best;
		}
		if (best) {
			for (let key in best) {
				let value: any = best[key];
				let addDesc: any = ConfigManager.mgBestAttr.getByPk(value);
				if (addDesc) {
					if (addDesc.attrQuality == 3) {
						starNum += 1;
					}
				}
			}
		}

		return starNum;
	}

	public static getKillCombat(itemData: ItemData, attrDict: any): number {
		let combat: number = 0;
		let attrCombat: number = this.getCombat(attrDict);
		combat = (itemData.getEffectEx2() + attrCombat) * CacheManager.role.roles.length;
		return combat;
	}

	/**
	 * 根据属性计算战斗力
	 */
	public static getCombat(attrDict: any, roleIndex: number = -1): number {
		let combat: number = 0;
		for (let k in attrDict) {
			let v: number = attrDict[k];
			v = WeaponUtil.calSpecialAttr(Number(k), Number(v), roleIndex);

			switch (Number(k)) {
				case EJewel.EJewelLife:
					combat += v * 0.25;
					break;
				case 23:
					break;
				case 24:
					break;
				case 25:
					break;
				default:
					combat += v * 10;
					break;
			}
		}
		return Math.ceil(combat);
	}
	/**
	 * 获取某个装备的战力
	 */
	public static getCombatByItemData(itemData: ItemData): number {
		let strengthenAttrDict: any = WeaponUtil.getStrengthenAttrDict(itemData); //强化属性
		var refreshArrtDict: any = WeaponUtil.getRefreshAttrDict(itemData); //洗练属性
		var baseAttrDict: any = WeaponUtil.getBaseAttrDict(itemData, true);
		ObjectUtil.mergeObj(baseAttrDict, strengthenAttrDict);
		ObjectUtil.mergeObj(baseAttrDict, refreshArrtDict);
		var fight: number = WeaponUtil.getCombat(baseAttrDict) + itemData.getAddSkillWarfare();
		return fight;
	}

	/**
	 * 获取洗练属性
	 */
	public static getRefreshAttrDict(itemData: ItemData): any {
		let dict: any = {};
		let refresh: any = itemData.getItemExtInfo().refresh;
		if (refresh) {
			for (let key in refresh) {
				let attrData: any = ConfigManager.mgRefreshRate.getByPk(refresh[key][0]);
				let val: any = refresh[key][1];
				dict[attrData.attrType] = val;
			}
		}
		return dict;
	}
	/**
	 * 获取极品属性
	 */
	public static getBestAttr(itemData: ItemData): any {
		if (!itemData || !itemData.getItemInfo()) {
			return 0;
		}
		let starNum: number = 0;
		let exInfo: any = itemData.getItemExtInfo();
		let best: any = null;
		let data: any = ConfigManager.specialRewardItem.getByPk(itemData.getCode());
		let attr: string = "";
		if (data) {
			best = JSON.parse(data["jsStr"]).best;
		}
		else if (exInfo && exInfo.best) {
			best = exInfo.best;
		}
		if (best) {
			for (let key in best) {
				let value: any = best[key];
				let addDesc: any = ConfigManager.mgBestAttr.getByPk(value);
				attr += `<font color='${Color.ItemColor[addDesc.attrQuality]}'>${addDesc.desc}</font>\n`;
			}
		}
		return attr ? `<font color='${"#FEA700"}'>极品属性</font>\n` + attr : "";
	}

	/**
	 * 获取推荐极品属性
	 */
	public static getBestRecommand(itemData: ItemData): any {
		if (!itemData || !itemData.getItemInfo()) {
			return 0;
		}
		let type: number = itemData.getType();
		let color: number = itemData.getColor();
		let addDesc: Array<any> = ConfigManager.mgBestAttr.select({ "equipType": type, "equipColor": color });
		let attr: string = "";
		for (let value of addDesc) {
			if (value.recommend) {
				attr += `<font color= "#0DF14B">[推荐]${value.desc}</font>\n`;
			}
		}

		return attr ? `<font color= "#FEA700" >极品属性(随机生成3条极品属性)</font>\n` + attr : "";
	}

	/**是否是加装备部位基础的属性的百分比属性 */
	public static isAddPosBaseAttr(jewel: EJewel): boolean {
		return WeaponUtil._attrsAddPosBasePercentage.indexOf(jewel) > -1;
	}
	/***获取属性的万分比数值 */
	public static getAttrPercentVal(value: number): number {
		return value / 10000;
	}

	/**
	 * 是否为万分比属性
	 */
	public static isPercentageAttr(jewel: EJewel): boolean {
		let dict: any = {
			[EJewel.EJewelPhysicalAttackPercentage]: true,
			[EJewel.EJewelLifePercentage]: true,
			[EJewel.EJewelPassPercentage]: true,
			[EJewel.EJewelPhysicalDefensePercentage]: true,
			[EJewel.EJewelJoukPercentage]: true,
			[EJewel.EJewelHitPercentage]: true,
			[EJewel.EJewelPhysicalCritPercentage]: true,
			[EJewel.EJewelToughnessPercentage]: true,
			[EJewel.EJewelStrengthPercentage]: true,

			[EJewel.EJewelOutPutDamageRate]: true,
			[EJewel.EJewelSufferDamageRate]: true,
			[EJewel.EJewelOutPutCritDamageRate]: true,
			[EJewel.EJewelSufferCritDamageRate]: true,
			[EJewel.EJewelDamageReboundRate]: true,
			[EJewel.EJewelPetOutPutDamageRate]: true,
			[EJewel.EJewelSpiritOutPutDamageRate]: true,
			[EJewel.EJewelCritRate]: true,
			[EJewel.EJewelJoukRate]: true,
			[EJewel.EJewelDropCoinRate]: true,
			[EJewel.EJewelDropItemRate]: true,
			[EJewel.EJewelDropExpRate]: true,

			[EJewel.EJewelKnowingRate]: true,
			[EJewel.EJewelBlockRate]: true,
			[EJewel.EJewelArmorRate]: true,
			[EJewel.EJewelCritDefenseRate]: true,
			[EJewel.EJewelSkillHurtRate]: true,

			[EJewel.EJewelArmorLifePercentage]: true,
			[EJewel.EJewelArmorDefensePercentage]: true,
			[EJewel.EJewelWeaponAttackPercentage]: true,
			[EJewel.EJewelWeaponPassPercentage]: true,
			[EJewel.EJewelJewelryAttackPercentage]: true,
			[EJewel.EJewelEquipAttackPercentage]: true,
			[EJewel.EJewelEquipLifePercentage]: true,
			[EJewel.EJewelEquipPassPercentage]: true,
			[EJewel.EJewelEquipDefensePercentage]: true,

			[EJewel.EJewelWeaponBasePercentage]: true,
			[EJewel.EJewelHelmetBasePercentage]: true,
			[EJewel.EJewelWristletBasePercentage]: true,
			[EJewel.EJewelShoulderBasePercentage]: true,
			[EJewel.EJewelClothesBasePercentage]: true,
			[EJewel.EJewelBeltBasePercentage]: true,
			[EJewel.EJewelGlovesBasePercentage]: true,
			[EJewel.EJewelShoesBasePercentage]: true,

			[EJewel.EJewelHallowBasePercentage]: true,
			[EJewel.EJewelKnowingHurtRate]: true,
			[EJewel.EJewelSkillReliefRate]: true,
		};
		return dict[jewel] != null;
	}

	/**
	 * 是否可穿戴
	 */
	public static isCanEquip(itemData: ItemData, roleIndex: number): boolean {
		if (ItemsUtil.isTrueItemData(itemData)) {
			let career: number = itemData.getCareer();
			return CareerUtil.isCareerMatch(career, roleIndex) && CacheManager.role.isLevelMatch(itemData.getLevel())
		}
		return false;
	}
	/**
	 * 是否是职业符合 但是等级高的装备
	 */
	public static isLevelUnMatch(itemData: ItemData, roleIndex: number): boolean {
		if (ItemsUtil.isTrueItemData(itemData)) {
			let career: number = itemData.getCareer();
			let roleCareer: number = CacheManager.role.getRoleCareer();
			let isRetime: boolean = CareerUtil.getRebirthTimes(roleCareer) < CareerUtil.getRebirthTimes(career);
			return CareerUtil.isSimilarCareer(career, roleIndex) && (!CacheManager.role.isLevelMatch(itemData.getLevel()) || isRetime); //等级或者转生高的装备
		}
		return false;
	}

	/**
	 * TODO 某角色是否可穿戴
	 */
	public static isCanEquipByCareer(itemData: ItemData, career: number): boolean {
		if (ItemsUtil.isTrueItemData(itemData)) {
			let itemCareer: number = itemData.getCareer();
			return CareerUtil.getBaseCareer(itemCareer) == career && CacheManager.role.isLevelMatch(itemData.getLevel());
		}
		return false;
	}

	/**
	 * 当前装备是否可以穿，不管职业是否已开启，只判断等级是否满足要求
	 */
	public static isCanEquipByItemData(itemData: ItemData): boolean {
		if (ItemsUtil.isTrueItemData(itemData)) {
			let itemCareer: number = itemData.getCareer();
			return CareerUtil.getRebirthTimes(CacheManager.role.getRoleCareer()) >= CareerUtil.getRebirthTimes(itemCareer) && CacheManager.role.isLevelMatch(itemData.getLevel());
		}
		return false;
	}

	/**
	 * 获取人物武器，包括神兵、时装等
	 * 武器type统一为：EAttributeWeapon
	 * 人物模型type统一为：EAttributeClothes
	 * @param weapons 键属性类型，值
	 */
	public static getModelId(type: EEntityAttribute, weapons: any, career: number): any {
		let value: any = 0;
		switch (type) {
			case EEntityAttribute.EAttributeClothes:
				//优先级:装扮、衣服
				value = weapons[EEntityAttribute.EAttributeClothes];//对应装扮时装
				if (!value) {
					let baseCareer: number = CareerUtil.getBaseCareer(career);
					if (baseCareer == 1) {
						value = 10100;
					} else if (baseCareer == 2) {
						value = 10200;
					} else {
						value = 10300;
					}
				}
				break;
			case EEntityAttribute.EAttributeWeapon:
				//优先级:装扮、神兵、武器
				value = weapons[EEntityAttribute.EAttributeWeapon];//对应装扮武器
				if (!value) {
					value = weapons[EEntityAttribute.EAttributeShapeMagic];//对应神兵
				}
				break;
			default:
				value = weapons[type];
				break
		}
		if (value == null) {
			value = 0;
		}
		return value;
	}

	/**
	 * 获取可以用于合成的武器
	 */
	public static getItemsCanCompose(data: any): ItemData[] {
		let itemDatas: ItemData[] = [];
		let equipCareer: number = data.equipCareer ? data.equipCareer : 0;
		let equipLevel: number = data.equipLevel ? data.equipLevel : 0;
		let equipColor: number = data.equipColor ? data.equipColor : 0;
		let equipStar: number = data.equipStar ? data.equipStar : 0;
		for (let itemData of CacheManager.pack.backPackCache.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData)) {
				let types: any = this.getEquipTypeDict(data);
				if (types[ItemsUtil.getEqiupPos(itemData)]) {
					if (itemData.getColor() == equipColor) {
						if (this.getStar(itemData) == equipStar) {
							if (itemData.getItemLevel() == equipLevel) {
								if (itemData.getCareer() == equipCareer) {
									// if(!this.equipUids[`${itemData.getUid()}`]){
									itemDatas.push(itemData);
									// }
								}
							}
						}
					}
				}
			}
		}
		return itemDatas;
	}

	/**
	 * 获取可以熔炼的武器
	 */
	public static getItemsCanSmelt(): ItemData[] {
		let itemDatas: ItemData[] = [];
		let tbl: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		let realRoleCareer: Array<number> = ConfigManager.const.getRealRoleCareers();
		let roleEquipScores: any = {};
		let bestItems: any = {};
		let bestUids: any = {};
		for (let career of realRoleCareer) {
			let equipPosScores: any = {};
			let roleEquips: any = CacheManager.pack.rolePackCache.getEquips(CacheManager.role.getRoleIndex(career));
			for (let v of tbl) {
				let itemData: ItemData = roleEquips[v];
				if (ItemsUtil.isTrueItemData(itemData)) {
					equipPosScores[v] = WeaponUtil.getScoreBase(itemData);
				} else {
					// equipPosScores[v] = 0; 
					let itemData: ItemData = CacheManager.pack.backPackCache.getBestScoreEquipByCareer(v, career);
					if (itemData) {
						equipPosScores[v] = WeaponUtil.getScoreBase(itemData);
						bestItems[`${career}-${itemData.getNewItemLevel()}-${itemData.getType()}`] = { "maxScore": WeaponUtil.getScoreBase(itemData), "uid": itemData.getUid() };
					} else {
						equipPosScores[v] = 0;
					}
				}
			}
			roleEquipScores[career] = equipPosScores;
		}

		for (let itemData of CacheManager.pack.backPackCache.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData)) {
				if (ItemsUtil.isEquipItem(itemData) && !ItemsUtil.isEquipSpritItem(itemData)) {
					let career: number = CareerUtil.getBaseCareer(itemData.getCareer());
					let level: number = itemData.getNewItemLevel();
					let type: number = itemData.getType();
					let key: string = `${career}-${level}-${type}`;
					let score: number = WeaponUtil.getScoreBase(itemData);
					let uid: string = itemData.getUid();
					let bestScore: number = 0;
					if (bestItems[key] != null) {
						bestScore = bestItems[key]["maxScore"];
					}
					if (career == 0) {
						for (let roleCareer of realRoleCareer) {
							if (score > roleEquipScores[roleCareer][type] && score > bestScore) {
								bestItems[`${roleCareer}-${level}-${type}`] = { "maxScore": score, "uid": uid };
							}
						}
					} else if (score > roleEquipScores[career][type] && score > bestScore) {
						bestItems[key] = { "maxScore": score, "uid": uid };
					}
				}
			}
		}

		for (let key in bestItems) {
			bestUids[bestItems[key]["uid"]] = true;
		}

		for (let itemData of CacheManager.pack.backPackCache.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData)) {
				if (ItemsUtil.isEquipItem(itemData) && !ItemsUtil.isEquipSpritItem(itemData) && !ItemsUtil.isHeartLock(itemData)) {
					if (itemData.getColor() < EColor.EColorRed && !bestUids[itemData.getUid()]) {//红色装备和评分高的装备保留
						itemDatas.push(itemData);
					}
				}
			}
		}
		return itemDatas;
	}

	/**
	 * 获取可以分解的神装
	 */
	public static getGodEquipCanDecompose(): ItemData[] {
		let itemDatas: ItemData[] = [];
		let dressEquipsType: Array<number> = [EEquip.EEquipWeapon, EEquip.EEquipWristlet,
		EEquip.EEquipShoulder, EEquip.EEquipHelmet, EEquip.EEquipGloves,
		EEquip.EEquipClothes, EEquip.EEquipBelt, EEquip.EEquipShoes];

		for (let itemData of CacheManager.pack.backPackCache.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData)) {
				if (itemData.getColor() == EColor.EColorRed && dressEquipsType.indexOf(itemData.getType()) != -1) {
					itemDatas.push(itemData);
				}
			}
		}
		return itemDatas;
	}

	/**
	 * 获取可以分解的修罗装备
	 */
	public static getShuraCanDecompose(): ItemData[] {
		let itemDatas: ItemData[] = [];
		// let dressEquipsType: Array<number> = [EEquip.EEquipWeapon, EEquip.EEquipWristlet,
		// EEquip.EEquipShoulder, EEquip.EEquipHelmet, EEquip.EEquipGloves,
		// EEquip.EEquipClothes, EEquip.EEquipBelt, EEquip.EEquipShoes];

		for (let itemData of CacheManager.pack.backPackCache.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData)) {
				if (itemData.isShuraEquipType()) {
					itemDatas.push(itemData);
				}
			}
		}
		return itemDatas;
	}

	/**
	 * 获取可以分解的图鉴
	 */
	public static getIllustratesCanDecompose(): ItemData[] {
		let itemDatas: ItemData[] = [];

		let illustrates: ItemData[] = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp, EProp.EPropIllustratedCard);
		for (let itemData of illustrates) {
			let canDecompose: boolean = true;
			let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(itemData.getCode());
			if (datas.length > 0) {
				for (let data of datas) {
					if (CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position) == -1) {
						canDecompose = false;
						break;
					}
				}
			}
			if (canDecompose) {
				itemDatas.push(itemData);
			}
		}

		return itemDatas;
	}

	private static getEquipTypeDict(data: any): any {
		let type: any = {};
		if (data.equipType) {
			let typeStr = data.equipType.split("#");
			for (let value of typeStr) {
				type[value] = true;
			}
		}
		return type;
	}

	/**是否可以更换的装备 */
	public static isCanReplace(itemData: ItemData): boolean {
		var posType: number = ItemsUtil.getEqiupPos(itemData);
		return WeaponUtil.isCanReplacePos(posType);
	}
	/**
	 * 是否可更换的装备
	 */
	public static isCanReplacePos(posType: number): boolean {
		return posType != EDressPos.EDressPosJewelry && posType != EDressPos.EDressPosRing;
	}

	/**
	 * 是否官印(同心锁)
	 */
	public static isEquipHeartLock(type: number): boolean {
		return type == EEquip.EEquipHeartLock;
	}

	/**
	 * 根据小类判断是否特殊tips的装备
	 */
	public static isSpecialTipsEquip(type: number): boolean {
		var flag: boolean = (type == EEquip.EEquipJewelry || type == EEquip.EEquipRing);
		return flag;
	}

	public static getSpecialEquipCode(type: number): number {
		return WeaponUtil._specialEquipCode[type];
	}
	/**
	 * 获取特殊装备的itemdata
	 */
	public static getSpecialEquipItem(type: number): ItemData {
		let item: ItemData = WeaponUtil._specialEquipItem[type];
		if (!item) {
			item = new ItemData(WeaponUtil.getSpecialEquipCode(type));
			WeaponUtil._specialEquipItem[type] = item;
		}
		return item;
	}

	/**
	 * 获取装备的等级描述
	 */
	public static getEquipLevelText(itemData: ItemData, isColor: boolean = true): string {
		let career: number = itemData.getCareer();
		let level: number = itemData.getLevel();
		let type: number = itemData.getType();

		let str: string = "";
		if (WeaponUtil.isEquipHeartLock(type)) {
			let newItemLevel: number = itemData.getNewItemLevel();
			str = newItemLevel + "阶";
		} else {
			let rebirthTime: number = CareerUtil.getRebirthTimes(career);
			if (rebirthTime > 0) {
				str = rebirthTime + "转";
			} else {
				if (level > 0) {
					str = level + "级";
				} else {
					if (isColor) {
						str = itemData.getColorString("无级别");
					} else {
						str = "无级别";
					}
				}
			}
		}
		return str;
	}

	/**
	 * 获取装备新强化等级
	 */
	public static getEquipStrengthenLevel(roleIndex: number, equipType: EEquip, strengthType: EStrengthenExType, equipCount: number = 8): number {
		let totalLevel: number = CacheManager.role.getPlayerStrengthenExLevel(strengthType, roleIndex);
		return StrengthenExUtil.getItemStrengthenLevel(GameDef.EquipTypeIndex[equipType], totalLevel, equipCount);
	}

	/**
	 * 计算技能战力
	 */
	public static getCombatBySkillId(skillId: number): number {
		let combat: number = 0;
		let skillData: SkillData = new SkillData(skillId);
		if (skillData != null) {
			let stateId: number = skillData.selfState;
			let stateCfg: any = ConfigManager.state.getByPk(stateId);
			if(stateCfg == null) {
				stateCfg = ConfigManager.state.getByPk(skillData.additionState);
			}
			if (stateCfg != null) {
				let group: number = stateCfg.group;
				let states: Array<any> = ConfigManager.state.select({ "group": group });
				let attrDict: any = {};
				let type: EStateType;
				let value: number;
				for (let state of states) {
					type = state.type;
					value = state.stateEffect1 / 1000;
					if (type >= EStateType.EStateInOrDePhysicAttack && type <= EStateType.EStateInOrDeToughness) {//基础属性
						if (type == EStateType.EStateInOrDeLife) {
							if (attrDict[EJewel.EJewelLife] == null) {
								attrDict[EJewel.EJewelLife] = 0;
							}
							attrDict[EJewel.EJewelLife] += value;
						} else {
							if (attrDict[EJewel.EJewelPass] == null) {
								attrDict[EJewel.EJewelPass] = 0;
							}
							attrDict[EJewel.EJewelPass] += value;//战力计算，只有生命乘的系数不一样，因此其他属性都统一按EJewelPass算即可
						}
					}
				}
				combat = WeaponUtil.getCombat(attrDict);
			}
			combat += skillData.warfare
		}
		return combat;
	}

	/**
	 * 神兽装备属性
	 */
	public static getBeastEquipAttrDict(itemData: ItemData): void{
		let strLevel: number;
		let baseAttrDict: any;
		let starAttrDict: any;
		let strAttrDict: any = {};
		let attrDict: any = {}
		if(ItemsUtil.isTrueItemData(itemData)){
			baseAttrDict = WeaponUtil.getBaseAttrDict(itemData);
			starAttrDict = ConfigManager.mgBeastEquip.getStarAttrDict(itemData.getEffect());
			if(itemData.getItemExtInfo().strLevel){
				strLevel = itemData.getItemExtInfo().strLevel;
				strAttrDict = ConfigManager.mgBeastStrengthen.getStrAttrDict(itemData.getType(), strLevel);
			}
			
			for(let key in baseAttrDict){
				if(!attrDict[key]){
					attrDict[key] = 0;
				}
				attrDict[key] += Number(baseAttrDict[key]);
				attrDict[key] += Number(starAttrDict[key]);
				attrDict[key] += strAttrDict[key] ? Number(strAttrDict[key]) : 0;
			}
		}
		return attrDict;
	}

	/**
	 * 神兽装备下级属性
	 */
	public static getBeastEquipNextAttrDict(itemData: ItemData): void{
		let strLevel: number;
		let baseAttrDict: any;
		let starAttrDict: any;
		let strAttrDict: any = {};
		let attrDict: any = {}
		if(ItemsUtil.isTrueItemData(itemData)){
			baseAttrDict = WeaponUtil.getBaseAttrDict(itemData);
			starAttrDict = ConfigManager.mgBeastEquip.getStarAttrDict(itemData.getEffect());
			strAttrDict = ConfigManager.mgBeastStrengthen.getStrAttrDict(itemData.getType(), itemData.beastStrLevel + 1);
			
			for(let key in baseAttrDict){
				if(!attrDict[key]){
					attrDict[key] = 0;
				}
				attrDict[key] += Number(baseAttrDict[key]);
				attrDict[key] += Number(starAttrDict[key]);
				attrDict[key] += strAttrDict[key] ? Number(strAttrDict[key]) : 0;
			}
		}
		return attrDict;
	}

	/**
	 * 神兽装备分解获得的经验
	 */
	public static getBeastEquipDecomposeExp(itemData: ItemData): number{
		let equipExp: number = ConfigManager.mgBeastEquip.getDecomposeExp(itemData.getEffect());
		let strengthExp: number = ConfigManager.mgBeastStrengthen.getDecomposeExp(itemData.getType(), itemData.beastStrLevel);
		return equipExp + strengthExp;
	}

}