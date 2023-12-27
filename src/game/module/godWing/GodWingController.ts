/**
 * 模块控制器
 * @author zhh
 * @time 2018-08-08 17:33:32
 */
class GodWingController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:GodWingModule;
	private _masterTips:GodWingMasterTips;
	public constructor() {
		super(ModuleEnum.GodWing);
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new GodWingModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameStrengthenExAccessoryTransfer],this.onTransfer,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRefineSmelt], this.onSmelt, this);

		this.addListen0(LocalEventEnum.ComposeReqPlan,this.onReqSmelt,this);
		this.addListen0(LocalEventEnum.GodWingReqEmbeded,this.onReqEmbeded,this);
		this.addListen0(LocalEventEnum.GodWingReqQickSmelt,this.onReqQickSmelt,this);
		this.addListen0(LocalEventEnum.GodWingReqTransfer,this.onReqTransfer,this);
		this.addListen0(NetEventEnum.packPosTypePropChange,this.onPropChange,this);
	}
	
	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenInfo, this);
		this.addListen1(LocalEventEnum.GodWingLookupMaster, this.onLookupMaster, this);
		//this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenUpgrade, this);
	}
	/**信息更新 */
	private onPlayerStrengthenInfo(data:any):void{
		this._moduleView.updateEquiPanel();
	}
	/**升级 */
	private onPlayerStrengthenUpgrade(data:any):void{
		
	}

	private onLookupMaster(roleIndex:number):void{
		if(!this._masterTips){
			this._masterTips = new GodWingMasterTips();
		}
		let suitLv:number = CacheManager.godWing.getSuitLevel(roleIndex);
		this._masterTips.show({curLevel:suitLv,roleIndex:roleIndex});
	}

	/**
	 * 转换成功返回
	 * data S2C_SStrengthenExAccessoryTransfer
	 */
	private onTransfer(data:any):void{
		console.log(data);		
	}
	/**合成返回 S2C_SSmelt */
	private onSmelt(data:any):void{
		console.log(data);		
	}

	/**道具背包变动 */
	private onPropChange():void{
		if(this.isShow){
			this._moduleView.updateByPropPack();
		}
	}

	/**请求合成 */
	private onReqSmelt(smeltPlanCode:number):void{
		ProxyManager.compose.smelt(smeltPlanCode);
	}

	private onReqEmbeded(roleIndex:number,StrengthenExType:number,type:number):void{
		ProxyManager.godWing.sendEmbeded(roleIndex,StrengthenExType,type);
	}

	private onReqQickSmelt(roleIndex:number,StrengthenExType:number,type:number):void{
		ProxyManager.godWing.sendQickSmelt(roleIndex,StrengthenExType,type);
	}

	private onReqTransfer(StrengthenExType:EStrengthenExType,fromItemCode:number,toItemCode:number,amount:number):void{
		ProxyManager.godWing.sendTransfer(StrengthenExType,fromItemCode,toItemCode,amount);
	}

}