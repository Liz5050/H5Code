/**
 * Sound基类
 */
class BaseSound {
    public _cache:any;

    /**
     * 构造函数
     */
    public constructor() {
        this._cache = {};

        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }

    /**
     * 处理音乐文件的清理
     */
    private dealSoundTimer():void {
        var currTime:number = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i:number = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key))
                continue;
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                //console.log(key + "已clear")
                delete this._cache[key];
                App.LoaderManager.destroyRes(key);
            }
        }
    }

    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    public getSound(key:string):egret.Sound {
        var sound:egret.Sound = App.LoaderManager.getCache(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        } else {
            App.LoaderManager.getResByUrl(key, this.onResourceLoadComplete, this,ELoaderPriority.DEFAULT,[key]);
        }
        return sound;
    }

    /**
     * 资源加载完成
     * @param event
     */
    private onResourceLoadComplete(key:string):void {
        this._cache[key] = egret.getTimer();
        this.loadedPlay(key);
    }

    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    public loadedPlay(key:string):void {

    }

    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key:string):boolean {
        return true;
    }
}