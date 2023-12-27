/**
 * 仙盟神兽配置
 */
class GuildBeastGodConfig extends BaseConfig {
	public constructor() {
		super("t_mg_guild_beast_god", "bossCode");
	}

	/**
	 * 根据等级获取神兽信息
	 */
	public getByLevel(level: number): any {
		let dict: any = this.getDict();
		let cfg: any;
		let min: number = 0;
		for (let key in dict) {
			cfg = dict[key];
			if (cfg.levelLower != null) {
				min = cfg.levelLower;
			}
			if (level >= min && level <= cfg.levelUpper) {
				return cfg;
			}
		}
		return null;
	}
}