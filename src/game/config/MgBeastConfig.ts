class MgBeastConfig extends BaseConfig {
	public constructor() {
		super("t_mg_beast","code");
	}

	public getData(): Array<any>{
		let dict: any = this.getDict();
		let datas: Array<any> = [];
		for(let key in dict){
			datas.push(dict[key]);
		}
		return datas;
	}
}