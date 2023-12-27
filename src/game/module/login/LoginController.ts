
class LoginController extends BaseController {
    //本模块的数据存储
    private loginModel: LoginModel;
    //本模块的所有UI
    private loginView: LoginView;
    private _needReLogin: boolean = false;
    private _killTips: string = "与服务器断开连接，点击确定重新连接";

    private _appPauseTime: number;
    private _appResumeTime: number;

	private simulateProgressNo: number = 0;

    public constructor() {
        super(ModuleEnum.Login);

        //初始化Model
        this.loginModel = new LoginModel(this);
    }

    public initView(): LoginView {
        this.loginView = new LoginView();
        return this.loginView;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(ECmdCoreCommand[ECmdCoreCommand.ECmdCoreKillUser], this.onKillUser, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateServerSysDate], this.onServerDate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateServerOpenDate], this.onServerOpenDate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTodayOnlineTime],this.onOnlineTimeUpdate,this);
        this.addListen0(LocalEventEnum.Login, this.onLogin, this);
        this.addListen0(LocalEventEnum.AppPause, this.appPause, this);
        this.addListen0(LocalEventEnum.AppResume, this.appResume, this);
        this.addListen0(LocalEventEnum.WXGetSeverListSuccess, this.updateServerList, this);
        this.addListen0(LocalEventEnum.WXLoadConfigSecondStart, this.loadConfig, this);
    }

    public updateServerList() {
        if(this.loginView) {
            this.loginView.updateServerList();//更新一下服务器列表
        }
    }


    private appPause() {
        this._appPauseTime = Date.now();
    }

    private appResume() {
        this._appResumeTime = Date.now();
        // console.log("间隔了: " + (this._appResumeTime - this._appPauseTime));
    }

	/**
	 * 玩家被踢，原因见：EKickOutReason.ts
	 */
    private onKillUser(data: any) {
        let value: number = data.value_I;
        // switch (value) {
        //     case EKickOutReason.EKickOutReasonByElseLogin:
        //         break;
        // }
        Log.trace(Log.GAME, "onKillUser: ", value);
        if (value >= 0 && value <= 13) {
            if (App.DebugUtils.isDebug) {
                this._killTips = LangNetwork.LANG[value];
            } else {
                this._killTips = LangNetwork.LANG3[value];
            }
        }
        Sdk.add_log_message("onKillUser, value: " + value + ", tips:" + this._killTips);
        if (ControllerManager.scene.sceneState == SceneStateEnum.None) {
            Sdk.popup_php_msg(this._killTips);
        }
        // AlertII.show(this._killTips,null,function(){
        //     location.reload();
        // },this,[AlertType.YES],["确定"]);

        this._needReLogin = true;
    }

    /**
     * 请求登陆处理
     * @param userName
     * @param pwd
     */
    private onLogin(userName: string, pwd: string): void {
        Log.trace(Log.GAME, "开始请求登录：", userName, pwd, this.loginModel.hasReqLogin);
        if (this.loginModel.hasReqLogin) return;

        this.loginModel.accountName = userName;
        this.loginModel.pwd = pwd;
        this.loginModel.hasReqLogin = true;

        // Log.trace(Log.GAME, "开始请求登录：", userName, pwd);
        //开始连接login服务器
        // App.Init(); //移到GameStart.ts
        this.initNetwork();
        // this.loginProxy.sendC2S_SLogin(userName, pwd);
    }

	/**
	 * 线上版本，直接php登录成功，跳转到选角或创角页
	 */
    public phpLogin():void {
        App.Init();
        //服务端口和IP改变
        App.Socket.initServer(Sdk.server_ip, Sdk.server_port);
		this.initNetwork();
    }

    /**
     * 初始化网络连接
     */
    private initNetwork(): void {
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.socketConnectToLogin, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_RECONNECT, () => {
            Log.trace(Log.GAME, "与服务器重新连接上");
            ProxyManager.createRole.login();
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_START_RECONNECT, () => {
            Log.trace(Log.GAME, "开始与服务器重新连接");
        }, this);
        //断网或顶号
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, () => {
            this.doHeartbeat(false);
            EventManager.dispatch(NetEventEnum.SocketClose);
            Log.trace(Log.RPG,"断开连接NetEventEnum.SocketClose");
            AlertII.show(this._killTips,null,function(){
                if (Sdk.IsOnlineVersion && ControllerManager.createRole.isShow) {
                    App.Socket.connect();
                } else {
                    if (this._needReLogin || ControllerManager.createRole.isShow) {
                        Sdk.SdkRefreshPage();
                    } else {
                        if (ControllerManager.login.needConnectFromLogin) { //服务器超过60秒+10秒后，就只能刷新重新登陆才可以上游戏了
                            // ControllerManager.login.ReconnectFromLogin();
                            ControllerManager.createRole.listerToLoginGate();
                        } else {
                            ControllerManager.createRole.listerToLoginGate();
                        }
                    }
                }
            },this,[AlertType.YES],[LangCommon.L26],"",false);
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, () => {
            this.loginModel.hasReqLogin = false;
            this.doHeartbeat(false);
            EventManager.dispatch(NetEventEnum.SocketClose);
            let noConnectTips = this._killTips;
            if (ControllerManager.login.isShow) {
                noConnectTips = "此服务器未开放，请选择其他服务器";
            }
            AlertII.show(noConnectTips,null,function(){
                if(!ControllerManager.login.isShow) {
                    if(this._needReLogin) {
                        Sdk.SdkRefreshPage();
                    }
                    else {
                        if (ControllerManager.login.needConnectFromLogin) { //服务器超过60秒+10秒后，就只能刷新重新登陆才可以上游戏了
                            // ControllerManager.login.ReconnectFromLogin();
                            ControllerManager.createRole.listerToLoginGate();
                        } else {
                            ControllerManager.createRole.listerToLoginGate();
                        }
                    }
                }
            },this,[AlertType.YES],[LangCommon.L26],"",false);
        }, this);

        Sdk.logStep(Sdk.LogSocketStep[1]);
        App.Socket.connect();
    }

    /** 先联调，回头需要写一个只侦听一次的统一管理方法 */
    private socketConnectToLogin(): void {
        Sdk.logStep(Sdk.LogSocketStep[2]);
        this.loginModel.hasReqLogin = false;
        // if (!Sdk.IsOnlineVersion) {
            ProxyManager.createRole.login();
        // }

        App.MessageCenter.removeListener(SocketConst.SOCKET_CONNECT, this.socketConnectToLogin, this);
        this.doHeartbeat(true);
    }

	/**
	 * 游戏内重新登陆，断线、顶号之类的，重新连接login服，再连接gate服
	 */
    public ReconnectFromLogin():void {
        Sdk.add_log_message("重连类型:ReconnectFromLogin");
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.socketConnectToLogin, this);
        App.Socket.initServer(Sdk.server_ip, Sdk.server_port);
        App.Socket.connect();
    }

    public doHeartbeat(flag: boolean): void {
        if (flag) {
            if (App.TimerManager.isExists(this.sendHearbeatCmd, this) == false)
                App.TimerManager.doTimer(10000, 0, this.sendHearbeatCmd, this);
            // CacheManager.task.isEnableStandTimer = true;
        }
        else {
            CacheManager.king && CacheManager.king.stopKingEntity();//停止心跳，自然也要停止角色
            ControllerManager && ControllerManager.taskDialog.hide(); //这里需要关闭全部一、二级UI，先只关闭对话框，后面再加
            App.TimerManager.remove(this.sendHearbeatCmd, this);
            // CacheManager.task.isEnableStandTimer = false;
        }
    }

    private sendHearbeatCmd(): void {
        let msg: any = {};
        msg.cmd = ECmdGame[ECmdGame.ECmdGameKeepActive];
        msg.body = {};
        App.Socket.send(msg);
    }

    /**
     * SDate
     */
    private onServerDate(SDate:any): void {
        CacheManager.serverTime.startClock(SDate.dateVal_DT);
    }

    /**
     * 开服合服时间信息
     * SServerOpenDate
     */
    private onServerOpenDate(data:any):void {
        CacheManager.serverTime.updateOpenServerDate(data);
    }

    /**
     * 今日累计在线时间更新
     * SSeqInt
     */
    private onOnlineTimeUpdate(data:any):void {
        CacheManager.serverTime.updateOnlineTime(data.intSeq.data_I);
    }

    /**
     * 返回登录界面，切换账号
     */
    public returnToLogin(): void {
        this.doHeartbeat(false);
        App.Socket.close();
        ControllerManager.scene.sceneState = SceneStateEnum.None;
        EventManager.dispatch(LocalEventEnum.ReloginCloseGameView);
        this.show();//外网情况下，php会弹php的登录页
    }

    public set hasReqLogin(value: boolean) {
        this.loginModel.hasReqLogin = value;
    }

    public set needReLogin(value: boolean) {
        this._needReLogin = value;
    }

    public get needReLogin(): boolean {
        return this._needReLogin;
    }

    public get appPauseTime(): number {
        return this._appPauseTime;
    }

    public get appResumeTime(): number {
        return this._appResumeTime;
    }

    public get canReconnectLeftTime(): number {
        return (300 + ConfigManager.const.getConstValue("OfflineQuickLinkLastTime")) * 1000;
    }

    /** 超时是否需要重新连登陆login服 */
    public get needConnectFromLogin(): boolean {
        Sdk.add_log_message("返回游戏time:" + this._appResumeTime);
        Sdk.add_log_message("进入后台time:" + this._appPauseTime);
        let intervalLeft: number = this._appResumeTime - this._appPauseTime;
        Sdk.add_log_message("间隔:" + intervalLeft);
        Sdk.add_log_message("超时时间:" + this.canReconnectLeftTime);
        this._appResumeTime = 0;
        this._appPauseTime = 0;
        return intervalLeft > this.canReconnectLeftTime;
    }


    private simulateProgressBar(): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Loading);
		App.TimerManager.doTimer(25, 20, this.showProgressBarValue, this);
	}

	private showProgressBarValue(): void {
		this.simulateProgressNo++;
		let progress: number = 5 * this.simulateProgressNo;
		let progressStr: string = "([" + progress.toString() + "/100]进入场景中)"
        if(!ControllerManager.loading) {
            ControllerManager.initLoading();
        }
        EventManager.dispatch(LocalEventEnum.LoadingProgressUpdate,progress, 100);
		//Sdk.SdkToShowLoadProgress(progress, progressStr);
	}

    private loadConfig() {
        this.simulateProgressBar();
        var groupName: string = "preload";
		var subGroups: Array<string> = ["preload_config"];
		App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }

    private onResourceLoadComplete(groupName: string = ""): void {
		Init.init_after_newbie();
        if(App.DeviceUtils.IsWXGame) {
            this.loginView.requestAfterLoad();
        }
	}

    private onResourceLoadProgress(itemsLoaded: number, itemsTotal: number, itemName: string = ""): void {
		// console.log("2次读条: onResourceLoadProgress", itemsLoaded, itemsTotal, itemName);
		// Sdk.SdkToShowLoadProgress(30*itemsLoaded, "即将进入场景，请稍后");
	}
}