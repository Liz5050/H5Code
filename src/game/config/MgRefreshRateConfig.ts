class MgRefreshRateConfig extends BaseConfig{
	public constructor() {
		super("t_mg_refresh_rate", "id");
	}

	public getAttMax(type: number): number{
		let datas: Array<any> =  this.select({"attrType": type});
		let maxNum: number = 0;
		for(let data of datas){
			if(maxNum < data.upper){
				maxNum = data.upper;
			}
		}
		return maxNum;
	}
}