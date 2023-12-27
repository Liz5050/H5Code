/**
 * 法阵幻形
 */

class MagicWingChangeController extends ShapeBaseChangeController{
    
	public constructor() {
		super(ModuleEnum.MagicWingChange);
		this.viewIndex = ViewIndex.Two;
		this.modelName = ModuleEnum.MagicWingChange
	}

    public initView(): BaseGUIView{
		this.module = new MagicWingChangeModule();
		return this.module;
	}

}