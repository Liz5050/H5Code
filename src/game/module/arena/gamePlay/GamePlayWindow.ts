class GamePlayWindow extends BaseWindow {
	private loader_bg:GLoader;
	private txt_explain:fairygui.GRichTextField;
	private list_reward:List;
	private btn_enter:fairygui.GButton;
	private gamePlayCfg:any;
	private btnMc:UIMovieClip;
	public constructor(moduleId:ModuleEnum) {
		super(PackNameEnum.GamePlay,"GamePlayWindow",moduleId);
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.txt_explain = this.getGObject("txt_explain").asRichTextField;
		this.list_reward = new List(this.getGObject("list_reward").asList);
		this.btn_enter = this.getGObject("btn_enter").asButton;
		this.btn_enter.addClickListener(this.onEnterHandler,this);
		let btnMcContainer:fairygui.GComponent = this.getGObject("mc_btnContainer").asCom;
		this.btnMc = UIMovieManager.get(PackNameEnum.MCCommonButton);
        btnMcContainer.addChild(this.btnMc);
        this.btnMc.visible = this.btnMc.playing = false;
	}

	public updateAll(gamePlayCfg:any):void {
		this.gamePlayCfg = gamePlayCfg;
		let isOpen:boolean = true;
		if(this.gamePlayCfg.activeType == EActiveType.EActiveTypeBattleBich) {
			isOpen = CacheManager.campBattle.isOpen;
		}
		else if(this.gamePlayCfg.activeType == EActiveType.EActiveTypePosition){
			isOpen = CacheManager.posOccupy.isOpen;
		}
		else if(this.gamePlayCfg.activeType == EActiveType.EActiveTypeCrossStair){
			isOpen = CacheManager.crossStair.isOpen;
		}
		this.list_reward.data = RewardUtil.getStandeRewards(this.gamePlayCfg.rewards);
		this.txt_explain.text = HtmlUtil.br(this.gamePlayCfg.desc);
		this.title = this.gamePlayCfg.activeName;
		this.loader_bg.load(URLManager.getModuleImgUrl("gamePlay/bg_" + this.gamePlayCfg.activeType + ".jpg",PackNameEnum.Arena));
		this.btnMc.visible = this.btnMc.playing = isOpen;
	}

	private onEnterHandler():void {
		EventManager.dispatch(LocalEventEnum.EnterGamePlay,this.gamePlayCfg.activeType);
	}

	public hide():void {
		super.hide();
		this.btnMc.visible = this.btnMc.playing = false;
	}
}