class PlayerOtherController extends BaseController {
	private module:PlayerOtherModule;
	public constructor() {
		super(ModuleEnum.PlayerOther);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseModule {
        this.module = new PlayerOtherModule(this.moduleId);
		return this.module;
    }

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
	}
}