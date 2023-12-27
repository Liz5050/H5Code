/**
 * 单一资源通过版本号加载管理类
 */
class ResVersionManager extends BaseClass {
    private static resVersionData: any = null;
    private complateFunc: Function;
    private complateFuncTarget: any;
    private static isUrlOutside: boolean = true;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this.res_loadByVersion();
    }

    /**
     * Res加载使用版本号的形式
     * "resource_version.json"： 版本号文件特殊，本地就随便，发布版本要加?v=
     */
    private res_loadByVersion(): void {
        // RES.getVirtualUrl = function (url) {
        RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
            if ("http:" == url.substr(0, 5) || "https:" == url.substr(0, 6)) {
                return url;
            }
            var version: string = "";
            var urlTemp: string = url.substring(9);
            if (ResVersionManager.resVersionData && ResVersionManager.resVersionData[urlTemp]) {
                version = ResVersionManager.resVersionData[urlTemp];
            }

            if (urlTemp.indexOf("resource_version.json") == -1) {

                if (ResVersionManager.isUrlOutside) {
                    if (version.length == 0) {
                        version = Math.random() + "";
                    }
                } else {
                    version = Math.random() + ""; //内网先固定随机版本号，要在185上集成
                }

                // if (version.length == 0) {
                //     version = Math.random() + "";
                // }
                if (url.indexOf("?") == -1) {
                    url += "?v=" + version;
                } else {
                    url += "&v=" + version;
                }
            }

            if (Sdk.IsOnlineVersion) {
                url = Sdk.CdnRoot + Sdk.Apk_Version + "/" + url;
            } else if (App.DeviceUtils.IsWXGame) {
                url = Sdk.CdnRoot + Sdk.Apk_Version + "/" + url;
                // console.log("微信小游戏...url加载值: " + url);
            }

            if (App.JSUtils.IsNeedSpecialLog) {
                console.log("url加载值: " + url);
            }
            return url;
        }
    }

    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    public loadConfig(url: string, complateFunc: Function, complateFuncTarget: any): void {
        // console.log("loadConfig: resource_version url: ", url);
        this.complateFunc = complateFunc;
        this.complateFuncTarget = complateFuncTarget;
        RES.getResByUrl(url, this.loadResVersionComplate, this, RES.ResourceItem.TYPE_JSON);
    }

    public setVersionData(verData: any): void {
        ResVersionManager.resVersionData = verData;
        // console.log("直接打印: resVersionData.length: ", ResVersionManager.resVersionData.length);
        // console.log("直接打印: resVersionData: ", ResVersionManager.resVersionData);
    }

    public get hasResVersionData(): boolean {
        return ResVersionManager.resVersionData != null;
    }

    public setIsUrlOutside(): void {
        ResVersionManager.isUrlOutside = App.JSUtils.IsUrlOutside;
    }

    /**
     * 配置文件加载完成
     * @param data
     */
    private loadResVersionComplate(data: any): void {
        ResVersionManager.resVersionData = data;
        this.complateFunc.call(this.complateFuncTarget);
    }
}
