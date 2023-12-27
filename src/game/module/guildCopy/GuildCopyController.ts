class GuildCopyController extends BaseController{
	private module:GuildCopyModule;
	private guildTeam:GuildTeamController
	public constructor() {
		super(ModuleEnum.GuildCopy);
	}

	protected initView(): BaseModule {
		this.module = new GuildCopyModule(this.moduleId);
		this.guildTeam.setModule(this.module);
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.guildTeam = new GuildTeamController();
	}
	
	protected addListenerOnShow(): void {
		this.guildTeam.addListenerOnShow();
	}

	public hide():void {
		super.hide();
		if(this.guildTeam) {
			this.guildTeam.removeListenerOnHide();
		}
	}
}