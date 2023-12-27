/**
 * 实体工具类
 */
class EntityUtil {
	public constructor() {
	}

	/**
	 * 获取传送点唯一标识
	 */
	public static getPassPointEntityId(passPoint: any): string {
		return `pp_${passPoint.mapId}_${passPoint.passPointId}`;
	}

	/**
	 * 获取场景特效点唯一标识
	 */
	public static getSceneEffectEntityId(gridX:number, gridY:number, effectName:string): string {
		return `se_${effectName}_${gridX}_${gridY}`;
	}

	/**
	 * 获取唯一标识
	 */
	public static getEntityId(sEntityId: any,roleIndex:number = -1): string {
		if (sEntityId == null) {
			return "";
		}
		let index:number = sEntityId.roleIndex_BY;
		if(roleIndex != -1) {
			index = roleIndex;
		}
		return index + "_" + sEntityId.id_I + "_" + sEntityId.type_BY + "_" + sEntityId.typeEx_SH + "_" + sEntityId.typeEx2_BY;
	}

	public static getEntityServerName(miniPlayer:any):string {
		return `S.${miniPlayer.entityId.typeEx_SH}${miniPlayer.name_S}`;
	}

	/**
	 * 是否为主角自己
	 */
	public static isMainPlayer(sEntityId: any): boolean {
		return EntityUtil.getEntityId(sEntityId) == EntityUtil.getEntityId(CacheManager.role.entityInfo.entityId);
	}

	/**
	 * 检测实体A是否归属于实体B
	 * entityInfo 中的 entityId 除类型外的3个字段相等，为归属实体
	 */
	public static isABelongToB(entityA:RpgGameObject,entityB:RpgGameObject):boolean
	{
		if(!entityA || !entityB) return false;
		let _infoA:EntityInfo = entityA.entityInfo;
		if(!_infoA) return false;
		let _infoB:EntityInfo = entityB.entityInfo;
		if(!_infoB) return false;
		return (_infoA.entityId.id_I == _infoB.entityId.id_I &&
		_infoA.entityId.typeEx_SH == _infoB.entityId.typeEx_SH && 
		_infoA.entityId.typeEx2_BY == _infoB.entityId.typeEx2_BY)
	}

	/**
	 * 检测实体是否归属自己 
	 */
	public static isBelongToMine(entity:RpgGameObject):boolean
	{
		let _mainPlayer:MainPlayer = CacheManager.king.kingEntity;
		return EntityUtil.isABelongToB(entity,_mainPlayer);
	}

	/**
	 * 根据 SEntityId 判断两个实体是是否相同
	 * @param entityIdA SEntityId
	 * @param entityIdB SEntityId
	 * @param ignoreRoleIndex 忽略roleIndex
	 */
	public static isSame(entityIdA:any,entityIdB:any,ignoreRoleIndex:boolean=false):boolean{
		if(!entityIdA || !entityIdB) return false;
		return ((ignoreRoleIndex || entityIdA.roleIndex_BY == entityIdB.roleIndex_BY) &&
			entityIdA.id_I == entityIdB.id_I &&
			entityIdA.type_BY == entityIdB.type_BY &&
			entityIdA.typeEx_SH == entityIdB.typeEx_SH && 
			entityIdA.typeEx2_BY == entityIdB.typeEx2_BY);
	}

	/**
	 * 是否跨服玩家(非本服玩家)
	 * @param entityId 目标玩家实体id
	 *  */
	public static isCrossPlayer(entityId:any):boolean{
		if(!entityId || !EntityUtil.isPlayer(entityId) || entityId.typeEx_SH == 0) return false;
		let myId:any = CacheManager.role.getEntityInfo(0).entityId
		// typeEx2_BY 代理id; typeEx_SH 服务器id
		return entityId.typeEx2_BY!=myId.typeEx2_BY || entityId.typeEx_SH!=myId.typeEx_SH;
	}

	/**
     * 检测是否可对实体攻击
     * @param entity 需检测的实体对象
     */
    public static checkEntityIsCanAttack(entity:RpgGameObject, showTip:boolean = false,filterDead:boolean = true):boolean
    {	
		if(entity == null || entity.entityInfo == null) return false;
		let isDead:boolean = filterDead && entity.isDead();
        if (isDead || entity.objType == RpgObjectType.MainPlayer)
			return false;
		if (entity.objType != RpgObjectType.OtherPlayer &&
		    entity.objType != RpgObjectType.Monster ){
			return false;
		}			
		if(entity.objType == RpgObjectType.OtherPlayer)
		{
			let _mapScene:any = CacheManager.map.getCurMapScene();
			if(!_mapScene)
			{
				return false;
			}
			if(MapUtil.checkMapFightMode(EFightModel.EFightModelPeace)) {
				//和平模式不可攻击玩家
				//遭遇战是和平模式的关卡地图，特殊处理可以攻击玩家
				return CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter);
			}
			if(MapUtil.isCampBattleMap()) {
				//阵营模式
				return CacheManager.role.entityInfo.force_BY != entity.entityInfo.force_BY;
			}
			if(MapUtil.isGuildMap() && !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangHall)) {
				//仙盟模式
				if(CacheManager.guildNew.isMyGuild(entity.entityInfo.guildId_I)) {
					showTip && Tip.showTip(LangFight.LANG6);
					return false;
				}
				return true;
			}
			// if(_mapScene.mapEntityFightMode == )
			// {

			// }
			let player = CacheManager.role.player;
			if (player.mode_I == EEntityFightMode.EEntityFightModePeace)
			{
				//和平模式
                // showTip && Tip.showTip(LangFight.LANG1);
				return false;
			}
			else if(player.mode_I == EEntityFightMode.EEntityFightModeCompulsion)
			{
				//强制模式
                let ret:boolean = !CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)//非遭遇战才判断同仙盟同队伍
					&& ((player.guildId_I != 0
					&& player.guildId_I == entity.entityInfo.guildId_I) //同仙盟
					|| CacheManager.team.getTeamMember(entity.entityInfo.entityId) != null);
                ret && showTip && Tip.showTip(LangFight.LANG2);
				return !ret;
			}
			else if(player.mode_I == EEntityFightMode.EEntityFightModeFight)
			{
				//全体模式
				return true;
			}
		}
		if (EntityUtil.isSpecificBossType(entity.entityInfo))
			return false;
		if (entity.objType == RpgObjectType.Monster)
		{
            //let bossConfig:any = ConfigManager.boss.getByPk(entity.entityInfo.code_I);
            //let bossCamp:number = bossConfig && bossConfig.camp;
            if (EntityUtil.isCampNeutralMonster(entity.entityInfo))
            {
				return false;
            }
		}
        return true;
    }

	/**是否中立怪 */
	public static isCampNeutralMonster(entityInfo:any):boolean{
		let bossConfig:any = ConfigManager.boss.getByPk(entityInfo.code_I);
		if(bossConfig){
			return bossConfig.camp==ECamp.ECampNeutral;
		}
		return false;
	}

	/**
	 * 是否是敌方阵营
	 */
	public static isEnemyCamp(entity:RpgGameObject):boolean {
		if(!entity || !entity.entityInfo) return false;
		return CacheManager.role.entityInfo.force_BY != entity.entityInfo.force_BY;
	}

    /**
     * 检测是否可对实体攻击
     * @param entity 需检测的实体对象
     */
    public static checkEntityIsCanAttackBySkill(entity:RpgGameObject, skillId:number):boolean
    {
        let vo:any = ConfigManager.skill.getSkill(skillId);
        if (vo == null)
        {
            return false;
        }
        if (!CacheManager.skill.canSkillCd(skillId))
        {
            return false;
        }
        return EntityUtil.checkEntityIsCanAttack(entity);
    }

    /**是否是采集怪 */
    public static isCollectionMonster(entity:RpgGameObject):boolean
    {
        if(!entity || !entity.entityInfo) return false;
		return EntityUtil.checkMonsterType(entity.entityInfo,EBossType.EBossTypeCollection);
    }

	/**是否boss */
	public static isBoss(entityInfo:any):boolean{
		var _bossConfig:any;
		if(entityInfo){
			_bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
		}
		return _bossConfig && (_bossConfig.showType==EBossShowType.EBossShowTypeBoss || _bossConfig.showType==EBossShowType.EBossShowTypeCheckPointBoss);
	}

	/**是否关卡boss怪 */
	public static isCheckPointBoss(entityInfo:any):boolean {
		let _bossConfig:any;
		if(entityInfo){
			_bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
		}
		return _bossConfig != null && _bossConfig.showType == EBossShowType.EBossShowTypeCheckPointBoss;
	}

    /**是否精英怪 */
    public static isEliteBoss(entityInfo:any):boolean {
        let _bossConfig:any;
        if(entityInfo){
            _bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
        }
        return _bossConfig != null && _bossConfig.showType == EBossShowType.EBossShowTypeElite;
    }

	/**是否需要显示boss血条 */
	public static isShowBossHp(entityInfo:any):boolean {
		let _bossConfig:any;
		if(entityInfo){
			_bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
		}
		return _bossConfig != null && _bossConfig.showType == EBossShowType.EBossShowTypeBoss;
	}

	/**
	 * 是否是玩家 (包括镜像玩家)
	 */
	public static isPlayer(entityId:any):boolean {
		if(!entityId) return false;
		return entityId.type_BY == EEntityType.EEntityTypePlayer || entityId.type_BY == EEntityType.EEntityTypePlayerMirror;
	}
	/**是否玩家 (真实的玩家) */
	public static isOnlyPlayer(entityId:any):boolean{
		if(!entityId) return false;
		return entityId.type_BY == EEntityType.EEntityTypePlayer
	}

	/**
	 * 检测是哪种怪物类型 
	 */
	public static checkMonsterType(entityInfo:any,type:EBossType):boolean {
		if(!entityInfo) return false;
		let _bossConfig:any = ConfigManager.boss.getByPk(entityInfo.code_I);
		if(type == EBossType.EBossTypeNomarl) {
			return _bossConfig && !_bossConfig.type;
		}
		return _bossConfig && _bossConfig.type == type;
	}

    /**
     * 是否为参与排序实体
     */
	public static isSortObj(obj:RpgGameObject):boolean {
		if (obj) {
			return obj.objType != RpgObjectType.Drop
                && obj.objType != RpgObjectType.DropPublic
                && obj.objType != RpgObjectType.PassPoint
                && !EntityUtil.checkMonsterType(obj.entityInfo,EBossType.EBossTypeTimeTrap);
		}
		return false;
	}

	public static canSelect(obj:RpgGameObject):boolean {
        if (obj) {
			return !obj.isDead()
				&& obj.objType != RpgObjectType.Npc
                && obj.objType != RpgObjectType.DropPublic
                && obj.objType != RpgObjectType.Drop
				&& obj.objType != RpgObjectType.PassPoint;
        }
        return false;
	}

    public static isNeedShowSelect(obj:RpgGameObject):boolean {
        if (obj) {
            return obj.objType == RpgObjectType.Npc;
        }
        return false;
    }

	/**
	 * 是否可以被点击
	 */
	public static canClick(entity:RpgGameObject):boolean
	{
		if(!entity || entity.isDead()) return false;
		if(entity.entityInfo && entity.entityInfo.selfIndex != -1) return false;
		return entity.objType != RpgObjectType.Pet && entity.objType != RpgObjectType.Tomstone && !EntityUtil.isCampNeutralMonster(entity.entityInfo);
	}

	/**
	 * 是否是特定类型的怪，见：EBossType
	 */
	public static isSpecificBossType(entityInfo:EntityInfo):boolean
	{
		if(!entityInfo || !entityInfo.type || entityInfo.type != EEntityType.EEntityTypeBoss) return false;
		let bossConfig:any;
		if(entityInfo)
		{
			bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
		}
		return bossConfig && (bossConfig.type == EBossType.EBossTypeTimeTrap
			|| bossConfig.type == EBossType.EBossTypeMiner//矿工怪
			|| bossConfig.type == EBossType.EBossTypeTombstone);
	}

	public static isMinerBossType(entityInfo:EntityInfo):boolean
	{
        if(!entityInfo || !entityInfo.type || entityInfo.type != EEntityType.EEntityTypeBoss) return false;
        let bossConfig:any;
        if(entityInfo)
        {
            bossConfig = ConfigManager.boss.getByPk(entityInfo.code_I);
        }
        return bossConfig && bossConfig.type == EBossType.EBossTypeMiner;//矿工怪
	}

	/**
	 * 是否为玩家自己的多角色实体 
	 * -1 非多角色 0主角自己 1第一个附属角色 2第二个附属角色
	 */
	public static isMainPlayerOther(sEntityId:any):number {
		if(!sEntityId) return -1;
		if(EntityUtil.isMainPlayer(sEntityId)) return sEntityId.roleIndex_BY;
		let roleEntityId:any = CacheManager.role.getSEntityId();
		if(roleEntityId.id_I == sEntityId.id_I && 
			roleEntityId.type_BY == sEntityId.type_BY && 
			roleEntityId.typeEx_SH == sEntityId.typeEx_SH && 
			roleEntityId.typeEx2_BY == sEntityId.typeEx2_BY) {
			return sEntityId.roleIndex_BY;
		}
		return -1;
	}

	/**
	 * 是否为多角色镜像实体
	 */
	public static isMainPlayerOtherMirror(sEntityId:any):boolean {
		if(!sEntityId) return false;
		let roleEntityId:any = CacheManager.role.getSEntityId();
		if(sEntityId.type_BY == EEntityType.EEntityTypePlayerMirror && 
			sEntityId.id_I == roleEntityId.id_I && 
			sEntityId.typeEx_SH == roleEntityId.typeEx_SH && 
			sEntityId.typeEx2_BY == roleEntityId.typeEx2_BY) {
			// let idI:number = roleEntityId.id_I + RoleIndexEnum.RoleBase1;
			// let idII:number = roleEntityId.id_I + RoleIndexEnum.RoleBase2;
			// if(sEntityId.id_I == idI || sEntityId.id_I == idII) {
			// 	return true;
			// }
			return true;
		}
		return false;
	}

	/**获取玩家实体的多角色实体id */
	public static getPlayerOtherId(sEntityId:any,roleIndex:number):any {
		if(!sEntityId || sEntityId.type_BY != EEntityType.EEntityTypePlayer) return null;
		if(sEntityId.roleIndex_BY == roleIndex) return sEntityId.roleIndex_BY;
		let entityId:any = {
			roleIndex_BY : roleIndex, 
			id_I : sEntityId.id_I, 
			type_BY : sEntityId.type_BY, 
			typeEx_SH : sEntityId.typeEx_SH, 
			typeEx2_BY : sEntityId.typeEx2_BY
		};
		return entityId;
	}

	/**
	 * entityIdB是否属于entityIdA的多角色实体
	 */
	public static isPlayerOther(entityIdA:any,entityIdB:any):boolean {
		if(!entityIdA || !entityIdB) return false;
		return entityIdA.id_I == entityIdB.id_I && entityIdA.type_BY == entityIdB.type_BY && entityIdA.typeEx_SH == entityIdB.typeEx_SH && entityIdA.typeEx2_BY == entityIdB.typeEx2_BY;
	}

	public static getEntityMcPathName(type: EEntityType):string {
        switch (type) {
            case EEntityType.EEntityTypePlayer:
			case EEntityType.EEntityTypePlayerMirror:
				return "player";
            case EEntityType.EEntityTypeNPC:
                return "npc";
            case EEntityType.EEntityTypePet:
                return "pet";
            case EEntityType.EEntityTypeBoss:
                return "monster";
            default :
                return "common";
        }
    }

	public static getServerNameStr(serverId:number):string {
		return "[S" + serverId + "]";
	}
}