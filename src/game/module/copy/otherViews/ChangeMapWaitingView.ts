class ChangeMapWaitingView extends BaseContentView {
	private txt_toMapName:fairygui.GRichTextField;
	private txt_waitTime:fairygui.GTextField;
	private btn_close:fairygui.GButton;
	private leftTime:number = 2;
	private mapId:number;
	public constructor() {
		super(PackNameEnum.Copy,"ChangeMapWaitingView");
		this.isCenter = true;
		this.modal = true;
		this.isPopup = false;
	}

	public initOptUI():void {
		this.txt_toMapName = this.getGObject("txt_toMapName").asRichTextField;
		this.txt_waitTime = this.getGObject("txt_waitTime").asTextField;
		this.btn_close = this.getGObject("btn_close").asButton;
		this.btn_close.addClickListener(this.hide,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.kingDie, this.hide, this);
		this.addListen1(NetEventEnum.copyLeft,this.hide,this);
	}

	public updateAll(mapId:number):void {
		this.mapId = mapId;
		this.txt_toMapName.text = "即将前往：" + HtmlUtil.html(CacheManager.guildBattle.getPositionName(mapId),Color.Yellow);
		this.leftTime = 2;
		this.txt_waitTime.text = this.leftTime + "秒后自动切换区域";
		App.TimerManager.doTimer(1000,2,this.onTimeUpdateHandler,this);
	}

	private onTimeUpdateHandler():void {
		this.leftTime--;
		if(this.leftTime <= 0) {
			ProxyManager.guildBattle.enterGuildBattle(this.mapId);
			this.hide();
			return;
		}
		this.txt_waitTime.text = this.leftTime + "秒后自动切换区域";
	}

	public hide():void {
		this.leftTime = 2;
		App.TimerManager.remove(this.onTimeUpdateHandler,this);
		super.hide();
	}
}