/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 */
class Main extends egret.DisplayObjectContainer {
    public static gameStart: GameStart;
    private coreResJsonCallBack: boolean = false;
    private count_factor: number = 0;
    private wxLoginData : any;

    public constructor() {
        super();
        var code = "";
        if(App.DeviceUtils.IsWXGame) {
            this.runGame().catch(e => {
                console.log(e);
               
            })

            //WXGameUtil.getServerList(WXGameUtil.severlistCallBack,this,"huoshu","0","x1111d9ccbd3fb6fd3d4de68c5c88c21");
        }
        //WXGameUtil.getServerList(WXGameUtil.severlistCallBack,this,"huoshu","1663","x1111d9ccbd3fb6fd3d4de68c5c88c21");
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public openIdCallBack(data : any) {
        console.log(data);
        if(data.code == 0) {
            let code = data.data.openid;
            let uname : string = code;
            WXGameUtil.getServerList(WXGameUtil.severlistCallBack,this,"huoshuwxgame","0",code+"_huoshuwxgame");
            WXGameUtil.userName = code+"_huoshuwxgame";
            Sdk.username = WXGameUtil.userName;
            Sdk.platformCode = "huoshuwxgame";
            Sdk.gcid = "0";
        }
    }


    private async runGame() {
        this.wxLoginData = await platform.login();
        console.log(this.wxLoginData);
         if(this.wxLoginData.code) {
            let code = this.wxLoginData.code;
            WXGameUtil.getOpenId(this.openIdCallBack,code,"huoshuwxgame","0","wx8c321398f870d20c",this);
        }
        //const userInfo = await platform.getUserInfo();
        //console.log(userInfo);
        //this.createGameScene(userInfo);
    }


    private postByWXgame() {
        Sdk.logStep(Sdk.LogStepOld[1]);
        Sdk.logStep(Sdk.LogStepOld[2]);
        Sdk.logStep(Sdk.LogStepOld[3]);
    }

    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        //先设置并行数
        RES.setMaxLoadingThread(4);

        //适配方式(全屏适配)
        App.StageUtils.startFullscreenAdaptation(720, 1166, this.onResize);
        //不同平台的视频，初步，待整理, 微端的navigator要判断
        if (App.DeviceUtils.IsIPad) //iPad的特殊判断
        {
            App.StageUtils.getStage().orientation = egret.OrientationMode.AUTO;
        } else {
            App.StageUtils.getStage().orientation = egret.OrientationMode.PORTRAIT;
        }
        if (App.DeviceUtils.IsPC) {
            App.StageUtils.getStage().orientation = egret.OrientationMode.AUTO;
        }

        this.initLifecycle();

        //Webgl跨域问题
        egret.ImageLoader.crossOrigin = "anonymous";

        //初始化层级管理器
        LayerManager.init();

        //sdk初始化
        Sdk.init();

        if(App.DeviceUtils.IsWXGame) {
            this.postByWXgame();//微信直接打点
        }

        //加载完了资源后，协议也初始化成功了
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogStepNew[4]);
        } else {
            Sdk.logStep(Sdk.LogStepOld[4]);
        }

        if (App.DeviceUtils.IsWXGame) {
            Sdk.CdnRoot = "https://resh5.yyxxgame.com/Client/web/"; //因为Apk_Version是空，去掉一个斜杠，虽然多一个也不影响
            Sdk.Apk_Version = "wxgame";
            Sdk.Res_Version = "201811051520";
        }

        console.log("直接打印Sdk.CdnRoot: " + Sdk.CdnRoot);
        console.log("直接打印Sdk.Apk_Version: " + Sdk.Apk_Version);
        console.log("直接打印Sdk.Code_Version: " + Sdk.Code_Version);
        console.log("直接打印Sdk.Proto_Version: " + Sdk.Proto_Version);
        console.log("直接打印Sdk.Res_Version: " + Sdk.Res_Version);
        console.log("---------");
        console.log("直接打印Sdk.server_ip: " + Sdk.server_ip);
        console.log("直接打印Sdk.server_port: " + Sdk.server_port);
        console.log("直接打印Sdk.is_new: " + Sdk.is_new);
        console.log("直接打印Sdk.is_not_iframe: " + Sdk.is_not_iframe);
        // console.log("直接打印Sdk.role_datas: " + Sdk.role_datas);

        Sdk.testStepTimer = egret.getTimer();

        //加载资源版本号
        if (Sdk.IsOnlineVersion) {
            if (App.ResVersionManager.hasResVersionData) {
                this.loadResVersionComplate();
            } else {
                App.ResVersionManager.loadConfig(Sdk.CdnRoot + Sdk.Apk_Version + "/resource/resource_version.json?v=" + Sdk.Res_Version, this.loadResVersionComplate, this);
            }
        } else if (App.DeviceUtils.IsWXGame) {
            if (window["resource_version"]) {
                console.log("wxgame, window打印版本号:, window中有resource_version");
                App.ResVersionManager.setVersionData(window["resource_version"]);
            }
            if (App.ResVersionManager.hasResVersionData) {
                console.log("wxgame, 已直接获取resource_version.js，版本初始化快速结束");
                this.loadResVersionComplate();//理论上微信小游戏会加快进入，直接进入到这里
            } else {
                if(Sdk.Apk_Version == "" && Sdk.Res_Version == "") {
                    App.ResVersionManager.setIsUrlOutside();
                    App.ResVersionManager.loadConfig("resource/resource_version.json", this.loadResVersionComplate, this);
                }
                else {
                    App.ResVersionManager.loadConfig(Sdk.CdnRoot + Sdk.Apk_Version + "/resource/resource_version.json?v=" + Sdk.Res_Version, this.loadResVersionComplate, this);
                }
            }
        } else {
            App.ResVersionManager.setIsUrlOutside();
            App.ResVersionManager.loadConfig("resource/resource_version.json", this.loadResVersionComplate, this);
        }
    }

    private initLifecycle(): void {
        egret.lifecycle.addLifecycleListener((context) => {
            //TODO: 针对不同环境，比如qq浏览器，自定义LifecyclePlugin
        })

        egret.lifecycle.onPause = () => {
            // console.log("Egret App 进入后台");
            App.DeviceUtils.isInBackground(true);
            EventManager.dispatch(LocalEventEnum.AppPause);
            // egret.ticker.pause();// 关闭渲染与心跳
        }

        egret.lifecycle.onResume = () => {
            // console.log("Egret App 进入前台");
            App.DeviceUtils.isInBackground(false);
            EventManager.dispatch(LocalEventEnum.AppResume);
            // egret.ticker.resume();// 打开渲染与心跳
        }
    }

    private onResize(): void {
        EventManager.dispatch(LocalEventEnum.GameReSize);
    }

    private loadResVersionComplate(): void {
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogPreloadStep[1]);
        }
        this.loadCoreResJson();//此行注释，第一次不加载或不回调，都会检查并进入游戏
        // App.LoaderManager.getResByUrl("resource/resource_core.json", this.onResByUrlComplete, this);

        if (Sdk.IsOnlineVersion) {
            App.TimerManager.doTimer(2000,6,this.checkFirstLoad,this);
        }
    }

    private loadCoreResJson(): void {
        App.ResourceUtils.addConfig("resource/resource_core.json", "resource/");
        //不是正式php平台流程时，需要加载loading
        if (!Sdk.IsOnlineVersion) {
            App.ResourceUtils.addConfig("resource/resource_fui.json", "resource/");
        }
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(): void {
        this.coreResJsonCallBack = true;
        if (!Main.gameStart) {
            if (Sdk.is_new) {
                Sdk.logStep(Sdk.LogPreloadStep[2]);
            }
            Main.gameStart = new GameStart();
        }
    }

    /**
     * 仅外网测试下第一次游戏启动回调的情况
     */
    private checkFirstLoad(): void {
        this.count_factor++;
        if (this.coreResJsonCallBack) {
            App.TimerManager.remove(this.checkFirstLoad,this);
            return;
        }

        if (this.count_factor % 3 == 1) { //第一次加载成功但没回调
            if (RES.hasRes("global_json")) {
                this.onConfigComplete();
            }
        } else if (this.count_factor % 3 == 2) { //加载不成功，而且也没回调
            App.ResourceUtils.clearConfig();//清理原来的资源配置
            this.loadCoreResJson();
        } else { // //加载不成功，而且也没回调，然后尝试加载新的资源
            App.ResourceUtils.clearConfig();//清理原来的资源配置
            this.loadCoreResJsonRetry();
        }

        if (Sdk.is_new) { //埋点：first_load_fail_1~6
            Sdk.logStep(Sdk.LogConvertNewbieStep[1]+this.count_factor.toString());
        }
    }

    /**
     * 更保险的做法，加载一个新的文件，但内容一样
     */
    private loadCoreResJsonRetry(): void {
        App.ResourceUtils.addConfig("resource/resource_core_retry.json", "resource/");
        if (!Sdk.IsOnlineVersion) {
            App.ResourceUtils.addConfig("resource/resource_fui_retry.json", "resource/");
        }
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    }

    private onResByUrlComplete(data: any, name: string): void {
        RES.parseConfig(data);
        this.onConfigComplete();
        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        // RES.loadConfig("resource/resource_core.json", "resource/");
    }
    private onConfigCompleteHandle(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.onConfigComplete();
    }
}