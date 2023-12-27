class TimeLimitBossWindow extends BaseWindow {
	private bgLoader:GLoader;
	private txt_name:fairygui.GTextField;
	private list_item:List;
	private btn_des:fairygui.GButton;
	private hpProgressBar:UIProgressBar;
	private btnMc:UIMovieClip;
	public constructor() {
		super(PackNameEnum.TimeLimitBoss,"Main",ModuleEnum.TimeLimitBoss);
	}

	public initOptUI():void {
		this.bgLoader = this.getGObject("loader_bg") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("timeLimitBossBg.jpg",PackNameEnum.Boss));
		this.txt_name = this.getGObject("txt_name").asTextField;
		this.getGObject("btn_enter").asButton.addClickListener(this.onEnterBossHandler,this);
		this.btn_des = this.getGObject("btn_des").asButton;
		this.btn_des.addClickListener(this.onOpenDesHandler,this);
		let btnMcContainer:fairygui.GComponent = this.getGObject("mc_btnContainer").asCom;
		this.btnMc = UIMovieManager.get(PackNameEnum.MCOneKey);
        btnMcContainer.addChild(this.btnMc);
        this.btnMc.visible = this.btnMc.playing = false;


		this.list_item = new List(this.getGObject("list_item").asList,{isShowName:false});
		let codes:number[] = CacheManager.timeLimitBoss.rewardCodes;
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < codes.length; i++) {
			let data:ItemData = new ItemData(codes[i]);
			itemDatas.push(data);
		}
		this.list_item.data = itemDatas;

		this.hpProgressBar = this.getGObject("hp_progressBar") as UIProgressBar;
        this.hpProgressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.TimeLimitBoss,"hp_progressBar"),URLManager.getPackResUrl(PackNameEnum.TimeLimitBoss,"hp_progressBg"),378,36,10,8,UIProgressBarType.Mask);
        this.hpProgressBar.labelType = BarLabelType.Percent;
        this.hpProgressBar.labelSize = 20;
		// this.hpProgressBar.setValue(Number(bossInfo.valEx2_L64),Number(bossInfo.valEx1_L64),true,true);
		this.hpProgressBar.setValue(1,1);
	}

	public updateAll():void {
		let bossCode:number = CacheManager.timeLimitBoss.bossCode;
		let bossCfg:any = ConfigManager.boss.getByPk(bossCode);
		if(bossCfg) {
			this.txt_name.text = bossCfg.name + " Lv." + bossCfg.level;
		}
		// this.hpProgressBar.setValue(1,1);
		if(CacheManager.timeLimitBoss.leftOpenTime <= 0) {
			this.reqBossLife();
			if(!App.TimerManager.isExists(this.reqBossLife,this)) {
				App.TimerManager.doTimer(3000,0,this.reqBossLife,this);
			}
		}
		else {
			this.hpProgressBar.setValue(1,1);
		}
		this.btnMc.visible = this.btnMc.playing = true;
	}

	public updateBossLife(data:any):void {
		this.hpProgressBar.setValue(Number(data.curLife_L64),Number(data.maxLife_L64),true,true);
	}

	private reqBossLife():void {
		ProxyManager.boss.reqTimeLimitBossLife();
	}

	private onEnterBossHandler():void {
		EventManager.dispatch(LocalEventEnum.TimeLimitBossEnter);
	}

	private onOpenDesHandler():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangBoss.LANG1});
	}

	public hide():void {
		super.hide();
		App.TimerManager.remove(this.reqBossLife,this);
		this.btnMc.visible = this.btnMc.playing = false;
	}
}