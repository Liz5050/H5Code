class AchievementCache implements ICache {

	private _achievementInfos:any[];
	private _allInfos:any[];

	/**可领取的code列表 */
	public completeCodes:number[] = [];
	public constructor() {
	}

	public updateAchievementInfos(achievements:any[]):void
	{
		this._achievementInfos = achievements;
		this._achievementInfos.sort(this.onSortList);
	}
	
	private onSortList(value1:any,value2:any):number
	{
		if(value1.status_BY == EAchievementStatus.EAchievementStatusComplete && value2.status_BY != EAchievementStatus.EAchievementStatusComplete) return -1;
		if(value1.status_BY != EAchievementStatus.EAchievementStatusComplete && value2.status_BY == EAchievementStatus.EAchievementStatusComplete) return 1;
		if(value1.status_BY == EAchievementStatus.EAchievementStatusHadEnd && value2.status_BY != EAchievementStatus.EAchievementStatusHadEnd) return 1;
		if(value1.status_BY != EAchievementStatus.EAchievementStatusHadEnd && value2.status_BY == EAchievementStatus.EAchievementStatusHadEnd) return -1;
		if(value1.code_I > value2.code_I) return 1;
		if(value1.code_I < value2.code_I) return -1;
		return 0;
	}

	/**
	 * 成就奖励领取成功
	 */
	public achievementRewardGetSuccess(codes:number[]):void
	{
		let count:number = 0;
		for(let i:number = 0; i < this._achievementInfos.length; i++)
		{
			if(codes.indexOf(this._achievementInfos[i].code_I) != -1)
			{
				let config:any = ConfigManager.achievement.getByPk(this._achievementInfos[i].code_I);
				let rewardList:string[] = config.rewardStr.split("#");
				for(let i:number = 0; i < rewardList.length; i++)
				{
					let reward:string[] = rewardList[i].split(",");
					if(Number(reward[0]) == 2)
					{
						//类型2代表奖励直接发数值奖励，如铜钱，荣誉，积分
						let itemCode:number = MoneyUtil.getMoneyItemCodeByType(Number(reward[1]));
						MoveMotionUtil.itemMoveToBag([itemCode]);
					}
				}
				//改变状态
				this._achievementInfos[i].status_BY = EAchievementStatus.EAchievementStatusHadEnd;
				let index:number = this.completeCodes.indexOf(this._achievementInfos[i].code_I);
				if(index != -1)
				{
					this.completeCodes.splice(index,1);
				}
				count ++;
			}
			if(count == codes.length) break;
		}
		this._achievementInfos.sort(this.onSortList);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Achievement,this.completeCodes.length > 0);
	}

	/**成就总览信息更新 */
	public updateAllInfos(infos:any[]):void
	{
		this._allInfos = infos;
	}

	/**获取当前大类分页成就数据 */
	public getAchievementInfos():any[]
	{
		return this._achievementInfos;
	}

	/**
	 * 获取可领奖的大类列表
	 */
	public getCanGetRewardCategory():number[]
	{
		let categorys:number[] = [];
		for(let i:number = 0; i < this.completeCodes.length; i++)
		{
			let category:number = ConfigManager.achievement.getByPk(this.completeCodes[i]).category;
			if(categorys.indexOf(category) == -1)
			{
				categorys.push(category);
			}
		}
		return categorys;
	}

	public get achievementPoint():number{
		let curAll:number = 0;//当前总值
		if(!this._allInfos) return 0;
		for(let i:number = 0; i < this._allInfos.length; i++)
		{
			curAll += this._allInfos[i].currentPoints_I;
		}
		return curAll;
	}

	/**总览信息 */
	public get allInfos():any[]
	{
		return this._allInfos;
	}

	public clear():void {
	}
}