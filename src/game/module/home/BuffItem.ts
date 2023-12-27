class BuffItem extends ListRenderer {
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private descTxt: fairygui.GTextField;
	private leftTimeTxt: fairygui.GTextField;
	private txt_buffSum: fairygui.GTextField;
	private remainTs: number = 0;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.descTxt = this.getChild("txt_desc").asTextField;
		this.leftTimeTxt = this.getChild("txt_leftTime").asTextField;
		this.txt_buffSum = this.getChild("txt_buffSum").asTextField;
	}

	public setData(data: any): void {
		let sBuffer: any = data.sBuffer;
		let buffInfo: any = data.bufferInfo;
		let num: number = data.num;
		this.nameTxt.text = buffInfo.name;
		this.descTxt.text = buffInfo.description;
		this.iconLoader.load(`resource/assets/icon/buff/${buffInfo.icon}.jpg`);
		if (num) {
			this.txt_buffSum.text = "" + num;
		} else {
			this.txt_buffSum.text = "";
		}
		if (sBuffer) {
			let lastTime: number = 0;
			if (buffInfo["lastTime"] != null) {
				lastTime = buffInfo["lastTime"];
			}
			// (buffInfo.timeType && buffInfo.timeType==2) 这里是让疲劳buff可以显示倒计时用的 有问题再改 2018年3月28日15:41:40
			if (lastTime > 0 || (buffInfo.timeType && buffInfo.timeType == 2)) {
				this.remainTs = sBuffer.endDt_DT - CacheManager.serverTime.getServerTime();
				if (this.remainTs > 0) {
					this.stopTimer();
					this.updateLeftTime();
					App.TimerManager.doTimer(1000, this.remainTs, this.onTimer, this, this.stopTimer, this);
				} else {
					this.stopTimer();
				}
			} else {
				this.leftTimeTxt.text = "";
			}
		}
	}

	public stopTimer(): void {
		this.leftTimeTxt.text = "";
		App.TimerManager.remove(this.onTimer, this);
	}

	private onTimer(): void {
		this.remainTs -= 1;
		this.leftTimeTxt.text = App.DateUtils.getFormatBySecond(this.remainTs, 5);
	}

	private updateLeftTime(): void {
		this.leftTimeTxt.text = App.DateUtils.getFormatBySecond(this.remainTs, 5);
		this.remainTs -= 1;
		if (this.remainTs < 0) {
			this.stopTimer();
		}
	}

	private getFormatLeftTime(leftTime: number): string {
		return "" + leftTime;
	}
}