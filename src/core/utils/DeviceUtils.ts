class DeviceUtils extends BaseClass {
    //App is in Background
    private _inBackground: boolean;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 设置调试是否开启
     */
    public isInBackground(flag: boolean): void {
        this._inBackground = flag;
    }

    /**
     * APP是否处于后台的标志
     */
    public get AppInBackground(): boolean {
        return this._inBackground;
    }

    /**
     * APP是否处于最小化(PC上)，一般配合 App.DeviceUtils.IsPC
     */
    public get isMinimize(): boolean {
        if (!App.DeviceUtils.IsPC) {
            return false;
        }
        let isMin = false;
        if (window.outerWidth != undefined) {
            isMin = window.outerWidth <= 160 && window.outerHeight <= 27;
        } else {
            isMin = window.screenTop < -30000 && window.screenLeft < -30000;
        }
        return isMin;
    }

    /**
     * 当前是否微信小游戏
     * @returns {boolean}
     * @constructor
     */
    public get IsWXGame(): boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;
    }

    /**
     * 当前是否iPhone X系列，分小游戏和非小游戏
     * @returns {boolean}
     * @constructor
     */
    public get IsIPhoneX(): boolean {
        if (this.IsWXGame) {
            if (window["isIPhoneX"]) {
                return window["isIPhoneX"];
            }
        } else {
            return navigator.userAgent.indexOf("iphone OS") != -1 && screen.height == 812 && screen.width == 375;
        }
        return false;
    }

    /**
     * 当前是否Html5版本
     * @returns {boolean}
     * @constructor
     */
    public get IsHtml5(): boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
    }

    /**
     * 当前是否是Native版本
     * @returns {boolean}
     * @constructor
     */
    public get IsNative(): boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }

    /**
     * 是否是在手机上
     * @returns {boolean}
     * @constructor
     */
    public get IsMobile(): boolean {
        return egret.Capabilities.isMobile;
    }

    /**
     * 是否是在PC上
     * @returns {boolean}
     * @constructor
     */
    public get IsPC(): boolean {
        return !egret.Capabilities.isMobile;
    }

    /**
     * 是否在iPad上
     */
    public get IsIPad(): boolean {
        return navigator && navigator.userAgent && navigator.userAgent.indexOf("iPad") != -1;
    }

    /**
     * 是否在微端上，先不包括webview吧
     * 是不是微端，首先要判断是不是web版本，再用下面两行代码的返回值，
     * window.navigator.userAgent.toLowerCase().indexOf('egretnative') >= 0;
     * window.navigator.userAgent.toLowerCase().indexOf('egretwebview') >= 0;
     */
    public get IsInMicroClient(): boolean {
        // console.log("直接打印: ", egret.getOption("egretnative"));
        // console.log("直接打印: ", window.navigator.userAgent.toLowerCase());
        if (egret.getOption("egretnative") == "true") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 系统平台(1:iOS,2:Android,3:win)
     * @returns {boolean}
     * @constructor
     */
    public get getOSType(): number {
        if (egret.Capabilities.os == "iOS") {
            return 1;
        } else if (egret.Capabilities.os == "Android") {
            return 2;
        } else {
            return 3;
        }
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsQQBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }

    /**
     * 是否是IE浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsIEBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }

    /**
     * 是否是Firefox浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsFirefoxBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }

    /**
     * 是否是Chrome浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsChromeBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }

    /**
     * 是否是Safari浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsSafariBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }

    /**
     * 是否是Opera浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsOperaBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }
}