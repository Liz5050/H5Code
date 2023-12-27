class GuildTeamCopyView extends BaseCopyPanel {
	private list_boss:List;
	public constructor(copyInfo:any) {
		super(copyInfo,"GuildTeamCopyView");
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_boss = new List(this.getGObject("list_boss").asList);
		this.XPSetBtn.visible = true;
	}

	public addListenerOnShow(): void {
		CacheManager.team2.setEnterCopyAutoCount(Team2Cache.COUNT_NO_TEAM);
	}

	public updateAll():void {
		super.updateAll();
		this.list_boss.data = ConfigManager.copyLegend.getCopyBossList(this.copyInf.code);
	}
}