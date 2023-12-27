class SevenDaysController extends BaseController {
	private sevenModule:SevenDaysModule;
	public constructor() {
		super(ModuleEnum.SevenDays);
	}
	protected initView():any{
		if(!this.sevenModule){
			this.sevenModule = new SevenDaysModule();
		}
		return this.sevenModule;
	}

	protected addListenerOnInit():void{
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSevenDayLoginReward],this.onSevenDayReward,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTodayOnlineDays],this.onlineDays,this);
		this.addListen0(LocalEventEnum.SevenDaysReqGetReward,this.onReqGetReward,this);
	}

	protected addListenerOnShow():void{

	}
	/**在线天数更新 */
	private onlineDays(data:any):void{
		CacheManager.sevenDay.onlineDays = data.intSeq.data_I[0];
		if(this.isShow){
			this.sevenModule.updateAll();
		}
		this.dispatchTipsEvent();
	}
	private onSevenDayReward(data:any):void{		
		CacheManager.sevenDay.updateReward(data.intSeq.data_I);
		if(this.isShow){
			this.sevenModule.updateAll();
		}
		this.dispatchTipsEvent();
	}
	private dispatchTipsEvent():void{
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,HomeModule.ActivityBtn,HomeUtil.checkOpenServerTips(),true);
	}
	private onReqGetReward(day:number):void{
		ProxyManager.sevenDay.getReward(day);
	}

}