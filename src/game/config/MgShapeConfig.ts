/**
 * 外形升级配置
 */
class MgShapeConfig extends BaseConfig {
	/**最大等级字典 */
	private maxStarDict: any;
	private petModelIds: Array<number> = [];
	private modelIds: any;
	private modelsDict: any;

	public constructor() {
		super("t_mg_shape", "shape,level");
	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this.maxStarDict = {};
		this.modelsDict = {};
		this.modelIds = {};
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

				let shape:number = Number((d[pks[0]]?d[pks[0]]:0));
				let level:number = Number((d[pks[1]]?d[pks[1]]:0));
				if (this.maxStarDict[shape] == null || (this.maxStarDict[shape]) != null && level > this.maxStarDict[shape]) {
					this.maxStarDict[shape] = level;
				}

				let stage: number = d.stage;
				if(this.modelsDict[shape] == null){
					this.modelsDict[shape] = {};
				}
				if(this.modelsDict[shape][d.modelId] == null || (this.modelsDict[shape][d.modelId] != null && this.modelsDict[shape][d.modelId] > d.stage)){
					this.modelsDict[shape][d.modelId] = d.stage;
				}

				if(this.modelIds[shape] == null){
					this.modelIds[shape] = [];
				}
				if(this.modelIds[shape].indexOf(d.modelId) == -1){
					this.modelIds[shape].push(d.modelId);
				}


				// if (d["shape"] == EShape.EShapePet) {
				// 	if (this.petModelIds.indexOf(d["modelId"]) == -1) {
				// 		this.petModelIds.push(d["modelId"]);
				// 	}
				// }

			}
		}
		return data;
	}

	/**
	 * 根据类型和等级获取配置
	 */
	public getByShapeAndLevel(shape:EShape, level:number):any{
		let key:string = `${shape},${level}`;
		return this.getByPk(key);
	}

	/**
	 * 获取x阶x星
	 */
	public getStageStar(shape:EShape, level:number):string{
		let data:any = this.getByShapeAndLevel(shape, level);
		if(data != null){
			let star: number = 0;
			if(data["star"] != null){
				star = data["star"];
			}
			return `${data["stage"]}阶${star}星`;
		}
		return "";
	}

	/**
	 * 获取最大等级
	 */
	public getMaxLevel(eshape: EShape): number {
		this.getDict();
		return this.maxStarDict[eshape];
	}

	/**
	 * 获取当前等级对应属性列表数据
	 * @param isInCludeNext 是否包含下级属性加成值
	 */
	public static getAttrListData(eshape: EShape, shapeLevel: number, isInCludeNext: boolean = true): Array<AttrInfo> {
		let attrs: Array<AttrInfo> = [];
		let attrArray: Array<any>;
		let maxLevel: number = ConfigManager.mgShape.getMaxLevel(eshape);
		let isNotActive: boolean = shapeLevel == -1;//未激活为-1
		let cfg: any;

		let level: number;
		if (isNotActive) {
			level = 0;
		}else{
			if (shapeLevel > maxLevel) {
				level = maxLevel;
			} else {
				level = shapeLevel;
			}
		}
		
		cfg = ConfigManager.mgShape.getByShapeAndLevel(eshape, level);

		if(!cfg) {
			if(level == 0) {
				level = 1;
				cfg = ConfigManager.mgShape.getByShapeAndLevel(eshape, level);
			}
		}

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
			nextCfg = ConfigManager.mgShape.getByShapeAndLevel(eshape, nextLevel);
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
			if (isNotActive) {
				attrInfo.value = 0;
			} else {
				attrInfo.value = current[1];
			}
			if (isInCludeNext) {
				if (isNotActive) {//未激活特殊处理
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

	public getPetModelIds(): Array<number> {
		return this.petModelIds;
	}

	public getModels(shape:EShape): any{
		if(this.modelIds[shape]){
			return this.modelIds[shape];
		}
		return {};
	}

	public getModelFirstStage(shape: EShape, modelId: number): number{
		if(this.modelsDict[shape] && this.modelsDict[shape][modelId]){
			return this.modelsDict[shape][modelId];
		}
		return -1;
	}

	/**获取下一个丹药使用上限等级 */
	public static getNextDrugMaxLevel(shape:EShape, level:number, drugType: number): number{
		let curCfg: any = ConfigManager.mgShape.getByShapeAndLevel(shape, level);
		let curDrugMax: number = curCfg[`drug${drugType}ItemMax`];
		let dict: any = ConfigManager.mgShape.getDict();
		let curDrugMaxLevel: number = 0;
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape) {
				if(level < data.level && curDrugMax < data[`drug${drugType}ItemMax`]){
					return data.level;
				}else if(level >= data.level && curDrugMax == data[`drug${drugType}ItemMax`]){//当前上限开启等级
					if(curDrugMaxLevel == 0){
						curDrugMaxLevel = data.level;
					}
				}
			}
		}
		return curDrugMaxLevel;
	}
}