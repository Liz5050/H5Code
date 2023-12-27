/**状态/buff配置 */
class StateConfig extends BaseConfig {
	public constructor() {
		super("t_state", "stateId");
	}

	public getByPk(value: any): any {
		let data: any = super.getByPk(value);
		if (data != null) {
			let des:string = data["description"];
			if(des && des != "") {
				let re = /<br>/gi;
				data["description"] = des.replace(re, "\n");
			}
		}
		return data;
	}
}