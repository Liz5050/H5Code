/**
 * 日常任务面板
 * @author zhh
 * @time 2019-03-12 20:15:59
 */
class TrainDailyMissionPanel extends BaseTabView{
    private listMission:List;
	private proRewardView:TrainExpProgressView;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.listMission = new List(this.getGObject("list_mission").asList);
		this.proRewardView = new TrainExpProgressView(this.getGObject("pro_reward_com").asCom);
        //---- script make end ----


	}
	public updateAll(data?:any):void{
		let dailyEvents:any[] = ConfigManager.swordPoolEvent.getSortedEvents();       
		this.listMission.setVirtual(dailyEvents);	
		let param:any = data && data.delayScore?{delayScore:data.delayScore}:null;	
		this.proRewardView.updateAll(param);
	}
    
    public showEff(gx:number,gy:number):void{
        let startPoint:egret.Point = new egret.Point(gx,gy);
        let endPoint:egret.Point = this.proRewardView.getEffectPoint();           
        MoveMotionUtil.startExpEffect(startPoint, endPoint, -1,null,null,-1,false);
    }
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

	public hide():void{
		super.hide();
		if(this.proRewardView){
			this.proRewardView.cancleDelay();
		}
	}

}