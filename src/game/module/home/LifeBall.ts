/**
 * 血球
 */
class LifeBall extends fairygui.GComponent {
	private ball: fairygui.GMovieClip;
	private shape: egret.Shape;
	private _value: number = 100;
	private _max: number = 100;
	private ballHeight: number = 108;
	private ballX: number = -294;
	private ballY: number = -292;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		ResourceManager.load(PackNameEnum.MCLifeBall, -1, new CallBack(this.mcLoaded, this));
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
		this.ball = FuiUtil.createMc("MCLifeBall", PackNameEnum.MCLifeBall);
		this.ball.x = this.ballX;
		this.ball.y = this.ballY;
		this.addChildAt(this.ball, 0);
		this.update();
	}

	private update(): void {
		if (this.ball != null) {
			this.ball.y = this.ballY + this.ballHeight - Math.floor((this.value / this.max) * this.ballHeight) - 5;
		}
	}
}