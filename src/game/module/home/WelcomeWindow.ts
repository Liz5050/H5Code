/**
 * 欢迎界面
 */
class WelcomeWindow extends BaseWindow {
	private startBtn: fairygui.GButton;
	// private mc: UIMovieClip;
	private fingerMc: UIMovieClip;

	public constructor() {
		super(PackNameEnum.Welcome, "WindowWelcome");
	}

	public initOptUI(): void {
		this.startBtn = this.getGObject("btn_start").asButton;
		// this.mc = UIMovieManager.get(PackNameEnum.MCStartGame2, -70, -119);
		// this.startBtn.addChild(this.mc);
		LayerManager.UI_Popup.addClickListener(this.clickStart, this);

		this.fingerMc = UIMovieManager.get(PackNameEnum.MCFinger, 131, 320);
		this.addChild(this.fingerMc);
	}

	public onShow(): void {
		super.onShow();
		//加载一些新手必备的预加载模型资源
		App.TimerManager.doDelay(100, this.preloadNewbieResource, this);
		//加载一些新手必备UI资源
		App.TimerManager.doDelay(1000, this.preloadNewbieNecessary, this);
		App.TimerManager.doDelay(5000, this.clickStart, this);

		//9. "popup_welcome_view" //(H5)弹出欢迎界面
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogStepNew[9]);
        }
	}

	public onHide(): void {
		App.TimerManager.remove(this.clickStart, this);
		super.onHide();
	}

	private clickStart(): void {
		LayerManager.UI_Popup.removeClickListener(this.clickStart, this);
		this.hide();
		CacheManager.role.isNewCreateRole = false;
		EventManager.dispatch(LocalEventEnum.TaskGotoActive);

		//10. "start_newbie_journey" //(H5)欢迎界面结束开始跑新手
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogStepNew[10]);
        }
	}

	/**
	 * 调用预加载
	 */
	private preloadNewbieResource(): void {
		ControllerManager.preload.welcomePreload();
	}

	private preloadNewbieNecessary(): void {
		let framExc: FrameExecutor = new FrameExecutor(2);
		let newbieNecessaryArr: Array<string> = [PackNameEnum.Welcome, PackNameEnum.TaskDialog, PackNameEnum.Home, PackNameEnum.MCFightFire, PackNameEnum.MCCheckPointFull, PackNameEnum.GuildePanel,
		PackNameEnum.MCTaskGet, PackNameEnum.MCTaskEnd, PackNameEnum.MCTaskComplete];
		for (let item of newbieNecessaryArr) {
			framExc.regist(function () {
				ResourceManager.load(item);
			}, this);
		}
		framExc.execute();
	}
}