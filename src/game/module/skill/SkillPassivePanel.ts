/**
 * 被动技能
 */
class SkillPassivePanel extends BaseTabPanel{
	private skillList: List;

	public initOptUI():void{
		this.skillList = new List(this.getGObject("list_passive").asList);
	}

	public updateAll():void{
		let skills:Array<any> = CacheManager.skill.getPassiveSkills();
		let skillDatas:Array<SkillData> = [];
		let menuSkillDatas:Array<SkillData> = [];
		for(let skill of skills){
			let skillData:SkillData = new SkillData(skill.skillId);
			skillDatas.push(skillData)
		}
		this.skillList.data = skillDatas;
	}
}