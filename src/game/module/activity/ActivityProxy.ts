class ActivityProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 领取活动奖励
	 */
	public getActivityReward(code:number,index:number, num:number = 1):void {
		this.send("ECmdGameActiveGetSpecialActiveReawrd",{activeCode_I:code,index_I:index,num_I:num});
	}

	/**
	 * 天天返利领奖
	 */
	public getActivityRebateReward(id:number):void {
		this.send("ECmdGameActiveRechargeDayReturnGetReward",{"id" : id});
	}

	/**
	 * 每日累充领奖
	 */
	public getActivityDayRechargeRewards(index:number):void {
		this.send("ECmdGameActiveGetRechargeDayTotalReward",{value_I:index});
	}

	/**
	 * 七天狂欢领奖
	 */
	public getActivitySevenReward(id:number):void {
		this.send("ECmdGameActiveGetActivityReward",{"id" : id});
	}

	/**
	 * 领取累充返利奖励
	 */
	public getRechargeRebateReward(day:number):void {
		this.send("ECmdGameActiveGetComposeRechargeActiveReward",{"day" : day});
	}

	/**
	 * 领取投资计划奖励
	 * @param day 领取的天数
	 */
	public getInvestReward(day:number):void {
		this.send("ECmdGameGetInvestActiveReward",{day:day});
	}

	/**
	 * 领取团购奖励
	 * 
	 */
	public getGroupBuy(id:number):void{
		this.send("ECmdPublicRechargeGroupGetReward",{value_I:id});
	}

	/**
	 * 每日充值累计充值天数礼包
	 */
	public getDayRechargeExReward(index:number):void {
		this.send("ECmdGameActiveGetDailyReward",{index:index});
	}

	public getHolidayRechargeReward(code:number,id:number):void {
		this.send("ECmdGameActiveGetComposeRechargeExActiveReward",{code:code,id:id});
	}
}