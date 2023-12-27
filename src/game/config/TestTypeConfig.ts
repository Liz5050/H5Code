class TestTypeConfig extends BaseConfig {
	private cfgs:Array<any>;

	public constructor() {
		super("t_test_type_config", "type");
	}

	public getTestTypeCfgs(): Array<any> {
		if(this.cfgs != null){
			return this.cfgs;
		}
		let cfgs: Array<any> = [];
		let dict: any = this.getDict()
		for (let key in dict) {
			cfgs.push(dict[key]);
		}
		cfgs.sort((a: any, b: any): number => { return a.type - b.type });
		this.cfgs = cfgs;
		return cfgs;
	}

	public search(name:string): Array<any> {
		let cfgs: Array<any> = [];
		for(let cfg of this.cfgs){
			if((cfg.typeName as string).indexOf(name) != -1){
				cfgs.push(cfg);
			}
		}
		return cfgs;
	}
}