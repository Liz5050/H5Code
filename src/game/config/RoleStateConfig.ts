/**转生配置 */
class RoleStateConfig extends BaseConfig {
	public constructor() {
		super("t_mg_role_state", "roleState,roleSubState");
	}

	public getByEndTask(taskCode: number): any {
		let dict: any = this.getDict();
		for (let key in dict) {
			if (dict[key].endTask == taskCode) {
				return dict[key];
			}
		}
		return null;
	}

	/**
	 * 获取几转的最大阶段
	 * @param 转数
	 */
	public getMaxSubState(roleState: number): number {
		let max: number = 0;
		let dict: any = this.getDict();
		let value: any;
		for (let key in dict) {
			value = dict[key];
			if (value.roleState == roleState && value.roleSubState > max) {
				max = value.roleSubState;
			}
		}
		return max;
	}
}