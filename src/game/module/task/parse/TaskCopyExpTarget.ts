/**
 * 九幽副本
 */
class TaskCopyExpTarget extends TaskBase {
	private copyCode: number;

	public getSubTraceDesc(targetColor: string = "#01ab24"): string {
		let desc: string = "";
		if (this.processContent != null && this.processContent.length > 0) {
			desc = `单次副本获得<font color="${targetColor}">${this.processContent[0]}</font>经验`;
		}
		return desc;
	}

	public gotoTask(isConvey: boolean = false): void {
		if (this.isCompleted) {
			if (isConvey) {
				this.conveyToNpc(this.getNpcId());
			} else {
				this.routeToNpc(this.getNpcId());
			}
		} else {
			//打开副本界面
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallMaterial});
		}
	}
}