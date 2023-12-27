/**
 * 战阵幻形（2018.10.22）
 */
class ShapeBattleChangePanel extends ShapeBaseChangePanel{


    public constructor() {
		super();
        this.eShape = EShape.EShapeBattle;
	}
	public updateModel(): void{
		let showModelId: number = this.curData.cfg.modelId;
		this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId, this.roleIndex)?1:0;
		this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.ShapeBattle));
	}

    public getShapeChangeCache() : ShapeBaseChangeCache {
        return CacheManager.battleArrayChange;
    }
}