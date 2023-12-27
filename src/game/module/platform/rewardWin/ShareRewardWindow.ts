/**
 * 分享奖励展示窗口
 * @author zhh
 * @time 2018-08-03 10:12:00
 */
class ShareRewardWindow extends BaseWindow {
    private baseItem:BaseItem;
    private loaderIco:GLoader;
    private txtTime:fairygui.GTextField;
    /**已经分享的次数 */
    private txtCount:fairygui.GTextField;
    /**奖励的物品数量 */
    private txtNum:fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.MicroClient,"ShareRewardWindow")

	}
	public initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtTime = this.getGObject("txt_time").asTextField;
        this.txtCount = this.getGObject("txt_count").asTextField;
        this.txtNum = this.getGObject("txt_num").asTextField;

        //---- script make end ----
        this.baseItem.isShowName = false;
	}

	public updateAll(data?:any):void{
		let items:ItemData[] = ConfigManager.shareReward.getRewardByType(EShareRewardType.EShareRewardTypeShare);
        this.baseItem.itemData = items[0];
        this.baseItem.updateNum(""); 
        this.loaderIco.load(this.baseItem.itemData.getIconRes());
        this.txtNum.text = ""+this.baseItem.itemData.getItemAmount();
        let rewardTimes:number = CacheManager.platform.getShareRewardTimes(EShareRewardType.EShareRewardTypeShare);
        this.txtCount.text = `(${rewardTimes}/${PlatformCache.SHARE_REWARD_TIME})`;
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
    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);
        this.stopTimer();    
    }
}