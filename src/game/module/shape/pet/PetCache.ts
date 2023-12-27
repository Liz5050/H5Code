/**
 * 宠物
 */
class PetCache implements ICache {
	// private _shapeInfo: any;
	private eShape: EShape = EShape.EShapePet;
	// private curCfg: any;
	public petEquipType: Array<number> = [EShapePetEquipType.EShapePetEquipTypeOne,
		EShapePetEquipType.EShapePetEquipTypeTow, EShapePetEquipType.EShapePetEquipTypeThree,
		EShapePetEquipType.EShapePetEquipTypeFour];
	public constructor() {
	}

	public getTalentSkill(): any{
		let talentSkill: number;
		let data: any = {};
		let openLevel: number = 0;
		if(this.shapeInfo){
			talentSkill = this.shapeInfo.talentSkillId_I;
		}
		if(!talentSkill){
			talentSkill = ConfigManager.mgShapeOpen.getTalentSkillByShape(this.eShape);
		}
		data["shape"] = this.eShape;
		data["skillId"] = talentSkill;
		data["isOpen"] = this.isOpenSkill(talentSkill);
		data["isTalent"] = true;
		if(!data.isOpen){
			openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, talentSkill, data.isTalent);
		}else{
			openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, talentSkill+1, data.isTalent);
		}
		data["openLevelStr"] = ConfigManager.mgShape.getStageStar(this.eShape, openLevel);
		return data;
	}

	public getSkills(): Array<any>{
		let skillIds: Array<number> = ConfigManager.mgShapeOpen.getAllSkillByShape(this.eShape);
		let skillData: Array<any> = [];
		let data: any;
		let openLevel: number = 0;
		for(let skill of skillIds){
			data = {};
			data["shape"] = this.eShape;
			data["skillId"] = skill;
			data["isOpen"] = this.isOpenSkill(skill);
			data["isTalent"] = false;
			if(!data.isOpen){
				openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, skill, data.isTalent);
				data["openLevelStr"] = ConfigManager.mgShape.getStageStar(this.eShape, openLevel);
				// data["openLevel"] = ConfigManager.mgShapeOpen.getOpenLevel(this.eshape, skill, data.isTalent);
			}
			skillData.push(data);
		}
		return skillData;
	}

	public getDrugUsed(): any{
		let drugUsed: any = {};
		if (this.shapeInfo) {
			let drugCfg: any = this.shapeInfo.drugDict;
			for(let i = 0; i < drugCfg.key_I.length; i++){
				drugUsed[drugCfg.key_I[i]] = drugCfg.value_I[i];
			}
		}
		return drugUsed;
	}

	/**获取装备 */
	public getEquips(): any{
		let equips: any = {};
		if (this.shapeInfo) {
			let equipInfo: any = this.shapeInfo.equipDict;
			for(let i = 0; i < equipInfo.key_I.length; i++){
				equips[equipInfo.key_I[i]] = equipInfo.value_I[i];
			}
		}
		return equips;
	}
	/**判断宠物是否装备了某个装备 */
	public isEquip(code:number):boolean{
		let flag:boolean = false;
		if (this.shapeInfo) {
			let equipInfo: any = this.shapeInfo.equipDict;
			for(let i = 0; i < equipInfo.key_I.length; i++){
				if(equipInfo.value_I[i]==code){
					flag = true;
					break;
				}
			}
		}
		return flag;
	}

	public get shapeInfo(): any {
		return CacheManager.shape.getShapeInfo(this.eShape);
	}

	public get level(): number {
		if (this.shapeInfo) {
			return this.shapeInfo.level_I;
		}
		return -1;
	}

	public get warfare(): number {
		if (this.shapeInfo) {
			return this.shapeInfo.warfare_L64;
		}
		return 0;
	}

	public isOpenSkill(skillId: number): boolean {
		if(this.shapeInfo){
			if(skillId == this.shapeInfo.talentSkillId_I){
				return true;
			}else{
				for(let id of this.shapeInfo.skills.data_I){
					if(skillId == id){
						return true;
					}
				}
			}
		}
		return false;
	}

	public isCanActive(): boolean{
		if(!this.shapeInfo){
			return true;
		}
		return false;
	}

	public isCanUpgrade(): boolean{
		let cfg: any = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, this.level);
		if(this.level == ConfigManager.mgShape.getMaxLevel(this.eShape)){//已满级
			return false;
		}
		if(cfg){
			let count: number = CacheManager.pack.propCache.getItemCountByCode2(cfg.useItemCode);
			let costNum: number = cfg.useItemNum ? cfg.useItemNum : 0;
			return count >= costNum;
		}
		return false;
	}

	public isCanUseDrug(): boolean{
		let cfg: any = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, this.level);
		if(cfg){
			let drugCodes: Array<number> = MgShapeDrugAttrConfig.getDrugCodes(this.eShape);
			let drugUsed: any = CacheManager.pet.getDrugUsed();
			for (let i = 0; i < drugCodes.length; i++) {
				let code: number = drugCodes[i];
				let useMax: number = cfg[`drug${i + 1}ItemMax`];
				let usedNum: number = drugUsed[code] ? drugUsed[code] : 0;
				let count: number = CacheManager.pack.propCache.getItemCountByCode2(code);
				if((useMax - usedNum) > 0 && count > 0){
					return true;
				}
			}
		}
		return false;
	}

	public checkEquipDressByType(type: number): boolean{
		let equips: any = this.getEquips();
		let level: number = 0;
		let itemData: ItemData;
		let dressEquip: ItemData;
		if(equips[type]){
			itemData = new ItemData(equips[type]);
			level = itemData.getItemLevel();
		}
		dressEquip = CacheManager.pack.propCache.getPetEquipMaxLevel(level, type);
		return ItemsUtil.isTrueItemData(dressEquip);
	}

	public checkEquipUpgradeByType(type: number): boolean{
		let equips: any = this.getEquips();
		let itemData: ItemData;
		let packEquips: Array<ItemData>;
		if(equips[type]){
			itemData = new ItemData(equips[type]);
			let maxLevel: number = ConfigManager.mgShapeEquip.getMaxLevel(this.eShape, type);
			let equipCount: number;
			if(itemData.getItemLevel() >= maxLevel){//已达到最高级
				return false;
			}
			equipCount = CacheManager.pack.propCache.getItemCountByCode(itemData.getCode());
			if(equipCount >= 2){
				return true;
			}
		}
		return false;
	}

	public isEquipHasTipByType(type: number): boolean{
		if(this.checkEquipDressByType(type)){
			return true;
		}else if(this.checkEquipUpgradeByType(type)){
			return true;
		}
		return false;
	}

	public checkEquipTip(): boolean{
		for(let type of this.petEquipType){
			if(this.isEquipHasTipByType(type)){
				return true;
			}
		}
		return false;
	}

	public checkTips(): boolean{
		let flag: boolean = false;
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Pet, false)){
			if(this.isCanActive() || this.isCanUpgrade() || this.isCanUseDrug() || this.checkEquipTip() || CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isPetUpItem, ItemsUtil) > 0){
				flag = true;
			}
			if(!flag){
				flag = CacheManager.petChange.checkTips();
			}
		}
		return flag;
	}

	public clear(): void {

	}
}