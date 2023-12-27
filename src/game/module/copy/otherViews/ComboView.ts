class ComboView extends BaseContentView {
	private txt_combo:fairygui.GTextField;
	private leftTime:number = -1;
	private combo:number;
	private timer:egret.Timer;
	public constructor() {
		super(PackNameEnum.Copy,"ComboView",null,LayerManager.UI_Home);
		this.x = 118;
		this.y = 308;
	}

	public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public initOptUI():void {
		this.txt_combo = this.getGObject("txt_combo").asTextField;
		this.timer = new egret.Timer(1000,3);
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerUpdate,this);
	}

	public updateAll(combo:number):void {
		egret.Tween.removeTweens(this.txt_combo);
		this.txt_combo.text = "X" + combo;
		this.txt_combo.scaleX = this.txt_combo.scaleY = 1;
		egret.Tween.get(this.txt_combo).to({scaleX:1.5,scaleY:1.5},150).to({scaleX:1,scaleY:1},100);
		this.combo = combo;
		this.leftTime = 3;
		this.timer.reset();
		this.timer.start();
	}

	private onTimerUpdate():void {
		// let time:number = egret.getTimer();
		this.leftTime -- //Math.round((time - this.curTime)/1000);
		// this.curTime = time;
		if(this.leftTime <= 0) {
			this.hide();
		}
	}

	public hide():void {
		this.leftTime = -1;
		this.timer.stop();
		super.hide();
		egret.Tween.removeTweens(this.txt_combo);
		this.txt_combo.scaleX = this.txt_combo.scaleY = 1;
	}
}