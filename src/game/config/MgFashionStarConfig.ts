class MgFashionStarConfig extends BaseConfig{
	/**最大等级字典 */
	private maxStarDict: any;

	public constructor() {
		super("t_mg_fashion_star", "code,star");
	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this.maxStarDict = {};
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
			for (let d of sourceData) {
				key = "";
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

				let code:number = Number((d[pks[0]]?d[pks[0]]:0));
				let star:number = Number((d[pks[1]]?d[pks[1]]:0));
				if (this.maxStarDict[code] == null || (this.maxStarDict[code]) != null && star > this.maxStarDict[code]) {
					this.maxStarDict[code] = star;
				}

			}
		}
		return data;
	}

	/**
	 * 根据强化类型和强化等级获取配置
	 */
	public getByCodeAndStar(fashionCode: number, fashionStar: number): any {
		let key: string = `${fashionCode},${fashionStar}`;
		return this.getByPk(key);
	}

	/**
	 * 获取最大等级
	 */
	public getMaxStar(code: number): number {
		this.getDict();
		return this.maxStarDict[code];
	}

	/**
	 * 获取当前等级对应属性列表数据
	 * @param isInCludeNext 是否包含下级属性加成值
	 */
	public static getAttrListData(fashionCode: number, fashionStar: number, isInCludeNext: boolean = true): Array<AttrInfo> {
		let attrs: Array<AttrInfo> = [];
		let attrArray: Array<any>;
		let maxStar: number = ConfigManager.mgFashionStar.getMaxStar(fashionCode);
		let isZero: boolean = fashionStar == 0;
		let cfg: any;

		let star: number;
		if (isZero) {
			star = 1;
		}else{
			if (fashionStar > maxStar) {
				star = maxStar;
			} else {
				star = fashionStar;
			}
		}
		cfg = ConfigManager.mgFashionStar.getByCodeAndStar(fashionCode, star);
		attrArray = WeaponUtil.getAttrArray(cfg.attrList);

		let nextCfg: any;
		let nextAttrArray: Array<any>
		if (isInCludeNext) {
			let nextLevel: number;
			if (star >= maxStar) {
				nextLevel = maxStar;
			} else {
				nextLevel = star + 1;
			}
			nextCfg = ConfigManager.mgFashionStar.getByCodeAndStar(fashionCode, nextLevel);
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
			if (isZero) {
				attrInfo.value = 0;
			} else {
				attrInfo.value = current[1];
			}
			// attrInfo.value = current[1];
			if (isInCludeNext) {
				if (isZero) {//0级特殊处理
					attrInfo.addValue = current[1];
				} else {
					next = nextAttrArray[i];
					attrInfo.addValue = next[1] - current[1];
				}
			}
			attrs.push(attrInfo);
		}
		return attrs;
	}

}