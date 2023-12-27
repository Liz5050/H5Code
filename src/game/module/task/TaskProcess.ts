/**
 * 任务进度
 */
class TaskProcess {
	/**当前值 */
	public current: number = 0;
	/**总值 */
	public total: number = 0;

	public constructor(current: number = 0, total: number = 0) {
		this.current = current;
		this.total = total;
	}
}