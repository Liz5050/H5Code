class FashionControllerII extends BaseController {
	private module:FashionModuleII;
	private titleC:TitleController;
	private playerC:FashionPlayerController;
	public constructor() {
		super(ModuleEnum.FashionII);
	}

	public initView(): BaseModule {
		this.module = new FashionModuleII(this.moduleId);
		this.titleC.module = this.module;
		this.playerC.module = this.module;
		return this.module;
	}

	public addListenerOnInit(): void {
		this.titleC = new TitleController();
		this.titleC.addListenerOnInit();
		this.playerC = new FashionPlayerController();
		this.playerC.addListenerOnInit();
	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChangeHandler, this);
	}

	/**道具背包发生改变 */
	private onPropPackChangeHandler(): void{
		this.module.updateFashionInfo();
	}
}