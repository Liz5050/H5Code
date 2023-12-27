/**
 * 杀怪计数任务，未用到
 */
class TaskKillBossCount extends TaskBase {

	/**执行任务 */
	public executeTask(isConvey: boolean = false): void {
		let taskProcess: TaskProcess = this.getProcess();
		if (taskProcess != null) {
			let tip: string = `正在完成清怪任务，当前${taskProcess.current}/${taskProcess.total}`;
			Tip.showTaskTopTip(tip);
		}
	}
}