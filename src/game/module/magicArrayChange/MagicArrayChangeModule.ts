/**
 * 法阵幻形
 */

class MagicArrayChangeModule  extends ShapeBaseChangeModule{
	public constructor() {
		super(ModuleEnum.magicArrayChange, PackNameEnum.MagicArrayChange);
		this.shapeName = "法阵";
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.MagicArrayChange]:["MagicArrayChangePanel",MagicArrayChangePanel],
		};
	}

	public getChangeCache() : ShapeBaseChangeCache {
		return CacheManager.magicArrayChange;
	}

	public getShapeCache() : ShapeBaseCache {
		return CacheManager.magicArray;
	}

	public clickDesc(): void {
		let desc: string = LangShapeBase.LANG8;
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}

}
