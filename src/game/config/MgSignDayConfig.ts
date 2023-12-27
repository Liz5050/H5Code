class MgSignDayConfig extends BaseConfig {
	public constructor() {
		super("t_mg_sign_day","day");
	}

	public getData(): Array<any>{
		let dict: any = this.getDict();
		let datas: Array<any> = [];
		for(let key in dict){
			let data: any = dict[key];
			datas.push(data);
		}
		return datas;
	}
}