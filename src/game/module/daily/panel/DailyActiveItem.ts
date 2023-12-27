/**
 * 每日必做底部活跃列表项
 */
class DailyActiveItem extends ListRenderer {
	private c1: fairygui.Controller;
	private baseItem: BaseItem;
	private nameTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.bgLoader.visible = false;
		this.baseItem.colorLoader.visible = false;
		this.baseItem.selected = false;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.addClickListener(this.clickGet, this);
	}

	public setData(data: any, index: number = -1): void {
		this._data = data;
		if (data != null) {
			this.nameTxt.text = `${data.needExp}活跃`;
			let itemData: ItemData = RewardUtil.getReward((data.rewardStr as string).split("#")[0]);
			this.baseItem.itemData = itemData;
			if (CacheManager.daily.isGetReward(data.idx)) {
				this.c1.selectedIndex = 2;
				this.baseItem.enableToolTip = false;
			} else {
				this.c1.selectedIndex = CacheManager.daily.swordPoolActivity.countExp_I >= data.needExp ? 1 : 0;
				this.baseItem.enableToolTip = this.c1.selectedIndex == 1 ? false : true;
			}
		}
	}

	/**
	 * 点击领取
	 */
	private clickGet(): void {
		if (this._data != null && this.c1.selectedIndex == 1) {
			EventManager.dispatch(LocalEventEnum.DailySPGetActivityReward, this._data.idx);
		}
		this.baseItem.selected = false;
	}
}