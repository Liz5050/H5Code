class GBitmap extends egret.Bitmap {
	private _url:string = "";
	public constructor(value?:egret.Texture) {
		super(value);
	}

	public set url(value:string) {
		if(!value || this._url == value) return;
		this._url = value;
		App.LoaderManager.getResByUrl(this._url,function(){
			if(!!this._url) {//防止未加载完成的时候调用了destroy
				this.texture = App.LoaderManager.getCache(this._url);
				GLoader.addUseTime(this._url);
			}
		},this);
	}

	public destroy():void {
		egret.Tween.removeTweens(this);
		GLoader.clearByUrl(this._url);
		this._url = "";
		App.DisplayUtils.removeFromParent(this);
		this.x = 0;
		this.y = 0;
		this.alpha = 1;
		this.visible = true;
		this.scaleX = this.scaleY = 1;
		this.texture = null;
		AnchorUtil.setAnchor(this, 0);
		ObjectPool.push(this);
	}
}