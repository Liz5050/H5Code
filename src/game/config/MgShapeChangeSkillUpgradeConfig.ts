class MgShapeChangeSkillUpgradeConfig extends BaseConfig{
	public constructor() {
		super("t_mg_shape_change_skill_upgrade", "skillIndex,level");
	}

	public getSkillId(index: number, level: number): number{
		let cfg: any = this.getByPk(`${index},${level}`);
		return cfg.skillId;
	}

	public isTalentSkill(shape: EShape, skillId: number): boolean{
		let cfg: Array<any> = this.select({"shape": shape, "skillId": skillId});
		if(cfg.length > 0){
			return true;
		}
		return false;
	}

	/**
	 * 获取道具消耗
	 * @returns 
	 */
	public getPropDict(index: number, level: number): void{
		let cfg: any = this.getByPk(`${index},${level}`);
		let data: any = {};
		data[`${cfg.costItem}`] = cfg.costAmount
		return data;
	}
}