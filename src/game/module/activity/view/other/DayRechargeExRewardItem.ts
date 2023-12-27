class DayRechargeExRewardItem extends fairygui.GComponent {
	private c1:fairygui.Controller;
	private baseItem:BaseItem;
	private txt_rechargeDay:fairygui.GTextField;
	private touch_area:fairygui.GGraph;
	private rewardCfg:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.txt_rechargeDay = this.getChild("txt_rechargeDay").asTextField;
		this.touch_area = this.getChild("touch_area").asGraph;
		this.touch_area.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data:any):void {
		if(!data) return;
		this.rewardCfg = data;
		this.baseItem.setData(RewardUtil.getStandeRewards(data.reward)[0]);
		this.txt_rechargeDay.text = data.day + "天";
	}

	public updateRewardState():void {
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetListEx();
		if(hadGetList.indexOf(this.rewardCfg.id) != -1) {
			//已领取
			this.c1.selectedIndex = 2;
		}
		else {
			let rechargeDay:number = CacheManager.recharge.rechargeDay;
			if(rechargeDay >= this.rewardCfg.day) {
				//可领取
				this.c1.selectedIndex = 1;
			}
			else {
				//未达成
				this.c1.selectedIndex = 0;
			}
		}
	}

	private onGetRewardHandler():void {
		ProxyManager.activity.getDayRechargeExReward(this.rewardCfg.id);
	}

	public get canGet():boolean {
		return this.c1.selectedIndex == 1;
	}
}