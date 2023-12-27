/**
 * 激活七天法宝
 */
class TaskSevenDayMagicWeaponActivate extends TaskBase {

	public executeTask(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.SevenDayMagicWeapon);
	}
}