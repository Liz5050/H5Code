/**
 * 历史进入副本次数
 */
class TaskHistoryEnterCopyCount extends TaskBase {
	private copyType: ECopyType;
	private copyCode: number;

	public executeTask(isConvey: boolean = false): void {
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			this.copyType = contents[0];
		}
		this.copyCode = this.task.copyCode;
		TaskCopyUtil.execute(this.copyType, this.copyCode);
	}
}