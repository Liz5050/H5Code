/**
 * 背景音乐类
 */
class SoundBg extends BaseSound {
    private _currBg:string;
    private _currSound:egret.Sound;
    private _currSoundChannel:egret.SoundChannel;
    private _volume:number;
    private _loop:number = -1;
    private _position:number = 0;
    private _lastBg:string;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._currBg = "";
    }

    /**
     * 停止当前音乐
     */
    public stop():void {
        if (this._currSoundChannel) {
            this._currSoundChannel.removeEventListener(egret.Event.SOUND_COMPLETE,this.onSoundCompleteHandler,this);
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    }

    /**
     * 播放某个音乐
     * @param effectName
     */
    public play(effectName:string,loop:number = -1):void {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        this._lastBg = effectName;
        this._loop = loop;
        var sound:egret.Sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    }

    public pause():void {
        if(this._currSoundChannel) {
            this._position = this._currSoundChannel.position;
        }
        this.stop();
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound:egret.Sound):void {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(this._position, this._loop);
        this._currSoundChannel.volume = this._volume;
        if(this._loop != -1) {
            this._currSoundChannel.addEventListener(egret.Event.SOUND_COMPLETE,this.onSoundCompleteHandler,this);
        }
    }

    private onSoundCompleteHandler():void {
        this.stop();
        this._position = 0;
        this._loop = -1;
        this.play(this._lastBg);
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume:number):void {
        this._volume = volume;
        if (this._currSoundChannel) {
            if(this._currSoundChannel["isStopped"]) return;
            this._currSoundChannel.volume = this._volume;
        }
    }

    /**
     * 资源加载完成后处理播放    
     * @param key
     */
    public loadedPlay(key:string):void {
        if (this._currBg == key) {
            this.playSound(App.LoaderManager.getCache(key));
        }
    }

    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key:string):boolean {
        return this._currBg != key;
    }
}