class MgShapeOpenConfig extends BaseConfig {
	public constructor() {
		super("t_mg_shape_open_skill", "shape,level");
	}

	/**
	 * 获取技能开放等级
	 */
	public getOpenLevel(shape: EShape, skillId: number, isTalentSkill: boolean = false): number {
		let dict: any = this.getDict();
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape) {
				if (isTalentSkill) {
					if (data['talentSkill'] == skillId) {
						return data["level"] ? data["level"] : 0;
					}
				} else {
					if (data['openSkill'] == skillId) {
						return data["level"];
					}
				}
			}
		}
		return 0;
	}

	public getAllSkillByShape(shape: EShape): Array<number> {
		let dict: any = this.getDict();
		let arr: Array<number> = [];
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape && data["openSkill"]) {
				arr.push(data["openSkill"]);
			}
		}
		return arr;
	}

	/**获取天赋技能id */
	public getTalentSkillByShape(shape: EShape): number {
		let dict: any = this.getDict();
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape && data["talentSkill"]) {
				return data["talentSkill"];
			}
		}
		return 0;
	}

	public getNextSkillByShapeLevel(shape: EShape, level: number): any {
		let dict: any = this.getDict();
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape) {
				if (data["level"] > level) {
					return data["openSkill"];
				}
			}
		}
		return 0;
	}

	/**
	 * 是否为天赋技能
	 */
	public isTalentSkill(shape: EShape, skillId: number): boolean {
		let dict: any = this.getDict();
		for (let key in dict) {
			let data: any = dict[key];
			if (data["shape"] == shape && data["talentSkill"] == skillId) {
				return true;
			}
		}
		return false;
	}
}