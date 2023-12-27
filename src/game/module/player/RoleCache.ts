class RoleCache implements ICache {
	/**是否为新创建的角色 */
	public isNewCreateRole: boolean = false;
	/**服务器时间 */
	public sysDt: any;
	/**玩家坐标SPos */
	public pos: any;
	/**SPlayer */
	public player: any = {};
	/**SRole */
	public role: any = {};
	/**已经开启的角色列表 [SRealRole] */
	public roles: Array<any>;
	/**金钱SMoney */
	public money: any = {};

	/**战斗基础属性更新 SFightAttribute*/
	public fightAttrBase: any = {};
	/**基础附加战斗属性 SFightAttribute*/
	public fightAttrAdd: any = {};
	/**战斗最终属性更新 SFightAttribute*/
	public fightAttr: any = {};
	/**战斗不漂字属性更新 SFightAttribute*/
	public fightAttrNotShow: any = {};
	/**战斗力 */
	public combatCapabilities: number = 0;

	public attackDistance: number;
	public attackSpeed: number;
	public roleExpAdd: number;

	/**技能列表SSkillMsg, SeqSkill*/
	public skillList: any = {};

	/**是否掉落归属 */
	public isDropOwner: boolean = false;
	/**
	 * 是否显示属性时装、武器等
	 */
	// public showAttrDict: any = {};

	/**角色三转时的等级 */
	public playerLevelWhen3State: number = 0;
	/**当前世界等级 */
	public worldLevel: number;
	/**是否为再次登录 */
	public isLoginBack: boolean;

	/**角色实体信息,SEntityInfo */
	// private _entityInfo: EntityInfo = new EntityInfo();
	// private _entityInfoII:EntityInfo = new EntityInfo();
	// private _entityInfoIII:EntityInfo = new EntityInfo();

	private _entityInfos: { [index: number]: EntityInfo } = {};
	private isTestOpenNewRole: boolean = true;
	/**三个角色的基础战斗属性 [index]=SFightAttribute */
	private _roleFightAttrBaseDict: any;
	/**三个角色的附加战斗属性 [index]=SFightAttribute */
	private _roleFightAttrAddDict: any;
	/**三个角色战斗属性[index]=SFightAttribute */
	private _roleFightAttrDict: any;
	/**分角色强化信息字典，键为角色序号，值为字典(键为强化类型，值为SStrengthenExInfo) */
	private _roleStrengthenExDict: any = {};
	/**不分角色强化信息字典，键为强化类型SStrengthenExInfo */
	private _strengthenExDict: any = {};
	/**各个角色的战力 */
	private _roleCombatDict: any;
	private _dressPosArr: number[];

	private _checkPointShow: boolean = false;
	public constructor() {
		this.roles = [];
		this._roleFightAttrBaseDict = {};
		this._roleFightAttrAddDict = {};
		this._roleFightAttrDict = {};
		this._roleCombatDict = {};
		this._dressPosArr = [EDressPos.EDressPosGloves,
		EDressPos.EDressPosClothes, EDressPos.EDressPosBelt,
		EDressPos.EDressPosShoulder, EDressPos.EDressPosShoes,
		EDressPos.EDressPosWeapon, EDressPos.EDressPosJewelry,
		EDressPos.EDressPosWristlet, EDressPos.EDressPosHelmet, EDressPos.EDressPosRing, EDressPos.EDressPosHeartLock];

	}

	/**
	 * 登录游戏推送的信息
	 */
	public set sLoginGame(loginGame: any) {
		if (loginGame != null) {
			this.sysDt = loginGame.sysDt;
			
			this.pos = { "0" :{posX_I:loginGame.pos.x_I,posY_I:loginGame.pos.y_I,index_I:0}};
			this.player = loginGame.player;
			for (let i: number = 0; i < 3; i++) {
				this.getEntityInfo(i).entityId = { roleIndex_BY: i, id_I: this.player.playerId_I, type_BY: EEntityType.EEntityTypePlayer, typeEx_SH: this.player.serverId_I, typeEx2_BY: this.player.proxyId_I };
			}
			// this._entityInfo.entityId = { roleIndex_BY:0,id_I:this.player.playerId_I, type_BY:EEntityType.EEntityTypePlayer, typeEx_SH:this.player.serverId_I, typeEx2_BY:this.player.proxyId_I};
			// this._entityInfoII.entityId = { id_I:this.player.playerId_I + 100000000, type_BY:EEntityType.EEntityTypePlayer, typeEx_SH:this.player.serverId_I, typeEx2_BY:this.player.proxyId_I};
			// this._entityInfoIII.entityId = { id_I:this.player.playerId_I + 200000000, type_BY:EEntityType.EEntityTypePlayer, typeEx_SH:this.player.serverId_I, typeEx2_BY:this.player.proxyId_I};
			this.money = loginGame.money;
			CacheManager.serverTime.startClock(this.sysDt);

			this.roles = loginGame.realRoles.data;//已经开启的角色列表
			this.roles[0] = loginGame.role;
			this.role = this.roles[0];
		}
	}
	public checkEquipTips(): boolean {
		let flag: boolean = false;
		for (let i: number = 0; i < 3; i++) {
			if (this.getSRole(i)) {
				flag = CacheManager.role.isHasEquipTip(i);
				if (flag) {
					break;
				}
			}

		}
		return flag;
	}
	/**
	 * 是否有可穿戴的更高装备
	 */
	public isHasEquipTip(roleIndex: number): boolean {
		let flag: boolean = false;
		for (let pos of this._dressPosArr) {
			//对应位置是否特殊装备
			let b: boolean = false;
			if (!WeaponUtil.isCanReplacePos(Number(pos))) { //不可更换的装备
				//该位置没有装备才判断红点 已有的装备不能更换 不可能有红点
				let dressItem: ItemData = CacheManager.pack.rolePackCache.getDressEquipByPos(Number(pos), roleIndex);
				if (!dressItem) {
					b = CacheManager.pack.backPackCache.isHasBestScoreEquipByPos(Number(pos), roleIndex);
				}else{
					let cfg: any = ConfigManager.mgEquipUpgrade.getByPk(dressItem.getCode());
					if(cfg != null){
						let count: number = CacheManager.pack.backPackCache.getItemCountByCode2(cfg.useItemCode);
						b = count >= cfg.useItemNum;
					}
				}
			} else {
				b = CacheManager.pack.backPackCache.isHasBestScoreEquipByPos(Number(pos), roleIndex);
			}
			if (b) {
				flag = b;
				break;
			}
		}
		return flag;

	}

	/**
	 * 获取角色下标（-1表示该职业没有创建）
	 */
	public getRoleIndex(career: number): number {
		for (let i = 0; i < this.roles.length; i++) {
			if (CareerUtil.getBaseCareer(this.roles[i].career_I) == CareerUtil.getBaseCareer(career)) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 获取角色信息
	 */
	public getSRole(index: number): any {
		if (index > this.roles.length - 1) {
			return null;
		}
		return this.roles[index];
	}

	/**
	 * 角色是否已开启
	 * @param index 从0开始
	 */
	public isOpenedRole(index: number): boolean {
		return this.getSRole(index) != null;
	}

	//是否有角色可开启
	public checkCanOpenRole(): boolean {
		return ConfigManager.mgOpenNewRoleCond.isCanCreateRole();
	}

	/**
	 * 是否可以开第x个角色
	 * @param index 角色序号。从0开始
	 */
	public isCanOpenRoleByIndex(index: number): boolean {
		if (index == 1) {
			if (this.isOpenedRole(1)) {
				return false;
			}
			return ConfigManager.mgOpenNewRoleCond.isCanCreateRole();
		} else {
			if (!this.isOpenedRole(1) || this.isOpenedRole(2)) {
				return false;
			} else {
				return ConfigManager.mgOpenNewRoleCond.isCanCreateRole();
			}
		}
	}

	/**
	 * 是否有可以开第开启的角色
	 */
	public isHasCanOpenRole(): boolean {
		for (let index of RoleIndexEnum.RoleIndexAll) {
			if (this.isCanOpenRoleByIndex(index)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否开启了指定职业
	 */
	public isOpenedCareer(career: number): boolean {
		for (let role of this.roles) {
			if (CareerUtil.getBaseCareer(role.career_I) == career) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 是否开启全部角色
	 */
	public isRoleFull(): boolean {
		return this.roles.length == 3;
	}

	/**
	 * 获取主控制角色索引（不随死亡状态变化）
	 */
	public getMainIndex(): number {
		let indexMap: { [career: number]: number } = {};
		for (let role of this.roles) {
			let career: number = CareerUtil.getBaseCareer(role.career_I);
			indexMap[career] = !role.index_I ? 0 : role.index_I;
		}
		if (indexMap[CareerEnum.CareerWarrior] >= 0) {
			return indexMap[CareerEnum.CareerWarrior];
		}
		if (indexMap[CareerEnum.CareerWizard] >= 0) {
			return indexMap[CareerEnum.CareerWizard];
		}
		if (indexMap[CareerEnum.CareerTaoist] >= 0) {
			return indexMap[CareerEnum.CareerTaoist];
		}
		return -1;
	}

	/**
	 * 根据角色索引获取实体数据
	 */
	public getEntityInfo(index: number): EntityInfo {
		if (index > 2 || index < 0) return null;
		let info: EntityInfo = this._entityInfos[index];
		if (!info) {
			info = new EntityInfo();
			this._entityInfos[index] = info;
		}
		return info;
	}

	/** 玩家自己的实体信息，结构：message SEntityInfo */
	public get entityInfo(): EntityInfo {
		return this.getEntityInfo(0);
	}
	/**
	 * 是否所有角色都已经死亡
	 */
	public isRoleAllDie(): boolean {
		let flag: boolean = true;
		for (let i: number = 0; i < this.roles.length; i++) {
			let r: any = this.roles[i];
			let idx: number = r.index_I ? r.index_I : i;
			let info: EntityInfo = this.getEntityInfo(idx);
			if (info && info.life_L64 > 0) {
				flag = false;
				break;
			}

		}
		return flag;
	}

	// public get entityInfoII(): EntityInfo {
	// 	return this._entityInfoII;
	// }

	// public get entityInfoIII(): EntityInfo {
	// 	return this._entityInfoIII;
	// }

	/**
	 * 获取角色等级
	 */
	public getRoleLevel(): number {
		return this.role.level_I;
	}
	/**
	 * 判断是否满足等级
	 */
	public checkLevel(level: number): boolean {
		return this.getRoleLevel() >= level;
	}
	/**
	 * 判断是否满足转生
	 */
	public checkState(state: number): boolean {
		return this.getRoleState() >= state;
	}

	/**
	 * 获取角色职业(包含装职信息)
	 */
	public getRoleCareer(): number {
		return this.role.career_I;
	}

	public getLevelName(): string {
		let name: string = HtmlUtil.html(`${this.getRoleLevel()}级`, Color.BASIC_COLOR_8);
		let rebirthTimes: number = CareerUtil.getRebirthTimes(this.getRoleCareer());
		if (rebirthTimes > 0) {
			name = HtmlUtil.html(`${rebirthTimes}转`, Color.Color_5) + name;
		}
		return name;
	}

	/***
	 * 根据角色下标获取基础职业(只能获得基础职业)
	 */
	public getRoleCareerByIndex(index: number, isBase: boolean = false): number {
		let career: number = this.role.career_I;
		if (index < this.roles.length) {
			career = this.roles[index].career_I;
		}
		return isBase ? CareerUtil.getBaseCareer(career) : career;
	}

    /**
	 * 返回基础职业
     */
	public getBaseCareer(): number {
		return CareerUtil.getBaseCareer(this.getRoleCareer());
	}

    /**
	 * 当前处于第几阶段
     */
	public getRoleSubState(): number {
		return this.role.roleSubState_I + 1;
	}

	/**
	 * 获取这个职业多少转
	 */
	public getRoleState(): number {
		if (this.getRoleCareer()) {
			return Math.floor(this.getRoleCareer() / 1000);
		}
		return 0;
	}

	/**
	 * 获取玩家id
	 */
	public getPlayerId(): number {
		return this.player.playerId_I;
	}

	/**
	 * 获取玩家实体id SEntityId
	 */
	public getSEntityId(): any {
		let entityInfo: EntityInfo = this.getEntityInfo(0);
		if (!entityInfo.entityId) {
			entityInfo.entityId = { roleIndex_BY: 0, id_I: this.player.playerId_I, type_BY: EEntityType.EEntityTypePlayer, typeEx_SH: this.player.serverId_I, typeEx2_BY: this.player.proxyId_I };
		}
		return entityInfo.entityId;
	}

	public get roleFightAttrDict(): any {
		return this._roleFightAttrDict;
	}

	public getRoleFightAttr(index: number): any {
		return this._roleFightAttrDict[index];
	}
	public setRoleFightAttr(data: any): void {
		this._roleFightAttrDict[data.index_I] = data;
	}
	/**三个角色的基础战斗属性 */
	public get roleFightAttrBaseDict(): any {
		return this._roleFightAttrBaseDict;
	}

	/**
	 * 获取角色的基础战斗属性
	 */
	public getRoleFightBaseAttr(index: number): any {
		return this._roleFightAttrBaseDict[index];
	}

	public setRoleFightbasettr(data: any): void {
		this._roleFightAttrBaseDict[data.index_I] = data;
	}

	public setRoleFightAddAttr(data: any): void {
		this._roleFightAttrAddDict[data.index_I] = data;
	}

	public getRoleFightAddAttr(index: number): any {
		return this._roleFightAttrAddDict[index];
	}

	public updateLevel(value: number): void {
		this.entityInfo.level_SH = value;
		this.role.level_I = value;
	}

	public updateLife(value: number, roleIndex: number): void {
		let entity: any = this.getEntityInfo(roleIndex);
		entity ? entity.life_L64 = value : null;
		let srole: any = this.getSRole(roleIndex);
		srole ? srole.life_L64 = value : null;
		// this.entityInfo.life_L64 = value;
		// this.role.life_L64 = value;
	}

	/**
	 * 获取玩家总生命值
	 */
	public getLife(): number {
		let life: number = 0;
		let entityInfo: EntityInfo;
		for (let i: number = 0; i < 3; i++) {
			entityInfo = this.getEntityInfo(i);
			if (entityInfo.life_L64) {
				life += entityInfo.life_L64;
			}
		}
		return life;
	}

	/**
	 * 获取玩家总最大生命值
	 */
	public getMaxLife(): number {
		let life: number = 0;
		let entityInfo: EntityInfo;
		for (let i: number = 0; i < 3; i++) {
			entityInfo = this.getEntityInfo(i);
			if (entityInfo.maxLife_L64) {
				life += entityInfo.maxLife_L64;
			}
		}
		return life;
	}

	public updateCareer(value: number): void {
		this.entityInfo.career_SH = value;
		this.role.career_I = value;
	}

	/**
	 * 更新势力
	 */
	public updateForce(force: number): void {
		for (let i: number = 0; i < 3; i++) {
			this.getEntityInfo(i).force_BY = force;
		}
		EventManager.dispatch(NetEventEnum.RoleForceUpdate);
	}

    /**
     * 更新跨服boss采集次数
     */
	public updateCollectTimes(value: number): void {
		this.role.collectTimes_BY = value;
	}

    /**
     * 更新跨服boss归属次数
     */
	public updateBossTimes(value: number): void {
		this.role.bossTimes_BY = value;
	}

	/**
	 * 更新穹苍阁剩余归属次数
	 */
	public updateQiongCangBossOwnerTimes(value: number): void {
		this.role.qiongCangOwnerTimes_BY = value;
		EventManager.dispatch(NetEventEnum.QiongCangBossOwnerTimesUpdate);
	}

	/**
	 * 跨服boss协助次数更新
	 */
	public updateCrossBossAssistTimes(value:number):void {
		this.role.coTimes_BY = value;
	}

	/**
	 * 穹苍boss副本协助次数更新
	 */
	public updateQiongcangAssistTimes(value:number):void {
		this.role.qiongCangCoTimes_BY = value;
	}

	public isLevelMatch(level: number): boolean {
		return this.role.level_I >= level;
	}

	public getModelId(type: EEntityAttribute, roleIndex: number): any {
		var entityInfo: EntityInfo = this.getEntityInfo(roleIndex);
		return entityInfo.getModelId(type);
	}

	public getMoney(unit: EPriceUnit): number {
		let money: number = 0;
		switch (unit) {
			case EPriceUnit.EPriceUnitGold:
				money = this.money.gold_I;
				break;
			case EPriceUnit.EPriceUnitGoldBind:
				money = this.money.goldBind_I;
				break;
			case EPriceUnit.EPriceUnitCoinBind:
				money = this.money.coinBind_L64;
				break;
			case EPriceUnit.EPriceUnitRuneExp:
				money = this.money.runeExp_I;
				break;
			case EPriceUnit.EPriceUnitRuneCoin:
				money = this.money.runeCoin_I;
				break;
			case EPriceUnit.EPriceUnitHonour:
				money = this.money.honour_I;
				break;
			case EPriceUnit.EPriceUnitKillFragmentJunior:
				money = this.money.killFragmentJunior_I;
				break;
			case EPriceUnit.EPriceUnitKillFragmentSenior:
				money = this.money.killFragmentSenior_I;
				break;
			case EPriceUnit.EPriceUnitTrainScore:
				money = this.money.trainScore_I ? this.money.trainScore_I : 0;
				break;
			case EPriceUnit.EPriceUnitIllustratedExp:
				money = this.money.illustratedExp_I;
				break;
			case EPriceUnit.EPriceUnitTalentExp:
				money = this.money.talentExp_I;
				break;
			case EPriceUnit.EPriceUnitJeton:
				money = this.money.jeton_I;
				break;
			case EPriceUnit.EPriceUnitBeastEquipExp:
				money = this.money.beastEquipExp_I;
				break;
			case EPriceUnit.EPriceUnitFightingSpirit:
				money = this.money.fightingSpirit_I;
				break;
		}
		return money;
	}
	public setMoney(unit: EPriceUnit, value: number): void {
		switch (unit) {
			case EPriceUnit.EPriceUnitTrainScore:
				this.money.trainScore_I = value;
				break;
			case EPriceUnit.EPriceUnitIllustratedExp:
				this.money.illustratedExp_I = value;
				break;
		}
	}
	/**
	 * 是否为自己
	 */
	public isMyself(sEntityId: any): boolean {
		return sEntityId != -1 && EntityUtil.isSame(this.entityInfo.entityId, sEntityId);
	}


	public getFightAttr(type: EJewel): number {
		switch (type) {
			case EJewel.EJewelPhysicalAttack:
				return Number(this.fightAttr.physicalAttack_L64) + Number(this.fightAttr.magicAttack_I);
			case EJewel.EJewelLife:
				return Number(this.fightAttr.maxLife_L64);
			case EJewel.EJewelPass:
				return this.fightAttr.pass_I;
			case EJewel.EJewelPhysicalDefense:
				return this.fightAttr.physicalDefense_I;
			case EJewel.EJewelJouk:
				return this.fightAttr.jouk_I;
			case EJewel.EJewelHit:
				return this.fightAttr.hit_I;
			case EJewel.EJewelWuxingAttack:
				return this.fightAttr.wuxingAttack_I;
			case EJewel.EJewelWuxingDefense:
				return this.fightAttr.wuxingDefense_I;
		}
		return 0;
	}


	/**
	 * 获取基础属性字典
	 * 包括相应等级基础属性+所有装备基础属性+玩家转职升级属性
	 */
	public getBasicAttributeDict(): any {
		let attrDict: any = {};
		attrDict = ConfigManager.exp.getAttrDict(this.getRoleLevel());
		let equips: Array<ItemData> = CacheManager.pack.rolePackCache.getTrueItems();
		let equipAttrDict: any;
		for (let itemData of equips) {
			equipAttrDict = WeaponUtil.getBaseAttrDict(itemData);
			for (let type in equipAttrDict) {
				if (attrDict[type] != null) {
					attrDict[type] += equipAttrDict[type];
				} else {
					attrDict[type] = equipAttrDict[type];
				}
			}
		}
		//转生
		let roleState: number = this.getRoleState();
		let roleLevel: number = this.getRoleLevel();
		if (roleState > 0) {
			let roleStateAttrDict: any
			let cfg: any = ConfigManager.roleStateNew.getByPk(roleState);
			if (cfg != null && cfg.levelAttrList != null) {
				roleStateAttrDict = WeaponUtil.getAttrDict(cfg.attr);
				// for (let type in roleStateAttrDict) {
				// 	if (attrDict[type] != null) {
				// 		attrDict[type] += roleStateAttrDict[type] + (roleStateAttrDict[type] * levelDiff);
				// 	} else {
				// 		attrDict[type] = roleStateAttrDict[type] * levelDiff;
				// 	}
				// }
			}
			// for (let i: number = 1; i <= roleState; i++) {
			// 	let cfg: any = ConfigManager.roleStateNew.getByPKParams(i, 0);
			// 	if (cfg != null && cfg.levelAttrList != null && roleLevel >= cfg.levelAttrStartLevel) {
			// 		let levelDiff: number = roleLevel - cfg.levelAttrStartLevel + 1;
			// 		roleStateAttrDict = WeaponUtil.getAttrDict(cfg.levelAttrList);
			// 		for (let type in roleStateAttrDict) {
			// 			if (attrDict[type] != null) {
			// 				attrDict[type] += roleStateAttrDict[type] + (roleStateAttrDict[type] * levelDiff);
			// 			} else {
			// 				attrDict[type] = roleStateAttrDict[type] * levelDiff;
			// 			}
			// 		}
			// 	}
			// }
		}
		return attrDict;
	}

	/**
	 * 是否显示属性时装、武器等
	 */
	public get showAttrDict(): any {
		return this.entityInfo.weapons;
	}
	/**
	 * 是否有境界
	 */
	public get isHasRealm(): boolean {
		return this.role.realmLevel_BY > 0;
	}
	/**
	 * 境界是否满级了
	 */
	public get isRealmMax(): boolean {
		var nextLv: boolean = this.role.realmLevel_BY + 1;
		var next: any = ConfigManager.realm.getByPk(nextLv);
		return !next;
	}

	/**
	 * 登录推送的强化信息
	 * @param S2C_SPlayerStrengthenExInfo
	 */
	public set sPlayerStrengthenExInfo(sPlayerStrengthenExInfo: any) {
		let roleIndex: number;
		for (let sRoleStrengthenExInfo of sPlayerStrengthenExInfo.role_infos) {
			roleIndex = sRoleStrengthenExInfo.index;
			this._roleStrengthenExDict[roleIndex] = {};
			for (let sStrengthenExInfo of sRoleStrengthenExInfo.infos) {
				this._roleStrengthenExDict[roleIndex][sStrengthenExInfo.type] = sStrengthenExInfo;
			}
		}

		this._strengthenExDict = {};
		for (let sStrengthenExInfo of sPlayerStrengthenExInfo.public_infos) {
			this._strengthenExDict[sStrengthenExInfo.type] = sStrengthenExInfo;
		}
	}

	/**
	 * 更新推送玩家新强化系统信息
	 * @param S2C_SPlayerStrengthenExUpdate
	 */
	public set sPlayerStrengthenExUpdate(sPlayerStrengthenExUpdate: any) {
		let roleIndex: number;
		for (let sRoleStrengthenExInfo of sPlayerStrengthenExUpdate.update_infos) {
			roleIndex = sRoleStrengthenExInfo.index;
			if (roleIndex == -1) { //公共的数据 存在公共的里面
				for (let sStrengthenExInfo of sRoleStrengthenExInfo.infos) {
					this._strengthenExDict[sStrengthenExInfo.type] = sStrengthenExInfo;
				}
				continue;
			}

			if (this._roleStrengthenExDict[roleIndex] == null) {
				this._roleStrengthenExDict[roleIndex] = {};
			}
			for (let sStrengthenExInfo of sRoleStrengthenExInfo.infos) {
				this._roleStrengthenExDict[roleIndex][sStrengthenExInfo.type] = sStrengthenExInfo;
			}
		}
	}

	/**
	 * 根据强化返回更新
	 * @param sUpgradeStrengthenEx S2C_SUpgradeStrengthenEx
	 */
	public updateStrengthenEx(sUpgradeStrengthenEx: any): void {
		let roleIndex: number = sUpgradeStrengthenEx.index;
		let sStrengthenExInfo: any = sUpgradeStrengthenEx.info;
		if (roleIndex == -1) {//公共信息
			this._strengthenExDict[sStrengthenExInfo.type] = sStrengthenExInfo;
		} else {
			this._roleStrengthenExDict[roleIndex][sStrengthenExInfo.type] = sStrengthenExInfo;
		}
	}

	public setRoleCombat(roleIndex: number, combat: number): void {
		this._roleCombatDict[roleIndex] = combat;
	}

	public getRoleComBat(roleIndex: number): number {
		let combat: number = 0;
		if (this._roleCombatDict[roleIndex]) {
			combat = this._roleCombatDict[roleIndex];
		}
		return combat;
	}

	/**
	 * 获取玩家强化信息
	 * @returns SStrengthenExInfo
	 */
	public getPlayerStrengthenExtInfo(type: EStrengthenExType, roleIndex: number = -1): any {
		if (roleIndex == -1) {
			return this._strengthenExDict[type];
		} else {
			if (this._roleStrengthenExDict[roleIndex]) {
				return this._roleStrengthenExDict[roleIndex][type];
			}
			return null;
		}
	}

	/**
	 * 获取玩家强化等级
	 */
	public getPlayerStrengthenExLevel(type: EStrengthenExType, roleIndex: number = -1): number {
		let level: number = 0;
		let info: any = this.getPlayerStrengthenExtInfo(type, roleIndex);
		if (info != null) {
			level = info.level;
		}
		return level;
	}

	public getPlayerStrengthenWarfare(type: EStrengthenExType, roleIndex: number = -1): number {
		let warfare = 0;
		let info: any = this.getPlayerStrengthenExtInfo(type, roleIndex);
		if (info != null) {
			warfare = info.warfare;
		}
		return warfare;
	}

	/**获取玩家所有角色强化总等阶 */
	public getPlayerStrengthenExTotalStage(type: EStrengthenExType): number {
		let totalStage: number = 0;
		for (let index in this._roleStrengthenExDict) {
			let info: any = this._roleStrengthenExDict[index][type];
			if (info && info.active == 1) {
				let cfg: any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(type, info.level);
				if (cfg && cfg.stage) {
					totalStage += cfg.stage;
				}
			}
		}
		return totalStage;
	}

	/**获取玩家所有角色强化总等级 */
	public getPlayerStrengthenExTotalLv(type: EStrengthenExType): number {
		let totalLv: number = 0;
		for (let index in this._roleStrengthenExDict) {
			let info: any = this._roleStrengthenExDict[index][type];
			if (info && info.active) {
				totalLv += info.level;
			}
		}
		return totalLv;
	}

	/**
	 * 是否可以强化
	 */
	public isCanUpgradeStrengthenEx(type: EStrengthenExType, roleIndex: number = -1): boolean {
		let level: number = this.getPlayerStrengthenExLevel(type, roleIndex);
		let info: any = this.getPlayerStrengthenExtInfo(type, roleIndex);
		let maxLevel: number = ConfigManager.mgStrengthenEx.getMaxLevel(type);
		if (level >= maxLevel) {
			return false;
		}
		if (info && info.active == 0) {//未激活
			return false;
		}
		let cfg: any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(type, level);
		let useItemCode: number = ConfigManager.mgStrengthenEx.getUseItemCode(type);
		let costNum: number = 0;
		if (useItemCode > 0) {
			let count: number = CacheManager.pack.propCache.getItemCountByCode2(useItemCode);
			costNum = cfg.useItemNum > 0 ? cfg.useItemNum : 0;
			return count >= costNum;
		} else {
			costNum = cfg["useMoneyNum"] ? cfg["useMoneyNum"] : 0;
			if (type == EStrengthenExType.EStrengthenExTypeInternalForce && costNum <= 1000000) {
				return MoneyUtil.checkEnough(cfg["useMoneyCode"], 1000000, false);
			} else {
				return MoneyUtil.checkEnough(cfg["useMoneyCode"], costNum, false);
			}
		}
	}

	/**
	 * 新强化是否已开启
	 */
	public isStrengthenExActive(type: EStrengthenExType, roleIndex: number = -1): boolean {
		let sStrengthenExInfo: any = this.getPlayerStrengthenExtInfo(type, roleIndex);
		if (sStrengthenExInfo != null) {
			return sStrengthenExInfo["active"] == 1;
		}
		return false;
	}

	/**
	 * 是否可以激活
	 */
	public isStrengthenExCanActive(type: EStrengthenExType, roleIndex: number = -1): boolean {
		let roleLevel: number = CacheManager.role.getRoleLevel();
		let isActive: boolean = this.isStrengthenExActive(type, roleIndex);
		if (!isActive) {
			switch (type) {
				case EStrengthenExType.EStrengthenExTypeDragonSoul:
					return ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.DragonSoul], false);
				case EStrengthenExType.EStrengthenExTypeWing:
					let conditionCfg: any = ConfigManager.strengthenExActivateConfig.getByType(type);
					if (conditionCfg != null) {
						let activeCount: number = this.getStrengthenExActiveCount(type);
						let condition: Array<number> = conditionCfg["condition"][activeCount + 1];
						if (condition != null) {
							let stage: number = 0;
							let cfg: any;
							let isRoleActive: boolean;
							for (let i: number = 0; i < this.roles.length; i++) {
								isRoleActive = this.isStrengthenExActive(type, i);
								if (isRoleActive) {//已激活才算
									cfg = StrengthenExUtil.getCurrentCfg(type, i);
									if (cfg != null && cfg["stage"] != null) {
										stage += cfg["stage"];
									}
								}
							}
							return stage >= condition[2];
						} else {
							return true;
						}
					} else {
						return ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Wing], false);
					}
				case EStrengthenExType.EStrengthenExTypeInternalForce:
					return ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.InnerPower], false);
				default:
					return true;
			}
		} else {
			return false;
		}
	}

	public set checkPointShow(value: boolean) {
		if (value == this._checkPointShow) return;
		this._checkPointShow = value;
		EventManager.dispatch(LocalEventEnum.CheckPointInfoShow);
	}

	public get checkPointShow(): boolean {
		return this._checkPointShow;
	}

	/**
	 * 获取新强化已激活数量
	 */
	public getStrengthenExActiveCount(type: EStrengthenExType): number {
		let count: number = 0;
		for (let i: number = 0; i < 3; i++) {
			if (this.isStrengthenExActive(type, i)) {
				count++;
			}
		}
		return count;
	}

	public clear(): void {
		this._entityInfos = {};
		this.role = {};
		this.roles = [];
		this._roleFightAttrBaseDict = {};
		this._roleFightAttrDict = {};
		this._roleCombatDict = {};
		this._roleStrengthenExDict = {};
		this._strengthenExDict = {};
		this._checkPointShow = false;
		this.money = {};
		this.fightAttrBase = {};
		this.fightAttrAdd = {};
		this.fightAttr = {};
		this.fightAttrNotShow = {};
		this.isNewCreateRole = false;
		this.pos = null;
	}
}