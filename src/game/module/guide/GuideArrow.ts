/**
 * 指引箭头。箭头图片在(0,0)点。（）内的数据为指向目标中间而调整的数
 */
class GuideArrow extends fairygui.GComponent {
	public targetWidth: number;
	public targetHeight: number;
	private arrow: fairygui.GImage;
	private _direction: GuideArrowDirection = GuideArrowDirection.Left;

	public constructor(direction: GuideArrowDirection = GuideArrowDirection.Left, targetWidth: number = 0, targetHeight: number = 0) {
		super();
		this.arrow = fairygui.UIPackage.createObject(PackNameEnum.Guide, "img_arrow").asImage;
		this.addChild(this.arrow);
		this.targetWidth = targetWidth;
		this.targetHeight = targetHeight;
		this.direction = direction;
	}

	public set direction(direction: GuideArrowDirection) {
		this._direction = direction;
		let rotation: number;
		let x: number = 0;
		let y: number = 0;
		this.arrow.rotation = 0;
		this.arrow.x = 0;
		this.arrow.y = 0;
		switch (direction) {
			case GuideArrowDirection.Left:
				rotation = 0;
				x = -this.width;
				y = -this.height / 2 + (this.targetHeight / 2);
				break;
			case GuideArrowDirection.Right:
				rotation = 180;
				x = this.width + (this.targetWidth);
				y = this.height / 2 + (this.targetHeight / 2);
				break;
			case GuideArrowDirection.Top:
				rotation = 90;
				x = this.height / 2 + (this.targetWidth / 2);
				y = -this.width;
				break;
			case GuideArrowDirection.Bottom:
				rotation = -90;
				x = -this.height / 2 + (this.targetWidth / 2);
				y = this.width + (this.targetHeight);
				break;
		}
		this.arrow.rotation = rotation;
		this.arrow.x = x;
		this.arrow.y = y;
	}

	public get direction(): GuideArrowDirection {
		return this._direction;
	}

	public get width(): number {
		return this.arrow.width;
	}

	public get height(): number {
		return this.arrow.height;
	}
}