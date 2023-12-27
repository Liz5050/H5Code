class ActivityDayRechargeRewardShow extends BaseWindow {
	private loader_bg:GLoader;
	private loader_txt1:GLoader;
	private loader_txt2:GLoader;
	private loader_icon:GLoader;
	private txt_needRecharge:fairygui.GTextField;
	private list_item:List;
	private btn_recharge:fairygui.GButton;
	private txt_time:fairygui.GTextField;

	private rewardCfg:any;
	private isCanGet:boolean;
	private activityInfo:ActivityInfo;
	private leftTime:number;
	private curTime:number;
	public constructor() {
		super(PackNameEnum.ActivityDayRecharge,"DayRechargeRewardShow",null,LayerManager.UI_Main);
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("dayRechargeBg2.png",PackNameEnum.Activity));
		this.loader_txt1 = this.getGObject("loader_txt1") as GLoader;
		this.loader_txt2 = this.getGObject("loader_txt2") as GLoader;
		this.loader_icon = this.getGObject("loader_icon") as GLoader;
		this.txt_time = this.getGObject("txt_time").asTextField;

		this.txt_needRecharge = this.getGObject("txt_needRecharge").asTextField;
		this.list_item = new List(this.getGObject("list_item").asList);
		this.btn_recharge = this.getGObject("btn_recharge").asButton;
		this.btn_recharge.addClickListener(this.onClickHandler,this);
		this.closeObj.visible = true;
	}

	public updateAll():void {
		this.rewardCfg = ConfigManager.rechargeFirst.getHaveShapeRewardRechargeCfg();
		if(!this.rewardCfg) {
			this.hide();
			return;
		}

		this.activityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeRechargeToday);
		this.leftTime = this.activityInfo.leftTime;
		this.txt_time.text = "剩余时间：" + App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,false);
		if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
			this.curTime = egret.getTimer();
			App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
		}

		let itemDatas:ItemData[] = RewardUtil.getStandeRewards(this.rewardCfg.rewardStr);
		let shapeType:number = 0;
		for(let data of itemDatas) {
			if(ItemsUtil.isShapeUpgradeItem(data)) {
				if(ItemsUtil.isWingUpItem(data)) {
					shapeType = 1;
				}
				else if(ItemsUtil.isDragonScaleUpItem(data)) {
					shapeType = 2;
				}
				else if(ItemsUtil.isPetUpItem(data)) {
					shapeType = 3;
				}
				else if(ItemsUtil.isLawUpItem(data)) {
					shapeType = 4;
				}
				break;
			}
		}
		if(shapeType) {
			let txtUrl:string = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"shapeTxt_" + shapeType);
			this.loader_txt1.load(txtUrl);
			this.loader_txt2.load(txtUrl);
			this.loader_icon.load(URLManager.getModuleImgUrl("dayRecharge/shapeIcon_" + shapeType + ".png",PackNameEnum.Activity));
		}
		
		this.list_item.data = itemDatas;
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		let needRecharge:number = this.rewardCfg.num - rechargeNum;
		if(needRecharge <= 0) {
			this.txt_needRecharge.text = "0";
		}
		else {
			this.txt_needRecharge.text = needRecharge + "";
		}

		this.isCanGet = rechargeNum >= this.rewardCfg.num;
		if(this.isCanGet) {
			//可领取
			this.btn_recharge.icon = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"GetRewardTxt");
		}
		else {
			//未达成
			this.btn_recharge.icon = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"RechargeTxt");
		}
	}

	private onClickHandler():void {
		if(this.isCanGet) {
			//可领取
			EventManager.dispatch(LocalEventEnum.ActivityDayRechargeReward,this.rewardCfg.index);
		}
		else {
			//未达成,跳转充值
			HomeUtil.openRecharge(ViewIndex.One);
		}
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0){
			this.removeTimer();
			this.txt_time.text = "活动已结束";
			return;
		}
		this.txt_time.text = "剩余时间：" + App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,false);
	}

	private removeTimer():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}

	public hide():void {
		super.hide();
		this.removeTimer();
	}
}