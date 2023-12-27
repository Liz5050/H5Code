/**
 * 音效类
 */
class SoundEffects extends BaseSound {
    private _volume:number;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 播放一个音效
     * @param effectName
     */
    public play(effectName:string,volume:number = -1):void {
        var sound:egret.Sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound,volume);
        }
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound:egret.Sound,volume:number = -1):void {
        // fairygui.GRoot.inst.playOneShotSound(sound);
        var channel:egret.SoundChannel = sound.play(0, 1);
        channel.volume = volume == -1 ? this._volume : volume;
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume:number):void {
        this._volume = volume;
    }

    private firstLoadedPlay:boolean = true;
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key:string):void {
        // if (this.firstLoadedPlay && key.indexOf(SoundName.Effect_QiangHuaChengGong) != -1) {
        //     this.playSound(App.LoaderManager.getCache(key));
        //     this.firstLoadedPlay = false;
        //     console.log("firstLoadedPlay===", key)
        // }
    }

}