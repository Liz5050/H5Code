/**
 * exp组件
 */
class ExpCompoment {
	private bar: UIProgressBar;
	private txt: fairygui.GTextField;

	private value: number = 0;
	private max: number = 0;

	private _isLevelUp: boolean = false;
	private isComplete: boolean = true;
	private mc: UIMovieClip;
	private mcBao: UIMovieClip;
	private barCenterPos: egret.Point;

	public constructor(bar: UIProgressBar, txt: fairygui.GTextField, effect: UIMovieClip, mcBao: UIMovieClip) {
		this.mc = effect;
		this.mcBao = mcBao;
		this.bar = bar;
		this.bar.labelType = BarLabelType.Current_Total;
		this.bar.labelSize = 15;
		this.bar.textColor = 0xf2e1c0;
		this.bar.formatValue = true;

		this.bar.setStyle(URLManager.getPackResUrl(PackNameEnum.Navbar, "bar_exp"), "", 475, 19, 0, 0, UIProgressBarType.Mask);
		this.bar.addEventListener(UIProgressBar.PROPGRESS_UPDATE, this.onProgressUpdate, this);
		this.bar.addEventListener(UIProgressBar.PROPGRESS_COMPLETE, this.onProgressComplete, this);
		this.txt = txt;
		this.barCenterPos = new egret.Point();
		this.bar.setBarMc(PackNameEnum.MCExpBar, -8, -9);
	}

	public set isLevelUp(value: boolean) {
		this._isLevelUp = value
	}

	public get isLevelUp(): boolean {
		return this._isLevelUp;
	}

	public update(value: number, max: number): void {
		if (this.bar.current == -1) {
			this.bar.setValue(value, max, true);
			this.value = value;
			this.max = max;
			return;
		}
		//播放完爆炸再更新
		// this.playMcBao(() => {
		// 	this.mcBao.visible = false;
		// 	this.mcBao.playing = false;

		// 	if (!this.isComplete) {
		// 		this.value = value;
		// 		this.max = max;
		// 		return;
		// 	}
		// 	this.playMc();
		// 	if (this.isLevelUp) {
		// 		let _max: number = this.max;
		// 		this.bar.setValue(_max, _max, true);
		// 		this.isComplete = false;
		// 	}
		// 	else {
		// 		this.bar.setValue(value, max, true);
		// 	}
		// 	this.value = value;
		// 	this.max = max;
		// }, this);

		this.playMcBao(null, null);
		if (!this.isComplete) {
			this.value = value;
			this.max = max;
			return;
		}
		if (this.isLevelUp) {
			let _max: number = this.max;
			this.bar.setValue(_max, _max, true);
			this.isComplete = false;
		}
		else {
			this.bar.setValue(value, max, true);
		}
		this.value = value;
		this.max = max;
	}

	private onProgressUpdate(): void {
		this.mcBao.x = this.bar.x + this.bar.barWidth;
	}

	private onProgressComplete(): void {
		if (this.isLevelUp) {
			this.isLevelUp = false;
			this.bar.setValue(0, this.max, false);
			this.bar.setValue(this.value, this.max, true);
		}
		else {
			this.onMcBaoComplete();
		}
		this.isComplete = true;
	}

	/**
	 * 获取经验条中心的全局坐标
	 */
	public getBarCenterGPos(): egret.Point {
		if (this.bar.parent) {
			let px: number = this.bar.x + this.bar.width / 2;
			let py: number = this.bar.y - 20;
			this.bar.parent.localToGlobal(px, py, this.barCenterPos);
		}
		return this.barCenterPos;
	}

	public playMcBao(fun: Function, caller: any): void {
		this.mcBao.x = this.bar.x + this.bar.barWidth;
		this.mcBao.setPlaySettings(0, -1, 0, -1, fun, caller);
		this.mcBao.visible = true;
		this.mcBao.playing = true;
	}

	/**播光点特效 */
	private playMc(): void {
		this.mc.alpha = 1;
		this.mc.x = this.bar.x + this.bar.barWidth;
		this.mc.setPlaySettings(0, -1, 0, -1, this.onMcComplete, this);
		this.mc.visible = true;
		this.mc.playing = true;
	}

	/**光点特效完成 */
	private onMcComplete(): void {
		egret.Tween.removeTweens(this.mc);
		egret.Tween.get(this.mc).to({ aplha: 0 }, 100).call(() => {
			this.mc.visible = false;
			this.mc.playing = false;
		}, this);
	}

	/**光点特效完成 */
	private onMcBaoComplete(): void {
		egret.Tween.removeTweens(this.mcBao);
		egret.Tween.get(this.mcBao).to({ aplha: 0 }, 100).call(() => {
			this.mcBao.visible = false;
			this.mcBao.playing = false;
		}, this);
	}
}