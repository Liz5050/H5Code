class TimeLimitTaskProxy extends BaseProxy{
	
	public constructor() {
		super();
	}
	
	
	/**
	 * 领取奖励
	 * @param code 当前限时任务类型
	 * @param index 限时任务索引
	 */
	public getTimpLimitedTaskReward(code:number, index:number) {
		this.send("ECmdGameTaskGetTimpLimitedTaskReward", {"code": code, "index": index});
	}

}