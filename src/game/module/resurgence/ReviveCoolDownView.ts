/**新手副本复活倒计时 */
class ReviveCoolDownView extends BaseContentView {
	private TOTAL_SEC: number = 5;
	private bg: fairygui.GImage;
	private circle: fairygui.GImage;
	private circleMask: egret.Shape;
	private txt_time: fairygui.GTextField;
	private _sec: number = 5;
	private endAngle:number = 270;
	private endRadian:number;
	public constructor() {
		super(PackNameEnum.Resurgence, "ReviveCoolDownView");
		this.modal = true;
		this.isCenter = true;
		this.endRadian = this.endAngle * Math.PI/180;
	}
	public initOptUI(): void {
		this.bg = this.getGObject("bg").asImage;
		this.circle = this.getGObject("circle").asImage;
		this.txt_time = this.getGObject("txt_time").asTextField;
		this.circleMask = new egret.Shape();
		var par: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>this.circle.parent.displayObject;
		par.addChild(this.circleMask);
		this.circleMask.x = this.circle.x + this.circle.width / 2;
		this.circleMask.y = this.circle.y + this.circle.height / 2;

		this.circle.displayObject.mask = this.circleMask;
	}
	public updateAll(): void {

	}

	public onShow():void{
		super.onShow();
		App.TimerManager.doTimer(1000, 0, this.onTimer, this);
		this._sec = this.TOTAL_SEC * 1000 + egret.getTimer();
		this.onTimer();
	}

	public hide(): void {
		super.hide();
		App.TimerManager.remove(this.onTimer, this);
	}

	private onTimer(): void {
		var sec: number = this._sec - egret.getTimer();
		sec = Math.round(sec / 1000);
		this.txt_time.text = "" + sec;				
		var percent:number = sec/this.TOTAL_SEC;
		var sta:number = 90/360*this.TOTAL_SEC; //需要从负角度开始的耗时
		var costTime:number = this.TOTAL_SEC - sec;
		var stAngle:number = 0;		
		if(costTime<sta)
		{
			stAngle = -90 + costTime/sta*90;//负角度开始画
		}else
		{
			stAngle = (costTime-sta)/(this.TOTAL_SEC-sta) * this.endAngle; //正角度开始画
		}		
		stAngle = Math.min(stAngle,this.endAngle);		
		stAngle = stAngle * Math.PI/180;
		this.circleMask.graphics.clear();
		this.circleMask.graphics.beginFill(0xff0000,1);		
		this.circleMask.graphics.moveTo(0,0);
		this.circleMask.graphics.lineTo(0,-60);		
		this.circleMask.graphics.drawArc(0, 0, 60, stAngle, this.endRadian, false);
		this.circleMask.graphics.lineTo(0,0);
		this.circleMask.graphics.endFill();		
		this.circle.visible = sec>0;
		if (sec < 0) {
			this.hide();
			//复活点复活
            EventManager.dispatch(LocalEventEnum.Revive,{revivalType:ERevivalType.ERevivalTypeInBackToTheCity,priceUnit:0});
        }
	}
}