class ActivitySevenModule extends BaseModule {
	private loader_bg:GLoader;
	private list_day:List;
	private list_type:List;
	private list_reward:List;

	private txt_time:fairygui.GRichTextField;
	private txt_des:fairygui.GTextField;

	private score_progress:UIProgressBar;
	private btn_checkReward:fairygui.GButton;

	private curDay:number = -1;
	private curIndex:number = -1;
	private curRewardCfgs:any[];
	private timeTitleStr:string = HtmlUtil.html("剩余时间：",Color.Color_7);
	private activityInfo:ActivityInfo;
	private leftTime:number = -1;
	private txtMissionNum : Array<fairygui.GTextField>;
	private txt_oriX : number;
	private txt_xarray = [98,146,194,242,290,338,386,434,482];

	private scoreRewardWindow:ActivityScoreRewardView;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.ActivitySeven);
	}

	public initOptUI():void {
		this.txtMissionNum = [];
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.ActivitySeven));
		this.txt_time = this.getGObject("txt_time").asRichTextField;
		this.txt_des = this.getGObject("txt_des").asTextField;

		this.list_day = new List(this.getGObject("list_day").asList);
		this.list_day.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectDayChange,this);

		this.list_type = new List(this.getGObject("list_taskType").asList);
		this.list_type.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectTypeChange,this);

		this.list_reward = new List(this.getGObject("list_reward").asList);

		this.score_progress = this.getGObject("score_progress") as UIProgressBar;
		this.score_progress.setStyle(URLManager.getPackResUrl(PackNameEnum.ActivitySeven,"progressBar"),"",0,0,0,0,UIProgressBarType.Mask);
		// this.socre_progress.setValue(5,10);

		this.btn_checkReward = this.getGObject("btn_checkReward").asButton;
		this.btn_checkReward.addClickListener(this.checkRewardHandler,this);
		for(let i = 0; i < 9 ;i++) {
			this.txtMissionNum.push(this.getGObject(`mission_num${i+1}`).asTextField);
			this.txtMissionNum[i].visible = false;
		}

		//this.txt_oriX = this.txtMissionNum.x;
	}

	public updateAll():void {
		this.activityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeActivity);
		if(this.activityInfo) {
			this.leftTime = this.activityInfo.leftTime;
			this.txt_des.text = this.activityInfo.context;
		}
		else {
			this.leftTime = 600;
		}
		if(this.leftTime > 0) {
			this.txt_time.text = this.timeTitleStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_1);
			if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
				App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			}
		}

		this.list_day.data = ConfigManager.activitySeven.getDayCfgs();
		this.checkAllTips();
		this.setDay(1);
		this.updateActivityScore();
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime --;
		if(this.leftTime <= 0){
			App.TimerManager.remove(this.onTimerUpdate,this);
			this.txt_time.text = "活动已结束";
			return;
		}
		this.txt_time.text = this.timeTitleStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_1);
	}

	public updateRewardList():void {
		this.curRewardCfgs.sort(this.sortRewardItem);
		this.list_reward.data = this.curRewardCfgs;
		let dayIndex:number = this.list_day.data.indexOf(this.curDay);
		if(dayIndex != -1) {
			let btn:ActivityDayButton = this.list_day.list.getChildAt(dayIndex) as ActivityDayButton;
			CommonUtils.setBtnTips(btn,CacheManager.activitySeven.checkDayTips(this.curDay));
		}

		let typeIndex:number = this.list_type.data.indexOf(this.curIndex);
		if(typeIndex != -1) {
			let btn:ActivitySevenCategoryBtn = this.list_type.list.getChildAt(typeIndex) as ActivitySevenCategoryBtn;
			CommonUtils.setBtnTips(btn,CacheManager.activitySeven.checkDayTypeTips(this.curDay,this.curIndex));
		}
		this.updateActivityScore();
		
	}

	public updateActivityScore():void {
		if(CacheManager.activitySeven.score <= 16) {
			this.score_progress.setValue(CacheManager.activitySeven.score/2,ConfigManager.activitySeven.maxScore - 8);
		}
		else {
			this.score_progress.setValue(CacheManager.activitySeven.score - 8 ,ConfigManager.activitySeven.maxScore - 8);
		}
		this.setMissionNum(CacheManager.activitySeven.score);
	}

	private onSelectDayChange(evt:egret.TouchEvent):void {
		let dayBtn:ActivityDayButton = this.list_day.selectedItem as ActivityDayButton;
		if(!dayBtn.isOpen) {
			Tip.showRollTip("活动开启第" + dayBtn.getData() + "天开放");
			let itemIndex:number = this.list_day.data.indexOf(this.curDay);
			this.list_day.selectedIndex = itemIndex;
			return;
		}
		this.setDay(dayBtn.getData());
	}

	private onSelectTypeChange(evt:egret.TouchEvent):void {
		let typeBtn:ActivitySevenCategoryBtn = this.list_type.selectedItem as ActivitySevenCategoryBtn;
		this.setIndex(typeBtn.getData());
	}

	private setDay(day:number):void {
		if(this.curDay == day) return;
		let itemIndex:number = this.list_day.data.indexOf(this.curDay);
		if(itemIndex != -1) {
			(this.list_day.list.getChildAt(itemIndex) as ActivityDayButton).selected = false;
		}
		this.curDay = day;
		itemIndex = this.list_day.data.indexOf(this.curDay);
		(this.list_day.list.getChildAt(itemIndex) as ActivityDayButton).selected = true;
		let types:number[] = ConfigManager.activitySeven.getDayTypes(day);
		this.list_type.data = types;
		for(let i:number = 0; i < types.length; i++) {
			let btn:ActivitySevenCategoryBtn = this.list_type.list.getChildAt(i) as ActivitySevenCategoryBtn;
			CommonUtils.setBtnTips(btn,CacheManager.activitySeven.checkDayTypeTips(this.curDay,types[i]));
		}
		this.setIndex(this.list_type.data[0]);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		let itemIndex:number = this.list_type.data.indexOf(this.curIndex);
		if(itemIndex != -1) {
			(this.list_type.list.getChildAt(itemIndex) as ActivitySevenCategoryBtn).selected = false;
		}
		this.curIndex = index;
		itemIndex = this.list_type.data.indexOf(this.curIndex);
		(this.list_type.list.getChildAt(itemIndex) as ActivitySevenCategoryBtn).selected = true;
		this.curRewardCfgs = ConfigManager.activitySeven.getTaskItemCfgs(this.curDay,index);
		this.curRewardCfgs.sort(this.sortRewardItem);
		this.list_reward.data = this.curRewardCfgs;
		this.list_reward.scrollToView(0);
	}

	private sortRewardItem(value1:any,value2:any):number {
		let getInfo:any = CacheManager.activitySeven.rewardGetInfo;
		if(!getInfo) return 0;
		let index1:number = getInfo.key_I.indexOf(value1.id);
		let index2:number = getInfo.key_I.indexOf(value2.id);
		let canGet1:boolean = index1 != -1 && getInfo.value_I[index1] == 1;
		let canGet2:boolean = index2 != -1 && getInfo.value_I[index2] == 1;
		if(canGet1 && !canGet2) return -1;
		if(!canGet1 && canGet2) return 1;
		let hadGet1:boolean = index1 != -1 && getInfo.value_I[index1] == 2;
		let hadGet2:boolean = index2 != -1 && getInfo.value_I[index2] == 2;
		if(!hadGet1 && hadGet2) return -1;
		if(hadGet1 && !hadGet2) return 1;
		return value1.id - value2.id;
	}

	private checkAllTips():void {
		let days:number[] = this.list_day.data;
		for(let i:number = 0; i < days.length; i++) {
			let btn:ActivityDayButton = this.list_day.list.getChildAt(i) as ActivityDayButton;
			CommonUtils.setBtnTips(btn,CacheManager.activitySeven.checkDayTips(days[i]));
		}
	}

	private checkRewardHandler():void {
		if(!this.scoreRewardWindow) {
			this.scoreRewardWindow = new ActivityScoreRewardView();
		}
		this.scoreRewardWindow.show();
	}

	public hide():void {
		super.hide();
		this.curDay = -1;
		this.curIndex = -1;
		this.curRewardCfgs = null;
	}

	public setMissionNum(score : number) {
		for(let i = 0; i < 9 ;i++) {
			this.txtMissionNum[i].visible = false;
		}
		if(score >= ConfigManager.activitySeven.maxScore) {
			return;
		}
		if(score <= 16) 
		{
			this.txtMissionNum[0].text = score.toString();
			this.txtMissionNum[0].visible = true;
		}
		else {
			let num = Math.floor((score-8)/8);
			this.txtMissionNum[num - 1].text = score.toString();
			this.txtMissionNum[num - 1].visible = true;
		}

	}
}