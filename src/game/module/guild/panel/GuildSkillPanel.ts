/**
 * 仙盟技能（心法）
 */
class GuildSkillPanel extends BaseTabPanel {
	private skillList: List;

	private veines: Array<any>;

	public initOptUI() {
		this.skillList = new List(this.getGObject("list_skill").asList);
	}

	public updateAll() {
		CacheManager.guild.roleBaseAttrDict = CacheManager.role.getBasicAttributeDict();
		this.veines = ConfigManager.guildVein.getVeines();
		this.skillList.data = this.veines;
	}
}