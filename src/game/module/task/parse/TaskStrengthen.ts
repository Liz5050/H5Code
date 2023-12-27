/**
 * 强化任务
 * 强化等级（ETaskTypeStrengthenLevel）：
	contents[ 0 ] - 当前装备件数
	contents[ 1 ] - 目标装备件数
	contents[ 2 ] - 强化等级
	"contents":[0,目标装备件数,强化等级]
 */
class TaskStrengthen extends TaskBase {

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		if (this.status == ETaskStatus.ETaskStatusCanGet) {//可接
			let npcId: number = this.getNpcId();
			let map: string = "";
			let mapName: string = ConfigManager.map.getMapNameByNpcId(npcId);
			map = `到<font color="${targetColor}">${mapName}</font>`;
			let npc: any = ConfigManager.npc.getByPk(npcId);
			desc = `${map}找<font color="${targetColor}">${npc.name}</font>`;
		} else {
			let contents: Array<any> = this.processContent;
			if (contents != null) {
				let num: number = contents[0];
				let target: number = contents[1];
				let strengthenLevel: number = contents[2];
				let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
				if (talk != null) {
					return App.StringUtils.substitude(talk, num, target);
				}
				desc = `<font color="${targetColor}">${target}</font>件装备强化到<font color="${targetColor}">${strengthenLevel}</font>级  <font color="#d36d00">(${num}/${target})</font>`;
			}
		}
		return desc;
	}

	public executeTask(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine);
	}
}