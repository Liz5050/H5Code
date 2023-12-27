class CultivateSuitConfig extends BaseConfig{
	public constructor() {
		super("t_cultivate_suit_config","cultivateType,subtype,level,num");
	}

	//根据当前激活数量，获得当前套装配置
	public getCurSuitInfoByCurNum(type:number, subType:number, curNum:number):any {
		let datas:any = this.select({"cultivateType": ECultivateType.ECultivateTypeIllustrated, "subtype": subType});

		let result:any = null;
		let tempNum:number = 0;
		for(let data of datas) {
			if(data.num <= curNum) {
				if(result && result.num > data.num) {

				}
				else {
					result = data;
				}
			}
		}
		return result;
	}
	
	public getCurSuitInfoByCurLevelHeart(type:number, subType:number, curNum:number):any {
		let datas:any = this.select({"cultivateType": type, "subtype": subType});

		let result:any = null;
		let tempNum:number = 0;
		for(let data of datas) {
			if(data.level == curNum) {
				return data;
			}
		}
		return result;
	}
}