class Welfare2Proxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 每日签到奖励
	 * @param day 第几天
	 */
	public dailySignReward(isVip: boolean, day: number): void{
		this.send("ECmdGamePlayerDailySignReward", {"isVip": isVip, "day": day});
	}

	/**领取登录奖励 */
	public getReward(day:number):void{
		this.send("ECmdGamePlayerGetSevenDayLoginReward",{day:day})
	}

	/**
	 * 每月累计签到奖励(isVIP方便以后扩展)
	 * @param days 累计多少天
	 */
	public accumulateSignReward(days: number, isVip: boolean): void{
		this.send("ECmdGamePlayerAccumulateSignReward", {"days": days, "isVip": isVip});
	}

	/**
	 * 领取在线奖励
	 * C2S_SGetOnlineReward
	 * @param type 类型 1一次性奖励 2每日重置的在线奖励
	 */
	public getOnlineReward(type:number,time:number):void {
		this.send("ECmdGameGetOnlineReward",{type:type,minitue:time});
	}

	/**
	 * 设置特权月卡副本双倍收益
	 */
	public privilegeSetDouble(copyCode:number,isDouble:boolean):void {
		let opt:number = isDouble ? 1 : 0;
		this.send("ECmdGamePrivilegeCardMultiSetting",{copyCode_I:copyCode,opt_I:opt});
	}
}