class ForgeController extends BaseController {
	private module: ForgeModule;



	public constructor() {
		super(ModuleEnum.Forge);
	}

	public initView(): BaseModule {
		this.module = new ForgeModule();
		return this.module;
	}

	public addListenerOnInit(): void {

	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpdated, this);
		this.addListen1(NetEventEnum.CultivateInfoUpdateImmortal,this.onImmortalUpdate,this);

		this.addListen1(LocalEventEnum.CheckPointUpdate,this.onCheckPointUpdate,this);
	}


	/**
	 * 道具背包更新
	 */
	private packPosTypePropChange(): void {
		this.module.onPropUpdate();
	}

	/**
	 * 强化信息更新了
	 */
	private onPlayerStrengthenExUpdated(info: SUpgradeStrengthenEx): void {
		if (info != null) {
			this.module.onStrengthenExUpdated(info);
		}
	}
	
	private onImmortalUpdate():void{
		this.module.onImmortalUpdate();
	}

	private onCheckPointUpdate():void{
		this.module.onCheckPointUpdate();
	}

	public setModuleTitle(title : string) {
		this.module.title = title;
	}



}