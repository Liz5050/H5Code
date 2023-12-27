/**
 * 开启角色
 */
class OpenRoleController extends BaseController {
	private module: OpenRoleModule;

	public constructor() {
		super(ModuleEnum.OpenRole);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseModule {
		this.module = new OpenRoleModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameOpenNewRealRole], this.onOpenNewRole, this);
		this.addListen0(LocalEventEnum.PlayerOpenNewRole, this.openNewRole, this);
		//this.addListen0(LocalEventEnum.VipUpdate, this.updateUI, this);
	}

	public addListenerOnShow() : void {
		this.addListen1(LocalEventEnum.VipUpdate, this.updateUI, this);
		this.addListen1(NetEventEnum.roleLevelUpdate, this.updateUI, this);
		this.addListen1(NetEventEnum.roleCareerChanged, this.updateUI, this);
	}

	/**
	 * 开启新角色
	 */
	private openNewRole(career: ECareer): void {
		ProxyManager.player.openNewRole(career);
	}

	private updateUI() : void {
		this.module.updateAll(false);
	}

	/**
	 * 开启新角色返回
	 * @param data S2C_SOpenNewRealRole
	 */
	private onOpenNewRole(data: any): void {
		/**SRealRole */
		let role: any = data.newRealRole;
		CacheManager.role.roles.push(role);
		CacheManager.role.getEntityInfo(role.index_I).career_SH = role.career_I;
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.OpenRole);
		EventManager.dispatch(LocalEventEnum.PlayerNewRoleUpdated, role);
	}
	public hide(data?: any):void{
		super.hide(data);
		this.viewIndex = ViewIndex.Two;
	}
}