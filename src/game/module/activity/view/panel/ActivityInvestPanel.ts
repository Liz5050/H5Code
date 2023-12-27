class ActivityInvestPanel extends ActivityBaseTabPanel {
	private c1:fairygui.Controller;
	private btn_invest:fairygui.GButton;
	private list_item:List;
	private rewards:any[];
	private investRechargeCfg:any;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypeInvestPlan;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.btn_invest = this.getGObject("btn_invest").asButton;
		this.btn_invest.addClickListener(this.onInvestClickHandler,this);
		this.list_item = new List(this.getGObject("list_item").asList);
		this.rewards = ConfigManager.activityInvest.getInvestRewardCfgs();
		this.investRechargeCfg = ConfigManager.mgRecharge.getByPk(22);
	}

	public updateAll():void {
		super.updateAll();
		this.updateInvestInfo();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
	}

	/**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
	}

	public updateInvestInfo():void {
		this.c1.selectedIndex = CacheManager.activity.hasInvested ? 1 : 0;
		this.rewards.sort(this.rewardSort);
		this.list_item.data = this.rewards;
	}

	private rewardSort(value1:any,value2:any):number {
		let hadGet1:boolean = CacheManager.activity.investHadGet(value1.day);
		let hadGet2:boolean = CacheManager.activity.investHadGet(value2.day);
		if(!hadGet1 && hadGet2) return -1;
		if(hadGet1 && !hadGet2) return 1;
		return value1.day - value2.day;
	}

	private onInvestClickHandler():void {
		EventManager.dispatch(LocalEventEnum.RechargeReqSDK,this.investRechargeCfg.money,this.investRechargeCfg.productId);
	}
}