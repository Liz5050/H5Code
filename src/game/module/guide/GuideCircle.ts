class GuideCircle extends egret.Rectangle {
	public x: number;
	public y: number;
	public radius: number;

	public constructor(x: number, y: number, radius: number) {
		super();
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	public contains(x: number, y: number): boolean {
		return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.radius * this.radius;
	}
}