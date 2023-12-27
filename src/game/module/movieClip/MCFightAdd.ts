/**
 * 战斗力增加特效
 */
class MCFightAdd extends fairygui.GComponent {
	private mc: UIMovieClip;
	private valueTxt: fairygui.GTextField;
	private myParent: fairygui.GComponent;

	private value: number = 0;
	private current: number = 0;
	private timeCount: number = 10;//更新10次
	private plus: number = 1;
	private startTime: number = 0;
	private showTime: number = 500;//停止显示时间
	private timeOutHandler: number = 0;
	private isPlaying: boolean;

	public constructor() {
		super();
		this.myParent = LayerManager.UI_Tips;
		this.initUI();
	}

	private initUI(): void {
		this.mc = UIMovieManager.get(PackNameEnum.MCFightAdd);
		this.addChild(this.mc);
		this.valueTxt = new fairygui.GTextField();
		this.valueTxt.font = "ui://11a3pdu1ctbs6h";//战斗力增加
		this.valueTxt.setXY(250, 80);
		this.valueTxt.text = "";
		this.addChild(this.valueTxt);
	}

	public play(value: number): void {
		this.setXY((fairygui.GRoot.inst.width - 500) / 2, fairygui.GRoot.inst.height - 580);
		// this.stopAll();
		if (this.isPlaying) {
			this.current = 0;
			this.value += value;
		} else {
			this.stopAll();
			this.value = value;
		}
		this.plus = Math.floor(this.value / this.timeCount);
		if (this.plus <= 0) {
			this.plus = 1;
		}
		App.TimerManager.doTimer(33, 0, this.updateValueText, this);

		if (this.parent == null) {
			this.myParent.addChild(this);
		}
		this.mc.setPlaySettings(0, -1, 1, -1);
		this.mc.playing = true;
	}
	
	private updateValueText(): void {
		this.isPlaying = true;
		if (this.startTime != 0) {
			let interval: number = Date.now() - this.startTime;
			if (interval >= this.showTime) {
				App.TimerManager.remove(this.updateValueText, this);
				this.isPlaying = false;
				let duration: number = 500;
				clearTimeout(this.timeOutHandler);
				this.timeOutHandler = setTimeout(() => {
					egret.Tween.removeTweens(this);
					let t: egret.Tween = egret.Tween.get(this).to({ alpha: 0 }, duration);
					t.call(this.stopAll, this);
				}, duration)
				return;
			}
		}
		this.current += this.plus;
		if (this.current >= this.value) {
			this.current = this.value;
			this.isPlaying = false;
		}
		this.valueTxt.text = "+" + this.current;
		if (this.startTime == 0 && this.current >= this.value) {
			this.startTime = Date.now();
		}
	}

	private stopAll(): void {
		egret.Tween.removeTweens(this);
		this.current = 0;
		this.startTime = 0;
		this.removeFromParent();
		this.mc.playing = false;
		this.alpha = 1;
		clearTimeout(this.timeOutHandler);
		App.TimerManager.remove(this.updateValueText, this);
		this.isPlaying = false;
	}
}