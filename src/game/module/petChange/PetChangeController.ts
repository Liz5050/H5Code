class PetChangeController extends BaseController{
	private module: PetChangeModule;

	public constructor() {
		super(ModuleEnum.PetChange);
		this.viewIndex = ViewIndex.Two;
	}
	public initView(): BaseGUIView{
		this.module = new PetChangeModule();
		return this.module;
	}

	public addListenerOnInit():void{
		this.addListen0(LocalEventEnum.ShapeListUpdate, this.onShapeUpdate, this);
		this.addListen0(LocalEventEnum.ShapeUpdate, this.onShapeUpdate, this);
		this.addListen0(LocalEventEnum.ShapeUpgradeChangeEx, this.onShapeUpgradeChangeEx, this);
	}

	public addListenerOnShow():void{
		this.addListen1(LocalEventEnum.ShapeChangeModelSuccess, this.onShapeChangeModelSuccess, this);
		this.addListen1(LocalEventEnum.ShapeChangeModelCancelSuccess, this.onShapeChangeModelCancelSuccess, this);
		this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChangeHandler, this);
	}

	/**更新外形 */
	private onShapeUpdate(): void {
		if(this.module && this.module.isShow){
			this.module.updatePetChangePanel();
		}
	}

	/**升阶（祝福值） */
	private onShapeUpgradeChangeEx(data: any): void{
		if(data.result && data.shape == EShape.EShapePet){
			Tip.showTip("升星成功");
		}
		if(this.module && this.module.isShow){
			this.module.petChangeUpgrade(data);
		}
	}

	/**
	 * 幻化模型成功
	 */
	private onShapeChangeModelSuccess(data: any): void {
		this.module.onChangeModelSuccess();
	}

	/**
	 * 取消幻化模型成功
	 */
	private onShapeChangeModelCancelSuccess(data: any): void {
		this.module.onChangeModelSuccess();
	}

	/**道具背包发生改变 */
	private onPropPackChangeHandler(): void {
		this.module.onPropPackChange();
	}
}