/**技能配置 */
class SkillConfig extends BaseConfig {
	private skillUpgrade:BaseConfig;
	private skillEffects:{ [skillId: number]: number[] } = {};

	public constructor() {
		super("t_skill", "skillId");
        this.skillUpgrade = new BaseConfig("t_skill_upgrade", "skillId,skillLevel");
	}

	public getSkillUpgrade(skillId:number, level:number):any {
		return this.skillUpgrade.getByPk(skillId+","+level);
	}

	public getSkillUpgradeTips(skillId:number):any {
		return this.skillUpgrade.getByPk(skillId+",2").tips;
	}

	/**获取怪物模型资源ID */
	public getModelId(code: number): string {
		return this.getByPk(code).modelId;
	}

	/**获取技能 */
	public getSkill(skillId: number): any {
		return this.getByPk(skillId);
	}

	/**获取技能动作 */
	public getSkillAction(skillId: number): number {
		let skill:any = this.getByPk(skillId);
		return skill.skillAction != undefined ? skill.skillAction : 0;
	}

    /**获取技能刀光使用 */
    public getSkillDaoguangUse(skillId: number): boolean {
        let skill:any = this.getByPk(skillId);
        return skill.noDaoguang == undefined;
    }

	/**
	 * 根据职业获取技能配置
	 */
	public getSkillsByCareer(roleCareer: number): Array<any> {
		// let roleBaseCareer: number = CareerUtil.getBaseCareer(roleCareer);
		// let roleRebirthTimes: number = CareerUtil.getRebirthTimes(roleCareer);
		let skills: Array<any> = [];
		let skill: any;
		for (let key in this.dataDict) {
            skill = this.dataDict[key];
            if (roleCareer == skill.roleCareer) {
                skills.push(skill);
            }
		}
		return skills;
	}

	/**
	 * 获取主动技能配置
	 */
	public getActiveSkillsByCareer(roleCareer: number): Array<any> {
		let rtnSkills: Array<any> = [];
		let skills: Array<any> = this.getSkillsByCareer(roleCareer);
		for (let s of skills) {
			let useType:number = 0;
			if(s['useType'] != null){
				useType = s['useType'];
			}
			if (useType == ESkillUseType.ESkillUseTypeInitiative && s.careerBaseSkill == 1) {
				rtnSkills.push(s);
			}
		}
		rtnSkills.sort((a:any, b:any) => {return a.posType - b.posType});
		return rtnSkills;
	}

	/**
	 * 获取被动技能配置
	 */
	public getPassiveSkillsByCareer(roleCareer: number): Array<any> {
		let rtnSkills: Array<any> = [];
		let skills: Array<any> = this.getSkillsByCareer(roleCareer);
		for (let s of skills) {
			if (!SkillUtil.isNormalSkill(s) && !SkillUtil.isActiveSkill(s)) {//非普通攻击和主动即为被动
				rtnSkills.push(s);
			}
		}
		rtnSkills.sort((a:any, b:any) => {return a.posType - b.posType});
		return rtnSkills;
	}

	/**
	 * 通过技能id获取特效数据
	 */
	public getSkillEffectListVo(skillId:number):EffectListData
	{
		let skillEffects:number[] = this.getSkillEffects(skillId);
		if (!skillEffects||skillEffects.length<=0) return null;
		return ConfigManager.effectList.getVo(skillEffects[0]);
	}

	public getSkillEffects(skillId:number):number[] {
        if(!skillId) return null;
        if(this.skillEffects[skillId]) return this.skillEffects[skillId];
        let skillEffectsStr:string = this.getSkill(skillId).skillEffect;
        if(!skillEffectsStr||skillEffectsStr=="") return null;
        let skillEffects:any[] = skillEffectsStr.split(',');
        for(let i:number=0;i<skillEffects.length;i++) {
            skillEffects[i] = Number(skillEffects[i]);
		}
        this.skillEffects[skillId] = skillEffects;
        return skillEffects;
	}

	public isSkillTargetToMySelf(targetType:number):boolean
	{
		return targetType == ESkillTargetType.ESkillTargetTypeSelf;
	}

	public static upgradeLevelMatch(skillPlayerLevel:number, skillLevel:number, playerLevel:number, roleState:number):boolean{
		return skillPlayerLevel < 10000 && skillLevel <= playerLevel || skillPlayerLevel / 10000 <= roleState;
	}

    public isFirstCareerSkill(skillData: SkillData) {
        return skillData && (skillData.skillId == 1001 || skillData.skillId == 2001 || skillData.skillId == 3001);
    }

	public getIconRes(skillIcon: number): string {
		if (skillIcon) {
			return URLManager.getIconUrl(skillIcon, URLManager.SKIL_ICON);
		}
		return "";
	}
}