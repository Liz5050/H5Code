class BossRefreshTips2 extends BaseContentView {
	private c1:fairygui.Controller;
	private loader_bg:GLoader;
	private txt_bossName:fairygui.GTextField;
	private loader_head:GLoader;
	private btn_go:fairygui.GButton;

	private leftTime:number;
	private curTime:number;
	private timeIndex:number = -1;
	private gotoType:PanelTabType;
	public constructor() {
		super(PackNameEnum.Boss,"BossRefreshTips2",null,LayerManager.UI_Cultivate);
		this.modal = false;
		this.isDestroyOnHide = true;
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("refreshBg.png",PackNameEnum.Boss));
		this.txt_bossName = this.getGObject("txt_bossName").asTextField;
		this.loader_head = this.getGObject("loader_head") as GLoader;
		this.btn_go = this.getGObject("btn_go").asButton;
		this.btn_go.addClickListener(this.onClickHandler,this);
		this.getGObject("btn_close").asButton.addClickListener(this.hide,this);
	}

	public updateAll(data:any = null):void {
		this.visible = !CacheManager.copy.isInCopy;
		let gameBoss:any = ConfigManager.mgGameBoss.getByPk(data);
		let bossCfg: any = ConfigManager.boss.getByPk(data);
		this.txt_bossName.text = bossCfg.name;
		this.loader_head.load(URLManager.getIconUrl(bossCfg.avatarId,URLManager.AVATAR_ICON));
		if(gameBoss.copyCode == CopyEnum.CopyWorldBoss) {
			//野外boss
			this.c1.selectedIndex = 0;
			this.gotoType = PanelTabType.WorldBoss;
		}
		else if(gameBoss.copyCode == CopyEnum.CopyGodBoss) {
			//神域boss
			this.c1.selectedIndex = 1;
			this.gotoType = PanelTabType.GodBoss;
		}
		else {
			//秘境boss
			this.c1.selectedIndex = 2;
			this.gotoType = PanelTabType.SecretBoss;
		}

		this.leftTime = 20;
		if(this.timeIndex == -1) {
			this.curTime = egret.getTimer();
			this.timeIndex = egret.setInterval(this.onTimeUpdate,this,1000);
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

	private onClickHandler():void {
		this.hide();
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:this.gotoType});
	}

	public hide():void {
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		super.hide();
	}
}