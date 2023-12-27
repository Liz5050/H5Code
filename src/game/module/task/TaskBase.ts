/**
 * 任务基类
 */
class TaskBase {
	/**追踪标题 */
	public traceTitle: string;
	/**追踪描述 */
	public traceDesc: string;
	/**模块标题 */
	public moduleTitle: string;
	/**模块描述 */
	public moduleDesc: string;
	/**模块详情 */
	public modulDetail: string;
	/**进度内容 */
	public processContent: Array<any>;
	/**任务配置 */
	public task: any;
	/**传送回调 */
	protected conveycallBack: CallBack;

	/**SPlayerTask */
	private _sPlayerTask: any;
	private _extendJson: any;

	public constructor(sPlayerTask: any) {
		this.sPlayerTask = sPlayerTask;
		this.conveycallBack = new CallBack(this.gotoTask, this, false);
	}

	public set sPlayerTask(sPlayerTask: any) {
		this._sPlayerTask = sPlayerTask;
		this.parse();
	}

	protected parse(): void {
		this.parseProcess();
		this.task = ConfigManager.task.getByPk(this.sTask.code_I);
		if (this.task == null) {
			Log.trace(Log.TASK, `任务不存在：${this.sTask.code_I}`);
			return;
		}
		this.parseTraceTitle();
		this.parseTraceDesc();
		// this.parseModuleTitle();
		// this.parseModuleDesc();
		// this.parseModuleDetail();
        if(this.sTask.extendJsStr_S != null && this.sTask.extendJsStr_S != "") {
            this._extendJson = JSON.parse(this.sTask.extendJsStr_S);
        }
	}

	public get sPlayerTask(): any {
		return this._sPlayerTask;
	}

	public get sTask(): any {
		return this._sPlayerTask.task;
	}

	public get group(): ETaskGroup {
		return this.sTask.group_I;
	}

	public get code(): number {
		return this.sTask.code_I;
	}

	public get groupShortName(): string {
		return GameDef.TaskGroupShortName[this.group];
	}

	public get taskName(): string {
		return this.task.name;
	}

	/**配置的描述 */
	public get taskBrief(): string {
		return this.task.taskBrief;
	}

	/**任务状态 */
	public get status(): number {
		return this._sPlayerTask.status_I;
	}

	/**
	 * 任务类型
	 */
	public get type(): ETaskType {
		return this._sPlayerTask.task.type_I;
	}

    /**
     * 扩展json对下
     */
	public get extendJson(): any {
        return this._extendJson;
    }

	/**
	 * 任务是否已完成
	 */
	public get isCompleted(): boolean {
		return this.status == ETaskStatus.ETaskStatusHadCompleted;
	}

	/**
	 * 任务要求等级是否匹配
	 */
	public get isLevelMatch(): boolean {
		return TaskUtil.isLevelMatch(this.sTask);
	}

	/**
	 * 是否可以小飞鞋传送
	 */
	public get isCanFly(): boolean {
		return this.sTask.canUseConvey_B == 1;
	}

	/**
	 * 是否需要自动前往
	 */
	public get isNeedAutoGoto(): boolean {
		return CacheManager.task.isNeedAutoGoto(this.code, this.status);
	}

	/**
	 * 是否为关卡任务
	 */
	public get isCheckPoint(): boolean {
		if (this.type == ETaskType.ETaskTypeTaskCount) {
			let countType: ETaskCountType;
			if (this.processContent != null && this.processContent.length > 0) {
				countType = this.processContent[0];
				return countType == ETaskCountType.ETaskCountTypeCopyCheckPointOne;
			}
		}
		return false;
	}

	/**
	 * 获取任务对应的npcId
	 */
	public getNpcId(): number {
		let npcId: number = this.sTask.getNpc_I;
		if (this.status == ETaskStatus.ETaskStatusHadCompleted) {
			npcId = this.sTask.endNpc_I;
		}
		return npcId;
	}

	/**
	 * 获取任务奖励
	 */
	public getRewards(): Array<ItemData> {
		let rewards: Array<ItemData> = [];
		let rewardsStr: string = this.task.rewards;
		if (rewardsStr != null && rewardsStr != "") {
			rewards = TaskUtil.getTaskRewardsByStr(rewardsStr);
		}
		return rewards;
	}

	/**
	 * 前往任务流程
	 * @param isConvey 是否使用小飞鞋传送
	 */
	public gotoTask(isConvey: boolean = false): void {
		if (this.task == null) {
			return;
		}
		if (!this.isLevelMatch) {
			Tip.showTip("等级不足，请尽快升级");
			return;
		}
		if (TaskUtil.isChangeCareer(this.group) && this.isCompleted && this.getNpcId() == 2) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.ChangeCareer);
			return;
		}
		let taskPoint: TaskPoint = this.getCurTaskPoint();
		let isNotComplete: boolean = false;
		let callBack: CallBack;
		if (this.status == ETaskStatus.ETaskStatusNotCompleted) {//未完成
			isNotComplete = true;
		}

		if (isNotComplete) {
			let kingEntity: MainPlayer = CacheManager.king.kingEntity;
			if (kingEntity != null && (kingEntity.currentState == EntityModelStatus.Jump
				|| kingEntity.currentState == EntityModelStatus.JumpUpDown
				|| kingEntity.currentState == EntityModelStatus.ScaleTween) && TaskUtil.isNeedFindPath(this.type)) {
				return;
			}
			this.executeTask(isConvey);
		} else {
			if (taskPoint != null) {
				if (taskPoint.npcId == 1) {//直接提交任务
					EventManager.dispatch(LocalEventEnum.TaskSubmit, { "npcId": taskPoint.npcId, "taskCode": this.task.code });
					return;
				}
				if (isConvey) {
					if (taskPoint.npcId > 0) {
						this.conveyToNpc(taskPoint.npcId, callBack);
					} else {
						this.conveyToGrid(taskPoint.x, taskPoint.y, taskPoint.mapId, callBack);
					}
				} else {
					if (taskPoint.npcId > 0) {
						this.routeToNpc(taskPoint.npcId, callBack);
					} else {
						this.routeToGrid(taskPoint.x, taskPoint.y, taskPoint.mapId, callBack);
					}
				}
			}
		}
	}

	public getCurTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint;
		if (this.status == ETaskStatus.ETaskStatusCanGet) {
			//可接
			taskPoint = this.getGetTaskPoint();
		}
		else if (this.status == ETaskStatus.ETaskStatusNotCompleted) {
			//未完成
			taskPoint = this.getExecuteTaskPoint();
		}
		else if (this.status == ETaskStatus.ETaskStatusHadCompleted) {
			//已完成
			taskPoint = this.getSubmitTaskPoint();
		}
		return taskPoint;
	}

	/**接任务所在任务点 */
	public getGetTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint = new TaskPoint();
		taskPoint.npcId = this.sTask.getNpc_I;
		return taskPoint;
	}

	/**执行任务所在任务点 */
	public getExecuteTaskPoint(): TaskPoint {
		return null;
	}

	/**执行任务 */
	public executeTask(isConvey: boolean = false): void {
	}

	/**提交任务所在任务点 */
	public getSubmitTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint = new TaskPoint();
		taskPoint.npcId = this.sTask.endNpc_I;
		return taskPoint;
	}


	/**
	 * 寻路到指定格子
	 * @param mapId 默认当前地图
	 */
	public routeToGrid(gridX: number, gridY: number, mapId: number = -1, callBack: CallBack = null): void {
		if (mapId == -1) {
			mapId = CacheManager.map.mapId;
		}
		EventManager.dispatch(LocalEventEnum.SceneRouteToGrid, { "mapId": mapId, "x": gridX, "y": gridY, "callBack": callBack });
	}

	/**
	 * 寻路到指定npc
	 */
	public routeToNpc(npcId: number, callBack: CallBack = null): void {
		EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, { "npcId": npcId, "callBack": callBack });
	}

	/**
	 * 传送到指定点
	 */
	public conveyToGrid(x: number, y: number, mapId: number = -1, callBack: CallBack = null): void {
		if (callBack == null) {
			callBack = this.conveycallBack;
		}
		EventManager.dispatch(LocalEventEnum.SceneConvey, { "mapId": mapId, "conveyType": EConveyType.EConveyTypeTask, "point": { "x": x, "y": y }, "callBack": callBack });
	}

	/**
	 * 传送到指定点
	 */
	public conveyToNpc(npcId: number, callBack: CallBack = null): void {
		let npc: any = ConfigManager.map.getNpc(npcId);
		if (npc != null) {
			if (callBack == null) {
				callBack = this.conveycallBack;
			}
			EventManager.dispatch(LocalEventEnum.SceneConvey, { "mapId": npc.mapId, "conveyType": EConveyType.EConveyTypeTask, "point": npc.point, "npc": npc, "callBack": callBack });
		}
	}

	protected parseTraceTitle(): void {
		let processStr: string = "";
		if (this.isCompleted) {
			if (this.type == ETaskType.ETaskTypeTalk) {
				processStr = HtmlUtil.html("(0/1)", Color.RedCommon);
			} else {
				processStr = HtmlUtil.html("(已完成)", Color.GreenCommon);
			}
		} else {
			let taskProcess: TaskProcess = this.getProcess();
			if (taskProcess != null) {
				processStr = HtmlUtil.html(`(${taskProcess.current}/${taskProcess.total})`, Color.RedCommon);
			}
		}
		this.traceTitle = this.taskName + processStr;
	}

	protected parseTraceDesc(): void {
		// let subDesc: string;
		// let color: string = this.getDescColor(false);
		// if (this.isCompleted) {
		// 	subDesc = this.getCompleteDesc(color);
		// } else {
		// 	subDesc = this.getSubTraceDesc();
		// }
		// this.traceDesc = this.getDesc(subDesc, color);
		let desc: string = "";
		if (this.taskBrief == null || this.taskBrief == "") {
			let names: Array<string> = [];
			for (let itemData of this.getRewards()) {
				names.push(itemData.getName() + "*" + itemData.getItemAmount());
			}
			desc = names.join(",");
		} else {
			desc = this.taskBrief;
		}
		this.traceDesc = desc;
	}

	/**
	 * 获取任务完成描述
	 */
	protected getCompleteDesc(color: string): string {
		if (TaskUtil.isChangeCareer(this.group) && this.getNpcId() == 2) {
			//转职任务特殊处理
			let cfg: any = ConfigManager.roleState.getByEndTask(this.sTask.code_I);
			if (cfg != null) {
				let maxSubState: number = ConfigManager.roleState.getMaxSubState(cfg.roleState);
				if (cfg.roleSubState >= maxSubState) {
					return "完成转职";
				} else {
					return `点击进入第${cfg.roleSubState + 1}阶段`;
				}
			}
			return "";
		} else {
			let npcId: number = this.sTask.endNpc_I;
			if (TaskUtil.isRing(this.group) && this.sTask.type_I == ETaskType.ETaskTypeTalk) {//赏金特殊处理
				if (this.processContent != null && this.processContent.length > 0) {
					npcId = this.processContent[0];
				}
			}
			let npc: any = ConfigManager.npc.getByPk(npcId);
			if (npc != null) {
				return `与<font color="${color}">${npc.name}</font>对话`;
			}
			return "";
		}
	}

	/**
	 * 获取子类追踪描述
	 */
	protected getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		return "";
	}

	/**
	 * 获取进度内容。
	 * 默认0/1
	 */
	public getProcess(): TaskProcess {
		let process: TaskProcess = new TaskProcess(0, 1);
		if (this.sPlayerTask.processes.data.length > 0) {
			let data: any = this.sPlayerTask.processes.data[0];
			process = new TaskProcess(data.process_I, data.target_I);
		}
		return process;
	}

	protected parseModuleTitle(): void {
		this.moduleTitle = this.getTitle(this.getTitleColor(true));
	}

	protected parseModuleDesc(): void {
		let subDesc: string;
		let color: string = this.getDescColor(true);
		if (this.isCompleted) {
			subDesc = this.getCompleteDesc(color);
		} else {
			subDesc = this.getSubModuleDesc();
		}
		this.moduleDesc = this.getDesc(subDesc, color);
	}

	/**
	 * 获取子类模块描述
	 */
	protected getSubModuleDesc(targetColor: string = "#01ab24"): string {
		return this.getSubTraceDesc(targetColor, true);
	}

	protected parseModuleDetail(): void {
		if (TaskUtil.isRing(this.group)) {
			this.modulDetail = this.moduleDesc;
		} else {
			let content: string = "";
			let talkId: number = this.task.getTalkId;
			if (this.isCompleted) {
				talkId = this.task.endTalkId;
			}
			let talk: any = ConfigManager.taskTalk.getByPk(talkId);
			if (talk != null) {
				content = talk.talkStr;
				if (talkId == 60015) {
					this.modulDetail = content.replace("[name]", CacheManager.role.player.name_S);
				} else {
					this.modulDetail = content;
				}
			} else {
				this.modulDetail = "";
			}
		}
	}

	/**
	 * 解析任务进度
	 */
	protected parseProcess(): void {
		let processes: any[] = this.sPlayerTask.processes.data;
		if (processes != null && processes.length > 0) {
			let sprocess: any = processes[0];
			this.processContent = sprocess.contents.data_I;
		}
	}

	/**
	 * 获取标题
	 */
	private getTitle(color: string): string {
		let title: string = "";
		if (TaskUtil.isRing(this.group)) {//循环任务特殊处理
			title = `[${GameDef.TaskGroupName[this.group]}]`;
			let numInfo: any = CacheManager.task.getGroupNum(this.group);
			if (numInfo != null) {
				title += `(${numInfo.num_I + 1}/${numInfo.totalNum_I})`;
			}
		} else {
			title = `${this.taskName}`;
		}
		return `<font color="${color}">${title}</font>`;
	}

	/**
	 * 获取任务描述
	 * @param subDesc 子描述
	 * @param color 颜色
	 */
	private getDesc(subDesc: string, color: string): string {
		let desc: string = "";
		//判断条件
		if (!this.isLevelMatch) {
			let tip: string = ConfigManager.client.getTaskLevelNotMatchTip(this.sTask.code_I);
			if (tip == null) {
				let conditionLevel: number = TaskUtil.getCompleteConditionLevel(this.sTask);
				tip = `${conditionLevel}级可领取`;
			}
			desc = `<font color="#FF0000">${tip}</font>`;
		} else {
			let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
			if (talk != null && talk != "" && talk.indexOf("{") == -1) {//无参数替换
				subDesc = talk;
			}
			desc = `<font color="${color}">${subDesc}</font>`;
		}
		return desc;
	}

	/**
	 * 获取任务标题颜色
	 */
	private getTitleColor(isInModule: boolean = false): string {
		let color: string = "#ff7610";
		switch (this.status) {
			case ETaskStatus.ETaskStatusCanGet:
				color = "#0178fe";
				break;
			case ETaskStatus.ETaskStatusNotCompleted:
				color = "#ff7610";
				break;
			case ETaskStatus.ETaskStatusHadCompleted:
				color = "#01ab24";
				if (!isInModule) {
					color = "#0df14b";
				}
				break;
		}
		return color;
	}

	/**
	 * 获取任务说明颜色
	 */
	private getDescColor(isInModule: boolean = false): string {
		let color: string = "#FFFFFF";
		switch (this.status) {
			case ETaskStatus.ETaskStatusCanGet:
				color = "#01ab24";
				break;
			case ETaskStatus.ETaskStatusNotCompleted:
				color = "#FFFFFF";
				if (isInModule) {
					color = "#853d07";
				}
				break;
			case ETaskStatus.ETaskStatusHadCompleted:
				color = "#01ab24";
				if (!isInModule) {
					color = "#0df14b";
				}
				break;
			case ETaskStatus.ETaskStatusHadFail://失败（未达成完成条件,未交）
				color = "#FF0000";
				break;
		}
		return color;
	}
}