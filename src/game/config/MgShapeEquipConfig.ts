class MgShapeEquipConfig extends BaseConfig {
	private maxDict: any = {};

	public constructor() {
		super("t_mg_shape_equip", "code");
	}

	public getByItemCode(itemCode: number): any{
		let equipData: Array<any> = this.select({"itemCode": itemCode});
		if(equipData){
			return equipData[0];
		}
		return null;
	}

	/**
	 * 获取最大等级
	 */
	public getMaxLevel(shape: EShape, type: number): number{
		if(this.maxDict[shape]){
			if(this.maxDict[shape][type]){
				return this.maxDict[shape][type];
			}
		}

		let dict: any = this.getDict();
		for(let key in dict){
			let data: any = dict[key];
			if(!this.maxDict[data.shape]){
				this.maxDict[data.shape] = {};
			}
			if(!this.maxDict[data.shape][data.type] || this.maxDict[data.shape][data.type] < data.level){
				this.maxDict[data.shape][data.type] = data.level;
			}
		}
		if(this.maxDict[shape][type]){
			return this.maxDict[shape][type];
		}else{
			return 0;
		}
	}
}