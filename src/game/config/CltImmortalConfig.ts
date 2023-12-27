class CltImmortalConfig extends BaseConfig{
	public constructor() {
		super("t_cltimmortal","subtype");
	}

	public getSkillInfo(subType:number):any{
		let info:any = this.getByPk(subType);
		let skillInfo:any = null;
		if(info){
			skillInfo = ConfigManager.skill.getByPk(info.skillId);
		}
		return skillInfo;
	}

	public getCompareAttrInfo(roleIndex:number,info:any):number[][]{
		let attrs:number[][] = [];		
		let curLv:number = CacheManager.forgeImmortals.getImmortalLevel(roleIndex,info.position);//info.level?info.level:0;
		let curLvInfo:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeImmortals},${info.position},${curLv}`);
		let curAttrDict:any = WeaponUtil.getAttrDict(curLvInfo.attr);
		let nextInfo:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeImmortals},${info.position},${curLv+1}`);
		if(nextInfo){
			let nextAttrDict:any = WeaponUtil.getAttrDict(nextInfo.attr);
			for(let key in curAttrDict){
				let curVal:number = curAttrDict[key];
				let sub:number[] = [];
				sub.push(Number(key));
				sub.push(curVal);
				if(nextAttrDict[key]){
					sub.push(nextAttrDict[key]);
				}
				attrs.push(sub);
			}
		}else{
			attrs = CacheManager.forgeImmortals.attrDictToArr(curAttrDict);
		}

		return attrs;
	}


}