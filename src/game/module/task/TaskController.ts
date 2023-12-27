
class TaskController extends BaseController {
    private module: TaskModule;
    private tracePanel: TaskTracePanel;
    private autoTaskCheckTime: number = 10000;//10秒

    public constructor() {
        super(ModuleEnum.Task);
    }

    public initView(): BaseWindow {
        this.module = new TaskModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameTaskAllTaskDone], this.onAllTaskDone, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskMy], this.onTaskMy, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskOpenEndList], this.onTaskOpenEndList, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskCanGet], this.onTaskCanGet, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskUpdate], this.onTaskUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateAddPlayerTask], this.onAddPlayerTask, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskGroupNum], this.onTaskGroupNum, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTaskRemove], this.onTaskRemove, this);

        this.addListen0(UIEventEnum.TaskTraceOpen, this.openTracePanel, this);
        this.addListen0(UIEventEnum.TaskTraceClick, this.clickTracePanel, this);
        this.addListen0(LocalEventEnum.TaskTraceUpdate, this.taskTraceUpdate, this);
        this.addListen0(LocalEventEnum.TaskCanGetUpdated, this.taskCanGetUpdated, this);
        this.addListen0(LocalEventEnum.TaskGotoActive, this.gotoTaskActive, this);
        this.addListen0(LocalEventEnum.TaskAllComplete, this.taskAllComplete, this);
        this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);
        this.addListen0(UIEventEnum.SceneMapUpdated, this.sceneMapUpdated, this);

        //前往赏金任务
        // this.addListen0(LocalEventEnum.TaskGotoMoneyRing, this.gotoMoneyRing, this);
        // this.addListen0(LocalEventEnum.TaskGotoGuildRing, this.gotoGuildRing, this);
        // this.addListen0(LocalEventEnum.TaskGotoEscort, this.gotoEscort, this);

        //指引
        this.addListen0(LocalEventEnum.GuideCodeProcess, this.codeProcessGuide, this);

        //开始/停止
        // this.addListen0(LocalEventEnum.TaskStart, this.startTask, this);
        // this.addListen0(LocalEventEnum.TaskStop, this.stopTask, this);

        this.addListen0(LocalEventEnum.TaskHandInEquip, this.handInEquip, this);
        this.addListen0(UIEventEnum.TaskFlyReward, this.taskFlyReward, this);
        this.addListen0(LocalEventEnum.GuideTaskTrace, this.guideTaskTrace, this);
        this.addListen0(LocalEventEnum.CheckPointCanChellengeUpdate, this.onCheckPointCanChellengeUpdate, this);

        this.addListen0(UIEventEnum.GuideClear, this.guideClear, this);
    }

    public addListenerOnShow(): void {
    }

    /**
     * 功能开启已结束任务列表
     */
    private onTaskOpenEndList(data: any): void {
        let taskIds: Array<number> = data.ints.data_I;
        CacheManager.task.openEndTaskIds = taskIds;
        EventManager.dispatch(LocalEventEnum.TaskOpenEndUpdated);
    }

    /**
     * 可接任务
     * STask数组
     */
    private onTaskCanGet(data: any): void {
        let tasks: Array<any> = data.tasks.data;
        CacheManager.task.canGetTasks = tasks;
        EventManager.dispatch(LocalEventEnum.TaskCanGetUpdated);
    }

    /**
     * 所有任务已完成
     * S2C_SAllTaskDone
     */
    private onAllTaskDone(): void {
        CacheManager.task.isAllComplete = true;
    }

    /**
     * 玩家当前任务更新。登陆时推送一次
     * SPlayerTask数组
     */
    private onTaskMy(data: any): void {
        let playerTasks: Array<any> = data.playerTasks.data;
        CacheManager.task.sPlayerTasks = playerTasks;
    }

    /**
     * 任务进度更新
     * SSeqPlayerTaskUpdate
     */
    private onTaskUpdate(data: any): void {
        let sPlayerTaskUpdates: Array<any> = data.playerTaskUpdates.data;
        for (let playerTaskUpdate of sPlayerTaskUpdates) {
            CacheManager.task.updatePlayerTask(playerTaskUpdate);
        }
        if (this.isShow) {
            this.module.updateAll();
        }
    }

    /**
     * 增加任务
     * SAddPlayerTask
     */
    private onAddPlayerTask(data: any): void {
        CacheManager.task.addPlayerTask(data.sPlayerTask);
    }

    /**
     * 任务次数更新
     * STaskGroupNum
     */
    private onTaskGroupNum(data: any): void {
        CacheManager.task.updateGroupNum(data);
    }

    /**
     * 移除任务
     * STaskRemove
     */
    private onTaskRemove(data: any): void {
        let code: number = data.taskCode_I;
        CacheManager.task.removePlayerTask(code);
    }

    private openTracePanel(open: boolean = true): void {
        if (this.tracePanel == null) {
            this.tracePanel = ControllerManager.home.module.taskTracePanel;
        }
        if (CacheManager.task.isAllComplete && this.isTracePanelShow) {
            this.tracePanel.removeFromParent();
            return;
        }
        this.tracePanel.visible = open;
        this.taskTraceUpdate();
    }

    private clickTracePanel(): void {
        if (this.tracePanel != null) {
            this.tracePanel.clickThis();
        }
    }

    /**
     * 更新任务追踪
     */
    private taskTraceUpdate(data: any = null): void {
        if (this.isTracePanelShow) {
            let playerTask: TaskBase;
            if (data != null) {
                playerTask = data;
            } else {
                playerTask = CacheManager.task.currentTraceTask;
            }
            this.tracePanel.update(playerTask);
        }
    }

    /**
     * 可接任务已更新了
     */
    private taskCanGetUpdated(): void {
        this.autoGetTask();
    }

    /**
     * 自动领取任务。包含可接任务和玩家任务
     */
    private autoGetTask(): void {
        let canGetTasks: Array<any> = CacheManager.task.canGetTasks;
        for (let sTask of canGetTasks) {
            let taskCode: number = sTask.code_I;
            if (CacheManager.task.isCanAutoGet(taskCode) && (sTask.group_I == ETaskGroup.ETaskGroupMain || sTask.group_I == ETaskGroup.ETaskGrouptalent)) {
                CacheManager.task.addGetTaskCode(taskCode);//完成任务后会连续推送2次可接任务更新
                ProxyManager.task.getTask(sTask.getNpc_I, taskCode);
            }
        }
    }

    /**
     * 主动前往任务
     */
    private gotoTaskActive(): void {
        if (this.tracePanel != null) {
            this.tracePanel.gotoTask();
        }
    }

    /**
     * 自动触发前往任务
     */
    private gotoTaskAuto(): void {
        let currentTraceTask: any = CacheManager.task.currentTraceTask;
        if (currentTraceTask != null && CacheManager.task.isNeedAutoGoto(currentTraceTask.task.code_I, currentTraceTask.task.status_I)) {
            this.gotoTaskActive();
        }
    }

    /**
     * 所有任务完成
     */
    private taskAllComplete(): void {
        if (this.isTracePanelShow) {
            this.tracePanel.removeFromParent();
        }
    }

    /**
     * 退出副本后的处理
     * 退出副本会把AI清掉
     */
    private onCopyLeft(): void {
        this.gotoTaskAuto();
    }

    /**
     * 切图也会停止AI
     */
    private sceneMapUpdated(): void {
        this.gotoTaskAuto();
    }

    /**前往赏金任务 */
    private gotoMoneyRing(): void {
        if (CacheManager.task.canGetRingTask(ETaskGroup.ETaskGroupMgRing)) {
            EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, { "npcId": CacheManager.task.mgRingTaskNpcId });
        } else {
            let sPlayerTask: any = CacheManager.task.getPlayerTaskByGroup(ETaskGroup.ETaskGroupMgRing);
            if (sPlayerTask != null) {
                CacheManager.task.updateCurrentTraceTask(sPlayerTask);
                let playerTask: TaskBase = TaskUtil.getPlayerTask(sPlayerTask);
                playerTask.gotoTask();
            }
        }
    }

    /**前往仙盟任务 */
    private gotoGuildRing(): void {
        if (CacheManager.task.canGetRingTask(ETaskGroup.ETaskGroupMgGuild)) {
            EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, { "npcId": CacheManager.task.mgGuildTaskNpcId });
        } else {
            let sPlayerTask: any = CacheManager.task.getPlayerTaskByGroup(ETaskGroup.ETaskGroupMgGuild);
            if (sPlayerTask != null) {
                CacheManager.task.updateCurrentTraceTask(sPlayerTask);
                let playerTask: TaskBase = TaskUtil.getPlayerTask(sPlayerTask);
                playerTask.gotoTask();
            }
        }
    }

    /**前往护送任务 */
    private gotoEscort(): void {
        if (CacheManager.task.canGetRingTask(ETaskGroup.ETaskGroupMgGuild)) {
            EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, { "npcId": CacheManager.task.escortNpcId });
        } else {
            let sPlayerTask: any = CacheManager.task.getPlayerTaskByGroup(ETaskGroup.ETaskGroupTransport);
            if (sPlayerTask != null) {
                CacheManager.task.updateCurrentTraceTask(sPlayerTask);
                let playerTask: TaskBase = TaskUtil.getPlayerTask(sPlayerTask);
                playerTask.gotoTask();
            }
        }
    }

    /**
     * 代码处理指引
     */
    private codeProcessGuide(data: any): void {
        if (data != null) {
            switch (data.key) {
                case GuideEventKey[GuideEventKey.TaskGuideGotoTask]:
                    if (this.isShow) {
                        this.module.guideGotoTask(data.value);
                    }
                    break;
            }
        }
    }

    /**开始任务 */
    private startTask(): void {

    }

    /**停止任务 */
    private stopTask(): void {
    }

    /**
     * 上交装备
     */
    private handInEquip(uid: string): void {
        ProxyManager.task.handEquip(uid);
    }

    /**
     * 飘任务奖励
     */
    private taskFlyReward(itemCodes: Array<number>): void {
        let startPoint: egret.Point = new egret.Point();
        if (this.tracePanel != null) {
            startPoint = this.tracePanel.localToGlobal();
            startPoint.x += 205;
            startPoint.y += 70;
        } else {
            startPoint.x = fairygui.GRoot.inst.width / 2;
            startPoint.y = fairygui.GRoot.inst.height / 2;
        }
        for (let itemCode of itemCodes) {
            Tip.addTip({ "itemCode": itemCode, "x": startPoint.x, "y": startPoint.y }, TipType.PropIcon);
        }
    }

    /**
     * 显示任务追踪指引
     */
    private guideTaskTrace(guideStepInfo: GuideStepInfo): void {
        if (this.isTracePanelShow) {
            this.tracePanel.showGuide(guideStepInfo);
        }
    }

    /**
     * 关卡能量更新
     */
    private onCheckPointCanChellengeUpdate(): void {
        if (this.isTracePanelShow) {
            this.tracePanel.updateTaskTraceMc();
        }
    }

    /**
     * 追踪面板是否已显示
     */
    private get isTracePanelShow(): boolean {
        return this.tracePanel != null && this.tracePanel instanceof TaskTracePanel;
    }

    /**清空指引 */
    private guideClear(): void {
        if (this.isTracePanelShow) {
            // this.tracePanel.swapFriendIconIndex(true);
        }
    }
}