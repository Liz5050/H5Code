/**
 * 主角与场景操作相关的缓存
 */
class KingCache {
	/**主角实体对象 */
	public leaderEntity:MainPlayer;
	public kingEntity:MainPlayer;
	public kingEntityII:MainPlayer;
	public kingEntityIII:MainPlayer;
	/**当前选中的NPC */
	public selectedNpcId:number;
	/**当前采集的实体 */
	public collectEntity:RpgGameObject;
	/**是否自动战斗中 */
	public isAutoFighting:boolean;
    /**控制者主角索引 */
	public leaderIndex:number = -1;
	/**多角色信息[roleIndex]=[career]*/
	public multiRoleInfoList:number[] = [];
	/**多角色协议信息*/
	public roleInfoDic:any;
    /**角色在上一个场景的方向*/
	private lastRoleDirs:number[] = [];
    /**副角色跟随主角的结束半径*/
	private _followEndRadius:number = 0;

	public constructor() {
		App.TimerManager.doFrame(1, 0, AI.run, AI);
	}

	/** 主角停止移动和AIStop */
	public stopKingEntity(stopAI:boolean = true): void
	{
		if (this.leaderEntity != null) {
			this.leaderEntity.stopMove();
		}
		if (stopAI) EventManager.dispatch(LocalEventEnum.AIStop);
	}

	public checkKingPassing(showTips:boolean = true):boolean
	{
		if(this.kingEntity && this.kingEntity.currentState == EntityModelStatus.ScaleTween)
		{
			Tip.showTip("正在传送中，请稍后");
			return true;
		}
		return false;
	}

	public getRoleEntity(roleIndex:number):MainPlayer{
		if (roleIndex == 0)
			return this.kingEntity;
		else if (roleIndex == 1)
			return this.kingEntityII;
		return this.kingEntityIII;
	}

    public setLeaderEntity(entity:MainPlayer):void {
		if (this.leaderEntity == entity) return;
		this.leaderEntity = entity;
		if (this.kingEntity && this.kingEntity != entity) {
            this.kingEntity.setFollowEntity(entity);
		}
		if (this.kingEntityII && this.kingEntityII != entity) {
            this.kingEntityII.setFollowEntity(entity);
		}
		if (this.kingEntityIII && this.kingEntityIII != entity) {
            this.kingEntityIII.setFollowEntity(entity);
		}
		// ControllerManager.rpgGame.view.setLeaderPlayer(entity);
		EventManager.dispatch(LocalEventEnum.LeaderRoleChange);
		Log.trace(Log.RPG, `当前主控制->${this.leaderIndex}`);
    }

    /**
	 * 更新多角色信息并计算出控制角色
     * @param mulRoleInfo
     * @param {boolean} considerDeath:死亡判断
     */
	public updateMultiRoleInfo(mulRoleInfo:any = null, considerDeath:boolean = false):void {//创建/死亡/复活时->移交控制权
		let roleInfo:any;//职业信息
		let roleStatus:any;//存活状态
		if (!mulRoleInfo) {
            roleInfo = this.roleInfoDic;
		}
		else {
            roleInfo = mulRoleInfo.roleInfo;
            roleStatus = mulRoleInfo.roleStatus;
            this.roleInfoDic = roleInfo;
		}
		if (roleInfo.key_I && roleInfo.key_I.length == 1)
			considerDeath = false;
		let leaderCareerSeq:number[] = [1, 2, 4];
		let leaderIndex:number;
		let baseCareer:number;
		let index:number = -1;
		let entity:RpgGameObject;
		let isSpecifyZeroRole:boolean = KingCache.isSpecifyZeroRole();
		for (let roleIndex of roleInfo.key_I) {
            baseCareer = CareerUtil.getBaseCareer(roleInfo.value_I[roleIndex]);
            this.multiRoleInfoList[roleIndex] = baseCareer;
            entity = this.getRoleEntity(roleIndex);
            if (index == -1 || index > leaderCareerSeq.indexOf(baseCareer)) {
            	if (roleStatus) {//初始化时
            		if (!considerDeath || roleStatus.value_I[roleIndex] == 1) {
                        index = leaderCareerSeq.indexOf(baseCareer);
                        leaderIndex = roleIndex;
					}
				} else if (!considerDeath || (entity && !entity.isDead())) {
                    index = leaderCareerSeq.indexOf(baseCareer);
                    leaderIndex = roleIndex;
				}
			}
			if (isSpecifyZeroRole) break;
		}
		if (leaderIndex >= 0) this.setLeaderRole(leaderIndex);
		Log.trace(Log.RPG, `更新主控制->${leaderIndex}`);
	}

	public static isSpecifyZeroRole():boolean {
        return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)
    }

    public static isSpecifyZeroRole2():boolean {
        return CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && CacheManager.copy.isInCopy;//待解决：主界面上血条不更新和必杀放不出来
    }

	/**是否我的主控角色 */
	public isLeaderEntity(entityId:any):boolean{
		let entityInfo:EntityInfo = CacheManager.role.getEntityInfo(this.leaderIndex);
		if(entityInfo){
			return EntityUtil.isSame(entityInfo.entityId,entityId);
		}
		return false;
	}

	// public checkUpdateRoleCtrl():void {
	// 	if (KingCache.isSpecifyZeroRole()) {
	// 		this.updateMultiRoleInfo();
	// 	}
	// }

	public setLeaderRole(leaderIndex:number):void {
		this.leaderIndex = leaderIndex;
		if (this.leaderEntity && this.leaderEntity.roleIndex != leaderIndex) {
			this.leaderEntity.initRoleLeader();
		}
        let leader:MainPlayer = this.getRoleEntity(leaderIndex) as MainPlayer;
        leader && leader.initRoleLeader();
	}

	public isLeaderRole(roleIndex:number):boolean{
		return this.leaderIndex == roleIndex;
	}

	public isMainLeader():boolean {
		return this.leaderIndex == 0;
	}

	public updateLastDirs():void {
		this.lastRoleDirs = [
			this.kingEntity?this.kingEntity.dir:-1
			, this.kingEntityII?this.kingEntityII.dir:-1
			, this.kingEntityIII?this.kingEntityIII.dir:-1
		];
	}

	public getLastDir(roleIndex:number):number {
		if (CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && this.lastRoleDirs[roleIndex] != undefined)
			return this.lastRoleDirs[roleIndex];
		return -1;
	}

	public isInSameGrid(roleIndex:number, excludeAction:Action = Action.Move):boolean {
		let roleLen:number = CacheManager.role.roles.length;
		let king:RpgGameObject;
		let curGrid:egret.Point = this.getRoleEntity(roleIndex).gridPoint;
		for (let i = 0;i < roleLen; i++) {
            king = this.getRoleEntity(i);
			if (king) {
                if (i != roleIndex
					&& curGrid.equals(king.gridPoint)
					&& king.action != excludeAction) {
					return true;
                }
			}
		}
		return false;
	}

	public getLeaderBattleObj() :RpgGameObject {
		return this.leaderEntity ? this.leaderEntity.battleObj : null;
	}

    get followEndRadius(): number {
        return this._followEndRadius;
    }

    set followEndRadius(value: number) {
        this._followEndRadius = value;
    }

	public isDead():boolean {
		if(this.kingEntity && !this.kingEntity.isDead()) {
			return false;
		}
		if(this.kingEntityII && !this.kingEntityII.isDead()) {
			return false;
		}
		if(this.kingEntityIII && !this.kingEntityIII.isDead()) {
			return false;
		}
		return true;
	}

	public clear():void {
		this.leaderEntity = null;
		if(this.kingEntity) {
			this.kingEntity.destory();
			this.kingEntity = null;
		}
        this.kingEntityII = null;
        this.kingEntityIII = null;
        CacheManager.battle.setRevivalWait(false);
	}
}