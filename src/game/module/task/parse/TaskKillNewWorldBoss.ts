/**
 * 击杀野外boss
 */
class TaskKillNewWorldBoss extends TaskBase {
	private bossCode: number;

	public executeTask(isConvey: boolean = false): void {
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			this.bossCode = contents[0];
		}
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.WorldBoss, "bossCode": this.bossCode });
	}
}