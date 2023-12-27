class MedalConfig extends BaseConfig{
	private _typeKeyNameDict:any;
	private _typeOpenInfoDict:any;
	public constructor() {
		super("t_medal","level");
		this._typeKeyNameDict = {
			[EStrengthenExType.EStrengthenExTypeWing]:"wing",
			[EStrengthenExType.EStrengthenExTypeUpgrade]:"upgrade",
			[EStrengthenExType.EStrengthenExTypeRefine]:"refine",
			[EStrengthenExType.EStrengthenExTypeCast]:"cast",
			[EStrengthenExType.EStrengthenExTypeInternalForce]:"internalforce",
			[EStrengthenExType.EStrengthenExTypeDragonSoul]:"dragonsoul",
			[EStrengthenExType.EStrengthenExTypeSKill]: "skill"//技能
		};
		this._typeOpenInfoDict = {
			[EStrengthenExType.EStrengthenExTypeWing]:[ModuleEnum.Shape,PanelTabType.Wing],
			[EStrengthenExType.EStrengthenExTypeUpgrade]:[ModuleEnum.Forge,PanelTabType.Strengthen],
			[EStrengthenExType.EStrengthenExTypeRefine]:[ModuleEnum.Forge,PanelTabType.Refine],
			[EStrengthenExType.EStrengthenExTypeCast]:[ModuleEnum.Forge,PanelTabType.Casting],
			[EStrengthenExType.EStrengthenExTypeInternalForce]:[ModuleEnum.Skill,PanelTabType.InnerPower],
			[EStrengthenExType.EStrengthenExTypeDragonSoul]:[ModuleEnum.MagicWare,PanelTabType.DragonSoul],
			[EStrengthenExType.EStrengthenExTypeSKill]: [ModuleEnum.Skill,PanelTabType.Skill]//技能
		}
	}

	public getItemNeedLv(level:number,type:number):number{
		let targetLv:number = 0;
		let info:any = this.getByPk(level);
		if(info){
			let keyName:string = this.getItemKeyName(type);
			targetLv = ObjectUtil.getConfigVal(info,keyName,""); 
		}
		return targetLv;
	}
	/**获取某个条件类型的配置key */
	public getItemKeyName(type:number):string{
		return this._typeKeyNameDict[type];
	}

	public getTypeOpenInfo(type:number):any{
		return this._typeOpenInfoDict[type];
	}

	/**
	 * 根据等阶获取图标
	 */
	public getStageIcoUrl(stage:number):string{
		return URLManager.getModuleImgUrl(`medal/stageico/medal_${stage}.png`,PackNameEnum.Train);
	}
	/**获取升级条件项目图标 */
	public getItemIcoUrl(type:number):string{
		return URLManager.getModuleImgUrl(`medal/itemtype/item_type_${type}.png`,PackNameEnum.Train);
	}

}