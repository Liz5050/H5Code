class RuneShopController extends BaseController {
	private module: RuneShopModule;
	public constructor() {
		super(ModuleEnum.RuneShop);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseModule {
		this.module = new RuneShopModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addListen0(NetEventEnum.moneyRuneCoin, this.updateRuneCoin, this);
	}

	public addListenerOnShow(): void {

	}

	/**更新符文碎片 */
	private updateRuneCoin(): void {
		if (this.isShow) {
			this.module.updateAll();
		}
	}
}