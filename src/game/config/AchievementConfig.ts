class AchievementConfig extends BaseConfig {
	public constructor() {
		super("t_achievement_detail", "code");
	}

	public getCategoryAllPoint(category:number):number
	{
		let dict:any = this.getDict();
		let pointNum:number = 0;
		for(let code in dict)
		{
			let config:any = dict[code];
			if(category == EAchievementCategroy.EAchievementCategroySummarize)
			{
				if(config.point) pointNum += config.point;
			}
			else if(config.category == category)
			{
				pointNum += config.point;
			}
		}
		return pointNum;
	}
}