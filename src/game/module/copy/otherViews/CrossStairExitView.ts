class CrossStairExitView extends BaseContentView {
	private txt_time:fairygui.GTextField;

	private leftTime:number = 0;
	private timer:egret.Timer;
	public constructor() {
		super(PackNameEnum.Copy,"CrossStairExitView",null,LayerManager.UI_Home);
		this.isCenter = true;
		this.isPopup = false;
		this.modal = false;
	}

	public initUI():void{
		super.initUI();
		this.timer = new egret.Timer(1000,15);
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerHandler,this);
	}

	protected addListenerOnShow(): void {
		EventManager.addListener(NetEventEnum.copyLeft,this.hide,this);
    }

	public initOptUI():void {
		this.txt_time = this.getGObject("txt_time").asTextField;
	}

	public updateAll(time:number):void {
		this.leftTime = time;
		this.timer.repeatCount = time;
		this.txt_time.text = this.leftTime + "秒";
		this.timer.reset();
		this.timer.start();
	}

	private onTimerHandler():void {
		this.leftTime --;
		if(this.leftTime <= 0) {
			this.hide();
			return;
		}
		this.txt_time.text = this.leftTime + "秒";
	}

	public hide():void {
		this.leftTime = 0;
		this.timer.stop();
		super.hide();
	}
}