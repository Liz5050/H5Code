class CheckPointController extends BaseController {
    private copy: any;
    private curCheckPointNum: number;
    private hasJumpDic:{[cpId_type: number]: number} = {};//[关卡id_1关卡2关卡副本:跳跃标识]

    public constructor() {
        super(ModuleEnum.CheckPoint);
        this.viewIndex = ViewIndex.Zero;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCheckPointEnerge], this.onEnergeUpdate, this);
        this.addListen0(LocalEventEnum.EnterPointChallenge, this.onEnterChallengeHandler, this);
        this.addListen0(NetEventEnum.copyEnterCheckPoint, this.onEnterCheckPointCopy, this);
        this.addListen0(NetEventEnum.copySuccess, this.onCopySuccess, this);
        this.addListen0(NetEventEnum.copyInfUpdate, this.onCopyInfoUpdate, this);
        this.addListen0(LocalEventEnum.TaskFinished, this.onTaskFinished, this);
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
        this.addListen0(LocalEventEnum.SceneBeginCollect, this.onSceneBeginCollect, this);
        
    }

    private onSceneMapUpdated():void {
        this.removeListener(LocalEventEnum.RoleJumpComplete, this.onRoleJumpComplete, this);
        CacheManager.king.followEndRadius = 0;
    }

    /**闯关能量更新 */
    private onEnergeUpdate(data: any): void {
        // CacheManager.checkPoint.energe = data.value_I;
        // Log.trace(Log.FIGHT,"关卡杀怪能量更新",data.value_I);
        // if(data.value_I == 0){
        //     CacheManager.checkPoint.clientEnerge = 0;
        //     EventManager.dispatch(NetEventEnum.CheckPointKillsUpdate);
        // }
    }

    private onEnterChallengeHandler(): void {
        if(!CacheManager.sysSet.autoCopy) return;
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            Tip.showTip(LangArena.LANG33, Color.Red);
            return;
        }
        let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
        if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
            return;
        }
        if (CacheManager.copy.isInCopy) {
            return;
        }
        if (!CacheManager.checkPoint.canChallenge) {
            Tip.showTaskTopTip(LangCheckPoint.L2);
            return;
        }
        let copyCfg: any = CacheManager.checkPoint.curCopy;
        if (!copyCfg) {
            Tip.showTip(LangCheckPoint.L3);
            return;
        }
        CacheManager.checkPoint.clientEnerge = 0;
        CacheManager.checkPoint.isComplete = false;
        EventManager.dispatch(LocalEventEnum.CopyReqEnter, copyCfg.code);
    }

    private onCopyInfoUpdate(): void {
        if (App.DebugUtils.isDebug
            && ControllerManager.scene.sceneState == SceneStateEnum.AllReady
            && CacheManager.king.leaderEntity
            && !CacheManager.copy.isInCopy) {
            if (this.curCheckPointNum != CacheManager.checkPoint.passPointNum) {
                this.autoCheckPoint();
                EventManager.dispatch(NetEventEnum.copyLeftCheckPoint);
            }
        }
    }

    public autoCheckPoint(): void {
        let id: number = CacheManager.checkPoint.passPointNum;//CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
        if (id == 0 && !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.CheckPointAutoFight, false)) {
            return;
        }
        this.curCheckPointNum = id;
        let nextId: number = id + 1;
        if (nextId > ConfigManager.checkPoint.getMaxCheckPointNum()) nextId = ConfigManager.checkPoint.getMaxCheckPointNum();
        let cp: any = ConfigManager.checkPoint.getCheckPoint(nextId);
        let curMapId: number = CacheManager.map.mapId;

        if (cp) {
            let mapMaping: any = ConfigManager.mapMaping.getByPk(cp.mapId);
            let cpCopyMapId: number = mapMaping ? mapMaping.toMapId : NaN;
            let inCopy:boolean = CacheManager.copy.isInCopy;
            if (cp.mapId == curMapId || cpCopyMapId == curMapId) {
                if (this.checkIsInRange(nextId, cp)) {
                    Log.trace(Log.JUMP, "关卡跳跃结束/没有跳跃开始挂机~");
                    this.hasJumpDic[nextId+'_'+(inCopy ? 2 : 1)] = 1;//已完成当前关卡跳跃
                    EventManager.dispatch(LocalEventEnum.AutoStartFight, cp);
                } else {//寻路去跳跃点
                    let leader:MainPlayer = CacheManager.king.leaderEntity;
                    if (!leader) {
                        Log.trace(Log.FATAL, '找不到主控角色!');
                        return;
                    }
                    let jp = CacheManager.map.getJumpPointByCheckPointId(nextId, inCopy);
                    this.addListen0(LocalEventEnum.RoleJumpComplete, this.onRoleJumpComplete, this);
                    CacheManager.king.followEndRadius = 1;
                    // EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.Move, "data": { "x": Number(posArr[0]), "y": Number(posArr[1]), "distance": 0} });
                    leader.gotoGrid(jp.fromX, jp.fromY);
                    Log.trace(Log.JUMP,"进行关卡跳跃>>>>关卡id：", nextId, `(${jp.fromX},${jp.fromY})->(${jp.toX},${jp.toY})`);
                    if (!leader.path || leader.path.length <= 0) {//已经在跳跃点上，直接执行跳跃
                        Log.trace(Log.JUMP,"<<<<已经在跳跃点上，直接执行跳跃");
                        let moveComp:MoveComponent = <MoveComponent>leader.getComponent(ComponentType.Move);
                        moveComp && moveComp.checkSceneJump(jp.fromX, jp.fromY);
                    }
                }

            } else if (CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint)) {//从关卡副本中出来
                this.moveToPassPoint(curMapId, cp.mapId);
            }
        }
    }

    private moveToPassPoint(curMapId: number, toMapId: number): void {
        let pps: Array<any> = CacheManager.map.getCurMapScene().passPoints;
        if (pps && pps.length) {
            let pos: { x, y } = pps[0].point;
            pos && EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.Route, "data": { "mapId": curMapId, "x": pos.x, "y": pos.y, "distance": 0, "callBack": new CallBack(call, null) } });
        }
        function call(): void {
            ProxyManager.operation.convey(toMapId, EConveyType.EConveyTypeNormal, { "x": 0, "y": 0 });
            EventManager.dispatch(LocalEventEnum.SceneShowMaskEffect);//通过传送阵切地图 播放切场景的淡出效果
        }
    }

    /**
     * 检查是否在某个关卡的刷新点范围内
     * @param data
     * @returns {boolean}
     */
    private checkIsInRange(id:number, data:any):boolean {
        // if (/*CacheManager.copy.isInCopy || */!data.jumpPoint) return true;//副本内副本外都需要支持跳跃
        let inCopy:boolean = CacheManager.copy.isInCopy;
        let jp = CacheManager.map.getJumpPointByCheckPointId(id, inCopy);
        if (!jp) return true;
        if (this.hasJumpDic[id+'_'+(inCopy ? 2 : 1)] == 1) return true;
        let plan:number;
        let blockType:number;//刷怪点格子类型
        let planPosArr:Array<number>;//刷怪点坐标
        let findMonPosRadius:number;
        if (!CacheManager.copy.isInCopy) {
            findMonPosRadius = 500//CacheManager.battle.battle_config.FindMonsterPointRadius0;
            let wave:number = data.wave || 1;
            plan = data.plan1 + 0;
            blockType = 10 + plan;//10+刷怪方案=小怪挂机点

            planPosArr = CacheManager.map.getMapCoordsByBlockType(blockType);
            if (planPosArr) {
                if (PathUtils.isInPixRange(planPosArr[0], planPosArr[1], findMonPosRadius))
                    return true;
            }
        } else {
            findMonPosRadius = CacheManager.battle.battle_config.FindMonsterPointRadius1;
            plan = data.plan1 + 0//(Math.random() * data.wave >> 0);
            let startId:number = plan % 20 != 0 ? Math.floor(plan / 20) * 20 + 1 : plan - 20 + 1;
            blockType = startId+19;//19+(当前关卡起始id)=BOSS挂机点
            planPosArr = CacheManager.map.getMapCoordsByBlockType(blockType);
            if (planPosArr) {
                if (PathUtils.isInPixRange(planPosArr[0], planPosArr[1], findMonPosRadius))
                    return true;
            }
        }
        return false;
    }

    private onRoleJumpComplete():void {
        let king = CacheManager.king.leaderEntity;
        let jp:any = CacheManager.map.getJumpPoint(king.gridPoint.x, king.gridPoint.y);
        if (!jp) {
            //Log.trace(Log.JUMP, "跳跃结束，关卡挂机");
            this.removeListener(LocalEventEnum.RoleJumpComplete, this.onRoleJumpComplete, this);
            CacheManager.king.followEndRadius = 0;
            this.autoCheckPoint();
        }
    }

    /**
     * 成功进入关卡副本
     */
    private onEnterCheckPointCopy(): void {
        this.showTip(true);
        let num: number = ConfigManager.const.getConstValue("CheckpointPunchFloor");
        if(CacheManager.checkPoint.passPointNum + 1 == num) {//5秒自动释放必杀
            App.TimerManager.doDelay(5000, () => {
                if(CacheManager.guide.isHejiOk) {
                    EventManager.dispatch(UIEventEnum.ClickMainSkillItem, SkillCache.SKILLID_XP);
                }
            }, this);
        } else if(CacheManager.checkPoint.isCollectCheckpoint) {
            App.TimerManager.doDelay(1000, () => {
                let monster: RpgGameObject =  CacheManager.map.getNearestCollect();
                if (monster) {
                    monster.updateBuff({"buffId": 20110803, "type": EBufferOp.EBufferOpAdd});//单独锁链
                }
            }, this);
        }
    }

    private onSceneBeginCollect(sEntityId: any): void {
        if(CacheManager.checkPoint.isCollectCheckpoint) {
            let monster: RpgGameObject =  CacheManager.map.getNearestCollect();
            if (monster) {
                monster.updateBuff({"buffId": 20110803, "type": EBufferOp.EBufferOpRemove});//移除锁链
                monster.updateBuff({"buffId": 20110801, "type": EBufferOp.EBufferOpAdd});//锁链光圈
            }
            App.TimerManager.doDelay(5000, () => {
                if (monster) {
                    monster.updateBuff({"buffId": 20110801, "type": EBufferOp.EBufferOpRemove});//移除锁链光圈
                    monster.updateBuff({"buffId": 20110802, "type": EBufferOp.EBufferOpAdd});
                }
            }, this);
        }
    }

    /**
     * 副本成功，如击杀了boss
     */
    private onCopySuccess(copyCode: number): void {
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
            this.showTip(false);
        }
    }

    /**
     * 显示剧情提示
     */
    private showTip(isEnter: boolean): void {
        let tip: string = "";
        let checkPointCfg: any = ConfigManager.checkPoint.getCheckPoint(CacheManager.checkPoint.passPointNum + 1);
        if (checkPointCfg != null) {
            if (isEnter) {
                tip = checkPointCfg.enterImgNotice;
            } else {
                tip = checkPointCfg.exitImgNotice;
            }
        }
        if (tip != null && tip != "") {
            App.TimerManager.doDelay(200, () => {
                EventManager.dispatch(LocalEventEnum.ShowBroadStory, { msg: tip, isFirst: true });
            }, this);
        }
    }

    private onTaskFinished(taskCode: number): void {
        if (taskCode == ConfigManager.mgOpen.getOpenTask(MgOpenEnum.CheckPointAutoFight)) {
            this.autoCheckPoint();
        }
    }
}