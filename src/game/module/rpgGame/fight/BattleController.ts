/**
 * 战斗控制器
 * @author Chris
 */
class BattleController extends BaseController {
    private gameView: RpgGameView;
    private king: MainPlayer;
    private fightModeChange: boolean;
    private lockAttackTime: number = 0;
    private lockXPTime: number = 0;
    private lockBeforeChangeMapTime: number = 0;
    private lastClickSkillId: number = 0;
    private firstMoveRushFlag: boolean;

    public constructor() {
        super(ModuleEnum.Battle);
    }

    public initView(): BaseModule {
        return null;
    }

    public addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.LeaderRoleChange, this.onKingChanged, this);
        this.addListen0(UIEventEnum.SceneMapUpdated, this.onSceneMapUpdated, this);
        this.addListen0(LocalEventEnum.GameViewOpen, this.onGameViewOpen, this);
        // this.addListen1(LocalEventEnum.UseSkill, this.onUseSkill, this);
        this.addListen0(LocalEventEnum.SceneClickEntity, this.onClickSceneEntity, this);
        this.addListen0(LocalEventEnum.CheckBattleObj, this.checkBattleObj, this);
        this.addListen0(LocalEventEnum.LockAttack, this.lockAttack, this);
        this.addListen0(UIEventEnum.ClickMainSkillItem, this.onClickSkillItem, this);
        this.addListen0(NetEventEnum.roleFightModel, this.changeFightMode, this);
        this.addListen0(LocalEventEnum.FocusAttack, this.onFocusAttack, this);
        //请求进入副本的瞬间，给个锁定时间
        this.addListen0(LocalEventEnum.CopyReqEnter, this.lockBeforeChangeMap, this);
        this.addListen0(LocalEventEnum.BossReqEnterPersonalBoss, this.lockBeforeChangeMap, this);
        this.addListen0(LocalEventEnum.SceneClickGround,this.onClickGroundHandler,this);
    }

    private onGameViewOpen(): void {
        this.gameView = ControllerManager.rpgGame.initView() as RpgGameView;
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityDoFight], this.onDoFight, this);
        // this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityBeginFight], this.onBeginFight, this);
    }

    private onKingChanged(): void {
        this.king = CacheManager.king.leaderEntity;
    }

    private onSceneMapUpdated(): void {
        this.lastClickSkillId = 0;
        this.lockXPTime = 0;
        if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)
            && !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife))
            this.firstMoveRushFlag = true;
        CacheManager.battle.skillRule = MapUtil.getSkillRule();
        CacheManager.battle.resetRushTime();
    }

    private resetFirstRushFlag(): void {
        if (!MapUtil.isNewPlayerMap())
            this.firstMoveRushFlag = false;
    }

    private onClickSkillItem(skillId: number): void {
        if (this.king == null || this.king.isDead())
            return;
        this.lastClickSkillId = skillId;
        let isXPSkill: boolean = skillId == SkillCache.SKILLID_XP;
        let isAutoFighting: boolean = CacheManager.king.isAutoFighting;
        if (!isXPSkill) {
            if (isAutoFighting)
                return;
            EventManager.dispatch(LocalEventEnum.AIStop);//手点技能
        } else {
            let isBattleObjIsCollect:boolean = EntityUtil.isCollectionMonster(this.king.battleObj);
            if ((!this.king.battleObj || isBattleObjIsCollect)
                && (!isAutoFighting || !this.findAutoFightTarget())) {//XP技能一定要有可攻击目标，没目标且是挂机状态的时候才自动去找
                Tip.showTip(LangFight.LANG4);
                return;
            }
            if (isBattleObjIsCollect) {//点了采集物，再点了必杀，此时应把目标置空
                CacheManager.bossNew.battleObj = null;
            }
        }

        if (CacheManager.skill.canSkillCd(skillId) == false) {
            skillId = this.chooseSkillToUse(this.king.battleObj, true);
        }
        if (skillId == 0)
            return;
        if ((EntityUtil.checkEntityIsCanAttack(this.king.battleObj) || this.searchBattleObj(this.king)) /*&& !isXPSkill*/) {
            this.king.currentSkillId = skillId;
            this.selectEntity(this.king.battleObj, skillId, false, true);
        }
        else {
            this.onUseSkill(skillId);
        }
    }

    private onUseSkill(skillId: number): void {
        if (skillId != SkillCache.SKILLID_XP) {
            if (this.isLockLeader())
                return;
            if (Action.isActionLock(this.king.action))//主角采集中/攻击中/跳跃中
                return;
        }
        else {//合击技能释放的条件判断
            if (this.isLockBeforeChangeMap())
                return;
            if (Action.isActionNoPlayPart(this.king.action))//主角采集中/跳跃中..
                return;
        }
        if (CacheManager.buff.hasInterruptAttackBuff(0)) {
            Tip.showTip(LangFight.LANG3);
            return;
        }

        this.sendSkillCMD(skillId, this.king.battleObj, this.king.sPoint, RpgGameUtils.getAttackTargetPoint(this.king));
    }

    private onFocusAttack(target: RpgGameObject, isCollect:boolean = false): void {
        let king: MainPlayer = CacheManager.king.kingEntity;
        if (king && !king.isDead())  {
            if (isCollect) king.battleObj = null;//采集物，先清掉原先的目标
            king.battleObj = target;
        }
        let king2: MainPlayer = CacheManager.king.kingEntityII;
        if (king2 && !king2.isDead()) {
            if (isCollect) king2.battleObj = null;
            king2.battleObj = target;
        }
        let king3: MainPlayer = CacheManager.king.kingEntityIII;
        if (king3 && !king3.isDead()) {
            if (isCollect) king3.battleObj = null;
            king3.battleObj = target;
        }
    }

    private sendSkillCMD(skillId: number, target: RpgGameObject, fromPoint: any, mousePoint: any): void {
        let self = this;
        let roleIndex: number = self.king.roleIndex;
        if (skillId == 0 || roleIndex < 0 || roleIndex > CacheManager.role.roles.length - 1) return;

        self.king.stopMove();
        self.king.playAttack(skillId, target);//Log.trace(Log.FIGHT, "sendSkillCMD.currentSkillId:0")
        self.king.currentSkillId = 0;
        self.lockAttack(200);
        if (skillId != SkillCache.SKILLID_XP) CacheManager.skill.preCoolSkill(skillId);
        if (skillId == this.lastClickSkillId) this.lastClickSkillId = 0;
        let msg: any = {};
        let entityIds: any[] = target && target.entityInfo ? [target.entityInfo.entityId] : [];
        msg.cmd = ECmdGame[ECmdGame.ECmdGameFight];
        msg.body = {
            "index_I": skillId != SkillCache.SKILLID_XP ? roleIndex : 0,//合击技能只在0号角色上
            "op_I": 0,
            "code_I": skillId,
            "fromPoint": fromPoint,
            "mousePoint": mousePoint,//技能目标点
            "entityIds": {"data": entityIds}
        };
        Log.trace(Log.FIGHT, "sendSkill:", skillId, egret.getTimer(), App.TimerManager.curFrame, fromPoint.x_SH, fromPoint.y_SH, mousePoint.x_SH, mousePoint.y_SH, EntityUtil.getEntityId(entityIds[0]));
        App.Socket.send(msg); //发送
    }

    /**
     * 其他副本或ai，也会发SceneClickEntity，统一在这里做是否能攻击或选怪的处理
     * isAuto:是否自动
     * isManual:是否手动点击
     * */
    private onClickSceneEntity(entity: RpgGameObject, isAuto: boolean = true, isManual: boolean = false, isFocus: boolean = false): void {
        if (this.king.currentSkillId == 0) {
            this.king.currentSkillId = this.chooseSkillToUse(entity);
            Log.trace(Log.FIGHT, "onClickSceneEntity.currentSkillId:" + this.king.currentSkillId)
        }
        this.selectEntity(entity, this.king.currentSkillId, isAuto, isManual, isFocus);
        // let skillId:number = this.chooseSkillToUse(entity);
        // if (skillId != 0)
        // {
        //     this.king.currentSkillId = skillId;
        //     this.selectEntity(entity, skillId, isAuto, isManual);
        // }
    }

    public stepFight(): void {
        let skillId: number = this.chooseSkillToUse(this.king.battleObj);
        if (skillId != 0) {
            this.king.currentSkillId = skillId;
            this.selectEntity(this.king.battleObj, skillId, true);
        }
    }

    private selectEntity(target: RpgGameObject, skillId: number = 0, isAuto: boolean = true, isManual: boolean = false, isFocus: boolean = false): void {
        Log.trace(Log.FIGHT, "selectEntity:", target && EntityUtil.getEntityId(target.entityInfo.entityId), skillId, egret.getTimer(), isManual)
        let self = this;
        let action: string = self.king.action;
        if (skillId != SkillCache.SKILLID_XP || isManual == false) {//合击技能无视锁定
            if (Action.isActionLock(action)) {
                Log.trace(Log.FIGHT, "selectEntity000:action=", action);
                return;
            }
            if (self.isLockLeader())
                return;
        }
        if (self.king.isDead() || target == null || target.isDead())
            return;
        if (self.king.isCharging || self.king.currentState == EntityModelStatus.ScaleTween || CacheManager.buff.hasInterruptAttackBuff(0))
            return;
        // self.king.isTouchGround = false;
        // ControllerManager.rpgGame.view.hideClickPointMc();
        if (EntityUtil.checkEntityIsCanAttack(target, isManual)) {
            let battleObj: RpgGameObject = self.king.battleObj;
            if (battleObj == target || isAuto)//自动模式下不用选中两次才开始攻击
            {
                if (battleObj != target) {
                    if(!isFocus) {
                        self.king.battleObj = target;
                    }
                    else 
                    {
                        this.onFocusAttack(target);
                    }
                } 
                if (!self.moveToMonster(target, skillId)) {
                    //无需移动
                    if (EntityUtil.isCollectionMonster(target)) {
                        //采集怪因为要跟普通怪一样，需要先选中，再次选中才开始采集
                        //所以采集怪判定为可被攻击的实体
                        self.king.startCollect(target);
                    }
                    else {
                        // self.king.playAttack(skillId, target);
                        self.sendSkillCMD(skillId, target, self.king.sPoint, RpgGameUtils.getAttackTargetPoint(self.king));
                    }
                }//else{Log.trace("exe move");}
                // self.king.isBeingAttacked = false;
            }
            else {
                //选中目标
                if(!isFocus) {
                    self.king.battleObj = target;
                }
                else 
                {
                    this.onFocusAttack(target);
                }
            }
        }
        else if (!EntityUtil.isSpecificBossType(target.entityInfo)) {
            let objType: number = target.objType;
            // if (self.king.battleObj != target) {
            //     self.king.battleObj = target;
            // }
            if (objType == RpgObjectType.Npc) {
                self.moveToNpc(target);
            }
            else if (objType == RpgObjectType.PassPoint) {
                self.moveToPassPoint(target);
            }
            else if (objType == RpgObjectType.Drop || objType == RpgObjectType.DropPublic) {
                self.moveToDrop(target);
            }
        }
        else if (EntityUtil.isMinerBossType(target.entityInfo)) {
            self.moveToMiner(target);
        }
    }

    private changeFightMode(): void {
        this.fightModeChange = true;
    }

    /**
     * 空闲时候自动搜索可攻击的怪物/玩家
     */
    private checkBattleObj(): void {
        let battleObj: RpgGameObject = this.king.battleObj;
        if (!(CacheManager.king.isAutoFighting || this.king.isCollecting())
            && (!battleObj || this.fightModeChange || !EntityUtil.checkEntityIsCanAttack(battleObj) || !RpgGameUtils.checkInScreen(battleObj.pixPoint))) {
            this.fightModeChange = false;
            this.searchBattleObj(this.king);
        }
    }

    public searchBattleObj(king: RpgGameObject): boolean {
        let _entitys = king.gameView.getEntitys();
        let _maxMonster: number = Number.MAX_VALUE;
        let _maxPlayer: number = Number.MAX_VALUE;
        let _checkMonster: RpgGameObject;
        let _checkPlayer: RpgGameObject;
        let _fightMode: number = CacheManager.role.player.mode_I;
        let _roleEntityInfo: EntityInfo = CacheManager.king.kingEntity.entityInfo;//拿主角的数据
        let _otherEntityInfo: EntityInfo;
        let _searchDis: number = CacheManager.battle.battle_config.AutoBattleSearchDis;//king.objType == RpgObjectType.MainPlayer ? CacheManager.battle.battle_config.AutoBattleSearchDis : -1;
        for (let _key in _entitys) {
            let entity = _entitys[_key];
            if (!EntityUtil.checkEntityIsCanAttack(entity)
                || (/*CacheManager.king.isAutoFighting && */EntityUtil.isCollectionMonster(entity)))
                continue;
            let _dis: number = App.MathUtils.getDistance(entity.col, entity.row, king.col, king.row);
            if (_searchDis != -1 && _dis >= _searchDis) continue;
            if (entity.objType == RpgObjectType.Monster && _dis < _maxMonster) {
                _maxMonster = _dis;
                _checkMonster = entity;
            }
            else if (entity.objType == RpgObjectType.OtherPlayer && _dis < _maxPlayer) {
                // _otherEntityInfo = entity.entityInfo;
                // if (_fightMode == EEntityFightMode.EEntityFightModeCompulsion
                //     && (_otherEntityInfo == null
                //         || (_roleEntityInfo.guildId_I != 0 && _roleEntityInfo.guildId_I == _otherEntityInfo.guildId_I) //同仙盟
                //         || CacheManager.team.getTeamMember(_otherEntityInfo.entityId) != null))//同队的.强制模式下不选
                //     continue;
                _maxPlayer = _dis;
                _checkPlayer = entity;
            }
        }
        if (_checkMonster)//先选怪
            king.battleObj = _checkMonster;
        else if (_checkPlayer)
            king.battleObj = _checkPlayer;
        else {
            king.battleObj = null;
            return false;
        }
        return true;
    }

    /**
     * 寻找自动挂机目标
     * @returns {boolean}
     */
    private findAutoFightTarget():boolean {
        let autoFight:IAutoFight = CacheManager.battle.subAutoFightCtrl;
        if (autoFight) {
            this.king.battleObj = autoFight.findTargetToAttack();
        }
        return this.king.battleObj != null;
    }

    protected moveToMonster(target: RpgGameObject, skillId: number): boolean {
        if (skillId == 0) return;
        let skill: SkillData = CacheManager.skill.getSkill(skillId, skillId != SkillCache.SKILLID_XP ? this.king.roleIndex : 0);

        let attackDis: number = skill.attackDistance;
        let targetType: number = target.objType;
        let isCollectMonster: boolean = EntityUtil.isCollectionMonster(target);
        let ignoreAttackDis: boolean = ConfigManager.skill.isSkillTargetToMySelf(skill.targetType) && !isCollectMonster;//目标类型是自身，无视攻击距离不需要走动
        if (isCollectMonster) attackDis = ConfigManager.const.getConstValue("CollectDistance");

        let startGrid: egret.Point = this.king.gridPoint;
        let targetGrid: egret.Point = target.gridPoint;//Log.trace(1, `gggggggg${this.king.col},${this.king.row}->${targetEntity.col},${targetEntity.row}  dis=${attackDis}`);
        let ignoreBlock: boolean = !(targetType == RpgObjectType.Monster || targetType == RpgObjectType.OtherPlayer);
        !ignoreBlock && !isCollectMonster && EventManager.dispatch(LocalEventEnum.KingStartAttack);//主角准备开始攻击
        if (ignoreAttackDis || PathUtils.canAttackRange(startGrid, targetGrid, attackDis, ignoreBlock, !isCollectMonster)) {
            Log.trace(Log.FIGHT, "moveToMonster000:");
            return false;
        }
        else {
            AI.removeAI(AIType.MoveToMonster);
            this.king.stopMove();
            Log.trace(Log.FIGHT, "moveToMonster111:", AI.aiListArr, AI.aiListLength);
            AI.addAI(AIType.MoveToMonster, {
                target,
                targetGrid,
                distance: attackDis,
                ignoreBlock,
                stepRush: this.firstMoveRushFlag
            });
            this.resetFirstRushFlag();
            return true;
        }
    }

    private moveToNpc(npc: RpgGameObject): void {
        let npcInfo: NpcInfo = npc && npc.entityInfo as NpcInfo;
        if (npcInfo) EventManager.dispatch(LocalEventEnum.AIStart, {
            "type": AIType.MoveToNpc,
            "data": {npcId: npcInfo.id, isClick: true}
        });
    }

    private moveToPassPoint(passPoint: RpgGameObject): void {
        let passInfo: PassPointInfo = passPoint && passPoint.entityInfo as PassPointInfo;
        if (passInfo) EventManager.dispatch(LocalEventEnum.AIStart, {
            "type": AIType.MoveToPassPoint,
            "data": {passPointId: passInfo.passPointId}
        });
    }

    private moveToDrop(drop: RpgGameObject): void {
        if (drop) EventManager.dispatch(LocalEventEnum.AIStart, {
            "type": AIType.MoveToDrop,
            "data": {"drop": drop}
        });
    }

    private moveToMiner(miner: RpgGameObject): void {
        if (miner) {
            let miningInfo: any = CacheManager.mining.getMiningInfo(miner.entityInfo.minerPos_BY);
            if (!CacheManager.mining.isMyMining(miningInfo)) {
                if (CacheManager.mining.myMiningInfo.robTimes_I >= ConfigManager.mining.getMiningStaticDataKey("robTimes")) {
                    Tip.showTip(LangMining.LANG52, Color.Red);
                    return;
                }
                if (miningInfo.robbedTimes_I >= ConfigManager.mining.getMiningStaticDataKey("robbedTimesOne")) {
                    Tip.showTip(LangMining.LANG56, Color.Red);
                    return;
                }
                if (CacheManager.mining.hasRobOtherSucc(miningInfo)) {
                    Tip.showTip(LangMining.LANG53, Color.Red);
                    return;
                }
                EventManager.dispatch(LocalEventEnum.AIStart, {"type": AIType.MoveToMiner, "data": {"miner": miner}});
            }
        }
    }

    /**
     * 寻找一个可以使用的技能
     */
    public chooseSkillToUse(battleObj: RpgGameObject, ignoreBattleObj: boolean = false): number {
        let skillId: number = 0;
        if (EntityUtil.checkEntityIsCanAttack(battleObj) == false && !ignoreBattleObj)
            return 0;
        if (this.lastClickSkillId != 0 && EntityUtil.checkEntityIsCanAttackBySkill(battleObj, this.lastClickSkillId))
            return this.lastClickSkillId;//取当前点击的技能
        if (EntityUtil.checkEntityIsCanAttackBySkill(battleObj, SkillCache.SKILLID_XP) && CacheManager.sysSet.canAutoXP)
            return SkillCache.SKILLID_XP;//自动释放合击

        skillId = SkillUtil.chooseSkill(this.king.roleIndex, battleObj, CacheManager.battle.skillRule);
        /*if (skillId == 0 && EntityUtil.checkEntityIsCanAttackBySkill(battleObj, CacheManager.skill.normalSkillId))
        {
            skillId = CacheManager.skill.normalSkillId;
        }*/
        Log.trace(Log.FIGHT, "chooseSkillToUse=", skillId);
        return skillId;
    }

    /**
     * 战斗数据下发，属性更新等，下发协议，结构：SFightDataSeq
     * */
    private onBeginFight(param: any): void {
        let fightDataLen: number = param.doFightExSeq.data.length;
    }

    /**
     * 战斗数据下发，属性更新等，下发协议，结构：SFightDataSeq
     * */
    private onDoFight(param: any): void {
        let fightDataLen: number = param.doFightExSeq.data.length;
        // Log.trace(">>>> dofight SFightDataSeq:", param.doFightExSeq, fightDataLen);
        for (let i = 0; i < fightDataLen; i++) {
            let SFightData = param.doFightExSeq.data[i];
            //beginPropertyUpdates处理
            // Log.trace(">>>>别人，beginPropertyUpdates:", SFightData.beginPropertyUpdates);
            let skillId = 0;
            let targetPointX: number = 0;
            let targetPointY: number = 0;
            let serverDir: number = 0;
            let beginPropertyUpdatesLen = SFightData.beginPropertyUpdates.data instanceof Array ? SFightData.beginPropertyUpdates.data.length : 0;
            for (let j = 0; j < beginPropertyUpdatesLen; j++) {
                let sAttributeUpdate = SFightData.beginPropertyUpdates.data[j];
                let attr: number = sAttributeUpdate.attribute;
                let valueNum: number = sAttributeUpdate.value_I;
                let valueStrNum: number = parseInt(sAttributeUpdate.valueStr_S);
                switch (attr) {
                    case EEntityAttribute.EAttributeAttackSkill://技能ID
                        skillId = valueNum;
                        break;
                    case EEntityAttribute.EAttributePointX:
                        targetPointX = valueNum;
                        break;
                    case EEntityAttribute.EAttributePointY:
                        targetPointY = valueNum;
                        break;
                    case EEntityAttribute.EAttributeDirection:
                        serverDir = valueNum;
                        break;
                }
            }

            //fightedInfoSeq处理
            let fightedInfoSeqLen: number;
            let SFightedInfo: any;
            let targetObject: RpgGameObject;
            let entityObject: RpgGameObject = this.gameView.getEntityObject(SFightData.fromEntity);
            fightedInfoSeqLen = SFightData.fightedInfoSeq.data.length;
            let targetList: Array<RpgGameObject> = [];
            for (let k = 0; k < fightedInfoSeqLen; k++) {
                SFightedInfo = SFightData.fightedInfoSeq.data[k];
                // Log.trace(">>>>>>>>>>>>>-------<<<<<<<<<<<<<<<");
                // Log.trace(">>>> SFightedInfo[:" + i + "]:", SFightedInfo);
                // Log.trace(">>>>>>>>>>>>>-------<<<<<<<<<<<<<<<");
                // Log.trace("******* SEntityInfo[:" + i + "].类型:", SEntityInfo.entityId.type_BY);

                let _entity: RpgGameObject = this.gameView.getEntityObject(SFightedInfo.toEntity);
                if (_entity) {
                    _entity.fromSkillId = skillId;
                    // _entity.propertyUpdates(SFightedInfo,entityObject);
                    targetList.push(_entity);
                }
                CacheManager.map.updateEntityInfo(SFightedInfo);

                if (SFightedInfo.fromEntity.id_I == SFightData.fromEntity.id_I && !targetObject) {
                    targetObject = _entity;
                }
            }

            let isKing: boolean = EntityUtil.isMainPlayerOther(SFightData.fromEntity) >= 0;
            if (null == entityObject) { //没有攻击者，只更新其他玩家属性

            }
            else {
                if (isKing == false) {//其他玩家播放攻击
                    entityObject.playAttack(skillId, targetObject);
                }
            }
            if (isKing) {
                CacheManager.skill.coolSkill(skillId);
                if (skillId == SkillCache.SKILLID_XP) {//合击技能定位到主控制上
                    entityObject = CacheManager.king.leaderEntity;
                    this.lockXP(CacheManager.battle.battle_config.XPSkillLockTime);
                }
                // EventManager.dispatch(LocalEventEnum.KingStartAttack);//主角准备开始攻击
                Log.trace(Log.FIGHT, "onFight:", skillId, targetObject && targetObject.entityInfo && EntityUtil.getEntityId(targetObject.entityInfo.entityId));
            }
            SkillUtil.playSkill(skillId, entityObject, targetObject, targetList, targetPointX, targetPointY);
        }
    }

    private lockAttack(lockTime: number): void {
        this.lockAttackTime = egret.getTimer() + lockTime;
    }

    public lockXP(lockTime: number): void {
        this.lockXPTime = egret.getTimer() + lockTime;
    }

    private lockBeforeChangeMap(): void {
        this.lockBeforeChangeMapTime = egret.getTimer() + 500;
    }

    public isLockLeader(): boolean {
        return this.lockAttackTime > egret.getTimer() || this.isLockAll();
    }

    public isLockBeforeChangeMap(): boolean {
        return this.lockBeforeChangeMapTime > egret.getTimer();
    }

    public isLockAll(): boolean {
        let now: number = egret.getTimer();
        return this.lockXPTime > now || this.isLockBeforeChangeMap();
    }

    private onClickGroundHandler():void {
        CacheManager.battle.isNearAttack = false;
    }
}