/**
 * 杀怪任务
 */
class TaskKillBoss extends TaskBase {

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
		if (talk != null) {
			return talk;
		}
		let contents: Array<any> = this.processContent;
		if (contents != null && contents.length > 0) {
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
			let map: string = "";
			if (showMap) {
				let mapInfo: MapInfo = ConfigManager.map.getMapInfo(mapId);
				map = `到<font color="${targetColor}">${mapInfo.getByKey("name")}</font>`;
			}
			let boss: any = ConfigManager.boss.getByPk(bossCode);
			desc = `${map}击败<font color="${targetColor}">${boss.name}</font>  <font color="#d36d00">(${num}/${target})</font>`;
		}
		return desc;
	}

	public getProcess(): TaskProcess {
		let contents: Array<any> = this.processContent;
		if (contents != null && contents.length > 0) {
			let num: number = contents[1];
			let target: number = contents[2];
			return new TaskProcess(num, target);
		}
		return null;
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
		if (this.isNeedAutoGoto) {
			let mapId: number = this.processContent[3];
			let x: number = this.processContent[4];
			let y: number = this.processContent[5];
			if (isConvey) {
				EventManager.dispatch(LocalEventEnum.SceneConvey, { "mapId": mapId, "conveyType": EConveyType.EConveyTypeTask, "point": { "x": x, "y": y }, "callBack": null });
			} else {
				EventManager.dispatch(LocalEventEnum.AutoStartFight, { "bossCode": this.processContent[0], "mapId": mapId, "x": x, "y": y });
			}
			return;
		}
		let taskProcess: TaskProcess = this.getProcess();
		if (taskProcess != null) {
			let tip: string = `正在完成清怪任务，还剩${taskProcess.current}/${taskProcess.total}`;
			Tip.showTaskTopTip(tip);
		}
	}
}