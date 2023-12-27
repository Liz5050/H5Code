/**
 * Main.ts后，游戏启动主入口
 */
class GameStart {
    private isGameInited: boolean;
    // private isProtoResReadyNum: number = 0;
    private hasEnterGameView: boolean;


    
    public constructor() {
        UIExtensionManager.init();
        if (Sdk.is_new || App.DeviceUtils.IsWXGame) {
            CacheManager.initCreateRole();
            ControllerManager.initCreateRole();
            if(!App.DeviceUtils.IsWXGame) {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CreateRole, { "tabIndex": 1 });
            }
            else{
                this.start_load_game();
            }

        } else {
            this.start_load_game();
        }
        // this.start_load_game();
    }

    public start_load_game(): void {
        //loading模块第一个就需要初始化
        ControllerManager.initLoading();

        //加载资源
        var groupName: string = "preload";
        var subGroups: Array<string> = ["preload_core"];
        //不是正式php平台流程时，需要加载loading
        if (!Sdk.IsOnlineVersion) {
            subGroups = ["preload_core", "preload_ui"];
        }
        if (Sdk.is_new||App.DeviceUtils.IsWXGame) { //如果是新手
            groupName = "preload";
            subGroups = ["preload_without_config"];
            //不是正式php平台流程时，需要加载loading
            if (!Sdk.IsOnlineVersion) {
                subGroups = ["preload_without_config", "preload_ui"];
            }

            // if (Sdk.is_new) {
                // Sdk.logStep(Sdk.LogPreloadStep[3]);
            // }
        }
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }

    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(groupName: string): void {
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogPreloadStep[7]);
        }

        if (!Sdk.IsOnlineVersion) {
            let resourceItems: Array<RES.ResourceItem> = RES.getGroupByName("preload_ui");
            ResourceManager.addPackageByResourceItems(resourceItems);
        }
        App.GlobalData = RES.getRes("global_json");
        // let framExc: FrameExecutor = new FrameExecutor(2);
        // framExc.regist(() => {
        //     Init.init();
        // }, Init);
        // framExc.regist(() => {
        //     this.initGame();
        // }, this);
        // framExc.execute();
        if (Sdk.is_new || App.DeviceUtils.IsWXGame) {
            Init.init_before_newbie();
        } else {
            Init.init();
        }
        this.initGame(); //网络请求可以并行

        //并行加载新手创角的背景和角色png，如果改为jpg角色和背景融合，这里预加载也要改
        // if (Sdk.is_new) {
        //     let roleIndex:number = 1;
        //     if (Sdk.createRoleSelectIndex == 0) {
        //         roleIndex = 2;
        //     } else if (Sdk.createRoleSelectIndex == 2) {
        //         roleIndex = 4
        //     }
        //     let roleImageUrl:string = `resource/assets/module/CreateRole/img_role_${roleIndex}.jpg`;
        //     // App.LoaderManager.getResByUrl("resource/assets/module/CreateRole/bg.jpg")
        //     App.LoaderManager.getResByUrl(roleImageUrl)
        // }
    }

    /**
     * 资源组加载进度
     */
    private onResourceLoadProgress(itemsLoaded: number, itemsTotal: number, itemName: string = ""): void {
        // if (itemName.indexOf("simple_") != -1 || itemName.indexOf("global_") != -1) {
        //     this.isProtoResReadyNum++;
        //     if (this.isProtoResReadyNum == 3) {
        //         App.GlobalData = RES.getRes("global_json");
        //         App.Init();
        //     }
        // }

        // if (Sdk.is_new) {
        //     Sdk.logStep(itemName + "_finish");
        // }
        EventManager.dispatch(LocalEventEnum.LoadingProgressUpdate, itemsLoaded, itemsTotal);
    }

    private initGame(): void {
        if (this.isGameInited) {
            return;
        }
        this.isGameInited = true;

        if (Sdk.IsOnlineVersion) {
            ControllerManager.login.phpLogin();
        } else {
            //初始打开登录页面
            if(App.DeviceUtils.IsWXGame) {
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CreateRole, { "tabIndex": 1 });
            }
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Login);
        }

        // //非新手，在请求后端连接回来前，就静默加载资源
        // if (!Sdk.is_new) {
        //     let framExc: FrameExecutor = new FrameExecutor(2);
        //     let newbieNecessaryArr: Array<string> = [PackNameEnum.Common, PackNameEnum.Navbar];
        //     for (let item of newbieNecessaryArr) {
        //         framExc.regist(function () {
        //             ResourceManager.load(item, UIManager.getPackNum(item));
        //         }, this);
        //     }
        //     framExc.execute();
        // }
    }

    /**
     * 登录成功，进入游戏
     */
    public enterGame(mapId: number, loginMsg: any): void {
        //运行RpgGame
        EventManager.dispatch(LocalEventEnum.GameInit, mapId, loginMsg);
        //开启ComponentSystem
        ComponentSystem.start();

        UIManager.closeAll();

        //开启UI部分
        // if (CacheManager.role.isNewCreateRole) {
        //     EventManager.dispatch(UIEventEnum.WelcomeOpen);
        // }
        
        if (CacheManager.role.isNewCreateRole) { 
            //加载一些新手必备的预加载模型资源
            App.TimerManager.doDelay(100, ControllerManager.preload.welcomePreload, ControllerManager.preload);
            //加载一些新手必备UI资源
            App.TimerManager.doDelay(1000, ControllerManager.preload.preloadNewbieNecessary, ControllerManager.preload);
        }

        // (H5)显示游戏界面，进入游戏，显示角色
        if (!Sdk.is_new && !this.hasEnterGameView) {
            this.hasEnterGameView = true;
            Sdk.logStep(Sdk.LogStepOld[5]);
        }

        EventManager.dispatch(UIEventEnum.NavbarOpen);
        // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Home);
        // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MsgBroadcast);

        //添加全局通用tips
        Tips.init(LayerManager.UI_Tips.displayObject);

        CacheManager.role.isLoginBack = true;
    }
}