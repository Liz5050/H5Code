class ActivityBossModule extends BaseModule {
	private c1:fairygui.Controller;
	private bgLoader:GLoader;
	// private txt_group:fairygui.GTextField;
	private list_boss:List;
	private list_rewards:List;

	private btn_left:fairygui.GButton;
	private btn_right:fairygui.GButton;
	private btnGoto:fairygui.GButton;

	private timeTxt:fairygui.GRichTextField;
	private desTxt:fairygui.GRichTextField;

	private bossInfos:any[];
	private curIndex:number = -1;
	private canGet:boolean = false;
	private activityInfo:ActivityInfo;
	private leftTime:number;
	private curTime:number;
	private timeTitleStr:string = HtmlUtil.html("剩余时间：",Color.Color_7);
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.ActivityBoss2);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.bgLoader = this.getGObject("bg_loader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("vipgift_bg.jpg",PackNameEnum.VipGift));
		// this.txt_group = this.getGObject("txt_group").asTextField;
		this.list_boss = new List(this.getGObject("list_boss").asList);
		this.list_rewards = new List(this.getGObject("list_rewards").asList);
		
		this.timeTxt = this.getGObject("txt_time").asRichTextField;
		this.desTxt = this.getGObject("txt_des").asRichTextField;

		this.btn_left = this.getGObject("btn_left").asButton;
		this.btn_right = this.getGObject("btn_right").asButton;
		this.btnGoto = this.getGObject("btn_goTokill").asButton;
		this.btn_left.addClickListener(this.onBtnClickHandler,this);
		this.btn_right.addClickListener(this.onBtnClickHandler,this);
		this.btnGoto.addClickListener(this.onBtnClickHandler,this);
	}

	public updateAll():void {
		this.activityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeBossTask);
		this.updateActicityInfo();
		ProxyManager.bibleActivity.getDeityBookInfo();
	}

	/**
	 * 活动数据更新
	 */
	public updateActicityInfo():void {
		if(!this.activityInfo) return;
		if(this.desTxt) {
			this.desTxt.text = HtmlUtil.html(this.activityInfo.context,Color.Color_8);
		}
		this.leftTime = this.activityInfo.leftTime;
		if(this.timeTxt) {
			this.timeTxt.text = this.timeTitleStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_1);
			if(this.leftTime > 0) {
				if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
					this.curTime = egret.getTimer();
					App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
				}
			}
			else {
				this.timeTxt.text = "活动已结束";
			}
		}
	}

	public updateRewardInfo():void {
		this.bossInfos = CacheManager.activity.bossInfos;
		if(!this.bossInfos || this.bossInfos.length == 0) return;
		let index:number = -1;
		let canGetIndex:number = -1;
		for(let i:number = 0; i < this.bossInfos.length; i++) {
			if(this.bossInfos[i].status_I == EDeityBookStatus.EDeityBookStatusComplete && canGetIndex == -1) {
				canGetIndex = i;
				break;
			}
			if(this.bossInfos[i].status_I == EDeityBookStatus.EDeityBookStatusNotComplete && index == -1) {
				index = i;
			}
		}
		if(canGetIndex != -1) {
			index = canGetIndex;
		}
		else if(index < 0) {
			index = 0;
		}
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		if(this.curIndex != -1) {

		}
		this.curIndex = index;
		this.c1.selectedIndex = index == 0 ? 0 : 1;
		let info:any = this.bossInfos[this.curIndex];
		// this.txt_group.text = "" + info.index_I;
		let targetCfg:any = ConfigManager.mgDeityBookTarget.getByPk(info.index_I);
		let bossStates:any[] = [];
		let bossList:string[] = targetCfg.contentEx.split("#");
		for(let i:number = 0; i < bossList.length; i++) {
			if(bossList[i] == "") continue;
			let bossCode:number = Number(bossList[i].split(",")[1]);
			bossStates.push({"bossCode" : bossCode,"group" : this.curIndex});
		}
		this.list_boss.data = bossStates;
		let rewardStr:string[] = targetCfg.rewardStr.split("#");
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardStr.length; i++) {
			if(rewardStr[i] == "") continue;
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.list_rewards.data = itemDatas;
		this.canGet = false;
		
		if(info.status_I == EDeityBookStatus.EDeityBookStatusHadEnd) {
			this.btnGoto.title = LangActivity.LANG9;
			this.btnGoto.getController("c1");
			App.DisplayUtils.grayButton(this.btnGoto, true, true);
		}
		else {
			if(info.status_I == EDeityBookStatus.EDeityBookStatusNotComplete) {
				//未达成
				this.btnGoto.title = LangActivity.LANG10;
				App.DisplayUtils.grayButton(this.btnGoto, false, false);
			}
			else {
				//可领取
				this.btnGoto.title = LangActivity.LANG2;
				App.DisplayUtils.grayButton(this.btnGoto, false, false);
				this.canGet = true;
			}
		}
		CommonUtils.setBtnTips(this.btnGoto,this.canGet);
		this.btn_left.visible = this.curIndex - 1 >= 0;
		this.btn_right.visible = this.curIndex + 1 < this.bossInfos.length;
	}

	private onBtnClickHandler(evt:egret.TouchEvent):void {
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let index:number;
		switch(btn) {
			case this.btn_left:
				index = this.curIndex - 1;
				this.setIndex(index);
				break;
			case this.btn_right:
				index = this.curIndex + 1;
				this.setIndex(index);
				break;
			case this.btnGoto:
				if(this.canGet) {
					let page:number = CacheManager.activity.currentPage;
					if(!page) return;
					MoveMotionUtil.itemListMoveToBag(this.list_rewards.list._children,0,LayerManager.UI_Popup);
					ProxyManager.bibleActivity.getDeityBookTargetReward(page, this.bossInfos[this.curIndex].index_I);
				}
				else {
					//前往击杀
					let param:any = {tabType:PanelTabType.WorldBoss};
					if(this.curIndex == 0) {
						param.tabType = PanelTabType.PersonalBoss;
						let pageInfo:any[] = this.list_boss.data;
						for(let i:number = 0; i < pageInfo.length; i++) {
							let info:any = CacheManager.activity.bossInfos[pageInfo[i].group];
							if(info.processDetail.data_I.indexOf(pageInfo[i].bossCode) == -1 && info.status_I == EDeityBookStatus.EDeityBookStatusNotComplete) {
								param.bossCode = pageInfo[i].bossCode;
								break;
							}
						}
					}
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,param,ViewIndex.Two);
				}
				break;
		}
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0){
			this.removeTimer();
			this.timeTxt.text = "活动已结束";
			return;
		}
		this.timeTxt.text = this.timeTitleStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_1);
	}

	private removeTimer():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}

	public hide():void {
		super.hide();
		this.removeTimer();
		this.curIndex = -1;
	}
}