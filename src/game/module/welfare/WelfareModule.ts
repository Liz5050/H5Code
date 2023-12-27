/**
 * 福利
 */

class WelfareModule extends BaseWindow{
	private controller: fairygui.Controller;
	private welfareUpgradePanel: WelfareUpgradePanel;
	private welfareDailyPanel: WelfareDailyPanel;

	private upgradeBtn: fairygui.GButton;
	private dailyBtn: fairygui.GButton;

	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.Welfare, "Main", moduleId);
	}

	public initOptUI(): void{
		this.controller = this.getController("c1");
		this.welfareUpgradePanel = new WelfareUpgradePanel(this.getGObject("panel_upgrade").asCom, this.controller, 0);
		this.welfareDailyPanel = new WelfareDailyPanel(this.getGObject("panel_everyday").asCom, this.controller, 1);
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.dailyBtn = this.getGObject("btn_everyday").asButton;
		this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
	}

	public updateAll(): void{
		this.controller.selectedIndex = -1;
		if(CacheManager.welfare.isGetUpgradeReward()){
			this.controller.selectedIndex = 0;
		}else if(CacheManager.welfare.isCanDailySign() || CacheManager.welfare.isGetMonthReward()){
			this.controller.selectedIndex = 1;
			this.welfareDailyPanel.updateAll(CacheManager.welfare.getSignDay());
		}else{
			this.controller.selectedIndex = 0;
		}
		this.updateBtnTip();
	}

	/**页签切换 */
	protected onTabChanged(e: any): void {
		if(this.controller.selectedIndex == 1){
			if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SignReward)){
				this.controller.setSelectedIndex(this.controller.previsousIndex);
			}
		}
	}

	/**更新红点推送 */
	private updateBtnTip(): void{
		CommonUtils.setBtnTips(this.upgradeBtn, CacheManager.welfare.isGetUpgradeReward());
		if(CacheManager.welfare.isCanDailySign() || CacheManager.welfare.isGetMonthReward()){
			CommonUtils.setBtnTips(this.dailyBtn, true);
		}else{
			CommonUtils.setBtnTips(this.dailyBtn, false);
		}
	}

	/**更新等级奖励 */
	public updateUpgradeList(): void{
		if(this.welfareUpgradePanel){
			this.welfareUpgradePanel.updateList();
		}
		this.updateBtnTip();
	}

	/**更新本月每日签到 */
	public updateDayList(): void{
		if(this.welfareDailyPanel){
			this.welfareDailyPanel.updateDayList();
		}
		this.updateBtnTip();
	}
}