class ActivityWarfareOpenView extends BaseContentView {
	private loader_bg:GLoader;
	private loader_icon:GLoader;
	private btn_go:fairygui.GButton;
	private txt_time:fairygui.GTextField;
	// private txt_title:fairygui.GTextField;
	private gamePlayCfg:any;
	public constructor() {
		super(PackNameEnum.GamePlay,"ActivityWarfareOpenView",null,LayerManager.UI_Tips);
		this.isDestroyOnHide = true;
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("refreshBg.png",PackNameEnum.Boss));
		this.loader_icon = this.getGObject("loader_icon") as GLoader;
		this.btn_go = this.getGObject("btn_go").asButton;
		this.btn_go.addClickListener(this.onOpenGamePlayHandler,this);
		this.txt_time = this.getGObject("txt_time").asTextField;
		// this.txt_title = this.getGObject("txt_title").asTextField;
		this.getGObject("btn_close").asButton.addClickListener(this.hide,this);
	}

	public updateAll(iconId:number):void {
		let activeType:EActiveType;
		let isInCopy:boolean = false;
		if(iconId == IconResId.TimeLimitBoss) {
			activeType = EActiveType.EActiveTypeWorlBoss;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss);
		}
		else if(iconId == IconResId.CampBattle) {
			activeType = EActiveType.EActiveTypeBattleBich;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich);
		}
		else if(iconId == IconResId.ExpPositionOccupy) {
			activeType = EActiveType.EActiveTypePosition;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition);
		}
		else if(iconId == IconResId.CrossStair) {
			activeType = EActiveType.EActiveTypeCrossStair;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossStair);
		}else if(iconId == IconResId.GuildDefend){
			activeType = EActiveType.EActiveTypeMgGuildDefense;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense);
		}
		else if(iconId == IconResId.GuildBattle) {
			activeType = EActiveType.EActiveTypeMgNewGuildWar;
			isInCopy = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar);
		}
		this.gamePlayCfg = ConfigManager.gamePlay.getByPk(activeType);
		if(!activeType || isInCopy || !this.gamePlayCfg) {
			this.hide();
			return;
		}
		this.loader_icon.load(URLManager.getPackResUrl(PackNameEnum.HomeIcon,iconId + ""));
		// this.txt_title.text = gamePlayCfg.activeName;
		this.txt_time.text = this.gamePlayCfg.openDt;
	}

	private onOpenGamePlayHandler():void {
		if(!this.gamePlayCfg) return;
		if(this.gamePlayCfg.activeType == EActiveType.EActiveTypeMgNewGuildWar) {
			if (CacheManager.guildNew.isJoinedGuild()) {
				EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildBattle);
			} 
			else {
				EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin,true);
			}
		}
		else {
			EventManager.dispatch(LocalEventEnum.GamePlayWindowOpen,this.gamePlayCfg);
		}
	}
}