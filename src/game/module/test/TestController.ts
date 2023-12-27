class TestController extends BaseController {
    private testProxy: TestProxy;
    private module: TestModule;
    /** 怪物打印信息开关*/
    public switchTestMonHit:boolean;
    public roleHurts:number[];
    private logWin:LogWindow;
    private index: number = 1;
    private memDisplay:MemDisplay;

    private timeIndex:number = -1;
    private gmNum:number = 0;
    private gmTimeIndex:number = -1;
    private gmIsShow:boolean = false;
    public constructor() {
        super(ModuleEnum.Test);
        this.viewIndex = ViewIndex.Two;
        if (!Sdk.IsOnlineVersion) {
            //键盘控制
            App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
        }
        this.roleHurts = [0,0,0];
    }

    public initView(): BaseGUIView {
        this.module = new TestModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        //this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCopyPassPlayerIntoCopy], this.onEnterCopy, this);
        this.addListen0(LocalEventEnum.ShowLog, this.showLog, this);
        this.addListen0(LocalEventEnum.ShowLoadLog, this.showLoadLog, this);
        this.addListen0(LocalEventEnum.ShowResLog, this.showResLog, this);
        this.addListen0(LocalEventEnum.GameInit, this.checkShowMemDisplay, this);
    }

    public addListenerOnShow(): void {

    }

    /**
     * 进入副本后返回
     * struct:SCopyPassInto
     */
    public onEnterCopy(msg: any): void {

    }

    private onKeyUp(keyCode: number): void {
        if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady)
            return;
        // console.log("直接打印键盘按键：", keyCode);
        if (!App.DebugUtils.isDebug)
            return;
        switch (keyCode) {
            case Keyboard.F2:
                if (Sdk.isNeedMicroClient) {
                    this.sdkTestDownloadMicroClient();
                }
                break;
            case Keyboard.F4:
                //EventManager.dispatch("TestDispose");
                break;
            case Keyboard.F7:
                this.setGlobalJump();
                // App.Socket.close(false);
                break;
            case Keyboard.F9:
                // this.sdkTestPay();
                // App.Socket.close(false);
                Tip.showTip(LangNetwork.LANG2);
                ControllerManager.login.doHeartbeat(false);
                // ControllerManager.createRole.listerToLoginGate();
                // App.Socket.connect();
                break;
            case Keyboard.C:
                this.sdkTestGetGameConfig();
                break;
            case Keyboard.G:
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.UpgradeGuide);
                EventManager.dispatch(LocalEventEnum.GuideTest);
                // ControllerManager.createRole.listerToLoginGate();
                // App.Socket.connect();
                // let model: string;
                // if(this.index == 1) {
                //     model = "pet_0#pet_1#2001";
                // }else if(this.index == 2) {
                //     model = "mount_0#mount_1#1001";
                // }else if(this.index == 3) {
                //     model = "wing_0#wing_1#4001";
                // }else if(this.index == 4) {
                //     model = "law_0#law_1#1001";
                // }else if(this.index == 5) {
                //     model = "battle_0#battle_1#9001";
                // }else if(this.index == 6) {
                //     model = "swordPool_0#swordPool_1#10001";
                // }
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Open, { "showModel": model});
                // this.index += 1;
                // if(this.index > 6) {
                //     this.index = 1;
                // }
                break;
            case Keyboard.ESCAPE:
                this.module && this.module.isShow
                    ? EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Test)
                    : EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Test);
                if(!this.gmIsShow) {
                    this.gmIsShow = true;
                    EventManager.dispatch(UIEventEnum.ShowGM,this.gmIsShow);
                }
                console.log(this.gmNum,"gmcheck ->>>>>>>>>",this.gmTimeIndex);
                break;
            case Keyboard.WAVE:
                UIManager.closeAll();
                AlertII.instance && AlertII.instance.hide();
                Alert.instance && Alert.instance.hide();
                ControllerManager.rpgGame.view.touchEnabled = ControllerManager.rpgGame.view.touchChildren = true;
                break;
            case Keyboard.LEFT_SQUARE:
                EventManager.dispatch(LocalEventEnum.CreateTeam, CacheManager.team.getCopyTarget(ConfigManager.copy.getByPk(2801)));
                break;
            case Keyboard.RIGHT_SQUARE:
                ProxyManager.test.convey(109000, 1, 0);
                break;
            case Keyboard.FAN_XIE_GAN:
                if(this.timeIndex != -1) {
                    egret.clearTimeout(this.timeIndex);
                    this.timeIndex = -1;
                }
                this.switchTestMonHit = !this.switchTestMonHit;
                this.roleHurts = [0,0,0];
                if(this.switchTestMonHit) {
                    this.timeIndex = egret.setTimeout(function(){
                        this.switchTestMonHit = false;
                        this.roleHurts = [0,0,0];
                    },this,60000);
                }
                break;
            case Keyboard.UP:
                EventManager.dispatch(UIEventEnum.HomeSwitchMount,MountEnum.UpMount);
                if(this.gmNum == 0 || this.gmNum == 2) {
                    this.gmNum ++;
                    if(this.gmTimeIndex == -1) {
                        this.gmTimeIndex = egret.setTimeout(() => {
                            this.resetGmCheck();
                        },this,1500);
                    }
                }
                else {
                    this.resetGmCheck();
                }
                EventManager.dispatch(NetEventEnum.copyEnterCheckPoint);
                break;
            case Keyboard.DOWN:
                if(this.gmNum == 1 || this.gmNum == 3) {
                    this.gmNum ++;
                }
                else {
                    this.resetGmCheck();
                }
                EventManager.dispatch(UIEventEnum.HomeSwitchMount,MountEnum.DownMount);
                break;
            case Keyboard.LEFT:
                if(this.gmNum >= 4 && this.gmNum <= 5) {
                    this.gmNum ++;
                }
                else {
                    this.resetGmCheck();
                }
                break;
            case Keyboard.RIGHT:
                if(this.gmNum >= 6) {
                    if(this.gmNum < 7) {
                        this.gmNum ++;
                    }
                    else {
                        this.resetGmCheck();
                        this.gmIsShow = !this.gmIsShow;
                        EventManager.dispatch(UIEventEnum.ShowGM,this.gmIsShow);
                    }
                }
                else {
                    this.resetGmCheck();
                }
                break;
            default:
                break;
        }
    }

    private resetGmCheck():void {
        this.gmNum = 0;
        if(this.gmTimeIndex != -1) {
            egret.clearTimeout(this.gmTimeIndex);
            this.gmTimeIndex = -1;
        }
    }

    /**
     * 测试下载微端
     */
    private sdkTestDownloadMicroClient(): void {
        console.log("sdk测试下载微端:start");
        Sdk.downloadMicroClient(this.downloadMicroClientCB, this);
    }

    private downloadMicroClientCB(result: any): void {
        console.log("sdk测试下载微端:callback:", result);
        let resultStr = "下载微端返回, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES], ["确定"]);
    }

    /**
     * 测试分享
     */
    private sdkTestShare(): void {
        console.log("sdk测试分享:start");
        Sdk.share(this.shareCB, this);
    }

    private shareCB(result: any): void {
        console.log("sdk测试分享:callback:", result);
        let resultStr = "测试分享返回, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES], ["确定"]);
    }

    /**
     * 测试关注
     */
    private sdkTestFocus(): void {
        console.log("sdk测试关注:start");
        Sdk.sdkFocus(this.sdkFocusCB, this);
    }

    private sdkFocusCB(result: any): void {
        console.log("sdk测试关注:callback:", result);
        let resultStr = "sdk测试关注, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES], ["确定"]);
    }

    /**
     * 测试充值 30*68*128*198*328*648
     */
    private sdkTestPay(money: number = 6): void {
        console.log("sdk测试充值:start, 金额:" + money);
        Sdk.pay(money, "test_id", this.sdkTestPayCB, this);
    }

    private sdkTestPayCB(result: any): void {
        console.log("sdk测试充值:callback:", result);
        let resultStr = "sdk测试充值, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES], ["确定"]);
    }

    /**
     * 获取游戏配置
     */
    private sdkTestGetGameConfig(): void {
        console.log("sdk测试getgameconfig获取游戏配置:start");
        Sdk.getGameConfig(this.getGameConfigCB, this);
    }

    private getGameConfigCB(result: any): void {
        console.log("sdk测试getgameconfig获取游戏配置:callback:", result);
        let resultStr = "sdk测试getgameconfig获取游戏配置, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES], ["确定"]);
    }

    private mainPlayerSiteJump(): void {
        EventManager.dispatch(LocalEventEnum.SceneTestJump);
    }

    private mainPlayerJump(): void {
        EventManager.dispatch(LocalEventEnum.SceneTestJump);
    }

    private setGlobalJump(): void {
        ControllerManager.scene.isGlobalJump = !ControllerManager.scene.isGlobalJump;
    }

    private showLog() {
        if (!this.logWin) this.logWin = new LogWindow();
        this.logWin.show(Log.logCache);
    }

    private showLoadLog(filter:string = null) {
        if (!this.logWin) this.logWin = new LogWindow();
        this.logWin.show(App.LoaderManager.getLoadLog(filter).logList);
    }

    private showResLog(resType:string = "all") {
        if (!this.logWin) this.logWin = new LogWindow();
        this.logWin.show(CacheManager.res.getResLog(resType));
    }

    private checkShowMemDisplay() {
        this.removeListener(LocalEventEnum.GameInit, this.checkShowMemDisplay, this);
        this.showMemDisplay();
    }

    private onLoadTestComplete() {
        if (!this.memDisplay) {
            this.memDisplay = FuiUtil.createComponent(PackNameEnum.Test, "MemDisplay") as MemDisplay;
            this.memDisplay.x = fairygui.GRoot.inst.width - this.memDisplay.width;
            // this.memDisplay.y = 142;
        }
        if (!this.memDisplay.parent) {
            let parent = LayerManager.UI_DEMO;
            parent.addChild(this.memDisplay);
            this.memDisplay.addRelation(parent, fairygui.RelationType.Top_Top);
        }
        this.memDisplay.start();
    }

    public showMemDisplay(force:boolean = false) {
        if (App.DebugUtils.isDebug || force) {
            ResourceManager.load(PackNameEnum.Test, -1, new CallBack(this.onLoadTestComplete, this));
        }
    }
}