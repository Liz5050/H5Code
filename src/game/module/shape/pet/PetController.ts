class PetController extends SubController {
	private petSuitDetailView: PetSuitDetailView;

	public constructor() {
		super();
	}

	public getModule(): BaseModule {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addListen0(UIEventEnum.PetSuitDetailViewOpen, this.petSuitDetailViewOpen, this);

    }

    public addListenerOnShow(): void {

    }

	/**
	 * 打开宠物装备套装详情
	 */
	private petSuitDetailViewOpen(): void {
		if (this.petSuitDetailView == null) {
			this.petSuitDetailView = new PetSuitDetailView();
		}
		this.petSuitDetailView.show();
	}

}