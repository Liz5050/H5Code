/**
 * 属性提示
 */
class TipAttr extends TipBase {
	private container: fairygui.GComponent;
	private leftTextOffsetY: number = 260;
	private maxSize: number = 12;
	private showTime: number = 2000;

	public constructor() {
		super();
	}

	public do(tip: any): void {
		this.addToParent(tip);
		this.updatePos();
	}

	private addToParent(tip: any): void {
		if (this.container == null) {
			this.container = new fairygui.GComponent();
			this.container.x = 130;
			this.container.y = fairygui.GRoot.inst.height - this.leftTextOffsetY;
			LayerManager.UI_Tips.addChild(this.container);
			this.container.addRelation(LayerManager.UI_Tips, fairygui.RelationType.Bottom_Bottom);

		}
		if (!App.TimerManager.isExists(this.onTimer, this)) {
            App.TimerManager.doTimer(1, 0, this.onTimer, this);
		}

		let tipText: TipText = ObjectPool.pop("TipText");
		tipText.addTime = Date.now();
		tipText.textField.font = FontType.ROLE_PROPERTY_UPGRADE;
		tipText.x = 0;
		tipText.y = 0;
		tipText.text = "+" + tip["txt"] + tip["value"];
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
}