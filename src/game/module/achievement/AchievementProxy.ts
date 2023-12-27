class AchievementProxy extends BaseProxy {
	
	public constructor() {
		super();
	}

	/**
	 * 获取成就信息
	 */
	public getAchievementInfos(category:number,type:number = 0):void {
		this.send("ECmdGameGetAchievementInfos",{category : category, type : type});
	}
	
	/**成就总览信息获取 */
	public getAchievementAllInfos():void {
		this.send("ECmdGameGetAchievementOverview",{});
	}

	/**
	 * 领取成就奖励
	 */
	public getAchievementReward(code:number):void {
		this.send("ECmdGameGetAchievementReward",{code:code});
	}

	/**
	 * 一键领取成就奖励（当前页）
	 */
	public getChievementAllReward(codes:number[]):void {
		this.send("ECmdGameBatchGetAchievementReward",{codes:{data_I:codes}});
	}	

	/**
	 * 获取已完成未领奖成就code
	 * null
	 */
	public getCompleteCodes():void {
		this.send("ECmdGameGetAchievementCodes",{});
	}	

	// ECmdGameGetAchievementOverview		= 101201;	//获取成就总览
	// ECmdGameGetAchievementInfos		= 101202;	//获取成就信息
	// ECmdGameGetAchievementReward		= 101203;	//获取成就奖励
	// ECmdGameGetAchievementCodes		= 101204;	//获取已完成的成就编号 （未领取奖励）
}