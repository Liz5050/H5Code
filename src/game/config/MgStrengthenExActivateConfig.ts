/**
 * 新强化系统激活配置
 */
class MgStrengthenExActivateConfig extends BaseConfig {

	public constructor() {
		super("t_mg_strengthen_ex_activate", "type");
	}

	/**
	 * 根据类型获取激活数据
	 */
	public getByType(type: EStrengthenExType): any {
		let dict: any;
		let cfg: any = this.getByPk(type);
		if (cfg != null) {
			dict = {
				"condition": {},
				"desc": {},
			};
			let a1: Array<string> = cfg.activateLimit.split("#");
			let a2: Array<string> = cfg.activateLimitDesc.split("#");
			for (let i: number = 0; i < a1.length; i++) {
				dict["condition"][i + 1] = this.toArray(a1[i].split(","));
				dict["desc"][i + 1] = a2[i];
			}
		}
		return dict;
	}

	private toArray(inArray: Array<string>): Array<number> {
		let array: Array<number> = [];
		for (let i: number = 0; i < inArray.length; i++) {
			array.push(Number(inArray[i]));
		}
		return array;
	}

}