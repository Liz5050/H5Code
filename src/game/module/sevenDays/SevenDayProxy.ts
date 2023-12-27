class SevenDayProxy extends BaseProxy {
	public constructor() {
		super()
	}

	/**领取七天登录的奖励 */
	public getReward(day:number):void{
		this.send("ECmdGamePlayerGetSevenDayLoginReward",{day:day})
	}

}