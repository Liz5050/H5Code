class SecretLeaveCounterView extends BaseView{
	private txt_owner:fairygui.GTextField;
	private txt_time:fairygui.GTextField;
	private totalSecond:number = 0;
	private curSecond:number = 0;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	public initOptUI():void{
		this.txt_owner = this.getGObject("txt_owner").asTextField;
		this.txt_time = this.getGObject("txt_time").asTextField;
	}

	public updateAll(data?:any):void{		
		this.txt_owner.text = HtmlUtil.html("最终归属者：","#c8b185")+HtmlUtil.html(data.ownerName,"#f2e1c0");
		this.totalSecond = data.waitLeaveSec;
		this.curSecond = this.totalSecond;
		this.onTimer();
		this.startTimer();
	}
	private onTimer():void{
		let timeStr:string = App.DateUtils.formatSeconds(this.curSecond,DateUtils.FORMAT_SECONDS_2);		
		this.txt_time.text = HtmlUtil.html("离开倒计时：","#fea700")+HtmlUtil.html(timeStr,"#0df14b");		
		this.curSecond--;		
		if(this.curSecond<=0){
			this.stopTimer();
		}
	}
	protected hidePanel():void{
        EventManager.dispatch(LocalEventEnum.BossSecretHideLeave);
        this.stopTimer();
    }
	public startTimer():void{
        App.TimerManager.doTimer(1000,0,this.onTimer,this);
    }
    public stopTimer():void{
        App.TimerManager.remove(this.onTimer,this);
    }


}