class PetChangeCache implements ICache{
	private shape: number;

	public constructor() {
		this.shape = EShape.EShapePet;
	}

	public getInfoByChange(change: number):  any{
		let info: Array<any> = CacheManager.shape.getChangesInfo(this.shape);
		for(let changeEx of info){
			if(changeEx.change_I == change){
				return changeEx;
			}
		}
		return null;
	}

	public getChangesData(shape: EShape): Array<any>{
		let changeDict: any = ConfigManager.mgShapeChangeEx.getChangeDict(shape);
		let changeArr: Array<any> = [];
		let changeCfg: any;
		let changeEx: any;
		let changeData: any;
		for(let changeCode in changeDict){
			changeData = {};
			changeData["shape"] = this.shape;
			changeData["change"] = changeCode;
			changeEx = this.getInfoByChange(Number(changeCode));
			if(changeEx){
				changeCfg = ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(shape, Number(changeCode), changeEx.level_I);
				changeData["isActived"] = true;
				changeData["level"] = changeEx.level_I;
				changeData["cfg"] = changeCfg;
				changeData["info"] = changeEx;
				changeArr.push(changeData);
			}else{
				changeCfg = ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(shape, Number(changeCode), 0);
				changeData["iaActived"] = false;
				if(changeCfg.defaultShow){
					changeData["level"] = -1;
					changeData["cfg"] = changeCfg;
					changeArr.push(changeData);
				}else if(CacheManager.pack.propCache.getItemCountByCode(changeCfg.activateProp) > 0){
					changeData["level"] = -1;
					changeData["cfg"] = changeCfg;
					changeArr.push(changeData);
				}
			}
		}
		return changeArr;
	}

	public getTalentSkill(change: number): any{
		let info: any = this.getInfoByChange(change);
		let skillIndex: number;
		let skillLevel: number = 1;
		let skillChangeCfg: any;
		let data: any = {};
		let openLevel: number = 0;
		if(info){
			let skillDict: any = StructUtil.dictIntIntToDict(info.upgradeSkillDict);
			for(let key in skillDict){
				skillIndex = Number(key);
				skillLevel = skillDict[key];
			}
		}
		if(!skillIndex){
			skillIndex = ConfigManager.mgShapeChangeEx.getChangeTalentSkill(this.shape, change);
		}
		skillChangeCfg = ConfigManager.mgShapeChangeSkillUpgrade.getByPk(`${skillIndex},${skillLevel}`);

		data["shape"] = this.shape;
		data["skillId"] = skillChangeCfg.skillId;
		data["skillIndex"] = skillIndex;
		data["change"] = change;
		data["isOpen"] = this.isOpenSkill(change, skillIndex);
		data["isTalent"] = true;
		data["isChange"] = true;
		if(!data.isOpen){
			openLevel = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skillIndex, data.isTalent);
			data["openLevelStr"] = ConfigManager.mgShapeChangeEx.getStageStar(this.shape, change, openLevel);
		}else{
			data["propCode"] = skillChangeCfg.costItem;
			data["propCost"] = skillChangeCfg.costAmount;
		}
		return data;
	}

	public getSkills(change: number): Array<any>{
		let skillIds: Array<number> = ConfigManager.mgShapeChangeEx.getChangeSkillArr(this.shape, change);
		let skillData: Array<any> = [];
		let data: any;
		let openLevel: number = 0;
		for(let skill of skillIds){
			data = {};
			data["shape"] = this.shape;
			data["skillId"] = skill;
			data["isOpen"] = this.isOpenSkill(change, skill);
			data["isTalent"] = false;
			data["isChange"] = true;
			if(!data.isOpen){
				openLevel = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skill, data.isTalent);
				data["openLevelStr"] = ConfigManager.mgShapeChangeEx.getStageStar(this.shape, change, openLevel);
			}
			skillData.push(data);
		}
		return skillData;
	}

	public isOpenSkill(change: number, skillId: number): boolean{
		let info: any = this.getInfoByChange(change);
		if(info){
			let skillDict: any = StructUtil.dictIntIntToDict(info.upgradeSkillDict);
			for(let key in skillDict){
				if(skillId == Number(key)){
					return true;
				}
			}
			for(let id of info.skills.data_I){
				if(skillId == id){
					return true;
				}
			}
		}
		return false;
	}

	public isCanActive(change: number): boolean{
		// let changeCfg: any = ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(this.shape, change, 1);
		// if(CacheManager.pack.propCache.getItemCountByCode(this.curData.cfg.activateProp) >= this.curData.cfg.activateNum){
		// 	return true;
		// }
		return false;
	}

	public isCanUpgrade(change: number): boolean{
		// if(this.level == ConfigManager.mgShape.getMaxLevel(EShape.EShapePet)){//已满级
		// 	return false;
		// }
		// if(this.curCfg){
		// 	let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.curCfg.useItemCode);
		// 	let costNum: number = this.curCfg.useItemNum ? this.curCfg.useItemNum : 0;
		// 	return count > costNum;
		// }
		return false;
	}

	public isCanUpgradeTSkill(change: number): boolean{
		let tSkillData: any = this.getTalentSkill(change);
		if(tSkillData.isOpen && CacheManager.pack.propCache.getItemCountByCode(tSkillData.propCode) >= tSkillData.propCost){
			if(ConfigManager.skill.getByPk(tSkillData.skillId + 1) != null){
				return true;
			}
		}
		return false;
	}

	public checkTipsByChangeData(change: number, data: any): boolean{
		if(data.isActived){
			let count: number = CacheManager.pack.propCache.getItemCountByCode(data.cfg.costItemCode);
			let costNum: number = data.cfg.costItemNum ? data.cfg.costItemNum : 0;
			if((count >= costNum && data.level < ConfigManager.mgShapeChangeEx.getMaxLevel(this.shape, data.change))){
				return true;
			}else if(this.isCanUpgradeTSkill(data.change)){
				return true;
			}
		}else{
			if(CacheManager.pack.propCache.getItemCountByCode(data.cfg.activateProp) >= data.cfg.activateNum){
				return true;
			}
		}
		return false;
	}

	public checkTips(): boolean{
		let changeDatas: any = this.getChangesData(this.shape);
		for(let data of changeDatas){
			if(this.checkTipsByChangeData(data.change, data)){
				return true;
			}
		}
		return false;
	}

	public clear():void{

	}
}