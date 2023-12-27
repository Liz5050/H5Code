class ActivityRebateItem extends ListRenderer {
	private c1:fairygui.Controller;
	private list_item:List;
	private txt_day:fairygui.GTextField;
	private btn_get:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.list_item = new List(this.getChild("list_item").asList,{showGoldEffect:true});
		this.txt_day = this.getChild("txt_day").asTextField;
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		let info:any = CacheManager.activity.rebateInfo;
		this.txt_day.text = data.rechargeDay + "";
		let rewardStr:string[] = data.rewards.split("#");
		if(data.exRewards) {
			rewardStr.push(data.exRewards);
		}
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardStr.length; i++) {
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.list_item.data = itemDatas;

		let canGetList:number[] = info.canGetRewardIdList.data_I;
		if(info.rechargeDayNum >= data.rechargeDay) {
			if(canGetList.indexOf(data.id) != -1) {
				//可领取
				CommonUtils.setBtnTips(this.btn_get,true);
				// this.btn_get.title = LangActivity.LANG2;
				this.c1.selectedIndex = 1;
				// App.DisplayUtils.grayButton(this.btn_get, false, false);
				// this.btn_get.titleColor = 0x892605;
			}
			else {
				//已领取
				this.c1.selectedIndex = 2;
				// this.btn_get.titleColor = 0xffffff;
			}
		}
		else {
			//未达成
			this.c1.selectedIndex = 0;
			CommonUtils.setBtnTips(this.btn_get,false);
			// this.btn_get.title = LangActivity.LANG1;
			// App.DisplayUtils.grayButton(this.btn_get, true, true);
			// this.btn_get.titleColor = 0xffffff;
		}
	}

	private onGetRewardHandler():void {
		if(this.c1.selectedIndex == 0) {
			HomeUtil.openRecharge();
			return;
		}
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		EventManager.dispatch(LocalEventEnum.ActivityRebateGetReward,this._data.id);
	}
}