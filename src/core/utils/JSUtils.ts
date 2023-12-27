class JSUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 是不是合法ip地址
     */
    public CheckValidIP(ipStr: string = ""): boolean {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipStr)) {
            return true;
        }
        return false;
    }

    /**
     * 获取url的参数obj
     */
    public getAllUrlParams(url: string = null): any {
        if (App.DeviceUtils.IsWXGame) {
            return {};
        }
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};

        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                paramName = paramName.toLowerCase();
                if (typeof (paramValue) !== 'boolean')
                    paramValue = paramValue.toLowerCase();

                if (obj[paramName]) {
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    if (typeof paramNum === 'undefined') {
                        obj[paramName].push(paramValue);
                    }
                    else {
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    }

    /**
     * 是不是本地开发环境，localhost, 127.0.0.1, 192.168.0
     */
    public get IsLocalDev(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return false;
        }
        var hostString = window.location.hostname;
        if (hostString.indexOf("localhost") != -1
            || hostString.indexOf("127.0.0.1") != -1
            || hostString.indexOf("192.168.0") != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 非sdk非php入口环境下，判断是不是外网环境，localhost, 127.0.0.1, 192.168.0
     * 即Sdk.IsOnlineVersion也是false
     */
    public get IsUrlOutside(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return true;
        }
        var hostString = window.location.hostname;
        if (hostString.indexOf("localhost") != -1
            || hostString.indexOf("127.0.0.1") != -1
            // || hostString.indexOf("beta") != -1
            || hostString.indexOf("192.168") != -1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 是否是前端稳定测试服
     */
    public get IsClientStable(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return false;
        }
        var pathnameString: string = "";
        if (window.location.pathname) {
            pathnameString = window.location.pathname;
        }
        if (pathnameString.indexOf("_stable") != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 支持GM打印
     */
    public get IsNeedGMLog(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return false;
        }
        var searchString = window.location.search;
        if (searchString.indexOf("gm=true") != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 支持fps显示
     */
    public get IsNeedFPS(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return false;
        }
        var searchString = window.location.search;
        if (searchString.indexOf("fps=true") != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 支持特殊的缓存路径打印
     */
    public get IsNeedSpecialLog(): boolean {
        if (App.DeviceUtils.IsWXGame) {
            return false;
        }
        var searchString = window.location.search;
        if (searchString.indexOf("special=true") != -1) {
            return true;
        } else {
            return false;
        }
    }


    public get payType(): PlatformPayType {
        if (App.DeviceUtils.IsWXGame) {
            return PlatformPayType.Android;
        }
        let params: any = this.getAllUrlParams(window.location.search);
        if (params["pay_type"] != null) {
            return Number(params["pay_type"]);
        }
        return PlatformPayType.Android;
    }


}