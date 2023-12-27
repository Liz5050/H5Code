class ExchangeCampView extends BaseContentView {
	private txt_time:fairygui.GTextField;

	private leftTime:number = 0;
	private timer:egret.Timer;
	public constructor() {
		super(PackNameEnum.Copy,"ExchangeCampView",null,LayerManager.UI_Home);
		this.isCenter = true;
		this.isPopup = false;
	}

	public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
		this.timer = new egret.Timer(1000,3);
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerHandler,this);
	}

	protected addListenerOnShow(): void {
		EventManager.addListener(NetEventEnum.copyLeft,this.hide,this);
    }

	public initOptUI():void {
		this.txt_time = this.getGObject("txt_time").asTextField;
	}

	public updateAll():void {
		// App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
		Log.trace(Log.UI,"阵营交换提示界面updateAll");
		this.leftTime = 3;
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
		// App.TimerManager.remove(this.onTimerHandler,this);
		this.timer.stop();
		super.hide();
	}
}