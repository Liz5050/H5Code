/**
 * 日常(已经弃用的)
 */
class DailyController extends BaseController {
	private module: DailyModule;
	private levelUpWindow: DailySWordPoolUpWindow;

	public constructor() {
		super(ModuleEnum.Daily);
	}

	public initView(): DailyModule {
		this.module = new DailyModule();
		return this.module;
	}

	protected addListenerOnInit(): void {
		/*
		//日常功能暂时没有用了 已经迁移到 TrainController 监听和数据处理 2018-7-4 10:01:47
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolInfo], this.onSwordPoolInfo, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolEventUpdate], this.onSwordPoolEventUpdate, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolExpUpdate], this.onSwordPoolExpUpdate, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSwordPoolActivityInfo], this.onPoolActivityInfo, this);
		*/
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicOfflineWorkSec], this.onOfflineWorkSec, this);
	}

	protected addListenerOnShow(): void {
		//this.addListen1(LocalEventEnum.DailyGotoEvent, this.gotoEvent, this); //日常功能没有了 现在在爵位那里 先屏蔽掉 迁移到爵位 TrainController 2018-7-4 10:01:47
		//this.addListen1(LocalEventEnum.DailySPGetActivityReward, this.spGetActivityReward, this);
		
		//剑池相关
		this.addListen1(UIEventEnum.DailyUpWindowOpen, this.openUpWindow, this);
		this.addListen1(LocalEventEnum.DailySPUpgrade, this.spUpgrade, this);
		this.addListen1(LocalEventEnum.DailySPChangeModel, this.spChangeModel, this);
		
		this.addListen1(LocalEventEnum.DailySPNotShow, this.spNotShow, this);

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSwordPoolUpgrade], this.onSwordPoolUpgrade, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSwordPoolChangeModel], this.onSwordPoolChangeModel, this);

	}

	/**
     * 根据名称获取对象
     */
	public getGObject(name: string, ...param): fairygui.GObject {
		if (name == "btn_go") {
			return this.module.getGoBtn(MgOpenEnum.ETaskGroupMgGuild);
		}
		return null;
	}

	/**
	 * 剑池外形信息更新
	 * @param data SSWordPool
	 */
	private onSwordPoolInfo(data: any): void {
		CacheManager.daily.swordPool = data;
	}

	/**
	 * 剑池事件次数更新
	 * @param data SDictIntInt
	 */
	private onSwordPoolEventUpdate(data: any): void {
		CacheManager.daily.updateEventTime(data);
	}

	/**
	 * 剑池经验更新
	 * @param data SSeqAttributeUpdate
	 */
	private onSwordPoolExpUpdate(data: any): void {
		CacheManager.daily.updateExp(data);
		if (this.levelUpWindow && this.levelUpWindow.isShow) {
			this.levelUpWindow.updateAll();
		}
	}

	/**
	 * 活跃度更新
	 * @param data SSWordPoolActivity
	 */
	private onPoolActivityInfo(data: any): void {
		CacheManager.daily.swordPoolActivity = data;
		if (this.isShow) {
			this.module.updateDayActiveList();
		}
	}

	/**
	 * 更新离线挂机时间
	 */
	private onOfflineWorkSec(msg: any): void {
		if (this.isShow) {
			this.module.updateHangLeftTime();
		}
	}

	/**
	 * 前往日常事件
	 */
	private gotoEvent(event: ESWordPoolEvent): void {
		switch (event) {
			case ESWordPoolEvent.ESWordPoolEventTaskRing://赏金
				EventManager.dispatch(LocalEventEnum.TaskGotoMoneyRing);
				break;
			case ESWordPoolEvent.ESWordPoolEventTaskGuild://仙盟
				EventManager.dispatch(LocalEventEnum.TaskGotoGuildRing);
				break;
			case ESWordPoolEvent.ESWordPoolEventTaskTransport://护送
				EventManager.dispatch(LocalEventEnum.TaskGotoEscort);
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgBloodMatrix://圣灵血阵
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 1, "cName": "c2", "tabIndex2": 4, "cName2": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgRingBoss://仙帝宝库
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 0, "cName": "c2", "tabIndex2": 2, "cName2": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgExperience://九幽魔窟
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 1, "cName": "c2", "tabIndex2": 3, "cName2": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventCopyMgNormalDefense://守护仙灵
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 0, "cName": "c2", "tabIndex2": 1, "cName2": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventStrengthen://装备强化
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, { "tabIndex": 0, "cName": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventGameBoss://世界boss
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.WorldBoss, { "tabIndex": 0, "cName": "c1" });
				break;
			case ESWordPoolEvent.ESWordPoolEventHook://推荐挂机
				EventManager.dispatch(UIEventEnum.WorldMapShowProposeMap);
				break;
		}
	}

	/**打开剑池升级窗口 */
	private openUpWindow(): void {
		if (this.levelUpWindow == null) {
			this.levelUpWindow = new DailySWordPoolUpWindow();
		}
		this.levelUpWindow.show();
	}

	/**剑池升级 */
	private spUpgrade(): void {
		ProxyManager.daily.upgrade();
	}

	/**改变模型 */
	private spChangeModel(modelId: number): void {
		ProxyManager.daily.changeModel(modelId);
	}

	/**领取奖励 */
	private spGetActivityReward(idx: number): void {
		ProxyManager.daily.getActivityReward(idx);
	}

	/**隐藏模型 */
	private spNotShow(isHide: boolean): void {
		ProxyManager.daily.hideModel(isHide);
	}

	/**
	 * 剑池升级，升级成功自动幻化
	 * @param data S2C_SSwordPoolUpgrade
	 */
	private onSwordPoolUpgrade(data: any): void {
		CacheManager.daily.swordPool.exp_I = data.exp;
		CacheManager.daily.swordPool.level_I = data.level;
		let cfg: any = ConfigManager.swordPool.getByPk(data.level);
		this.spChangeModel(cfg.modelId);
	}

	/**
	 * @param data S2C_SSwordPoolChangeModel
	 */
	private onSwordPoolChangeModel(data: any): void {
		CacheManager.daily.swordPool.useModelId_I = data.useModelId;
		if (this.levelUpWindow && this.levelUpWindow.isShow) {
			this.levelUpWindow.updateAll(data.useModelId);
		}
	}
}