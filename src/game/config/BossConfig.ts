/**怪物配置 */
class BossConfig extends BaseConfig {
	public constructor() {
		super("t_boss", "code");
	}

	/**获取怪物模型资源ID */
	public getModelId(code: number): string {
		return this.getByPk(code).modelId;
	}

	/**获取怪物模型头像ID */
	public getAvatarId(code: number): string {
		return this.getByPk(code).avatarId;
	}

	public getBossLevelStr(boss : any, chiLevel : boolean = false) : string {
		if(boss.showLevel) {
			return boss.showLevel + "转";
		}
		else {
			if(!chiLevel) {
				return "Lv." + boss.level;
			}
			else {
				return boss.level + "级";
			}
		}
	}
}