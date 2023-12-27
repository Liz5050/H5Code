class GuildApplyController extends BaseController {
	private module: GuildApplyModule;
	private createWindow: GuildCreateWindow;

	public constructor() {
		super(ModuleEnum.GuildApply);
	}

	public initView(): GuildApplyModule {
		this.module = new GuildApplyModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addListen0(UIEventEnum.GuildCreateOpen, this.openCreateWindow, this);
		this.addListen0(LocalEventEnum.GuildApply, this.applyGuild, this);
		
	}

	public addListenerOnShow(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSearchGuilds], this.onSearchGuild, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameApplyGuild], this.onApplyGuild, this);
		
		this.addListen0(NetEventEnum.packBackPackItemsChange, this.onPackChange, this);
	}

	public afterModuleShow(data?: any): void {
		super.afterModuleShow(data);
		EventManager.dispatch(LocalEventEnum.GuildSearch, { "name": "", "includeFull": true });
	}

	/**
     * 搜索仙盟返回S2C_SSearchGuilds
     */
	private onSearchGuild(data: any): void {
		this.module.updateBySearchResponse(data);
	}

	/**
	 * 申请返回
	 */
	private onApplyGuild(data: any): void {
		let guildId: number = data.returnId;
		this.module.updateByGuildId(guildId);
	}

	

	/**
	 * 背包更新了
	 */
	private onPackChange():void{
		if (this.createWindow != null && this.createWindow.isShow) {
			this.createWindow.checkCondition();
		}
	}

	private openCreateWindow(): void {
		if (this.createWindow == null) {
			this.createWindow = new GuildCreateWindow();
		}
		this.createWindow.show();
	}

	private applyGuild(data: any): void {
		ProxyManager.guild.apply(data.guildId);
	}

	

}