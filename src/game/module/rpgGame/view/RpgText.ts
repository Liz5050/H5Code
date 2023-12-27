class RpgText {
	private _text:fairygui.GTextField;
	private _txtParent:egret.DisplayObjectContainer;
	private _critImg:GLoader;
	public constructor() {
	}

	public initView(str: string, font: string,x:number = 0,y:number = 0,isCrit:boolean = false):void {
		this._txtParent = ObjectPool.pop("egret.DisplayObjectContainer");
		let imgUrl:string = "";
		let posX:number = 0;
		let posY:number = 0;
		if(isCrit) {
			if(font == FontType.MONSTER_NORMAL1) {
				imgUrl = "crit_1";
			}
			else if(font == FontType.MONSTER_NORMAL2){
				imgUrl = "crit_2";
			}
			else if(font == FontType.FABAO_FONT) {
				imgUrl = "crit_3";
			}
			posX = -105;
			posY = -2;
		}
		else if(font == FontType.XpFont){
			imgUrl = "xp_bg";
			posX = -110;
			posY = -30;
		}
		if(imgUrl != "") {
			this._critImg = ObjectPool.pop("GLoader");
			this._critImg.load(URLManager.getPackResUrl(PackNameEnum.Scene,imgUrl));
			this._critImg.x = posX;
			this._critImg.y = posY;
			this._txtParent.addChild(this._critImg.displayObject);
		}

		this._text = ObjectPool.pop("fairygui.GTextField");
		this._text.font = font;
        this._text.text = str;
		this._txtParent.addChild(this._text.displayObject);
		
		this._txtParent.x = x;
        this._txtParent.y = y;
		this._txtParent.width = this._text.width;
        this._txtParent.height = this._text.height;
		AnchorUtil.setAnchor(this._txtParent,0.5);
	}

	public destory():void {
		egret.Tween.removeTweens(this);

		if(this._critImg) {
			this._critImg.destroy();
			this._critImg = null;
		}

		App.DisplayUtils.removeFromParent(this._text.displayObject);
		this._text.text = "";
        this._text.font = null;
		ObjectPool.push(this._text);
		this._text = null;

        App.DisplayUtils.removeFromParent(this._txtParent);
        this._txtParent.alpha = 1;
        this._txtParent.scaleX = this._txtParent.scaleY = 1;
        this._txtParent.x = this._txtParent.y = 0;
        AnchorUtil.setAnchor(this._txtParent,0);
        this._txtParent.visible = true;
        this._txtParent.width = 0;
        this._txtParent.height = 0;
        ObjectPool.push(this._txtParent);
		this._txtParent = null;
		ObjectPool.push(this);
	}

	public get displayObj():egret.DisplayObjectContainer {
		return this._txtParent;
	}

	public get textObj():fairygui.GTextField {
		return this._text;
	}

	public set scaleX(value:number) {
		this.displayObj.scaleX = value;
	}

	public get scaleX():number {
		return this.displayObj.scaleX;
	}

	public set scaleY(value:number) {
		this.displayObj.scaleY = value;
	}

	public get scaleY():number {
		return this.displayObj.scaleY;
	}

	public set alpha(value:number) {
		this.displayObj.alpha = value;
	}

	public get alpha():number {
		return this.displayObj.alpha;
	}

	public set width(value:number) {
		this.displayObj.width = value;
	}

	public get width():number {
		return this.displayObj.width;
	}

	public set height(value:number) {
		this.displayObj.height = value;
	}

	public get height():number {
		return this.displayObj.height;
	}

	public set x(value:number) {
		this.displayObj.x = value;
	}

	public get x():number {
		return this.displayObj.x;
	}

	public set y(value:number) {
		this.displayObj.y = value;
	}

	public get y():number {
		return this.displayObj.y;
	}

	public get parent():egret.DisplayObjectContainer {
		return this._txtParent;
	}
}