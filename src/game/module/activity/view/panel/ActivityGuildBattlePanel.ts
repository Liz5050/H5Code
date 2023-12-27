class ActivityGuildBattlePanel extends ActivityBaseTabPanel {
	private loader_bg:GLoader;
	private txt_openTime:fairygui.GRichTextField;
	private list_reward:List;
	private btn_go:fairygui.GButton;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypeMgNewGuildWar;
		this.timeTitleStr = HtmlUtil.html("活动时间：",Color.Color_7);
		this.desTitleStr = "";
	}

	public initOptUI():void {
		super.initOptUI();
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("activity_bg_5.jpg",PackNameEnum.Activity));

		this.txt_openTime = this.getGObject("txt_openTime").asRichTextField;

		this.list_reward = new List(this.getGObject("list_reward").asList,{showGoldEffect:true});
		let cfg:any = ConfigManager.guildBattle.getStaticCfg();
		this.list_reward.data = RewardUtil.getStandeRewards(cfg.winLeaderReward);
		
		this.btn_go = this.getGObject("btn_go").asButton;
		this.btn_go.addClickListener(this.onOpenGuildBattle,this);
	}

	public updateAll():void {
		super.updateAll();
		let openDate:Date = CacheManager.guildBattle.openDate;
		let week:number = openDate.getDay();
		let weekStr:string;
		if(week == 0) {
			weekStr = "日";
		}
		else {
			weekStr = GameDef.NumberName[week];
		}
		this.txt_openTime.text = this.timeTitleStr + (openDate.getMonth() + 1) + "月" + openDate.getDate() + "日" + openDate.getHours() + ":00 - 20:20（周" + weekStr + "）";
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
	}

	private onOpenGuildBattle():void {
		if (CacheManager.guildNew.isJoinedGuild()) {
			EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildBattle,null,ViewIndex.Two);
		} 
		else {
			EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin);
		}
	}
}