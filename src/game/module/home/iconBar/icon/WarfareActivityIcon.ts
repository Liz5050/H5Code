class WarfareActivityIcon extends BaseIcon {
	public constructor(iconId: number) {
		super(iconId);
	}

	public setTime(time:number):void {
		this.leftTime = time;
		if(!this.iconTxt) {
			this.endTimeStr = HomeUtil.getIconTimeEndStr(this.iconResId);
			this.setText("");
		}
		if(this.leftTime > 0) {
			if(this.leftTime > 3600) {
				let openTime:number = CacheManager.serverTime.getServerTime() + this.leftTime;
				this.iconTxt.text = App.DateUtils.formatDate(openTime,DateUtils.FORMAT_HH_MM) + "开启";
			}
			else {
				this.setText(App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,true));
			}
			if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
				this.curTime = egret.getTimer();
				App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			}
		}
		else {
			this.iconTxt.text = this.endTimeStr;
			this.showEffect();
		}
	}

	protected onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime) / 1000);
		this.curTime = time;
		if(this.leftTime <= 3600) {
			if(this.leftTime < 0) {
				App.TimerManager.remove(this.onTimerUpdate,this);
				this.iconTxt.text = this.endTimeStr;
				//倒计时结束不移除的图标代表开启活动了
				//倒计时结束移除图标，这里设置一次红点没有影响
				CommonUtils.setBtnTips(this,true);
				this.showEffect();
				return;
			}
			this.iconTxt.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,true);
		}
	}
}