/**
 * Sound管理类
 */
class SoundManager extends BaseClass {
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    public static CLEAR_TIME:number = 5 * 60 * 1000;
    /** 用户交互标识*/
    public hasInteract:boolean;
    public static URL_FIRST_SOUND:string = "resource/sound/skill/1001_2.mp3";

    private effect:SoundEffects;
    private bg:SoundBg;
    private gTalk:SoundBg;
    private effectOn:boolean;
    private bgOn:boolean;
    private currBg:string;
    private bgVolume:number;
    private effectVolume:number;
    private curBgPosition:number = 0;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        this.bgOn = true;
        this.effectOn = true;

        this.bgVolume = 0.5;
        this.effectVolume = 0.5;

        this.bg = new SoundBg();
        this.bg.setVolume(this.bgVolume);

        this.gTalk = new SoundBg();
        this.gTalk.setVolume(1);

        this.effect = new SoundEffects();
        this.effect.setVolume(this.effectVolume);
    }

    public playFirstSound():boolean {
        if (this.effect.getSound(SoundManager.URL_FIRST_SOUND)) {
            this.effect.play(SoundManager.URL_FIRST_SOUND);
            return true;
        }
        return false;
    }

    /**
     * 播放音效
     * @param effectName
     */
    public playEffect(effectName:string,volume:number = -1):void {
        if (!this.effectOn || !this.canPlaySound)
            return;

        this.effect.play(ResourcePathUtils.getSound() + "effect/" + effectName,volume);
    }

    /**
     * 播放技能音效
     * @param skillSoundName
     */
    public playSkill(skillSoundName:string):void {
        if (!this.effectOn || !this.canPlaySound || !skillSoundName)
            return;
        if (skillSoundName.indexOf(',') != -1) {
            let arr:string[] = skillSoundName.split(',');
            skillSoundName = arr[Math.random() * arr.length >> 0];
        }
        this.effect.play(ResourcePathUtils.getSound() + "skill/" + skillSoundName + ".mp3");
    }

    /**
     * 播放背景音乐
     * @param key
     */
    public playBg(bgName:string,loop:number = -1):void {
        this.currBg = bgName;
        if (!this.bgOn || !this.canPlaySound)
            return;
        this.bg.play(ResourcePathUtils.getSound() + "scene/" + bgName,loop);
        // if (App.DeviceUtils.IsInMicroClient) {
        // }
        // this.currBg = bgName;
        // if (!this.bgOn || !this.canPlaySound)
        //     return;
        // this.bg.play(ResourcePathUtils.getSound() + "scene/" + bgName);
    }

    /**
     * 停止背景音乐
     */
    public stopBg():void {
        this.bg.stop();
        // if (App.DeviceUtils.IsInMicroClient) {
        // }
        // this.bg.stop();
    }

    /**
     * 语音对话
     */
    public playTalk(name:string,loop:number = 1):void
    {
        // if(!this.effectOn || !this.canPlaySound) return;
        // this.gTalk.play(ResourcePathUtils.getSound() + "talk/" + name,loop);
    }

    public stopTalk():void
    {
        // this.gTalk.stop();
    }

    /**
     * 设置音效是否开启
     * @param $isOn
     */
    public setEffectOn($isOn:boolean):void {
        this.effectOn = $isOn;
    }

    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    public setBgOn($isOn:boolean):void {
        this.bgOn = $isOn;
        if (!this.bgOn) {
            this.bg.pause();
        } else {
            if (this.currBg) {
                this.playBg(this.currBg,1);
            }
        }
    }

    /**
     * 设置背景音乐音量
     * @param volume
     */
    public setBgVolume(volume:number):void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.setBgOn(volume > 0);
        this.bg.setVolume(this.bgVolume);
    }

    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    public getBgVolume():number {
        return this.bgVolume;
    }

    /**
     * 设置音效音量
     * @param volume
     */
    public setEffectVolume(volume:number):void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.setEffectOn(volume > 0);
        this.effect.setVolume(this.effectVolume);
        this.gTalk.setVolume(this.effectVolume);
    }

    /**
     * 获取音效音量
     * @returns {number}
     */
    public getEffectVolume():number {
        return this.effectVolume;
    }

    private get canPlaySound():boolean {
        return ControllerManager.scene && ControllerManager.scene.sceneReady && CacheManager.sysSet.isInit && this.hasInteract;
    }   
}