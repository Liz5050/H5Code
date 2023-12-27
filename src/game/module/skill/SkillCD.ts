class SkillCD {
	private skillData:SkillData;

	public constructor(skillData:SkillData) {
		this.skillData = skillData;
	}

	public get cooldown():number{
		return this.skillData.colldown;
	}

	public get group():number{
		return this.skillData.cdGroup;
	}

	public get groupCd():number{
		return this.skillData.cdGroupTime;
	}
}