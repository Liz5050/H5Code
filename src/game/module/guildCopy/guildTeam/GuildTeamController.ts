class GuildTeamController extends SubController {
	private rankWindow:GuildTeamCopyRankWindow;
	public constructor() {
		super();
	}

	public getModule(): GuildCopyModule {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildTeamOpen],this.onGuildTeamOpenInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildTeamClose],this.onGuildTeamColse,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildTeamRankInfo],this.onGuildTeamRankUpdate,this);

		this.addListen0(UIEventEnum.GuildTeamCopyRankOpen,this.onOpenRankWindow,this);
	}

	public addListenerOnShow(): void {
		this.addListen0(LocalEventEnum.TeamCrossInfoUpdate,this.onTeamInfoUpdate,this);
		this.addListen0(LocalEventEnum.TeamMemberListUpdate,this.onTeamMemberUpdate,this);
    }

	public removeListenerOnHide(): void {
		this.removeListener(LocalEventEnum.TeamCrossInfoUpdate,this.onTeamInfoUpdate,this);
		this.removeListener(LocalEventEnum.TeamMemberListUpdate,this.onTeamMemberUpdate,this);
    }

	/**打开排行榜 */
	private onOpenRankWindow():void {
		if(!this.rankWindow) {
			this.rankWindow = new GuildTeamCopyRankWindow();
		}
		this.rankWindow.show();
	}

	/**
	 * 活动开启
	 * SGuildTeamOpen
	 */
	private onGuildTeamOpenInfoUpdate(data:any):void {
		CacheManager.guildCopy.updateOpenInfo(data);
		this.updateOpenInfo();
	}

	/**
	 * 活动关闭
	 */
	private onGuildTeamColse():void {
		CacheManager.guildCopy.updateOpenInfo(null);
		this.updateOpenInfo();
		ProxyManager.team2.getGuildTeamRankInfo();//活动结束重新请求一次排行榜数据，领奖依据
	}

	private updateOpenInfo():void {
		if(this.isShow) {
			this.getModule().updateOpenInfo();
		}
	}

	/**
	 * 排行榜信息更新
	 * SGuildTeamRankInfo
	 */
	private onGuildTeamRankUpdate(data:any):void {
		CacheManager.guildCopy.updateRankInfo(data);
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updateRankInfo();
		}
		if(this.isShow) {
			this.getModule().updateRankInfo();
		}
	}

	private onTeamInfoUpdate():void {
		if(this.isShow) {
			this.getModule().updateTeamInfo();
		}
	}

	private onTeamMemberUpdate():void {
		if(this.isShow) {
			this.getModule().updateTeamList();
		}
	}
}