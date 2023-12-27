class ArenaController extends BaseController {
	private module:ArenaModule;
	private kingBattleCtrl:KingBattleController;
	private encounterCtrl:EncounterController;
	private miningCtrl:MiningController;
	public constructor() {
		super(ModuleEnum.Arena);
	}

	public initView():BaseModule {
		this.module = new ArenaModule(this.moduleId);
		this.kingBattleCtrl.module = this.module;
		this.encounterCtrl.module = this.module;
		this.miningCtrl.module = this.module;
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.kingBattleCtrl = new KingBattleController();
		this.encounterCtrl = new EncounterController();
		this.miningCtrl = new MiningController();
		this.miningCtrl.addListenerOnInit();
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.copyInfUpdate,this.onCopyInfoUpdate,this);

		EventManager.dispatch(LocalEventEnum.HideBossRefreshTips);
	}

	/**副本信息更新 */
	private onCopyInfoUpdate():void {
		if(this.module && this.module.isShow){
			this.module.onCopyInfoUpdate();
		}
	}
}