
class LoginView extends BaseModule {
    /**上次登录的用户名 */
    public static LAST_LOGIN_NAME: string = "LoginView_last_login_name_debug";
    /**上次登录的服务器 */
    public static LAST_LOGIN_SERVER: string = "LoginView_last_login_server_debug";

    private nameInput: fairygui.GTextInput;
    private passInput: fairygui.GTextInput;
    private loginBtn: fairygui.GButton;
    private btn_server: fairygui.GButton;
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;
    private serverPanel: LoginServerPanel;
    private serverBtn_c1: fairygui.Controller;
    private last_server_name: string;
    //private loader_bg:GLoader;

    /** cd处理 */
    private clickTime: number = 0;

    public constructor() {
        super(ModuleEnum.Login, PackNameEnum.Login, "Main", LayerManager.UI_Cultivate);
    }

    public initOptUI(): void {
        if (App.GlobalData.IsDebug) {
            console.log("【加载1，显示登录界面】进入游戏，加载版本文件和核心组件耗时：" + (egret.getTimer() - Sdk.testStepTimer) + "ms");
        }
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        /*
        this.loader_bg = <GLoader>this.getGObject("loader_bg");
        this.loader_bg.addEventListener(GLoader.RES_READY,(e:any)=>{
            console.log("this.loader_bg:",this.loader_bg.displayObject);            
            this.loader_bg.setSize(fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
            this.loader_bg.addRelation(fairygui.GRoot.inst,fairygui.RelationType.Size);
        },this);
        */

        this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Center_Center);
        this.nameInput = this.getGObject("input_name").asCom.getChild("title").asTextInput;
        this.passInput = this.getGObject("input_password").asCom.getChild("title").asTextInput;
        this.loginBtn = this.getGObject("btn_login").asButton;
        this.btn_server = this.getGObject("btn_server").asButton;
        this.serverBtn_c1 = this.btn_server.getController("c1");
    
        this.loginBtn.addClickListener(this.onLogin, this);
        this.serverPanel = new LoginServerPanel(this.getGObject("npanel_loginChoose").asCom);
        this.nameInput.promptText = "";
        this.btn_server.addClickListener((e: egret.TouchEvent) => {
                e.stopPropagation();
                this.c1.setSelectedIndex(1);
        }, this);
        if (!App.DeviceUtils.IsWXGame) {

            this.nameInput.promptText = "账号(必填)";
            this.addClickListener(this.onClickStage, this);
        }

        this.passInput.promptText = "密码不用填";
        let lastName: string = egret.localStorage.getItem(LoginView.LAST_LOGIN_NAME);
        if (lastName) {
            this.nameInput.text = lastName;
        }
    }

    public updateAll(): void {
        EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Loading);
        // ControllerManager.login.phpLogin();
        // return;

        //打开登录界面再初始化协议、global.json等
        App.Init();
        if(this.c2 && this.c2 != null) {
            if(App.DeviceUtils.IsWXGame) {
                this.c2.setSelectedIndex(1);
            }
            else {
                this.c2.setSelectedIndex(0);
            }
        }
        this.serverPanel.updateAll({ cbFn: this.onSelectServerCall, caller: this });
        this.onSelectServerCall();
    }

    public updateServerList() {
        if(this.serverPanel) {
            this.serverPanel.updateAll({ cbFn: this.onSelectServerCall, caller: this });
        }
        this.onSelectServerCall();
    }



    private onSelectServerCall(): void {
        this.c1.setSelectedIndex(0);
        this.btn_server.text = this.serverPanel.curSelectInf.name;

        this.serverBtn_c1.setSelectedIndex(1);
    }
    private onClickStage(e: egret.TouchEvent): void {
        if (this.c1.selectedIndex == 1) {
            this.onSelectServerCall();
        }
    }

    /**
     * 请求登陆处理
     * @param userName
     * @param pwd
     */
    private onLogin(e: egret.TouchEvent = null): void {
        if(App.DeviceUtils.IsWXGame) {
            if(!WXGameUtil.hasGetServerList) {
                //return;//如果还没成功获得服务器列表，就不能进游戏
            }
        }
        //1秒的cd，防止快速连点
        if (egret.getTimer() - this.clickTime < 1000) {
            return;
        }
        this.clickTime = egret.getTimer();
        if(App.DeviceUtils.IsWXGame && !Sdk.is_new) {
            //let framExc: FrameExecutor = new FrameExecutor(2);
            /**let newbieNecessaryArr: Array<string> = [PackNameEnum.Navbar, PackNameEnum.Home];
            for (let item of newbieNecessaryArr) {
                framExc.regist(function () {
                    ResourceManager.load(item, UIManager.getPackNum(item));
                }, this);
            }*/
            //this.requestLogin();
            EventManager.dispatch(LocalEventEnum.WXLoadConfigSecondStart);
        }
        else {
            this.requestLogin();
        }
    }

    public requestAfterLoad() {
        this.requestLogin();
    }

    private requestLogin(): void {
        if (!App.isInit) {
            return;
        }

        if (this.last_server_name != this.serverPanel.curSelectInf.name) {
            ControllerManager.login.hasReqLogin = false;
            this.last_server_name = this.serverPanel.curSelectInf.name;
            App.Socket.close(false);
        }

        let userName: string = this.nameInput.text;
        if (!userName) {
            userName = egret.getTimer().toString();
        }
        Log.trace(Log.GAME, "onLogin: ", userName);
        let pwd: string = this.passInput.text;
        //进行基础检测
        if (userName == null || userName.length == 0) {
            return;
        }
        if (pwd == null || pwd.length == 0) {
            pwd = "123456";
        }

        let serverSelectStr: string = this.serverPanel.curSelectInf.url;
        if(this.serverPanel.curSelectInf.sll_ip) {
            serverSelectStr = this.serverPanel.curSelectInf.sll_ip;
        }
        //特殊处理，密码可以当自定义服务端接口
        if (pwd.indexOf(":") != -1) {
            serverSelectStr = pwd;
            pwd = "123456";
        }
        let arr = serverSelectStr.split(":");
        if (arr.length >= 2) {
            Sdk.server_ip = arr[0];
            Sdk.server_port = arr[1];
        } else {
            return;
        }

        if (App.StringUtils.isEmptyStr(Sdk.server_ip)) {
            Sdk.server_ip = App.GlobalData.SocketServer;
            Sdk.server_port = App.GlobalData.SocketPort;
        }

        //服务端口和IP改变
        App.Socket.initServer(Sdk.server_ip, Sdk.server_port);

        LocalStorageUtils.setKey(LoginView.LAST_LOGIN_NAME, userName); //测试功能
        LocalStorageUtils.setKey(LoginView.LAST_LOGIN_SERVER, serverSelectStr); //测试功能

        Sdk.username = userName;
        if(App.DeviceUtils.IsWXGame) {
            Sdk.username = WXGameUtil.userName;
            Sdk.platformCode = "huoshuwxgame";
            Sdk.server = this.serverPanel.curSelectInf.code;
            Sdk.serverName = this.serverPanel.curSelectInf.name;
            var timestamp = new Date().getTime().toString();
            var timestamp10 = timestamp.substr(0,10);
            console.log(timestamp10);
            Sdk.time =Number(timestamp10);
        }
        Sdk.password = pwd;
        EventManager.dispatch(LocalEventEnum.Login, userName, pwd);
    }
}