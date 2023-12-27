class MapUtil {
	public static MainCityMapId: number = 999997;
	private static canClickTypes:RpgObjectType[] = [];
	
	/**
	 * 是否为主城。目前只有一个主城
	 */
	public static isMainCity(mapId:number):boolean{
		return mapId == MapUtil.MainCityMapId;
	}
	/**
	 * 是否新手地图
	 */
	public static isNewPlayerMap():boolean{
		return CacheManager.map.mapId == 100000;
	}

	/**不允许回城复活 */
	public static isInNoCityReliveMap():boolean{		
		// ==== 参考 ： E:\LuaScript-2D\MainGame\Module\Map\Utils\MapUtil.lua  isInNoCityReliveMap
		var flag:boolean = MapUtil.isRestrictionTypeAnd(EMapRestrictionType.EMapRestrictionTypeRevivalInBackToTheCity);		
		return flag;
	}
	/**
	 * 是否不允许原地复活
	 */
	public static isInNoLocalReliveMap():boolean{
		var flag:boolean = MapUtil.isRestrictionTypeAnd(EMapRestrictionType.EMapRestrictionTypeRevivalInSitu);		
		return flag;
	}
	/**
	 * 是否复活后继续挂机的地图
	 */
	public static isReliveToAutofightMap():boolean{
		return !CacheManager.king.isAutoFighting && CacheManager.copy.isInCopyByType(ECopyType.ECopyLegend);
	}
	/**
	 * 是否关卡BOSS地图
	 */
	public static isCheckPointCopyMap():boolean{
		return CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && CacheManager.copy.isInCopy;
	}

	/**对当前地图的限制类型进行and运算 */
	public static isRestrictionTypeAnd(eRestrictionType:EMapRestrictionType):boolean{
		var flag:boolean = false;
		var mapRestrictionType:number = CacheManager.map.getRestrictionType();
		flag = BitUtils.band(eRestrictionType,mapRestrictionType)>0;
		return flag;
	}

	/**是否显示攻击列表 */
	public static checkShowFightView():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) {
			return false;
		}
		if(sceneData.showAttackList || sceneData.showBeAttackedList || sceneData.canAutoFight || sceneData.shieldModel) {
			return true;
		}
		return MapUtil.showAttackListCopy();
	}

	/**是否显示队伍列表 */
	public static checkShowTeamView():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		return sceneData && sceneData.showTeamList;
	}

	/**
	 * 击杀怪物是否显示飞经验特效
	 */
	public static isShowExpEffect():boolean {
		return CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint) || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgRune);
	}

	/**
	 * 旧版写法，显示攻击列表的副本
	 */
	public static showAttackListCopy():boolean {
		let cc:CopyCache = CacheManager.copy;
		let flag:boolean = cc.isInCopyByType(ECopyType.ECopyMgNewWorldBoss) || 
		cc.isInCopyByType(ECopyType.ECopyMgSecretBoss) || 
		cc.isInCopyByType(ECopyType.ECopyMgBossLead) || 
		cc.isInCopyByType(ECopyType.ECopyMgNewBossHome);
		return flag;
	}

	/**
	 * 是否显示可攻击列表
	 */
	public static showCanAttackList():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return false;
		return sceneData.showAttackList;
	}

	/**
	 * 是否显示被攻击列表
	 */
	public static showBeAttackedList():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return false;
		return sceneData.showBeAttackedList || MapUtil.showAttackListCopy();
	}

    /**是否不显示被攻击者血条 */
    public static checkNoShowBeAttackedLife():boolean {
        let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) {
            return false;
        }
        return sceneData.noShowBeAttackedLife;
    }

    /**是否显示挂机标识 */
    public static showAutoFight():boolean {
        let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) {
            return false;
        }
        return sceneData.canAutoFight;
    }

	/**
	 * 是否阵营模式的地图
	 */
	public static isCampBattleMap():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return false;
		return Boolean(sceneData.fightMode & EFightModel.EFightModelForce);
	}

	/**
	 * 仙盟模式的地图
	 */
	public static isGuildMap():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return false;
		return Boolean(sceneData.fightMode & EFightModel.EFightModelGuild);
	}

	/**
	 * 仙盟模式的地图额外判断副本类型，是否应用仙盟模式的判断
	 */
	public static guildLimitCopy():boolean {
		return !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangHall);
	}

	/**
	 * 检测地图战斗模式
	 */
	public static checkMapFightMode(model:EFightModel):boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return false;
		return Boolean(sceneData.fightMode & model);
	}

	/**
	 * 是否是新手地图
	 */
	public static isNewlyMap():boolean {
		let mapId:number = CacheManager.map.mapId;
		return mapId == 100000 || mapId == 101000;
	}

    /**
     * 技能规则
     */
    public static getSkillRule():EBattleSkillRule {
        let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) return 0;
        return sceneData.skillRule1 ? EBattleSkillRule.RULE1 : EBattleSkillRule.NORMAL;
    }

	/**可点击的实体列表 */
	public static getCanClickEntityTypes():RpgObjectType[] {
		let sceneData:any = CacheManager.map.getCurMapScene();
		if(!sceneData) return null;
		if(sceneData.canSelectList) {
			return sceneData.canSelectList;
		}

		if(!sceneData.canHandOperate) {
			//不可点击移动的地图任何实体都不可点击
			return null;
        }
		//可点击移动的地图，默认可点击NPC和传送阵
		let types:RpgObjectType[] = [RpgObjectType.Npc,RpgObjectType.PassPoint];
		if(sceneData.canSelectMonster) {
			types.push(RpgObjectType.Monster);
			types.push(RpgObjectType.Miner);
		}
		if(sceneData.canSelectDrop) {
			types.push(RpgObjectType.Drop);
			types.push(RpgObjectType.DropPublic);
		}
		return types;
	}

	/**
	 * 是否显示就近攻击按钮
	 */
	public static showNearAttack():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) {
            return false;
        }
        return sceneData.nearAttackCb;
	}

	/**
	 * 是否显示仇恨列表（击杀过我的玩家列表）
	 */
	public static showMurdererList():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) {
            return false;
        }
        return sceneData.murdererListCb;
	}

	/**
	 * 是否主角脚底光圈变亮
	 */
	public static showShadowHalo():boolean {
		let sceneData:any = CacheManager.map.getCurMapScene();
        if(!sceneData) {
            return false;
        }
        return sceneData.showShadowHalo;
	}
}