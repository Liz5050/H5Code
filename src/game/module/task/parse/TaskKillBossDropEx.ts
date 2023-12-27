/**
 * 杀怪掉落扩展（名字相同但bossId不同）
 */
class TaskKillBossDropEx extends TaskBase {

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		if (contents != null && contents.length > 0) {
			let bossCode: number = contents[0];
			let itemCode: number = contents[1];//物品code
			let num: number = contents[2];
			let target: number = contents[3];
			let mapId: number = contents[4];
			let x: number = contents[5];//怪物所在坐标x
			let y: number = contents[6];//怪物所在坐标y
			let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
			if (talk != null) {
				return App.StringUtils.substitude(talk, num, target);
			}
			let itemData: ItemData = new ItemData(itemCode);
			desc = `收集${itemData.getColorString(itemData.getName())}  <font color="#d36d00">(${num}/${target})</font>`;
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

	/**执行任务 */
	public executeTask(isConvey: boolean = false): void {
		let mapId: number = this.processContent[4];
		let x: number = this.processContent[5];
		let y: number = this.processContent[6];
		if (isConvey) {
			EventManager.dispatch(LocalEventEnum.SceneConvey, { "mapId": mapId, "conveyType": EConveyType.EConveyTypeTask, "point": { "x": x, "y": y }, "callBack": null });
		} else {
			EventManager.dispatch(LocalEventEnum.AutoStartFight, { "bossCode": this.processContent[0], "mapId": mapId, "x": x, "y": y });
		}
	}

}