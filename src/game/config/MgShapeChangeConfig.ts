class MgShapeChangeConfig extends BaseConfig {
	/**最大等级字典 */
	private maxStarDict: any;
	private skillDict: any;
	private talentSkillDict: any;

	public constructor() {
		super("t_mg_shape_change", "shape,change,level");
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

				let shape:number = Number((d[pks[0]]?d[pks[0]]:0));
				let change:number = Number((d[pks[1]]?d[pks[1]]:0));
				let level:number = Number((d[pks[2]]?d[pks[2]]:0));
				if(this.maxStarDict[shape] == null){
					this.maxStarDict[shape] = {};
				}
				if (this.maxStarDict[shape][change] == null || (this.maxStarDict[shape][change]) != null && level > this.maxStarDict[shape][change]) {
					this.maxStarDict[shape][change] = level;
				}

			}
		}
		return data;
	}

	/**
	 * 根据类型和等级获取配置
	 */
	public getByShapeChangeAndLevel(shape:EShape, change: number, level:number):any{
		let key:string = `${shape},${change},${level}`;
		return this.getByPk(key);
	}

	/**
	 * 获取x阶x星
	 */
	public getStageStar(shape:EShape, change: number, level:number):string{
		let data:any = this.getByShapeChangeAndLevel(shape, change, level);
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
	public getMaxLevel(eshape: EShape, change: number): number {
		if(!this.maxStarDict){
			this.getDict();
		}
		return this.maxStarDict[eshape][change];
	}

	/**
	 * 获取当前等级对应属性列表数据
	 * @param isInCludeNext 是否包含下级属性加成值
	 */
	public static getAttrListData(eshape: EShape, change: number, shapeLevel: number, isInCludeNext: boolean = true): Array<AttrInfo> {
		let attrs: Array<AttrInfo> = [];
		let attrArray: Array<any>;
		let maxLevel: number = ConfigManager.mgShapeChange.getMaxLevel(eshape, change);
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
		cfg = ConfigManager.mgShapeChange.getByShapeChangeAndLevel(eshape, change, level);
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
			nextCfg = ConfigManager.mgShapeChange.getByShapeChangeAndLevel(eshape, change, nextLevel);
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

	public getChangeDict(eshape: EShape): any{
		if(!this.maxStarDict){
			this.getDict();
		}
		return this.maxStarDict[eshape];
	}

	public setSkills(): any{
		if(!this.skillDict || !this.talentSkillDict){
			let dict: any = this.getDict();
			this.skillDict = {};
			this.talentSkillDict = {};
			for(let key in dict){
				let data: any = dict[key];
				if(data.skill){
					if(!this.skillDict[data.shape]){
						this.skillDict[data.shape] = {};
					}
					if(!this.skillDict[data.shape][data.change]){
						this.skillDict[data.shape][data.change] = {};
					}
					this.skillDict[data.shape][data.change][data.skill] = data.level ? data.level : 0;
				}
				if(data.talentSkill){
					if(!this.talentSkillDict[data.shape]){
						this.talentSkillDict[data.shape] = {};
					}
					if(!this.talentSkillDict[data.shape][data.change]){
						this.talentSkillDict[data.shape][data.change] = {};
					}
					this.talentSkillDict[data.shape][data.change][data.talentSkill] = data.level ? data.level : 0;
				}
			}
		}
	}

	/**
	 * 获取技能列表
	 */
	public getChangeSkillArr(shape: EShape, change: number): Array<number> {
		let skillArr: Array<number> = [];
		this.setSkills();
		for(let key in this.skillDict[shape][change]){
			skillArr.push(Number(key));
		}
		return skillArr;
	}

	/**
	 * 获取技能列表
	 * @returns {skillId: openLevel,skillId: openLevel}
	 */
	public getChangeSkillDict(shape: EShape, change: number): any {
		this.setSkills();
		return this.skillDict[shape][change];
	}

	/**
	 * 获取天赋技能
	 */
	public getChangeTalentSkill(shape: EShape, change: number): number {
		let talentSkill: number;
		this.setSkills();
		for(let key in this.talentSkillDict[shape][change]){
			talentSkill = Number(key);
		}
		return talentSkill;
	}

	public getOpenLevel(shape: EShape, change: number, skillId: number, isTalent: boolean): number{
		let dict: any = isTalent ? this.talentSkillDict : this.skillDict;
		let level: number = dict[shape][change][skillId];
		if(level){
			return level;
		}
		return 0;
	}

	public isChangeSkill(shape: EShape, skillId: number): boolean{
		this.setSkills();
		let changeDict: any = this.skillDict[shape]
		for(let change in changeDict){
			let dict: any = changeDict[change];
			if(dict[skillId]){
				return true;
			}
		}
		return false;
	}

	// /**
	//  * 获取化形列表
	//  * @param shapeChangeDict 化形等级字典，键为EShape
	//  */
	// public getShapeChanges(shape: EShape, shapeChangeDict: any): Array<any> {
	// 	let rtnShapes: Array<any> = [];
	// 	let shapes: Array<any> = this.select({ "shape": shape });
	// 	let shapeDict: any = {};
	// 	for (let shapeCfg of shapes) {
	// 		let change: number = shapeCfg.change;
	// 		if (shapeDict[change]) {
	// 			continue;
	// 		}
	// 		let changeLevel: number = 0;
	// 		if (shapeChangeDict[change] != null) {
	// 			changeLevel = shapeChangeDict[change];
	// 		}
	// 		let cfgLevel:number = 0;
	// 		if(shapeCfg.level != null){
	// 			cfgLevel = shapeCfg.level;
	// 		}
	// 		if (cfgLevel == changeLevel) {
	// 			rtnShapes.push(shapeCfg);
	// 			shapeDict[change] = true;
	// 		}
	// 	}
	// 	return rtnShapes;
	// }
}