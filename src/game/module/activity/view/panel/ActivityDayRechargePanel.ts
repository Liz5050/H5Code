/**
 * 每日累充
 */
class ActivityDayRechargePanel extends ActivityBaseTabPanel {
	private list_item:List;
	private txtRecharge:fairygui.GTextField;
	private rechargeCfgs:any[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeRechargeToday;
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txtRecharge = this.getGObject("txt_rechargeNum").asTextField;
		this.timeFormat = DateUtils.FORMAT_4;
	}

	public updateAll():void {
		super.updateAll();
		this.rechargeCfgs = ConfigManager.rechargeFirst.getRechargeConfigByType(2);
		this.list_item.setVirtual(this.rechargeCfgs);
		this.list_item.scrollToView(0);
		this.updateRewardGetInfo();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
	}

	/**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
		this.txtRecharge.text = "已充值" + CacheManager.recharge.getRechargeNumToDay() + "元宝";
		this.rechargeCfgs.sort(this.sortList);
		this.list_item.list.refreshVirtualList();
	}

	private sortList(value1:any,value2:any):number {
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetList();
		let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
		let hadGet1:boolean = hadGetList.indexOf(value1.index) != -1;
		let hadGet2:boolean = hadGetList.indexOf(value2.index) != -1;
		if(!hadGet1 && hadGet2) return -1;
		if(hadGet1 && !hadGet2) return 1;
		if(rechargeNum >= value1.num && rechargeNum < value2.num) return -1;
		if(rechargeNum < value1.num && rechargeNum >= value2.num) return 1;
		return value1.num - value2.num;
	}
}