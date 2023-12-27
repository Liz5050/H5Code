/**
 * 倒计时按钮
 */
class TimerButton extends fairygui.GButton {
	private timer: egret.Timer;
	private second: number = 5;
	private oldTitle: string;//原始文字
	private static grayMatrix = [
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0, 0, 0, 1, 0
	];

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.timer = new egret.Timer(1000);
	}

	/**
	 * 开始倒计时
	 */
	public start(second: number = 5): void {
		this.oldTitle = this.title;
		this.second = second;
		this.enabled = false;
		this.timer.repeatCount = second;
		this.timer.reset();
		this.onTimer();
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
		this.timer.start();
	}

	private onTimer(): void {
		this.title = this.second.toString();
		this.second--;
	}

	private onComplete(): void {
		this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
		this.title = this.oldTitle;
		this.enabled = true;
	}

	/**覆盖变灰效果，只使图片变灰 */
	protected handleGrayedChanged(): void {
		let img:fairygui.GImage = this.getChild("n1").asImage;
		if (img) {
			if (this.grayed) {
				var colorFlilter = new egret.ColorMatrixFilter(TimerButton.grayMatrix);
				img.filters = [colorFlilter];
			}
			else{
				img.filters = null;
			}
		}
	}
}