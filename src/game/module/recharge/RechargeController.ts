/**
 * 模块控制器
 * @author zhh
 * @time 2018-07-05 15:14:09
 */
class RechargeController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:RechargeModule;
	private _reqCdTime:number = 0;

	public constructor() {
		super(ModuleEnum.Recharge);
		this.viewIndex = ViewIndex.Two;
		this._reqCdTime = 0;
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new RechargeModule();
		}
		return this._moduleView;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateRechargeActiveInfo],this.onRechargeActiveInfo,this);		
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateRechargeRewardInfo],this.onRechargeRewardInfo,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePlayerPopFirstRecharge],this.onPlayerPopFirstRecharge,this);


		this.addListen0(LocalEventEnum.RechargeReqSDK,this.onRechargeReqSDK,this);
	}
	
	public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.VipUpdate,this.onVipUpdate,this);
	}

	private onVipUpdate():void{
		if(this.isShow){
			this._moduleView.updateAll();
		}
	}
	
	/**
	 * 充值信息
	 * SRechargeActiveInfo
	 */
	private onRechargeActiveInfo(data:any):void{		
		CacheManager.recharge.setRechargeActInfo(data);
		if(this.isShow){
			this._moduleView.updateAll();
		}
		EventManager.dispatch(LocalEventEnum.RechargeActInfo);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.RechargeFirst,CacheManager.recharge.isCanFirstRchGetReward());
		if(CacheManager.recharge.isFirstRecharge()){
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.RechargeFirst);
		}else{
			EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.RechargeFirst);
		}		
		Log.trace(Log.RECHARGE," 充值活动 onRechargeActiveInfo data: ",data);
	}	
	/**
	 * 充值奖励信息
	 * SRechargeRewardInfo
	 */
	private onRechargeRewardInfo(data:any):void{
		CacheManager.recharge.setRechargeRewardInfo(data);
		if(this.isShow){
			this._moduleView.updateAll();
		}
		Log.trace(Log.RECHARGE," 充值奖励信息 onRechargeRewardInfo data: ",data);
	}

	private onPlayerPopFirstRecharge(data:any=null): void {
	    EventManager.dispatch(LocalEventEnum.PlayerFirstDead);
    }

	/**
	 * 调用充值
	 */
	private onRechargeReqSDK(moneyRMB:number, productId:number):void{
        if(!CacheManager.recharge.checkCanRecharge()){
            return;
        }
		let nowDt:number = egret.getTimer();
		if(this._reqCdTime>nowDt){
			Log.trace(Log.TEST,"..防止充值狂点卡死..")
			return; //防止狂点卡死
		}
		this._reqCdTime = nowDt + 2000;
		Sdk.pay(moneyRMB, productId.toString());
	}

	
}