class WelfareProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 领取等级奖励
	 * @param level 等级
	 */
	public getLevelGiftReward(level: number): void{
		this.send("ECmdGamePlayerGetLevelGiftReward", {"level": level});
	}

	/**
	 * 每日签到奖励
	 * @param day 第几天
	 */
	public dailySignReward(isVip: boolean, day: number): void{
		this.send("ECmdGamePlayerDailySignReward", {"isVip": isVip, "day": day});
	}

	/**
	 * 每月累计签到奖励(isVIP方便以后扩展)
	 * @param days 累计多少天
	 */
	public accumulateSignReward(days: number, isVip: boolean): void{
		this.send("ECmdGamePlayerAccumulateSignReward", {"days": days, "isVip": isVip});
	}
}