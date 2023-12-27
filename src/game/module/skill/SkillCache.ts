class SkillCache implements ICache {

	/**
	 * 普攻技能cd
	 */
	public static SKILL_CD_NORMAL: number = 200;
	/**
	 * XP技能
	 */
	public static SKILLID_XP: number = 9999;
	/**
	 * 冲锋技能
	 */
	public static SKILLID_CHARGE: number = 1004;
	/**
	 * 所有已学技能，键为技能id{roleIndex-{id:skill}}
	 */
	public skills: any = {};
	/**
	 * 所有已学技能列表[roleIndex-[s1,s2]]
	 */
	public skillList: SkillData[][] = [];
	/**
	 * 配置技能列表[baseCareer-[s1,s2]]
	 */
	public careerSkills: any[][] = [];
	/**
	 * 配置技能动作列表[roleIndex-[a1,a2]]
	 */
	public careerSkillActions: any[][] = [];
	/**
	 * 战斗技能列表[baseCareer-[s1,s2]]
	 */
	public battleSkills: any[][] = [];

	public xpSkillData: SkillData;

	/**开启必杀后 需要播放动画(播放完动画才真正显示必杀按钮) */
	public isXpSkillOpened:boolean = false;

	/**
	 * 菜单栏技能位置
	 */
	private _menuSkillPosDict: any = {};

	/**
	 * 技能cd字典
	 */
	private cdDict: any = {};

	/**
	 * 技能gcd字典
	 */
	private gcdDict: any = {};

	private _totalLevel:number = 0;

	public constructor() {
	}

	/**
	 * 设置已学技能信息
	 * updateType_I 0 初始化， 1增加
	 */
	public set skillMsg(skillMsg: any) {		
		let updateType: number = skillMsg.updateType_I;
		let roleIndex: number = skillMsg.index_I;
		let serTime: number = CacheManager.serverTime.getServerTime();
		let nowTime: number = egret.getTimer();
		if (!this.skills[roleIndex])
			this.skills[roleIndex] = {};
		for (let sskill of skillMsg.skills.data) {
			let skillId: number = sskill.code_I;
			sskill.index_I = roleIndex;
			let skillData: SkillData = new SkillData(sskill);
			skillData.roleIndex = roleIndex;
			this.skills[roleIndex][skillId] = skillData;
			// if (!this.skills[skillId]) {
			//    this.skillList[0].push(skillData);
			// }
			if (skillId == SkillCache.SKILLID_XP) {
				this.xpSkillData = skillData;
				this.isXpSkillOpened = updateType == 0; 		
			}

			if (updateType == 0) {//初始化的时候才设置cd
				let cd: number = sskill.cdDt_DT - serTime;
				this.cdDict[skillId] = cd > 0 ? nowTime + cd * 1000: nowTime;//已使用技能cd
			} else if (updateType == ESkillOp.ESkillOpAdd || updateType == ESkillOp.ESkillOpUpgrade) {//新增或升级技能
				EventManager.dispatch(NetEventEnum.roleSkillUpdated, skillData);
				if (updateType == ESkillOp.ESkillOpAdd)
					EventManager.dispatch(NetEventEnum.roleSkillAdded, skillData);
			}

		}		
		this._totalLevel = 0; //刷新技能数据需要重新计算总等级;必须在 NetEventEnum.roleSkillInfo 之前执行
		EventManager.dispatch(NetEventEnum.roleSkillInfo);	
        this.updateBattleSkills(roleIndex);
	}

	/**获取所有角色的所有技能总等级 */
	public getTotalSkillLevel():number{
		if(this._totalLevel==0){ //等于0 重新计算
			let total:number = 0;
			for(let key in this.skills){
				let roleSkill:any = this.skills[key];
				for(let key1 in roleSkill){
					let roleCareer:number = roleSkill[key1].roleCareer;
					if(roleSkill[key1].isActiveSkill() && 
					(roleCareer==ECareer.ECareerWarrior || roleCareer==ECareer.ECareerArcher || roleCareer==ECareer.ECareerFireMage )){											
						total+=roleSkill[key1].level;
					}					
				}
			}
			this._totalLevel = total;
		}
		return this._totalLevel;
	}

	/**
	 * 根据基础职业获取主动技能
	 */
	public getActiveSkills(roleIndex: number): Array<any> {
		let baseCareer: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(roleIndex));
		if (this.careerSkills[baseCareer]) {
			return this.careerSkills[baseCareer];
		}
		let configSkills: Array<any> = ConfigManager.skill.getActiveSkillsByCareer(baseCareer);
		configSkills.sort((a: any, b: any) => { return a.posType - b.posType });
		this.careerSkills[baseCareer] = configSkills;
		return configSkills;
	}

	/**
	 * 获取被动技能。
	 * 同一类技能只能有一个，选已学的最高等级的
	 */
	public getPassiveSkills(): Array<any> {
		let skills: Array<any> = [];
		let skillMap: any = {};
		let configSkills: Array<any> = ConfigManager.skill.getPassiveSkillsByCareer(CacheManager.role.getRoleCareer());
		for (let cs of configSkills) {
			let skillId: number = cs.skillId;
			//这类技能有多个，都没学取id最小的，都已学取已学id大的
			let skillKind: number = cs.skillKind;
			if (skillKind != null && skillKind > 0) {
				if (this.isLearnedSkill(cs.skillId)) {
					if (skillMap[skillKind] == null) {
						skillMap[skillKind] = cs;
					} else {
						if (cs.skillId > skillMap[skillKind].skillId) {
							skillMap[skillKind] = cs;
						}
					}
				} else {
					if (skillMap[skillKind] == null) {
						skillMap[skillKind] = cs;
					} else {
						if (cs.skillId < skillMap[skillKind].skillId) {
							skillMap[skillKind] = cs;
						}
					}
				}
			} else {
				skillMap[skillId] = cs;
			}
		}
		for (let id in skillMap) {
			skills.push(skillMap[id]);
		}
		skills.sort((a: any, b: any) => { return a.posType - b.posType });
		return skills;
	}

	private updateBattleSkills(roleIndex:number):void {
		if (!this.battleSkills[roleIndex])
			this.battleSkills[roleIndex] = [];
        let skills: Array<SkillData> = this.battleSkills[roleIndex];
        let roleSkills: any = this.skills[roleIndex];
        for (let skillId in roleSkills) {
            let skillData: SkillData = roleSkills[skillId];
            if (skills.indexOf(skillData) == -1 && skillData.isActiveSkill()) {
                skills.push(skillData);
            }
        }
        skills.sort((s1:SkillData, s2:SkillData)=>{
            return s2.posType - s1.posType;//主动技能中位置从大到小
        });
	}
	/**
	 * 获取主动战斗技能(已排好序
	 */
	public getBattleSkills(roleIndex: number): Array<SkillData> {
		return this.battleSkills[roleIndex];
	}

	/**
	 * 是否已学习技能
	 */
	public isLearnedSkill(skillId: number): boolean {
		for (let i: number = 0; i < 3; i++)
			if (this.skills[i] != null && this.skills[i][skillId] != null) return true;
		return false;
	}

	public get menuSkillPosDict(): any {
		return CacheManager.sysSet.getValue(SysSetCache.KeyMenuSkillPosDict);
	}

	/**
	 * 获取技能在菜单栏的位置
	 * @returns -1未保存，使用默认配置
	 */
	public getMenuSkillPos(skillId: number): number {
		let menuSkillPosDict: any = this.menuSkillPosDict;
		if (menuSkillPosDict != null && menuSkillPosDict[skillId] != null) {
			return menuSkillPosDict[skillId];
		}
		return -1;
	}

	public getSkill(skillId: number, roleIndex: number = -1): SkillData {
		if (roleIndex > 0) {
			if (this.skills[roleIndex] != null) {
				return this.skills[roleIndex][skillId];
			}
			return null;
		} else {//有些是不需要各个职业独立的，所以不需要传索引
			let skill: SkillData;
			for (let i: number = 0; i < 3; i++) {
				if (this.skills[i]) {
					skill = this.skills[i][skillId];
				}
				if (skill != null) return skill;
			}
			return null;
		}
	}

    public getRoleIndexBySkill(skillId: number): number {
        for (let i: number = 0; i < 3; i++) {
            if (this.skills[i]) {
                if (this.skills[i][skillId]) return i;
            }
        }
        return -1;
    }

    public getRoleSkillActions(roleIndex:number):number[] {
		if (roleIndex < 0) return [];
		if (this.careerSkillActions[roleIndex]) {
			return this.careerSkillActions[roleIndex];
		}
		let activeSkills:any[] = this.getActiveSkills(roleIndex);
		let skillActions:number[] = [];
		if (activeSkills) {
			for (let skill of activeSkills) {
				if (skill.skillAction) skillActions.push(skill.skillAction);
                else skillActions.push(1,2,3,4);//0代表1-4号动作
			}
		}
        this.careerSkillActions[roleIndex] = skillActions;
		return this.careerSkillActions[roleIndex];
	}

	//============技能CD===============
    /**
	 * 发送技能时提前cd
     * @param {number} skillId
     */
	public preCoolSkill(skillId: number): void {
		let vo: SkillData = this.getSkill(skillId);
		if (vo) {
			let now: number = egret.getTimer();
			this.cdDict[skillId] = now + (vo.colldown > 0 ? vo.colldown : SkillCache.SKILL_CD_NORMAL) + 500;
		}
	}

	public coolSkill(skillId: number, hasGoTime: number = 0): void {
		let vo: SkillData = this.getSkill(skillId);
		if (vo) {//console.log("coolSkill:", skillId, CacheManager.serverTime.getServerMTime() + (vo.colldown > 0 ? vo.colldown : SkillCache.SKILL_CD_NORMAL))
			if (skillId == SkillCache.SKILLID_XP) return;//XP技能走coolSkillInTime
			let now: number = egret.getTimer();
			if (!this.gcdDict[vo.cdGroup] || this.gcdDict[vo.cdGroup] <= now) {
				this.gcdDict[vo.cdGroup] = now + vo.cdGroupTime;
			}
            let cd: number = vo.colldown > 0 ? vo.colldown : SkillCache.SKILL_CD_NORMAL;
			// if (this.cdDict[skillId] <= now) {//覆盖preCool的cd时间
				this.cdDict[skillId] = now + cd;//console.log("coolSkill:", skillId, egret.getTimer(), vo.colldown, this.cdDict[skillId]);
			// }
            if (this.getRoleIndexBySkill(skillId) == CacheManager.king.leaderIndex)
                EventManager.dispatch(LocalEventEnum.CoolSkill, skillId, cd);//只有主控制角色才需要展示技能cd
		}
	}

	public coolSkillInTime(skillId: number, timeStamp: number): void {
		let vo: SkillData = this.getSkill(skillId);
		if (vo) {
			let cd: number = timeStamp - CacheManager.serverTime.getServerMTime();
			let now: number = egret.getTimer();
			this.cdDict[skillId] = now + cd;//console.log("coolSkillInTime_skillId:" + skillId, "cd:" + vo.colldown, timeStamp, CacheManager.serverTime.getServerMTime(), cd, this.cdDict[skillId]);
			if (this.getRoleIndexBySkill(skillId) == CacheManager.king.leaderIndex)
				EventManager.dispatch(LocalEventEnum.CoolSkill, skillId, cd);//只有主控制角色才需要展示技能cd
		}
	}

	public canSkillCd(skillId: number): boolean {
		let vo: SkillData = this.getSkill(skillId);
		let now: number = egret.getTimer(); Log.trace(Log.FIGHT, "canSkillCd:", skillId, vo && vo.colldown, now, this.cdDict[skillId])
		return vo && (!this.cdDict[skillId] || this.cdDict[skillId] <= now) && (!this.gcdDict[vo.cdGroup] || this.gcdDict[vo.cdGroup] <= now);
	}

	public getCd(skillId): number {
		if (this.cdDict[skillId] == null) {
			if (!this.getSkill(skillId))
				return -1;
			return 0;
		}
		return this.cdDict[skillId];
	}

    /**
	 * 检查技能可升级小红点
	 * roleIndex -1:全部角色
     * @returns {boolean}
     */
	public checkTips(roleIndex: number = -1): boolean {
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SkillRedTipStart, false)){//完成此任务之后才能显示技能红点
			return false;
		}
		let skillDic: any;
		let skill: SkillData;
		let upgradeData: any;
		let needCoin: number;

		let myCoin: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitCoinBind);
		let myLv: number = CacheManager.role.getRoleLevel();
		let myRoleState: number = CacheManager.role.getRoleState();

		let ret: boolean;
		if (roleIndex == -1) {
			for (let i = 0; i < 3; i++) {
				skillDic = this.skills[i];
				if (ret) break;
				if (!ret && skillDic) {
					ret = check(skillDic);
				}
			}
		} else {
			skillDic = this.skills[roleIndex];
			ret = skillDic && check(skillDic);
		}
		return ret;

		function check(skillDic): boolean {
			for (let skillId in skillDic) { 
				skill = skillDic[skillId];
				needCoin = 0;
				let addLevel: number;
				for(addLevel = 0; addLevel < 5; addLevel++){
					upgradeData = ConfigManager.skill.getSkillUpgrade(Number(skillId), skill.level + addLevel + 1);
					if (upgradeData && (upgradeData.playerLevel < 10000 && upgradeData.skillLevel <= myLv 
						|| upgradeData.playerLevel / 10000 <= myRoleState)) {
						needCoin += upgradeData.needCoin;
						continue;
					}
					break;
				}
				//40级之前可升5级才有红点，40级之前可升5级或者升到满级有红点
				if((myLv <= 40 && addLevel >= 5 || myLv > 40) && needCoin != 0 && needCoin <= myCoin){
					return true;
				}
			}
			return false;
		}
	}

	public checkAllTips(): boolean {
		let flag: boolean = this.checkTips();
		if (!flag){
			flag = StrengthenExUtil.checkCanStrengthen(EStrengthenExType.EStrengthenExTypeNerve);
		}
		if(!flag){
			flag = StrengthenExUtil.checkStrengthenExCanActive(EStrengthenExType.EStrengthenExTypeInternalForce) || StrengthenExUtil.checkCanStrengthen(EStrengthenExType.EStrengthenExTypeInternalForce);
		}		
		if(!flag){
			flag = CacheManager.cheats.checkTips();
		}
		if(!flag){
			flag = CacheManager.godWeapon.checkTips();
		}

		return flag;
	}

	public clear(): void {

	}
}