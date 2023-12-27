/**
 * 指定任务执行器。处理需要特殊处理的任务
 */
class TaskAppointExecutor {
	/**第一个任务 */
	private firstTaskCode: number = 300001;
	/**激活第2个神器碎片任务 */
	private godWeaponPiece2TaskCode: number = 300013;

	public constructor() {
	}

	/**
     * 接取任务处理
     * @param task 任务配置
     */
	public processOnTaskGet(sPlayerTask: any): void {
		let taskCode: number = sPlayerTask.task.code_I;
		if (taskCode == this.godWeaponPiece2TaskCode) {
			EventManager.dispatch(LocalEventEnum.TrainActGodWeaponPiece, 1, 2);
		}
	}

    /**
     * 任务结束后处理
     * @param task 任务配置
     */
	public processOnTaskEnd(task: any): void {
		if (task) {
			let taskCode: number = task.code;
			if (taskCode == this.firstTaskCode) {
				App.TimerManager.doDelay(1000, () => {//等装备更新到背包后自动装备武器
					EventManager.dispatch(UIEventEnum.PlayerOnekeyEquip, { derssPosAll: [EDressPos.EDressPosWeapon], roleIndex: 0 });
				}, this);
			}
		}
	}
}