/**经验配置 */
class ExperienceConfig extends BaseConfig {
	private _minLevelExpLv:number = 0;

	public constructor() {
		super("t_experience", "level");
		//getLevelExp 获得的修为
	}

	/**获取当前等级最大经验值 */
	public getMaxExp(level: number): number {
		return this.getByPk(level).upgradeNeedExperience;
	}
	

	/**
	 * 获取属性字典
	 */
	public getAttrDict(level: number): any {
		let attrDict: any = {};
		let cfg: any = this.getByPk(level);
		attrDict[EJewel.EJewelPhysicalAttack] = cfg.attack;
		attrDict[EJewel.EJewelLife] = cfg.life;
		attrDict[EJewel.EJewelPass] = cfg.pass;
		attrDict[EJewel.EJewelPhysicalDefense] = cfg.defense;
		return attrDict;
	}
	/**获取可兑换修为的等级信息 */
	public getCurLevelExp(level:number=-1):any{
		if(level==-1){
			level = CacheManager.role.getRoleLevel();
		}
		let info:any = this.getByPk(level);
		while(info && !info.getLevelExp){
			level++;
			info = this.getByPk(level);
		}
		return info;
	}

	public get minLevelExpLv():number{
		if(!this._minLevelExpLv){
			let info:any = this.getCurLevelExp(1);
			this._minLevelExpLv = info?info.level:0; 
		}
		return this._minLevelExpLv;
	}

}