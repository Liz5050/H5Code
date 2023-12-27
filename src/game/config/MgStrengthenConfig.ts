/**强化配置 */
class MgStrengthenConfig extends BaseConfig {
	public constructor() {
		super("t_mg_strengthen", "equipType,strengthenLevel");
	}

	/**
	 * 根据装备类型和强化等级获取配置
	 */
	public getByTypeAndLevel(equipType:number, strengthenLevel:number):any{
		let key:string = `${equipType},${strengthenLevel}`;
		return this.getByPk(key);
	}
}