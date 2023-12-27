class MagicWeaponChangeController extends BaseController{
	private module: MagicWeaponChangeModule;

	public constructor() {
		super(ModuleEnum.MagicWeaponChange);
		this.viewIndex = ViewIndex.Two;
	}
	public initView(): BaseGUIView{
		this.module = new MagicWeaponChangeModule();
		return this.module;
	}

	public addListenerOnInit():void{
		this.addListen0(LocalEventEnum.ShapeListUpdate, this.onShapeUpdate, this);
		this.addListen0(LocalEventEnum.ShapeUpdate, this.onShapeUpdate, this);
	}

	public addListenerOnShow():void{
		this.addListen1(LocalEventEnum.ShapeChangeModelCancelSuccess, this.onShapeChangeModelCancelSuccess, this);
		this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChangeHandler, this);
	}

	/**更新外形 */
	private onShapeUpdate(): void {
		if(this.module && this.module.isShow){
			this.module.updateMagicWeaponChangePanel();
		}
	}

	/**
	 * 幻化/取消幻化模型成功
	 */
	private onShapeChangeModelCancelSuccess(data: any): void {
		this.module.onChangeModelSuccess();
	}

	/**道具背包发生改变 */
	private onPropPackChangeHandler(): void {
		this.module.onPropPackChange();
	}
}