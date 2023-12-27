/**
 * 法阵幻形
 */

class MagicArrayChangeController extends ShapeBaseChangeController{
    
	public constructor() {
		super(ModuleEnum.magicArrayChange);
		this.viewIndex = ViewIndex.Two;
		this.modelName = ModuleEnum.magicArrayChange;
	}

    public initView(): BaseGUIView{
		this.module = new MagicArrayChangeModule();
		return this.module;
	}

}