class ActivityDayRechargeItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_title:fairygui.GTextField;
	private btnGet:fairygui.GButton;
	private list_item:List;
	private txt_value:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_title = this.getChild("txt_title").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btnGet = this.getChild("btn_get").asButton;
		this.btnGet.addClickListener(this.onClickHandler,this);
		this.txt_value = this.getChild("txt_value").asTextField;
	}

	public setData(data:any):void {
		this._data = data;
		let rewardStr:string[] = data.rewardStr.split("#");
		this.list_item.data = RewardUtil.getStandeRewards(data.rewardStr);
		this.txt_title.text = "累计充值<font color='#eee43f'>" + data.num + "</font>元宝";
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetList();
		this.txt_value.text = "价值" + data.goldShow + "元宝";
		if(hadGetList.indexOf(data.index) != -1) {
			//已领取
			this.c1.setSelectedIndex(2);
		}
		else {
			let rechargeNum:number = CacheManager.recharge.getRechargeNumToDay();
			if(rechargeNum >= data.num) {
				//可领取
				this.c1.setSelectedIndex(1);
				this.btnGet.title = LangActivity.LANG2;
				// this.btnGet.titleColor = 0x892605;
				// App.DisplayUtils.grayButton(this.btnGet, false, false);
				CommonUtils.setBtnTips(this.btnGet,true);
			}
			else {
				//未达成
				this.c1.setSelectedIndex(0);
				this.btnGet.title = LangActivity.LANG11;
				// this.btnGet.titleColor = 0xffffff;
				// App.DisplayUtils.grayButton(this.btnGet, true, true);
				CommonUtils.setBtnTips(this.btnGet,false);
			}
		}
	}

	private onClickHandler():void {
		if(this.c1.selectedIndex == 0) {
			HomeUtil.openRecharge();
			return;
		}
		EventManager.dispatch(LocalEventEnum.ActivityDayRechargeReward,this._data.index);
	}
}