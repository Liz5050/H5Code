/**
 * 模块代理类
 * @author zhh
 * @time 2018-07-05 15:14:09
 */
class RechargeProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 请求领取首充奖励
	 */
	public getFirstRecharge():void{
		this.send("ECmdGameGetRechargeFirstReward",{});
	}

}