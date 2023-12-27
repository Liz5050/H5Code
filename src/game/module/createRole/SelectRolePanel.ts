class SelectRolePanel extends BaseTabPanel {
	private bgLoader: GLoader;
	private roleNameTxt: fairygui.GTextField;
	private nameInput: fairygui.GTextInput;
	private roleList: List;
	private addBtn: fairygui.GButton;
	private roleController: fairygui.Controller;
	// private roleLoader: GLoader;

	private LOGIN_NAME: string = "LoginView_last_login_name_debug";
	private lastName: string;
	private loaderDict: { [career: number]: GLoader };
	private careers: Array<number>;
	private selectCareer: number;
	private isHasClickEnter: boolean;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void {
		this.bgLoader = <GLoader>this.getGObject("loader_bg");
		this.careers = [1, 2, 4];
		this.loaderDict = {};
		this.roleList = new List(this.getGObject("list_role").asList);
		this.roleController = this.view.getController("c1");
		// this.roleLoader = <GLoader>this.getGObject("loader_role");
		// this.loaderDict[1] = <GLoader>this.getGObject("loader_role_1");
		// this.loaderDict[2] = <GLoader>this.getGObject("loader_role_2");
		// this.loaderDict[4] = <GLoader>this.getGObject("loader_role_4");
		// this.addBtn = this.getGObject("btn_add").asButton;
		// this.addBtn.addClickListener(this.clickAddRoleBtn, this);
		this.roleList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onChange, this);
		this.getGObject("btn_login").addClickListener(this.clickEnterGameBtn, this);
		this.getGObject("btn_return").addClickListener(this.clickReturnBtn, this);
		//上线版本屏蔽返回
		this.getGObject("btn_return").visible = !Sdk.IsOnlineVersion;
		let loader: GLoader;
		for (let career of this.careers) {
			loader = <GLoader>this.getGObject("loader_role_" + career);
			this.loaderDict[career] = loader;
			loader.addEventListener(GLoader.RES_READY, this.onRoleLoaded, this);
		}
		// this.bgLoader.load(URLManager.getModuleImgUrl("bg.jpg", PackNameEnum.CreateRole));
	}

	public updateAll(): void {
		//移除php页面的div
		Sdk.SdkToShowGame();
		
		App.TimerManager.doDelay(1000, this.preloadCommon, this);
	}

    /**
     * 打开界面，静默加载Common
     */
	private preloadCommon(): void {
		ResourceManager.load(PackNameEnum.Common, UIManager.getPackNum(PackNameEnum.Common), new CallBack(() => {
			CreateRoleModule.isCommonLoaded = true;
			this.goOnEnter();
			//在创角界面，静默加载完common后，也加载导航包、Home包
			let framExc: FrameExecutor = new FrameExecutor(2);
			let newbieNecessaryArr: Array<string> = [PackNameEnum.Navbar, PackNameEnum.Home];
			for (let item of newbieNecessaryArr) {
				framExc.regist(function () {
					ResourceManager.load(item, UIManager.getPackNum(item));
				}, this);
			}
			framExc.execute();
		}, this));
	}

	public updateRole(data: Array<any>) {
		this.roleList.data = data;
		this.roleList.list.resizeToFit();
		this.lastName = egret.localStorage.getItem(this.LOGIN_NAME);
		let lastSelect: string = null;
		if (this.lastName) {
			lastSelect = egret.localStorage.getItem(this.lastName);
		}
		this.roleList.selectedIndex = lastSelect ? parseInt(lastSelect) : 0;
		// this.addBtn.visible = !(this.roleList.list.numItems > 1);
		this.onChange();
	}

	public clearRoleLoader(): void {
		for (let career of this.careers) {
			this.loaderDict[career].clear();
		}
	}

	private clickEnterGameBtn(): void {
		if (!App.isInit || !App.Socket.isConnecting() || !CreateRoleModule.isCommonLoaded) {
			this.isHasClickEnter = true;
			return;
		}
		ResourceManager.load(PackNameEnum.Common, UIManager.getPackNum(PackNameEnum.Common), new CallBack(this.onCommonLoadComplete, this));
	}

	private clickAddRoleBtn(): void {
		this.controller.selectedIndex = 1;
		// App.TimerManager.remove(this.scrollBG, this);
	}

	private clickReturnBtn(): void {
		// App.TimerManager.remove(this.scrollBG, this);

		this.roleList.data = [];
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CreateRole);
		//初始打开登录页面
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Login);
	}

	private onChange(): void {
		if (this.roleList.selectedData == null) {
			this.roleList.selectedIndex = 0;
		}

		this.selectCareer = CareerUtil.getBaseCareer(this.roleList.selectedData.career_I);
		if (this.selectCareer == 1) {
			this.roleController.selectedIndex = 1;
		} else if (this.selectCareer == 2) {
			this.roleController.selectedIndex = 0;
		} else if (this.selectCareer == 4) {
			this.roleController.selectedIndex = 2;
		}
		this.loaderDict[this.selectCareer].visible = true;
		this.loaderDict[this.selectCareer].load(URLManager.getModuleImgUrl(`img_role_${this.selectCareer}.jpg`, PackNameEnum.CreateRole));
	}

	private scrollBG(): void {
		// this.bgOne.x -= 1;
		// this.bgTwo.x -= 1;
		// if(this.bgOne.x < -this.bgOne.width){
		// 	this.bgOne.x = this.bgTwo.x + this.bgTwo.width -1;
		// }
		// if(this.bgTwo.x < -this.bgTwo.width){
		// 	this.bgTwo.x = this.bgOne.x + this.bgOne.width -1;
		// }
	}

	public roleListData(): Array<any> {
		return this.roleList.data;
	}

	private onCommonLoadComplete(): void {
		CreateRoleModule.isCommonLoaded = true;
		if (this.roleList.selectedIndex < 0) {
			this.roleList.selectedIndex = 0;
		}
		let playerId: number = this.roleList.selectedData.playerId_I;
		ProxyManager.createRole.loginRole(playerId);
		this.lastName = egret.localStorage.getItem(this.LOGIN_NAME);
		if (this.lastName) {
			egret.localStorage.setItem(this.lastName, this.roleList.selectedIndex.toString());
		}
		App.SoundManager.stopTalk();
		App.SoundManager.stopBg();
	}

	private onRoleLoaded(): void {
		for (let career of this.careers) {
			this.loaderDict[career].visible = career == this.selectCareer;
		}
	}

	private goOnEnter(): void {
		if (this.isHasClickEnter) {
			this.isHasClickEnter = false;
			this.onCommonLoadComplete();
		}
	}
}