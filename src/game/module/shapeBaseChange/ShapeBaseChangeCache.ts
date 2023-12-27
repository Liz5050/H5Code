class ShapeBaseChangeCache implements ICache{
	protected shape: number;

	public constructor() {
		this.shape = EShape.EShapeBattle;
	}

	public getInfoByChange(change: number, roleIndex: number):  any{
		let info: Array<any> = CacheManager.shape.getChangesInfoRole(this.shape, roleIndex);
		for(let changeEx of info){
			if(changeEx.change_I == change){
				return changeEx;
			}
		}
		return null;
	}

	public getChangesData(shape: EShape, roleIndex : number): Array<any>{
		let changeDict: any = ConfigManager.mgShapeChangeEx.getChangeDict(shape);
		let changeArr: Array<any> = [];
		let changeCfg: any;
		let changeEx: any;
		let changeData: any;
		for(let changeCode in changeDict){
			changeData = {};
			changeData["shape"] = shape;
            changeData["roleIndex"] = roleIndex;
			changeEx = this.getInfoByChange(Number(changeCode), roleIndex);
            if(changeEx){
				changeCfg = ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(shape, Number(changeCode), changeEx.level_I);
				changeData["change"] = changeCode;
				changeData["isActived"] = true;
				changeData["level"] = changeEx.level_I;
				changeData["cfg"] = changeCfg;
				changeData["info"] = changeEx;
				changeArr.push(changeData);
			}else{
				changeCfg = ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(shape, Number(changeCode), 0);
				changeData["iaActived"] = false;
				if(changeCfg.defaultShow){
					changeData["change"] = changeCode;
					changeData["level"] = -1;
					changeData["cfg"] = changeCfg;
					changeArr.push(changeData);
				}else if(CacheManager.pack.propCache.getItemCountByCode(changeCfg.activateProp) > 0){
					changeData["change"] = changeCode;
					changeData["level"] = -1;
					changeData["cfg"] = changeCfg;
					changeArr.push(changeData);
				}
			}
		}
		return changeArr;
	}

	public getTalentSkill(change: number, roleIndex : number): any{
		let info: any = this.getInfoByChange(change, roleIndex);
		let skillIndex: number;
		let skillLevel: number = 1;
		let skillChangeCfg: any;
		let data: any = {};
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
		data["isOpen"] = this.isOpenSkill(change, skillIndex,roleIndex);
		data["isTalent"] = true;
		data["isChange"] = true;
		data["roleIndex"] = roleIndex;
		data["change"] = change;
		if(!data.isOpen){
			var openLevel = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skillChangeCfg.skillId, data.isTalent);
			data["openLevel"] = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skillIndex, data.isTalent);
			data["openLevelStr"] = ConfigManager.mgShapeChangeEx.getStageStar(this.shape, change, openLevel);
		}else{
			data["propCode"] = skillChangeCfg.costItem;
			data["propCost"] = skillChangeCfg.costAmount;
		}
		return data;
	}

	public getSkills(change: number, roleIndex: number): Array<any>{
		let skillIds: Array<number> = ConfigManager.mgShapeChangeEx.getChangeSkillArr(this.shape, change);
		let skillData: Array<any> = [];
		let data: any;
		for(let skill of skillIds){
			data = {};
			data["shape"] = this.shape;
			data["skillId"] = skill;
			data["isOpen"] = this.isOpenSkill(change, skill,roleIndex);
			data["isTalent"] = false;
			data["isChange"] = true;
			data["change"] = change;
			data["roleIndex"] = roleIndex;

			if(!data.isOpen){
				var openLevel = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skill, data.isTalent);
				data["openLevel"] = ConfigManager.mgShapeChangeEx.getOpenLevel(this.shape, change, skill, data.isTalent);
				data["openLevelStr"] = ConfigManager.mgShapeChangeEx.getStageStar(this.shape, change, openLevel);
			}
			skillData.push(data);
		}
		return skillData;
	}

	public isOpenSkill(change: number, skillId: number, roleIndex : number): boolean{
		let info: any = this.getInfoByChange(change, roleIndex);
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
		return false;
	}

	public isCanUpgrade(change: number): boolean{
		return false;
	}

	public isCanUpgradeTSkill(change: number, roleIndex:number): boolean{
		let shape = this.getShapeCache().getInfo(roleIndex);
		if(!shape) {
			return false;
		}
		let tSkillData: any = this.getTalentSkill(change, roleIndex);
		if(tSkillData.isOpen && CacheManager.pack.propCache.getItemCountByCode(tSkillData.propCode) >= tSkillData.propCost){
			if(ConfigManager.skill.getByPk(tSkillData.skillId + 1) != null){
				return true;
			}
		}
		return false;
	}

	public checkTipsByChangeData(change: number, data: any, roleIndex): boolean{
		let shape = this.getShapeCache().getInfo(roleIndex);
		if(!shape) {
			return false;
		}
		if(data.isActived){
			let count: number = CacheManager.pack.propCache.getItemCountByCode(data.cfg.costItemCode);
			let costNum: number = data.cfg.costItemNum ? data.cfg.costItemNum : 0;
			if((count >= costNum && data.level < ConfigManager.mgShapeChangeEx.getMaxLevel(this.shape, data.change))){
				return true;
			}else if(this.isCanUpgradeTSkill(data.change, roleIndex)){
				return true;
			}
		}else{
			if(CacheManager.pack.propCache.getItemCountByCode(data.cfg.activateProp) >= data.cfg.activateNum){
				return true;
			}
		}
		return false;
	}

	public checkTips(roleIndex : number): boolean{
		let shape = this.getShapeCache().getInfo(roleIndex);
		if(!shape) {
			return false;
		}

		let changeDatas: any = this.getChangesData(this.shape, roleIndex);
		if(!changeDatas) {
			return false;
		}
		for(let data of changeDatas){
			if(this.checkTipsByChangeData(data.change, data, roleIndex)){
				return true;
			}
		}
		return false;
	}

    public checkAllTips() {
        return this.checkTips(0)||this.checkTips(1)||this.checkTips(2);
    }




	public clear():void{

	}

	public getShapeCache() : ShapeBaseCache {
		return  null;
	}

}