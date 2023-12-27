/**
 * 模块控制器
 * @author zhh
 * @time 2018-07-06 21:02:58
 */
class RechargefirstController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:RechargeFirstModule;

	public constructor() {
		super(ModuleEnum.RechargeFirst);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new RechargeFirstModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.RechargeActInfo,this.onRechargeActiveInfo,this);
		this.addListen0(LocalEventEnum.TaskRemoved,this.onTaskComplete,this);
	}
	
	public addListenerOnShow(): void {
		EventManager.dispatch(LocalEventEnum.HideActivityWarTips);
		EventManager.dispatch(LocalEventEnum.HideBossRefreshTips);
		EventManager.dispatch(UIEventEnum.FirstRechargeOpen);
	}

	/**
	 * 充值信息
	 * SRechargeActiveInfo
	 */
	private onRechargeActiveInfo(data:any):void{				
		if(this.isShow){
			if(CacheManager.recharge.isFirstRecharge()){
				this.hide();
			}else{
				this._moduleView.updateAll();
			}			
		}		
	}

	private onTaskComplete(code:number):void {
		let cfg: any = ConfigManager.mgOpen.getByOpenKey(MgOpenEnum.ShowRechargeFirst);
		if(cfg) {
			if(cfg.openTask == code) {
				this.removeListener(LocalEventEnum.TaskRemoved,this.onTaskComplete,this);
				if(!CacheManager.recharge.isRechargedAny){//没充值过的才弹出首充
					this.show();
					ChatUtils.fakeVIPBroad();
				}
			}
		}
		else {
			this.removeListener(LocalEventEnum.TaskRemoved,this.onTaskComplete,this);
		}
		//完成首冲任务，显示广播
		if (code == ConfigManager.mgOpen.getOpenTask(MgOpenEnum.RechargeFirst) && !CacheManager.recharge.isRechargedAny) {
			ChatUtils.fakeVIPBroad();
		}
	}
}