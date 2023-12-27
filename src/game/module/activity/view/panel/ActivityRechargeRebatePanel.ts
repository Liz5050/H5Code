/**
 * 充值返利
 */
class ActivityRechargeRebatePanel extends ActivityBaseTabPanel {
	private day_recharge:RechargeRebateItem;
	private seven_recharge:RechargeRebateItem;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeComposeRecharge;
	}

	public initOptUI():void {
		super.initOptUI();
		this.day_recharge = this.getGObject("day_recharge") as RechargeRebateItem;
		this.day_recharge.type = 1;
		this.seven_recharge = this.getGObject("seven_recharge") as RechargeRebateItem;
		this.seven_recharge.type = 2;
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.day_recharge.setData(ConfigManager.activitySeven.getDayRechargeRebateCfg(info.code,info.openedDay));
		this.seven_recharge.setData(ConfigManager.activitySeven.getSevenRechargeCfg(info.code));
		this.updateRewardGetInfo();
	}

	/**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
		this.day_recharge.updateRechargeInfo();
		this.seven_recharge.updateRechargeInfo();
	}
}