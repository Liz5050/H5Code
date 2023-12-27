class CareerUtil {
	/**基础职业计算的除数 1000 */
	public static Career_Divisor:number = 1000;
	public static CareerAll:Array<number> = [1,2,4];

	public constructor() {
	}

	/**
	 * 是否为新手
	 */
	public static isNovice(career: number): boolean {
		return career == 1 || career == 2;
	}

	/**
	 * 职业是否与当前人物职业匹配
	 */
	public static isCareerMatch(career: number,roleIndex:number): boolean {
		if (career == 0) {//通用
			return true;
		}		
		let roleCareer: number = CacheManager.role.getRoleCareer();
		return CareerUtil.isSimilarCareer(career,roleIndex) && CareerUtil.getRebirthTimes(roleCareer) >= CareerUtil.getRebirthTimes(career); //转生需要通过默认角色判断
	}

	/**
	 * 是否为相同职业（即基础职业相等）
	 * @param career 要对比的只有
	 * @param roleIndex 要和哪个角色对比 (如果还没开启的角色返回false)
	 * 
	 */
	public static isSimilarCareer(career: number,roleIndex:number): boolean {
		var srole:any = CacheManager.role.getSRole(roleIndex);
		var flag:boolean = false;
		if(srole){
			let roleCareer: number = srole.career_I;
			let baseCareer: number = CareerUtil.getBaseCareer(career);
			flag = CareerUtil.getBaseCareer(roleCareer) == baseCareer;
			if(!flag){
				flag = baseCareer == 0;
			}
		}		
		return flag;
	}

	/**
	 * 技能职业是否与当前人物职业匹配
	 */
	public static isSkillCareerMatch(skillRoleCareer: number): boolean {
		let roleCareer: number = CacheManager.role.getRoleCareer();
		let roleBaseCareer: number = CareerUtil.getBaseCareer(roleCareer);
		// let roleRebirthTimes: number = CareerUtil.getRebirthTimes(roleCareer);

		return (roleBaseCareer & CareerUtil.getBaseCareer(skillRoleCareer)) > 0;
		// return (skillRoleCareer == roleBaseCareer || CareerUtil.getBaseCareer(skillRoleCareer) == roleBaseCareer);
		// roleRebirthTimes >= CareerUtil.getRebirthTimes(skillRoleCareer);
	}

	/**
	 * 获取基础职业
	 * 1战士 2法师 4道士
	 * @param career 角色职业，如1、1001（1转）、2001（2转）
	 */
	public static getBaseCareer(career: number): number {
		return career % 1000;
	}

	/**获取转生次数 */
	public static getRebirthTimes(career: number): number {
		return Math.floor(career / 1000);
	}

	/**根据职业获取名称(自动转成基础职业) */
	public static getCareerName(career:number):string{
		career = career%CareerUtil.Career_Divisor;
		let careerName:string = "通用";
		if(career>0){
			let inf:any = ConfigManager.career.getByPk(career);		
			if(inf){
				careerName = inf.name; 
			}
		}		
		return careerName;
	}

	public static getLevelName(level: number, roleCareer: number): string {
	    let name: string = `${level}级`;
		let rebirthTimes: number = CareerUtil.getRebirthTimes(roleCareer);
		if (rebirthTimes > 0) {
            name = `${rebirthTimes}转` + name;
		}
		return name;
	}

	public static getLevelNameByState(level: number, roleState: number): string {
	    let name: string = `${level}级`;
		let rebirthTimes: number = roleState;
		if (rebirthTimes > 0) {
            name = `${rebirthTimes}转` + name;
		}
		return name;
	}

}