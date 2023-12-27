/**
 * 强化扩展工具类
 */
class StrengthenExUtil {
	public constructor() {
	}

	/**
	 * 获取当前等级对应属性列表数据
	 * @param isInCludeNext 是否包含下级属性加成值
	 */
	public static getAttrListData(strengthenType: EStrengthenExType, strengthenLevel: number, isInCludeNext: boolean = true): Array<AttrInfo> {
		let attrs: Array<AttrInfo> = [];
		let attrArray: Array<any>;
		let maxLevel: number = ConfigManager.mgStrengthenEx.getMaxLevel(strengthenType);
		let cfg: any;

		let level: number;
		if (strengthenLevel > maxLevel) {
			level = maxLevel;
		} else {
			level = strengthenLevel;
		}
		cfg = ConfigManager.mgStrengthenEx.getByTypeAndLevel(strengthenType, level);
		attrArray = WeaponUtil.getAttrArray(cfg.attrList);

		let nextCfg: any;
		let nextAttrArray: Array<any>
		if (isInCludeNext) {
			let nextLevel: number;
			if (level >= maxLevel) {
				nextLevel = maxLevel;
			} else {
				nextLevel = level + 1;
			}
			nextCfg = ConfigManager.mgStrengthenEx.getByTypeAndLevel(strengthenType, nextLevel);
			nextAttrArray = WeaponUtil.getAttrArray(nextCfg.attrList);
		}

		let current: any;
		let next: any;
		let attrInfo: AttrInfo;
		for (let i: number = 0; i < attrArray.length; i++) {
			current = attrArray[i];
			attrInfo = new AttrInfo();
			attrInfo.type = current[0];
			attrInfo.name = GameDef.EJewelName[current[0]][0];
			attrInfo.value = current[1];
			if (isInCludeNext) {
				next = nextAttrArray[i];
				attrInfo.addValue = next[1] - current[1];
			}
			attrs.push(attrInfo);
		}
		return attrs;
	}

	/**
	 * 获取显示属性字典
	 * 键为装备type，值为属性字典
	 */
	public static getShowAttrDict(strengthenType: EStrengthenExType, strengthenLevel: number): any {
		let attrDict: any = {};
		let tmpArray: Array<string>;
		let cfg: any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(strengthenType, strengthenLevel);
		if (cfg != null && cfg.showAttrList) {
			//1:1,8#3,3;2:2,0#4,0;3:1,0#3,0;4:2,0#4,0;5:1,0#3,0;6:2,0#4,0;7:1,0#3,0;8:2,0#4,0
			let typeArray: Array<any> = (cfg.showAttrList as string).split(";");//一个部位属性
			for (let str of typeArray) {
				if (str != "") {//str为  1:1,8#3,3
					tmpArray = str.split(":");
					attrDict[tmpArray[0]] = WeaponUtil.getAttrDict(tmpArray[1]);
				}
			}
		}
		return attrDict;
	}

	/**
	 * 获取部位强化等级
	 * @param itemIndex 序号，从0开始
	 * @param strengthenLevel 当前总强化等级
	 * @param itemCount部位数量
	 */
	public static getItemStrengthenLevel(itemIndex: number, strengthenLevel: number, itemCount: number): number {
		// itemIndex + 1 + (n - 1) * 8 = strengthenLevel;
		return Math.floor((strengthenLevel - itemIndex - 1) / itemCount + 1);
	}

	/**
	 * 获取当前需要强化部位序号
	 * @param strengthenLevel 当前强化等级
	 */
	public static getCurrentItemIndex(strengthenLevel: number, itemCount: number): number {
		let index: number = strengthenLevel % itemCount;
		return index;
	}

	/**
	 * 获取当前强化配置
	 */
	public static getCurrentCfg(type: EStrengthenExType, roleIndex: number): any {
		let strengthenLevel: number = CacheManager.role.getPlayerStrengthenExLevel(type, roleIndex);
		return ConfigManager.mgStrengthenEx.getByTypeAndLevel(type, strengthenLevel);
	}


	/**
	 * 是否可以强化
	 */
	public static checkCanStrengthen(type:EStrengthenExType): boolean {
		let openKey:string;
		if(type == EStrengthenExType.EStrengthenExTypeUpgrade) {
			openKey = PanelTabType[PanelTabType.Strengthen];
		}
		else if(type == EStrengthenExType.EStrengthenExTypeCast) {
			openKey = PanelTabType[PanelTabType.Casting];
		}
		else if(type == EStrengthenExType.EStrengthenExTypeRefine) {
			openKey = PanelTabType[PanelTabType.Refine];
		}
		else if(type == EStrengthenExType.EStrengthenExTypeNerve) {
			openKey = PanelTabType[PanelTabType.Nerve];
		}
		else if(type == EStrengthenExType.EStrengthenExTypeInternalForce) {
			openKey = PanelTabType[PanelTabType.InnerPower];
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(openKey,false)) return false;
		for (let i: number = 0; i < CacheManager.role.roles.length; i++) {
			if (CacheManager.role.isCanUpgradeStrengthenEx(type, i)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否可以强化
	 */
	public static checkStrengthenExCanActive(type:EStrengthenExType): boolean {
		for (let i: number = 0; i < CacheManager.role.roles.length; i++) {
			if (CacheManager.role.isStrengthenExCanActive(type, i)) {
				return true;
			}
		}
		return false;
	}
}