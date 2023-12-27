class CreateRoleController extends BaseController {
	public static isModuleShow: boolean;
	public static isCreateRoleSuccess: boolean;
	/** config.json配置是否加载完成 */
	public static isSecondPreloadDone: boolean = false;
	public static isSecondPreloadStart: boolean = false;//如果还会再出现加载2次config的情况，就用这个字段优化
	private module: CreateRoleModule;
	private simulateProgressNo: number = 0;
	/**
	 * 	optional int32 playerId = 1;
	* 	optional string name = 2;
	* 	optional string key = 3;
	* 	optional string url = 4;
	* 	optional int64 loginId = 5;
	*/
	private loginData: any;
	private mapId: number;

	// private LAST_LOGIN_ROLE:string = "SelectRolePanel_last_login_role_debug";
	private LOGIN_NAME: string = "LoginView_last_login_name_debug";
	private loginRoleDatas: Array<any>; //直接是：S2C_SLogin.data.myRoles.data的对应

	public constructor() {
		super(ModuleEnum.CreateRole);
	}

	public initView(): BaseModule {
		this.module = new CreateRoleModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLogin], this.loginSuccess, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCreateRole], this.createRole, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLoginRole], this.loginRole, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLoginGame], this.onLoginGameSuccess, this);

	}

	public addListenerOnShow(): void {
		this.addListen1(UIEventEnum.CreateReturn, this.createReturn, this);
		// this.addListen1(LocalEventEnum.AppInited, this.onAppInited, this);
	}

	public afterModuleShow(data?: any): void {
		super.afterModuleShow(data);
		if (this.loginRoleDatas && this.loginRoleDatas.length > 0) {
			this.module.selectRolePanel.updateRole(this.loginRoleDatas);
		}
	}

	private createReturn(): void {
		if (this.module.selectRolePanel.roleListData() && this.module.selectRolePanel.roleListData().length > 0) {
			this.module.controller.selectedIndex = 0;
		}
		else {
			EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CreateRole);
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Login);
			App.SoundManager.stopTalk();
			App.SoundManager.stopBg();
		}
	}

	/**
	 * 登录成功返回
	 */
	private loginSuccess(data: any) {

		if (Sdk.is_new) {
			Sdk.logStep(Sdk.LogPreloadStep[8]);
		}

		this.loginRoleDatas = data.myRoles.data;
		console.log("loginSuccess: ", this.loginRoleDatas);
		Sdk.testStepTimer = egret.getTimer();
		this.loginSuccessToOpen();
	}

	/**
	 * 线上版本，直接php跳转到选角或创角页
	 */
	// public phpLoginSuccess() {
	// 	this.loginRoleDatas = Sdk.role_datas;
	// 	console.log("phpLoginSuccess: ", this.loginRoleDatas);
	// 	this.loginSuccessToOpen();
	// }

	/**
	 * 内网或外网，登录成功后的统一处理
	 */
	private loginSuccessToOpen() {
		if (this.loginRoleDatas && this.loginRoleDatas.length > 0) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CreateRole, { "tabIndex": 0 });
		}
		else {
			if (!CreateRoleController.isModuleShow) {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CreateRole, { "tabIndex": 1 });
			} else {
				this.module.updateCreateRolePanel();
			}
		}
	}

	/**
	 * 创角返回
	 */
	private createRole(data: any) {
		// if(data){
		// 	ProxyManager.createRole.loginGame(this.loginData.playerId, "bavol", this.loginData.name, this.loginData.loginId, this.loginData.key, "1.0.0", "", "s", "macAddress");
		// }
		// egret.localStorage.setItem(this.LAST_LOGIN_ROLE, this.module.selectRolePanel.roleListData().length.toString());
		let lastName: string = egret.localStorage.getItem(this.LOGIN_NAME);
		if (lastName) {
			if (this.module.selectRolePanel.roleListData() && this.module.selectRolePanel.roleListData().length > 0) {
				egret.localStorage.setItem(lastName, this.module.selectRolePanel.roleListData().length.toString());
			}
			else {
				egret.localStorage.setItem(lastName, "0");
			}
		}
		CacheManager.role.isNewCreateRole = true;
		CreateRoleController.isCreateRoleSuccess = true;
		console.log("!!!!创建角色成功, CacheManager.role.isNewCreateRole:", CacheManager.role.isNewCreateRole);
		if (Sdk.is_new) {
			Sdk.logStep(Sdk.LogStepNew[7]);
			Sdk.logStep(Sdk.LogPreloadStep[14]);
		}
	}

	/**
	 * 角色登录返回
	 */
	private loginRole(data: any) {
		if (Sdk.is_new) {
			Sdk.logStep(Sdk.LogPreloadStep[15]);
		}

		//url处理，重新连接服务器，连接gate服务器，原先是login服务器
		console.log("直接打印: S2C_SLoginRole返回:", data);
		if (!data || data.url == null) {
			alert("S2C_SLoginRole返回，data为空或data.url为空");
			return;
		}
		this.loginData = data;

		var splitUrlArr: string[] = data.url.split(":");
		var newHost: string = splitUrlArr[0];
		var newPort: any = splitUrlArr[1];

		//https支持后端，如果是域名，有规则转换, Sdk.server_ip
		if ((location.protocol == "https:" && !App.JSUtils.CheckValidIP(Sdk.server_ip))
			|| App.DeviceUtils.IsWXGame) {
			newHost = Sdk.server_ip;
			newPort = parseInt(data.sslUrl);
			console.log("https支持后端，如果是域名，有规则转换,", Sdk.server_ip, ", newHost:", newHost, ", newPort:", newPort);
		}

		//开始登录gate服务器，用角色登录
		App.Socket.close(false);
		App.Socket.initServer(newHost, newPort);

		//新角色创建角色的话，要预加载其他东西
		if (Sdk.is_new) {
			//显示加载页同时关闭创角
			EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CreateRole);
			Sdk.SdkToHideGame();
			this.simulateProgressBar();

			// console.log("2次读条: connectToLoginGate时isSecondPreloadDone：", CreateRoleController.isSecondPreloadDone);
			if (CreateRoleController.isSecondPreloadDone) {
				// console.log("2次读条: connectToLoginGate, 加载已完成直接初始化");
				this.onResourceLoadComplete();
			} else {
				// console.log("2次读条: connectToLoginGate，加载未完成，重新加载");
				var groupName: string = "preload";
				var subGroups: Array<string> = ["preload_config"];
				App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
			}
		} else {
			// console.log("2次读条: 不是新手不需要。。。");
			this.listerToLoginGate();
		}
	}

	public listerToLoginGate(): void {
		Sdk.add_log_message("重连类型:listerToLoginGate");
		App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.connectToLoginGate, this);

		Sdk.logStep(Sdk.LogSocketStep[3]);
		App.Socket.connect();
	}

	private connectToLoginGate(): void {
		Sdk.logStep(Sdk.LogSocketStep[4]);
		// Log.trace(Log.GAME, "loginRole后，连接成功~~~，连接gate服务器，发现：ECmdGameLoginGame");
		if (this.loginData != null) {
			ProxyManager.createRole.loginGame(this.loginData.playerId, "bavol", this.loginData.name, this.loginData.loginId, this.loginData.key, "1.0.0", "", "s", "macAddress");
			App.MessageCenter.removeListener(SocketConst.SOCKET_CONNECT, this.connectToLoginGate, this);
			ControllerManager.login.doHeartbeat(true);
		}
	}

    /**
     * 资源组加载完成
     */
	private onResourceLoadComplete(groupName: string = ""): void {
		Init.init_after_newbie();
		this.listerToLoginGate();
	}

    /**
     * 资源组加载进度
     */
	private onResourceLoadProgress(itemsLoaded: number, itemsTotal: number, itemName: string = ""): void {
		// console.log("2次读条: onResourceLoadProgress", itemsLoaded, itemsTotal, itemName);
		// Sdk.SdkToShowLoadProgress(30*itemsLoaded, "即将进入场景，请稍后");
	}

	private simulateProgressBar(): void {
		App.TimerManager.doTimer(25, 20, this.showProgressBarValue, this);
	}

	private showProgressBarValue(): void {
		this.simulateProgressNo++;
		let progress: number = 5 * this.simulateProgressNo;
		let progressStr: string = "([" + progress.toString() + "/100]进入场景中)"
		if(App.DeviceUtils.IsWXGame) {
			if(!ControllerManager.loading) {
            	ControllerManager.initLoading();
        	}
        	EventManager.dispatch(LocalEventEnum.LoadingProgressUpdate,progress, 100);
		}
		else {
			Sdk.SdkToShowLoadProgress(progress, progressStr);
		}
	}

	private onLoginGameSuccess(data: any): void {
		Sdk.testStepTimer = egret.getTimer();

		Log.trace(Log.GAME, "===登录返回角色信息onLoginGameSuccess");
		CacheManager.role.sLoginGame = data;
		this.loginData.pos = data.pos;
		ResourceManager.load(PackNameEnum.Common, UIManager.getPackNum(PackNameEnum.Common), new CallBack(this.loginGame, this, data));
	}

	/**
	 * 角色登录返回S2C_SLoginGame
	 * 	optional int32 sysDt = 1;					//服务器时间
	 * 	optional SPos pos = 2;		//玩家位置
 	 * 	optional SEntityId entityId = 3;
	 * 	optional SPlayer player = 4;				//基础玩家
	 * 	optional SRole role = 5;				//基础角色
	 * 	optional SFightAttribute baseFight = 6;	//基本战斗属性
	 * 	optional SMoney money = 7;					//玩家钱包
	 * 	optional SeqRealRole realRoles = 8;			//新玩家多角色信息列表
	 */
	private loginGame(data: any) {
		this.mapId = data.pos.map_I;
		console.log("角色登录返回S2C_SLoginGame");
		console.log("===登录都OK，进入主场景, 地图ID :", this.mapId, this.loginData);
		console.log("===登录都OK，loginRoleDatas :", this.loginRoleDatas);

		//先加载地图资源
		// CacheManager.map.mapId = this.mapId;
		// ControllerManager.scene.preloadMapRes(CacheManager.map.getMapResId(), this.startEnterScene, this);

		//ajax上报平台角色、设备有关信息
		// var serverUrl = Sdk.phpapi_url + "?action=update_player";
		var serverUrl = Sdk.phpapi_url;
		var param = "action=update_player"
			+ "&sid=" + Sdk.server  //server
			+ "&usid=" + data.player.proxyId_I  //old_server
			+ "&uname=" + Sdk.username //username
			+ "&pid=" + this.loginData.playerId //player_id
			+ "&main=" + "1" //phone_type
			+ "&role=" + data.player.name_S //name
			+ "&level=" + data.role.level_I //level
			+ "&sex=" + data.player.sex_I //sex
			+ "&career=" + data.role.career_I //career
			+ "&oid=" + Sdk.platformCode //platform
			+ "&gcid=" + Sdk.gcid //game_channel_id
			+ "&os=" + App.DeviceUtils.getOSType //os_code
			+ "&device=" + "mobile"
			+ "&identity=" + "0"
			+ "&mac=" + "0"
			+ "&md5mac=" + "0"
			+ "&time=" + data.sysDt;

		// console.log("ajax请求：serverUrl", serverUrl);
		// console.log("ajax请求：param", param);
		// HttpClient.getByUrl(serverUrl, function (data) {
		// 	console.log("back, action=update_player:", data);
		// }, this, param, egret.HttpResponseType.TEXT);
		// let 


		Sdk.player_data.role_id = data.player.playerId_I + "";
		Sdk.player_data.nickname = data.player.name_S;
		Sdk.player_data.level = data.role.level_I || 0;
		Sdk.player_data.vip_level = data.player.VIP_BY;
		Sdk.player_data.server_id = data.player.serverId_I;
		Sdk.player_data.is_new = CacheManager.role.isNewCreateRole ? 1 : 0;
		Sdk.player_data.proxy_id = data.player.proxyId_I;
		Sdk.player_data.sex = data.player.sex_I;
		Sdk.player_data.career = data.role.career_I;
		Sdk.player_data.role_level_reborn = Math.floor(Sdk.player_data.career / 1000);
		Sdk.player_data.username = data.player.username_S;
		Sdk.player_data.createTime = data.player.createDt_DT;
		Sdk.player_data.lastLoginTime = data.player.lastLoginDt_DT;
		Sdk.player_data.enterTime = data.sysDt;
		Sdk.player_data.camp = data.player.camp_I;
		Sdk.player_data.score = data.role.warfare_L64 || 0;
		console.log("进入游戏上报的转生和战力分别是: ", Sdk.player_data.role_level_reborn, Sdk.player_data.score);

		//设备相关
		Sdk.player_data.os = App.DeviceUtils.getOSType;
		Sdk.player_data.device = egret.Capabilities.os;
		Sdk.player_data.identity = "0";
		Sdk.player_data.mac = "0";
		Sdk.player_data.md5mac = "0";
		Sdk.player_data.time = data.sysDt;

		//金钱相关
		Sdk.player_data.coinBind = data.money.coinBind_L64;
		Sdk.player_data.gold = data.money.gold_I;

		//处理SMyRole
		if (this.loginRoleDatas && this.loginRoleDatas.length > 0) {
			console.log("直接打印this.loginRoleDatas.length: ", this.loginRoleDatas.length);
			let myRole: any = this.getEnterSMyRole(data.player.playerId_I);
			if (myRole) {
				Sdk.player_data.oldServerId = myRole.oldServerId_I;
				Sdk.player_data.main = myRole.isMain_I;
			}
		}

		if (CacheManager.role.isNewCreateRole) {
			Sdk.createLog();
		}
		Sdk.enterLog();
		Sdk.updatePlayer();
		if(App.DeviceUtils.IsWXGame) {
			console.log(param);
			WXGameUtil.updatePlayer(param,null, this);
		}
		//埋点设置: 进入选角页（不管创建角色还是选择已有角色
		// Sdk.logStep(SdkStepDefinition.RoleEnterGameSucces);

		//sdk初始化后，直接进入场景
		this.startEnterScene();
	}

	private getEnterSMyRole(playerId: number): any {
		for (let roleData of this.loginRoleDatas) {
			if (playerId == roleData.playerId_I) {
				return roleData;
			}
		}
		return null;
	}

	/** 账号登录那些都OK后，进入主场景 */
	private startEnterScene() {
		// if (CacheManager.role.isNewCreateRole) {
		// 	this.showStartStory();
		// } else {
		// 	this.doEnterGame();
		// }
		this.doEnterGame();
	}

	/**显示开场剧情 */
	private showStartStory(): void {
		// EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Login);
		// EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CreateRole);
		let startStory: StartStory = new StartStory();
		startStory.setCallBack(this.doEnterGame, this);
		startStory.show();
	}

	private doEnterGame(): void {
		//进入游戏
		Main.gameStart.enterGame(this.mapId, this.loginData);
	}

	/**app初始化完成 */
	private onAppInited(): void {
		this.module.onAppInited();
	}
}