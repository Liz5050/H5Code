/**
 * 法阵幻形
 */

class ShapeBattleChangeModule  extends ShapeBaseChangeModule{


    public constructor() {
		super(ModuleEnum.ShapeBattleChange, PackNameEnum.ShapeBattleChange);
		this.shapeName = "战阵";
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.ShapeBattleChange]:["BattleArrayChangePanel",ShapeBattleChangePanel],
		};
	}

	public clickDesc(): void {
		let desc: string = LangShapeBase.LANG7;
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}

	public getChangeCache() : ShapeBaseChangeCache {
		return CacheManager.battleArrayChange;
	}

	public getShapeCache() : ShapeBaseCache {
		return CacheManager.battleArray;
	}

	
}
