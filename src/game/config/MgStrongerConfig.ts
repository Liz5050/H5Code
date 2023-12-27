class MgStrongerConfig extends BaseConfig{
	public constructor() {
		super("t_mg_stronger", "id");
	}

	public getData(): Array<any>{
		let dict: any = this.getDict();
		let strongerDatas: Array<any> = [];
		for(let key in dict){
			let data: any = dict[key];
			strongerDatas.push(data);
		}
		return strongerDatas;
	}
}