/**
 * 翅膀控制器
 */
class WingController extends SubController {

	public constructor() {
		super();
	}

	public getModule(): BaseModule {
		return this._module;
	}

	public get module(): ShapeModule {
		return this.getModule() as ShapeModule;
	}

	protected addListenerOnInit(): void {

	}

	public addListenerOnShow(): void {
		this.addListen0(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpgraded, this);
		this.addListen0(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenExUpdated, this);
		this.addListen0(NetEventEnum.PlayerStrengthenExActived, this.onPlayerStrengthenExActived, this);
	}

	/**
	 * 强化成功
	 */
	private onPlayerStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
		this.module.onStrengthenExUpgraded(info);
	}

	/**
	 * 强化更新
	 */
	private onPlayerStrengthenExUpdated(data: any): void {
		this.module.onStrengthenExUpdated(data);
	}

	/**
	 * 激活成功
	 */
	private onPlayerStrengthenExActived(info: SUpgradeStrengthenEx): void {
		this.module.onnStrengthenExActived(info);
		if (info != null) {
			if (info.type == EStrengthenExType.EStrengthenExTypeWing) {
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "翅膀", "model": info.data.info.useModelId, "modelType": EShape.EShapeWing });
			}
		}
	}
}