/**强化目标加成配置 */
class MgTargetConfig extends BaseConfig {

	public constructor() {
		super("t_mg_target", "id");
	}

	/**
	 * 获取当前强化目标
	 */
	public getStrengthCurrentTarget(level:number):any{
		return this.getCurrentTarget(1, level);
	}

	/**
	 * 获取下一级强化目标
	 * @returns null表示无下一级
	 */
	public getStrengthNextTarget(level:number):any{
		return this.getNextTarget(1, level);
	}

	/**
	 * 获取当前星级目标
	 */
	public getStarCurrentTarget(level:number):any{
		return this.getCurrentTarget(3, level);
	}

	/**
	 * 获取下一级星级目标
	 * @returns null表示无下一级
	 */
	public getStarNextTarget(level:number):any{
		return this.getNextTarget(3, level);
	}

	/**
	 * 获取当前宝石目标
	 */
	public getStoneCurrentTarget(level:number):any{
		return this.getCurrentTarget(2, level);
	}

	/**
	 * 获取下一级宝石目标
	 * @returns null表示无下一级
	 */
	public getStoneNextTarget(level:number):any{
		return this.getNextTarget(2, level);
	}

	/**
	 * 根据类型和等级获取当前目标
	 */
	public getCurrentTarget(type:number, level:number):any{
		var target:any;
		let dict:any = this.getDict();
		for(let id in dict){
			let d:any = dict[id];
			if(d['type'] == type){
				let next:any = dict[Number(id) + 1];
				if(level <= d['num'] || next == null){
					target = d;
					break;
				}else{
					if(next != null && level < next['num']){
						target = d;
						break;
					}
				}
			}
		}
		return target;
	}

	/**
	 * 获取下一级目标
	 * @returns null表示无下一级
	 */
	public getNextTarget(type:number, level:number):any{
		// let current:any = this.getStrengthCurrentTarget(level);
		let current:any = this.getCurrentTarget(type, level);
		let next:any = this.getDict()[Number(current['id']) + 1];
		if(next != null && next['type'] == type){
			return next;
		}
		return null;
	}
}