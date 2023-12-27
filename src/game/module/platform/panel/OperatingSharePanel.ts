class OperatingSharePanel extends OperatingBgPanel{
	public constructor() {
		super();
		this.rewardType = EShareRewardType.EShareRewardTypeShare;
	}
	public updateAll(data?:any):void{
		super.updateAll(data);
		this.c1.setSelectedIndex(2);
		let rewardTimes:number = CacheManager.platform.getShareRewardTimes(EShareRewardType.EShareRewardTypeShare);
		let s:string = HtmlUtil.html(rewardTimes+"",(rewardTimes>=PlatformCache.SHARE_REWARD_TIME?Color.Color_8:Color.Color_4));
        this.txtCount.text = `(${s}/${PlatformCache.SHARE_REWARD_TIME})`;
		if(CacheManager.platform.isShareInCd()){
            this.startTimer();
            this.onTimeRun();
        }else{
            this.txtTime.text = "";
        }
	}

	
    private startTimer():void{
        this.stopTimer();
        App.TimerManager.doTimer(1000,0,this.onTimeRun,this);
    }
	
	 protected doOperating():void{
		if(CacheManager.platform.isShareInCd()){
			Tip.showLeftTip("分享冷却中,稍后再邀请");
			return;
		}
		super.doOperating();        
    }
    private stopTimer():void{
         App.TimerManager.remove(this.onTimeRun,this);
    }

    private onTimeRun():void{      
        let sec:number = CacheManager.platform.getShareCdLeftSec();
        let str:string = App.DateUtils.getTimeStrBySeconds(sec, "{2}:{1}:{0}",true);
        if(sec<60){
            str+="秒";
        }
        this.txtTime.text = str + "后再次邀请";
        if(sec==0){
            this.stopTimer();
            this.txtTime.text = "";
        }
    }
	
    public hide():void{
        super.hide();
        this.stopTimer();    
    }

}