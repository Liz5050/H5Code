class MgSignMonthConfig extends BaseConfig {
	private _datas: Array<any> = [];
	private _timeInterval: number = -1;
	private _maxDay: number = 0;
	private _maxInterval: number = -1;
	private _loopFirstDay: number = -1;

	public constructor() {
		super("t_mg_sign_month", "accDay");
	}

	public getData(): Array<any> {
		if (this._datas.length == 0) {
			let dict: any = this.getDict();
			for (let key in dict) {
				let data: any = dict[key];
				this._datas.push(data);
			}
		}
		return this._datas;
	}

	public getRewardData(day: number, isCanGetReward: boolean): any {
		let rewardData: any;
		let loopRewards: number = ConfigManager.const.getConstValue("AccSignLoopLastXDay");
		let signMonthData: Array<any> = this.getData();
		if (day >= this.maxDay) {
			let roopDay: number = (day - this.maxDay) % this.maxInterval;
			if(isCanGetReward && roopDay == 0){
				rewardData = {};
				rewardData["rewardStr"] = this.getByPk(this.maxDay).rewardStr;
				rewardData["accDay"] = day;
			}else{
				for (let i = loopRewards; i > 0; i--){
					let intervalDay: number = signMonthData[signMonthData.length - i].accDay - this.loopFirstDay;
					if(roopDay < intervalDay || (roopDay == intervalDay && isCanGetReward)){
						rewardData = {};
						rewardData["rewardStr"] = signMonthData[signMonthData.length - i].rewardStr;
						rewardData["accDay"] = day + (intervalDay - roopDay);
						break;
					}
				}
			}
		} else {
			if(isCanGetReward){
				rewardData = this.getByPk(day);
			}else{
				let signMonthData: Array<any> = this.getData();
				for(let data of signMonthData){
					if(data.accDay > day){
						if (!rewardData || data.accDay < rewardData.accDay) {
							rewardData = data;
						}
					}
				}
			}
		}
		return rewardData;
	}

	public get maxInterval(): number {
		if (this._maxInterval == -1) {
			let datas: Array<any> = this.getData();
			this._maxInterval = datas[datas.length - 1].accDay - this.loopFirstDay;
		}
		return this._maxInterval;
	}

	public get loopFirstDay(): number{
		if(this._loopFirstDay == -1){
			let datas: Array<any> = this.getData();
			let loopRewards: number = ConfigManager.const.getConstValue("AccSignLoopLastXDay");
			this._loopFirstDay = 0;
			if(datas.length != loopRewards){
				this._loopFirstDay = datas[datas.length - loopRewards - 1].accDay;
			}
		}
		return this._loopFirstDay;
	}

	public get timeInterval(): number {
		if (this._timeInterval == -1) {
			let dict: any = this.getDict();
			let day1: number = 0;
			let day2: number = 0;
			for (let key in dict) {
				let data: any = dict[key];
				if (data.accDay > day1) {
					if (day1 > day2) {
						day2 = day1;
					}
					day1 = data.accDay;
				} else if (data.accDay > day2) {
					day2 = data.accDay;
				}
			}
			this._timeInterval = day1 - day2;
			this._maxDay = day1;
		}
		return this._timeInterval;
	}

	public get maxDay(): number {
		if (this._maxDay == 0) {
			let dict: any = this.getDict();
			for (let key in dict) {
				let data: any = dict[key];
				if (data.accDay > this._maxDay) {
					this._maxDay = data.accDay;
				}
			}
		}
		return this._maxDay;
	}
}