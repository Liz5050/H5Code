/**
 * 养成系统
 */

class CultivateCache implements ICache {
	private _cultivateInfo: any = {};

	/**总战力 */
	private _cultivateFight: any = {};
	public constructor() {
	}
	/**
	 * 得到培养信息
	 */
	public getCultivateInfoByRoleAndType(roleIndex: number, type: number): any {
		if (this._cultivateInfo[roleIndex] && this._cultivateInfo[roleIndex][type]) {
			return this._cultivateInfo[roleIndex][type];
		}
		return null;
	}

	/**
	 * 养成系统战力更新
	 */
	public updateCultivateFight(type: ECultivateType, fight: number): void {
		this._cultivateFight[type] = fight;
		EventManager.dispatch(NetEventEnum.CultivateFightUpdate, type);
	}

	public set cultivateInfo(data: any) {
		this._cultivateInfo = data;
	}

	public get cultivateInfo(): any {
		return this._cultivateInfo;//roleIndex-type-pos-level
	}

	public getCultivateLevel(roleIndex: number, type: number, pos: number): number {
		let info: any = this.cultivateInfo[roleIndex];
		if (info) {
			let info2: any = info[type];
			if (info2) {
				info2 = info2.levelInfo;
				return info2[pos] == null ? -1 : info2[pos];
			}
		}
		return -1;
	}

	//获取已激活的数量
	public getCultivateActiveNum(roleIndex: number, type: number, subType: number): number {
		let num: number = 0;

		let info: any = this.getCultivateInfoByRoleAndType(roleIndex, type);
		if (info) {
			info = info.levelInfo;
			let posDic: any = ConfigManager.cultivate.getPosDic(type, subType);
			for (let key in info) {
				if (posDic[key] && info[key] != null) {
					num += 1;
				}
			}
		}

		return num;
	}

	/**
	 * 获取战力加成
	 */
	public getCultivateFight(type: ECultivateType): number {
		if (!this._cultivateFight[type]) {
			return 0;
		}
		return this._cultivateFight[type];
	}

	// ---------------------- 图鉴红点相关 ------------------------

	//有可分解的图鉴
	public hasDecomposeItem(): boolean {
		let items: Array<ItemData> = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp, EProp.EPropIllustratedCard);
		if (items.length > 0) {
			for (let item of items) {
				let canDecompose: boolean = true;
				let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(item.getCode());
				if (datas.length > 0) {
					for (let data of datas) {
						if (this.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position) == -1) {
							canDecompose = false;
							break;
						}
					}
				}
				if (canDecompose) {
					return true;
				}
			}
		}
		return false;
	}

	//有可升级的图鉴
	public hasCanUpgrateIllus(): boolean {
		//有可升级的图鉴
		let info: any = this.getCultivateInfoByRoleAndType(0, ECultivateType.ECultivateTypeIllustrated);
		let levelNums: any = {};
		let exp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp);
		if (info) {
			info = info.levelInfo;
			for (let key in info) {
				let level: number = info[key];
				let position: number = Number(key);
				let config: any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, position, level + 1);
				if (config) {
					let needExp: number = config.itemNum;
					if (exp >= needExp) {
						return true;
					}
				}
			}
		}
		return false;
	}

	//小类红点
	public checkIllustrateSubtypeTips(subType: number): boolean {
		//有可激活的图鉴
		let items: Array<ItemData> = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp, EProp.EPropIllustratedCard);
		if (items.length > 0) {
			for (let item of items) {
				let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(item.getCode());
				if (datas.length > 0) {
					for (let data of datas) {
						if (data.subtype == subType && ConfigManager.cultivate.checkCareerFix(data) && this.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position) == -1) {
							return true;
						}
					}
				}
			}
		}
		//有可升级的图鉴
		let info: any = this.getCultivateInfoByRoleAndType(0, ECultivateType.ECultivateTypeIllustrated);
		let levelNums: any = {};
		let exp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp);
		if (info) {
			info = info.levelInfo;
			for (let key in info) {
				let level: number = info[key];
				let position: number = Number(key);
				let config: any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, position, level + 1);
				if (config && config.subtype == subType) {
					let needExp: number = config.itemNum;
					if (exp >= needExp) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/** 
	 * 图鉴红点
	 */
	public checkIllustrateTips(canLvlup: boolean): boolean {
		//有可激活或者可分解的图鉴
		let items: Array<ItemData> = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp, EProp.EPropIllustratedCard);
		if (items.length > 0) {
			for (let item of items) {
				let canDecompose: boolean = true;
				let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(item.getCode());
				if (datas.length > 0) {
					for (let data of datas) {
						if (this.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position) == -1) {
							if (ConfigManager.cultivate.checkCareerFix(data)) {
								return true;
							}
							canDecompose = false;
						}
					}
				}
				if (canDecompose) {
					return true;
				}
			}
		}
		if (!canLvlup) {
			return false;
		}
		//有可升级的图鉴
		let info: any = this.getCultivateInfoByRoleAndType(0, ECultivateType.ECultivateTypeIllustrated);
		let levelNums: any = {};
		let exp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp);
		if (info) {
			info = info.levelInfo;
			for (let key in info) {
				let level: number = info[key];
				let position: number = Number(key);
				let config: any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, position, level + 1);
				if (config) {
					let needExp: number = config.itemNum;
					if (exp >= needExp) {
						return true;

					}
				}
			}
		}

		return false;
	}

	// -------------------------------------------------------------

	public clear(): void {

	}
}