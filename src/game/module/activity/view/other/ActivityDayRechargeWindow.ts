class ActivityDayRechargeWindow extends BaseWindow {
	private bgLoader:GLoader;
	private tab_list:List;
	
	// private txt_needRecharge:fairygui.GTextField;
	// private txt_value:fairygui.GTextField;
	private list_item:List;
	private btn_recharge:fairygui.GButton;

	private rewardExs:DayRechargeExRewardItem[];
	private progressBar:UIProgressBar;

	private isCanGet:boolean;
	private targetCfg:any;
	private curIndex:number = -1;

	private rechargeCfgs:any[];
	private rewardExCfgs:any[];
	private hadGetList:number[];
	public constructor() {
		super(PackNameEnum.ActivityDayRecharge,"WindowDayRecharge",null,LayerManager.UI_Main);
	}

	public initOptUI():void {
		this.bgLoader = this.getGObject("bgLoader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("dayRechargeBg.png",PackNameEnum.Activity));
		this.tab_list = new List(this.getGObject("tab_list").asList);
		this.tab_list.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSelectBtnChange, this);
		// this.txt_needRecharge = this.getGObject("txt_needRecharge").asTextField;
		// this.txt_value = this.getGObject("txt_value").asTextField;
		this.list_item = new List(this.getGObject("list_item").asList,{isShowName:false});
		this.btn_recharge = this.getGObject("btn_recharge").asButton;
		this.btn_recharge.addClickListener(this.onClickHandler,this);
		this.closeObj.visible = true;

		this.rewardExs = [];
		this.rewardExCfgs = ConfigManager.rechargeFirst.getDayRechargeExRewardCfg();
		for(let i:number = 0; i < 3; i++) {
			let exReward:DayRechargeExRewardItem = this.getGObject("btn_reward_" + i) as DayRechargeExRewardItem;
			exReward.setData(this.rewardExCfgs[i]);
			this.rewardExs.push(exReward);
		}

		this.progressBar = this.getGObject("progressBar") as UIProgressBar;
		this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"progress_1"),"",0,0,0,0,UIProgressBarType.Mask);
		this.progressBar.setValue(0,2);
	}

	public updateAll():void {
		this.rechargeCfgs = ConfigManager.rechargeFirst.getRechargeConfigByType(2);
		this.tab_list.data = this.rechargeCfgs;
		this.updateRewardGetInfo();
	}

	public updateRewardGetInfo():void {
		let index:number = -1;
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		this.hadGetList = CacheManager.recharge.getDayRechargeHadGetList();
		let getCount:number = 0;
		for(let i:number = 0; i < this.rechargeCfgs.length; i++) {
			let hadGet:boolean = this.hadGetList.indexOf(this.rechargeCfgs[i].index) != -1;
			let btnItem:DayRechargeTabButton = this.tab_list.list.getChildAt(i) as DayRechargeTabButton;
			CommonUtils.setBtnTips(btnItem,rechargeNum >= this.rechargeCfgs[i].num && !hadGet);
			if(index == -1 && !hadGet) index = i;
		}
		if(!this.updateExRewardState() && index == -1) {
			this.hide();
			return;
		}
		
		if(index < 0) {
			this.setIndex(this.rechargeCfgs.length -1);
		}
		else {
			this.setIndex(index);
		}
		if(CacheManager.recharge.rechargeDay > 1) {
			let endCfg:any = this.rewardExCfgs[this.rewardExCfgs.length - 1];
			this.progressBar.setValue(CacheManager.recharge.rechargeDay - 1,endCfg.day - 1);
		}
	}

	private updateExRewardState():boolean {
		let canGet:boolean = false;
		for(let i:number = 0; i < this.rewardExs.length; i++) {
			this.rewardExs[i].updateRewardState();
			if(!canGet) canGet = this.rewardExs[i].canGet;
		}
		return canGet;
	}

	private onSelectBtnChange():void {
		let index: number = this.tab_list.selectedIndex;
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) {
			this.updateBtnState();
			return;
		}
		let tabBtn:DayRechargeTabButton;
		if(this.curIndex != -1) {
			tabBtn = this.tab_list.list.getChildAt(this.curIndex) as DayRechargeTabButton;
			tabBtn.btnSelected = false;
		}
		this.curIndex = index;
		tabBtn = this.tab_list.list.getChildAt(this.curIndex) as DayRechargeTabButton;
		tabBtn.btnSelected = true;
		this.targetCfg = this.rechargeCfgs[index];

		this.list_item.data = RewardUtil.getStandeRewards(this.targetCfg.rewardStr);
		// this.txt_value.text = this.targetCfg.goldShow + "";
		// let needRecharge:number = this.targetCfg.num - rechargeNum;
		// if(needRecharge <= 0) {
		// 	this.txt_needRecharge.text = "0";
		// }
		// else {
		// 	this.txt_needRecharge.text = needRecharge + "";
		// }

		this.updateBtnState();
	}

	private updateBtnState():void {
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		let hadGet:boolean = this.hadGetList.indexOf(this.targetCfg.index) != -1;
		this.isCanGet = rechargeNum >= this.targetCfg.num && !hadGet;
		if(hadGet) {
			//已领取
			this.btn_recharge.icon = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"HadGetTxt");
			App.DisplayUtils.grayButton(this.btn_recharge, true, true);
		}
		else {
			App.DisplayUtils.grayButton(this.btn_recharge, false, false);
			if(this.isCanGet) {
				//可领取
				this.btn_recharge.icon = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"GetRewardTxt");
			}
			else {
				//未达成
				this.btn_recharge.icon = URLManager.getPackResUrl(PackNameEnum.ActivityDayRecharge,"RechargeTxt");
			}
		}
	}

	private onClickHandler():void {
		if(this.isCanGet) {
			//可领取
			EventManager.dispatch(LocalEventEnum.ActivityDayRechargeReward,this.targetCfg.index);
			MoveMotionUtil.itemListMoveToBag(this.list_item.list._children);
		}
		else {
			//未达成,跳转充值
			HomeUtil.openRecharge();
		}
	}

	public hide():void {
		super.hide();
		if(this.curIndex != -1) {
			let tabBtn:DayRechargeTabButton = this.tab_list.list.getChildAt(this.curIndex) as DayRechargeTabButton;
			tabBtn.btnSelected = false;
			this.curIndex = -1;
		}
	}
}