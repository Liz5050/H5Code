/**
 * 指引提示
 */
class GuideTip extends fairygui.GComponent {
	/**指向的目标宽度 */
	public targetWidth: number = 0;
	/**指向的目标高度 */
	public targetHeight: number = 0;
	public offsetX: number = 0;
	public offsetY: number = 0;
	private c1: fairygui.Controller;
	private topArrow: fairygui.GImage;
	private bottomArrow: fairygui.GImage;
	private leftArrow: fairygui.GImage;
	private rightArrow: fairygui.GImage;
	private tipTxt: fairygui.GTextField;
	private groupThis: fairygui.GGroup;
	private groupTxt: fairygui.GGroup;

	private _direction: GuideArrowDirection;
	private _tip: string;
	private _tipWidth: number;

	private _oriX: number = 0;
	private _oriY: number = 0;

	public constructor() {
		super();
		this.touchable = false;
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.topArrow = this.getChild("top").asImage;
		this.bottomArrow = this.getChild("bottom").asImage;
		this.leftArrow = this.getChild("left").asImage;
		this.rightArrow = this.getChild("right").asImage;
		this.tipTxt = this.getChild("txt_tip").asTextField;
		this.groupThis = this.getChild("group_this").asGroup;
		this.groupTxt = this.getChild("group_txt").asGroup;

        this.tipTxt.touchable = false;
        this.groupTxt.touchable = false;
        this.topArrow.touchable = false;
        this.bottomArrow.touchable = false;
        this.leftArrow.touchable = false;
        this.rightArrow.touchable = false;

		this._oriX = this.groupThis.x;
		this._oriY = this.groupThis.y;
	}

	public set tip(tip: string) {
		this._tip = tip;
		this.tipTxt.text = tip;
		this._tipWidth = this.tipTxt.width;
		let toX: number = this.groupTxt.x;
		switch (this._direction) {
			case GuideArrowDirection.Top:
			case GuideArrowDirection.Bottom:
				toX = this.leftArrow.x - this._tipWidth / 2 + this.leftArrow.width / 2;
				break;
			case GuideArrowDirection.Left:
				toX = this.leftArrow.x - this._tipWidth - this.leftArrow.width + 16;
				break;
			case GuideArrowDirection.Right:
				break;
			
		}
		this.groupTxt.x = toX;
	}

	public get tip(): string {
		return this._tip;
	}

	public set direction(direction: GuideArrowDirection) {
		if (this._direction != direction) {
			this._direction = direction;
			this.c1.selectedIndex = direction;
			switch (direction) {
				case GuideArrowDirection.Left:
					this.offsetX = 0;
					this.offsetY = this.targetHeight / 2;
					break;
				case GuideArrowDirection.Right:
					this.offsetX = this.targetWidth;
					this.offsetY = this.targetHeight / 2;
					break;
				case GuideArrowDirection.Top:
					this.offsetX = this.targetWidth / 2;
					this.offsetY = 0;
					break;
				case GuideArrowDirection.Bottom:
					this.offsetX = this.targetWidth / 2;
					this.offsetY = this.targetHeight;
					break;
			}
			this.playTween();
		}
	}

	public get direction(): GuideArrowDirection {
		return this._direction;
	}

	/**
	 * 播放缓动特效
	 */
	private playTween(): void {
		let ox: number = this._oriX; // this.groupThis.x;
		let oy: number = this._oriY; // this.groupThis.y;
		let dis: number = 40;
		let tx: number = ox;
		let ty: number = oy;
		let time: number = 800;
		let flag: boolean;

		switch (this.direction) {
			case GuideArrowDirection.Left:
				tx = ox - dis;
				break;
			case GuideArrowDirection.Right:
				tx = ox + dis;
				break;
			case GuideArrowDirection.Top:
				ty = oy - dis;
				break;
			case GuideArrowDirection.Bottom:
				ty = oy + dis;
				break;
		}
		egret.Tween.removeTweens(this.groupThis);
		egret.Tween.get(this.groupThis, { loop: true }).to({ x: tx, y: ty }, time).to({ x: ox, y: oy }, time)
	}

	public destroy():void{
		egret.Tween.removeTweens(this.groupThis);
		this.removeFromParent();
	}
}