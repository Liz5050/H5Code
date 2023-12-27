/**
 * 指引点击视图，用于直接加到组件内
 */
class GuideClickView extends fairygui.GComponent {
    public guideKey: string;
    public clickMc: UIMovieClip;
    private guideTip: GuideTip;
    private forceClickMc: GuideForceClickMc;
    /**
     * 特效放大次数
     */
    private amplifyTimes: number;

    public constructor(amplifyTimes: number = -1, isListenClear: boolean = true) {
        super();
        this.initOptUI();
        this.touchable = false;
        this.amplifyTimes = amplifyTimes;

        if (isListenClear) {
            EventManager.addListener(UIEventEnum.GuideClear, this.removeFromParent, this);
        }
    }

    private initOptUI(): void {
        this.guideTip = <GuideTip>FuiUtil.createComponent(PackNameEnum.Common, "GuideTip", GuideTip);
        this.guideTip.direction = GuideArrowDirection.Left;
        this.guideTip.touchable = false;
        // this.addChild(this.guideTip);
        this.clickMc = UIMovieManager.get(PackNameEnum.MCGuideClick);
        this.clickMc.touchable = false;
        this.addChild(this.clickMc);
    }

    /**
     * 更新提示
     */
    public updateTip(tip: string, direction: GuideArrowDirection = GuideArrowDirection.Left): void {
        this.guideTip.direction = direction;
        this.guideTip.tip = tip;

        if (this.amplifyTimes != -1) {
            if (this.forceClickMc == null) {
                this.forceClickMc = new GuideForceClickMc();
                this.forceClickMc.x = -this.forceClickMc.offset + 51;
                this.forceClickMc.y = -this.forceClickMc.offset + 51;
            }
            this.addChild(this.forceClickMc);
            this.forceClickMc.play(this.amplifyTimes);
        }
    }

    /**
     * 点击处理，供外部调用
     */
    public onClick(): void {
        this.removeFromParent();
        EventManager.dispatch(UIEventEnum.GuideNextStep);
    }

    public setTipXY(x: number, y: number): void {
        this.guideTip.setXY(x, y);
    }

    public setMcXY(x: number, y: number): void {
        this.clickMc.setXY(x, y);
    }

    public get isShow(): boolean {
        return this.parent != null;
    }
}