class DailyModule extends BaseModule {
	private c1: fairygui.Controller;
	private timeTxt: fairygui.GTextField;
	private dayPanel: DailyPanel;

	public constructor() {
		super(ModuleEnum.Daily);
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.getGObject("btn_add").addClickListener(this.clickAdd, this);
		this.dayPanel = new DailyPanel(this.getGObject("panel_everyday").asCom, this.c1, 0);
	}

	public updateAll(data: any = null): void {
		this.selectTab(0);
		this.updateHangLeftTime();
	}

	public updateHangLeftTime(): void {
		let leftTime: number = CacheManager.sysSet.offlineWorkLeftTime;
		this.timeTxt.text = App.DateUtils.getFormatBySecond(leftTime, 7);
	}

	/**
	 * 获前往按钮
	 */
	public getGoBtn(openKey: MgOpenEnum): fairygui.GButton {
		return this.dayPanel.getGoBtn(openKey);
	}

	protected onMainTabChanged(e: any): void {
	}

	/**
	 * 更新每日活跃列表
	 */
	public updateDayActiveList(): void {
		this.dayPanel.updateActiveList();
	}

	private clickAdd(): void {
		// let sellItemCode: number = CacheManager.sysSet.getAdviceOfflineWorkItemCode();
		// if (sellItemCode) EventManager.dispatch(UIEventEnum.ShopBuyOpen, new ItemData(sellItemCode));
	}
}