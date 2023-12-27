class BossComingModule extends BaseModule {
	private c1:fairygui.Controller;
	private loader_bg:GLoader;
	private txt_bossName:fairygui.GTextField;
	private btn_bossLink:fairygui.GButton;
	private progressBar:fairygui.GProgressBar;
	private txt_refreshTime:fairygui.GTextField;

	private list_reward:List;
	private list_bossName:List;

	private btn_challange:fairygui.GButton;
	private btn_des:fairygui.GButton;
	// private btnMc:UIMovieClip;

	private curIndex:number = -1;
	private curSelectData:any;
	private bossComingInfo:any;

	private bossMc:RpgMovieClip;
	private mcContainer:egret.DisplayObjectContainer;
	private gameBossCfg:any;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.BossComing);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.BossComing));
		this.txt_bossName = this.getGObject("txt_bossName").asTextField;
		this.btn_bossLink = this.getGObject("btn_bossLink").asButton;
		this.btn_bossLink.addClickListener(this.openBossHandler,this);
		this.progressBar = this.getGObject("progressBar").asProgress;
		this.progressBar.max = 3;
		this.progressBar.value = 1;
		this.txt_refreshTime = this.getGObject("txt_refreshTime").asTextField;

		this.list_reward = new List(this.getGObject("list_reward").asList);
		this.list_bossName = new List(this.getGObject("list_bossName").asList);
		this.list_bossName.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBossChange,this);
		
		this.btn_challange = this.getGObject("btn_challange").asButton;
		this.btn_challange.addClickListener(this.onEnterCopyHandler,this);
		this.btn_des = this.getGObject("btn_des").asButton;
		this.btn_des.addClickListener(this.openDesHandler,this);

		this.bossMc = ObjectPool.pop("RpgMovieClip");
		this.mcContainer = this.getGObject("bossMc_container").asCom.displayListContainer;
		this.mcContainer.addChild(this.bossMc);

		// this.btnMc = UIMovieManager.get(PackNameEnum.MCCommonButton);
		// let btnMc_container:fairygui.GComponent = this.getGObject("btnMc_container").asCom;
        // btnMc_container.addChild(this.btnMc);
        // this.btnMc.visible = this.btnMc.playing = false;
        // this.btnMc.scaleX = this.btnMc.scaleY = 1;
	}

	public updateAll(data:any = null):void {
		let index:number = 0;
		let list:any[] = ConfigManager.mgGameBoss.getBossComingCfgList();
		this.list_bossName.data = list;
		if(data) {
			let bossComing:any = data.bossComingCfg;
			index = list.indexOf(bossComing);
			if(index == -1) index = 0;
		}
		this.list_bossName.scrollToView(index);
		this.setIndex(index);
	}

	public updateBossState():void {
		this.clearCurIndex();
		this.updateAll();
	}

	private onSelectBossChange():void {
		let index:number = this.list_bossName.selectedIndex;
		this.setIndex(index);
	}
	
	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		let item:BossComingItem;
		if(this.curIndex != -1) {
			item = this.list_bossName.list.getChildAt(this.curIndex) as BossComingItem;
			item.btnSelected = false;
			this.bossMc.reset();
		}
		this.curIndex = index;
		item = this.list_bossName.list.getChildAt(this.curIndex) as BossComingItem;
		item.btnSelected = true;
		
		this.curSelectData = item.getData();
		let bossCfg:any = ConfigManager.boss.getByPk(this.curSelectData.bossCode);
		let needKillBoss:any = ConfigManager.boss.getByPk(this.curSelectData.needBossCode);
		this.gameBossCfg = ConfigManager.mgGameBoss.getByPk(this.curSelectData.bossCode);
		this.bossComingInfo = CacheManager.bossNew.getBossComingInfo(this.curSelectData.bossCode);

		let levelStr:string;
		levelStr = `(${ConfigManager.boss.getBossLevelStr(needKillBoss, true)})`;
		this.txt_bossName.text = bossCfg.name + levelStr;
		this.btn_bossLink.title = "<u>" + needKillBoss.name + "</u>";
		this.list_reward.data = RewardUtil.getRewards(this.gameBossCfg.showReward);

		this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(), bossCfg.modelId, AvatarType.Monster, ELoaderPriority.UI_EFFECT);
        this.bossMc.gotoAction(Action.Stand,Dir.BottomLeft);
		if(bossCfg.modelScale > 0 && bossCfg.modelScale != 100) {
			this.mcContainer.scaleX = this.mcContainer.scaleY = bossCfg.modelScale / 100;
		}
		this.updateBossComingInfo();
	}

	public updateBossComingInfo():void {
		let needKillCount:string[] = this.curSelectData.killBossCounts.split(",");
		let killIndex:number = 0;
		let kills:number = 0;
		let refreshTime:number = CacheManager.serverTime.getServerTime() + this.curSelectData.refreshInterval;
		if(this.bossComingInfo) {
			killIndex = this.bossComingInfo.beKilledTimes_I > 0 ? this.bossComingInfo.beKilledTimes_I : 0;
			if(killIndex >= needKillCount.length) {
				killIndex = needKillCount.length - 1;
			}
			kills = this.bossComingInfo.progress_I;
			refreshTime = this.bossComingInfo.refreshDt_DT;
		}
		this.progressBar.max = Number(needKillCount[killIndex]);
		this.progressBar.value = kills;
		this.txt_refreshTime.text = App.StringUtils.substitude(LangBoss.L6,App.DateUtils.formatDate(refreshTime,DateUtils.FORMAT_CN_Y_M_D_HH_MM_SS));
		this.c1.selectedIndex = CacheManager.bossNew.isBossComingCd(this.curSelectData.bossCode) ? 0 : 1;
		if(this.c1.selectedIndex == 1) {
			// this.btnMc.setPlaySettings(0,-1,-1);
			// this.btnMc.visible = this.btnMc.playing = true;
			App.DisplayUtils.addBtnEffect(this.btn_challange,true);
		}
		else {
			// this.btnMc.visible = this.btnMc.playing = false;
			App.DisplayUtils.addBtnEffect(this.btn_challange,false);
		}
	}

	private openBossHandler():void {
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:PanelTabType.WorldBoss},ViewIndex.Two);
	}

	private openDesHandler():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangBoss.LANG5});
	}

	private onEnterCopyHandler():void {
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
		if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
            return;
        }
		ProxyManager.boss.reqEnterBossCopy(this.gameBossCfg.copyCode,this.gameBossCfg.mapId);
	}

	private clearCurIndex():void {
		if(this.curIndex != -1) {
			let item:BossComingItem = this.list_bossName.list.getChildAt(this.curIndex) as BossComingItem;
			item.btnSelected = false;
			this.bossMc.reset();
			this.curIndex = -1;
			this.curSelectData = null;
			this.bossComingInfo = null;
			// this.btnMc.visible = this.btnMc.playing = false;
			App.DisplayUtils.addBtnEffect(this.btn_challange,false);
		}
	}

	public hide():void {
		super.hide();
		this.clearCurIndex();
	}
}