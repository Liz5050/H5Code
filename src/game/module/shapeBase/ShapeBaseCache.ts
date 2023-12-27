class ShapeBaseCache implements ICache {
	protected eShape: EShape = EShape.EShapeBattle;
	protected openModuleName: string = "0";

	public constructor() {
		//继承cache后在此修改eshape为对应的shape
	}

	public getInfo(roleIndex: number): any {
		return CacheManager.shape.getShapeInfo(this.eShape, roleIndex);
	}

	public getLevel(roleIndex: number): number {
		let info: any = this.getInfo(roleIndex);
		if (info) {
			return info.level_I;
		}
		return -1;
	}

	public getWarfare(roleIndex: number): number {
		let info: any = this.getInfo(roleIndex);
		if (info) {
			return info.warfare_L64;
		}
		return 0;
	}


	public isOpenSkill(skillId: number, roleIndex: number): boolean {
		let info: any = this.getInfo(roleIndex);
		if (info) {
			if (skillId == info.talentSkillId_I) {
				return true;
			} else {
				for (let id of info.skills.data_I) {
					if (skillId == id) {
						return true;
					}
				}
			}
		}
		return false;
	}


	public isCanActive(roleIndex: number): boolean {
		if (ConfigManager.mgOpen.isOpenedByKey(this.openModuleName, false)) {
			if (!this.getInfo(roleIndex)) {
				let activeNum: number = this.getActiveNum();
				let openLevel: number;
				if (activeNum == 0) {
					return true;//可开启第一个外形
				} else if (activeNum == 3) {
					return false;//三个外形都已开启
				} else {
					openLevel = ConfigManager.mgShapeActiveOpen.getOpenLevel(activeNum, this.eShape);
					return this.getAllStageNow() >= openLevel;
				}
			}
		}
		return false;
	}


	public getActiveStr(roleIndex: number): string {
		let cond: string = ConfigManager.mgShapeActiveOpen.getOpenCondDesc(this.getActiveNum(), this.eShape);
		return HtmlUtil.br(cond);
	}

	public isCanUpgrade(roleIndex: number): boolean {
		let cfg: any = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, this.getLevel(roleIndex));
		if (this.getLevel(roleIndex) == ConfigManager.mgShape.getMaxLevel(this.eShape)) {//已满级
			return false;
		}
		if (cfg) {
			let count: number = CacheManager.pack.propCache.getItemCountByCode2(cfg.useItemCode);
			let costNum: number = cfg.useItemNum ? cfg.useItemNum : 0;
			return count >= costNum;
		}
		return false;
	}


	public isCanUseDrug(roleIndex: number): boolean {
		let cfg: any = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, this.getLevel(roleIndex));
		if (cfg) {
			let drugCodes: Array<number> = MgShapeDrugAttrConfig.getDrugCodes(this.eShape);
			let drugUsed: any = this.getDrugUsed(roleIndex);
			for (let i = 0; i < drugCodes.length; i++) {
				let code: number = drugCodes[i];
				let useMax: number = cfg[`drug${i + 1}ItemMax`];
				let usedNum: number = drugUsed[code] ? drugUsed[code] : 0;
				let count: number = CacheManager.pack.propCache.getItemCountByCode2(code);
				if ((useMax - usedNum) > 0 && count > 0) {
					return true;
				}
			}
		}
		return false;
	}

	public getDrugUsed(roleIndex: number): any {
		let drugUsed: any = {};
		let info: any = this.getInfo(roleIndex);
		if (info) {
			let drugCfg: any = info.drugDict;
			for (let i = 0; i < drugCfg.key_I.length; i++) {
				drugUsed[drugCfg.key_I[i]] = drugCfg.value_I[i];
			}
		}
		return drugUsed;
	}



	public getSkills(roleIndex: number): Array<any> {
		let skillIds: Array<number> = ConfigManager.mgShapeOpen.getAllSkillByShape(this.eShape);
		let skillData: Array<any> = [];
		let data: any;
		let openLevel: number = 0;
		for (let skill of skillIds) {
			data = {};
			data["shape"] = this.eShape;
			data["skillId"] = skill;
			data["isOpen"] = this.isOpenSkill(skill, roleIndex);
			data["isTalent"] = false;
			data["roleIndex"] = roleIndex;
			if (!data.isOpen) {
				openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, skill, data.isTalent);
				data["openLevelStr"] = ConfigManager.mgShape.getStageStar(this.eShape, openLevel);
			}
			skillData.push(data);
		}
		return skillData;
	}

	public getTalentSkill(roleIndex: number): any {
		let talentSkill: number;
		let data: any = {};
		let openLevel: number = 0;
		let info: any = this.getInfo(roleIndex);
		if (info) {
			talentSkill = info.talentSkillId_I;
		}
		if (!talentSkill) {
			talentSkill = ConfigManager.mgShapeOpen.getTalentSkillByShape(this.eShape);
		}
		data["shape"] = this.eShape;
		data["skillId"] = talentSkill;
		data["isOpen"] = this.isOpenSkill(talentSkill, roleIndex);
		data["isTalent"] = true;
		data["roleIndex"] = roleIndex;
		if (!data.isOpen) {
			openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, talentSkill, data.isTalent);
		} else {
			openLevel = ConfigManager.mgShapeOpen.getOpenLevel(this.eShape, talentSkill + 1, data.isTalent);
		}
		data["openLevelStr"] = ConfigManager.mgShape.getStageStar(this.eShape, openLevel);
		return data;
	}

	public CheckTalentCanUpdate(roleIndex: number) {
		return false;
	}

	public upgradeShape(info: any) {
		let shapeInfo = this.getInfo(info.roleIdx);
		if (info.result) {//升星
			shapeInfo.lucky_I = info.addLucky;
		} else {
			shapeInfo.lucky_I += info.addLucky;
		}
	}

	public getEquips(roleIndex: number): any {
		let equips: any = {};
		if (this.getInfo(roleIndex)) {
			let equipInfo: any = this.getInfo(roleIndex).equipDict;
			for (let i = 0; i < equipInfo.key_I.length; i++) {
				equips[equipInfo.key_I[i]] = equipInfo.value_I[i];
			}
		}
		return equips;
	}

	public isCanReplaceEquip(roleIndex: number, pos: number) {
		let equips: any = this.getEquips(roleIndex);
		let equipData: any = ConfigManager.item.getByPk(equips[pos]);
		let level: number = 0;
		let packEquips: Array<ItemData> = CacheManager.pack.propCache.getShapeEquipsByPos(this.eShape, pos);
		if (equipData) {
			level = equipData.itemLevel;
		}
		for (let itemData of packEquips) {
			if (itemData.getItemLevel() > level) {
				return true;
			}
		}
		return false;
	}

	public isRoleHasEquipTip(roleIndex: number) {
		if (this.getInfo(roleIndex)) {
			for (let type of CacheManager.pet.petEquipType) {
				if (this.isCanReplaceEquip(roleIndex, type)) {
					return true;
				}
			}
		}
		return false;
	}


	public getActiveNum(): number {
		let num = 0;
		for (let index of RoleIndexEnum.RoleIndexAll) {
			if (this.getInfo(index)) {
				num++;
			}
		}
		return num;
	}

	public getAllStageNow(): number {
		let num: number = 0;
		for (let index of RoleIndexEnum.RoleIndexAll) {
			let info: any = this.getInfo(index);
			if (info) {
				let cfg = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, info.level_I);
				if (cfg) {
					num += cfg.stage;
				}
			}
		}
		return num;
	}

	public checkTipsByRoleIndex(roleIndex: number): boolean {
		return false;
	}

	public checkTips(): boolean {
		if (ConfigManager.mgOpen.isOpenedByKey(this.openModuleName, false)) {
			for (let index = 0; index < CacheManager.role.roles.length; index++) {
				if (this.checkTipsByRoleIndex(index)) {
					return true;
				}
			}
		}

		return false;
	}

	public clear(): void {

	}




}