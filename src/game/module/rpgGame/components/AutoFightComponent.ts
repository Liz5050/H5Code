/**
 * 副角色自动战斗控件
 * @author Chris
 */
class AutoFightComponent extends Component{
    private followComp: FollowComponent2;
    private canAttack: boolean;
    private isMoving: boolean;
    private roleIndex:number;
    private isSceneMapReady:boolean;
    private targetX:number = 0;
    private targetY:number = 0;

    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.dealInterval = 68;
        this.followComp = this.entity.getComponent(ComponentType.Follow2) as FollowComponent2;
        let entityId:any = this.entity.entityInfo.entityId;
        this.roleIndex = EntityUtil.isMainPlayerOther(entityId);
        EventManager.addListener(LocalEventEnum.KingStartAttack, this.onAttackStart, this);
        EventManager.addListener(LocalEventEnum.AIStop, this.onAttackStop, this);
        EventManager.addListener(LocalEventEnum.AutoStopFight, this.onAttackStop, this);
        EventManager.addListener(LocalEventEnum.ChangeMap, this.onChangeMap, this);
        EventManager.addListener(UIEventEnum.SceneMapUpdated, this.onChangeMapComp, this);
        this.isSceneMapReady = ControllerManager.scene.sceneState == SceneStateEnum.AllReady;
    }

    private onChangeMap():void {
        this.isSceneMapReady = false;
        this.canAttack = false;
        (this.entity as MainPlayer).stopMove(false);
    }

    private onChangeMapComp():void {
        this.isSceneMapReady = true;
        if (MapUtil.showCanAttackList()) EventManager.addListener(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
    }

    private onMonsterDied(entityId:any):void {//当前寻路过去的目标怪物死亡时，停止寻路
        let self = this;
        // console.log('onMonsterDied:', self.entity.entityInfo.selfIndex, EntityUtil.getEntityId(entityId), self.entity.battleObj && EntityUtil.getEntityId(self.entity.battleObj.entityInfo.entityId.id_I)
        // , self.canAttack);
        if (self.canAttack && !self.entity.isDead()
            && self.entity.battleObj && self.entity.battleObj.entityInfo && EntityUtil.isSame(self.entity.battleObj.entityInfo.entityId, entityId)) {
            self.entity.stopMove();
            self.canAttack = false;
            self.isMoving = false;
            self.entity.battleObj = null;
        }
    }

    private onAttackStart():void {
        if (!this.canAttack && this.isSceneMapReady && !this.entity.isDead() && this.entity.action != Action.Jump) {
            this.followComp.setFollowEntity(null);
            this.entity.stopMove();
            this.canAttack = true;
            this.update(0);
        }
    }

    private onAttackStop():void {
        this.followComp.setFollowEntity(CacheManager.king.leaderEntity);
        this.canAttack = false;
        this.isMoving = false;
        this.entity.battleObj = null;
    }

    public stop(): void {
        super.stop();
        this.canAttack = false;
        this.isMoving = false;
        this.followComp = null;
        this.targetX = -1;
        this.targetY = -1;
        EventManager.removeListener(LocalEventEnum.KingStartAttack, this.onAttackStart, this);
        EventManager.removeListener(LocalEventEnum.AIStop, this.onAttackStop, this);
        EventManager.removeListener(LocalEventEnum.AutoStopFight, this.onAttackStop, this);
        EventManager.removeListener(LocalEventEnum.ChangeMap, this.onChangeMap, this);
        EventManager.removeListener(UIEventEnum.SceneMapUpdated, this.onChangeMapComp, this);
        EventManager.removeListener(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
    }

    public update(advancedTime: number): void {
        let self = this;
        if (self.canAttack) {//这里做自动战斗逻辑
            let action:string = self.entity.action;
            if (Action.isActionLock(action))
                return;
            if (ControllerManager.battle.isLockBeforeChangeMap())
                return;
            if (self.entity.isDead() || self.entity.isCharging || CacheManager.buff.hasInterruptAttackBuff(this.roleIndex))
                return;
            let battleObj:RpgGameObject;
            let battleObjGP:egret.Point;
            if (self.isMoving) {//移动去打怪物结束判断1
                battleObj = self.entity.battleObj;
                battleObjGP = battleObj && !battleObj.isDead() ? battleObj.gridPoint : null;
                if(battleObjGP) {
                    if (self.canAttackRange(self.entity.gridPoint, battleObjGP, self.entity.currentSkillId)) {
                        self.isMoving = false;//移动结束
                        self.entity.stopMove();
                    }
                    else if(battleObjGP.x != this.targetX || battleObjGP.y != this.targetY){
                        this.move(battleObjGP.x, battleObjGP.y);
                    }
                }
                else {
                    self.isMoving = false;//移动结束
                    self.entity.stopMove();
                }
                return;
            }
            let king:MainPlayer = CacheManager.king.leaderEntity;//离主控角色太远判断2
            if (king && king.hasInit && egret.Point.distance(self.entity.pixPoint, king.pixPoint) > CacheManager.battle.battle_config.SubRoleFightFollowDis) {
                self.moveToKing(king);
                // Log.trace(Log.RPG, `辅助角色${self.entity.entityInfo.selfIndex}超出距离往回跑~`);
                return;
            }

            if (EntityUtil.isCollectionMonster(this.entity.battleObj))//目标是采集物时判断3
                return;

            battleObj = self.chooseTargetToAttack();
            if (battleObj && !battleObj.isDead() && action == Action.Stand && CacheManager.king.isInSameGrid(this.roleIndex) && self.moveToRandom(battleObj)) {//发起攻击的时候发现自己跟其他主角站在一起-走位保证不重叠3
                this.entity.battleObj = null;//会导致3角色不集中打一个目标的bug在选怪逻辑中去修复该问题，优先查找集火目标CacheManager.bossNew.battleObj
                return;
            }
            let skillId:number = self.chooseSkillToUse(battleObj);
            if (skillId) {//开打4
                self.entity.currentSkillId = skillId;
                self.selectEntity(battleObj, skillId);
            }
        }
    }

    private selectEntity(target:RpgGameObject, skillId:number):void {
        if (!this.moveToMonster(target, skillId)) {
            this.sendSkillCMD(skillId, target, this.entity.sPoint, RpgGameUtils.getAttackTargetPoint(this.entity));
        }
    }

    private chooseSkillToUse(battleObj: RpgGameObject):number {
        let skillId:number = 0;
        if (!battleObj || battleObj.isDead())
            return 0;
        if (this.roleIndex < 0) return;
        skillId = SkillUtil.chooseSkill(this.roleIndex, battleObj, CacheManager.battle.skillRule);

        /*if (skillId == 0 && EntityUtil.checkEntityIsCanAttackBySkill(battleObj, CacheManager.skill.normalSkillId)) {
            skillId = CacheManager.skill.normalSkillId;
        }*/
        return skillId;
    }

    private chooseTargetToAttack():RpgGameObject {
        let entity:RpgGameObject = this.entity;
        if (entity.battleObj == null || entity.battleObj.isDead()) {
            if(CacheManager.bossNew.battleObj) entity.battleObj = CacheManager.bossNew.battleObj;
            else {
                let autoFight:IAutoFight = CacheManager.battle.subAutoFightCtrl;
                if (autoFight)
                    entity.battleObj = autoFight.findTargetToAttack();//CacheManager.map.getNearestMonster(CacheManager.battle.autoBattleSearchDis, CacheManager.battle.targetBossCode);
                else
                    ControllerManager.battle.searchBattleObj(entity);
            }
            //console.log("副--->findMonster233333333", entity.battleObj == null, entity.battleObj && entity.battleObj.x)
        }
        return entity.battleObj;
    }

    private moveToMonster(target: RpgGameObject, skillId:number):boolean {
        let startGrid:egret.Point = this.entity.gridPoint;
        let targetGrid:egret.Point = target.gridPoint;//Log.trace(1, `gggggggg${this.king.col},${this.king.row}->${targetEntity.col},${targetEntity.row}  dis=${attackDis}`);
        if (this.canAttackRange(startGrid, targetGrid, skillId))
        {//Log.trace(Log.FIGHT, "moveToMonster000:");
            return false;
        }
        else
        {//移动到怪物
            this.move(targetGrid.x, targetGrid.y);
            return true;
        }
    }

    private move(targetX:number,targetY:number,moveType:EMoveType = EMoveType.EMoveTypeNormal):void {
        this.entity.gotoGrid(targetX, targetY, EMoveType.EMoveTypeNormal);
        this.isMoving = true;
        this.targetX = targetX;
        this.targetY = targetY;
    }

    private canAttackRange(startGrid:egret.Point, targetGrid:egret.Point, skillId:number):boolean {
        if (skillId == 0 || !targetGrid) return false;
        let skill:SkillData = CacheManager.skill.getSkill(skillId, this.roleIndex);
        let attackDis:number = skill.attackDistance;
        return PathUtils.canAttackRange(startGrid, targetGrid, attackDis, false, true);
    }

    private sendSkillCMD(skillId:number, target:RpgGameObject, fromPoint:any, mousePoint:any):void {
        let self = this;
        self.entity.stopMove();
        self.entity.playAttack(skillId, target);//Log.trace(Log.FIGHT, "sendSkillCMD.currentSkillId:0")
        self.entity.currentSkillId = 0;
        CacheManager.skill.preCoolSkill(skillId);
        let msg: any = {};
        let entityIds:any[] = target&&target.entityInfo?[target.entityInfo.entityId]:[];
        msg.cmd = ECmdGame[ECmdGame.ECmdGameFight];
        msg.body = {
            "index_I" : self.entity.entityInfo.selfIndex,
            "op_I": 0,
            "code_I": skillId,
            "fromPoint": fromPoint,
            "mousePoint": mousePoint,//技能目标点
            "entityIds": {"data":entityIds}
        };//Log.trace(Log.FIGHT, "sendSkill:", skillId, egret.getTimer(), App.TimerManager.curFrame, fromPoint.x_SH, fromPoint.y_SH, mousePoint.x_SH, mousePoint.y_SH, EntityUtil.getEntityId(entityIds[0]));
        App.Socket.send(msg); //发送
    }

    private moveToKing(king:MainPlayer):void {
        if (!king) return;
        if (!MapUtil.showCanAttackList()) this.entity.battleObj = null;//king.battleObj;//距离太远跑回去攻击主角的目标
        this.entity.stopMove();
        let randomDir:number = RpgGameUtils.computeGameObjDir(king.x, king.y, this.entity.x, this.entity.y);//Math.floor(Math.random() * 8);
        let randomCell:any;
        for (let i = 2; i > 0; i--) {
            randomCell = RpgGameUtils.getToDirCell(king.sPoint, randomDir, i);
            if (PathUtils.gridXYCanWalk(randomCell.x_SH, randomCell.y_SH)) break;
        }
        if (randomCell && PathUtils.gridXYCanWalk(randomCell.x_SH, randomCell.y_SH) == false) {
            randomCell = king ? king.sPoint : null;
        }//randomCell && console.log("moveToKing:", randomCell.x_SH, randomCell.y_SH, egret.getTimer())
        randomCell && this.entity.gotoGrid(randomCell.x_SH, randomCell.y_SH);
    }

    private moveToRandom(target:RpgGameObject):boolean {
        let entity:RpgGameObject = this.entity;
        let startPos:egret.Point = entity.pixPoint;
        let targetPos:egret.Point = target.pixPoint;
        let angle:number = Math.atan2((targetPos.y - startPos.y), (targetPos.x - startPos.x));
        let dis:number = egret.Point.distance(targetPos, startPos);
        if (dis < RpgGameData.GameCellWidth) return false;

        let newDis:number = 60;//先往前走60
        let newPos:egret.Point = new egret.Point(startPos.x + newDis * Math.cos(angle), startPos.y + newDis * Math.sin(angle));
        let newGrid:egret.Point = RpgGameUtils.convertXYToCell(newPos.x, newPos.y);
        let newGridX:number = newGrid.x;
        let newGridY:number = newGrid.y;

        if (newGrid.equals(target.gridPoint) || newGrid.equals(entity.gridPoint)) {
            newDis = 80;//先往前走80
            newPos.x = startPos.x + newDis * Math.cos(angle);
            newPos.y = startPos.y + newDis * Math.sin(angle);
            newGrid = RpgGameUtils.convertXYToCell(newPos.x, newPos.y);
            newGridX = newGrid.x;
            newGridY = newGrid.y;
            if (newGrid.equals(target.gridPoint) || newGrid.equals(entity.gridPoint))
                return false;
        }
        this.entity.gotoGrid(newGridX, newGridY);
        // Log.trace(Log.RPG, `辅助角色${this.roleIndex}${entity.gridPoint}发现跟其他角色重叠，往前走~${newGrid}`);
        // console.log("move===", dis, newDis, egret.Point.distance(targetPos, newPos));
        return true;
    }
}