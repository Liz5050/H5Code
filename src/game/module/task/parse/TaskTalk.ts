/**
 * 对话任务。
 * 主线自动领取，支线手动领取
 */
class TaskTalk extends TaskBase {
	private npcId: number;
	private taskPoint: TaskPoint;

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		let mapId: number;
		let talkId: number;
		if (TaskUtil.isRing(this.group)) {//赏金特殊处理
			if (this.processContent.length > 0) {
				this.npcId = this.processContent[0];
				talkId = this.processContent[1];
			}
		} else {
			this.npcId = this.getNpcId();
		}
		let npcName: string = "";
		let npc: any = ConfigManager.npc.getByPk(this.npcId);
		if (npc != null) {
			npcName = npc.name;
		} else {
			Log.trace(Log.TASK, `npc不存在：${this.npcId}`);
		}
		desc = `与<font color="${targetColor}">${npcName}</font>对话`;
		return desc;
	}

	/**执行任务所在任务点 */
	public getExecuteTaskPoint(): TaskPoint {
		// 	contents[0] - npc					对应地图NPC配置
		// contents[1] - 对话id				对应对话配置数据
		// contents[2] - 对话状态				0未对话,1已对话（不需要配置）
		// contents[3] - 对话奖励物品			0没有物品奖励
		// contents[4] - 对话奖励物品数量		0
		// let taskPoint: TaskPoint;
		// let contents: Array<any> = this.getProcessContent();
		// if (contents != null) {//不能直接提交的，有进程信息
		// 	let sNpc: any = contents[0];
		// 	if (sNpc != null) {
		// 		taskPoint = new TaskPoint();
		// 		taskPoint.npcId = sNpc.npcId_I;
		// 	}
		// }

		if (this.taskPoint == null) {
			this.taskPoint = new TaskPoint();
		}
		if (TaskUtil.isRing(this.group)) {//赏金特殊处理
			if (this.processContent.length > 0) {
				this.npcId = this.processContent[0];
			}
		} else {
			this.npcId = this.getNpcId();
		}
		this.taskPoint.npcId = this.npcId;
		return this.taskPoint;
	}

	/**执行任务 */
	public executeTask(isConvey: boolean = false): void {
		let taskPoint: TaskPoint = this.getExecuteTaskPoint();
		if (isConvey) {
			this.conveyToNpc(taskPoint.npcId);
		} else {
			this.routeToNpc(taskPoint.npcId);
		}
	}
}