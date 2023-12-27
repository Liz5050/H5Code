/**
 * 炼器
 * @author shiyong
 */
class RefineController extends BaseController {
	private module: RefineModule;

	public constructor() {
		super(ModuleEnum.Refine);
	}

	public initView(): BaseModule {
		this.module = new RefineModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameStrengthen], this.onStrengthenResult, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameJewelEmbed], this.onJewelEmbedResult, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameJewelGetOff], this.onJewelGetOffResult, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameOpenRefresh], this.onOpenRefresh, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRefresh], this.onRefresh, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerLevelWhen3State], this.onPlayerLevelWhen3State, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateRefreshFreeTime], this.onRefreshFreeTime, this);
		
		
	}

	public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.Strength, this.strength, this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
        this.addListen1(NetEventEnum.packPosTypeBagChange, this.backpackChange, this);
	}

	public afterModuleHide(): void {
		CacheManager.refine.isOneKeyStrengthening = false;
	}

	/**
	 * 强化
	 */
	private strength(data: any): void {
		ProxyManager.refine.strengthen(data.uid, data.autoBuy);
	}

	/**
	 * 宝石镶嵌返回
	 * @param data S2C_SJewelEmbed
	 */
	private onJewelEmbedResult(data: any): void{
		// let playerId: number = data.resultPlayerItem.playerId_I;
		let itemData: ItemData = new ItemData(data.resultPlayerItem);
		this.module.updataStonePanel(itemData);
	}

	/**
	 * 宝石卸下返回
	 * @param data S2C_SJewelGetOff
	 */
	private onJewelGetOffResult(data: any): void{
		let itemData: ItemData = new ItemData(data.resultPlayerItem);
		this.module.updataStonePanel(itemData);
	}

	/**
	 * 装备洗练槽开启返回
	 * @param data S2C_SOpenRefresh
	 */
	private onOpenRefresh(data: any): void{
		let itemData: ItemData = new ItemData(data.resultPlayerItem);
		this.module.updateRefresh(itemData);
	}

	/**
	 * 装备洗练返回
	 * @param data C2S_SRefresh
	 */
	private onRefresh(data: any): void{
		let itemData: ItemData = new ItemData(data.resultPlayerItem);
		this.module.updateRefresh(itemData);
	}

	/**
	 * 角色三转时的等级
	 * 0为未完成3转
	 */
	private onPlayerLevelWhen3State(data: any): void{
		CacheManager.role.playerLevelWhen3State = data.value_I;
	}

	/**洗练剩余免费次数 */
	private onRefreshFreeTime(data: any): void{
		CacheManager.refine.refreshFreeTime = data.value_I;
		if(this.isShow){
			this.module.updateRefreshBtnTip();
		}
	}

	private backpackChange():void{
		this.module.updateRefreshStone();
		this.module.updataStoneTip();
	}

	/**
	 * 强化结果返回
	 * @param data S2C_SStrengthen
	 */
	private onStrengthenResult(data: any): void {
		let result: boolean = data.result;
		//更新角色背包的物品
		let newItemData: ItemData = CacheManager.pack.rolePackCache.updateItemBySPlayerItem(data.resultPlayerItem);
		//先更新缓存，再更新界面
		this.module.updateByStrengthenReuslt(data);

		//不能强化时，停止一键强化
		if (CacheManager.refine.isOneKeyStrengthening) {
			if (!CacheManager.refine.isCanStrengthen(newItemData, true)) {
				this.module.enableOneKey(false);
				return;
			}
			//防止强化过快，延迟1秒执行
			App.TimerManager.doTimer(500, 1, this.strengthenByOneKey, this);
		}
	}

	/**一键强化中继续强化 */
	private strengthenByOneKey(): void {
		if (CacheManager.refine.isOneKeyStrengthening) {
			this.module.strengthenOne();
		}
	}
}