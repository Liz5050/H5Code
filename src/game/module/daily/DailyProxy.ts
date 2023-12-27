class DailyProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**升级剑池 */
	public upgrade(): void {
		this.send("ECmdGameSwordPoolUpgrade", {});
	}

	/**更换模型 */
	public changeModel(modelId: number): void {
		this.send("ECmdGameSwordPoolChangeModel", { "modelId": modelId });
	}

	/**领取奖励 */
	public getActivityReward(idx: number): void {
		this.send("ECmdGameSwordPoolGetActivityReward", { "idx": idx });
	}

	/**隐藏模型 */
	public hideModel(isHide: boolean): void {
		this.send("ECmdGameSwordPoolNotShow", { "value": isHide });
	}
}