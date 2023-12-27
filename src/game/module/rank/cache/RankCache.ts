class RankCache implements ICache{
	private _rankTypes:EToplistType[];
	private rankTypeInfos:{[type:number]:RankInfo};

	public constructor() {
		this._rankTypes = [
				EToplistType.EToplistTypePlayerFight,
				EToplistType.EToplistTypePlayerFightCareer1,
				EToplistType.EToplistTypePlayerFightCareer2,
				EToplistType.EToplistTypePlayerFightCareer3,
				EToplistType.EToplistTypePlayerLevel,
				EToplistType.EToplistTypeShapeSpirit,
				EToplistType.EToplistTypeShapePet,
				EToplistType.EToplistTypeShapeWing,
				EToplistType.EToplistTypeShapeMount,
				EToplistType.EToplistTypeShapeBattle,
				EToplistType.EToplistTypeShapeSwordPool,
				EToplistType.EToplistTypeLord,
				EToplistType.EClientToplistTypeEncounter
				// EToplistType.EToplistTypeMedal,
				// EToplistType.EToplistTypeGuildLevel,
				// EToplistType.EToplistTypeShapeMagic,
				// EToplistType.EToplistTypeOfflineWorkExpEffect,
				// EToplistType.EToplistTypeCopyMgRune,
				// EToplistType.EToplistTypeAchievementPoint
		];

		this.rankTypeInfos = {};
		for(let i:number = 0; i < this._rankTypes.length ; i++){
			let info:RankInfo = new RankInfo(this._rankTypes[i]);
			this.rankTypeInfos[info.type] = info;
		}
	}

	/**
	 * 获取排行榜数值
	 * @data TToplist 数值注释见t_toplist_type.json
	 */
	public getRankPropertys(data:any):string[]{
		let list:string[];
		let shape:EShape;
		let shapeLv:number = -1;
		let shapeFight:number = -1;
		switch(data.toplistType_I){
			case EToplistType.EToplistTypePlayerFight:
				//玩家名字，仙盟名字，战斗力
				let guildName:string = data.ownerName_S;
				if(guildName == "") guildName = "无";
				list = [data.entityName_S,guildName,Number(data.valueOne_L64) + "",Number(data.valueThree_L64) + "级"];
				break;
			case EToplistType.EToplistTypePlayerFightCareer1:
			case EToplistType.EToplistTypePlayerFightCareer2:
			case EToplistType.EToplistTypePlayerFightCareer3:
				list = [data.entityName_S,"",Number(data.valueOne_L64) + "",Number(data.valueThree_L64) + "级"];
				break;
			case EToplistType.EToplistTypePlayerLevel:
				//玩家名字，职业id，等级 ConfigManager.mgCareer.getCareerName(data.propertyThree_I)
				list = [data.entityName_S,"",Number(data.valueOne_L64) + "级"];
				break;
			case EToplistType.EToplistTypeShapeMount:
				//玩家名字，坐骑名字，坐骑品阶
				shape = EShape.EShapeMount;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapePet:
				//玩家名字，宠物名字，宠物品阶
				shape = EShape.EShapePet;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapeMagic:
				shape = EShape.EShapeMagic;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapeWing:
				shape = EShape.EShapeWing;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapeSpirit:
				shape = EShape.EShapeSpirit;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapeBattle:
				shape = EShape.EShapeBattle;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapeSwordPool:
				shape = EShape.EShapeSwordPool;
				shapeFight = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeOfflineWorkExpEffect:
				//玩家名字，战斗力，挂机效率
				App.MathUtils.formatNum(Number(data.valueOne_L64)) + "/分";
				list = [data.entityName_S,Number(data.valueTwo_L64) + "",App.MathUtils.formatNum(Number(data.valueOne_L64)) + "/分"];
				break;
			case EToplistType.EToplistTypeCopyMgRune:
				//玩家名字，战斗力，通关层数
				let floorStr:string;
				if(data.valueOne_L64 == ConfigManager.mgRuneCopy.MAX_FLOOR){
					floorStr = "已通关";
				}
				else {
					floorStr = "诛仙塔·" + data.valueOne_L64 + "层";
				}
				list = [data.entityName_S,Number(data.valueTwo_L64) + "",floorStr];
				break;
			case EToplistType.EToplistTypeAchievementPoint:
				//玩家名字，职业，成就点数ConfigManager.mgCareer.getCareerName(data.propertyThree_I)
				list = [data.entityName_S,"",Number(data.valueOne_L64) + ""];
				break;
			case EToplistType.EToplistTypePlayerLevelOpen:
				list = [data.entityName_S, "",Number(data.valueOne_L64)];
				break;
			case EToplistType.EToplistTypeShapeMountOpen:
				shape = EShape.EShapeMount;
				shapeLv = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypeShapePetOpen:
				shape = EShape.EShapePet;
				shapeLv = Number(data.valueOne_L64);
				break;
			case EToplistType.EToplistTypePlayerRechargeOpen:
				list = [data.entityName_S, data.valueOne_L64 + "元宝",Number(data.valueOne_L64)];
				break;
			case EToplistType.EToplistTypePlayerTotalJewelOpen:
				list = [data.entityName_S, "-",Number(data.valueOne_L64)];
				break;
			case EToplistType.EToplistTypePlayerFightOpen:
				list = [data.entityName_S, data.valueOne_L64,Number(data.valueOne_L64)];
				break;
			case EToplistType.EToplistTypeStrengthenExCastOpen:
			case EToplistType.EToplistTypeStrengthenExDragonSoulOpen:
			case EToplistType.EToplistTypeStrengthenExWingOpen:
			case EToplistType.EToplistTypeIllustrated:
			case EToplistType.EToplistTypeTotalEquipScoreOpen:
				//玩家名字，三角色龙鳞甲阶数总和，三角色龙鳞甲等级总和,Number(data.valueTwo_L64)
				//玩家名字，三角色翅膀阶数总和，三角色翅膀等级总和,Number(data.valueTwo_L64)
				//玩家名字，三角色铸造级数总和
				//玩家名字，图鉴总战力
				//玩家名字，转生等级
				//玩家名字，三角色装备总评分
				list = [data.entityName_S, Number(data.valueOne_L64)];
				break;
			case EToplistType.EToplistTypeRoleStateOpen:
				list = [data.entityName_S, Number(data.valueOne_L64),Number(data.valueTwo_L64)];
				break;
			case EToplistType.EToplistTypeLord:
				let lordLv:number = Number(data.valueOne_L64);
				let lordInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,lordLv);
				let lordStr:string = "";
				if(lordInfo) {
					lordStr = lordInfo.showName;
				}
				list = [data.entityName_S, "-", lordStr];
				break;
			case EToplistType.EToplistTypeMedal:
				let medalLv:number = Number(data.valueOne_L64);
				let medalInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeMedal,medalLv);
				let medalStr:string = "";
				if(medalInfo) {
					medalStr = medalInfo.showName;
				}
				list = [data.entityName_S, "-", medalStr];
				break;
			case EToplistType.EClientToplistTypeEncounter:
				list = [data.name_S,"-","杀意值：" + data.killScore_I];
				break;
		}
		if(shapeLv != -1){
			if(shapeLv == 0) shapeLv = 1;
			// let shapeCfg:any = ConfigManager.mgShape.getByShapeAndLevel(shape,shapeLv);
			list = [data.entityName_S,shapeLv + "级",shapeLv];
		}
		if(shapeFight != -1) {
			list = [data.entityName_S,"","战力:" + shapeFight];
		}
		return list;
	}

	/**
	 * 获取自己排名数据
	 */
	public getSelfRankInfo(type:EToplistType):string[] {
		let list:string[];
		let roleCache:RoleCache = CacheManager.role;
		let shape:EShape;
		let shapeLv:number = -1;
		switch(type){
			case EToplistType.EToplistTypePlayerFight:
				//仙盟名字，战斗力
				let guildName:string = "无";
				if(CacheManager.guild.isJoinedGuild()){
					guildName = CacheManager.guild.playerGuildInfo.guildName_S;
				}
				list = [guildName,Number(roleCache.combatCapabilities) + ""];
				break;
			case EToplistType.EToplistTypePlayerLevel:
				//职业id，等级 ConfigManager.mgCareer.getCareerName(roleCache.getRoleCareer())
				list = ["",Number(roleCache.getRoleLevel()) + ""];
				break;
			// case EToplistType.EToplistTypeShapeMount:
			// 	//玩家名字，坐骑名字，坐骑品阶
			// 	shape = EShape.EShapeMount;
			// 	shapeLv = CacheManager.mountChange.level;
			// 	break;
			// case EToplistType.EToplistTypeShapePet:
			// 	shape = EShape.EShapePet;
			// 	shapeLv = CacheManager.petChange.level;
			// 	break;
			// case EToplistType.EToplistTypeShapeMagic:
			// 	shape = EShape.EShapeMagic;
			// 	shapeLv = CacheManager.magicChange.level;
			// 	break;
			// case EToplistType.EToplistTypeShapeWing:
			// 	shape = EShape.EShapeWing;
			// 	shapeLv = CacheManager.wingChange.level;
			// 	break;
			// case EToplistType.EToplistTypeShapeSpirit:
			// 	shape = EShape.EShapeSpirit;
			// 	shapeLv = CacheManager.spiritChange.level;
			// 	break;
			case EToplistType.EToplistTypeOfflineWorkExpEffect:
				//战斗力，挂机效率
				list = [Number(roleCache.combatCapabilities) + "",App.MathUtils.formatNum(CacheManager.sysSet.offlineWorkRatio) + "/分"];
				break;
			case EToplistType.EToplistTypeCopyMgRune:
				//战斗力，通关层数
				let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
				let floorStr:string = "诛仙塔·" + floor + "层";
				if(floor == ConfigManager.mgRuneCopy.MAX_FLOOR) {
					floorStr = "已通关";
				}
				list = [Number(roleCache.combatCapabilities) + "",floorStr];
				break;
			case EToplistType.EToplistTypeAchievementPoint:
				//职业，成就点数
				list = ["",CacheManager.achievement.achievementPoint + ""];
				break;
		}
		if(shapeLv != -1){
			if(shapeLv == 0) shapeLv = 1;
			let shapeCfg:any = ConfigManager.mgShape.getByShapeAndLevel(shape,shapeLv);
			list = [shapeCfg.name,shapeCfg.stage + "阶" + shapeCfg.star + "星"];
		}
		return list;
	}

	public getClientRankInfo(type:EToplistType):RankInfo {
		return this.rankTypeInfos[type];
	}

	public get rankTypes():EToplistType[] {
		return this._rankTypes;
	}
	public clear():void {
	}
}