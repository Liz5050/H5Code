class TaskDialogController extends BaseController {
    private module: TaskDialogModule;
    private tracePanel: TaskTracePanel;
    private npcTasks: Array<any>;
    private taskAppointExecutor: TaskAppointExecutor;
    private talkWindow: TalkWindow;

    public constructor() {
        super(ModuleEnum.TaskDialog);
        this.viewIndex = ViewIndex.Two;
        this.taskAppointExecutor = new TaskAppointExecutor();
    }

    public initView(): BaseWindow {
        this.module = new TaskDialogModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameNpcTask], this.onS2CNpcTask, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetTask], this.onS2CGetTask, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameEndTask], this.onS2CEndTask, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameTalkToNpc], this.onS2CTalkToNpc, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameEndMgRingTask], this.onEndRingTask, this);

        this.addListen0(LocalEventEnum.TaskNpcTasksUpdated, this.onTaskNpcTasksUpdated, this);
        this.addListen0(LocalEventEnum.TaskTalkToNpc, this.taskTalkToNpc, this);
        this.addListen0(LocalEventEnum.TaskSubmit, this.taskSubmit, this);
        this.addListen0(LocalEventEnum.TaskGet, this.taskGet, this);
        this.addListen0(LocalEventEnum.TaskRingGet, this.taskRingGet, this);
        this.addListen0(LocalEventEnum.TaskRingEnd, this.taskRingEnd, this);
        this.addListen0(LocalEventEnum.TaskKillBossDropSubmit, this.taskKillBossDropSubmit, this);

        this.addListen0(UIEventEnum.SceneClickNpc, this.clickNpc, this);
        this.addListen0(UIEventEnum.GuideMaskClick, this.guideMaskClick, this);
    }

    public afterModuleShow(data?: any): void {
        super.afterModuleShow(data);
        if (this.npcTasks != null) {
            this.module.updateByNpcTasks(this.npcTasks);
        }
        //test
        // EventManager.dispatch(LocalEventEnum.GuideByTask, 300001, 2);
    }

    /**
     * npc任务列表
     * SNpcTask
     */
    private onS2CNpcTask(data: any): void {
        let npcTasks: Array<any> = data.npcTasks.data;
        Log.trace(Log.TASK, "onS2CNpcTask", npcTasks);
        EventManager.dispatch(LocalEventEnum.TaskNpcTasksUpdated, npcTasks, true);
    }

    /**
     * 接任务返回
     */
    private onS2CGetTask(data: any): void {
        let playerTask: any = data.playerTask;
        let npcTasks: Array<any> = data.npcTasks.data;//SNpcTask
        //接完任务，关闭界面
        this.hide();
        CacheManager.task.addPlayerTask(playerTask);

        //删除可接任务
        let taskCode: number = playerTask.task.code_I;
        CacheManager.task.removeCanGetTask(taskCode);
        CacheManager.task.addGetTaskCode(taskCode);
        Log.trace(Log.TASK, "onS2CGetTask", playerTask, npcTasks);
        EventManager.dispatch(LocalEventEnum.TaskCanGetUpdated);

        this.taskAppointExecutor.processOnTaskGet(playerTask);
    }

    /**
     * 提交任务返回
     */
    private onS2CEndTask(data: any): void {
        let taskCode: number = data.taskCode;
        let npcId: number = data.npc;
        let npcTasks: Array<any> = data.npcTasks.data;
        CacheManager.task.removePlayerTask(taskCode);

        EventManager.dispatch(LocalEventEnum.TaskNpcTasksUpdated, npcTasks);
        //提交任务后，后面可能没有新任务了，需要更新追踪，不然会显示之前的
        EventManager.dispatch(LocalEventEnum.TaskTraceUpdate);
        EventManager.dispatch(LocalEventEnum.TaskFinished, taskCode);

        //瓢字
        let task: any = ConfigManager.task.getByPk(taskCode);
        if (task != null) {
            let notice: string = task.imgNotice;
            if (notice != null && notice != "") {
                EventManager.dispatch(LocalEventEnum.ShowBroadStory, { msg: notice, isFirst: true, changeMapNoClear: true });
            }
        }

        this.taskAppointExecutor.processOnTaskEnd(task);
    }

    /**
     * 与npc对话返回
     * SPlayerTaskUpdate
     */
    private onS2CTalkToNpc(data: any): void {
        let playerTaskUpdate: any = data.playerTaskUpdate;
        CacheManager.task.updatePlayerTask(playerTaskUpdate);
        Log.trace(Log.TASK, "onS2CTalkToNpc", playerTaskUpdate);
    }

    /**
     * 提交循环任务返回
     * S2C_SEndMgRingTask  rewards、taskGroup、restCount剩余次数
     */
    private onEndRingTask(data: any): void {
        // let playerTaskUpdate: any = data.playerTaskUpdate;
        // CacheManager.task.updatePlayerTask(playerTaskUpdate);
        // Log.trace(Log.TASK, "onS2CTalkToNpc", playerTaskUpdate);
    }


    /**
     * npc身上任务更新了
     * @param isReq 是否为点击npc主动请求
     */
    private onTaskNpcTasksUpdated(npcTasks: Array<any>, isReq: boolean): void {
        this.npcTasks = npcTasks;
        if (isReq && npcTasks != null && npcTasks.length > 0) {
            this.show();
        } else {
            if (this.isShow) {
                if (npcTasks.length == 0) {
                    this.hide();
                } else {
                    this.module.updateByNpcTasks(npcTasks);
                }
            }
        }
    }

    /**与npc对话 */
    private taskTalkToNpc(data: any): void {
        ProxyManager.task.talkToNpc(data.npcId, data.taskCode, data.sProcesscode);
    }

    /**提交任务 */
    private taskSubmit(data: any): void {
        App.SoundManager.playEffect(SoundName.Effect_TaskComplete);
        ProxyManager.task.endTask(data.npcId, data.taskCode);
    }

    /**领取任务 */
    private taskGet(data: any): void {
        if (data.roleIndex != null) {//天赋任务用
            ProxyManager.task.getTask(data.npcId, data.taskCode, 0, data.roleIndex);
            return;
        }
        ProxyManager.task.getTask(data.npcId, data.taskCode);
    }

    /**
     * 点击npc，请求npc身上的任务
     */
    private clickNpc(npcId: number): void {
        if (npcId == CacheManager.task.escortNpcId) {
            Tip.showTip("护送面板后续添加...");
            //打开护送面板
            // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.EScort);
            return;
        }
        ProxyManager.task.getNpcTask(npcId);
        if (CacheManager.map.isInMainCity) {
            if (this.talkWindow == null) {
                this.talkWindow = new TalkWindow();
            }
            this.talkWindow.show({ "npcId": npcId });
            EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.WorldMap);
        }
    }

    /**领取循环任务 */
    private taskRingGet(data: any): void {
        ProxyManager.task.getRingTask(data.taskGroup);
        this.hide();
    }

    /**提交循环任务 */
    private taskRingEnd(data: any): void {
        ProxyManager.task.endRingTask(data.taskCode);
    }

    /**提交杀怪掉落物品任务 */
    private taskKillBossDropSubmit(data: any): void {
        ProxyManager.task.endKillBossDropTask(data.taskCode);
    }

    /**
     * 点击了遮罩层
     */
    private guideMaskClick(): void {
        if (this.isShow) {
            this.module.onGuideMaskClick();
        }
    }
}