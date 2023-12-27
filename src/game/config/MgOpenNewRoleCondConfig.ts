class MgOpenNewRoleCondConfig extends BaseConfig {
	public constructor() {
		super("t_mg_open_new_role_cond", "id");
	}

	public getCondition(): string {
		let rolesLen: number = CacheManager.role.roles.length;
		if (rolesLen >= RoleIndexEnum.RoleIndexAll.length) {
			return "角色已全部开启";
		}
		let str: string = "";
		let color: string = Color.Color_6;
		let isCanCreate: boolean = this.isCanCreateRole();
		if (rolesLen == 1) {//创角第2个角色
			if(!isCanCreate) {
				color = Color.Color_4;
			}
			str = `<font color = '${color}'>次日80级 或 VIP2</font>`;
		} else if (rolesLen == 2) {//创角第3个角色
			if(!isCanCreate) {
				color = Color.Color_4;
			}
			str = `<font color = '${color}'>4转 或 VIP4</font>`;
		}
		//按配置解析组合
		// let conditionArray: Array<{ [type: number]: number }> = this.getConditionArray(CacheManager.role.roles.length);
		// for (let condDict of conditionArray) {//条件或
		// 	let color: string;
		// 	let value: number;
		// 	let one: string = "";
		// 	for (let key in condDict) {//条件与
		// 		color = Color.GreenCommon;
		// 		value = condDict[key];
		// 		if (key == '1') {
		// 			if (!CacheManager.role.isLevelMatch(value)) {
		// 				color = Color.RedCommon;
		// 			}
		// 			if (one == '') {
		// 				one += `<font color = '${color}'>${value}级</font>`;
		// 			} else {
		// 				one += `且<font color = '${color}'>${value}级</font>`;
		// 			}
		// 		} else if (key == '2') {
		// 			if (CacheManager.vip.vipLevel < value) {
		// 				color = Color.RedCommon;
		// 			}
		// 			if (one == '') {
		// 				one += `<font color = '${color}'>VIP${value}</font>`;
		// 			} else {
		// 				one += `且<font color = '${color}'>VIP${value}</font>`;
		// 			}
		// 		} else if (key == '3') {
		// 			if (CacheManager.role.getRoleState() < value) {
		// 				color = Color.RedCommon;
		// 			}
		// 			if (one == '') {
		// 				one += `<font color = '${color}'>${value}转</font>`;
		// 			} else {
		// 				one += `且<font color = '${color}'>${value}转</font>`;
		// 			}
		// 		} else if (key == '4') {
		// 			if (CacheManager.welfare2.onlineDays < value) {
		// 				color = Color.RedCommon;
		// 			}
		// 			if (one == '') {
		// 				one += `<font color = '${color}'>第${value}天</font>`;
		// 			} else {
		// 				one += `且<font color = '${color}'>第${value}天</font>`;
		// 			}
		// 		}
		// 	}
		// 	if (str != "") {
		// 		str += " 或 " + one;
		// 	} else {
		// 		str += one;
		// 	}
		// }
		return str;
	}

	public isCanCreateRole(): boolean {
		if (CacheManager.role.roles.length >= RoleIndexEnum.RoleIndexAll.length) {
			return false;
		}
		let conditionArray: Array<{ [type: number]: number }> = this.getConditionArray(CacheManager.role.roles.length);
		for (let condDict of conditionArray) {//条件或
			let value: number;
			let isTrue: boolean = true;
			for (let key in condDict) {//条件与
				value = condDict[key];
				if (key == '1') {
					if (!CacheManager.role.isLevelMatch(value)) {
						isTrue = false;
						break;
					}
				} else if (key == '2') {
					if (CacheManager.vip.vipLevel < value) {
						isTrue = false;
						break;
					}
				} else if (key == '3') {
					if (CacheManager.role.getRoleState() < value) {
						isTrue = false;
						break;
					}
				} else if (key == '4') {//登录天数
					if (CacheManager.welfare2.onlineDays < value) {
						isTrue = false;
						break;
					}
				}
			}
			if (isTrue) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 开启条件
	 */
	public getOpenCondition(index: number): string {
		let condition: any = {
			"0": "",
			"1": "次日80级或\nVIP2开启",
			"2": "3转或\nVIP4开启"
		}
		return condition[index];
	}

	/**
	 * 获取条件数组。一个数据内部dict条件“且”，多个数据条件“或”
	 */
	public getConditionArray(id: number): Array<{ [type: number]: number }> {
		let array: Array<{ [type: number]: number }> = [];
		let data: any = this.getByPk(id);
		let cond: string = data.cond;
		if (cond != null && cond != "") {
			let a1: Array<string> = cond.split("#");
			for (let orStr of a1) {
				if (orStr != "") {
					let a2: Array<string> = orStr.split(";");
					let condDict: any = {};
					for (let andStr of a2) {
						let a3: Array<string> = andStr.split(",");
						condDict[Number(a3[0])] = Number(a3[1]);
					}
					array.push(condDict);
				}
			}
		}
		return array;
	}
}