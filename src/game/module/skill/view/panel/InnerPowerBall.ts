class InnerPowerBall extends fairygui.GComponent {
	private comBall: fairygui.GComponent;
	private shape: fairygui.GGraph;
	private _value: number = 100;
	private _max: number = 100;
	private ballHeight: number = 133;
	private shapeX: number = -5;
	private shapeY: number = 144;
	private ball: UIMovieClip;
	private topMc: UIMovieClip;
	private topMcY: number = -109;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.shape = this.getChild("graph_shade").asGraph;
		this.ball = UIMovieManager.get(PackNameEnum.MCInnerPowerBall, -196, -210, 1.08, 1.08);
		this.topMc = UIMovieManager.get(PackNameEnum.MCInnerPowerBallTop, -174, -121, 1, 1);
		this.addChildAt(this.ball, 0);
		this.addChild(this.topMc);

		this.ball.mask = this.shape.displayObject;

		this.topMc.addRelation(this.shape, fairygui.RelationType.Top_Top);
	}

	public set value(value: number) {
		this._value = value;
		this.update();
	}

	public get value(): number {
		return this._value;
	}

	public set max(max: number) {
		this._max = max;
	}

	public get max(): number {
		return this._max;
	}

	private update(): void {
		if (this.shape != null) {
			let dis: number = Math.floor((this.value / this.max) * (this.ballHeight * 1.08))
			let toy: number = this.shapeY - dis;
			egret.Tween.removeTweens(this.shape);
			if (toy != this.shapeY) {
				egret.Tween.get(this.shape).to({ y: toy }, 150);
			} else {
				this.shape.y = this.shapeY;
			}
			this.topMc.visible = this.value != 0;
		}
	}
}