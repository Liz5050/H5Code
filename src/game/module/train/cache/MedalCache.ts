/**
 * 勋章数据
 */
class MedalCache implements ICache {
	/**升级勋章的其他升级类型 */
	private _upgradeStrenthenTypes:number[] ;
	public constructor() {
		this._upgradeStrenthenTypes = [
				EStrengthenExType.EStrengthenExTypeWing,
				EStrengthenExType.EStrengthenExTypeUpgrade,
				EStrengthenExType.EStrengthenExTypeRefine,
				EStrengthenExType.EStrengthenExTypeCast,
				EStrengthenExType.EStrengthenExTypeInternalForce,
				EStrengthenExType.EStrengthenExTypeDragonSoul,
				EStrengthenExType.EStrengthenExTypeSKill //技能
			];
		
	}

	/**当前勋章等级 */
	public get curLevel():number{
		let level:number = 1;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeMedal);
		if(info){ //SStrengthenExInfo
			level = info.level; 
		}
		return level;
	}
	/**
	 * 获取某个强化类型的总等级
	 */
	public getStrenthenTypeTotalLv(type:number):number{
		let total:number = 0;
		if(type==EStrengthenExType.EStrengthenExTypeSKill){
			//技能总等级
			total = CacheManager.skill.getTotalSkillLevel();
		}else{
			total = CacheManager.role.getPlayerStrengthenExTotalLv(type);
		}
		return total;
	}

	/**判断某个条件是否ok */
	public isStrenthenItemLvOk(type:number):boolean{
		let curLv:number = this.curLevel;
		let needTotalLv:number = ConfigManager.medal.getItemNeedLv(curLv+1,type);
		let totalLv:number = this.getStrenthenTypeTotalLv(type);
		return totalLv>=needTotalLv;
	}
	/**是否满阶 */
	public isMax():boolean{
		let flag:boolean = false;
		let nextInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeMedal,this.curLevel+1);
		flag  = nextInfo!=null;
		return flag;
	}

	/**判断是否可以升级 */
	public isCanUpgrade(isTip:boolean=false):boolean{
		let flag:boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.TrainMedal],false)){
			return flag;
		}
		if(!this.isMax()){
			if(isTip){
				Tip.showLeftTip(LangTrain.L3);
			}
		}else{
			for(let type of this._upgradeStrenthenTypes){
				flag = this.isStrenthenItemLvOk(Number(type));
				if(!flag){ //只要有一个不符合条件 则不能升级
					if(isTip){
						Tip.showLeftTip(LangTrain.L2);
					}
					break;
				}
			}
		}
				
		return flag;
	}

	/**红点检测函数 */
	public checkTips():boolean{	
		let flag:boolean = this.isCanUpgrade();
		return flag;
	}

	public get upgradeStrenthenTypes():number[]{
		return this._upgradeStrenthenTypes;
	}

	public clear():void{

	}
}