/**职业配置 */
class MgCareerNameConfig extends BaseConfig {
	public constructor() {
		super("t_mg_career_name", "career");
	}

	/**获取职业名称 */
	public getCareerName(career:number):string{
		return this.getByPk(career).name;
	}
}