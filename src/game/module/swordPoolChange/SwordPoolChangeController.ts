/**
 * 法阵幻形
 */

class SwordPoolChangeController extends ShapeBaseChangeController{
    
	public constructor() {
		super(ModuleEnum.SwordPoolChange);
		this.viewIndex = ViewIndex.Two;
		this.modelName = ModuleEnum.SwordPoolChange;
	}

    public initView(): BaseGUIView{
		this.module = new SwordPoolChangeModule();
		return this.module;
	}

}