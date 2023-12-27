class MountChangePanel extends ShapeBaseChangePanel{

	public constructor() {
		super();
        this.eShape = EShape.EShapeMount;
	}

	public initOptUI():void{
		super.initOptUI();
		// this.modelBody.x = 20;
        // this.modelBody.y = 5;

	}

	public updateModel(): void{
		let showModelId: number = this.curData.cfg.modelId;
		this.model.setData(showModelId);
        this.changeBtnController.selectedIndex = CacheManager.shape.isChangedModel(this.curData.cfg.shape, showModelId, this.roleIndex)?1:0;
		this.nameLoader.load(URLManager.getModuleImgUrl(this.curData.change + ".png", PackNameEnum.MountChange));
	}

    public getShapeChangeCache() : ShapeBaseChangeCache {
        return CacheManager.mountChange;
    }
}