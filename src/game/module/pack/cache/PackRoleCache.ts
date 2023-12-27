class PackRoleCache extends PackBaseCache {
	public constructor(params: any) {
		super(params);
	}

	/**
	 * 装备是否已装备
	 */
	public isDressed(itemData: ItemData): boolean {
		return this.hasItem(itemData);
	}

	/**
	 * 是否装备了守护
	 * @param isExp true小鬼怪，false小仙女
	 */
	public isDressedSpirit(isExp: boolean): boolean {
		let itemData: ItemData = this.getItemAtIndex(EDressPos.EDressPosSpirit);
		if (isExp) {
			return ItemsUtil.isSpiritExp(itemData);
		} else {
			return ItemsUtil.isSpiritFairy(itemData);
		}
	}

	/**
	 * 获取当前装备生效的总强化等级。
	 */
	public getTotalStrengthenLevel(): number {
		let total: number = 0;
		for (let itemData of this.itemDatas) {
			if (itemData && itemData.getType() <= EEquip.EEquipHeartLock) {//12件
				total += itemData.getEnabledStrengthenLevel();
			}
		}
		return total;
	}

	/**根据穿戴位置获取装备 */
	public getDressEquipByPos(pos: EDressPos, roleIndex: number): ItemData {
		for (let itemData of this.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData) && ItemsUtil.getEqiupPos(itemData) == pos && roleIndex == itemData.getRoleIndex()) {
				return itemData;
			}
		}
		return null;
	}

	/**根据穿戴位置获取装备评分 */
	public getDressEquipScoreByPos(pos: EDressPos, roleIndex: number): number {
		let score: number = 0;
		let item: ItemData = this.getDressEquipByPos(pos, roleIndex);
		if (item) {
			score = WeaponUtil.getScoreBase(item);
		}
		return score;
	}

	/**根据穿戴位置获取装备 */
	public getDressEquipByType(type: number, roleIndex: number): ItemData {
		for (let itemData of this.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData) && itemData.getType() == type && roleIndex == itemData.getRoleIndex()) {
				return itemData;
			}
		}
		return null;
	}


	/**
	 * 获取当前装备生效的总星级等级。
	 */
	public getTotalStarLevel(): number {
		let total: number = 0;
		for (let itemData of this.itemDatas) {
			if (itemData && itemData.getType() <= EEquip.EEquipHeartLock) {//12件
				total += WeaponUtil.getStar(itemData);
			}
		}
		return total;
	}

	/**
	 * 获取当前装备生效的总宝石等级。
	 */
	public getTotalStoneLevel(): number {
		var total: number = 0;
		for (let itemData of this.itemDatas) {
			if (itemData && itemData.getType() <= EEquip.EEquipHeartLock) {//12件
				total += itemData.getStoneLevel();
			}
		}
		return total;
	}

	/**
	 * 获取角色装备
	 * @param index 角色下标 (第几个角色0 1 2)
	 * @returns key为装备位置(物品小类)
	 */
	public getEquips(index: number): { [key: number]: ItemData } {
		let equipDict: { [key: number]: ItemData } = {};
		for (let itemData of this.itemDatas) {
			if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryEquip) {
				let roleIndex: number = itemData.getRoleIndex();
				if (roleIndex == index) {
					equipDict[itemData.getType()] = itemData;
				}

			}
		}
		return equipDict;
	}

	/**
	 * 获取所有角色已穿装备的评分
	 * {"career": {"type": "score"}}
	 */
	public getEquipsScoreDict(): any {
		let dict: any = {};
		let career: number;
		let type: number;
		for (let itemData of this.itemDatas) {
			career = CareerUtil.getBaseCareer(itemData.getCareer());
			type = itemData.getType();
			if (career == 0) {
				let index: number = itemData.getRoleIndex();
				career = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(index));
			}
			if (dict[career] == null) {
				dict[career] = {};
			}
			dict[career][type] = WeaponUtil.getScoreBase(itemData);
		}
		return dict;
	}

	/**
	 * 获取通用装备评分字典
	 * 通用装备
	 * {"type": ["score"]}
	 */
	public getCareer0EquipsScoreDict(): any {
		let dict: any = {};
		let career: number;
		let type: number;
		for (let itemData of this.itemDatas) {
			career = CareerUtil.getBaseCareer(itemData.getCareer());
			type = itemData.getType();
			if (career == 0) {
				let index: number = itemData.getRoleIndex();
				career = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(index));
				if (dict[type] == null) {
					dict[type] = [];
				}
				dict[type].push(WeaponUtil.getScoreBase(itemData));
			}
		}
		//评分按小到大排序
		for (let key in dict) {
			if (dict[key] instanceof Array) {
				dict[key].sort((a: number, b: number): number => {
					return a - b;
				});
			}
		}
		return dict;
	}

	/**
	 * 获取已穿戴装备字典
	 */
	public getEquipsDict(): { [type: number]: Array<ItemData> } {
		let equips: { [type: number]: Array<ItemData> } = {};
		let type: number;
		for (let itemData of this.itemDatas) {
			type = itemData.getType();
			if (equips[type] == null) {
				equips[type] = [];
			}
			equips[type].push(itemData);
		}
		return equips;
	}

	/**
	 * 获取所有角色已穿装备的总评分
	 */
	public getAllEquipedScore(): number {
		let score: number = 0;
		for (let itemData of this.itemDatas) {
			score += WeaponUtil.getTotalScore(itemData);
		}
		return score;
	}

	/**
	 * 获取角色某个已穿装备的评分
	 */
	public getEquipsScoreByCT(career: number, type: number): number {
		let equipsScoreDict: any = this.getEquipsScoreDict();
		if (equipsScoreDict[career] && equipsScoreDict[career][type]) {
			return equipsScoreDict[career][type];
		}
		return 0;
	}

	/**某个位置是否全都穿戴装备 */
	public isDressedAllRolesByPos(pos: number): boolean{
		for(let index of RoleIndexEnum.RoleIndexAll){
			if(index < CacheManager.role.roles.length){
				if(this.getDressEquipByPos(pos, index) == null){
					return false;
				}
			}else{
				return false;
			}
		}
		return true;
	}

	public clear(): void {

	}
}