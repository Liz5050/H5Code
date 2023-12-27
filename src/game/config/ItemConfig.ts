/**物品配置 */
class ItemConfig extends BaseConfig {
	/**时效性物品配置 */
	private expireConfig: BaseConfig;
	private isWeapon: boolean;
	private godEquips: any[];
	private shuraEquips: any[];
	private weaponSourceData:any;

	public constructor() {
		super("t_item", "code");
		this.weaponSourceData = ConfigManager.Data["t_item_weapon"];
		this.getExpireDict();
	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this.godEquips = [];
		this.shuraEquips = [];
		if (sourceData) {
			for (let d of sourceData) {
				var key: string = "";
				let pks = pk.split(",");
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;
				}
				data[key] = d;

			}
		}
		return data;
	}

	public getDict(): any {
		super.getDict();
		//合并t_item_weapon
		if (!this.isWeapon) {
			this.isWeapon = true;
			let weaponDataDict: any = this.parseByPk(this.weaponSourceData, this.pk);
			for (let code in weaponDataDict) {
				let d: any = weaponDataDict[code];
                d["overlay"] = 1;//装备默认都是不可叠加
				this.dataDict[code] = d;
				if (d['category'] == ECategory.ECategoryEquip || d['category'] == ECategory.ECategoryPetEquip) {
					if (d['godEquipType']) {
						this.godEquips.push(d);
					}
				}
				if(d['category'] == ECategory.ECategoryEquip && d['equipType'] && d['equipType'] == EEquipType.EEquipTypeJiuli){
					this.shuraEquips.push(d);
				}
			}
            this.weaponSourceData = null;
		}
		return this.dataDict;
	}

	public selectByCT(category: number, type: number): Array<any> {
		let data = [];
		let dict: any = this.getDict();
		for (let key in dict) {
			let d: any = dict[key];
			if (d['category'] == category && d['type'] == type) {
				data.push(d);
			}
		}
		return data;
	}

	public selectCTAndLevel(category: number, type: number, minLevel: number = 1, maxLevel: number = 9999): Array<any> {
		let data = [];
		let dict: any = this.selectByCT(category, type);
		for (let key in dict) {
			let d: any = dict[key];
			if (d['level'] >= minLevel && d['level'] <= maxLevel) {
				data.push(d);
			}
		}
		return data;
	}

	public selectCTAndItemLevel(category: number, type: number, minItemLevel: number = 1, maxItemLevel: number = 9999): Array<any> {
		let data = [];
		let dict: any = this.selectByCT(category, type);
		for (let key in dict) {
			let d: any = dict[key];
			if (d['itemLevel'] >= minItemLevel && d['itemLevel'] <= maxItemLevel) {
				data.push(d);
			}
		}
		return data;
	}

	public selectCTAndColor(category: number, type: number, minColor: number = 0, maxColor: number = 7, isItemData: boolean = false): Array<any> {
		let data = [];
		let colorDict: any = {};//每种颜色只取一个
		let dict: any = this.selectByCT(category, type);
		for (let key in dict) {
			let d: any = dict[key];
			if (d.color >= minColor && d.color <= maxColor && !colorDict[d.color]) {
				colorDict[d.color] = true;
				if (isItemData) {
					data.push(new ItemData(d.code));
				}
				else {
					data.push(d);
				}
			}
		}
		return data;
	}

	public selectCTShapeAndColor(category: number, type: number, shape: number, minColor: number = 0, maxColor: number = 7): Array<any> {
		let data = [];
		let dict: any = this.selectCTAndColor(category, type, minColor, maxColor);
		for (let key in dict) {
			let d: any = dict[key];
			if (d['shape'] == shape) {
				data.push(d);
			}
		}
		return data;
	}

	public selectCTAndShape(category: number, type: number, shape: number): Array<any> {
		let data = [];
		let dict: any = this.selectByCT(category, type);
		for (let key in dict) {
			let d: any = dict[key];
			if (d['shape'] == shape) {
				data.push(d);
			}
		}
		return data;
	}

	public selectMaxByCT(category: number, type: number): any {
		let data = null;
		let dict: any = this.selectByCT(category, type);
		for (let key in dict) {
			let d: any = dict[key];
			if (data) {
				if (d['itemLevel'] > data['itemLevel']) {
					data = d;
				}
			}
			else {
				data = d;
			}
		}
		return data;
	}

    /**
	 * 选择在商城出售的物品
     */
	public selectCTAndShopSell(category: number, type: number): Array<any> {
		let arr: Array<any> = this.selectByCT(category, type);
		let sellItemArr: Array<any> = [];
		if (arr.length) {
			for (let item of arr) {
				if (ConfigManager.shopSell.select({ "itemCode": item.code }).length)
					sellItemArr.push(item);
			}
		}
		return sellItemArr;
	}

	/**
	 * 如果是时效性物品，返回时效日期，否则返回null
	 */
	public getExpireInfo(itemCode: any): any {
		return this.getExpireDict().getByPk(itemCode);
	}

	/**获取所有时效性配置 */
	public getExpireDict(): BaseConfig {
		if (!this.expireConfig) {
			this.expireConfig = new BaseConfig("t_item_expire", "code");
		}
		return this.expireConfig;
	}

	/**可合成的神装 */
	public getGodEquipGenerate(career: number, type: number): any {
		this.getDict();
		let equipData: ItemData = null;
		let baseCareer: number = CareerUtil.getBaseCareer(career);
		let roleEquipScore: number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(baseCareer, type);
		let curScore: number = 0;
		let equipScore: number = 0;
		let canEquipData: ItemData = null;
		let canEquipScore: number = 0;
		for (let d of this.godEquips) {
			let itemData: ItemData;
			if (d['level'] >= 10 && d['godEquipType']) {//合成的最低级神装为10级  排除部分神装（不能合成和升级）
				if (d['newItemLevel'] && d['type'] == type && CareerUtil.getBaseCareer(d['career']) == baseCareer) {
					itemData = new ItemData(d.code);
					itemData.baseAttrAddRateGod = ItemsUtil.getBaseAttrAddRate();
					curScore = WeaponUtil.getScoreBase(itemData);
					if (curScore > roleEquipScore) {
						if (!equipData) {
							equipData = itemData;
							equipScore = curScore;
						} else if (equipScore > curScore) {
							equipData = itemData;
							equipScore = curScore;
						}
					} else {
						if (WeaponUtil.isCanEquipByItemData(itemData) && curScore > canEquipScore) {
							canEquipData = itemData;
							canEquipScore = curScore;
						}
					}
				}
			}

		}
		if (!WeaponUtil.isCanEquipByItemData(equipData)) {
			equipData = canEquipData;
		}
		return equipData;
	}

	/**可升级的神装 */
	public getGodEquipNext(itemCode: number): ItemData{
		let code: number = itemCode + 1;
		let nextItem: ItemData = new ItemData(code++);
		// if(ItemsUtil.isTrueItemData(nextItem) && !nextItem.isGodEquipType()){
		// 	nextItem = new ItemData(itemCode + 2);
		// }
		while(true){
			if(ItemsUtil.isTrueItemData(nextItem) && !nextItem.isGodEquipType()){
				nextItem = new ItemData(code++);
				continue;
			}
			break;
		}
		return nextItem;
	}

	/**可合成的九黎装备 */
	public getShuraEquipGenerate(career: number, type: number): any {
        this.getDict();
		let equipData: ItemData = null;
		let baseCareer: number = CareerUtil.getBaseCareer(career);
		let roleEquipScore: number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(baseCareer, type);
		let curScore: number = 0;
		let equipScore: number = 0;
		// let canEquipData: ItemData = null;
		// let canEquipScore: number = 0;
		let canEquipData: any = {"itemData": null, "score": 0};//评分比身上低的可穿戴装备
		let lowEquipData: any = {"itemData": null, "score": 0};//评分最低装备
		for (let d of this.shuraEquips) {
			let itemData: ItemData;
			if (d['type'] == type) {
				itemData = new ItemData(d.code);
				itemData.baseAttrAddRateGod = ItemsUtil.getBaseAttrAddRate();
				curScore = WeaponUtil.getScoreBase(itemData);
				if (curScore > roleEquipScore) {//评分比身上高的最低分的装备
					if (!equipData) {
						equipData = itemData;
						equipScore = curScore;
					} else if (equipScore > curScore) {
						equipData = itemData;
						equipScore = curScore;
					}
				} else {//评分比身上低的装备
					if (WeaponUtil.isCanEquipByItemData(itemData) && curScore > canEquipData.score) {//可穿戴的装备
						canEquipData.itemData = itemData;
						canEquipData.score = curScore;
						// canEquipScore = curScore;
					}
				}
				//评分最低装备
				if(!lowEquipData.itemData){
					lowEquipData.itemData = itemData;
					lowEquipData.score = curScore;
				}else if(lowEquipData.score > curScore){
					lowEquipData.itemData = itemData;
					lowEquipData.score = curScore;
				}
			}
		}
		if (!WeaponUtil.isCanEquipByItemData(equipData)) {
			if(canEquipData.itemData){
				equipData = canEquipData.itemData;
			}else{
				equipData = lowEquipData.itemData;
			}
		}
		return equipData;
	}

	/**
	 * 根据名称搜索
	 */
	public searchByName(name: string): Array<ItemData> {
		let itemDatas: Array<ItemData> = [];
		let dict: any = this.getDict();
		let info: any;
		for (let key in dict) {
			info = dict[key];
			if (info.name.indexOf(name) != -1) {
				itemDatas.push(new ItemData(info.code));
			}
		}
		return itemDatas;
	}

	public getMethodHeartByColorAndLevel(pos: number ,color : number , level : number) {
		let dict: any = this.getDict();
		let info: any;
		for (let key in dict) {
			info = dict[key];
			if(info.color == color) {
				if(info.category == 20) {
					if((info.equipType - 1)*5 + info.type == pos) {
						if(info.newItemLevel) {
							if(info.newItemLevel == level) {
								return info;
							}
						}
						else {
							if(level == 0) {
								return info;
							}
						}
					}
				}
			}
		}
		return null;
	}
}