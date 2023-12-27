class SceneMaskEffect extends fairygui.GGraph{
	private _isShow:boolean = false;
	public constructor() {
		super();
		this.touchable = false;
	}
	public show(layer:fairygui.GComponent, alpha:number, duration:number, waitTime:number = 0):void{
		if(this._isShow){
			return;
		}
        this.hide();
		this._isShow = true;
        layer.addChild(this);

		this.graphics.beginFill(0,alpha);
		this.graphics.drawRect(0,0,fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
		this.graphics.endFill();
		this.alpha = 1;
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(waitTime).to({alpha:0},duration).call(()=>{
            this.hide();
			this._isShow = false;
		},this);
		
	}

	public copyShow():void {
		this.show(LayerManager.UI_SecenEffect, 1, 1200);
	}

	public xpSkillShow():void {
		this.show(LayerManager.UI_XP_SKILL_DOWN, 0.5, 200, 1600);
	}

	public hide():void {
        this.removeFromParent();
        this.clearGraphics();
        egret.Tween.removeTweens(this);
	}
}