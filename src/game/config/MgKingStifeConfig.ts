class MgKingStifeConfig extends BaseConfig {
	public constructor() {
		super("t_mg_king_stife","level");
	}

	public getStageStrByLevel(level:number):string {
		let cfg:any = this.getByPk(level);
		if(!cfg) return "t_mg_king_stife error Lv：" + level;
		return this.getStageStr(cfg.stage) + GameDef.NumberName[cfg.advanceShow] + "阶";
	}

	public getStageStr(stage:number):string {
		switch(stage) {
			case 1:
				return "青铜";
			case 2:
				return "白银";
			case 3:
				return "黄金";
			case 4:
			case 5:
				return "钻石";
			default:
				return stage + "--";
		}
	}
}