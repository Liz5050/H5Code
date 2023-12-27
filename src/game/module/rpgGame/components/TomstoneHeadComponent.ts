/**坟墓怪头顶 */
class TomstoneHeadComponent extends Component {
	private _curTick: number = 0;
	private nameTxt: egret.TextField;
	private timeTxt: egret.TextField;

	public constructor() {
		super();
	}
	public start(): void {
		super.start();
		let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
		if (!avatarComponent) return;
		this.createNameTxt(avatarComponent.bodyUI);
		this.createTimerTxt(avatarComponent.bodyUI);
		this.update(0);
	}
	private createNameTxt(parent: egret.DisplayObjectContainer, bodyMcHeight: number = 0): void {
		this.nameTxt = new egret.TextField();
		this.nameTxt.size = 18;
		this.nameTxt.textColor = 0x00FF00;
		this.nameTxt.width = 200;
		this.nameTxt.height = 20;
		this.nameTxt.textAlign = egret.HorizontalAlign.CENTER;
		this.nameTxt.strokeColor = 0x000000;
		this.nameTxt.stroke = 2;

		this.nameTxt.text = this.entity.entityInfo.name_S + `(${this.entity.entityInfo.level_SH}级)`;
		this.nameTxt.y = -205;
		AnchorUtil.setAnchorX(this.nameTxt, 0.5);
		parent.addChild(this.nameTxt);
	}
	private createTimerTxt(parent: egret.DisplayObjectContainer, bodyMcHeight: number = 0): void {
		this.timeTxt = new egret.TextField();
		this.timeTxt.size = 18;
		this.timeTxt.textColor = 0xFF0000;
		this.timeTxt.width = 200;
		this.timeTxt.height = 20;
		this.timeTxt.textAlign = egret.HorizontalAlign.CENTER;
		this.timeTxt.strokeColor = 0x000000;
		this.timeTxt.stroke = 2;
		this.timeTxt.y = -180;
		AnchorUtil.setAnchorX(this.timeTxt, 0.5);
		parent.addChild(this.timeTxt);
	}
	public update(advancedTime: number): void {
		super.update(advancedTime);
		var cur: number = egret.getTimer();
		if (this._curTick == 0) {
			this.setTimeTxt();
			this._curTick = cur;
		} else {
			var left: number = cur - this._curTick;
			if (left >= 1000) {
				this.setTimeTxt();
				this._curTick = cur;
			}
		}

	}

	private setTimeTxt(): void {
		var dt: number = this.entity.entityInfo.life_L64;
		var sert: number = CacheManager.serverTime.getServerTime();
		var sec: number = dt - sert;
		if (sec >= 0) {
			this.timeTxt.text = App.DateUtils.getFormatBySecond(sec, 1) + "后刷新";
		} else {
			this.timeTxt.text = "已刷新";
		}
	}

	public stop(): void {
		super.stop();
		if (this.nameTxt) {
			App.DisplayUtils.removeFromParent(this.nameTxt);
			this.nameTxt = null;
		}
		if (this.timeTxt) {
			App.DisplayUtils.removeFromParent(this.timeTxt);
			this.timeTxt = null;
		}
		this._curTick = 0;
	}

}