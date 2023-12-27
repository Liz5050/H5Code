class RewardButton extends fairygui.GButton {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private baseItem:BaseItem;
	private txtRechargeDay:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.txtRechargeDay = this.getChild("txt_rechargeDay").asTextField;
	}

	public setData(data:ActivityRewardInfo):void {
		let itemData:ItemData = data.getItemDatas()[0];
		this.baseItem.setData(itemData);
		this.txtRechargeDay.text = "累充" + CacheManager.activity.rechargeDay + "/" + data.conds[1] + "天";

		let getRewardInfo:number[] = CacheManager.activity.getActivityGetRewardInfo(data.code);
		let hadGet:boolean = getRewardInfo != null && getRewardInfo[data.index] > 0;
		if(hadGet) {
			//已领取
			this.c2.selectedIndex = 1;
		}
		else {
			this.c2.selectedIndex = 0;
		}
	}

	public set selected(value:boolean) {
		this.c1.selectedIndex = value ? 1 : 0;
	}
}