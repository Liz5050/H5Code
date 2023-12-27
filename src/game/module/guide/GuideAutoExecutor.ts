/**
 * 自动指引
 */
class GuideAutoExecutor {
    public static isAutoActiveGodWeapon: boolean;
    private timeout: number = 5000;
    private guideStepInfo: GuideStepInfo;
    private activationTaskCode: number = 300013;//激活第一个神器任务

    public constructor() {
        EventManager.addListener(NetEventEnum.copyEnter, this.onEnterCopy, this);
        EventManager.addListener(NetEventEnum.copyLeft, this.onLeftCopy, this);
        EventManager.addListener(NetEventEnum.copyEnterCheckPoint, this.onEnterCopy, this);
        EventManager.addListener(NetEventEnum.copyLeftCheckPoint, this.onLeftCopy, this);
    }

    public start(guideStepInfo: GuideStepInfo): void {
        if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.TaskGuideAutoSubmitEnd, false)) {//这个任务之后的都不处理自动
            return;
        }
        this.guideStepInfo = guideStepInfo;
        // App.TimerManager.remove(this.onTimeout, this);
        // App.TimerManager.doDelay(this.timeout, this.onTimeout, this);
        if (!CacheManager.copy.isInCopy) {//副本内不计时
            this.doDelayAuto(true);
        }
    }

    private doDelayAuto(isRestart: boolean): void {
        App.TimerManager.remove(this.onTimeout, this);
        if (isRestart) {
            App.TimerManager.doDelay(this.timeout, this.onTimeout, this);
        }
    }

    /**
     * 超时结束，自动提交
     */
    private onTimeout(): void {
        let isClearGuide: boolean = true;
        if (this.guideStepInfo == null || CacheManager.guide.guideStepInfo == null || CacheManager.task.currentTraceTask == null) {
            return;
        }
        let sPlayerTask: any = CacheManager.task.currentTraceTask;
        if (CacheManager.guide.guideStepInfo.key != this.guideStepInfo.key || sPlayerTask.task.code_I != this.guideStepInfo.taskCode || this.guideStepInfo.isHejiStep) {//任务改变了或者指引步骤已改变了或合击指引
            return;
        }
        if (this.guideStepInfo != null) {
            switch (this.guideStepInfo.taskKey) {
                case "300008_1"://激活九霄碎片1
                    switch (this.guideStepInfo.step) {
                        // case 1:
                        //     this.clickTaskTrace();
                        //     return;
                        case 1:
                        case 2://激活
                        case 3:
                            EventManager.dispatch(LocalEventEnum.TrainActGodWeaponPiece, 1, 1);
                            ToolTipManager.hide();
                            break;
                    }
                    break;
                case "300013_1"://激活九霄碎片2
                    EventManager.addListener(UIEventEnum.ModuleOpened, this.onModuleOpened, this);
                    switch (this.guideStepInfo.step) {
                        case 1://激活
                        case 2:
                            EventManager.dispatch(LocalEventEnum.TrainActGodWeaponPiece, 1, 2);
                            EventManager.dispatch(LocalEventEnum.TrainActGodWeapon, 1);
                            GuideAutoExecutor.isAutoActiveGodWeapon = true;
                            break;
                        case 3://激活神器
                            EventManager.dispatch(LocalEventEnum.TrainActGodWeapon, 1);
                            GuideAutoExecutor.isAutoActiveGodWeapon = true;
                            break;
                    }
                    break;
                case "300026_1"://穿装备任务
                    switch (this.guideStepInfo.step) {
                        // case 1://点击穿戴装备
                        //     this.clickTaskTrace();
                        //     return;
                        case 1:
                        case 2://点击一键装备
                            let dressPos: Array<any> = [
                                EDressPos.EDressPosGloves,
                                EDressPos.EDressPosClothes,
                                EDressPos.EDressPosBelt,
                                EDressPos.EDressPosShoulder,
                                EDressPos.EDressPosShoes,
                                EDressPos.EDressPosWeapon,
                                EDressPos.EDressPosWristlet,
                                EDressPos.EDressPosHelmet,
                                EDressPos.EDressPosHeartLock
                            ];
                            EventManager.dispatch(UIEventEnum.PlayerOnekeyEquip, { derssPosAll: dressPos, roleIndex: 0 });
                            break;
                        case 3://返回战斗场景
                            break;
                    }
                    break;
                case "300029_1"://升级任务
                    switch (this.guideStepInfo.step) {
                        case 1:
                            EventManager.dispatch(LocalEventEnum.SkillUpgradeAll, 0);
                            break;
                    }
                    break;
                case "300032_1"://熔炼任务必须玩家操作
                    return;
                case "300033_1"://强化任务
                    // switch (this.guideStepInfo.step) {
                    //     case 1://点击前往强化
                    //         this.clickTaskTrace();
                    //         return;
                    //     case 2://点击强化装备
                    //         EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeUpgrade, 0);
                    //         break;
                    //     case 3://返回战斗场景
                    //         break;
                    // }
                    // break;
                    return;
                case "300038_1"://激活内功
                    // switch (this.guideStepInfo.step) {
                    //     case 1:
                    //         this.clickTaskTrace();
                    //         return;
                    //     case 2://点击强化装备
                    //         EventManager.dispatch(LocalEventEnum.PlayerStrengthExActive, EStrengthenExType.EStrengthenExTypeInternalForce, 0);
                    //         break;
                    // }
                    // break;
                    return;
            }
            //结束当前任务
            if (sPlayerTask != null && sPlayerTask.status_I != ETaskStatus.ETaskStatusHadEnd) {
                let playerTask: TaskBase = TaskUtil.getPlayerTask(sPlayerTask);
                if (playerTask.isCheckPoint) {//关卡任务
                    isClearGuide = false;//关卡任务不清指引，否则会把必杀指引清掉
                    this.clickTaskTrace();
                } else {
                    EventManager.dispatch(LocalEventEnum.TaskSubmit, {
                        "npcId": sPlayerTask.task.endNpc_I,
                        "taskCode": sPlayerTask.task.code_I
                    });
                }
            }
            if (isClearGuide) {
                //清空当前指引
                EventManager.dispatch(UIEventEnum.GuideClear);
            }
            //关闭Tip
            ToolTipManager.hide();
            //关闭界面
            // UIManager.closeAll();
        }
    }

    /**
     * 点击任务追踪
     */
    private clickTaskTrace(): void {
        EventManager.dispatch(UIEventEnum.TaskTraceClick);
    }

    /**
     * 关闭激活成功界面。因为激活界面是在UIManager.closeAll()之后才打开的;
     */
    private onModuleOpened(key: number, viewIndex: number): void {
        if (key == ModuleEnum.Activation) {
            //关闭界面
            // UIManager.closeAll();
        }
        let sPlayerTask: any = CacheManager.task.currentTraceTask;
        if (sPlayerTask != null && sPlayerTask.task.code_I != this.activationTaskCode) {
            EventManager.removeListener(UIEventEnum.ModuleOpened, this.onModuleOpened, this);
        }
    }

    private onEnterCopy(): void {
        this.doDelayAuto(false);
    }

    private onLeftCopy(): void {
        this.doDelayAuto(true);
    }
}