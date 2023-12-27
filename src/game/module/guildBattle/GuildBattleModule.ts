class GuildBattleModule extends BaseModule {
	private loaderBg:GLoader;
	private btn_enter:fairygui.GButton;
	private btn_fightDetails:fairygui.GButton;
	private btn_rewardLeader:fairygui.GButton;
	private btn_dayReward:fairygui.GButton;
	private txt_guild:fairygui.GTextField;
	private txt_name:fairygui.GTextField;
	private txt_time:fairygui.GRichTextField;

	private titleMc:MovieClip;
	private playerModel:PlayerModel;
	// private btnMc:UIMovieClip;

	private dayReward:GuildBattleDayReward;
	private ownerReward:GuildBattleOwnerReward;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.GuildBattle);
	}

	public initOptUI():void {
		this.loaderBg = this.getGObject("loader_bg") as GLoader;
		this.loaderBg.load(URLManager.getModuleImgUrl("guildBattleBg.jpg",PackNameEnum.GuildBattle));

		let titleContainer:egret.DisplayObjectContainer = this.getGObject("title_container").asCom.displayListContainer;
		this.titleMc = ObjectPool.pop("MovieClip");
		titleContainer.addChild(this.titleMc);

		let playerContainer:egret.DisplayObjectContainer = this.getGObject("mc_container").asCom.displayListContainer;
		this.playerModel = new PlayerModel([EEntityAttribute.EAttributeClothes,EEntityAttribute.EAttributeWeapon]);
		playerContainer.addChild(this.playerModel);

		this.txt_time = this.getGObject("txt_time").asRichTextField;

		this.txt_guild = this.getGObject("txt_guild").asTextField;
		this.txt_name = this.getGObject("txt_name").asTextField;

		this.btn_fightDetails = this.getGObject("btn_fightDetails").asButton;
		this.btn_fightDetails.addClickListener(this.onOpenRankHandler,this);

		this.btn_rewardLeader = this.getGObject("btn_rewardLeader").asButton;
		this.btn_rewardLeader.addClickListener(this.onOpenOwnerReward,this);

		this.btn_dayReward = this.getGObject("btn_dayReward").asButton;
		this.btn_dayReward.addClickListener(this.onOpenDayReward,this);

		this.btn_enter = this.getGObject("btn_enter").asButton;
		this.btn_enter.addClickListener(this.onEnterBattleHandler,this);

		// let btnMcContainer:fairygui.GComponent = this.getGObject("mc_btnContainer").asCom;
		// this.btnMc = UIMovieManager.get(PackNameEnum.MCOneKey, -5, 0, 1.05);
        // btnMcContainer.addChild(this.btnMc);
        // this.btnMc.visible = this.btnMc.playing = false;

		this.descBtn.visible = true;
	}

	public updateAll():void {
		let openDate:Date = CacheManager.guildBattle.openDate;
		this.txt_time.text = HtmlUtil.colorSubstitude(LangGuildNew.L27,openDate.getMonth() + 1,openDate.getDate(),openDate.getHours());
		this.updateDayRewardState();
		let isOpen:boolean = CacheManager.guildBattle.isOpen;
		// this.btn_fightDetails.visible = !isOpen;
		// this.btnMc.visible = this.btnMc.playing = isOpen;
		App.DisplayUtils.addBtnEffect(this.btn_enter,isOpen);

		this.txt_guild.text = "";
		this.txt_name.text = "虚位以待";
		this.playerModel.reset();
		//this.titleMc.reset();
		this.titleMc.playFile(ResourcePathUtils.getRPGGame() + "title/200069",-1);
		if(!isOpen) {
			let winerInfo:any = CacheManager.guildBattle.winerInfo;
			if(winerInfo) {
				this.txt_guild.text = winerInfo.winGuildName_S;
				this.txt_name.text = winerInfo.leaderName_S;
				
				let fashionCfg:any = ConfigManager.mgFashion.getFashionByItemCode(50010005);
				if(fashionCfg) {
					this.playerModel.updatePlayer(fashionCfg.modelId);
				}
				fashionCfg = ConfigManager.mgFashion.getFashionByItemCode(50020003);
				if(fashionCfg) {
					this.playerModel.updateWeapon(fashionCfg.modelId);
				}
			}
		}
	}

	public updateDayRewardState():void {
		CommonUtils.setBtnTips(this.btn_dayReward,CacheManager.guildBattle.checkTips());
	}

	private onEnterBattleHandler():void {
		if(!CacheManager.guildBattle.isOpen) {
			Tip.showRollTip("活动暂未开启");
			return;
		}
		let mapId:number = CacheManager.guildBattle.nextMapId;
		ProxyManager.guildBattle.enterGuildBattle(mapId);
	}

	private onOpenRankHandler():void {
		EventManager.dispatch(UIEventEnum.GuildBattleRankOpen);
	}

	/**
	 * 盟主奖励
	 */
	private onOpenOwnerReward():void {
		if(!this.ownerReward) {
			this.ownerReward = new GuildBattleOwnerReward();
		}
		this.ownerReward.show();
	}

	/**
	 * 每日奖励
	 */
	private onOpenDayReward():void {
		if(!this.dayReward) {
			this.dayReward = new GuildBattleDayReward();
		}
		this.dayReward.show();
	}

	protected clickDesc():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangGuildNew.L17});
	}

	public hide():void {
		super.hide();
		this.playerModel.reset();
		this.titleMc.reset();
	}
}