class BibleActivityProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 获取天书信息
	 */
	public getDeityBookInfo(): void{
		this.send("ECmdGameActiveGetDeityBookInfo", {});
	}

	/**
	 * 领取天书目标奖励
	 * @param pageCode 页码
	 * @param index 索引
	 */
	public getDeityBookTargetReward(pageCode: number, index: number): void{
		this.send("ECmdGameActiveGetDeityBookTargetReward", {"pageCode": pageCode, "index": index});
	}

	/**
	 * 领取天书奖励
	 */
	public getDeityBookPageReward(pageCode: number): void{
		this.send("ECmdGameActiveGetDeityBookPageReward", {"pageCode": pageCode});
	}
}