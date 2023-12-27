/**
 * 每日必做
 */
class DailyPanel extends BaseTabPanel {
	private dailyList: List;
	private activeList: List;
	private expBar: fairygui.GProgressBar;

	private toolTipData: ToolTipData;
	private maxExp: number;

	public initOptUI(): void {
		this.dailyList = new List(this.getGObject("list_daily").asList);
		this.activeList = new List(this.getGObject("list_active").asList);
		this.getGObject("btn_up").addClickListener(this.clickUp, this);
		this.expBar = this.getGObject("bar_exp").asProgress;

		let cfg: any = ConfigManager.swordPoolActivity.getByPk(5);
		this.maxExp = cfg.needExp;
	}

	public updateAll(): void {
		this.dailyList.data = ConfigManager.swordPoolEvent.getSortedEvents();
		this.updateActiveList();
		this.expBar.value = CacheManager.daily.swordPoolActivity.countExp_I;
		this.expBar.max = this.maxExp;
	}

	public updateActiveList(): void {
		this.activeList.data = ConfigManager.swordPoolActivity.getSortedActivities();
	}

	public getGoBtn(openKey: MgOpenEnum): fairygui.GButton {
		let index: number = this.getGoBtnIndex(openKey);
		let dailyItem: DailyItem = <DailyItem>this.dailyList.list._children[index];
		return dailyItem.goBtn;
	}

	private getGoBtnIndex(openKey: MgOpenEnum): number {
		for (let i: number = 0; i < this.dailyList.data.length; i++) {
			if (this.dailyList.data[i].openKey == openKey) {
				return i;
			}
		}
		return -1;
	}

	private clickUp(): void {
		EventManager.dispatch(UIEventEnum.DailyUpWindowOpen);
	}
}