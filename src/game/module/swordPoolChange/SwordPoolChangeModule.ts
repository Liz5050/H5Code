/**
 * 法阵幻形
 */

class SwordPoolChangeModule  extends ShapeBaseChangeModule{
	public constructor() {
		super(ModuleEnum.SwordPoolChange, PackNameEnum.SwordPoolChange);
		this.shapeName = "剑池";
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.SwordPoolChange]:["SwordPoolChangePanel",SwordPoolChangePanel],
		};
	}

	public getChangeCache() : ShapeBaseChangeCache {
		return CacheManager.swordPoolChange;
	}

	public getShapeCache() : ShapeBaseCache {
		return CacheManager.swordPool;
	}

	public clickDesc(): void {
		let	desc =	LangShapeBase.LANG9;
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}

}
