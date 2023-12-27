class HomeRightIconBar extends BaseIconContainer {
	private _isShow:boolean = true;
	public constructor() {
		super();
		this.dirY = -1;
		this.maxCount = 1;
		this.iconWidth = 76;
		this.iconHeight = 68;
		this.iconVSpace = 5;
		this._isShow = true;
	}

	public goTween(isShow:boolean): void {
		if(this._isShow == isShow) return;
		this._isShow = isShow;
		let _posX: number;
		if (this._isShow) {
			_posX = fairygui.GRoot.inst.width - this.iconWidth -20;
			this.touchable = true;
			this.visible = true;
		} 
		else {
			_posX = fairygui.GRoot.inst.width;
			this.touchable = false;
		}
		egret.Tween.removeTweens(this.parent);
		egret.Tween.get(this.parent).to({ x: _posX }, 400, egret.Ease.backInOut).call(() => {
			this.visible = this._isShow;
		}, this);;
	}

	public get isShow():boolean {
		return this._isShow;
	}
}