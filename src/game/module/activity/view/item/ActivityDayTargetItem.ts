class ActivityDayTargetItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_target:fairygui.GTextField;
	private txt_targetValue:fairygui.GTextField;
	private list_item:List;
	private btnGet:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_target = this.getChild("txt_target").asTextField;
		this.txt_targetValue = this.getChild("txt_targetValue").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btnGet = this.getChild("btn_get").asButton;
		this.btnGet.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(rewardInfo:ActivityRewardInfo):void {
		this._data = rewardInfo;
		let rewards:any[] = rewardInfo.rewards;
		let conds:number[] = rewardInfo.conds;
		this.list_item.data = rewardInfo.getItemDatas();
		let values:any[] = rewardInfo.getTargetValues();
		this.txt_target.text = values[1];
		let condValue:number = conds[2];
		if(conds[1] == EReachGoalActiveType.EReachGoalActiveTypeLevel) {
			let roleState:number = Math.floor(condValue/10000);
			let level:number = condValue - roleState*10000;
			if(roleState <= 0) {
				this.txt_targetValue.text = level + "级";
			}
			else {
				if(level <= 0) {
					this.txt_targetValue.text = roleState + "转";
				}
				else {
					this.txt_targetValue.text = roleState + "转" + level + "级";
				}
			}
		}
		else {
			this.txt_targetValue.text = condValue + "";
		}
		if(rewardInfo.hadGetCount > 0) {
			//已领取
			this.c1.setSelectedIndex(1);
			App.DisplayUtils.grayButton(this.btnGet, true);
		}
		else {
			this.c1.setSelectedIndex(0);
			if(values[0] >= condValue) {
				//可领取
				this.btnGet.title = LangActivity.LANG2;
				this.btnGet.titleColor = 0x892605;
				App.DisplayUtils.grayButton(this.btnGet, false,false);
				CommonUtils.setBtnTips(this.btnGet,true);
			}
			else {
				//未达成
				this.btnGet.title = LangActivity.LANG1;
				this.btnGet.titleColor = 0xffffff;
				App.DisplayUtils.grayButton(this.btnGet, true);
				CommonUtils.setBtnTips(this.btnGet,false);
			}
		}
	}

	private onGetRewardHandler():void {
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this._data.code,this._data.conds[0]);
	}
}