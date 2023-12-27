class UpgradeGuideController extends BaseController{
	private module:UpgradeGuideWindow;

	public constructor() {
        super(ModuleEnum.UpgradeGuide);
    }

    public initView(): BaseGUIView {
        this.module = new UpgradeGuideWindow(this.moduleId);
        return this.module;

    }
}