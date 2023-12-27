class WindowBossWarn extends BaseWindow {
	protected loader_boss: GLoader;
	protected txt_name: fairygui.GRichTextField;
	protected btn_go: fairygui.GButton;
	protected bossCode: number = 0;
	public constructor() {
		super(PackNameEnum.WorldBoss, "WindowBossWarn");
		this.isCenter = false;
	}

	public initOptUI(): void {
		this.loader_boss = this.getGObject("loader_boss") as GLoader;
		this.txt_name = this.getGObject("txt_name").asRichTextField;
		this.btn_go = this.getGObject("btn_go").asButton;

		this.btn_go.addClickListener(this.onClick, this);
		this.closeObj.visible = true;
	}

	public updateAll(data:any = null): void {
		this.bossCode = data;
		let bossCfg: any = ConfigManager.boss.getByPk(this.bossCode);
		let mgBossCfg:any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
		this.loader_boss.load(URLManager.getIconUrl(bossCfg.avatarId,URLManager.AVATAR_ICON));
		if(mgBossCfg && mgBossCfg.roleState) {
			this.txt_name.text = bossCfg.name + mgBossCfg.roleState + "转";
		}
		else {
			this.txt_name.text = bossCfg.name + "Lv." + bossCfg.level;
		}
	}

	public show(param: any = null): void {
		super.show(param);
		App.TimerManager.doDelay(30000, this.hide, this);
	}
	protected onClick(e: any): void {
		if (this.bossCode > 0) {
			if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss)) {
				var mgBossInf: any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
				EventManager.dispatch(LocalEventEnum.BossReqEnterCopy, mgBossInf.copyCode,mgBossInf.mapId,this.bossCode);				
			} else {				
				var mgBossInf:any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
				EventManager.dispatch(LocalEventEnum.BossRouteToBossGrid, this.bossCode,mgBossInf.mapId);
			}

		}
		this.hide();
	}
}