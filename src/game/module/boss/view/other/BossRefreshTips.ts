class BossRefreshTips extends BaseContentView {
	private nameTxt:fairygui.GRichTextField;
	private leftTime:number;
	private curTime:number;
	public constructor() {
		super(PackNameEnum.Boss,"BossRefreshTips",null,LayerManager.UI_Home);
		this.modal = false;
		this.isDestroyOnHide = true;
	}

	public initOptUI():void {
		this.nameTxt = this.getGObject("nameTxt").asRichTextField;
	}

	public updateAll(data:any = null):void {
		this.visible = !CacheManager.copy.isInCopy;
		let gameBoss:any = ConfigManager.mgGameBoss.getByPk(data);
		if(gameBoss.copyCode == CopyEnum.CopyBossHome) {
			this.nameTxt.text = "BOSS之家刷新了！";
		}
		else {
			let bossCfg: any = ConfigManager.boss.getByPk(data);
			this.nameTxt.text = HtmlUtil.html(bossCfg.name,Color.Green2) + "刷新了！";
		}
		this.leftTime = 30;
		if(!App.TimerManager.isExists(this.onTimeUpdate,this)) {
			this.curTime = egret.getTimer();
			App.TimerManager.doTimer(1000,0,this.onTimeUpdate,this);
		}
	}

	private onTimeUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0) {
			this.hide();
		}
	}

	public hide():void {
		App.TimerManager.remove(this.onTimeUpdate,this)
		this.leftTime = 30;
		super.hide();
	}
}