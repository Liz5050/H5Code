/**
 * app统一管理
 */
class App {
    /**
     * 请求服务器使用的用户标识
     * @type {string}
     */
    public static ProxyUserFlag:string = "";
    /**
     * 全局配置数据
     * @type {null}
     */
    public static GlobalData:any = null;
    /**
     * 服务器配置数据
     * @type {null}
     */
    public static ServerList:any = null;

    /**
     * ProtoFile
     * @type {null}
     */
    // public static ProtoFile:any = null;
    /**
     * ProtoConfig, 即simple.json，第一索引是数字
     * @type {null}
     */
    public static ProtoConfig:any = null;

    /**
     * Http请求
     * @type {Http}
     */
    public static get Http():Http {
        return Http.getInstance();
    }

    /**
     * Socket请求
     * @type {null}
     */
    public static get Socket():Socket {
        return Socket.getInstance();
    }

    /**
     * 调试工具
     * @type {DebugUtils}
     */
    public static get DebugUtils():DebugUtils {
        return DebugUtils.getInstance();
    }

    /**
     * 消息处理中心
     * @type {MessageCenter}
     */
    public static get MessageCenter():MessageCenter {
        return MessageCenter.getInstance(0);
    }

    /**
     * 统一的计时器和帧刷管理类
     * @type {TimerManager}
     */
    public static get TimerManager():TimerManager {
        return TimerManager.getInstance();
    }

    /**
     * 日期工具类
     * @type {DateUtils}
     */
    public static get DateUtils():DateUtils {
        return DateUtils.getInstance();
    }

    /**
     * 数学计算工具类
     * @type {MathUtils}
     */
    public static get MathUtils():MathUtils {
        return MathUtils.getInstance();
    }

    /**
     * 随机数工具类
     * @type {RandomUtils}
     */
    public static get RandomUtils():RandomUtils {
        return RandomUtils.getInstance();
    }

    /**
     * 显示对象工具类
     * @type {DisplayUtils}
     */
    public static get DisplayUtils():DisplayUtils {
        return DisplayUtils.getInstance();
    }

    /**
     * Stage操作相关工具类
     */
    public static get StageUtils():StageUtils {
        return StageUtils.getInstance();
    }

    /**
     * Effect工具类
     */
    public static get EffectUtils():EffectUtils {
        return EffectUtils.getInstance();
    }

    /**
     * 字符串工具类
     */
    public static get StringUtils():StringUtils {
        return StringUtils.getInstance();
    }

    /**
     * 通过工具类
     */
    public static get CommonUtils():CommonUtils {
        return CommonUtils.getInstance();
    }

    /**
     * 音乐管理类
     */
    public static get SoundManager():SoundManager {
        return SoundManager.getInstance();
    }

    /**
     * 设备工具类
     */
    public static get DeviceUtils():DeviceUtils {
        return DeviceUtils.getInstance();
    }

    /**
     * JS工具类
     */
    public static get JSUtils():JSUtils {
        return JSUtils.getInstance();
    }

    /**
     * 引擎扩展类
     */
    public static get EgretExpandUtils():EgretExpandUtils {
        return EgretExpandUtils.getInstance();
    }

    /**
     * 键盘操作工具类
     */
    public static get KeyboardUtils():KeyboardUtils {
        return KeyboardUtils.getInstance();
    }

    /**
     * 摇杆操作工具类
     */
    public static get RockerUtils():RockerUtils {
        return RockerUtils.getInstance();
    }

    /**
     * 震动类
     */
    public static get ShakeUtils():ShakeUtils {
        return ShakeUtils.getInstance();
    }

    /**
     * 资源加载工具类
     */
    public static get ResourceUtils():ResourceUtils {
        return ResourceUtils.getInstance();
    }

    /**
     * RenderTextureManager
     */
    public static get RenderTextureManager():RenderTextureManager {
        return RenderTextureManager.getInstance();
    }

    /**
     * TextFlow
     */
    public static get TextFlowMaker():TextFlowMaker {
        return TextFlowMaker.getInstance();
    }

    /**
     * 消息通知中心
     */
    private static _notificationCenter:MessageCenter;

    public static get NotificationCenter():MessageCenter {
        if (App._notificationCenter == null) {
            App._notificationCenter = new MessageCenter(1);
        }
        return App._notificationCenter;
    }


    /**
     * 分帧处理类
     * @returns {any}
     * @constructor
     */
    public static get DelayOptManager():DelayOptManager {
        return DelayOptManager.getInstance();
    }

    /**
     * 数组工具类
     * @returns {any}
     * @constructor
     */
    public static get ArrayUtils():ArrayUtils {
        return ArrayUtils.getInstance();
    }

    /**
     * 单一资源通过版本号加载管理类
     */
    public static get ResVersionManager():ResVersionManager {
        return ResVersionManager.getInstance();
    }

    /**
     * ModelResManager类
     * @constructor
     */
    public static get LoaderManager():LoaderManager {
        return LoaderManager.getInstance();
    }

    private static _isInit:boolean;

    public static get isInit():boolean {
        return this._isInit
    }

    /**
     * 初始化函数
     * @constructor
     */
    public static Init():void {
        if (this._isInit) {
            return;
        }

        console.log("当前引擎版本: ", egret.Capabilities.engineVersion);
        // console.log("userAgent: " + navigator.userAgent.toLowerCase());
        Sdk.add_log_message("userAgent: " + navigator.userAgent.toLowerCase());
        // console.log("window.navigator: " + window.navigator.userAgent.toLowerCase());

        //内网的一些自定义设置，用网页url
        if (!Sdk.IsOnlineVersion && App.JSUtils.IsLocalDev) {
            App.GlobalData.IsDebug = true;
            App.DebugUtils.onDisplayFPS();
        }

        if (App.JSUtils.IsNeedGMLog) {
            App.GlobalData.IsDebug = true;
        }

        if (App.JSUtils.IsNeedFPS) {
            App.DebugUtils.onDisplayFPS();
        }

        if(App.GlobalData.IsDebug){
            Sdk.platform_config_data.platform_pay_type = App.JSUtils.payType;
        }

        //全局配置数据
        // App.GlobalData = ConfigManager.Data["global"];
        //开启调试
        console.log("开启调试: " + App.GlobalData.IsDebug);
        App.DebugUtils.isOpen(App.GlobalData.IsDebug);
        App.DebugUtils.setThreshold(5);
        //扩展功能初始化
        App.EgretExpandUtils.init();
        //实例化Http请求
        // App.Http.initServer(App.GlobalData.HttpSerever);
        //实例化ProtoBuf和Socket请求
        // App.ProtoFile = dcodeIO.ProtoBuf.loadProto(RES.getRes(App.GlobalData.ProtoFile));
        App.ProtoConfig = RES.getRes(App.GlobalData.ProtoConfig);
        // console.log("直接打印: Socket:" + App.GlobalData.SocketServer);
        // console.log("直接打印: SocketPort:" + App.GlobalData.SocketPort);
        App.Socket.initServer(Sdk.server_ip.length > 0 ? Sdk.server_ip : App.GlobalData.SocketServer, Sdk.server_port.length > 0 ? Sdk.server_port :App.GlobalData.SocketPort);
        App.Socket.initProtocol(new ByteArrayMsgByProtobuf());
        // console.log("App.init success... ");
        this._isInit = true;

        if (!Sdk.is_new) {
            //非新手，在请求后端连接回来前，就静默加载资源
            // console.log("直接打印: 非新手，在请求后端连接回来前，就静默加载资源");
            let framExc: FrameExecutor = new FrameExecutor(2);
            let newbieNecessaryArr: Array<string> = [PackNameEnum.Common, PackNameEnum.Navbar];
            for (let item of newbieNecessaryArr) {
                framExc.regist(function () {
                    ResourceManager.load(item, UIManager.getPackNum(item));
                }, this);
            }
            framExc.execute();
        }
        EventManager.dispatch(LocalEventEnum.AppInited);
    }
}
