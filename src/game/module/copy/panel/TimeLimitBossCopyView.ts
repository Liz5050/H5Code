class TimeLimitBossCopyView extends BaseCopyPanel {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private c3:fairygui.Controller;
	private guideTip: GuideTip;
	private mc_container:fairygui.GComponent;
	
	private rewardBtn: fairygui.GButton;
	private leftTimeTxt:fairygui.GRichTextField;
	private txt_myScore:fairygui.GTextField;
	private txt_first_name:fairygui.GTextField;
	private txt_first_score:fairygui.GTextField;
	private list_rank:List;
	private btn_switch:fairygui.GButton;

	private btn_addBuff:fairygui.GButton;
	private txt_buff_count:fairygui.GRichTextField;
	private txt_buff_value:fairygui.GTextField;
	private txt_buff_percent:fairygui.GTextField;
	private txt_buff_nextValue:fairygui.GTextField;
	private txt_buff_nextPercent:fairygui.GTextField;
	private txt_cost:fairygui.GTextField;
	private btn_drop:fairygui.GButton;
	private txt_dropTime:fairygui.GTextField;

	private betterMc:UIMovieClip;

	private leftTime:number;
	private curTime:number;
	private timeTxtStr:string;
	private timer:egret.Timer;
	private dropTime:number = 20;
	private dropCurTime:number;
	private timeIndex:number = -1;

	private showTips:number = 0;
	public constructor(info: any) {
		super(info, "TimeLimitBossCopyView");
		this.isCenter = true;
		this.isShowBossReward = true;
	}

	public initOptUI(): void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.c3 = this.getController("c3");
		this.leftTimeTxt = this.getGObject("txt_time").asRichTextField;
		this.txt_myScore = this.getGObject("txt_myScore").asTextField;
		this.txt_first_name = this.getGObject("txt_first_name").asTextField;
		this.txt_first_score = this.getGObject("txt_first_score").asTextField;

		this.list_rank = new List(this.getGObject("list_rank").asList);

		// this.rewardBtn = this.getGObject("btn_reward").asButton;
		// this.rewardBtn.addClickListener(this.onOpenRewardHandler, this);
		this.btn_switch = this.getGObject("btn_switch").asButton;

		this.btn_addBuff = this.getGObject("btn_addBuff").asButton;
		this.btn_addBuff.addClickListener(this.onAddBuffHandler,this);
		this.txt_buff_count = this.getGObject("txt_buff_count").asRichTextField;
		this.txt_buff_value = this.getGObject("txt_buff_value").asTextField;
		this.txt_buff_percent = this.getGObject("txt_buff_percent").asTextField;
		this.txt_buff_nextValue = this.getGObject("txt_buff_nextValue").asTextField;
		this.txt_buff_nextPercent = this.getGObject("txt_buff_nextPercent").asTextField;
		this.txt_cost = this.getGObject("txt_cost").asTextField;

		this.btn_drop = this.getGObject("btn_drop").asButton;
		this.btn_drop.addClickListener(this.onPickUpDropHandler,this);
		let dropBg:GLoader = this.getGObject("loader_dropBg") as GLoader;
		dropBg.load(URLManager.getModuleImgUrl("bossDropBg.png",PackNameEnum.Boss));
		let dropIcon:GLoader = this.btn_drop.getChild("icon") as GLoader;
		let itemCfg:any = ConfigManager.item.getByPk(40245001);
		dropIcon.load(URLManager.getIconUrl(itemCfg.icon,URLManager.ITEM_ICON));
		this.txt_dropTime = this.getGObject("txt_dropTime").asTextField;

		this.betterMc = UIMovieManager.get(PackNameEnum.MCInnerPowerBig);
		this.mc_container = this.getGObject("mc_container").asCom;
		this.mc_container.addChild(this.betterMc);
		this.betterMc.visible = false;
		this.betterMc.playing = false;

		this.timeTxtStr = HtmlUtil.html("活动剩余时间：",Color.Color_7);
		this.XPSetBtn.visible = true;
	}

	protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.TimeLimitBossShowDropBtn,this.onShowDropBtn,this);
		this.addListen1(LocalEventEnum.TimeLimitBossBetterEffect,this.onShowBetterEffect,this);
		// TimeLimitBossShowDropBtn
	}

	public updateAll():void {
		super.updateAll();
		this.btn_switch.selected = true;
		this.c1.selectedIndex = 1;
		this.onTimelimitBossUpdate();
		this.updateHurtList();
		this.updateBuff();
		this.onShowDropBtn();
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime) / 1000);
		this.curTime = time;
		if(this.leftTime <= 0) {
			this.removeTimer();
			return;
		}
		this.leftTimeTxt.text = this.timeTxtStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
	}

	private removeTimer():void {
		// App.TimerManager.remove(this.onTimerUpdate,this);
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		this.leftTimeTxt.text = "";
		if(this.timer) this.timer.stop();
	}

	public onTimelimitBossUpdate():void {
		this.leftTime = CacheManager.timeLimitBoss.leftTime;
		if(this.leftTime > 0) {
			this.leftTimeTxt.text = this.timeTxtStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
			if(this.timeIndex == -1) {
				this.curTime = egret.getTimer();
				this.timeIndex = egret.setInterval(this.onTimerUpdate,this,1000);
			}
			// if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
			// 	this.curTime = egret.getTimer();
			// 	App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			// }
		}
	}

	public updateHurtList():void {
		this.txt_myScore.text = CacheManager.timeLimitBoss.myScore;
		let firstHurt:any = CacheManager.timeLimitBoss.firstHurt;
		if(firstHurt) {
			this.txt_first_name.text = firstHurt.name_S + "：";
			this.txt_first_score.text = App.MathUtils.formatNum64(Number(firstHurt.hurt_L64),false);
		}
		else {
			this.txt_first_name.text = "";
			this.txt_first_score.text = "";
		}
		this.list_rank.data = CacheManager.timeLimitBoss.hurtList;
	}

	public updateBuff():void {
		let buffCfg:any = ConfigManager.worldBossBuff.getCurBuffCfg();
		let buffNextCfg:any = ConfigManager.worldBossBuff.getNextBuffCfg();
		let buffInfo:any = CacheManager.timeLimitBoss.buffInfo;
		let addCount:number = 0;
		if(buffInfo) {
			addCount = buffInfo.coinInspireNum_I + buffInfo.goldInspireNum_I;
		}
		this.txt_buff_count.text = "鼓舞次数：" + HtmlUtil.html(addCount + "/" + ConfigManager.worldBossBuff.configLength,Color.Color_6);
		let curAdd1:number = 0;
		let curAdd2:number = 0;
		if(buffCfg) {
			curAdd1 = buffCfg.effect1;
			curAdd2 = buffCfg.effect2;
		}
		let nextAdd1:string = "";
		let nextAdd2:string = "";
		let cost:number = 0;
		if(buffNextCfg) {
			nextAdd1 = App.StringUtils.substitude(LangBoss.L9,(buffNextCfg.effect1 - curAdd1));
			nextAdd2 = App.StringUtils.substitude(LangBoss.L9,(buffNextCfg.effect2 - curAdd2)) + "%";
			cost = buffNextCfg.cost;
			this.c2.selectedIndex = buffNextCfg.type - 1;
			this.txt_cost.text = buffNextCfg.cost + "";
			this.txt_buff_value.align = fairygui.AlignType.Left;
			this.txt_buff_percent.align = fairygui.AlignType.Left;
		}
		else {
			this.txt_cost.text = "0";
			this.txt_buff_value.align = fairygui.AlignType.Center;
			this.txt_buff_percent.align = fairygui.AlignType.Center;
		}
		this.txt_buff_value.text = App.StringUtils.substitude(LangBoss.L10,curAdd1);
		this.txt_buff_percent.text = App.StringUtils.substitude(LangBoss.L11,curAdd2);
		this.txt_buff_nextValue.text = nextAdd1;
		this.txt_buff_nextPercent.text = nextAdd2;
	}

	private onAddBuffHandler():void {
		EventManager.dispatch(LocalEventEnum.TimeLimitBossAddBuff);
	}

	/**打开奖励界面 */
	public onOpenRewardHandler(): void {
		EventManager.dispatch(UIEventEnum.TimeLimitBossRewardOpen);
	}

	private onShowDropBtn():void {
		let dropInfo:any = CacheManager.timeLimitBoss.dropInfo;
		this.c3.selectedIndex = dropInfo != null ? 1 : 0;
		if(!this.timer) {
			this.timer = new egret.Timer(1000);
			this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerUpdate2,this);
		}
		if(dropInfo) {
			this.dropCurTime = egret.getTimer();
			this.dropTime = dropInfo.leftTime_I - Math.round((egret.getTimer() - dropInfo.updateTime) / 1000);
			this.txt_dropTime.text = "点击拾取奖励（" + this.dropTime + "S）";
			this.timer.start();
			this.showGuideTip();
		}
	}

	private onTimerUpdate2():void {
		let time:number = egret.getTimer();
		this.dropTime -= Math.round((time - this.dropCurTime) / 1000);
		this.dropCurTime = time;
		this.txt_dropTime.text = "点击拾取奖励（" + this.dropTime + "S）";
		if(this.dropTime <= 0) {
			this.timer.stop();
			this.c3.selectedIndex = 2;
			return;
		}
	}

	private onShowBetterEffect():void {
		this.betterMc.setPlaySettings(0,-1,1,-1,function(){
			this.betterMc.visible = false;
			this.betterMc.playing = false;
		},this);
		this.betterMc.playing = this.betterMc.visible = true;
	}

	private showGuideTip():void {
		if(!this.guideTip) {
			this.guideTip = <GuideTip>FuiUtil.createComponent(PackNameEnum.Common, "GuideTip", GuideTip);
			this.guideTip.setXY(230,290);
			this.guideTip.direction = GuideArrowDirection.Left;
			this.guideTip.touchable = false;
			this.guideTip.tip = "点击拾取奖励";
		}
		this.mc_container.addChild(this.guideTip);
	}

	private hideGuideTip():void {
		if(this.guideTip) {
			this.guideTip.destroy();
			this.guideTip = null;
		}
	}

	/**
	 * 拾取掉落
	 */
	private onPickUpDropHandler():void {
		this.hideGuideTip();
		ProxyManager.boss.pickUpDrop();
	}

	public hide():void {
		super.hide();
		this.removeTimer();
		this.txt_first_name.text = "";
		this.txt_first_score.text = "";
		this.txt_myScore.text = "0";
		CacheManager.timeLimitBoss.updateDropInfo(null);
		this.hideGuideTip();
	}
}