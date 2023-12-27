/**
 * 中部提示
 */
class TipCenter extends TipBase {
	private tipText: TipText;
	private isTweening: boolean;

	public constructor() {
		super();
	}

	public do(tip: string): void {

		if (this.tipText == null) {
			this.tipText = new TipText();
			// this.tipText.isShowBg = true;
		}
		this.tipText.removeFromParent();
		this.tipText.text = tip;
		this.tipText.addToParent();
		let startX: number = (fairygui.GRoot.inst.width - this.tipText.width) / 2;
		let startY: number = (fairygui.GRoot.inst.height - this.tipText.height) / 2;
		this.tipText.setXY(startX, startY);

		let toY: number = startY - 200;
		if (this.isTweening) {
			this.tipText.y = toY;
			return;
		}

		let self: any = this;
		this.isTweening = true;
		egret.Tween.removeTweens(this.tipText);
		egret.Tween.get(this.tipText).to({ y: toY }, 100).call(function () {
			egret.Tween.get(self.tipText).to({}, 2000).call(function () {
				self.tipText.removeFromParent();
				self.isTweening = false;
			});
		});
	}
}