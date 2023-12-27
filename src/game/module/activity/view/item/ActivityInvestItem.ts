class ActivityInvestItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_title:fairygui.GTextField;
	private list_item:List;
	private txt_day:fairygui.GTextField;
	private btn_get:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_title = this.getChild("txt_title").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.txt_day = this.getChild("txt_day").asTextField;
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.txt_title.text = "第" + GameDef.NumberName[data.day] + "天返利";
		this.list_item.data = RewardUtil.getStandeRewards(data.reward);
		let investDay:number = CacheManager.activity.investDay;
		this.txt_day.text = investDay + "天/" + data.day + "天";
		if(CacheManager.activity.investHadGet(data.day)) {
			//已领取
			this.c1.selectedIndex = 2;
		}
		else {
			if(investDay >= data.day) {
				//可领取
				this.c1.selectedIndex = 1;
			}
			else {
				//未完成
				this.c1.selectedIndex = 0;
			}
		}
	}

	private onGetRewardHandler():void {
		ProxyManager.activity.getInvestReward(this._data.day);
	}
}