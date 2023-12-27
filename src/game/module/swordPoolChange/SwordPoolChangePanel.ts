/**
 * 法阵幻形（2018.10.22）
 */
class SwordPoolChangePanel extends ShapeBaseChangePanel{

	public constructor() {
		super();
        this.eShape = EShape.EShapeSwordPool
	}

	public updateModel(): void{
		let showModelId: number = this.curData.cfg.modelId;
		this.model.setData(showModelId*10);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId, this.roleIndex)?1:0;
		this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.SwordPool));
	}

    public getShapeChangeCache() : ShapeBaseChangeCache {
        return CacheManager.swordPoolChange;
    }

}

