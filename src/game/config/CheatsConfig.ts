class CheatsConfig extends BaseConfig{
	public constructor() {
		super("t_cheats","itemCode");
	}
	/**根据物品code计算秘籍的战力 */
	public getFight(itemCode:number,roleIndex:number = -1):number{
		let fight:number = 0;
		let itemCfg:any = ConfigManager.item.getByPk(itemCode);
		if(itemCfg && itemCfg.effect){//配了战斗力(评分,直接显示)
			return itemCfg.effect;
		}
		let info:any = this.getByPk(itemCode);
		if(info){
			if(info.effectStr){//技能,直接读取配置的战力
				let arr:string[] = CommonUtils.configStrToArr(info.effectStr,false);		
				arr = arr[0].split(",");		
				let effInfo:any=ConfigManager.cultivateEffect.getByPk(arr[0]+","+arr[1]);
				let skillId:number = effInfo?effInfo.addSkillId:0;
				let skillCfg:any = ConfigManager.skill.getByPk(skillId); 
				if(skillCfg){
					fight = skillCfg.warfare;
				}
			}else if(info.attr){
				fight = WeaponUtil.getCombat(WeaponUtil.getAttrDict(info.attr),roleIndex);
			}
		}
		return fight;
	}
	
	public getCheatUrl(item:ItemData):string{
		let url:string = URLManager.getModuleImgUrl(`cheatsico/${item.getItemInfo().icon}.png`,PackNameEnum.Skill);		
		return url;
	}

}