/**
 * 法阵幻形（2018.10.22）
 */
class MagicWingChangePanel extends ShapeBaseChangePanel{

	public constructor() {
		super();
        this.eShape = EShape.EShapeWing;
	}

	public updateModel(): void{
		let showModelId: number = this.curData.cfg.modelId;
		this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId, this.roleIndex)?1:0;
		this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.MagicWingChange));
	}

    public getShapeChangeCache() : ShapeBaseChangeCache {
        return CacheManager.shapeWingChange;
    }

}