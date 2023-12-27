class BattleCache implements ICache{
    public attackNumbers:any = {"1":[1,2,3,4],"2":[5,6],"4":[5,6]};
    public battle_config: any;
    public targetBossCode:number = -1;
    public subAutoFightCtrl:IAutoFight;
    private revivalWaitTime: number;
    private revivalWaitFlag: boolean;
    public skillRule: EBattleSkillRule = 0;

    private _isNearAttack:boolean = false;
    public canRushTime: number = 0;
    public nextAttack:boolean = false;//下个动作是攻击
    //是否就近攻击
	public constructor() {
		this.battle_config = ConfigManager.battle;
	}

	/**
	 * 挂机范围
	 */
	public get autoBattleSearchDis():number{
		return Number(this.battle_config.AutoBattleSearchDis);
	}

    public getFollowStartRadius(baseCareer: number):number {
        return this.battle_config['Career' + baseCareer + 'FollowStartRadius'];
    }

    public getFollowEndRadius(baseCareer: number):number {
        return this.battle_config['Career' + baseCareer + 'FollowEndRadius'];
    }

    public getSkillSoundCount(skillId: number):number {
		let count:number = this.battle_config['SkillSound'][skillId];
        return count;
    }

    public getCopyStayTime(ct: ECopyType):number {
		let time:number = this.battle_config['CopyStayTime'][ct];
        return time;
    }

    public getSkillRule1Radius(baseCareer: number):number {
        return this.battle_config['Career' + baseCareer + 'SkillRule1Radius'];
    }

    public getCareerActions(baseCareer: number):number[] {
	    let idx:number = CareerUtil.CareerAll.indexOf(baseCareer);
        return this.battle_config['attack_actions'][idx];
    }

	public clear():void{
		
	}

	public setRevivalWait(value:boolean):void {
		this.revivalWaitFlag = value;
	}

    public revivalWait(waitTime: number) {
		if (this.revivalWaitFlag) {
			this.revivalWaitTime = egret.getTimer() + waitTime;
			this.revivalWaitFlag = false;
        }
    }

    public getRevivalWaitTime():number {
		return this.revivalWaitTime;
    }

    /**
	 * 是否匹配职业动作
     * @param {number} career
     * @param {number} attackNO
     * @returns {boolean}
     */
    public hasCareerAttackNumber(career: number, attackNO: number):boolean {
        if(!this.attackNumbers[career]) return false;
		return this.attackNumbers[career].indexOf(attackNO) != -1;
    }

    /**
     * 副本中死亡是否需要停止挂机
     */
    public deadStopAI():boolean {
        return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMiningChallenge)
			|| CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossIntruder)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyQualifying)
    }

    public set isNearAttack(value:boolean) {
        if(this._isNearAttack == value) return;
        this._isNearAttack = value;
        EventManager.dispatch(LocalEventEnum.NearAttackSwitch);
        if(!CacheManager.king.isAutoFighting && this._isNearAttack) {
			EventManager.dispatch(LocalEventEnum.AutoStartFight);
		}
    }

    public get isNearAttack():boolean {
        return this._isNearAttack;
    }

    public resetRushTime() {
        this.canRushTime = egret.getTimer() + this.battle_config.EnterMapRushDelay;
    }
}

enum EBattleSkillRule {
    NORMAL = 0,
    RULE1
}