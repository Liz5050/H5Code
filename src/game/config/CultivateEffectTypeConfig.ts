class CultivateEffectTypeConfig extends BaseConfig {
	public constructor() {
		super("t_cultivate_effect_type", "type");
	}

	/**
	 * 前置条件字典{"技能名称"： 等级}
	 */
	public getPreConditions(type: number): any {
		let dict: any = {};
		let cfg: any = this.getByPk(type);
		if (cfg != null && cfg.effect2 != null) {
			let conditions: Array<Array<number>> = JSON.parse(cfg.effect2);
			for (let c of conditions) {
				dict[c[0]] = c[1];
			}
		}
		return dict;
	}
}