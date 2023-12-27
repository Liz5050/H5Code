class MountChangeController extends ShapeBaseChangeController{
    
	public constructor() {
		super(ModuleEnum.MountChange);
		this.viewIndex = ViewIndex.Two;
		this.modelName = ModuleEnum.MountChange;
	}

    public initView(): BaseGUIView{
		this.module = new MountChangeModule();
		return this.module;
	}

}