/**
 * 福利
 */

class WelfareCache implements ICache{
	private _levelReward: any;
	private _levelRewardNum: any;
	private _dailySign: any;
	private _monthReward: any;
	private _signDays: number;
	private _day: number;
	private _date: Date;
	
	public constructor() {
	}

	/**本角色已领取的等级奖励 */
	public get levelReward(): any{
		if(!this._levelReward){
			this._levelReward = {};
		}
		return this._levelReward;
	}
	
	/**全服已领取数量 */
	public get levelRewardNum(): any{
		if(!this._levelRewardNum){
			this._levelRewardNum = {};
		}
		return this._levelRewardNum;
	}

	/**本月签到的日期 */
	public set dailySign(value: any){
		this._dailySign = value;
	}

	public get dailySign(): any{
		if(this._dailySign){
			return this._dailySign;
		}
		return {};
	}

	/**已领取的签到天数累计的奖励 */
	public set monthReward(value: any){
		this._monthReward = value;
	}

	public get monthReward(): any{
		if(this._monthReward){
			return this._monthReward;
		}
		return {};
	}

	/*本月签到的天数 */
	public set signDays(value: number){
		this._signDays = value;
	}

	public get signDays(): number{
		if(this._signDays){
			return this._signDays;
		}
		return 0;
	}

	/**登录的时间（x号） */
	public get day(): number{
		if(this._date){
			return this._date.getDate();
		}
		return 0;
	}

	/**登录的时间（Date） */
	public set date(value: Date){
		this._date = value;
	}

	public get date(): Date{
		if(this._date){
			return this._date;
		}
		return null;
	}

	/**本月有多少天 */
	public get monthDays(): number{
		let days: number = 0;
		if(this._date){
			let year: number = this._date.getFullYear();
			let month: number = this._date.getMonth() + 1;  //返回的月份从0-11；
			let day: number = this._date.getDate();
			let monthDays: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			days = monthDays[month - 1];
			if(month == 2){
				if((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)){
					days += 1;
				}
			}
		}
		return days;
	}

	/**等级奖励的剩余数量 */
	public getRemainNum(data: any): number{
		if(data.limitNum < 0){
			return data.limitNum;
		}else{
			if(this.levelRewardNum[data.level]){
				return data.limitNum - this.levelRewardNum[data.level];
			}else{
				return data.limitNum;
			}
		}
	}

	/**是否可领取该等级奖励 */
	public getLevelStatus(data: any): number{
		let roleState:number = CacheManager.role.getRoleState();
		let level:number = CacheManager.role.getRoleLevel();
		let value:number = roleState * 10000 + level;
		if(value >= data.level){
			if(this.levelReward[data.level]){
				return 3;//已领取
			}
			else {
				if(this.getRemainNum(data) == 0) {
					return 2;//剩余数量为0
				}
				else {
					return 1;//可领取
				}
			}
		}
		else {
			return 0;//未达到等级
		}
	}

	/**某日签到情况 */
	public getDailySignStatus(data: any): number{
		if(CacheManager.welfare.dailySign[data.day]){
			return 2;//已签到
		}else if(data.day == CacheManager.welfare.day){
			return 1;//可签到
		}else if(data.day < CacheManager.welfare.day){
			return 3;//未签到
		}else if(data.day > CacheManager.welfare.day){
			return 0;//时间未到
		}
		return -1;//应该不会到这里...data有问题？
	}

	/**本月某个签到奖励领取情况 */
	public getMonthSignStatus(data: any): number{
		if(CacheManager.welfare.monthReward[data.accDay]){
			return 2;//已领取
		}else if(data.accDay <= CacheManager.welfare.signDays){
			return 1;//可领取
		}else if(data.accDay > CacheManager.welfare.signDays){
			return 0;//时间未到
		}
		return -1;//应该不会到这里...data有问题？
	}

	/**是否可领取等级奖励 */
	public isGetUpgradeReward(): boolean{
		let dict: any = ConfigManager.levelReward.getDict();
		for(let key in dict){
			let data: any = dict[key];
			if(this.getLevelStatus(data) == 1){
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否领取完所有奖励,或者没有剩余份数
	 */
	public hadGetAllReward():boolean {
		let dict: any = ConfigManager.levelReward.getDict();
		for(let key in dict){
			let data: any = dict[key];
			if(this.getLevelStatus(data) == 3) continue;//已领取
			if(this.getRemainNum(data) != 0) {
				return false;
			}
		}
		return true;
	}

	/**可签到的日期（x号） */
	public getSignDay(): number{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SignReward,false);
		if(isOpen){
			let datas: Array<any> = ConfigManager.mgSignDay.getData();
			for(let i = 0; i < datas.length; i++){
				if(this.getDailySignStatus(datas[i]) == 1){
					return i;
				}
			}
		}
		return -1;
	}

	/**是否可签到 */
	public isCanDailySign(): boolean{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SignReward,false);
		if(isOpen){
			let datas: Array<any> = ConfigManager.mgSignDay.getData();
			for(let data of datas){
				if(this.getDailySignStatus(data) == 1){
					return true;
				}
			}
		}
		return false;
	}

	/**是否可领取签到天数累加奖励 */
	public isGetMonthReward(): boolean{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SignReward,false);
		if(isOpen){
			let datas: Array<any> = ConfigManager.mgSignMonth.getData();
			for(let data of datas){
				if(this.getMonthSignStatus(data) == 1){
					return true;
				}
			}
		}
		return false;
	}

	/**是否有红点 */
	public checkTips(): boolean{
		if(this.isGetUpgradeReward() || this.isCanDailySign() || this.isGetMonthReward()){
			return true;
		}
		return false;
	}

	public clear(): void{

	}
}