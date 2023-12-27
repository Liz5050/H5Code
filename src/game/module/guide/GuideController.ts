/**
 * 指引
 */
class GuideController extends BaseController {
    private module: GuideModule;
    private guideInfo: GuideInfo;
    private currentGuideStepInfo: GuideStepInfo;
    private lastKey: string;

    public constructor() {
        super(ModuleEnum.Guide);
        this.viewIndex = ViewIndex.Zero;
    }

    public initView(): BaseWindow {
        this.module = new GuideModule(this.moduleId);
        return this.module;
    }

    public show(data?: any): void {
        super.show(data);
        this.module.visible = CacheManager.guide.isCanShow;
    }

    protected addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.GuideTest, this.guideTest, this);
        this.addListen0(LocalEventEnum.GuideByTask, this.guideByTask, this);
        this.addListen0(UIEventEnum.GuideNextStep, this.guideNextStep, this);
        this.addListen0(UIEventEnum.GuideRefreshCurrent, this.refreshCurrent, this);
        this.addListen0(UIEventEnum.GuideByStepInfo, this.guideByStepInfo, this);
        this.addListen0(UIEventEnum.GuideSkip, this.guideSkip, this);
        this.addListen0(UIEventEnum.GuideClear, this.guideClear, this);
        this.addListen0(UIEventEnum.GuideShow, this.guideShow, this);
        this.addListen0(UIEventEnum.ViewOpened, this.viewOpenedHandler, this);
        this.addListen0(UIEventEnum.ViewClosed, this.viewClosedHandler, this);
        this.addListen0(LocalEventEnum.GameReSize, this.onGameReSize, this);
        this.addListen0(NetEventEnum.copyEnterCheckPoint, this.onEnterCheckPointCopy, this);
    }

    /**
     * 指引测试
     */
    private guideTest(): void {
        // EventManager.dispatch(LocalEventEnum.GuideByTask, 300001, 2);
        // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TaskDialog);

        //追踪指引测试
        // EventManager.dispatch(LocalEventEnum.GuideByTask, 300099, 1);
        EventManager.dispatch(LocalEventEnum.GuideByTask, GuideCode.GodEquipDecompose, ETaskStatus.ETaskStatusNotCompleted);
        EventManager.dispatch(LocalEventEnum.GuideByTask, 300099, 1);
    }

    /**
     * 根据任务指引
     */
    private guideByTask(taskCode: number, status: ETaskStatus): void {
        if (CacheManager.task.isAllComplete) {//所有任务都完成了，不触发任务指引
            return;
        }
        let key: string = `${taskCode}_${status}`;
        if (key != this.lastKey) {
            EventManager.dispatch(UIEventEnum.GuideClear);
        }
        this.guideInfo = ConfigManager.guide.getGuideInfo(taskCode, status);
        CacheManager.guide.guideInfo = this.guideInfo;
        if (this.guideInfo != null) {
            this.hide();
            this.guideNextStep();
        }
        this.lastKey = key;
    }

    /**
     * 指引下一步
     */
    private guideNextStep(): void {
        if (this.isShow) {
            this.module.resetGuide();//指引下一步前，先重置指引
        }
        this.currentGuideStepInfo = this.getNextStepInfo();
        CacheManager.guide.guideStepInfo = this.currentGuideStepInfo;
        if (CacheManager.guide.isHejiStep && !CacheManager.checkPoint.isInCopy) {//必杀指引，进关卡才触发
            return;
        }
        this.refreshCurrent();
    }

    /**
     * 获取下一步指引信息
     */
    private getNextStepInfo(): GuideStepInfo {
        if (this.guideInfo != null) {
            return this.guideInfo.steps.shift();
        }
        return null;
    }

    /**刷新当前指引 */
    private refreshCurrent(): void {
        if (this.currentGuideStepInfo != null && this.currentGuideStepInfo.delay > 0) {
            if (this.currentGuideStepInfo.isHejiStep) {
                CacheManager.guide.startDelayTimer(this.currentGuideStepInfo.delay);
            }
            App.TimerManager.remove(this.doRefreshCurrent, this);
            App.TimerManager.doDelay(this.currentGuideStepInfo.delay, this.doRefreshCurrent, this);
        } else {
            this.doRefreshCurrent();
        }
    }

    /**
     * 执行刷新当前指引
     */
    private doRefreshCurrent(): void {
        if (this.currentGuideStepInfo != null) {
            if (this.currentGuideStepInfo.isHejiStep && CacheManager.guide.isHejiOk) {
                GuideCondition.setCanGuide(this.currentGuideStepInfo.key, true);
            }
            if (!GuideCondition.isCanGuide(this.currentGuideStepInfo.key)) {//需要第符文指引结束并且从符文塔出来关闭结算后开启
                this.hide();
                return;
            }
            if (CacheManager.guide.isHejiStep) {
                if (!CacheManager.guide.isCanGuideHeji) {//不能指引合击
                    return;
                }
            }

            if (this.currentGuideStepInfo.target != null) {
                if(this.currentGuideStepInfo.target == GuideTargetName.CheckPointAutoBtn && CacheManager.checkPoint.isAuto) {//自动闯关指引，当已经开启了自动时，不显示指引
                    return;
                }
                let target: fairygui.GObject = GuideTargetManager.getObj(this.currentGuideStepInfo.target);
                if (target != null && target.onStage) {
                    if (this.currentGuideStepInfo.target == GuideTargetName.NavbarReturnBtn && !target.visible && 
                        CacheManager.guide.isCannotSkipReturnStep(this.currentGuideStepInfo.taskCode)) {//为了解决返回指引时，而返回按钮不可见导致跳过的问题
                        return;
                    }
                    if (!target.visible || !target.parent.visible) {//没显示
                        this.guideNextStep();
                        return;
                    }
                    this.show(this.currentGuideStepInfo);
                }
            } else {
                this.show(this.currentGuideStepInfo);
            }
        } else {
            this.guideClear();
        }
    }

    /**
     * 根据指引步骤信息指引
     */
    private guideByStepInfo(guideStepInfo: GuideStepInfo): void {
        this.show(guideStepInfo);
    }

    /**跳过指引 */
    private guideSkip(): void {
        this.guideInfo = null;
        CacheManager.guide.guideInfo = null;
        this.guideNextStep();
    }

    /**清除所有指引 */
    private guideClear(): void {
        // this.guideInfos = null;
        this.guideInfo = null;
        this.currentGuideStepInfo = null;
        CacheManager.guide.guideInfo = null;
        CacheManager.guide.guideStepInfo = null;
        this.hide();
    }

    private guideShow(isShow: boolean): void {
        CacheManager.guide.isCanShow = isShow;
        if (this.module != null) {
            this.module.visible = isShow;
        }
    }

    /**
     * @param isAuto 是否自动发出的打开消息
     */
    private viewOpenedHandler(viewClassName: string, isAuto: boolean = true): void {
        if (this.currentGuideStepInfo != null && this.currentGuideStepInfo.targetClassName != null && this.currentGuideStepInfo.targetClassName == viewClassName
            && this.currentGuideStepInfo.triggerType != GuideTriggerType.TaskTraceClick) {
            if ((this.currentGuideStepInfo.target == GuideTargetName.EncounterPanelChallengeBtn
                || this.currentGuideStepInfo.target == (GuideTargetName.TrainPiece + "1")) && isAuto) {//需要手动发出打开命令
                return;
            }
            this.show(this.currentGuideStepInfo);
        }
    }

    private viewClosedHandler(viewClassName: string): void {
        /*
        //必杀激活后，将“技能预览”的界面去掉 2019年2月20日12:16:58
        if (this.guideInfo != null && this.guideInfo.key == "300013_2" && viewClassName == "ActivationPanel") {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.UniqueSkill });
        }
        */
        if (this.currentGuideStepInfo != null && this.currentGuideStepInfo.type == GuideTypeEnum.ViewClose && this.currentGuideStepInfo.target == viewClassName) {
            this.guideNextStep();
        }
    }

    private onGameReSize(): void {
        if (this.isShow) {
            this.refreshCurrent();
        }
    }

    /**
     * 进入了关卡副本。
     */
    private onEnterCheckPointCopy(): void {
        if (CacheManager.guide.isHejiStep) {
            this.refreshCurrent();
        }
    } 

    /**
     * 合击可释放
     */
    // private onHejiOk(): void {
    //     if (this.currentGuideStepInfo != null && this.currentGuideStepInfo.isHejiStep) {
    //         this.refreshCurrent();
    //     }
    // }

    /**
     * 任务追踪点击了
     */
    // private guideOnTaskTraceClick(): void {
    // 	if (CacheManager.guide.isTriggerByTaskTraceClick) {
    // 		this.refreshCurrent();
    // 	}
    // }

    /**
     * 直接显示当前指引
     */
    // private showCurrentGuide(): void {
    // 	this.show(this.currentGuideStepInfo);
    // }
}