/**
 * 指引任务
 */
class TaskGuide extends TaskBase {
	private taskGroup: ETaskGroup;

	public getSubTraceDesc(): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			this.taskGroup = contents[0];
			desc = this.getGuideGroupDesc(this.taskGroup);
		}
		return desc;
	}

	/**执行任务所在任务点 */
	public getExecuteTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint;
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			let mapId: number = contents[4];
			let x: number = contents[5];//怪物所在坐标x
			let y: number = contents[6];//怪物所在坐标y
			taskPoint = new TaskPoint();
			taskPoint.x = x;
			taskPoint.y = y;
			taskPoint.mapId = mapId;
		}
		return taskPoint;
	}

	private getGuideGroupDesc(taskGroup: ETaskGroup): string {
		let desc: string;
		switch (taskGroup) {
			case ETaskGroup.ETaskGroupMgRing:
				desc = `指引赏金任务`;
				break;
			case ETaskGroup.ETaskGroupMgGuild:
				desc = `指引申请仙盟`;
				break;
		}
		if (desc == null) {
			Log.trace(Log.TASK, "指引类型ETaskGroup未处理", taskGroup)
		}
		return `${desc}`;
	}

	public gotoTask(isConvey: boolean = false): void {
		if (this.isCompleted) {
			if (isConvey) {
				this.conveyToNpc(this.getNpcId());
			} else {
				this.routeToNpc(this.getNpcId());
			}
		} else {
			if (this.taskGroup == ETaskGroup.ETaskGroupMgRing) {
				if (isConvey) {
					this.conveyToNpc(CacheManager.task.mgRingTaskNpcId);
				} else {
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Daily);
				}
			}
		}
	}
}