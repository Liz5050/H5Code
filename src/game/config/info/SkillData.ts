/**
 * 技能数据
 */
class SkillData {
	public skill: any;
    public skillUpgrade: any;

    private _data: any;//SSkill
    private _posType: number = -1;
    private _level:number = 1;
    private _isMaxLevel:boolean;
    private _roleIndex:number = -1;

	public constructor(param: any) {
		if (typeof param === 'number' || typeof param === 'string') {
			this.data = { "code_I": param };
		} else {
			this.data = param;
		}
	}

	/**
	 * 设置技能数据
	 */
	public set data(param: any) {
		this._data = param;
		this.skill = ConfigManager.skill.getByPk(param.code_I);
		this.level = param.level_I || 1;
	}

	/**
	 * 设置角色索引
	 */
	public set roleIndex(value: number) {
		this._roleIndex = value;
	}

	public getIconRes(): string {
		if (this.skill) {
			return URLManager.getIconUrl(this.skill.skillIcon, URLManager.SKIL_ICON);
		}
		return "";
	}

	/**
	 * 是否为主动技能
	 */
	public isActiveSkill(): boolean {
		return this.useType == ESkillUseType.ESkillUseTypeInitiative;
	}

	/**
	 * 是否为普通攻击
	 */
	public isNormalSkill(): boolean {
		return this.skill.skillType == ESkillType.ESkillTypeNormal;
	}

	/**获取冷却事件，单位毫秒 */
	public get colldown(): number {
		if (this.skill && this.skill.cooldownTime) {
			return this.skill.cooldownTime;
		}
		return 0;
	}

	/**获取cd组 */
	public get cdGroup(): number {
		return this.skill.groupCdGroup;
	}

	/**获取组cd */
	public get cdGroupTime(): number {
		return this.skill.groupCdTime;
	}

	/**
     * 技能id
     */
    public get skillId(): number {
        if (this.skill) {
            return this.skill.skillId;
        }
        return 0;
    }

    /**
     * 技能图标
     */
    public get skillIcon(): string {
        if (this.skill) {
            return this.skill.skillIcon;
        }
        return "";
    }

    /**
     * 技能等级
     */
    public set level(value:number) {
    	if (this._level != value) {
            this._level = value;
		}
		if (!this.skillUpgrade || this.skillUpgrade.skillLevel != value) {
			this.skillUpgrade = ConfigManager.skill.getSkillUpgrade(this.skillId, value+1);
			this._isMaxLevel = !this.skillUpgrade;
		}
    }

    /**
     * 技能等级
     */
    public get level(): number {
        return this._level;
    }

	/**
	 * 使用类型
	 */
	public get useType(): number {
		if (this.skill && this.skill.useType != null) {
			return this.skill.useType;
		}
		return 0;
	}

	public get roleCareer():number{
		let roleCareer:number = 0;
		if (this.skill && this.skill.roleCareer != null) {
			return this.skill.roleCareer;
		}
		return roleCareer;
	}

	public set posType(postType: number) {
		this._posType = postType;
	}

	public get posType(): number {
		if (this._posType != -1) {
			return this._posType;
		}
		if (this.skill != null) {
			return this.skill.posType;
		}
		return -1;
	}

	public get attackDistance(): number {
		return this.skill.attackDistance || 0;
	}

	public get targetType(): number {
		return this.skill.targetType;
	}

	public get isMaxLevel(): boolean {
		return this._isMaxLevel;
	}

    public get roleIndex(): number {
        return this._roleIndex;
    }

    /** 是否单体技能*/
    public get isGoalSingle(): boolean {
        return this.skill.goalNum == 1;
    }

	/**
	 * 给己方全体加buff的id
	 */
	public get selfState(): number {
		if(this.skill.selfState != null) {
			return this.skill.selfState;
		}
		return 0;
	}

	public get additionState(): number {
		if(this.skill.additionState != null) {
			return this.skill.additionState;
		}
		return 0;
	}

	public get warfare(): number {
		if(this.skill.warfare != null) {
			return this.skill.warfare;
		}
		return 0;
	}

}