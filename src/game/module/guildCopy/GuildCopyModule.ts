class GuildCopyModule extends BaseTabModule {
	private btn_des:fairygui.GButton;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.GuildCopy);
	}

	public initOptUI():void {
		super.initOptUI();
		this.className = {
			[PanelTabType.GuildTeam]:["GuildTeamPanel",GuildTeamPanel]
		};
		this.btn_des = this.getGObject("btn_des").asButton;
		this.btn_des.addClickListener(this.onShowDesHandler,this);
	}

	protected updateSubView():void {
		this.btn_des.visible = this.isTypePanel(PanelTabType.GuildTeam);
	}

	public updateOpenInfo():void {
		if(this.isTypePanel(PanelTabType.GuildTeam)) {
			this.curPanel.updateOpenInfo();
		}
	}

	public updateRankInfo():void {
		if(this.isTypePanel(PanelTabType.GuildTeam)) {
			this.curPanel.updateRankInfo();
		}
	}

	public updateTeamInfo():void {
		if(this.isTypePanel(PanelTabType.GuildTeam)) {
			this.curPanel.updateTeamInfo();
		}
	}

	public updateTeamList():void {
		if(this.isTypePanel(PanelTabType.GuildTeam)) {
			this.curPanel.updateTeamList();
		}
	}

	private onShowDesHandler():void {
		let tipStr:string = "";
		if(this.isTypePanel(PanelTabType.GuildTeam)) {
			tipStr = LangTeam2.LANG18;
		}
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangTeam2.LANG18});
	}

	public hide():void {
		super.hide();
	}
}