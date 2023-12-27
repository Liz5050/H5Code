class AchievementTopPanel extends BaseView {

	private progerssBarList:{[category:number]:UIProgressBar};
	public constructor(view: fairygui.GComponent) {
		super(view);
	}

	protected initOptUI():void {
		this.progerssBarList = {};
		let _bg:string = URLManager.getPackResUrl(PackNameEnum.Achievement,"bg_1");
		let _bar:string = URLManager.getPackResUrl(PackNameEnum.Achievement,"progress_bar_1");
		
		for(let i:number = 1; i < 8; i ++)
		{
			let progressBar:UIProgressBar = this.getGObject("progressBar_" + i) as UIProgressBar;
			progressBar.labelType = BarLabelType.Current_Total;
			progressBar.labelSize = 16;
			if(i == 1) 
			{
				progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Achievement,"progress_bar_2"),_bg,479,23);
			}
			else
			{
				progressBar.setStyle(_bar,_bg,161,24);
			}
			progressBar.setValue(0,1);
			this.progerssBarList[i] = progressBar;
		}
	}

	// int category;		// 成就大类	
	// int currentPoints;	// 当前成就点
	public updateAll():void {
		let list:any[] = CacheManager.achievement.allInfos;
		let curAll:number = 0;//当前总值
		let totalMax:number = 0;//成就点数最大值
		for(let i:number = 0; i < list.length; i++)
		{
			curAll += list[i].currentPoints_I;
			let category:number = list[i].category_I;
			let max:number = ConfigManager.achievement.getCategoryAllPoint(category);
			if(category == EAchievementCategroy.EAchievementCategroySummarize) 
			{
				totalMax = max;
			}
			else
			{
				let value:number = Math.min(list[i].currentPoints_I,max);
				this.progerssBarList[category].setValue(value,max,true);
			}
		}
		this.progerssBarList[EAchievementCategroy.EAchievementCategroySummarize].setValue(curAll,totalMax,true);
	}
}