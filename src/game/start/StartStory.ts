/**
 * 开始剧情
 */
class StartStory extends BaseWindow {
	private bgLoader: GLoader;
	private centerGroup: fairygui.GGroup;
	private storyTxt: fairygui.GTextField;
	private skipBtn: fairygui.GButton;
	private story: string = "       星辰异变，鸾凤悲鸣，璇玑皇城突发宫变，穹苍圣灵于混乱之中，救下天资聪慧的两个孩子。圣灵将二人的力量与记忆封印，隐姓埋名纳入玄元派门之下以避叛乱余党追杀。\n       白驹过隙，十年后孩子逐渐长大，等待他们的是平凡一生还是……";
	private i: number = 1;
	private callBack: Function;
	private caller: any;
	private timeoutKey: number = -1;

	public constructor() {
		super(PackNameEnum.StartStory, "Main", null, LayerManager.UI_Guide);
	}

	public initOptUI(): void {
		this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
		this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		this.bgLoader = <GLoader>this.getGObject("loader_bg");
		this.storyTxt = this.getGObject("txt_story").asTextField;
		this.skipBtn = this.getGObject("btn_skip").asButton;
		this.skipBtn.addClickListener(this.doHide, this);
		this.centerGroup = this.getGObject("group_center").asGroup;
		this.bgLoader.load(URLManager.getModuleImgUrl("bg.jpg", PackNameEnum.StartStory));
		this.bgLoader.addEventListener(GLoader.RES_READY, this.onBgLoaded, this);
	}

	public onShow(data: any = null): void {
		super.onShow(data);
		//8. "start_newbie_drama" //(H5)开始新手剧情介绍
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogStepNew[8]);
        }
	}

	private onBgLoaded(): void {
		//显示了剧情，才关掉登录和创角
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Login);
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CreateRole);

		this.centerGroup.visible = true;
		App.TimerManager.doTimer(70, this.story.length, this.updateStory, this);
		this.timeoutKey = egret.setTimeout(() => {
			this.doHide();
		}, this, 10000);

		//加载一些新手必备的预加载模型资源
		App.TimerManager.doDelay(100, this.preloadNewbieResource, this);

		//加载一些新手必备UI资源
		App.TimerManager.doDelay(1000, this.preloadNewbieNecessary, this);
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

	/**
	 * 关闭回调函数
	 */
	public setCallBack(callBack: Function, caller: any) {
		this.callBack = callBack;
		this.caller = caller;
	}

	public onHide(data: any = null): void {
		super.onHide(data);
		this.doCallBack();
		if (this.timeoutKey != -1) {
			egret.clearTimeout(this.timeoutKey);
		}
		this.bgLoader.clear();
	}

	private updateStory(): void {
		this.storyTxt.text = this.story.slice(0, this.i);
		this.i++;
	}

	private doCallBack(): void {
		if (this.callBack != null && this.caller != null) {
			this.callBack.apply(this.caller);
		}
	}

	private doHide(): void {
		egret.Tween.get(this).to({ alpha: 0 }, 500).call(() => {
			this.hide();
		})
	}
}