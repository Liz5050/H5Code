class HomeLeft2IconBar extends BaseIconContainer {
	private _isShow:boolean = true;
	public constructor() {
		super();
		this.dirY = 1;
		this.dirX = 1;
		this.maxCount = 1;
		this.iconWidth = 74;
		this.iconHeight = 54;
		this.iconVSpace = 10;
		this.iconHSpace = 0;
		this._isShow = true;
	}

	public goTween(isShow:boolean): void {
		if(this._isShow == isShow) return;
		this._isShow = isShow;
		let _posX: number;
		if (this._isShow) {
			_posX = 0;
			this.touchable = true;
		} 
		else {
			_posX = -this.iconWidth - 10;
			this.touchable = false;
		}
		egret.Tween.removeTweens(this.parent);
		egret.Tween.get(this.parent).to({ x: _posX }, 800, egret.Ease.backInOut);
	}

	public get isShow():boolean {
		return this._isShow;
	}
}