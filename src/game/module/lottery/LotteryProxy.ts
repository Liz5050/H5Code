class LotteryProxy extends BaseProxy {
	public constructor() {
		super();
	}

// 		//寻宝
// message C2S_SLottery{
// 	optional int32 type = 1;  
// 	optional int32 amount = 2;  
// }
	/**
	 * 寻宝请求
	 * @param type 类型
	 * @param amount 次数
	 */
	public lottery(type:number,amount:number):void {
		this.send("ECmdGameLottery",{type : type, amount : amount});
	}

	/**
	 * 请求寻宝记录
	 * @param type 寻宝类型
	 */
	public lotteryRecord(type:LotteryCategoryEnum):void {
		this.send("ECmdGameLotteryRecord",{type : type});
	}

	/**
	 * 领取累计寻宝次数奖励
	 */
	public getLotteryCountReward(type:number,times:number):void {
		this.send("ECmdGameGetLotteryWeekReward",{type : type, times : times});
	}
}