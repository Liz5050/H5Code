/**
 * 强制指引特效
 */
class GuideForceClickMc extends fairygui.GComponent {
    private mc1: UIMovieClip;
    private mc2: UIMovieClip;
    private _isPlaying: boolean;
    /**需要播放的次数 */
    private times: number = 0;
    /**已播放次数 */
    private playedTimes: number = 0;
    /**
     * 缩放，扩大1倍，位置向左上偏移128像素。特效为512*512
     * @type {number}
     */
    private mcScale: number = 3;

    public constructor() {
        super();
        this.touchable = false;
        this.initOptUI();
    }

    private initOptUI(): void {
        this.mc1 = UIMovieManager.get(PackNameEnum.MCClickForce);
        this.mc1.setPivot(0.5, 0.5);
        this.mc1.setScale(this.mcScale, this.mcScale);
        this.mc2 = UIMovieManager.get(PackNameEnum.MCClickForce);
        this.mc2.setPivot(0.5, 0.5);
        this.mc2.setScale(this.mcScale, this.mcScale);
        this.addChild(this.mc1);
        this.addChild(this.mc2);
    }

    /**
     * 播放
     * @param {number} times 0循环播放
     */
    public play(times: number): void {
        this.times = times;
        this.playedTimes = 0;
        this.playOne();
    }

    /**
     * 停止播放
     */
    public stop(): void {
        this.mc1.visible = false;
        this.mc1.playing = false;
        this.mc2.visible = false;
        this.mc2.playing = false;
        this.playedTimes = 0;
        this._isPlaying = false;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    /**
     * 中心点在正中间
     * @returns {number}
     */
    public get offset(): number {
        return this.mcScale * 128;
    }

    private playOne(): void {
        if (this.times != 0 && this.playedTimes >= this.times) {
            this._isPlaying = false;
            return;
        }
        this._isPlaying = true;
        this.mc1.visible = true;
        this.mc2.visible = true;
        this.mc1.setPlaySettings(0, -1, 1, -1, () => {
            this.mc1.visible = false;
            this.mc1.playing = false;
        }, this);
        this.mc1.playing = true;

        egret.Tween.removeTweens(this.mc1);
        egret.Tween.get(this.mc1).to({}, 167).call(() => {
            this.mc2.alpha = 0.7;
            this.mc2.setPlaySettings(0, -1, 1, -1, () => {
                this.mc2.visible = false;
                this.mc2.playing = false;
                this.playedTimes++;
                this.playOne();
            }, this);
            this.mc2.playing = true;
        }, this);
    }
}