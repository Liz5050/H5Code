/**强化扩展配置 */
class MgStrengthenExConfig extends BaseConfig {
	/**最大等级字典 */
	private maxLevelDict: any;
	private skillDict: any;
	private wingModelIds: Array<number> = [];
	private modelIds: any;
	private modelsDict: any;
	/**每级可选升级消耗物品是一样的 */
	private sameChooseItemDict:any;

	public constructor() {
		super("t_mg_strengthen_ex", "strengthenType,strengthenLevel");
		this.sameChooseItemDict = {};
	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this.maxLevelDict = {};
		this.modelIds = {};
		this.modelsDict = {};
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
			for (let d of sourceData) {
				key = "";
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;
				}
				data[key] = d;

				let type: number = Number((d[pks[0]] ? d[pks[0]] : 0));
				let level: number = Number((d[pks[1]] ? d[pks[1]] : 0));
				if (this.maxLevelDict[type] == null || (this.maxLevelDict[type]) != null && level > this.maxLevelDict[type]) {
					this.maxLevelDict[type] = level;
				}

				if (d["strengthenType"] == EStrengthenExType.EStrengthenExTypeWing) {
					if (this.wingModelIds.indexOf(d["modelId"]) == -1) {
						this.wingModelIds.push(d["modelId"]);
					}
				}

				let stage: number = d.stage;
				if(this.modelsDict[type] == null){
					this.modelsDict[type] = {};
				}
				if(this.modelsDict[type][d.modelId] == null || (this.modelsDict[type][d.modelId] != null && this.modelsDict[type][d.modelId] > d.stage)){
					this.modelsDict[type][d.modelId] = d.stage;
				}

				if(this.modelIds[type] == null){
					this.modelIds[type] = [];
				}
				if(this.modelIds[type].indexOf(d.modelId) == -1){
					this.modelIds[type].push(d.modelId);
				}
			}
		}
		return data;
	}

	public getUseItemCode(strengthenType: EStrengthenExType): number {
		let cfg: any = this.getByPk(strengthenType + "," + 1);
		if (!cfg) {
			Log.trace(Log.SERR, "t_mg_strengthen_ex error:", strengthenType);
			return 0;
		}
		return cfg.useItemCode;
	}

	/**
	 * 根据强化类型和强化等级获取配置
	 */
	public getByTypeAndLevel(strengthenType: EStrengthenExType, strengthenLevel: number): any {
		let key: string = `${strengthenType},${strengthenLevel}`;
		return this.getByPk(key);
	}
	/**根据一个等级获取下一个有奖励的等级信息 */
	public getStageRewardInfo(type: number, curLv: number): any {
		let info: any = this.getByTypeAndLevel(type, curLv);
		let c: number = 0;
		while ((info && !info.getReward) || (info && info.getReward && CacheManager.nobility.isGetLevelReward(curLv))) {
			curLv++;
			c++;
			info = this.getByTypeAndLevel(type, curLv);
		}
		return { count: c, info: info }
	}

	/**
	 * 获取有开启技能的配置
	 */
	public getHadOpenSkills(strengthenType: EStrengthenExType): Array<any> {
		this.getDict();
		if(this.skillDict == null){
			this.skillDict = {};
		}
		if (!this.skillDict[strengthenType]) {	
			let cfg: any;
			for (let key in this.dataDict) {
				cfg = this.dataDict[key];
				if (cfg.strengthenType == strengthenType && cfg.openSkill != null) {
					if (this.skillDict[strengthenType] == null) { //找到技能才创建，明知道没有技能的系统就不用调这个函数
						this.skillDict[strengthenType] = [];
					}
					this.skillDict[strengthenType].push(cfg);
				}
			}
		}
		return this.skillDict[strengthenType];
	}

	public getNextMaxDrupInfo(type:number,curLv:number,curMax:number,index:number):any{
		let mn:number = 0;
		let info:any = this.getByTypeAndLevel(type,curLv);
		let key:string = `drug${index}ItemMax`;
		while(info && info[key] && info[key]<=curMax){
			curLv++;
			info = this.getByTypeAndLevel(type,curLv);
		}
		if(info && info[key] && info[key]>curMax){
			return info;
		}
		return null;

	}

	/**
	 * 获取最大等级
	 */
	public getMaxLevel(strengthenType: EStrengthenExType): number {
		this.getDict();
		return this.maxLevelDict[strengthenType];
	}

	// public getWingModelIds(): Array<number> {
	// 	return this.wingModelIds;
	// }

	public getModels(strengthenType:EStrengthenExType): any{
		if(this.modelIds[strengthenType]){
			return this.modelIds[strengthenType];
		}
		return {};
	}

	public getModelFirstStage(strengthenType: EStrengthenExType, modelId: number): number{
		if(this.modelsDict[strengthenType] && this.modelsDict[strengthenType][modelId]){
			return this.modelsDict[strengthenType][modelId];
		}
		return -1;
	}

	/**获取有多个升级消耗物品的列表;每阶消耗一样的 */
	public getChooseItems(strengthenType:number,level:number=0):ItemData[]{
		let info:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(strengthenType,level);
        if(info && info.chooseItemInfoList && !this.sameChooseItemDict[strengthenType]){ // code,数量,增加的祝福值
            let chooseItems:ItemData[] = RewardUtil.getRewards(info.chooseItemInfoList);
			/*
            let ary:string[] = CommonUtils.configStrToArr(info.chooseItemInfoList,false);
            for(let i:number = 0;i<ary.length;i++){
                let item:ItemData = new ItemData(Number(ary[i]));
                item.itemAmount = Number(ary[i]);
                chooseItems.push(item);                
            }
			*/
			this.sameChooseItemDict[strengthenType] = chooseItems;
        }
		return this.sameChooseItemDict[strengthenType];
	}

	/**
	 * 获取x阶x星
	 */
	public getStageStar(strengthenType:EStrengthenExType, level:number):string{
		let info:any = this.getByTypeAndLevel(strengthenType, level);
		if(info != null){
			let star: number = 0;
			if(info["star"] != null){
				star = info["star"];
			}
			return `${info["stage"]}阶${star}星`;
		}
		return "";
	}


}