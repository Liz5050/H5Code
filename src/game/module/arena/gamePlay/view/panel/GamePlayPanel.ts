class GamePlayPanel extends BaseTabView {
	private list:List;
	private loader_bg:GLoader;
	public constructor() {
		super();
	}

	protected initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("bg2.jpg",PackNameEnum.Team));
		this.list = new List(this.getGObject("list_item").asList);
	}

	public addListenerOnShow(): void {
		EventManager.dispatch(LocalEventEnum.HideActivityWarTips);
    }

	public updateAll():void {
		this.list.data = ConfigManager.gamePlay.allCfgs;
	}
}