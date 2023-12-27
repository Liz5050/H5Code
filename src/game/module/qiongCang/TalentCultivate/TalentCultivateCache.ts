class TalentCultivateCache implements ICache {
	private posIntervalLevel: any = {};

	public constructor() {
	}

	/**战斗力 */
	public getTalentWarfare(roleIndex: number): number {
		let info: any = this.getInfoByIndex(roleIndex);
		if (info != null) {
			if (info.extStr != null) {
				let levelInfo: any = JSON.parse(info.extStr);
				if (levelInfo) {
					return levelInfo.warfare;
				}
			}
		}
		return 0;
	}

	/**可用的技能点 */
	public getSkillPoint(roleIndex: number): any {
		let info: any = this.getInfoByIndex(roleIndex);
		let equips: any = {};
		if (info != null) {
			return info.extNum;
		}
		return 0;
	}

	/**已用的技能点 */
	public getUsedSkillPoint(roleIndex: number): any {
		let extJson: any = this.getExtJson(roleIndex);
		let equips: any = {};
		if (extJson && extJson.usedSkillPoint != null) {
			return extJson.usedSkillPoint;
		}
		return 0;
	}

	/**天赋等级 */
	public getTalentLevel(roleIndex: number): number {
		let info: any = this.getInfoByIndex(roleIndex);
		if (info != null) {
			if (info.extStr != null) {
				let levelInfo: any = JSON.parse(info.extStr);
				if (levelInfo && levelInfo.talent != null) {
					return levelInfo.talent.level;
				}
			}
		}
		return 0;
	}

	/**天赋幸运值 */
	public getTalentLucky(roleIndex: number): number {
		let info: any = this.getInfoByIndex(roleIndex);
		if (info != null) {
			if (info.extStr != null) {
				let levelInfo: any = JSON.parse(info.extStr);
				if (levelInfo && levelInfo.talent != null) {
					return levelInfo.talent.cur;
				}
			}
		}
		return 0;
	}

	/**天赋位置 100/200/300 */
	public getTalentPos(roleIndex: number): number {
		let info: any = this.getInfoByIndex(roleIndex);
		if (info != null) {
			if (info.extStr != null) {
				let levelInfo: any = JSON.parse(info.extStr);
				if (levelInfo && levelInfo.talent != null) {
					return levelInfo.talent.pos;
				}
			}
		}
		return 0;
	}

	/**天赋装备 */
	public getEquips(roleIndex: number): any {
		let info: any = this.getInfoByIndex(roleIndex);
		let equips: any = {};
		if (info != null) {
			equips = info.levelInfo;
		}
		return equips;
	}

	/**获取天赋信息 */
	public getInfoByIndex(roleIndex: number): any {
		return CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeTalent);
	}

	/**开启天赋装备孔位的等级间隔 */
	public getPosIntervalLevel(roleIndex: number): number {
		if (!this.posIntervalLevel[roleIndex]) {
			let career: number = CacheManager.role.getRoleCareerByIndex(roleIndex);
			let data: any = ConfigManager.talent.getByPk(CareerUtil.getBaseCareer(career));
			this.posIntervalLevel[roleIndex] = data.posAddIntervalLevel;
		}
		return this.posIntervalLevel[roleIndex];
	}

	/**天赋装备孔位的开启等级 */
	public getEquipPosOpenLevel(roleIndex: number, pos: number): number {
		return pos * this.getPosIntervalLevel(roleIndex);
	}

	/**装备孔位是否已激活 */
	public isPosActive(roleIndex: number, pos: number): boolean {
		if (pos * this.getPosIntervalLevel(roleIndex) <= this.getTalentLevel(roleIndex)) {
			return true;
		}
		return false;
	}

	/**天赋属性详情 */
	public getAttrDetailDict(roleIndex: number): any {
		let cultivateCfg: any = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeTalent, this.getTalentPos(roleIndex), this.getTalentLevel(roleIndex));
		let talentAttrDict: any = WeaponUtil.getAttrDict(cultivateCfg.attr);
		let equips: any = this.getEquips(roleIndex);
		let equipAttrDict: any;
		for (let pos of equips) {
			let itemData: ItemData = new ItemData(equips[pos]);
			if (ItemsUtil.isTrueItemData(itemData)) {
				equipAttrDict = WeaponUtil.getBaseAttrDict(itemData);
				for (let key in equipAttrDict) {
					if (talentAttrDict[key]) {
						talentAttrDict[key] += EquipStoneAttr[key];
					} else {
						talentAttrDict[key] = EquipStoneAttr[key];
					}
				}
			}
		}
		return talentAttrDict;
	}

	/**
	 * 扩展json
	 */
	public getExtJson(roleIndex: number): any {
		let info: any = this.getInfoByIndex(roleIndex);
		if (info != null) {
			if (info.extStr != null) {
				return JSON.parse(info.extStr);
			}
		}
		return null;
	}

	/**
	 * 技能信息字典
	 * {"100001": {"id", 100001 "level": 1, "limitLevel": 1, "isOpen": true}}
	 */
	public getSkillDict(career: number): any {
		let skillDict: any = {};
		let unOpenSkills: Array<any>;
		let openSkills: Array<any>;
		let skills: Array<any>;
		let roleIndex: number = CacheManager.role.getRoleIndex(career);
		let ext: any = this.getExtJson(roleIndex);
		if (ext != null) {
			openSkills = ext.skill;
			unOpenSkills = ext.unopen_equip_addskill;
			if (unOpenSkills != null) {
				skills = openSkills.concat(unOpenSkills);
			} else {
				skills = openSkills;
			}
			let skillId: number;
			let skill: any;
			for (let i: number = 0; i < skills.length; i++) {
				skill = skills[i];
				skillId = skill.id;
				if (skillDict[skillId] == null) {
					skillDict[skillId] = {};
				}
				skillDict[skillId]["id"] = skill.id;
				skillDict[skillId]["level"] = skill.level;
				skillDict[skillId]["learnedLevel"] = skill.learnedLevel;
				skillDict[skillId]["limitLevel"] = skill.limitLevel;
				skillDict[skillId]["isOpen"] = i < openSkills.length;
			}
		}
		return skillDict;
	}

	/**获取技能数据 */
	public getSkillData(skillId: number, career: number, skillDict: any = null): any {
		if (skillDict == null) {
			skillDict = this.getSkillDict(career);
		}
		let skillData: any = skillDict[skillId];
		if (skillData == null) {
			// let cfgSkillData: any = ConfigManager.cultivateEffectType.getByPk(skillId);
			skillData = {};
			skillData["id"] = skillId;
			// skillData["level"] = 0;
			// skillData["learnedLevel"] = 0;
			// skillData["limitLevel"] = cfgSkillData.effect1;//读配置
			skillData["isOpen"] = false;
		}
		skillData["career"] = career;
		return skillData;
	}

	/**
	 * 连线是否启用
	 * @param career 当前职业
	 * @param startIndex 开始序号
	 * @param endIndex 结束序号
	 */
	public isLineEnable(career: number, startIndex: number, endIndex: number, skillDict: any = null): boolean {
		if (skillDict == null) {
			skillDict = this.getSkillDict(career);
		}
		let startSkillId: number = this.genSkillId(career, startIndex);
		let endSkillId: number = this.genSkillId(career, endIndex);
		let preConditions: { [skillId: number]: number } = ConfigManager.cultivateEffectType.getPreConditions(endSkillId);
		let needLevel: number = preConditions[startSkillId];
		let skllData: any = skillDict[Number(startSkillId)];
		if(skllData != null && skllData.learnedLevel >= needLevel){
			return true;
		}
		return false;
	}

	/**
	 * 角色是否有任务
	 */
	public isHasTask(roleIndex: number): boolean {
		let extJson: any = this.getExtJson(roleIndex);
		return extJson != null && extJson.hasTask == 1;
	}

	/**
	 * 根据技能序号生成技能id
	 */
	public genSkillId(career: number, index: number): number {
		let startIndex: number = 15000;
		if (career == 2) {
			startIndex = 25000;
		} else if(career == 4) {
			startIndex = 35000;
		}
		return startIndex + index;
	}

	/**天赋经验是否能升级 */
	public isCanUpgradeByIndex(roleIndex: number): boolean {
		let pos: number = this.getTalentPos(roleIndex);
		let level: number = this.getTalentLevel(roleIndex);
		let max: number = ConfigManager.cultivate.getMaxLevel(ECultivateType.ECultivateTypeTalent, pos);
		let cultivateCfg: any = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeTalent, pos, level);
		let nextCultivateCfg: any = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeTalent, pos, level + 1);
		let talentExp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitTalentExp);
		if (max > level && talentExp >= (nextCultivateCfg.itemNum - this.getTalentLucky(roleIndex)) && talentExp >= cultivateCfg.btnAdd) {
			return true;
		}
		return false;
	}

	/**是否有可镶嵌的装备 */
	public isHasEquips(roleIndex: number): boolean{
		let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(roleIndex));
        let itemDatas:ItemData[] = CacheManager.pack.propCache.getTalentEquipByCareer(career);
		return itemDatas.length > 0;
	}

	/**能否镶嵌装备 */
	public isCanInlayEquip(roleIndex: number): boolean {
		if(!this.isHasEquips(roleIndex)){//无装备
			return false;
		}

		let equips: any = this.getEquips(roleIndex);
		for (let i = 1; i <= 5; i++) {
			if (!equips[i] && this.isPosActive(roleIndex, i)) {
				return true;
			}
		}
		return false;
	}

	/**能否使用技能点 */
	public isCanUseSkillPoint(roleIndex: number): boolean{
		if(this.getSkillPoint(roleIndex) > 0){
			//正常情况可以拥有的技能点不会超出可升的等级，暂时不加判断
			// let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(roleIndex));
			// let skillDict: any = this.getSkillDict(career);
			// let skillData: any;
			// for(let key in skillDict){
			// 	skillData = skillDict[key];
			// 	if(skillData.isOpen){
			// 		if(skillData.level <= skillData.limitLevel){
			// 			return true;
			// 		}
			// 	}
			// }
			return true;
		}
		return false;
	}

	/**是否有可激活或可完成的任务 */
	public checkTalentTaskTip(roleIndex: number): boolean {
		let task: TaskBase;
		if (roleIndex != -1) {
			task = CacheManager.task.getTalentPlayerTask(roleIndex);
			if(this.isHasTask(roleIndex)) {
				if (task && task.isCompleted) {
					return true;
				}
			} else {
				if(task == null) {//都没领任务
					return true;
				}
			}
		}
		return false;
	}

	/**天赋培养角色按钮红点 */
	public checkTalentTipByIndex(roleIndex: number): boolean {
		if (CacheManager.talentCultivate.getInfoByIndex(roleIndex) != null && !CacheManager.talentCultivate.isHasTask(roleIndex)) {
			//培养
			if (this.isCanUpgradeByIndex(roleIndex) || this.isCanInlayEquip(roleIndex) || this.isCanUseSkillPoint(roleIndex)) {
				return true;
			}
		} else {
			//任务
			if (this.checkTalentTaskTip(roleIndex)) {
				return true;
			}
		}
		return false;
	}

	/**天赋培养页签红点 */
	public checkTalentTip(): boolean {
		for (let career of CareerUtil.CareerAll) {
			let roleIndex: number = CacheManager.role.getRoleIndex(career);
			if (this.checkTalentTipByIndex(roleIndex)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 天赋入口图标红点检测
	 */
	public checkTips(): boolean {
		let flag: boolean = CacheManager.qcCopy.checkTips() || CacheManager.bossNew.checkQiongCangBossTips();
		if (!flag) {
			flag = this.checkTalentTip();
		}
		return flag;
	}
	
	/**获取可合成的天赋圣物 */
	public getTalentSmeltItems():ItemData[]{
		let items:ItemData[] = CacheManager.pack.propCache.getByC(ECategory.ECategoryTalentEquip);
		for(let i:number = 0;i<items.length;i++){
			let cfg:any = ConfigManager.smeltPlan.getTalentSmeltInfo(items[i].getColor());
			if(!cfg || !cfg.isSmelt){
				items.splice(i,1);
				i--;
			}
		}
		
		return items;
	}

	public sortTalantSmeltItems(items:ItemData[]):void{
		items.sort(function (a:ItemData,b:ItemData):number{

			let ret:number = 0;
			let cA:number = a.getColor();
			let cB:number = b.getColor();
			let carA:number = a.getCareer();
			let carB:number = b.getCareer();
			let codeA:number = a.getCode();
			let codeB:number = b.getCode();

			if(cA<cB){
				return -1;
			}else if(cA>cB){
				return 1;
			}else if(carA<carB){
				return -1;
			}else if(carA>carB){
				return 1;
			}else if(codeA<codeB){
				return -1;
			}else if(codeA>codeB){
				return 1;
			}

			return ret;
		});
	}

	public clear(): void {

	}
}