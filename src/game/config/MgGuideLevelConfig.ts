class MgGuideLevelConfig extends BaseConfig{
	private datas: Array<any> = [];
	public constructor() {
		super("t_mg_guide_level", "id");
	}

	public getData(): Array<any>{
		if(this.datas.length == 0){
			let dict: any = this.getDict();
			for(let key in dict){
				this.datas.push(dict[key]);
			}
		}
		return this.datas;
	}
}