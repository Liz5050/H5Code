class CultivateConfig extends BaseConfig{

	private maxLevelDic:any = null;
	private minLevelDic:any = null;

	private subTypesDic:any = {};
	private posDic:any = {};
	private itemsDic:any = {};

	private materialDic:any = null;

	public constructor() {
		super("t_cultivate_config","cultivateType,position,level");
	}

    protected transform(oneData: any, dataDict:any): any {
        let cultivateType: number = oneData.cultivateType;
        let position: number = oneData.position;
        let cfg0:any = dataDict[`${cultivateType}-${position}-0-`];
        let cfg1:any = dataDict[`${cultivateType}-${position}-1-`];
        if(cfg0 != null || cfg1 != null) {
            oneData.posName = cfg0 != null? cfg0.posName:cfg1.posName;
        }
        return oneData;
    }
		
	//获取某个部位的最高等级
	public getMaxLevel(type:number, position:number):number {
		let key = type + "_" + position;
		if(!this.maxLevelDic) {
			this.maxLevelDic = {};
			let tempKey:string = "";
			let maxLevel:number = 0;
			let data:any;
			let dic:any = this.getDict();
			let level:number = 0;
			for(let k in dic) {
				data = dic[k];
				tempKey = data.cultivateType + "_" + data.position;
				maxLevel = this.maxLevelDic[tempKey];
				level = data.level ? data.level : 0;
				if((!maxLevel) || maxLevel < level) {
					this.maxLevelDic[tempKey] = level;
				}
			}
		}
		return this.maxLevelDic[key];
	}
	//获取某个位置的最低等级
	public getMinCfg(type:number, position:number):any {
		let key = type + "_" + position;
		if(!this.minLevelDic) {
			this.minLevelDic = {};
			let tempKey:string = "";
			let minLevel:number = 9999;
			let data:any;
			let dic:any = this.getDict();
			let level:number = 0;
			for(let k in dic) {
				data = dic[k];
				tempKey = data.cultivateType + "_" + data.position;
				minLevel = this.minLevelDic[tempKey];
				level = data.level ? data.level : 0;
				if((!minLevel) || minLevel > level) {
					this.minLevelDic[tempKey] = data;
				}
			}
		}
		return this.minLevelDic[key];
	}

	//获取子类型列表 type:ECultivateType
	public getSubTypes(type:number):Array<number> {
		if(!this.subTypesDic[type]) {
			let cultivateDatas: any = this.select({"cultivateType": type});
			let arr:Array<number> = [];
			let subDic:any = {};
			for(let key in cultivateDatas) {
				let data:any = cultivateDatas[key];
				let sub:number = data.subtype;
				if(!subDic[sub]) {
					arr.push(sub);
					subDic[sub] = true;
				}
			}

			// if(arr.length == 0) {
			// 	arr = [1, 2, 3, 4, 5, 6, 7, 8];
			// }

			this.subTypesDic[type] = arr;
		}
		return this.subTypesDic[type];
	}

	//获取某个子类有哪些position
	public getPosDic(type:number, subType:number):any {
		let key:string = type + "_" + subType;
		if(this.posDic[key])
		{
			return this.posDic[key];
		}

		let cultivateDatas: any = this.select({"cultivateType": type});
		let arr:Array<any> = [];
		let dic:any = {};
		let tempKey:string = "";
		for(let k in cultivateDatas) {
			let data:any = cultivateDatas[k];
			let sub:number = data.subtype;
			if(sub == subType) {
				dic[data.position] = true;
			}
		}
		this.posDic[key] = dic;
		return dic;
	}

	//根据类型获取配置列表
	public getItems(type:number, subType:number): Array<any> {
		let key:string = type + "_" + subType;
		if(this.itemsDic[key])
		{
			return this.itemsDic[key];
		}

		let cultivateDatas: any = this.select({"cultivateType": type});
		let arr:Array<any> = [];
		let posDic:any = {};
		let tempKey:string = "";
		for(let k in cultivateDatas) {
			let data:any = cultivateDatas[k];
			let sub:number = data.subtype;

			if(sub == subType && !posDic[data.position]) {
				if(type == ECultivateType.ECultivateTypeIllustrated) {
					data.itemData = new ItemData(data.position);
				}
				arr.push(data);
				posDic[data.position] = true;
			}
		}

		// if(arr.length == 0) {
		// 	for(let i:number=1; i < (subType+3); i++) {
		// 		let ddd:any = {
		// 			"attr" : "1,883#3,353#",
		// 			"attrIndex" : 1,
		// 			"cultivateType" : ECultivateType.ECultivateTypeIllustrated,
		// 			"effectDesc" : "这是一条测试数据"+i,
		// 			"effectStr" : "11001,2,1#",
		// 			"itemCode" : 200000021+i,
		// 			"itemNum" : i,
		// 			"level" : 1,
		// 			"posDesc" : "1转",
		// 			"posName" : "" + (200000021+i),
		// 			"position" : 200000021+i,
		// 			"roleState" : 0,
		// 			"subtype" : subType,
		// 		}
		// 		ddd.itemData = new ItemData(ddd.position);
		// 		arr.push(ddd);
		// 	}
		// }

		this.itemsDic[key] = arr;
		return arr;
	}

	//根据材料获取可激活或升级的配置
	public getConfigsByMaterial(itemCode:number):Array<any> {
		if(!this.materialDic) {
			this.materialDic = {};
			let data:any;
			let dic:any = this.getDict();
			let tempArr:Array<any>;
			for(let k in dic) {
				data = dic[k];
				if(data.itemCode) {
					tempArr = this.materialDic[data.itemCode];
					if(!tempArr) {
						tempArr = [];
						this.materialDic[data.itemCode] = tempArr;
					}
					tempArr.push(data);
				}
			}
		}
		if(!this.materialDic[itemCode]) {
			this.materialDic[itemCode] = [];
		}
		return this.materialDic[itemCode];
	}

	//当前职业开启情况是否满足该条配置
	public checkCareerFix(data:any):boolean {
		let careerFix:boolean = true;
		switch (data.attrIndex) {
			case 4:
				careerFix = CacheManager.role.isOpenedCareer(ECareer.ECareerWarrior);
				break;
			case 5:
				careerFix = CacheManager.role.isOpenedCareer(ECareer.ECareerArcher);
				break;
			case 6:
				careerFix = CacheManager.role.isOpenedCareer(ECareer.ECareerFireMage);
				break;
		}
		return careerFix;
	}

	//返回职业前缀
	public getCareerPre(data:any):string {
		let careerStr:string = "";
		switch (data.attrIndex) {
			case 4:
				careerStr = CareerUtil.getCareerName(ECareer.ECareerWarrior);
				break;
			case 5:
				careerStr = CareerUtil.getCareerName(ECareer.ECareerArcher);
				break;
			case 6:
				careerStr = CareerUtil.getCareerName(ECareer.ECareerFireMage);
				break;
		}
		return careerStr;
	}

	public getCfgByLevelAndType(type:number, position:number , level : number ):any {
		// let cultivateDatas: any = this.select({"cultivateType": type, "position": position });
		// if(cultivateDatas) {
		// 	for(let i=0 ; i < cultivateDatas.length; i++) {
		// 		if(level == 0) {
		// 			if(	!cultivateDatas[i].level ) {
		// 				return  cultivateDatas[i];
		// 			}
		// 		}
		// 		else {
		// 			if(	cultivateDatas[i].level == level) {
		// 				return cultivateDatas[i];
		// 			}
		// 		}
		// 	}
		// }
		// return  null;
		return this.getByPKParams(type, position, level);
	}


}