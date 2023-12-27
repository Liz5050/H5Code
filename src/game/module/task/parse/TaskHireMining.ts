/**
 * 挖矿
 */
class TaskHireMining extends TaskBase {

	public executeTask(isConvey: boolean = false): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, {"tabType": PanelTabType.Mining});
	}
}