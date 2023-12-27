class MatchingTweenView extends BaseView {

	private headImgs:GLoader[];
	

	private isStart:boolean;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	public initOptUI():void {
		this.headImgs = [];
		
		let headId:number[] = [1,2,4];
		for(let i:number = 0; i < headId.length; i++) {
			let loader:GLoader = this.getGObject("head_" + i) as GLoader;
			loader.load(URLManager.getPlayerHead(headId[i]));
			this.headImgs.push(loader);
			loader.visible = false;
		}
	}

	public set mask(obj:egret.DisplayObject) {
		this.view.mask = obj
	}

	public startMatch():void {
		if(this.isStart) return;
		this.isStart = true;
		for(let i:number = 0; i < this.headImgs.length; i++) {
			this.headImgs[i].y = 109*i;
			this.headImgs[i].visible = true;
			this.startMove(this.headImgs[i],i);
		}
	}

	private startMove(loader:GLoader,index:number):void {
		let time:number = 500 + index*500;
		egret.Tween.get(loader).to({y:-109},time).call(function(){
			loader.y = 109 + 109;
			this.startMove(loader,2);
		},this);
	}

	public stopMatch():void {
		for(let i:number = 0; i < this.headImgs.length; i++) {
			egret.Tween.removeTweens(this.headImgs[i]);
			this.headImgs[i].visible = false;
		}	
		this.isStart = false;
	}

	public updateAll():void {

	}
}