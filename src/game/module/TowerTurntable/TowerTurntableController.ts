/**
 * 模块控制器
 * @author zhh
 * @time 2018-09-11 10:53:12
 */
class TowerTurntableController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:TowerTurntableModule;

	public constructor() {
		super(ModuleEnum.TowerTurntable);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new TowerTurntableModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLotteryRuneCopy], this.onLotteryRuneCopy, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLotteryRuneCopyInfo], this.onLotteryRuneCopyInfo, this);
	}
	
	public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.CopyTowerReqLottery,this.onReqLottery,this);
	}

	/**
	 * 抽奖成功后返回(播动画)
	 * message S2C_SRuneCopyLottery{
			optional int32 type = 1;  						 //lottery type
			optional Protocol_Public.SReward reward = 2;     //获得物品
			optional int32 index = 3;  						 //物品索引
		}
	 */
	private onLotteryRuneCopy(data:any):void{
		if(this.isShow){
			this._moduleView.playAni(data);
		}
	}
	/**
	 * 抽奖信息
	 * S2C_SRuneCopyLotteryInfo
	 */
	private onLotteryRuneCopyInfo(data:any):void{
		CacheManager.towerTurnable.setTurntableInfo(data);
		EventManager.dispatch(NetEventEnum.copyTowerLotteryInfo);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.CopyHall,CacheManager.copy.checkTips());
	}

	private onReqLottery(lotteryType:number):void{
		ProxyManager.copy.towerLottery(lotteryType);
	}

}