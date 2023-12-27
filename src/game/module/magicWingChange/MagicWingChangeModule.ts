/**
 * 翅膀幻形
 */

class MagicWingChangeModule  extends ShapeBaseChangeModule{
	public constructor() {
		super(ModuleEnum.MagicWingChange, PackNameEnum.MagicWingChange);
		this.shapeName = "翅膀";
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.MagicWingChange]:["MagicWingChangePanel",MagicWingChangePanel],
		};
	}

	public getChangeCache() : ShapeBaseChangeCache {
		return CacheManager.shapeWingChange;
	}

	public getShapeCache() : ShapeBaseCache {
		return CacheManager.shapeWing;
	}

	public clickDesc(): void {
		let desc: string = LangShapeBase.LANG23;
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}



}
