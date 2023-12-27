/**
 * 法阵幻形
 */

class ShapeBattleChangeController extends ShapeBaseChangeController{


    public constructor() {
		super(ModuleEnum.ShapeBattleChange);
		this.viewIndex = ViewIndex.Two;
		this.modelName = ModuleEnum.ShapeBattleChange;
	}

    public initView(): BaseGUIView{
		this.module = new ShapeBattleChangeModule();
		return this.module;
	}



}