class AchievementNameConfig extends BaseConfig {
	public constructor() {
		super("t_achievement_name","category,type");
	}

	/**
	 * 获取成就大类列表
	 */
	public getCategoryList():number[] {
		let dict:any = this.getDict();
		let categorys:number[] = [];
		for(let key in dict)
		{
			let category:number = dict[key].category;
			if(categorys.indexOf(category) == -1)
			{
				categorys.push(category);
			}
		}
		return categorys;
	}

	public getCategoryName(category:number):string
	{
		let config:any = this.getByPk(category + "," + 1);
		if(config) return config.categoryName;
		return "";
	}
}