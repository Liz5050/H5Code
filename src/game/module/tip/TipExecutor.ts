/**
 * 执行器
 */
class TipExecutor {
	private tipsDict: { [tipType: number]: Array<any> };
	private tipBaseDict: { [tipType: number]: TipBase };

	public constructor() {
		this.tipsDict = {};
		this.tipBaseDict = {
			[TipType.LeftBottomText]: new TipLeft(),
			[TipType.CenterText]: new TipCenter(),
			[TipType.PropIcon]: new TipFlyIcon(),
			[TipType.Attr]: new TipAttr(),
			[TipType.Opt]: new TipOpt()
		}
		this.start();
	}

	public start(): void {
		App.TimerManager.doTimer(100, 0, this.doTimer, this);
	}

	public stop(): void {
		App.TimerManager.remove(this.doTimer, this);
	}

	public addTip(tipType: TipType, tips: Array<any>): void {
		if (this.tipsDict[tipType] == null) {
			this.tipsDict[tipType] = [];
		}
		for (let tip of tips) {
			this.tipsDict[tipType].push(tip);
		}
	}

	private doTimer(): void {
		if (this.tipsDict != null) {
			let tips: Array<any>;
			let tipBase: TipBase;
			for (let key in this.tipsDict) {
				tipBase = this.tipBaseDict[key];
				tips = this.tipsDict[key];
				if (tips != null && tips.length > 0) {
					while (tips.length > 0) {
						tipBase.do(tips.shift());
					}
				}
			}
		}
	}
}