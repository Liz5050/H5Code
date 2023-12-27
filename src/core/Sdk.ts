class SdkPlayerData {
    /** playerId，即pid */
    public role_id: string;
    /** 角色名，即role(string) */
    public nickname: string;
    public level: number;
    public vip_level: number;
    /** 服务器ID，即sid */
    public server_id: number = 0;
    public is_new: number;
    /** 代理ID，即 */
    public proxy_id: number;
    public sex: number;
    /** 老服ID，即usid */
    public oldServerId: number;
    public career: number;
    public role_level_reborn: number;
    /** 账号名，即uname */
    public username: string;
    /** 角色创建时间 */
    public createTime: number;
    /** 上次登录时间 */
    public lastLoginTime: number;
    /** 进游戏的时间 */
    public enterTime: number;
    /** 阵营 */
    public camp: number;
    /** 战斗力 */
    public score: number;

    /** 系统平台(1:IOS,2:Android,3:win)，即os_code */
    public os: number;
    /** 设备，即phone_type */
    public device: string;
    public identity: string;
    /** 当前角色是否是主角色 */
    public main: number;
    public mac: string;
    public md5mac: string;
    /** Unix时间戳 */
    public time: number = 0;
    /** 埋点step，见SdkStepDefinition */
    public step: string;
    /** 充值金额 */
    public money: number = 0;
    /** product_id，字符串 */
    public product_id: string = "";

    /** 绑定铜钱 */
    public coinBind: number = 0;
    /** 非绑定元宝 */
    public gold: number = 0;
    /** 公会(仙盟)ID */
    public guildId: number = 0;
    /** 公会(仙盟)名称 */
    public guildName: string = "";

    public constructor() {
    }
}

/**
 * 以火树sdk为标准
 * 分享(参考火树sdk)：
 * 关注(参考火树sdk)：
 * 下载微端(参考火树sdk)：
 * 保存到桌面(参考火树sdk)：
 * 切换账号(参考火树sdk)：
 * 收藏(参考爱奇艺sdk)：
 */
class PlatformConfigData {
    /** 配置是否初始化 */
    public is_init: boolean = false;

    /** 是否有分享接口（参考火树）：0没有，1有 */
    public is_share: number = 0;

    /** 是否有下载微端接口（参考火树）
     * has_micro_client =0，按钮屏蔽；(无微端功能)
     * has_micro_client =1，显示按钮；(有微端下载)
     * has_micro_client =2，按钮屏蔽，未领奖的发送奖励；（已经在微端登陆）
    */
    public has_micro_client: number = 0;

    /** 关注说明（参考火树）
     * is_focus=0，不显示关注按钮；
     * is_focus=1，必显示关注按钮；
     * is_focus=2 已领奖，按钮屏蔽；
     * is_focus=2 未领奖，按钮是否显示根据奖励领取方式决定，比如奖励直接发邮件，按钮不显示；必须点开按钮才能领奖，按钮显示；或者其他。
    */
    public is_focus: number = 0;

    /** 是否有保存桌面（参考火树）：0没有，1有 */
    public is_desktop: number = 0;

    /** 是否有注销或切换账号按钮（参考火树）：0没有，1有 */
    public is_switch_account: number = 0;

    /** 是否有收藏的功能（参考爱奇艺）：0没有，1有 */
    public is_favorite: number = 0;

    /**
     * 1:安卓、2:IOS
     */
    public platform_pay_type: number = 1;

    /** 是否关闭充值。1关闭 */
    public is_close_recharge: number = 0;
    /**是否关闭客服 */
    public is_close_cs: number = 0;
    /**是否关闭客服 */
    public notice_content: string = "";
    //是否开启实名认证
    public is_eissm : number = 0;
    //是否显示寻宝概率
    public is_treasure_hunt : number = 1;
    //是否防沉迷
    public is_anti_addiction : number = 0;


    public constructor() {
    }
    /**是否有微端奖励 */
    public isMicroReward(): boolean {
        return this.is_init && this.has_micro_client == 2;
    }

}

class SdkShareData {
    /** 分享标题（非必须，可不填） */
    public title: string = "";
    /** 分享url（非必须，可不填） */
    public url: string = "";
    /** 分享信息（非必须，可不填） */
    public message: string = "";
    /** 分享信息（非必须，可不填） */
    public imgurl: string = "";
    public constructor() {
    }
}

class SdkStepDefinition {
    // /** 启动游戏 */
    // public static GameStart: string = "game_start";
    // /** 进入创建角色界面 */
    // public static CreateRoleView: string = "create_role_view";
    // /** 创建角色成功 */
    // public static CreateRoleSuccess: string = "create_role_success";
    // /** 进入选择角色界面 */
    // public static SelectRoleView: string = "select_role_view";
    // /** (选择角色或创角角色)角色登录成功 */
    // public static RoleLoginSuccess: string = "role_login_success";

    /** 角色进入游戏成功 */
    public static RoleEnterGameSucces: string = "role_enter_game_success";
    /** 进入选角页（不管创建角色还是选择已有角色 */
    public static SelectOrCreateRoleView: string = "select_or_create_role_view";

    public constructor() {
    }
}

/**
 * sdk统一管理，包括cdn、运营等的，统一当成sdk上线流程
 * 特殊方法：
 * Sdk.Pay
 * Sdk.Logout
 
 HTTP_QUERY参考：
    var querys = {"PLATFORM":"4399",
    "SERVER_CONFIG":"http:\/\/youku-platform.h5-dfh3.allrace.com\/"
    ,"isMobile":false
    ,"is_focus":1
    ,"is_invite":1
    ,"IS_SWITCH":0
    ,"OPEN_ID":"458942205"
    ,"SIGN":"1e58d680cba6c576bb0fcc14d3aeb153"

    ,"HTTP_QUERY":
    "&gameId=100049347
    &userId=458942205
    &userName=bavol17
    &time=1527235731
    &sign=1e58d680cba6c576bb0fcc14d3aeb153&pc=0"};
 */
class Sdk {
    // 直接打印Sdk.CdnRoot: http://192.168.32.100:9080/cdn/Client/web/
    //"http://127.0.0.1:9080/Client/resource"
    // 直接打印Sdk.Apk_Version: 20180529
    // 直接打印Sdk.Code_Version: 20180529code
    // 直接打印Sdk.Res_Version: 20180529res

    /**
     * 是否是线上版本：接sdk、登录分离、接cdn
     */
    public static IsOnlineVersion: boolean = false;
    /**
     * cdn地址，本地资源就是空串。注意js跨域问题
     */
    public static CdnRoot: string = "";
    /**
     * 后台运营控制版本：$push_data['av']，大版本好，也是cdn的文件夹名
     */
    public static Apk_Version: string = "";
    /**
     * 前端自定义：src, 客户端client代码版本，大更新时保持跟后端统一
     */
    public static Code_Version: string = "";
    public static Proto_Version: string = "";
    /**
     * 前端自定义：资源版本，有资源更新就改变
     */
    public static Res_Version: string = "";

    /** 微信的固定wss链接，改成正式服也改这里，减少配置加载，写死在代码上，反正微信也是要提审固定 */
    public static WXGameWSS: string = "s9001testwssfuyaoh5.yyxxgame.com";
    public static WXGameServerList: string = '{"specified": 0,"list": [{"name": "微信体验服","url": "s9001testwssfuyaoh5.yyxxgame.com:9484"}]}';
    public static WXGameServerListJson;
    public static server_ip: string = "192.168.1.83";
    public static server_port: string = "9500";

    public static testStepTimer: number = 0;
    public static is_new: number = 0;
    public static createRoleSelectIndex: number = 0;
    public static is_not_iframe: number = 0;
    public static is_close_recharge: number = 0;//是否关闭充值。1关闭

    /**
    1. "connect_server_success" //(PHP)连接游戏服成功
    2. "click_start_game" //(PHP)点击进入游戏按钮
    3. "start_load_res" //(PHP)开始加载资源
    4. "finish_load_res" //(H5)完成加载资源
    5. "show_create_role" //(H5)显示创角界面
    6. "click_create_role" //(H5)点击创建角色按钮
    7. "create_role_success" //(H5)创角成功
    8. "start_newbie_drama" //(H5)开始新手剧情介绍
    9. "popup_welcome_view" //(H5)弹出欢迎界面
    10. "start_newbie_journey" //(H5)欢迎界面结束开始跑新手
     */
    public static LogStepNew: Array<string> = ["",
        "connect_server_success",
        "enter_game_loading",
        "start_load_res",
        "finish_load_res",
        "show_create_role",
        "click_create_role",
        "create_role_success",
        "start_newbie_drama",
        "popup_welcome_view",
        "start_newbie_journey"];

    /**
    1. "connect_server_success" //(PHP)连接游戏服成功
    2. "click_start_game" //(PHP)点击进入游戏按钮
    3. "start_load_res" //(PHP)开始加载资源
    4. "finish_load_res" //(H5)完成加载资源
    5. "show_game_view" //(H5)显示游戏界面，进入游戏，显示角色
     */
    public static LogStepOld: Array<string> = ["",
        "connect_server_success",
        "enter_game_loading",
        "start_load_res",
        "finish_load_res",
        "show_game_view"];

    /**
    1. "socket_connect_1_start" //
    2. "socket_connect_1_succeed" //
    3. "socket_connect_2_start" //
    4. "socket_connect_2_succeed" //
     */
    public static LogSocketStep: Array<string> = ["",
        "socket_connect_1_start",
        "socket_connect_1_succeed",
        "socket_connect_2_start",
        "socket_connect_2_succeed"];

    public static LogPreloadStep: Array<string> = ["",
        "main_load_resource_version_succeed",
        "main_load_resource_core_succeed",
        "preload_without_config_start",
        "simple_config_finish",
        "global_json_finish",
        "filter_config_json_finish",
        "preload_without_config_succeed",
        "return_login_success",
        "ui_show_create_role_view",
        "ui_1s_preload_common_succeed",//10
        "ui_2s_preload_config_succeed",
        "ui_user_click_createbtn",
        "ui_auto20s_click_createbtn",
        "return_createrole_success",
        "return_gateloginrole_success",
        ""];

    public static LogConvertNewbieStep: Array<string> = ["",
        "first_load_fail_",
        ""];

    /**
     * 以下是S2C_SLogin字段，线上版本，php应该返回这些
     * 直接是：S2C_SLogin.data.myRoles.data的对应
     */
    // public static role_datas:any;

    /** 专门用于给sdk调用的角色拼装信息 */
    public static player_data: SdkPlayerData;
    /** 专门用于给sdk分享信息 */
    public static share_data: SdkShareData;
    /** 专门用于一些平台显示分享、关注、收藏等的功能 */
    public static platform_config_data: PlatformConfigData;

    //以下是C2S_SLogin需要登录发送的协议字段
    /** 即$uname */
    public static username: string = "bo002df3";
    public static userId: number = 1;
    public static server: string = "0";
    public static old_server: string = "0";
    public static flag: string = "flag";
    public static isAdult: number = 0;
    /** $sdkConfig['oid'] */
    public static platformCode: string = "test";
    public static serverName: string = "serverName";
    public static password: string = "123456";
    public static loginIp: string = "192.168.1.85";
    // public static ex:string = "s";

    //以下对应game.config.php，即php的$sdkConfig
    public static sdk_key: string = "";
    /** 代理商（渠道商）标示，如huoshu */
    public static oid: any;
    /** $sdkConfig['gcid'] */
    public static gcid: any;
    public static sv: any;
    public static av: any;
    public static uname: any;
    public static time: number;
    public static sign: any;
    public static version: any;
    public static game_id: any;
    public static app_id: any;
    public static game_key: any;
    public static timestamp: any;
    public static nonce: any;
    public static ticket: any;
    public static signature: any;
    public static login_type: any;
    public static game_url: any;
    public static xdext: any;
    public static phpapi_url: any;
    public static public_src: any;
    public static cdn_src: any;
    public static game_server: any;

    public constructor() {
    }

    public static init(): void {
        Sdk.player_data = new SdkPlayerData();
        Sdk.share_data = new SdkShareData();
        Sdk.platform_config_data = new PlatformConfigData();
        Sdk.initPlatformGameConfig();
        Sdk.createRoleSelectIndex = App.RandomUtils.limitInteger(0, 2);
    }

    /** sdk登录后显示游戏 */
    public static get ex(): string {
        let exStr = "";
        exStr = "{"
            + "\"bi\":[" + 0 + "," + "\"mobile\"" + "," + 0 + "],"
            + "\"channel_id\":" + 0 + ","
            + "\"game_channel_id\":" + (Sdk.gcid ? Sdk.gcid : "0") + ","
            + "\"platformCode\":\"" + Sdk.platformCode + "\","
            + "\"userType\":\"test\"" + ","
            + "\"idfa\":\"idfa_test\"" + ","
            + "\"showServerName\":\"" + Sdk.serverName + "\","
            + "\"forbitTalk\":" + 0
            + "}";
        console.log("发给服务器的后台统计ex: " + exStr);
        return exStr;
    }

    /** sdk刷新页面 */
    public static SdkRefreshPage(): void {
        if (Sdk.getParentWindowObj("refreshPage")) {
            Sdk.getParentWindowObj("refreshPage")();
        } else {
            location.reload();
        }
    }

    /** sdk登录后显示游戏 */
    public static SdkToShowGame(): void {
        if (window["showGame"] && typeof window["showGame"] == "function") {
            window["showGame"]();
        } else {
            console.log("内网... SdkToShowGame");
        }
    }

    /** sdk登录后显示php加载页 */
    public static SdkToHideGame(): void {
        if (window["hideGame"] && typeof window["hideGame"] == "function") {
            window["hideGame"]();
        } else {
            console.log("内网... SdkToHideGame");
        }
    }

    /** sdk显示php加载页的进度 */
    public static SdkToShowLoadProgress(v: number = 0, str: string = ""): void {
        console.log("sdk显示php加载页的进度: " + v + ",  str: " + str);
        if (window["showLoadProgress"] && typeof window["showLoadProgress"] == "function") {
            window["showLoadProgress"](v, str);
        } else {
            console.log("内网... SdkToShowLoadProgress");
        }
    }

    /** sdk页面打log */
    public static add_log_message(logData: any): void {
        console.log("add_log_message: ", logData);
        if (Sdk.getParentWindowObj("add_log_message")) {
            Sdk.getParentWindowObj("add_log_message")(logData);
        }
    }

    /** php页面弹提示 */
    public static popup_php_msg(msg: any): void {
        if (Sdk.getParentWindowObj("popup_php_msg")) {
            Sdk.getParentWindowObj("popup_php_msg")(msg);
        }
    }

    /** 进入游戏日志 */
    public static enterLog(): void {
        console.log("enterLog进入游戏日志，客户端player_data", Sdk.player_data);
        if (Sdk.getParentWindowObj("enterLog")) {
            Sdk.getParentWindowObj("enterLog")(Sdk.player_data);
        }
    }

    /** 创建角色日志 */
    public static createLog(): void {
        console.log("createLog进入创建角色日志，客户端player_data", Sdk.player_data);
        if (Sdk.getParentWindowObj("createLog")) {
            Sdk.getParentWindowObj("createLog")(Sdk.player_data);
        }
    }

    /** 升级日志 */
    public static levelUpLog(level: number, vipLevel: number, score: number, role_level_reborn: number = 0): void {
        // return;//php有报错，临时屏蔽
        Sdk.player_data.level = level;
        Sdk.player_data.vip_level = vipLevel;
        Sdk.player_data.score = score;
        Sdk.player_data.role_level_reborn = role_level_reborn;
        if (CacheManager.guild.isJoinedGuild()) {
            Sdk.player_data.guildId = CacheManager.guild.playerGuildInfo.guildId_I;
            Sdk.player_data.guildName = CacheManager.guild.playerGuildInfo.guildName_S;
        }
        if (CacheManager.role.money) {
            Sdk.player_data.coinBind = CacheManager.role.money.coinBind_L64;
            Sdk.player_data.gold = CacheManager.role.money.gold_I;
        }

        //服务器有时过快发了的处理
        if (0 == Sdk.player_data.server_id) {
            if (CacheManager.role.player && CacheManager.role.player.serverId_I) {
                Sdk.player_data.server_id = CacheManager.role.player.serverId_I;
            }
        }
        if (0 == Sdk.player_data.server_id) {
            return;
        }

        console.log("levelUpLog进入升级日志，客户端player_data", Sdk.player_data);
        if (Sdk.getParentWindowObj("levelUpLog")) {
            Sdk.getParentWindowObj("levelUpLog")(Sdk.player_data);
        }
    }

    /** 玩家更新信息 */
    public static updatePlayer(): void {
        console.log("updatePlayer上报：角色更新，客户端player_data", Sdk.player_data);
        if (Sdk.getParentWindowObj("updatePlayer")) {
            Sdk.getParentWindowObj("updatePlayer")(Sdk.player_data);
        }
    }

    /** 埋点step */
    public static logStep(step: string): void {
        Sdk.player_data.step = step;
        console.log("logStep上报：埋点更新，step: ", step);
        console.log("logStep上报：埋点更新，time: ", Sdk.player_data.time);
        if(!App.DeviceUtils.IsWXGame) {
            if (Sdk.getParentWindowObj("logStep")) {
                Sdk.getParentWindowObj("logStep")(Sdk.player_data);
            }
        }
        else {
            WXGameUtil.postStep(null,this,step, Sdk.player_data.time,"huoshu","0", "x1111d9ccbd3fb6fd3d4de68c5c88c21");
        }
    }

    /** 是否需要显示下载微端 */
    public static get isNeedMicroClient(): boolean {
        if (!Sdk.IsOnlineVersion) return true;
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.has_micro_client == 1;
        }
        return false;
    }

    /** 下载微端 */
    public static downloadMicroClient(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("downloadMicroClient")) {
            Sdk.getParentWindowObj("downloadMicroClient")(callBack, callBackObj);
        }
    }

    /** 是否需要分享 */
    public static get isNeedShare(): boolean {
        if (!Sdk.IsOnlineVersion) return true;
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_share == 1;
        }
        return false;
    }

    public static get isNeedCertification() : boolean {
        if(!Sdk.IsOnlineVersion) return true;
        return true;
    }

    /**
     * 平台 分享、关注、下载微端
     */
    public static platformOperation(type: EShareRewardType): void {
        if (type == EShareRewardType.EShareRewardTypeShare) {
            Sdk.share(function (result: any) {
                console.log("sdk测试分享:callback:", result);
                Sdk.platform_config_data.is_share = result.code;
                if (result.code == 0 && CacheManager.platform.isShareCanGetReward()) { //还需要判断cd时间,奖励次数
                    ProxyManager.operation.getPlatformReward(type);
                    //EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.Share);
                }
            }, this);
        }
        else if (type == EShareRewardType.EShareRewardTypeMicro) {
            Sdk.downloadMicroClient(function (result: any) {
                console.log("sdk测试下载微端:callback:", result);
                Sdk.platform_config_data.has_micro_client = result.code;
                // if(result.code == 0) {
                //     EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.MiniClient);
                // }
            }, this);
        }
        else if (type == EShareRewardType.EShareRewardTypeCare) {
            Sdk.sdkFocus(function (result: any) {
                console.log("sdk测试关注:callback:", result);
                Sdk.platform_config_data.is_focus = result.code;
                if (result.code == 0) {
                    EventManager.dispatch(LocalEventEnum.RemoveHomeIcon, IconResId.Focus);
                    ProxyManager.operation.getPlatformReward(type);
                }
            }, this);
        }
        else if(type == EShareRewardType.EShareRewardTypeSM) {
            Sdk.smCertification(function(result: any) {
                console.log("sdk测试实名认证:callback:", result);
                if (result.code == 0) {
                    console.log("后端实名状态：",CacheManager.certification.issm);
                    console.log("sdk实名状态", Sdk.platform_config_data.is_eissm);
                    if(CacheManager.certification.issm == 0 || Sdk.platform_config_data.is_eissm == 2) {
                        Sdk.platform_config_data.is_eissm = 3;
                        ProxyManager.certification.sendCertificationFake();
                    }
                }
            }, this);
        }

        // ProxyManager.operation.getPlatformReward(type);
    }


    /**实名 */
    public static smCertification(callBack : Function = null, callbackObj : any = null): void {
        if(Sdk.getParentWindowObj("gameEissm")) {
            Sdk.getParentWindowObj("gameEissm")(Sdk.player_data, callBack, callbackObj);
        }
    }

    /** 分享 */
    public static share(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("share")) {
            Sdk.getParentWindowObj("share")(Sdk.share_data, callBack, callBackObj);
        }
    }

    /** 是否需要显示关注 */
    public static get isNeedFocus(): boolean {
        if (!Sdk.IsOnlineVersion) return true;
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_focus == 1;
        }
        return false;
    }

    /** 关注 */
    public static sdkFocus(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("sdkFocus")) {
            Sdk.getParentWindowObj("sdkFocus")(callBack, callBackObj);
        }
    }

    /**
     * 获取公告。回调函数参数为公告内容
     */
    public static sdkNotice(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("sdkNotice")) {
            Sdk.getParentWindowObj("sdkNotice")((result) => {
                if(result.code == 0 && result.data != null && result.data.content != null) {
                    callBack.call(callBackObj, result.data.content);
                }
            }, this);
        }
    }

    /**领取激活码
     * @param data data.sid = '9001';  //服id
            data.pwd = 'hfsfhglkafhglakhgl1111';  //媒体卡号
            data.player_id = '110';  //玩家角色ID
     *  */
    public static exchangeCdkey(data: any): void {
        console.log("----------exchangeCdkey data", data);
        if (Sdk.getParentWindowObj("exchangeCdkey")) {
            Sdk.getParentWindowObj("exchangeCdkey")(data, (rest) => {
                //rest参数
                /*{
                "code":0,
                "data":"0"  //返回成功
                "msg":""
                }
                data参数：
                    //EMediaErrorSuccess            = 0, //成功
                    //EMediaErrorConfigError        = 1, //配置错误
                    //EMediaErrorMaxTimes           = 2, //领取次数已用完
                    //EMediaErrorServerLimit        = 3, //该服不能领取
                    //EMediaErrorPlatformLimit      = 4, //该渠道不能领取
                    //EMediaErrorNotConnectMoniter  = 5, //没有连接到监控服务器
                    //EMediaErrorNotCardNotExist    = 6, //卡不存在
                    //EMediaErrorHadExpire          = 7, //卡已过期
                    //EMediaErrorHadUsed            = 8, //卡已被使用

                */
                console.log("-------exchangeCdkey rest:", rest);

            });
        }

    }

    /** 是否需要显示保存到桌面 */
    public static get isNeedSaveToDesktop(): boolean {
        if (!Sdk.IsOnlineVersion) return !CacheManager.platform.isGetDestopReward();
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_desktop == 1 && !CacheManager.platform.isGetDestopReward(); //已经领奖的不显示 
        }
        return false;
    }

    /** 保存到桌面 */
    public static saveToDesktop(): void {
        if (Sdk.getParentWindowObj("saveToDesktop")) {
            Sdk.getParentWindowObj("saveToDesktop")(Sdk.player_data);
        }
    }

    /** 是否需要切换账号功能 */
    public static get isNeedSwitchAccount(): boolean {
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_switch_account == 1;
        }
        return false;
    }

    public static get isNeedSm() : boolean {
        if(Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_eissm != 0 && Sdk.platform_config_data.is_eissm != 3;
        }
        return false;
    }

    /** 切换账号 */
    public static switchAccount(): void {
        if (Sdk.getParentWindowObj("switchAccount")) {
            Sdk.getParentWindowObj("switchAccount")(Sdk.player_data);
        }
    }

    /** 是否需要收藏 */
    public static get isNeedFavorite(): boolean {
        if (Sdk.platform_config_data.is_init) {
            return Sdk.platform_config_data.is_favorite == 1;
        }
        return false;
    }

    /** 收藏 */
    public static favorite(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("collection")) {
            Sdk.getParentWindowObj("collection")(Sdk.share_data, callBack, callBackObj);
        }
    }

    /** 充值，php函数是create_pay */
    public static pay(money: number = 1, product_id: string = "", callBack: Function = null, callBackObj: any = null): void {
        Sdk.player_data.money = money;
        Sdk.player_data.product_id = product_id;
        console.log("pay充值：充值金额: ", money, ", product_id: ", product_id);
        console.log("pay充值时的player_data:", Sdk.player_data);

        if (Sdk.getParentWindowObj("create_pay")) {
            Sdk.getParentWindowObj("create_pay")(Sdk.player_data, callBack, callBackObj);
        }
    }

    /** getgamesetting，获取游戏设置 */
    public static getGameConfig(callBack: Function = null, callBackObj: any = null): void {
        if (Sdk.getParentWindowObj("getGameConfig")) {
            Sdk.getParentWindowObj("getGameConfig")(callBack, callBackObj);
        }
    }

    /** 初始化平台设置 */
    public static initPlatformGameConfig(): void {
        console.log("game_config_data:", Sdk.getParentWindowObj("game_config_data"));
        if (Sdk.getParentWindowObj("game_config_data")) {
            let gameConfigData: any = Sdk.getParentWindowObj("game_config_data");
            if (gameConfigData.data) {
                Sdk.platform_config_data.is_init = true;
                Sdk.platform_config_data.is_share = gameConfigData.data.is_share || 0;
                Sdk.platform_config_data.has_micro_client = gameConfigData.data.has_micro_client || 0;
                Sdk.platform_config_data.is_focus = gameConfigData.data.is_focus || 0;
                Sdk.platform_config_data.is_desktop = gameConfigData.data.is_desktop || 0;
                Sdk.platform_config_data.is_switch_account = gameConfigData.data.is_switch_account || 0;
                Sdk.platform_config_data.is_favorite = gameConfigData.data.is_favorite || 0;
                Sdk.platform_config_data.is_close_cs = gameConfigData.data.is_close_cs || 0;
                Sdk.platform_config_data.is_eissm = gameConfigData.data.is_eissm || 0;
                Sdk.platform_config_data.is_anti_addiction = gameConfigData.data.is_anti_addiction || 0;
                Sdk.platform_config_data.is_treasure_hunt = gameConfigData.data.is_treasure_hunt || 0;
                //初始化是否关闭充值
                Sdk.platform_config_data.is_close_recharge = gameConfigData.data.is_close_recharge || 0;
                Sdk.platform_config_data.notice_content = gameConfigData.data.notice_content || "";
                if (gameConfigData.data.platform_pay_type) {
                    Sdk.platform_config_data.platform_pay_type = gameConfigData.data.platform_pay_type || 1;
                }
            }
        }
    }

    public static get phpGameConfig(): any {
        if (Sdk.getParentWindowObj("game_config_data")) {
            console.log("game_config_data:", Sdk.getParentWindowObj("game_config_data"));
            return Sdk.getParentWindowObj("game_config_data");
        } else {
            console.log("内网... gameConfigData");
        }
        return null;
    }

    /** 获取parent.window的函数，如果不是iframe的(is_not_iframe)，就直接window */
    public static getParentWindowObj(funcName: string = ""): any {
        // console.log("Sdk.is_not_iframe: ", Sdk.is_not_iframe);
        if (Sdk.is_not_iframe) {
            // if (window[funcName] && typeof window[funcName] == "function") {
            if (window[funcName]) {
                return window[funcName];
            }
        } else {
            // if (parent.window[funcName] && typeof parent.window[funcName] == "function") {
            if (parent.window[funcName]) {
                return parent.window[funcName];
            }
        }
        console.log("intranet getParentWindowObj: ", funcName);
        return null;
    }

    public static SERVER_CONFIG: string = 'http://manage.mini.yaowan.com:90/';
    public static VERSION: string = "201701130355"

    public static Packaged_Version = "1.1.2.1868";  //前端配置版本号
    public static Back_Version = "";  //后端配置版本号
    public static Reviewing: number = 0;
    public static InWhite = false;  //是否白名单
    public static IsChecking = false; //是否审核中

    public static PLATFORM_KEY = "^_^dfh3:start@2015-09-24!";
    public static OPEN_ID = "";
    public static TOKEN = "";
    public static PLATFORM = "temp";
    public static IS_TEST = "0";
    public static SDK_NICK = "";
    public static SDK_DATA = "";
    public static FUID = "";
    public static CLIENT_TYPE = "";
    public static HTTP_QUERY = "";
    public static account_type = 0;
    public static PUSH_ID = '0';  //推送ID
    public static APP_NAME = "";  //包名
    public static IS_SWITCH = 1;  //是否可以切换账号
    public static IS_WxQQ = false; //是否微信QQ登录

    public static is_focus: number = 0;
    public static is_invite: number = 0;
    public static Focus: any;
    public static Logout: any;
    public static binding: any;     //绑定账号
    public static CONFIRM_CHARGE: boolean = false;  //提示确认充值
}
