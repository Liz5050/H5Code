/**任务配置 */
class TaskConfig extends BaseConfig {
	private _lastTaskCode: number = -1;

	public constructor() {
		super("t_task_config", "code");
	}

	/**
	 * 最后一个任务编号
	 */
	public get lastTaskCode(): number {
		if (this._lastTaskCode == -1) {
			let dict: any = this.getDict();
			let code: number;
			for (let key in dict) {
				code = Number(key);
				if (code > this._lastTaskCode) {
					this._lastTaskCode = code;
				}
			}
		}
		return this._lastTaskCode;
	}

	public isLastTask(code: number): boolean {
		return code == this.lastTaskCode;
	}
}