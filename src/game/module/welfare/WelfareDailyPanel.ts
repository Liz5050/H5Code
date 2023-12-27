/**
 * 每日签到
 */

class WelfareDailyPanel extends BaseTabPanel{
	private daysTxt: fairygui.GTextField;
	private dayList: List;
	private dayBar: fairygui.GProgressBar;
	private monthItems: Array<WelfareMonthItem>;
	private explainBtn: fairygui.GButton;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.daysTxt = this.getGObject("txt_days").asTextField;
		this.dayList = new List(this.getGObject("list_reward").asList);
		this.dayBar = this.getGObject("bar_days").asProgress;
		this.explainBtn = this.getGObject("btn_explain").asButton;
		this.explainBtn.addClickListener(this.clickExplain, this);

		this.monthItems = [];
		for (let i = 1; i < 6; i++) {
			let welfareMonthItem: WelfareMonthItem = <WelfareMonthItem>this.getGObject("btn_month" + i);
			this.monthItems.push(welfareMonthItem);
		}
	}

	public updateAll(value: number = -1): void{
		this.updateDayList();
		if(value > -1){
			this.dayList.scrollToView(value);
		}
	}

	/**更新本月签到情况 */
	public updateDayList(): void{
		let datas: Array<any> = ConfigManager.mgSignDay.getData();
		datas.length = CacheManager.welfare.monthDays;
		this.dayList.data = datas;
		this.daysTxt.text = CacheManager.welfare.signDays.toString();
		this.dayBar.value = CacheManager.welfare.signDays;
		this.updateMonth();
	}

	/**更新本月签到天数的奖励 */
	public updateMonth(): void{
		let datas: Array<any> = ConfigManager.mgSignMonth.getData();
		for(let i = 0; i < this.monthItems.length; i++){
			this.monthItems[i].setData(datas[i]);
		}
	}

	/**问号提示 */
	private clickExplain(): void {
		ToolTipManager.showInfoTip("每天上线签到可领取一次奖励\n部分奖励vip用户可领取多倍奖励\n累积签到一定天数更可领取豪华大礼", this.explainBtn);
	}
}