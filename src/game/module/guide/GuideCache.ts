/**
 * 指引缓存
 */
class GuideCache implements ICache {
    public guideInfo: GuideInfo;
    public guideStepInfo: GuideStepInfo;
    /**是否能显示指引，false的话则隐藏指引模块 */
    public isCanShow: boolean = true;
    /**是否需要指引选择自动必杀 */
    public isNeedGuideSelectAutoXp: boolean;
    /**合击是否可以释放 */
    private _isHejiOk: boolean = false;
    /**
     * 剩余延迟，毫秒
     */
    private leftDelay: number;

    public constructor() {
    }

    /**
     * 当前步骤是否由任务追踪触发
     */
    public get isTriggerByTaskTraceClick(): boolean {
        return this.guideStepInfo != null && this.guideStepInfo.triggerType == GuideTriggerType.TaskTraceClick;
    }

    /**
     * 当前是否指引指定目标
     */
    public isGuideTarget(targetName: string): boolean {
        return this.guideStepInfo && this.guideStepInfo.target == targetName;
    }

    /**
     * 下一步是否指引指定目标
     */
    public isNextGuideTarget(targetName: string): boolean {
        if (this.guideInfo && this.guideInfo.hasNext) {
            let next: GuideStepInfo = this.guideInfo.steps[0];
            return next && next.target == targetName;
        }
        return false;
    }

    /**
     * 开始延时计时
     * @param {number} delay
     */
    public startDelayTimer(delay: number): void {
        this.leftDelay = delay;
        App.TimerManager.doTimer(100, 0, this.onTimer, this);
    }

    private stopDelayTimer(): void {
        App.TimerManager.remove(this.onTimer, this);
    }

    private onTimer(): void {
        this.leftDelay -= 100;
    }

    /**
     * 合击能量满
     * @param isTriggerEvent 是否触发事件
     */
    public onHejiOk(isTriggerEvent: boolean) {
        this._isHejiOk = true;
        if (this.guideStepInfo != null && this.guideStepInfo.isHejiStep) {
            if (this.guideStepInfo.delay > 0) {//有延迟的合击指引，由外部触发
                if (isTriggerEvent) {
                    GuideCondition.setCanGuide(this.guideStepInfo.key, true);
                    this.stopDelayTimer();
                    //合击延迟，指引启用时已经延迟了，合击满时去掉延时，否则合击满还会延迟delay才显示指引
                    if (this.leftDelay <= 0) {
                        this.leftDelay = 0;
                    }
                    this.guideStepInfo.delay = this.leftDelay;
                    if (CacheManager.checkPoint.isInCopy) {
                        EventManager.dispatch(UIEventEnum.GuideRefreshCurrent);
                    }
                }
            } else {
                 GuideCondition.setCanGuide(this.guideStepInfo.key, true);
                 if (this.isCanGuideHeji) {
                    EventManager.dispatch(UIEventEnum.GuideRefreshCurrent);
                }
            }
        }
    }

    /**
     * 点击了任务追踪
     * @returns 是否需要点击触发处理
     */
    public onClickTaskTracePanel(): boolean {
        if (this.guideStepInfo != null && this.guideStepInfo.triggerType == GuideTriggerType.TaskTraceClick) {
            GuideCondition.setCanGuide(this.guideStepInfo.key, true);
            EventManager.dispatch(UIEventEnum.GuideRefreshCurrent);
            return true;
        }
        return false;
    }

    public set isHejiOk(isHejiOk: boolean) {
        this._isHejiOk = isHejiOk;
    }

    public get isHejiOk(): boolean {
        return this._isHejiOk;
    }

    /**
     * 当前任务是否是当返回按钮不显示时，返回指引不能跳过
     */
    public isCannotSkipReturnStep(taskCode: number): boolean {
        let taskCodes: Array<number> = [300082, 300085, TaskCodeConst.KingBattle];//羽毛、龙炎副本任务、王者争霸任务
        return taskCodes.indexOf(taskCode) != -1;
    }

    /**是否可以指引合击了 */
    public get isCanGuideHeji(): boolean {
        return this.isHejiStep && GuideCondition.isCanGuide(this.guideStepInfo.key) && CacheManager.guide.isHejiOk && CacheManager.checkPoint.isInCopy;
    }

    /**当前指引步是否为必杀指引 */
    public get isHejiStep(): boolean {
        return this.guideStepInfo && this.guideStepInfo.isHejiStep;
    }

    public clear(): void {

    }
}