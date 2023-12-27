/**
 * 副本进入次数
 * "contents":[副本类型,当前次数,目标次数]
 */
class TaskEnterCopyCount extends TaskBase {
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