class TaskCache implements ICache {
    /**新手等级 */
    public static newPlayerLevel: number = 30;
    /**第一张地图跑完的等级 */
    public static firstMapPlayerLevel: number = 8;
    /**是否第一次完成遭遇战任务 */
    public static isFirstEndEncounterTask: boolean;
    /**是否启用站立计时器 */
    public isEnableStandTimer: boolean = true;
    /**接赏金任务npcid */
    public mgRingTaskNpcId: number;
    /**接仙盟任务npcid */
    public mgGuildTaskNpcId: number;
    /**护送任务npcid */
    public escortNpcId: number;
    /**TODO 有木有更好的方式。是否为点击退出副本，用来处理任务流程中，手动退出副本，地图切换，继续自动任务进入副本的问题 */
    private _gotoTaskFlag: boolean = true;
    /**可接任务 STask数组 */
    private _canGetTasks: Array<any>;
    /**当前任务 SPlayerTask数组*/
    private _sPlayerTasks: Array<any>;
    /**开启功能的已完成的任务id列表 */
    private _openEndTaskIds: Array<number>;
    /**最后一次已领取的任务 */
    private _lastGetTaskCode: number = -1;
    /**已领取的任务code */
    private hadGetTaskCodes: Array<number> = [];
    /**循环任务剩余次数 值为STaskGroupNum*/
    private groupNumDict: any = {};
    /**
     * 当前追踪的任务，为_sPlayerTasks中的一个
     * SPlayerTask
     */
    private _currentTraceTask: any;
    /**关卡任务code */
    private cpTaskCode: number;
    private _isNewPlayerStage: boolean = true;
    /**所有任务是否都已完成 */
    private _isAllComplete: boolean = false;
    private _isReady: boolean;
    /**是否需要显示首充tips */
    private _isNeedRechargeFirstTips: boolean = true;

    public constructor() {
        this._canGetTasks = [];
        this._openEndTaskIds = [];
        this._sPlayerTasks = [];
        this.mgRingTaskNpcId = ConfigManager.const.getConstValue("MgRingTaskNpc");
        this.mgGuildTaskNpcId = ConfigManager.const.getConstValue("MgGuildTaskNpc");
        this.escortNpcId = ConfigManager.const.getConstValue("EscortNpc");
        this.cpTaskCode = ConfigManager.const.getConstValue("ShowCheckPointTaskCode");
    }

    public get currentTraceTask(): any {
        return this._currentTraceTask;
    }

    public set canGetTasks(canGetTasks: Array<any>) {
        this._canGetTasks = canGetTasks;
        for (let sTask of canGetTasks) {
            if (!this.isCanAutoGet(sTask.code_I)) {
                this.updateNpcStatus(sTask.getNpc_I, ETaskStatus.ETaskStatusCanGet);
            }
        }
    }

    public set sPlayerTasks(playerTasks: Array<any>) {
        this._sPlayerTasks = playerTasks;
        for (let sPlayerTask of playerTasks) {
            if (sPlayerTask.task.code_I > this.cpTaskCode) {
                this._isNewPlayerStage = false;
            }
            if (TaskUtil.isRing(sPlayerTask.task.group_I)) {
                if (sPlayerTask.status_I == ETaskStatus.ETaskStatusNotCompleted) {
                    let npcId: number = TaskUtil.getRingTaskNpcId(sPlayerTask);
                    this.updateNpcStatus(npcId, ETaskStatus.ETaskStatusHadCompleted);
                }
                else if (sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
                    //循环任务已完成自动提交
                    EventManager.dispatch(LocalEventEnum.TaskRingEnd, { "taskCode": sPlayerTask.task.code_I });
                }
            } else {
                if (sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
                    this.updateNpcStatus(sPlayerTask.task.endNpc_I, ETaskStatus.ETaskStatusHadCompleted);
                    this.processOnTaskComplete(sPlayerTask);
                }
            }
        }

        //赏金任务npc状态
        if (this.canGetRingTask(ETaskGroup.ETaskGroupMgRing)) {
            this.updateNpcStatus(this.mgRingTaskNpcId, ETaskStatus.ETaskStatusCanGet);
        }

        //仙盟任务npc状态
        if (this.canGetRingTask(ETaskGroup.ETaskGroupMgGuild)) {
            this.updateNpcStatus(this.mgGuildTaskNpcId, ETaskStatus.ETaskStatusCanGet);
        }
        this.updateCurrentTraceTask();
        EventManager.dispatch(LocalEventEnum.TaskUpdateMy);
        EventManager.dispatch(LocalEventEnum.TaskPlayerTaskUpdated);
    }

    public set openEndTaskIds(openEndTaskIds: Array<number>) {
        this._openEndTaskIds = openEndTaskIds;
        //登录检测 是否需要显示首充的tips;还没开启该功能就需要
        this._isNeedRechargeFirstTips = !ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RechargeFirstTips], false);
    }

    public get canGetTasks(): Array<any> {
        return this._canGetTasks;
    }

    public get sPlayerTasks(): Array<any> {
        return this._sPlayerTasks;
    }

    /**是否需要显示首充tips */
    public get isNeedRechargeFirstTips(): boolean {
        return this._isNeedRechargeFirstTips;
    }

    /**
     * 保存已领取的任务code，防止多次领取同一个任务
     */
    public addGetTaskCode(taskCode: number): void {
        if (this.hadGetTaskCodes.indexOf(taskCode) == -1) {
            this.hadGetTaskCodes.push(taskCode);
        }
        if (taskCode > this.cpTaskCode) {
            this._isNewPlayerStage = false;
        }
    }

    /**
     * 增加一个已开启的任务
     */
    public addEndTaskCode(taskCode: number): void {
        if (this._openEndTaskIds.indexOf(taskCode) == -1) {
            this._openEndTaskIds.push(taskCode);
            let godWPPieceInfo: any = ConfigManager.godWeapon.getByTaskCode(taskCode);
            if (godWPPieceInfo) { //通关关卡后判断是否有激活碎片
                let url: string = ConfigManager.godWeapon.getPieceUrl(godWPPieceInfo);
                EventManager.dispatch(LocalEventEnum.HomeShowReceiveIcoEff, url, godWPPieceInfo.pieceName);
                EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Train, CacheManager.train.checkTips());
            }
            EventManager.dispatch(LocalEventEnum.TaskOpenEndUpdated);
        }
    }

    /**
     * 开启功能的任务是否已完成，对应t_mg_open
     */
    public isTaskOpenEnd(taskCode: number): boolean {
        return this._openEndTaskIds.indexOf(taskCode) != -1;
    }

    /**
     * 增加玩家任务
     */
    public addPlayerTask(sPlayerTask: any): void {
        this.sPlayerTasks.push(sPlayerTask);
        let taskGroup: ETaskGroup = sPlayerTask.task.group_I;
        if (TaskUtil.isRing(taskGroup) || TaskUtil.isChangeCareer(taskGroup) || this.isTraceTask(sPlayerTask)) {//循环、转职、追踪任务
            this.updateCurrentTraceTask(sPlayerTask);
        } else {
            this.updateCurrentTraceTask();
        }

        if (TaskUtil.isRing(sPlayerTask.task.group_I)) {//循环任务
            //已接了赏金
            if (TaskUtil.isMoneyRing(sPlayerTask.task.group_I)) {
                this.updateNpcStatus(this.mgRingTaskNpcId, ETaskStatus.ETaskStatusHadEnd);
            }
            //已接了仙盟任务
            if (TaskUtil.isGuildRing(sPlayerTask.task.group_I)) {
                this.updateNpcStatus(this.mgGuildTaskNpcId, ETaskStatus.ETaskStatusHadEnd);
            }
            let npcId: number = TaskUtil.getRingTaskNpcId(sPlayerTask);
            this.updateNpcStatus(npcId, ETaskStatus.ETaskStatusHadCompleted);
        } else {
            let npcId: number = 0;
            if (sPlayerTask.status_I == ETaskStatus.ETaskStatusCanGet) {
                npcId = sPlayerTask.task.getNpc_I;
            } else if (sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
                npcId = sPlayerTask.task.endNpc_I;
                this.processOnTaskComplete(sPlayerTask);
            }
            this.updateNpcStatus(npcId, sPlayerTask.status_I);
        }
        if (sPlayerTask.task.code_I > this.cpTaskCode) {
            this._isNewPlayerStage = false;
        }
        EventManager.dispatch(LocalEventEnum.TaskPlayerTaskUpdated);
    }

    /**
     * 玩家任务更新
     * @param SPlayerTaskUpdate
     */
    public updatePlayerTask(sPlayerTaskUpdate: any): void {
        for (let sPlayerTask of this.sPlayerTasks) {
            let taskCode: number = sPlayerTask.task.code_I;
            if (taskCode == sPlayerTaskUpdate.taskCode_I) {
                sPlayerTask.status_I = sPlayerTaskUpdate.status_I;
                sPlayerTask.processes = sPlayerTaskUpdate.processes;
                //追踪任务更新
                if (this.isTraceTask(sPlayerTask)) {
                    this.updateCurrentTraceTask(sPlayerTask);
                }

                if (TaskUtil.isRing(sPlayerTask.task.group_I) && sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
                    this.removePlayerTask(taskCode);
                    //循环任务已完成自动提交
                    EventManager.dispatch(LocalEventEnum.TaskRingEnd, { "taskCode": taskCode });
                    let npcId: number = TaskUtil.getRingTaskNpcId(sPlayerTask);
                    this.updateNpcStatus(npcId, ETaskStatus.ETaskStatusHadEnd);
                } else {
                    let npcId: number;
                    if (sPlayerTask.status_I == ETaskStatus.ETaskStatusCanGet) {
                        npcId = sPlayerTask.task.getNpc_I;
                    } else if (sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
                        npcId = sPlayerTask.task.endNpc_I;
                        EventManager.dispatch(LocalEventEnum.TaskGoto);
                        this.processOnTaskComplete(sPlayerTask);
                    }
                    this.updateNpcStatus(npcId, sPlayerTask.status_I);
                }
            }
        }
        EventManager.dispatch(LocalEventEnum.TaskPlayerTaskUpdated);
    }

    /**
     * 移除一个玩家任务
     */
    public removePlayerTask(taskCode: number): void {
        this.addEndTaskCode(taskCode);
        for (let playerTask of this.sPlayerTasks) {
            if (playerTask.task.code_I == taskCode) {
                this.sPlayerTasks.splice(this.sPlayerTasks.indexOf(playerTask), 1);
                if (this.isTraceTask(playerTask)) {
                    this.updateCurrentTraceTask();
                }

                if (TaskUtil.isRing(playerTask.task.group_I)) {
                    let npcId: number = TaskUtil.getRingTaskNpcId(playerTask);
                    this.updateNpcStatus(npcId, ETaskStatus.ETaskStatusHadEnd);
                } else {
                    this.updateNpcStatus(playerTask.task.endNpc_I, ETaskStatus.ETaskStatusHadEnd);
                }
            }
        }

        EventManager.dispatch(LocalEventEnum.TaskRemoved, taskCode);
        EventManager.dispatch(LocalEventEnum.GuideAfterTask, taskCode);
        EventManager.dispatch(LocalEventEnum.TaskPlayerTaskUpdated);
    }

    /**
     * 是否为追踪任务
     */
    public isTraceTask(sPlayerTask: any): boolean {
        return this.currentTraceTask != null && sPlayerTask != null && this.currentTraceTask.task.code_I == sPlayerTask.task.code_I;
    }

    /**
     * @returns sPlayerTask
     */
    public getCanGetTaskByGroup(group: ETaskGroup): any {
        for (let sTask of this._canGetTasks) {
            if (sTask.group_I == group) {
                let sPlayerTask: any = {};//构造SPlayerTask
                sPlayerTask["status_I"] = ETaskStatus.ETaskStatusCanGet;
                sPlayerTask["processes"] = { "data": [] };
                sPlayerTask["task"] = sTask;
                return sPlayerTask;
            }
        }
        return null;
    }

    /**
     * @returns sPlayerTask
     */
    public getPlayerTaskByGroup(group: ETaskGroup): any {
        for (let playerTask of this.sPlayerTasks) {
            if (playerTask.task.group_I == group) {
                return playerTask;
            }
        }
        return null;
    }

    /**
     * 移除一个可接任务
     */
    public removeCanGetTask(taskCode: number): void {
        for (let sTask of this.canGetTasks) {
            if (sTask.code_I == taskCode) {
                this.canGetTasks.splice(this.canGetTasks.indexOf(sTask), 1);
            }
        }
    }

    /**
     * 自动选择一个npc任务
     * 主线可提交时，支线未领取，优先提交主线
     * 主线、支线都可以提交时，先提交支线
     * @param npcTasks SNpcTask列表
     */
    public autoSelectNpcTask(npcTasks: Array<any>): TaskBase {
        if (npcTasks != null && npcTasks.length > 0) {
            npcTasks.sort((a: any, b: any): number => {
                return TaskUtil.getNpcTaskSort(a) - TaskUtil.getNpcTaskSort(b);
            });
            return npcTasks[0];
        }
        return null;
    }

    /**
     * 是否可以自动领取
     * @param task 任务配置
     */
    public isCanAutoGet(taskCode: number): boolean {
        if (this.hadGetTaskCodes.indexOf(taskCode) != -1) {
            return false;
        }

        let task: any = ConfigManager.task.getByPk(taskCode);
        let playerTask: any = this.getPlayerTask(taskCode);
        if (playerTask != null) {
            return TaskUtil.isCanAutoGet(task) && playerTask.status_I == ETaskStatus.ETaskStatusCanGet;
        }
        return TaskUtil.isCanAutoGet(task);
    }

    /**
     * 是否可以自动提交
     * @param task 任务配置
     */
    public isCanAutoSubmit(taskCode: number): boolean {
        let playerTask: any = this.getPlayerTask(taskCode);
        if (playerTask != null) {
            return TaskUtil.isCanAutoSubmit(playerTask.task.type_I) && playerTask.status_I == ETaskStatus.ETaskStatusHadCompleted;
        }
        return false;
    }

    /**
     * 获取玩家任务
     */
    public getPlayerTask(taskCode: number): any {
        if (this.sPlayerTasks != null) {
            for (let playerTask of this.sPlayerTasks) {
                if (playerTask.task.code_I == taskCode) {
                    return playerTask;
                }
            }
        }
        return null;
    }

    /**
     * 是否在新手等级内
     */
    public get isInNewPlayerLevel(): boolean {
        return CacheManager.role.getRoleLevel() <= 62;
    }

    /**
     *  1.打开窗口再关闭窗口后会自动任务。
     *  2.下线后上线会自动任务。
     *  3.没有指令10秒后会自动任务。(无打怪，行走等指令)
     */
    public isCanAutoGotoTask(sPlayerTask: any): boolean {
        if (!this.isInNewPlayerLevel) {
            return false;
        }

        if (CacheManager.copy.isInCopy) {
            return false;
        }
        if (!TaskUtil.isMain(sPlayerTask.task.group_I)) {
            return false;
        }
        if (!TaskUtil.isLevelMatch(sPlayerTask.task)) {
            return false;
        }
        return true;
    }

    public set gotoTaskFlag(gotoTaskFlag: boolean) {
        this._gotoTaskFlag = gotoTaskFlag;
    }

    /**
     * 是否可以跑去完成任务
     */
    public isCanGotoTask(sPlayerTask: any): boolean {
        if (!this._gotoTaskFlag) {
            return false;
        }
        if (CacheManager.copy.isInCopy) {
            return false;
        }
        if (sPlayerTask != null) {
            let group: ETaskGroup = sPlayerTask.task.group_I;
            if (TaskUtil.isMoneyRing(group)) {
                return true;
            }
            if (TaskUtil.isGuildRing(group)) {
                return true;
            }
            if ((!TaskUtil.isMain(group) || !TaskUtil.isLevelMatch(sPlayerTask.task))) {
                return false;
            }
        }
        this.gotoTaskFlag = true;
        return true;
    }

    /**
     * 获取模块面板用到的任务数据
     * 包括玩家任务和可接任务
     */
    public getModulePlayerTasks(): Array<TaskBase> {
        let listData: Array<TaskBase> = [];
        for (let sPlayerTask of CacheManager.task.sPlayerTasks) {
            listData.push(TaskUtil.getPlayerTask(sPlayerTask));
        }
        //可接任务
        if (this.canGetTasks != null) {
            for (let sTask of this.canGetTasks) {
                let sPlayerTask: any = {};//构造SPlayerTask
                sPlayerTask["status_I"] = ETaskStatus.ETaskStatusCanGet;
                sPlayerTask["processes"] = { "data": [] };
                sPlayerTask["task"] = sTask;
                listData.push(TaskUtil.getPlayerTask(sPlayerTask));
            }
        }

        return listData;
    }

    /**
     * 是否已完成某个任务
     */
    public isHadComplete(taskCode: number): boolean {
        if (this._isAllComplete) {
            return true;
        }
        if (this.isTaskOpenEnd(taskCode)) {
            return true;
        }
        if (this.sPlayerTasks != null) {
            for (let sPlayerTask of this.sPlayerTasks) {
                if (sPlayerTask.task.code_I > taskCode
                    || (sPlayerTask.task.code_I == taskCode && sPlayerTask.status_I == ETaskStatus.ETaskStatusHadCompleted)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 是否结束了某个任务
     */
    public isHadEnd(taskCode: number): boolean {
        if (this._isAllComplete) {
            return true;
        }
        if (this.isTaskOpenEnd(taskCode)) {
            return true;
        }
        if (this.sPlayerTasks != null) {
            for (let sPlayerTask of this.sPlayerTasks) {
                if (sPlayerTask.task.code_I > taskCode) {
                    return true;
                }
            }
        }
        return false;
    }

    public get isAllComplete(): boolean {
        return this._isAllComplete;
    }

    public set isAllComplete(isAllComplete: boolean) {
        this._isAllComplete = isAllComplete;
        if (isAllComplete) {
            EventManager.dispatch(LocalEventEnum.TaskAllComplete);
            EventManager.dispatch(LocalEventEnum.TaskComplete);
        }
    }

    /**
     * 更新循环任务次数信息
     * STaskGroupNum
     */
    public updateGroupNum(sTaskGroupNum: any): void {
        if (sTaskGroupNum == null) {
            return;
        }
        if (this.groupNumDict == null) {
            this.groupNumDict = {};
        }
        this.groupNumDict[sTaskGroupNum.taskGroup_I] = sTaskGroupNum;
    }

    /**
     * 获取循环任务剩余次数信息
     */
    public getGroupNum(group: ETaskGroup): any {
        if (this.groupNumDict != null) {
            return this.groupNumDict[group];
        }
        return null;
    }

    /**
     * 是否可以接循环任务
     */
    public canGetRingTask(group: ETaskGroup): boolean {
        let numInfo: any = this.getGroupNum(group);
        if (numInfo == null) {
            return false;
        }
        let playerTask: any = this.getPlayerTaskByGroup(group);
        if (playerTask != null) {
            return false;
        }
        if (numInfo.num_I >= numInfo.totalNum_I) {
            return false;
        }
        if (group == ETaskGroup.ETaskGroupMgGuild) {
            if (!ConfigManager.mgOpen.isOpenedByKey(ETaskGroup[ETaskGroup.ETaskGroupMgGuild])) {
                return false;
            }
        } else if (group == ETaskGroup.ETaskGroupMgRing) {
            if (!ConfigManager.mgOpen.isOpenedByKey(ETaskGroup[ETaskGroup.ETaskGroupMgRing])) {
                return false;
            }
        } else if (group == ETaskGroup.ETaskGroupTransport) {
            if (!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Transport)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 更新npc状态
     */
    public updateNpcStatus(npcId: number, status: ETaskStatus): void {
        if (npcId == null || npcId < 1000) {
            return;
        }
        let tip: string = "";
        let s: TaskNpcStatus = TaskNpcStatus.None;
        if (status == ETaskStatus.ETaskStatusCanGet) {
            s = TaskNpcStatus.ExclamationMark;
            tip = "可接";
        } else if (status == ETaskStatus.ETaskStatusHadCompleted) {
            s = TaskNpcStatus.QuestionMark;
            tip = "已完成";
        } else {
            tip = TaskNpcStatus[s];
        }
        EventManager.dispatch(LocalEventEnum.TaskNpcState, npcId, s);
    }

    /**
     * 更新当前追踪的任务
     */
    public updateCurrentTraceTask(sPlayerTask: any = null): void {
        if (sPlayerTask != null) {
            this._currentTraceTask = sPlayerTask;
        } else {
            this._currentTraceTask = this.autoSelectPlayerTask();
        }
        this._isReady = true;
        EventManager.dispatch(LocalEventEnum.TaskTraceUpdate);
        if (this._currentTraceTask) {
            EventManager.dispatch(LocalEventEnum.GuidePanelShow);
        }

    }

    public get isReady(): boolean {
        return this._isReady;
    }

    /**
     * 是否需要自动前往任务
     */
    public isNeedAutoGoto(taskCode: number, status: ETaskStatus): boolean {
        // if (CacheManager.role.isNewCreateRole) {//第一个任务不能自动，有欢迎界面触发
        //     return false;
        // }
        let task: any = ConfigManager.task.getByPk(taskCode);
        if (task && task.clientAutoGoto == 1 || taskCode == 300001 || taskCode == 300005) {//第一个任务和第2个任务
            return true;
        }
        if (this.isNewPlayerStage) {//新手阶段
            let taskType: ETaskType = task.type;
            if (taskType == ETaskType.ETaskTypeTalk) {
                return true;
            }
            if (status == ETaskStatus.ETaskStatusNotCompleted) {
                if (task.copyCode == 4002) {//三角色引导副本
                    return true;
                }
                let autoTypes: Array<ETaskType> = [ETaskType.ETaskTypeKillBoss, ETaskType.ETaskTypeReachMap];
                if (autoTypes.indexOf(task.type) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 自动选择一个任务作为任务追踪的信息
     * @return SPlayerTask
     */
    private autoSelectPlayerTask(): any {
        if (this.sPlayerTasks != null && this.sPlayerTasks.length > 0) {
            let mainPlayerTasks: Array<any> = [];
            for (let sPlayerTask of this.sPlayerTasks) {
                if (TaskUtil.isMain(sPlayerTask.task.group_I)) {
                    mainPlayerTasks.push(sPlayerTask);
                }
            }
            mainPlayerTasks.sort((a: any, b: any): number => {
                return TaskUtil.getPlayerTaskSort(a) - TaskUtil.getPlayerTaskSort(b);
            });
            return mainPlayerTasks[0];
        }
        return null;
    }

    /**
     * 任务完成，处理提交任务
     */
    private processOnTaskComplete(sPlayerTask: any): void {
        let taskCode: number = sPlayerTask.task.code_I;
        let task: any = ConfigManager.task.getByPk(taskCode);
        let isCanAutoSubmit: boolean = task != null && task.clientAutoEnd == 1;
        if (isCanAutoSubmit) {
            App.TimerManager.doDelay(1000, () => {//延迟1秒提交，避免任务跳得太快
                EventManager.dispatch(LocalEventEnum.TaskSubmit, {
                    "npcId": sPlayerTask.task.endNpc_I,
                    "taskCode": sPlayerTask.task.code_I
                });
            }, this);
            
        }
        EventManager.dispatch(LocalEventEnum.TaskComplete, sPlayerTask);
        if(taskCode == TaskCodeConst.EncounterTask) {
            TaskCache.isFirstEndEncounterTask = true;
        }
    }

    /**
     * 是否为新手阶段，默认为true，取不到角色时
     * 改为按等级判断
     */
    public get isNewPlayerStage(): boolean {
        return !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.CheckPointShow, false);
    }

    /**
     * 是否为第一张地图跑完的等级，默认为true，取不到角色时
     * 改为按等级判断
     */
    public get isFirstMapPlayerStage(): boolean {
        if (CacheManager.role && CacheManager.role.getRoleLevel()) {
            return CacheManager.role.getRoleLevel() < TaskCache.firstMapPlayerLevel;
        } else {
            return true;
        }
    }

    /**
     * 获取当前可接的天赋任务
     * @param {number} roleIndex
     * @returns {TaskBase}
     */
    public getTalentCanGetTask(roleIndex: number): TaskBase {
        let playerTask: TaskBase;
        let sPlayerTask: any = {};
        for (let sTask of this._canGetTasks) {
            if (sTask.group_I == ETaskGroup.ETaskGrouptalent) {
                sPlayerTask = {};//构造SPlayerTask
                sPlayerTask["status_I"] = ETaskStatus.ETaskStatusCanGet;
                sPlayerTask["processes"] = { "data": [] };
                sPlayerTask["task"] = sTask;
                playerTask = TaskUtil.getPlayerTask(sPlayerTask);
                return playerTask;
            }
        }
        return null;
    }

    /**
     * 获取当前的天赋任务
     * @param {number} roleIndex
     * @returns {TaskBase}
     */
    public getTalentPlayerTask(roleIndex: number): TaskBase {
        let playerTask: TaskBase;
        for (let sPlayerTask of this.sPlayerTasks) {
            let sTask: any = sPlayerTask.task;
            if (sTask.group_I == ETaskGroup.ETaskGrouptalent) {
                playerTask = TaskUtil.getPlayerTask(sPlayerTask);
                return playerTask;
            }
        }
        return null;
    }

    /**
     * 指引世界boss任务是否已完成
     */
    public get isGuideWorldBossTaskComplete(): boolean {
        if (this.currentTraceTask && this.currentTraceTask.task.code_I == ConfigManager.mgOpen.getOpenTask(MgOpenEnum.WorldBossGuide) && this.currentTraceTask.status_I == ETaskStatus.ETaskStatusNotCompleted) {
            return false;
        }
        return true;
    }

    public clear(): void {

    }
}