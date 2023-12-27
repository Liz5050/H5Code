class GamePlayConfig extends BaseConfig {
	private cfgArr:any[];
	public constructor() {
		super("t_game_play_config","activeType");
	}

	public get allCfgs():any[] {
		// if(!this.cfgArr) {
		// }
		this.cfgArr = [];
		let dict:any = this.getDict();
		for(let key in dict) {
			if(!dict[key].status) continue;
			this.cfgArr.push(dict[key]);
		}
		return this.cfgArr;
	}
}