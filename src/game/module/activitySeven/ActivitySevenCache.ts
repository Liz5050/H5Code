class ActivitySevenCache implements ICache {
	private activityInfo:any;
	public constructor() {
	}

	public updateActivityInfo(data:any):void {
		this.activityInfo = data;
	}

	/**是否已领取 */
	public hadGet(id:number):boolean {
		if(!this.activityInfo)  return false;
		let index:number = this.activityInfo.getRewardInfos.intIntDict.key_I.indexOf(id);
		if(index == -1) {
			return false;
		}
		return this.activityInfo.getRewardInfos.intIntDict.value_I[index] == 2;
	}

	/**是否可领取 */
	public canGet(id:number):boolean {
		if(!this.activityInfo)  return false;
		let index:number = this.activityInfo.getRewardInfos.intIntDict.key_I.indexOf(id);
		if(index == -1) {
			return false;
		}
		return this.activityInfo.getRewardInfos.intIntDict.value_I[index] == 1;
	}

	public get rewardGetInfo():any {
		if(!this.activityInfo) return null;
		return this.activityInfo.getRewardInfos.intIntDict;
	}

	/**
	 * 活动任务当前完成进度
	 */
	public getActivityTaskProcess(id:number):number {
		if(!this.activityInfo)  return 0;
		let index:number = this.activityInfo.process.intIntDict.key_I.indexOf(id);
		if(index == -1) return 0;
		return this.activityInfo.process.intIntDict.value_I[index];
	}

	public get score():number {
		if(!this.activityInfo)  return 0;
		return this.activityInfo.point.value_I;
	}

	/**
	 * 检测图标红点
	 */
	public checkTips():boolean {
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeActivity);
		if(!info || info.openedDay <= 0) return false;
		
		let days:number[] = ConfigManager.activitySeven.getDayCfgs();
		for(let i:number = 0; i < info.openedDay; i++) {
			let day:number = i+1;
			if(this.checkDayTips(day)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检测某一天内容是否有红点
	 */
	public checkDayTips(day:number):boolean {
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeActivity);
		if(!info || info.openedDay < day) return false;
		let types:number[] = ConfigManager.activitySeven.getDayTypes(day);
		if(!types) return false;
		for(let type of types) {
			if(this.checkDayTypeTips(day,type)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检测某一天某个分类是否有红点
	 */
	public checkDayTypeTips(day:number,type:number):boolean {
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeActivity);
		if(!info || info.openedDay < day) return false;
		let taskCfgs:any[] = ConfigManager.activitySeven.getTaskItemCfgs(day,type);
		for(let cfg of taskCfgs) {
			if(this.canGet(cfg.id)) {
				return true;
			}
		}
		return false;
	}

	public clear():void {
	}
}