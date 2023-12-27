/**
 * 杀怪首次掉落
 */
class TaskKillBossFirstDrop extends TaskBase {

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		if (this.processContent != null && this.processContent.length > 0) {
			let contents: Array<any> = this.processContent;
			let bossCode: number = contents[0];
			let num: number = contents[1];
			let target: number = contents[2];
			let mapId: number = contents[3];
			let x: number = contents[4];//怪物所在坐标x
			let y: number = contents[5];//怪物所在坐标y
			let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
			if (talk != null) {
				return App.StringUtils.substitude(talk, num, target);
			}
			let boss: any = ConfigManager.boss.getByPk(bossCode);
			desc = `击败<font color="${targetColor}">${boss.name}</font>  <font color="#d36d00">(${num}/${target})</font>`;
		}
		return desc;
	}


	/**执行任务所在任务点 */
	public getExecuteTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint;
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			let mapId: number = contents[3];
			let x: number = contents[4];//怪物所在坐标x
			let y: number = contents[5];//怪物所在坐标y
			taskPoint = new TaskPoint();
			taskPoint.x = x;
			taskPoint.y = y;
			taskPoint.mapId = mapId;
		}
		return taskPoint;
	}

	/**执行任务 */
	public executeTask(isConvey: boolean = false): void {
		let mapId: number = this.processContent[3];
		let x: number = this.processContent[4];
		let y: number = this.processContent[5];
		if (isConvey) {
			EventManager.dispatch(LocalEventEnum.SceneConvey, { "mapId": mapId, "conveyType": EConveyType.EConveyTypeTask, "point": { "x": x, "y": y }, "callBack": null });
		} else {
			EventManager.dispatch(LocalEventEnum.AutoStartFight, { "bossCode": this.processContent[0], "mapId": mapId, "x": x, "y": y });
		}
	}

}