class SevenDaysCache {

	private _gotRewardList:number[];
	private _onlineDays:number = 0;
	private configData:any[];
	public constructor() {
		this._gotRewardList = [];
		this.configData = ConfigManager.sevenDays.select({});
		for(var i:number = 0;i<this.configData.length;i++){
			this._gotRewardList.push(this.configData[i].day); // 默认已领全部的 已经领全部的 服务器不推送的
		}
	}
	public updateReward(list:number[]):void{
		this._gotRewardList = list; 
	}

	public isDayGot(day:number):boolean{
		var flag:boolean = this._gotRewardList.indexOf(day)>-1
		return flag;
	}
	public isDayCanGot(day:number):boolean{
		var isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SevenDayReward,false);
		var flag:boolean = isOpen && !this.isDayGot(day) && this.isOnlineOk(day);
		return flag;
	}

	public checkTips():boolean{
		var flag:boolean = false;
		var isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SevenDayReward,false);
		if(isOpen){
			for(var i:number = 0;i<this.configData.length;i++){
				var day:number = this.configData[i].day;
				if(!this.isDayGot(day) && this.isOnlineOk(day)){
					flag = true;
					break;
				}
			}
		}
		return flag;
	}
	
	public isOnlineOk(day:number):boolean{
		return this.onlineDays>=day;
	}
	public set onlineDays(value:number){
		this._onlineDays = value;
	}

	public get onlineDays():number{
		return this._onlineDays;
	}
}
