class ActivityBaseTabPanel extends BaseTabView {
	private topBg:GLoader;
	private timeTxt:fairygui.GRichTextField;
	private desTxt:fairygui.GRichTextField;
	protected activityType:ESpecialConditonType;
	protected activityInfo:ActivityInfo;
	private leftTime:number;
	private curTime:number;

	protected desTitleStr:string = "活动说明：";
	protected timeTitleStr:string = HtmlUtil.html("剩余时间：",Color.Color_7);
	protected timeFormat:string = DateUtils.FORMAT_1;
	public constructor() {
		super();
	}

	public initOptUI():void {
		let topBg:fairygui.GObject = this.getGObject("bg_top");
		if(topBg) {
			this.topBg = topBg as GLoader;
		}
		let timeTxt:fairygui.GObject = this.getGObject("txt_time");
		if(timeTxt) {
			this.timeTxt = timeTxt.asRichTextField;
		}
		let desTxt:fairygui.GObject = this.getGObject("txt_des");
		if(desTxt) {
			this.desTxt = desTxt.asRichTextField;
		}
	}

	public updateAll():void {
		if(this.topBg) this.topBg.load(URLManager.getModuleImgUrl("banner_" + this.activityType + ".jpg",PackNameEnum.Activity));
	}

	/**
	 * 活动数据更新
	 */
	public updateActicityInfo(info:ActivityInfo):void {
		this.activityInfo = info;
		if(this.desTxt) {
			this.desTxt.text = this.desTitleStr +"<font color=\"#f5e8ce\">" + info.context + "</font>";
			//if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeToday || info.type == ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn) {
			//	this.desTxt.text = this.desTitleStr + info.context ;
			//}
			//else {
			//}
		}
		this.leftTime = info.leftTime;
		if(this.activityType == ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen || this.activityType == ESpecialConditonType.ESpecialConditionTypeInvestPlan) {
			this.leftTime = info.leftShowTime;
		}
		if(this.timeTxt) {
			this.timeTxt.text = this.timeTitleStr + "<font color=\"#09c73d\">" + App.DateUtils.getTimeStrBySeconds(this.leftTime,this.timeFormat) + "</font>";
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

	/**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
	}

	/**
	 * 累计充值天数更新
	 */
	public updateRechargeDay():void {
	}

	/**
	 * 累计充值额度更新
	 */
	public updateRechargeNum():void {
	}

	/**冲榜排名更新 */
	public updateActivityRank(data:any[]):void {
	}

	/**更新升级狂欢 */
	public updateUpgradeLv():void {
	}

	/**全服奖励领取份数更新 */
	public updateRewardNumList():void {
	}

	/**更新投资计划信息 */
	public updateInvestInfo():void {
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
		this.timeTxt.text = this.timeTitleStr + "<font color=\"#09c73d\">" + App.DateUtils.getTimeStrBySeconds(this.leftTime,this.timeFormat) + "</font>";
	}

	private removeTimer():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}

	public hide():void {
		super.hide();
		this.removeTimer();
	}
}