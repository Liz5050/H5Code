/**
 * 自动挂机杀怪
 * @author Chris
 */
class AIAutoFight extends AIBase {
    private subCtrl: IAutoFight;
    private battleCtrl: BattleController;
    // private pickUpDelay: number = -1;
    // private hasDrop: boolean = false;

    public constructor(data?: any) {
        super(data);
        this.frameHold = 1;
        this.subCtrl = this.getSubCtrl();
        this.battleCtrl = ControllerManager.battle;

        CacheManager.battle.targetBossCode = this.subCtrl.getBossCode();
        CacheManager.battle.subAutoFightCtrl = this.subCtrl;
        CacheManager.king.isAutoFighting = true;
        EventManager.dispatch(LocalEventEnum.AutoFightChange);
        Log.trace(Log.RPG, "AIAutoFight-Start=>开始自动挂机，子控制器=>" + this.subCtrl["__class__"]);
    }

    private getSubCtrl(): IAutoFight {
        let autoFightCtrl:IAutoFight;
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMiningChallenge)) {
            autoFightCtrl = new AutoFightKingBattle();
        }
        else if (CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint)) {
            autoFightCtrl = new AutoFightCheckPoint(this.data);
        }
        else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPeakArena)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyContest)) {
            autoFightCtrl = new AutoFightKingBattle();
        }
        else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyQualifying)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangAttic)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgQiongCangHall)
            || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossIntruder)
            || (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar) && CacheManager.guildBattle.position != 0)) {
            autoFightCtrl = new AutoFightCampBattle();
        }
        else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossStair)) {
            autoFightCtrl = new AutoFightSearchTarget();
        }else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)){
            autoFightCtrl = new AutoFightDefend(this.data);
        }
        else if (CacheManager.copy.isInCopy) {
            autoFightCtrl = new AutoFightCopy(this.data);
        } else {
            autoFightCtrl = new AutoFightNormal(this.data);
        }

        let stayTime:number = 0;
        if (CacheManager.copy.isInCopy) {
            stayTime = CacheManager.battle.getCopyStayTime(ControllerManager.copy.currentType);
            if (stayTime == undefined) stayTime = 500;
        }
        autoFightCtrl.setUpdateDelay(stayTime);
        return autoFightCtrl;
    }

    public isComplete(data?: any): boolean {
        return false;
    }

    // private last:number = 0;
    public update(...params): boolean {
        if (super.update()) {
            if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady) return false;
            let self = this;
            let king:MainPlayer = CacheManager.king.leaderEntity;
           
            if (king == null
                || king.entityInfo == null
                || Action.isActionLock(king.action)
                || king.currentState == EntityModelStatus.ScaleTween
                // || king.isCollecting()
                || king.isDead()) {
                return false;
            }

            let nowTime:number = egret.getTimer();
            if (self.subCtrl.getUpdateDelay() > nowTime) {
                return false;
            }

            if (CacheManager.battle.getRevivalWaitTime() > nowTime) {
                return false;
            }

            let battleObj: RpgGameObject = king.battleObj;
            let ret: boolean = battleObj && EntityUtil.checkEntityIsCanAttack(battleObj);
            if (!ret) {
                ret = self.subCtrl.update();
                battleObj = king.battleObj;
            }
            if (ret && battleObj && EntityUtil.checkEntityIsCanAttack(battleObj)) {
                self.battleCtrl.stepFight();
                return false;
            }
        }
        return false;
    }

    public stop(): void {
        CacheManager.battle.targetBossCode = -1;
        CacheManager.battle.subAutoFightCtrl = null;
        CacheManager.king.isAutoFighting = false;
        EventManager.dispatch(LocalEventEnum.AutoFightChange);
        Log.trace(Log.RPG, "AIAutoFight-Stop=>挂机停止了1");
    }

}