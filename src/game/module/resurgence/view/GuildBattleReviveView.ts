class GuildBattleReviveView extends BaseContentView {
	private txt_ownerGuild:fairygui.GTextField;
	private txt_time:fairygui.GTextField;
	private timer:egret.Timer;
	private leftTime:number = -1;
	public constructor() {
		super(PackNameEnum.Resurgence,"GuildBattleReviveView");
		this.isCenter = true;
		this.modal = true;
		this.isPopup = false;
	}

	public initOptUI():void {
		this.txt_ownerGuild = this.getGObject("txt_ownerGuild").asTextField;
		this.txt_time = this.getGObject("txt_time").asTextField;

		this.timer = new egret.Timer(1000);
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerUpdate,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.copyLeft,this.onCopyLeft,this);
	}

	public updateAll(killInfo:any):void {
		this.leftTime = ConfigManager.guildBattle.reviveTime;
		if(this.leftTime == -1) {
			this.hide();
			return;
		}
		this.txt_time.text = this.leftTime + "秒后在仙盟殿外复活";
		this.timer.start();

		let entityInfo:any = CacheManager.map.getEntityInfo(EntityUtil.getEntityId(killInfo.entityId,RoleIndexEnum.Role_index0));
		if(!entityInfo) {
			this.txt_ownerGuild.text = "所属仙盟：---";
		}
		else {
			this.txt_ownerGuild.text = "所属仙盟：" + entityInfo.guildName_S;
		}
	}

	private onCopyLeft():void {
		this.hide();
	}

	private onTimerUpdate():void {
		this.leftTime --;
		if(this.leftTime <= 0) {
			this.hide();
			return;
		}
		this.txt_time.text = this.leftTime + "秒后在仙盟殿外复活";
	}

	public hide():void {
		this.timer.stop();
		super.hide();
	}
}