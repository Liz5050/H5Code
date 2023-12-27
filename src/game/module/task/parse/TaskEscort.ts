/**
 * 护送任务
 */
class TaskEscort extends TaskBase {

	public getSubTraceDesc(): string {
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
			desc = `护送<font color="#00FF00">${boss.name}</font>`;
		}
		return desc;
	}

	/**
	 * 前往
	 */
	public gotoTask(): void {
		if (this.isCompleted) {
			this.routeToNpc(this.getNpcId());
		} else {
			//前往刷怪点
			// let contents: Array<any> = this.getProcessContent();
			// let mapId: number = contents[4];
			// let x: number = contents[5];//怪物所在坐标x
			// let y: number = contents[6];//怪物所在坐标y
			// this.routeToGrid(x, y, mapId);
			this.routeToNpc(this.getNpcId());
		}
	}

}