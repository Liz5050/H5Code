/**
 * 指引点击视图，用于直接加到组件内
 */
class GuideClickView2 extends fairygui.GComponent {
    public guideKey: string;
    public clickMc: UIMovieClip;
    private forceClickMc: GuideForceClickMc;
    /**
     * 特效放大次数
     */
    private _amplifyTimes: number;
    private mcWidth: number = 256;
    private mcScale: number = 1.2;

    public constructor(amplifyTimes: number = 1, isListenClear: boolean = true) {
        super();
        this.touchable = false;
        this.amplifyTimes = amplifyTimes;
        this.initOptUI();

        if (isListenClear) {
            EventManager.addListener(UIEventEnum.GuideClear, this.removeFromParent, this);
        }
    }

    private initOptUI(): void {
        this.clickMc = UIMovieManager.get(PackNameEnum.MCGuideClick);
        this.clickMc.touchable = false;
        this.clickMc.setSize(this.mcWidth, this.mcWidth);
        this.clickMc.setPivot(0.5, 0.5, true);
        this.clickMc.setScale(this.mcScale, this.mcScale);
        this.addChild(this.clickMc);
    }

    /**
     * 附加到对象
     * @param isCenter 放在组件中心
     */
    public addToParent(parent: fairygui.GComponent, direction: GuideArrowDirection = GuideArrowDirection.Top, offsetX: number = 0, offsetY: number = 0, isCenter: boolean = true): void {
        let rotation: number = 0;
        let scaleX: number = this.mcScale;
        switch (direction) {
            case GuideArrowDirection.Top:
                rotation = -45;
                break;
            case GuideArrowDirection.Bottom:
                rotation = 60;
                break;
            case GuideArrowDirection.Left:
                rotation = 0;
                scaleX = -this.mcScale;
                break;
            case GuideArrowDirection.Right:
                rotation = 0;
                break;
        }

        this.clickMc.setScale(this.mcScale, this.mcScale);
        this.clickMc.rotation = rotation;
        this.clickMc.scaleX = scaleX;
        if (isCenter) {
            this.x = parent.width * parent.scaleX / 2 + offsetX;
            this.y = parent.height * parent.scaleY / 2 + offsetY;
        } else {
            this.x = offsetX;
            this.y = offsetY;
        }
        parent.addChild(this);

        this.playForceClickMc();
    }

    /**
     * 更新提示
     */
    public updateTip(tip: string, direction: GuideArrowDirection = GuideArrowDirection.Left): void {
    }

    /**
     * 点击处理，供外部调用
     * @param isDoNext 是否执行下一步指引
     */
    public onClick(isDoNext: boolean = true): void {
        this.removeFromParent();
        if (isDoNext) {
            EventManager.dispatch(UIEventEnum.GuideNextStep);
        }
    }

    public get isShow(): boolean {
        return this.parent != null;
    }

    public set amplifyTimes(amplifyTimes: number) {
        this._amplifyTimes = amplifyTimes;
    }

    public get amplifyTimes(): number {
        return this._amplifyTimes;
    }

    /**
     * 播放强制特效
     */
    private playForceClickMc(): void {
        if (this.amplifyTimes != -1) {
            if (this.forceClickMc == null) {
                this.forceClickMc = new GuideForceClickMc();
                this.forceClickMc.setSize(768, 768);//256放到了3倍
                this.forceClickMc.setPivot(0.5, 0.5, true);
            }
            this.addChild(this.forceClickMc);
            this.forceClickMc.play(this.amplifyTimes);
        }
    }
}