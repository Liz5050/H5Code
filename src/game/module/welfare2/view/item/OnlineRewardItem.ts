class OnlineRewardItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_condition:fairygui.GRichTextField;
	private txt_time:fairygui.GTextField;
	private list_reward:List;
	private btn_get:fairygui.GButton;

	private leftGetTime:number = 0;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_condition = this.getChild("txt_condition").asRichTextField;
		this.txt_time = this.getChild("txt_time").asTextField;
		this.list_reward = new List(this.getChild("list_reward").asList);
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.list_reward.data = RewardUtil.getStandeRewards(data.onlineRewardStr);
		this.txt_condition.text = "在线" +  HtmlUtil.html(data.onlineMinute + "",Color.Green2) + "分钟可领取";
		let onlineTime:number = CacheManager.serverTime.onlineTime;
		let conditionSec:number = data.onlineMinute * 60;
		if(CacheManager.welfare2.onlineRewardHadGet(data.type,data.onlineMinute)) {
			//已领取
			this.c1.selectedIndex = 2;
		}
		else {
			if(onlineTime >= conditionSec) {
				//可领取
				this.c1.selectedIndex = 1;
				App.DisplayUtils.grayButton(this.btn_get, false, false);
				CommonUtils.setBtnTips(this.btn_get,true);
			}
			else {
				//未达成
				this.c1.selectedIndex = 0;
				App.DisplayUtils.grayButton(this.btn_get, true, true);
				CommonUtils.setBtnTips(this.btn_get,false);
				this.leftGetTime = conditionSec - onlineTime;
				this.txt_time.text = "倒计时：" + App.DateUtils.getTimeStrBySeconds(this.leftGetTime,"{2}:{1}:{0}",false);
				if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
					App.TimerManager.doTimer(1000,this.leftGetTime,this.onTimerUpdate,this);
				}
			}
		}
	}

	private onTimerUpdate():void {
		this.leftGetTime --;
		if(this.leftGetTime <= 0) {
			this.c1.selectedIndex = 1;
			App.DisplayUtils.grayButton(this.btn_get, false, false);
			CommonUtils.setBtnTips(this.btn_get,true);
			App.TimerManager.remove(this.onTimerUpdate,this);
			return;
		}
		this.txt_time.text = "倒计时：" + App.DateUtils.getTimeStrBySeconds(this.leftGetTime,"{2}:{1}:{0}",false);
	}

	private onClickHandler():void {
		EventManager.dispatch(LocalEventEnum.GetOnlineReward,this._data.type,this._data.onlineMinute);
	}

	public recycleChild(): void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}
}