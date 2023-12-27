/**
 * 采集任务
 */
class TaskCollect extends TaskBase {

	public getSubTraceDesc(targetColor: string): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			let bossCode: number = contents[0];
			let itemCode: number = contents[1];
			let num: number = contents[2];
			let target: number = contents[3];
			let mapId: number = contents[4];
			let x: number = contents[5];//怪物所在坐标x
			let y: number = contents[6];//怪物所在坐标y
			let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
			if (talk != null) {
				return App.StringUtils.substitude(talk, num, target);
			}
			let boss: any = ConfigManager.boss.getByPk(bossCode);
			desc = `采集<font color="${targetColor}">${boss.name}</font>  <font color="#d36d00">(${num}/${target})</font>`;
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

	public executeTask(): void {
		EventManager.dispatch(LocalEventEnum.AIAdd, {
			"type": AIType.Collect,
			"data": { "bossCode": this.processContent[0], "mapId": this.processContent[4], "x": this.processContent[5], "y": this.processContent[6], "num": this.processContent[3] }
		});
	}

}