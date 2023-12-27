class CreateRoleModule extends BaseModule {
	public selectRolePanel: SelectRolePanel;
	public createRolePanel: CreateRolePanel;
	public controller: fairygui.Controller;
	public static isCommonLoaded: boolean;

	public constructor() {
		super(ModuleEnum.CreateRole, PackNameEnum.CreateRole, "Main", LayerManager.UI_Cultivate);
	}

	public initOptUI(): void {
        // if (App.GlobalData.IsDebug) {
		// 	console.log("【加载2，显示创角或选角界面】登录成功后开始算，耗时：" + (egret.getTimer() - Sdk.testStepTimer) + "ms");
        // }
		this.controller = this.getController("c1");
		this.selectRolePanel = new SelectRolePanel(this.getGObject("panel_choice").asCom, this.controller, 0);
		this.createRolePanel = new CreateRolePanel(this.getGObject("panel_create").asCom, this.controller, 1);
	}

	public onShow(): void {
		super.onShow();
		//移除自己游戏的loading
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Loading);
		//移除php页面的div
		// Sdk.SdkToShowGame();
		//埋点设置: 进入选角页（不管创建角色还是选择已有角色
		// Sdk.logStep(SdkStepDefinition.SelectOrCreateRoleView);//CacheManager.serverTime.getServerTime()
	}

	public onHide(): void {
		super.onHide();
		this.selectRolePanel.clearRoleLoader();
		this.createRolePanel.clearRoleLoader();
	}

	public onAppInited(): void {
		this.createRolePanel.onAppInited();
	}

	public updateCreateRolePanel():void{
		this.createRolePanel.updateAll();
	}

	private onCommonLoadComplete(): void {
		CreateRoleModule.isCommonLoaded = true;
	}

	public updateAll(): void {
	}
}