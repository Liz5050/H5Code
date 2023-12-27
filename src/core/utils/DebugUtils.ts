/**
 * Debug调试工具
 */
class DebugUtils extends BaseClass {
    private _isOpen:boolean;
    private _startTimes:any;
    private _threshold:number = 3;

    public constructor() {
        super();
        this._startTimes = {};
    }

    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    public isOpen(flag:boolean):void {
        this._isOpen = flag;
    }

    /**
     * 是否是调试模式
     * @returns {boolean}
     */
    public get isDebug():boolean {
        return this._isOpen;
    }

    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    public start(key:string):void {
        if (!this._isOpen) {
            return;
        }

        this._startTimes[key] = egret.getTimer();
    }

    /**
     * 停止
     *
     */
    public stop(key,param:any = null):number {
        if (!this._isOpen) {
            return 0;
        }

        if (!this._startTimes[key]) {
            return 0;
        }

        var cha:number = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Log.trace(Log.GAME, key + ": " + cha);
        }
        return cha;
    }

    /**
     * 设置时间间隔阈值
     * @param value
     */
    public setThreshold(value:number):void {
        this._threshold = value;
    }

    /**
     * 游戏内动态显示fps
     */
    public onDisplayFPS():void {
        if (App.DeviceUtils.IsWXGame) {
            return;
        }
        let list = document.querySelectorAll(".egret-player");
        let container = list[0];
        let player = container["egret-player"].player;
        let fpsStyle={bgAlpha:"0.3", size:16, textColor:"0xffffff", x:0, y:0};
        player.displayFPS(true, false, false,fpsStyle);
    }

    /**开启GM */
    public onOpenGM():void {
        this._isOpen = true;
        EventManager.dispatch(LocalEventEnum.GMOpen, true);
    }

    public static isDebugDC():boolean{
        if(!DEBUG){
            return false;
        }
        return false;
    }

}
