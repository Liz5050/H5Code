/**
 * 功能开启/预告
 */
class OpenController extends BaseController {
	private module: OpenModule;
	private upgradeSuccess:UpgradeSuccessView;
	// private tipWindow: OpenPreviewTipWindow;
	// private previewWindow: OpenPreviewWindow;
	// private openExecutor: OpenExecutor;
	// private isHomeOpened: boolean;

	private godWPOpenPanel: OpenGuideDetailPanel;

	private queueData: any[];

	public constructor() {
		super(ModuleEnum.Open);
		this.queueData = [];
	}

	public initView(): BaseWindow {
		this.module = new OpenModule(this.moduleId);
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.addListen0(NetEventEnum.roleLevelUpdate, this.onRoleLevelUp, this);
		this.addListen0(LocalEventEnum.TaskRemoved, this.onTaskRemoved, this);
		this.addListen0(NetEventEnum.roleCareerChanged, this.onRoleStateLvChange, this);
		this.addListen0(LocalEventEnum.PlayerCopyCheckPoint, this.onCheckPointUpdate, this);

		this.addListen0(LocalEventEnum.OpenShowDetailPanel, this.onOpenGuideDetail, this);
		this.addListen0(LocalEventEnum.TrainNewGodWeaponActive, this.onGodWeaponAct, this);
		this.addListen0(LocalEventEnum.OpenCheckNext, this.onCheckNext, this);
		this.addListen0(LocalEventEnum.OpenUpgradeSuccessView,this.onOpenUpgradeView,this);
		// this.addListen0(LocalEventEnum.TaskOpenEndUpdated, this.onTaskOpenEndUpdated, this);
		// this.addListen0(LocalEventEnum.TaskUpdateMy, this.onTaskUpdateMy, this);

		// this.addListen0(UIEventEnum.HomeOpened, this.homeOpened, this);
		// this.addListen0(UIEventEnum.OpenPreviewWindowOpen, this.openPreviewWindow, this);
		// this.addListen0(UIEventEnum.OpenFlyIconStart, this.flyIconStart, this);

		// this.addListen0(NetEventEnum.copyEnter, this.onEnterCopy, this);
		// this.addListen0(NetEventEnum.copyLeft, this.onLeftCopy, this);
	}

	/**
	 * 等级更新
	 */
	private onRoleLevelUp(data: any = null): void {
		let roleLevel: number = data.cur;
		let lastRoleLevel: number = data.last;
		let isInit: boolean = data.isInit;//登录时不处理
		let cfg: any = ConfigManager.mgOpen.getByLevel(roleLevel, lastRoleLevel);
		if (cfg != null && !isInit && (roleLevel - lastRoleLevel) > 0 && ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false)) {
			this.show(cfg);
		}
	}

	/**
	 * 任务结束
	 */
	private onTaskRemoved(taskCode: number): void {
		let task: any = ConfigManager.task.getByPk(taskCode);
		if (task != null && TaskUtil.isMain(task.taskGroup)) {
			let cfg: any = ConfigManager.mgOpen.getByOpenTask(taskCode);
			if (cfg != null && ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false)) {
				this.show(cfg);
			}
		}
	}

	/**转生等级改变 */
	private onRoleStateLvChange(): void {
		let roleState: number = CacheManager.role.getRoleState();
		let cfg: any = ConfigManager.mgOpen.getByRoleState(roleState);
		if (cfg != null && ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false)) {
			this.show(cfg);
		}
	}

	private onCheckPointUpdate(): void {
		//关卡更新
		let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		let cfg: any = ConfigManager.mgOpen.getByCondType(EOpenCondType.EOpenCondTypeCheckPoint, floor);
		if (cfg && ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false)) {
			if (cfg.openKey == MgOpenEnum.Wing) {//翅膀激活等捡完掉落再显示
				App.TimerManager.doDelay(3000, () => {
					this.show(cfg);
				}, this);
			}else if (cfg.openKey == MgOpenEnum.Pet || cfg.openKey == MgOpenEnum.Mount) {//宠物、坐骑
				App.TimerManager.doDelay(375, () => {
					this.show(cfg);
				}, this);
			} else {
				this.show(cfg);
			}
		}
	}

	private onOpenGuideDetail(data: any): void {
		if (!this.godWPOpenPanel) {
			this.godWPOpenPanel = new OpenGuideDetailPanel();
		}
		this.godWPOpenPanel.show(data);
	}

	private onGodWeaponAct(actInfo: any): any {
		let cfg: any = ConfigManager.mgOpen.getByCondType(EOpenCondType.EOpenCondTypeGodWeapon, actInfo.code);
		if (cfg && ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false)) {
			this.show(cfg);
		}
	}

	private onCheckNext(): void {
		if (this.queueData && this.queueData.length > 0) {
			this.show(this.queueData.shift());
		}
	}

	/**
     * 显示模块
     */
	public show(data?: any): void {
		if(data.isTitle){
			super.show(data);
			return;
		}
		
		let cfgFunc: any = ConfigManager.mgOpen.getOpenFuncByKey(data.openId);
		if (cfgFunc && !cfgFunc.showAct) {
			return;
		}
		if (this.isShow && !this.module.isShowingData(data)) {
			for (let info of this.queueData) {
				if (info.openId == data.openId) {
					return;
				}
			}
			this.queueData.push(data);
			return;
		}
		super.show(data);

	}

	/**进阶、激活成功展示界面 */
	private onOpenUpgradeView(data:any):void {
		if(!this.upgradeSuccess) {
			this.upgradeSuccess = new UpgradeSuccessView();
		}
		this.upgradeSuccess.show(data);
	}

	/**
	 * 开启任务更新了
	 */
	// private onTaskOpenEndUpdated(): void {
	// 	this.updatePreTip();
	// }

	/**
	 * 登录更新我的任务
	 */
	// private onTaskUpdateMy(): void {
	// 	this.checkBtnShow();
	// }

	/**
	 * 更新预览提示
	 */
	// private updatePreTip(): void {
	// 	//处理提示窗口
	// 	let previewCfg: any = ConfigManager.mgOpen.getPreviewInfo();
	// 	if (previewCfg != null) {
	// 		if (this.tipWindow == null) {
	// 			this.tipWindow = new OpenPreviewTipWindow();
	// 		}
	// 		if (!CacheManager.copy.isInCopy) {
	// 			this.tipWindow.show(previewCfg);
	// 		}

	// 	} else {
	// 		if (this.tipWindow != null) {
	// 			this.tipWindow.hide();
	// 		}
	// 	}
	// }

	/**
	 * 主界面打开完成
	 */
	private homeOpened(): void {
		// this.isHomeOpened = true;
		this.onRoleLevelUp({ "cur": CacheManager.role.getRoleLevel(), "last": 0, "isInit": true });

		// if (this.openExecutor == null) {
		// 	let homeController: HomeController = ControllerManager.home;
		// 	this.openExecutor = new OpenExecutor(homeController.module, homeController.navbar);
		// }
		// this.openExecutor.checkAll();
	}

	/**
	 * 打开功能预览窗口
	 */
	// private openPreviewWindow(cfg: any): void {
	// 	if (this.previewWindow == null) {
	// 		this.previewWindow = new OpenPreviewWindow();
	// 	}
	// 	this.previewWindow.show(cfg);
	// }

	/**
	 * 飘图标开始
	 * @param cfg 对应t_mg_open中的配置
	 */
	// private flyIconStart(cfg: any): void {
	// 	if (this.openExecutor != null) {
	// 		let btnName: string = cfg.showTypeArgs;
	// 		// let isNavbarBtn: boolean = OpenButtonCfg.isNavbarBtn(btnName);
	// 		if (btnName == "btn_pet") {//宠物图标才做移动效果
	// 			this.openExecutor.addToNavbar(btnName, 1, 1000);
	// 		}
	// 	}
	// }

	/**
	 * 进入副本成功
	 */
	// private onEnterCopy(): void {
	// 	if (this.tipWindow && this.tipWindow.isShow) {
	// 		this.tipWindow.hide();
	// 	}
	// }

	/**
	 * 退出副本成功
	 */
	// private onLeftCopy(): void {
	// 	if (this.tipWindow && !this.tipWindow.isShow) {
	// 		this.updatePreTip();
	// 	}
	// }

	/**
	 * 检测按钮显示
	 */
	// private checkBtnShow(): void {
	// if (this.isHomeOpened) {
	// 	if (this.openExecutor != null) {
	// 		this.openExecutor.checkAll();
	// 		//按钮显示改变了，刷新当前指引。比如指引390051_1出售时，由于等级改变了背包按钮移动了，会错误的指引到炼器
	// 		EventManager.dispatch(UIEventEnum.GuideRefreshCurrent);
	// 	}
	// }
	// }
}