class WorldBossInspireConfig extends BaseConfig {
	public constructor() {
		super("t_world_boss_inspire","type,level");
	}

	/**
	 * 获取当前鼓舞等级配置
	 */
	public getCurBuffCfg():any {
		let buffInfo:any = CacheManager.timeLimitBoss.buffInfo;
		if(!buffInfo) return null;
		let type:number = 1;
		let cfg:any;
		if(buffInfo.goldInspireNum_I > 0) {
			//元宝鼓舞
			cfg = this.getByPk(2 + "," + buffInfo.goldInspireNum_I);
		}
		else {
			//铜钱鼓舞
			cfg = this.getByPk(1 + "," + buffInfo.coinInspireNum_I);
		}
		return cfg;
	}

	public getNextBuffCfg():any {
		let buffInfo:any = CacheManager.timeLimitBoss.buffInfo;
		if(!buffInfo) return null;
		let type:number = 1;
		//先铜钱鼓舞
		let level:number = buffInfo.coinInspireNum_I + 1;
		let cfg:any = this.getByPk(type + "," + level);
		if(!cfg) {
			//元宝鼓舞
			type = 2;
			level = buffInfo.goldInspireNum_I + 1;
			cfg = this.getByPk(type + "," + level);
		}
		return cfg;
	}
}