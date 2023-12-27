/**
 * 星级通关副本（x星）
 */
class TaskStarPassCopy extends TaskBase {
	private copyCode: number;

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		let star: number;
		if (contents != null) {
			star = contents[0];
		}
		this.copyCode = this.task.copyCode;
		let copy: any = ConfigManager.copy.getByPk(this.copyCode);
		desc = `通关<font color="${targetColor}">${copy.name}</font>`;
		return desc;
	}

	public executeTask(isConvey: boolean = false): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 1, "cName": "c2", "tabIndex2": 4, "cName2": "c1" });
	}

	// public gotoTask(isConvey: boolean = false): void {
	// 	if (this.isCompleted) {
	// 		if (isConvey) {
	// 			this.conveyToNpc(this.getNpcId());
	// 		} else {
	// 			this.routeToNpc(this.getNpcId());
	// 		}
	// 	} else {
	// 		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 1, "cName": "c2", "tabIndex2": 4, "cName2": "c1" });
	// 	}
	// }
}