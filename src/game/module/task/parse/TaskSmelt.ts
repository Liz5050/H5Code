/**
 * 合成
 */
class TaskSmelt extends TaskBase {

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		if (this.processContent != null && this.processContent.length > 0) {
			let itemCode: number = this.processContent[0];//物品code
			let num: number = this.processContent[1];
			let target: number = this.processContent[2];
			let itemData: ItemData = new ItemData(itemCode);
			desc = `合成${itemData.getColorString(itemData.getName())} <font color="#d36d00">(${num}/${target})</font>`;
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
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Compose);
		}
	}
}