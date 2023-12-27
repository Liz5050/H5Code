/**
 * 中下部操作提示
 */
class TipOpt extends TipBase {
	private container: fairygui.GComponent;
	private leftTextOffsetY: number = 325;
	private showTime: number = 1400;
	private maxSize: number = 1;

	public constructor() {
		super();
		App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);
	}

	public do(tip: string): void {
		this.addToParent(tip);
		this.updatePos();
	}

	private addToParent(tip: string): void {
		if (this.container == null) {
			this.container = new fairygui.GComponent();
			this.container.x = 0;//TipText文本x为9
			this.container.y = fairygui.GRoot.inst.height - this.leftTextOffsetY;
			this.container.addRelation(LayerManager.UI_Tips, fairygui.RelationType.Bottom_Bottom);
		}
		LayerManager.UI_Tips.addChild(this.container);
		if (!App.TimerManager.isExists(this.onTimer, this)) {
            App.TimerManager.doTimer(1, 0, this.onTimer, this);
		}
		if (this.container.numChildren >= this.maxSize) {
			return;
		}
		let tipText: TipText = ObjectPool.pop("TipText");
		tipText.addTime = Date.now();
        tipText.textField.fontSize = 20;
		tipText.resetFont();
		tipText.text = tip;
		tipText.x = (fairygui.GRoot.inst.width - tipText.width) / 2;
		tipText.y = 0;
		tipText.visible = false;
		this.container.addChild(tipText);
	}

	private updatePos(): void {
		let len: number = this.container.numChildren;
		for (let i: number = len - 1; i >= 0; i--) {
			let tipText: TipText = <TipText>this.container._children[i];
			if (len > this.maxSize && i < len - this.maxSize) {
				tipText.removeFromParent();
				continue;
			}
			tipText.visible = true;
			let toY: number = -(len - i - 1) * 40;
			egret.Tween.removeTweens(tipText);
			egret.Tween.get(tipText).to({ y: toY }, 500, egret.Ease.sineOut);
		}
	}

	private onTimer(): void {
		let tipText: TipText;
		for (let tp of this.container._children) {
			tipText = <TipText>tp;
			if ((Date.now() - tipText.addTime) >= this.showTime) {//2秒后删除
				tipText.doRemove();
			}
		}
	}

	private onStageResize(): void {
		if (this.container != null) {
			this.container.y = fairygui.GRoot.inst.height - this.leftTextOffsetY;
		}
	}
}