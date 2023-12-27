class TalentExpBall extends fairygui.GComponent {
	private shape: fairygui.GGraph;
	private _value: number = 100;
	private _max: number = 100;
	private ballHeight: number = 123;
	private shapeX: number = -5;
	private shapeY: number = 123;
	// private ball:UIMovieClip;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.shape = this.getChild("graph_shade").asGraph;
		// this.ball = UIMovieManager.get(PackNameEnum.MCInnerPowerBall, -196, -210, 1.08, 1.08);
		// this.addChildAt(this.ball, 0);
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

	private mcLoaded(): void {
		this.shape.x = this.shapeX;
		this.shape.y = this.shapeY;
		this.update();
	}

	private update(): void {
		if (this.shape != null) {
			let value: number = this.value > this.max ? this.max : this.value;
			let toy:number = this.shapeY - Math.floor((value / this.max) * (this.ballHeight));
			egret.Tween.removeTweens(this.shape);
			egret.Tween.get(this.shape).to({y: toy}, 150);
		}
	}
}