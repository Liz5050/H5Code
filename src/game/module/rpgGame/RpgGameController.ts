
class RpgGameController extends BaseController {

    private gameView: RpgGameView;
    // private gameModel: RpgGameModel;
    /** 延迟处理函数 */
    // private delayExecute: FrameExecutor;
    private isClear:boolean;
    private fightView:RpgFightPlayersView;
    public bossLifeBar:RpgBossInfView;
    private collectView:SceneCollectBarView;
    private teamView:RpgTeamView;

    private bgMask:fairygui.GImage;
    private isMaskInit:boolean;
    private maskLoader:GLoader;
    private maskBitmap:egret.Bitmap;
    private maskFloor:number = 16;

    private dropInfos:DropPrivateInfo[] = [];
    public constructor() {
        super(ModuleEnum.RpgGame);
        // this.delayExecute = new FrameExecutor(10);

        //View初始化
        this.gameView = new RpgGameView(this, LayerManager.Game_Main);
        UIManager.register(ModuleEnum.RpgGame, this.gameView, ViewIndex.Zero);

        //注册模块消息
        // this.registerFunc(RpgGameConst.GameInit, this.gameInit, this);
        // this.registerFunc(RpgGameConst.GameResize, this.gameResize, this);

        // this.registerFunc(RpgGameConst.RpgGameViewOpen, this.rpgGameViewOpen, this);
    }

    public addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.GameReSize, this.gameResize, this);
        this.addListen0(LocalEventEnum.GameInit, this.gameInit, this);
        this.addListen0(LocalEventEnum.AppPause, this.appPause, this);
        this.addListen0(LocalEventEnum.AppResume, this.appResume, this);
        this.addListen0(NetEventEnum.SocketClose,this.onSocketClostHandler,this);
        this.addListen0(UIEventEnum.ViewOpened, this.renderOptimizeCheck, this);
        this.addListen0(UIEventEnum.ViewClosed, this.renderOptimizeCheck, this);
        this.addListen0(LocalEventEnum.ReloginCloseGameView,this.onReloginHandler,this);

        this.rpgGameViewOpen();
    }

    public initView(): IBaseView {
        return this.gameView;
    }

    public get view(): RpgGameView {
        return this.gameView;
    }

    /**
     * 主角升级
     * 暂时没用到
     * */
    private onRoleLevelUpdate(data:any = null):void {
        // let level:number = CacheManager.role.role.level_I;
        // if(level > TaskCache.newPlayerLevel) {//图片失效时长
        //     GLoader.FAILURE_TIME = 5 * 60 * 1000;
        // } else {
        //     GLoader.FAILURE_TIME = 2 * 1000;
        // }
    }

    private renderOptimizeCheck():void {//渲染优化：打开一级界面时不渲染
        if (this.isShow) {
            let curLevel:ERpgRenderLevel = this.gameView.getRenderLevel();
            let isOpenModule:boolean = UIManager.isOpenModule();
            let isOpenPopup:boolean = UIManager.isOpenPopup();
            let renderLv:ERpgRenderLevel = isOpenModule ? ERpgRenderLevel.NONE : (isOpenPopup ? ERpgRenderLevel.ONLY_MAP : ERpgRenderLevel.FULL);
            if (curLevel != renderLv) {
                this.gameView.setRender(renderLv);
            }
        }
    }

    private updateBgMask(isShow:boolean):void {
        if(!this.bgMask) {
            let obj:fairygui.GObject = fairygui.UIPackage.createObject(PackNameEnum.Common, "gameBg");
            if(obj) {
                this.bgMask = obj.asImage;
                // LayerManager.Game_Mask.addChild(this.bgMask);
                this.bgMask.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                this.bgMask.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
            }
        }
        if(isShow) {
            LayerManager.Game_Mask.addChild(this.bgMask); /*&& !App.DeviceUtils.IsPC && !App.DeviceUtils.IsIPad && !UIManager.isOpenPopup()*/;
        } else if (this.bgMask.parent) {
            this.bgMask.removeFromParent();
        }
    }

    private gameInit(mapId: number, loginMsg: any) {
        Log.trace(Log.RPG, "$$$$ ggameInit：" + mapId);
        if(this.isShow) {
            this.onChangeMap(mapId);
            // if(resMapId != this.gameView.getBackground().mapId) {
            //     ControllerManager.scene.preloadMapRes(resMapId, this.mapResComplete, this);
            // }
            // else {
            //     CacheManager.map.parseCurrentMapData();
            //     this.gameView.initEntity();
            //     this.gameView.resetMainPlayerPoint({ posX_I: loginMsg.pos.x_I, posY_I: loginMsg.pos.y_I });
            //     if(ControllerManager.scene.sceneReady) {
            //         EventManager.dispatch(UIEventEnum.SceneMapUpdated);
            //     }
            //     else {
            //         ControllerManager.scene.sceneState = SceneStateEnum.AllReady;
            //     }
            // }
        }
        else {
            if(CacheManager.map.mapId == undefined) {
                CacheManager.map.mapId = mapId;
            }
            let resMapId:number = CacheManager.map.getMapResId();
            ControllerManager.scene.preloadMapRes(resMapId, this.mapResComplete, this);
        }
        // this.onRoleLevelUpdate();
    }

    private appPause() {
        //console.log("RpgGameController： App 进入后台了");
        let _isMute: boolean = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
        if(!_isMute) {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
        }
        if(!App.Socket.isConnecting()) {
            //已经断线了
            this.isClear = false;
            return;
        }
        this.isClear = true;
        if(App.DeviceUtils.IsPC)
        {
            // this.isClear = App.DeviceUtils.isMinimize;
        }

        if(this.isClear){
            //清理场景元素
            // if(ControllerManager.scene.sceneReady && this.gameView) {
            //     ControllerManager.login.doHeartbeat(false);
            //     App.Socket.close();
            //     UIManager.closeAll();
            //     this.gameView.clearEntity();
            //     EventManager.dispatch(UIEventEnum.GuideClear);
            // }
        }
    }

    private appResume() {
        // console.log("RpgGameController： App 进入前台，从后台回来了");
        let _isMute: boolean = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
        if(!_isMute) {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
        }
        if(ControllerManager.scene.sceneReady && this.isClear && !App.Socket.isConnecting() && !ControllerManager.login.needReLogin) {
            AlertII.instance && AlertII.instance.hide();
            if (ControllerManager.login.needConnectFromLogin) { //服务器超过60秒+10秒后，就只能刷新重新登陆才可以上游戏了
                // ControllerManager.login.ReconnectFromLogin();
                ControllerManager.createRole.listerToLoginGate();
            } else {
                ControllerManager.createRole.listerToLoginGate();
            }
        }
    }

    /**断开连接 */
    private onSocketClostHandler():void {
        if(this.isShow) {
            this.gameView.clearEntity();
            CacheManager.map.deleteAllEntity();
        }
    }

    private onReloginHandler():void {
        if(this.gameView) {
            CacheManager.role.clear();
            CacheManager.king.clear();
            egret.Tween.removeTweens(this.gameView.getGameTweenLayer());
        }
    }

    private gameResize(): void {
        if(this.isShow) {
            this.gameView.resize();
            if(this.maskBitmap){
                this.maskBitmap.width = fairygui.GRoot.inst.width;
                this.maskBitmap.height = fairygui.GRoot.inst.height;
            }
        }
    }

    private rpgGameViewOpen(): void {
        //场景实体增加和移除
        // Log.trace("rpgGameView is Open：开始监听场景实体增加和移除");
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityInfo], this.onSEntityInfo, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityInfos], this.onSSeqEntityInfo, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityMoveInfo], this.onSEntityMoveInfo, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityLeftInfo], this.onSEntityLeft, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityLeftInfos], this.onSEntityLeftArray, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityFlashInfo], this.onSentityFlashMove, this);
        
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityAttributeUpdate], this.onSEntityUpdate, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcaseEntityInfoToMySelf], this.onSEntityInfoToMySelf, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityDropItem], this.onDropItemPrivate, this);

        this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePositionUpdate], this.onPositionUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicResetRolePoint], this.onSMovePoint, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicBossTalk], this.onBossTalkUpdate, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRoleInfo], this.onMultiRoleInfo, this);
        this.addMsgListener(ECmdBroadCast[ECmdBroadCast.ECmdBroadcastEntityBeginCollect], this.onBeginCollect, this);

        // this.addListen0(NetEventEnum.kingDie, this.onKingDie, this);//主角死亡了
        // this.addListen0(NetEventEnum.kingRelived, this.kingRelived, this);//主角复活了
        this.addListen0(LocalEventEnum.SceneTestJump, this.onSceneTestJump, this);
        this.addListen0(LocalEventEnum.RoleScaleHide, this.onAddHideTweenHandler, this);
        // this.addListen0(LocalEventEnum.PetStarUpSuccess,this.onPetStarUpHandler,this);
        // this.addListen0(LocalEventEnum.PetLevelUpSuccess,this.onPetLevelUpHandler,this);
        this.addListen0(LocalEventEnum.TaskNpcState,this.onSetNpcStateHanderl,this);
        this.addListen0(LocalEventEnum.TaskPlayerTaskUpdated,this.onTaskUpdateHandler,this);
        this.addListen0(LocalEventEnum.HideMonster,this.onUpdateModelShow,this);
        this.addListen0(LocalEventEnum.HideOther,this.onUpdateModelShow,this);
        this.addListen0(LocalEventEnum.SysSettingInit,this.onUpdateModelShow,this);
        this.addListen0(LocalEventEnum.HideTitle,this.onSettingHideTitleUpdate,this);

        this.addListen1(NetEventEnum.RoleTitleUpdate,this.onTitleUpdate,this);
        this.addListen1(NetEventEnum.roleLifeUpdate, this.onRoleLifeUpdate, this);
        this.addListen1(NetEventEnum.entityAvatarUpdate, this.onSelfAvatarUpdate, this);
        this.addListen1(NetEventEnum.entityNotShowUpdate, this.onSelfNotShowUpdate, this);
        this.addListen1(NetEventEnum.entityBuffUpdate, this.onSelfBuffUpdate, this);
        // this.addListen1(NetEventEnum.roleDropOwner, this.onRoleDropOwner, this);
        // this.addListen1(NetEventEnum.roleRealmUpdateed, this.onRoleRealmName, this);
        this.addListen1(NetEventEnum.roleGuildNameUpdated, this.onGuildName, this);
        // this.addListen1(NetEventEnum.roleLevelUpdate,this.onRoleLevelUpdate,this);
        this.addListen1(NetEventEnum.CanAttackPlayersUpdate,this.onCanAttackPlayersUpdate,this);
        this.addListen1(LocalEventEnum.BattleObjChange,this.onBattleObjChangeHandler,this);
        this.addListen1(LocalEventEnum.BossBuffUpdate,this.onBossBuffUpdateHandler,this);
        this.addListen1(LocalEventEnum.BossLifeViewHide,this.onBossViewHideHandler,this);
        this.addListen1(UIEventEnum.SceneMapUpdated,this.onSceneUpdateHandler,this);
        this.addListen1(LocalEventEnum.TaskPlayerTaskUpdated,this.onTaskPlayerTaskUpdatedHandler,this);
        this.addListen1(LocalEventEnum.AIPickUpComplete,this.onPickUpCompleteHandler,this);
        this.addListen1(LocalEventEnum.OtherPlayerDied,this.onOtherPlayerDied,this);
        this.addListen1(NetEventEnum.EntityLifeUpdate,this.onEntityLifeUpdate,this);
        this.addListen1(NetEventEnum.RoleForceUpdate,this.onRoleForceUpdate,this);
        this.addListen1(NetEventEnum.roleNameChanged,this.onRoleNameChanged,this);
        //采集
        this.addListen1(LocalEventEnum.SceneBeginCollect, this.beginCollect, this);
        this.addListen1(LocalEventEnum.SceneAbortCollect,this.onCollectAbort,this);

        this.addListen1(LocalEventEnum.TimeLimitBossDropUpdate,this.onTimeLimitBossDropUpdate,this);
        this.addListen1(LocalEventEnum.PetTalk,this.onPetTalk,this);
        // this.delayExecute.execute();
    }

    /**更新外观坐骑、法阵、法宝 */
    private onSelfAvatarUpdate(type: EEntityAttribute,roleIndex:number): void {
        let _mainPlayer: MainPlayer = CacheManager.king.getRoleEntity(roleIndex) as MainPlayer;
        if (_mainPlayer) _mainPlayer.updateAvatarModel(type);
    }

    /**
     * 屏蔽外观时装更新 
     * @param comType 组件类型 ComponentType
     * @param isHide 是否屏蔽
     */
    private onSelfNotShowUpdate(comType:string,isHide:boolean):void
    {
        let _mainPlayer: MainPlayer = this.gameView.getMainPlayer();
        if (_mainPlayer) _mainPlayer.updateNotShowFashion(comType,isHide);
    }

    private onGuildName(roleIndex:number):void{
        let _mainPlayer: MainPlayer = CacheManager.king.getRoleEntity(roleIndex) as MainPlayer;
        if (_mainPlayer) _mainPlayer.setGuildName();
    }

    /**buff更新 */
    private onSelfBuffUpdate(data: any,roleIndex:number): void {
        let _mainPlayer: MainPlayer = CacheManager.king.getRoleEntity(roleIndex) as MainPlayer;
        if (_mainPlayer) _mainPlayer.updateBuff(data);
    }


    private onSceneTestJump(): void {
        this.gameView.getLeaderPlayer() && this.gameView.getLeaderPlayer().situJump();
    }

    /**
     * 添加单个实体，比如怪物、别人、宠物
     */
    private onSEntityInfo(param: any): void 
    {
        if(EntityUtil.isMainPlayerOther(param.entityId) >= 0) {
            let pts:any[] = param.points.data;
            Log.trace(Log.RPG,"收到" + param.entityId.roleIndex_BY + "号角色数据--->坐标：",pts[0].x_SH,pts[0].y_SH);
        }
        let _entityInfo:EntityInfo = CacheManager.map.addServerEntity(param);
        let _index:number = CacheManager.map.deleteList.indexOf(_entityInfo.id);
        if(_index != -1)
        {
            CacheManager.map.deleteList.splice(_index,1);
        }
        if(this.isShow)
        {
            this.gameView.createSingleEntity(_entityInfo);
        }

        this.onCanAttackPlayersUpdate();
        if(_entityInfo.entityId.type_BY == EEntityType.EEntityTypeBoss) {
            this.showBossLifeBar();
        }
        if(_entityInfo.type == EEntityType.EEntityTypeDropItem && AI.canAddAIPickUp) {
            egret.setTimeout(function(){
                EventManager.dispatch(LocalEventEnum.AIAdd, {"type": AIType.PickUp});
            },this,2000);
        }
    }

    /**批量创建实体 */
    private onSSeqEntityInfo(param: any): void {
        // Log.trace(Log.RPG, "==收到<< 批量实体信息 >>: SSeqEntityInfo :", param);
        let _msgList:any[] = param.entityInfos.data;
        let _infos:EntityInfo[] = [];
        let hasDrop:boolean = false;
        let isGuildDefender:boolean = false;
        for(let i:number = 0; i < _msgList.length; i++)
        {
            let _entityInfo:EntityInfo = CacheManager.map.addServerEntity(_msgList[i]);
            let _index:number = CacheManager.map.deleteList.indexOf(_entityInfo.id);
            if(_index != -1)
            {
                CacheManager.map.deleteList.splice(_index,1);
            }
            _infos.push(_entityInfo);
            if(!hasDrop) {
                hasDrop = _entityInfo.type == EEntityType.EEntityTypeDropItem;
            }            
        }
        if(this.isShow)
        {
            this.gameView.createBatchEntity(_infos);
        }
        
        this.onCanAttackPlayersUpdate();
        this.showBossLifeBar();
        if(hasDrop && AI.canAddAIPickUp) {
            egret.setTimeout(function(){
                EventManager.dispatch(LocalEventEnum.AIAdd, {"type": AIType.PickUp});
            },this,2000);
        }
        
    }

    private onSEntityMoveInfo(param: any): void {
        if(EntityUtil.isMainPlayerOther(param.entityId) != -1 && param.entityId.type_BY == EEntityType.EEntityTypePlayer) {
            Log.trace(Log.RPG,"多角色移动更新ECmdBroadcastEntityMoveInfo param ：",param);
            return;
        }
        this.gameView.moveOtherPlayer(param);
    }

    /**
     * 多角色信息返回
     * @param msg:S2C_SRoleInfo
     */
    private onMultiRoleInfo(msg:any):void {
        CacheManager.king.updateMultiRoleInfo(msg);
    }

    /**
     * 实体瞬移
     */
    private onSentityFlashMove(param: any):void {
        // console.log("实体瞬移onSentityFlashMove",param);
        if(this.isShow) {
            this.gameView.moveOtherPlayer(param,true);
        }
    }

    private onSEntityLeft(param: any): void {
        // Log.trace("==收到<< 4实体离开信息 >>:，SEntityLeft :", param);
        if(this.isShow) {
            this.gameView.removeLeftPlayer(param);
        }
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)
            && param.entityId.type_BY == EEntityType.EEntityTypeBoss) {//矿工离开
            EventManager.dispatch(LocalEventEnum.UpdatePlayerMiningInfo);
        }
        if(param.entityId.type_BY == EEntityType.EEntityTypeDropItem && 
            CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss) && 
            !CacheManager.map.hasPublicDrops) {
            //秘境boss中公有掉落移除
            CacheManager.king.stopKingEntity(true);
        }
    }

    private onSEntityLeftArray(param: any): void {
        // Log.trace("==收到<< 7批量离线信息 >>:SEntityLeftArray :", param);
        if(this.isShow) {
            this.gameView.removeLeftPlayers(param);
        }
    }

    /** 实体属性更新，结构是：SEntityUpdate*/
    private onSEntityUpdate(param: any): void {
        // Log.trace("==收到<< 5实体更新信息 >>:SEntityUpdate :", param);
        CacheManager.map.updateEntityInfo(param);
        // if(this.isShow) {
        //     this.gameView.sEntityUpdate(param);
        // }
    }

    /** 自己实体信息，结构：SEntityInfo */
    private onSEntityInfoToMySelf(param: any): void {
        let pts:any[] = param.points.data;
        Log.trace(Log.RPG,"收到0号角色数据--->坐标：",pts[0].x_SH,pts[0].y_SH);
        CacheManager.role.entityInfo.parseData(param,0);
        if(this.isShow) {
            this.gameView.createSelfEntity();
        }
        ResourceManager.loadByRoleLevel(param.level_SH);
    }

    /**
     * ECmdGatePositionUpdate更新，结构是：SSeqAttributeUpdate
     * 只对自己有效
    */
    private onPositionUpdate(param: any): void {
        
        let spaceId: number = CacheManager.map.mapId;
        let pointX: number = 1;
        let pointY: number = 1;
        let reason: number = -1;
        
        let propertyLen: number = param.updates.data instanceof Array ? param.updates.data.length : 0;
        for (let i = 0; i < propertyLen; i++) {
            let sAttributeUpdate = param.updates.data[i];
            let attr: number = sAttributeUpdate.attribute;
            let value: number = sAttributeUpdate.value_I;
            let valueStr: number = Number(sAttributeUpdate.valueStr_S);
            switch (attr) {
                case EEntityAttribute.EAttributeSpaceId:
                    spaceId = value;
                    break;
                case EEntityAttribute.EAttributePointX:
                    pointX = value;
                    break;
                case EEntityAttribute.EAttributePointY:
                    pointY = value;
                    break;
                case EEntityAttribute.EAttributeUpdatePositionReason:
                    reason = value;
                    break;
            }
        }
        let roleIndex:number = param.index_I;
        let pos:any = CacheManager.role.pos[roleIndex];
        if(!pos) {
            pos = {};
            CacheManager.role.pos[roleIndex] = pos;
        }
        pos.posX_I = pointX;
        pos.posY_I = pointY;
        pos.index_I = roleIndex;
        let roleInfo:EntityInfo = CacheManager.role.getEntityInfo(roleIndex);
        roleInfo.col = pointX;
        roleInfo.row = pointY;
        // CacheManager.role.pos = { "x_I": pointX, "y_I": pointY ,"positionUpdate":true};
        
        if(spaceId != CacheManager.map.mapId) {
            //切图，清理实体对象，清理实体数据缓存
            Log.trace(Log.RPG, "场景更新流程-------->>>>>>收到切图消息，清理实体对象和实体数据，地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
            this.gameView.clearEntity();
            CacheManager.map.deleteAllEntity();
            //加载地图配置
            this.onChangeMap(spaceId);
        } else {
            //地图相同，重置坐标
            this.gameView.resetMainPlayerPoint(pos);
            EventManager.dispatch(LocalEventEnum.SceneConveyComplete);
        }
    }

    /**
     * 0: 未知，1：传送，2：拉回
     */
    private onSMovePoint(param: any): void {
        let roleIndex:number = param.index_I;
        let pos:any = CacheManager.role.pos[roleIndex];
        if(!pos) {
            pos = {};
            CacheManager.role.pos[roleIndex] = pos;
        }
        pos.posX_I = param.posX_I;
        pos.posY_I = param.posY_I;
        pos.index_I = roleIndex;

        this.gameView.resetMainPlayerPoint(param);
        //防止实体还未创建，无法重置实体坐标
        let roleInfo:EntityInfo = CacheManager.role.getEntityInfo(roleIndex);
        roleInfo.col = param.posX_I;
        roleInfo.row = param.posY_I;
    }

    private onChangeMap(mapId:number):void {
        this.gameView.touchEnabled = this.gameView.touchChildren = false;
        ControllerManager.scene.sceneState = SceneStateEnum.Loading;
        //切图前资源id
        let resIdOld:number = CacheManager.map.getMapResId();

        EventManager.dispatch(LocalEventEnum.AIStop);//服务端返回切换地图，这时停掉AI
        EventManager.dispatch(LocalEventEnum.ChangeMap);
        
        let _leaderPlayer:MainPlayer = CacheManager.king.leaderEntity;
        let _needScale:boolean = CopyUtils.isScaleRoleCopyMap(CacheManager.map.mapId);
        if(_needScale && _leaderPlayer)
        {
            _leaderPlayer.hideCopyTween(null,null);
        }
        let oldMapId:number = CacheManager.map.mapId;
        CacheManager.map.mapId = mapId;
        let resIdNew:number = CacheManager.map.getMapResId();

        CacheManager.king.updateMultiRoleInfo();
        if(resIdNew == resIdOld){
            //解析新的地图配置，npc 传送阵等配置的实体数据切图之前被清除掉，需要重新解析
            if(this.isShow) {
                Log.trace(Log.RPG, "场景更新流程-------->>>>>>相同地图资源，无需加载，无需初始化地图格子: " + mapId,"资源映射：",resIdNew,"地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
                CacheManager.map.parseCurrentMapData();
                this.gameView.touchEnabled = this.gameView.touchChildren = CacheManager.map.getMapCanHandOperate();
                this.gameView.initEntity();
            }
            else {
                Log.trace(Log.RPG, "场景更新流程-------->>>>>>主场景还未显示",SceneStateEnum[ControllerManager.scene.sceneState]);
            }
        }
        else {
            ControllerManager.scene.preloadMapRes(CacheManager.map.getMapResId(), this.mapResComplete, this);
        }
    }

    private mapResComplete(groupName:string) :void
    {
        Log.trace(Log.RPG,groupName + "----->地图配置加载完成！！！！！！！！！！！！！！！！",SceneStateEnum[ControllerManager.scene.sceneState]);
        if(groupName != "map_res_" + CacheManager.map.getMapResId()) {
            Log.trace(Log.RPG,"当前加载完成的地图配置，非最新收到的地图id,资源id：",CacheManager.map.getMapResId(),"实际地图id：",CacheManager.map.mapId);
            return;
        }
        // if(!CacheManager.map.getCurMapData()) {
        //     Log.trace(Log.RPG,"当前加载完成的地图配置，非最新收到的地图id");
        //     return;
        // }
    
        if(this.isShow) {
            this.gameView.changeMapView();
            let _mainPlayer: MainPlayer = this.gameView.getLeaderPlayer();
            if (_mainPlayer) _mainPlayer.showTween();
            this.sceneMapUpdatedClear();
        }
        else {
            if (ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
                UIManager.show(ModuleEnum.RpgGame);
            }
        }
        // egret.setTimeout(function(){
        // },this,1500);
        
        //检测遮罩
        this.onTaskPlayerTaskUpdatedHandler();
    }

    /**
     * 私有掉落展示，结构是：SPacket
     * 公有掉落走正常场景添加entity
     * @param data
     */
    private onDropItemPrivate(data: any): void 
    {
        if(CacheManager.map.mapId != data.mapId_I) return;
        this.dropInfos = CacheManager.map.addPrivateDropEntity(data);
        for(let info of this.dropInfos) {
            this.gameView.createSingleEntity(info);
        }
        if(AI.canAddAIPickUp) {
            egret.setTimeout(function(){
                EventManager.dispatch(LocalEventEnum.AIAdd, {"type": AIType.PickUp})
            },this,2000);
        }
    }

    /**
     * 世界boss私有掉落
     */
    private onTimeLimitBossDropUpdate(changeNum:number):void {
        if(!changeNum) {
            return;
        }
        let data:any = CacheManager.timeLimitBoss.dropInfo;
        if(!data) {
            return;
        }
        if(changeNum < 0) {
            let dropInfos = CacheManager.map.addPrivateDropEntity(data);
            for(let info of dropInfos) {
                this.gameView.createSingleEntity(info);
            }
        }
        else {
            let delDropKeys:string[] = [];
            let maxLoop:number = 0;//防止死循环
            let drops:string[] = CacheManager.map.dropPrivateKeys;
            while(delDropKeys.length != changeNum && maxLoop < 100 && drops.length > 0) {
                //随机删除
                let index:number = Math.floor(App.MathUtils.getRandom(0,drops.length));
                if(drops.length > index && delDropKeys.indexOf(drops[index]) == -1) {
                    delDropKeys.push(drops[index]);
                }
                maxLoop ++;
            }
            for(let i:number = 0; i < delDropKeys.length; i++) {
                let entity:DropEntity = CacheManager.map.getEntity(delDropKeys[i]) as DropEntity;
                entity.destory();
            }
        }
    }

    /**主角血量更新 */
    private onRoleLifeUpdate(hp:number,roleIndex:number): void {
        let _mainPlayer: MainPlayer = CacheManager.king.getRoleEntity(roleIndex) as MainPlayer;
        if (_mainPlayer) {
            _mainPlayer.checkDeath();
            _mainPlayer.updateLife();
        }
    }

    /** 地图后的一些状态清除 */
    private sceneMapUpdatedClear(): void {
        if (this.gameView.getMainPlayer()) {
            // Log.trace("地图后的一些状态清除: ", this.gameView.getMainPlayer());
        }
    }

    public getMainPlayer(): MainPlayer {
        return this.gameView.getMainPlayer();
    }

    public getLeaderPlayer(): MainPlayer {
        return this.gameView.getLeaderPlayer();
    }

    /**
     * Boss说话 Message::Public::SBossTalk [Message/Public/GamePublic.cdl]
     */
    private onBossTalkUpdate(param: any): void {
        this.gameView.updateEntityTalk(param)
    }

    /**
     * 缩小缓动
     * @param data{call：Function,caller:any}
     */
    private onAddHideTweenHandler(data: any): void {
        let _mainPlayer: MainPlayer = this.gameView.getLeaderPlayer();
        if (_mainPlayer) {
            CacheManager.king.stopKingEntity(false);
            if(data.enterCopy)
            {
                _mainPlayer.hideCopyTween(data.call, data.caller);    
            }
            else
            {
                _mainPlayer.hideTween(data.call, data.caller);
            }
        } else if (data.call && data.caller) { //还没创建主角 直接回调
            data.call.call(data.caller);
        }
    }

    // /**宠物升星 */
    // private onPetStarUpHandler():void
    // {
    //     this.onPetTalk(PetTalkCondition.PetStarUp);
    // }
    // /**宠物升级 */
    // private onPetLevelUpHandler():void
    // {
    //     this.onPetTalk(PetTalkCondition.PetLeveUp);
    // }

    /**
     * 宠物说话 
     * @param condition 触发条件类型
     */
    private onPetTalk(condition:PetTalkCondition):void
    {
        let _myPet:PetEntity = CacheManager.map.getBelongMineEntity(EEntityType.EEntityTypePet) as PetEntity;
        if(_myPet) _myPet.updateTalk(condition);
    }

    /**设置NPC任务状态 */
    private onSetNpcStateHanderl(npcId:number,state:TaskNpcStatus):void
    {
        CacheManager.map.setNpcTaskState(npcId,state);
        let _npc:Npc = this.gameView.getEntitys()[npcId] as Npc;
        if(!_npc) return;
        _npc.npcState = state;
    }

    /**玩家任务更新 */
    private onTaskUpdateHandler():void
    {
        let _mainPlayer:MainPlayer = this.gameView.getLeaderPlayer();
        if(!_mainPlayer) return;
        if(!_mainPlayer.entityInfo.canShowArrow)
        {
            this.removeListener(LocalEventEnum.TaskPlayerTaskUpdated,this.onTaskUpdateHandler,this);
            return;
        }
        _mainPlayer.updateTaskArrow();
    }

    /**更新野怪和其他玩家模型显示与否 */
    private onUpdateModelShow(eventType:LocalEventEnum):void
    {
        let _type:RpgObjectType[] = [RpgObjectType.OtherPlayer,RpgObjectType.Pet];
        if(eventType == LocalEventEnum.HideMonster)
        {
            _type = [RpgObjectType.Monster];
        }
        else if(eventType == LocalEventEnum.SysSettingInit)
        {
            _type = [RpgObjectType.OtherPlayer,RpgObjectType.Pet,RpgObjectType.Monster];
        }
        this.gameView.updateModelIsShow(_type);
    }

    /**主角称号更新 */
    private onTitleUpdate(roleIndex:number = 0):void {
        let _mainPlayer: MainPlayer = CacheManager.king.getRoleEntity(roleIndex);
        if (_mainPlayer) _mainPlayer.updateTitle();
    }

    /**系统设置隐藏称号改变 */
    private onSettingHideTitleUpdate():void {
        this.onTitleUpdate();
        let entitys:{ [entityId: string]: RpgGameObject } = CacheManager.map.entitys;
        for(let entityId in entitys) {
            if(entitys[entityId].objType == RpgObjectType.OtherPlayer || entitys[entityId].objType == RpgObjectType.MainPlayer) {
                entitys[entityId].updateTitle();
            }
        }
    }

    /**
     * 可攻击的玩家列表更新
     */
    private onCanAttackPlayersUpdate():void {
        if(this.fightView && this.fightView.isShow) {
            this.fightView.attackListUpdate();
        }
    }

    private onBattleObjChangeHandler(battleObj:RpgGameObject):void {
        if(this.fightView && this.fightView.isShow) {
            this.fightView.updateBattleObj();
        }
        
        if(battleObj && battleObj.entityInfo && EntityUtil.isPlayer(battleObj.entityInfo.entityId)) {
            battleObj.updateModelIsShow();
        }

        if(battleObj && battleObj.entityInfo && EntityUtil.isShowBossHp(battleObj.entityInfo)) {            
            this.initBossLifeBar(battleObj.entityInfo);
        }

        else if(!CacheManager.copy.isInCopy) {
            if(this.bossLifeBar && this.bossLifeBar.isShow) {
                this.bossLifeBar.hide();
            }
        }
    }

    /**
     * 场景更新
     */
    private onSceneUpdateHandler():void {
        if(MapUtil.checkShowFightView()) {
            if(!this.fightView) {
                this.fightView = new RpgFightPlayersView();
            }
            this.fightView.show();
        }
        else {
            if(this.fightView && this.fightView.isShow) {
                this.fightView.hide();
            }
        }
        if(MapUtil.checkShowTeamView()) {
            if (!this.teamView) this.teamView = new RpgTeamView();
            this.teamView.show();
        }
        else if(this.teamView && this.teamView.isShow) {
            this.teamView.hide();
        }
        this.gameView.getGameTipsLayer().removeChildren();
        this.showBossLifeBar();

        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss)) {
            this.onTimeLimitBossDropUpdate(-1);
        }
    }

    private initBossLifeBar(bossInfo:any):void{
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){ //守护仙盟不显示boss血条
            return;
        }
        if(!this.bossLifeBar) {
            this.bossLifeBar = new RpgBossInfView();
        }
        this.bossLifeBar.show(bossInfo);
    }

    private showBossLifeBar():void {
        if(CacheManager.copy.isInCopy) {
            let bossInfo:EntityInfo = CacheManager.map.getBossEntityInfo();
            if(bossInfo && Number(bossInfo.life_L64) > 0) {
                this.initBossLifeBar(bossInfo);
                
                this.guildDefendBossShow(bossInfo);
            }
            else if(this.bossLifeBar && this.bossLifeBar.isShow) {
                this.bossLifeBar.hide();
                this.guildDefendBossShow(null);
            }
        }
    }

    /**
     * 有其他角色阵亡
     */
    private onOtherPlayerDied(entityId:any):void {
        if(this.fightView && this.fightView.isShow) {
            let battleObj:RpgGameObject = CacheManager.bossNew.battleObj;
            if(!battleObj || !battleObj.entityInfo || !EntityUtil.isPlayer(battleObj.entityInfo.entityId)) return;
            if(battleObj.entityInfo.id == EntityUtil.getEntityId(entityId)) {
                let otherObj:RpgGameObject = CacheManager.map.getOtherPlayer(entityId);
                CacheManager.bossNew.battleObj = otherObj;
            }

            this.fightView.attackListUpdate();
        }
    }

    /**
     * 实体血量更新
     */
    private onEntityLifeUpdate(entity:RpgGameObject):void {
        if(entity.objType == RpgObjectType.Monster) {
            if(EntityUtil.isCollectionMonster(entity)) return;
            //boss自己有血条
            if(entity["isBoss"]) {
                if(!entity.entityInfo) return;
                if(this.bossLifeBar && EntityUtil.isSame(this.bossLifeBar.entityId,entity.entityInfo.entityId)) {
                    this.bossLifeBar.updateLifeBars();
                }
                return;
            }
        }
        let king:MainPlayer = CacheManager.king.leaderEntity;
        if(king && king.battleObj && king.battleObj.entityInfo) {
            let entityId:any = king.battleObj.entityInfo.entityId;
            if(EntityUtil.isPlayerOther(entityId,entity.entityInfo.entityId)) {
                // EventManager.dispatch(NetEventEnum.BattleObjLifeUpdate,this);
                if(this.fightView && this.fightView.isShow) {
                    this.fightView.updateBattleObjLife(entity);
                }
            }
        }
    }

    /**
     * 玩家自己势力更新
     */
    private onRoleForceUpdate():void {
        if(!MapUtil.isCampBattleMap()) return;
        let allEntitys:{ [entityId: string]: RpgGameObject } = CacheManager.map.entitys;
        for(let entityId in allEntitys) {
            allEntitys[entityId].updateForce();
        }
    }

    /**
     * 角色改名
     */
    private onRoleNameChanged(): void {
        let mainPlayer: MainPlayer;
        for(let i:number = 0; i < CacheManager.role.roles.length; i++ ){
            mainPlayer = CacheManager.king.getRoleEntity(i) as MainPlayer;
            if (mainPlayer) {
                mainPlayer.updateName();
            }
        }
    }

    /**boss无敌buff更新 */
    private onBossBuffUpdateHandler(entityInfo:EntityInfo,opType:EBufferOp,buffId:number):void {
        let buffCfg:any = ConfigManager.state.getByPk(buffId);
        if(!buffCfg || (buffCfg.type != EStateType.EStateInvincible && buffCfg.type != EStateType.EStateLifeShield)) return;
        if(this.bossLifeBar && this.bossLifeBar.isShow && EntityUtil.isSame(this.bossLifeBar.entityId,entityInfo.entityId)) {
            if(opType == EBufferOp.EBufferOpAdd) {
                //添加buff
                this.bossLifeBar.updateInvincible();
            }
            else {
                //移除buff
                this.bossLifeBar.removeInvincible();
            }
        }
    }

    private onBossViewHideHandler():void {
        if(this.bossLifeBar && this.bossLifeBar.isShow) {
            this.bossLifeBar.hide();
            this.guildDefendBossShow(null);
        }
    }

    private guildDefendBossShow(entityInfo:any):void{
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){
            EventManager.dispatch(LocalEventEnum.CopyGuildShowAtkBoss,{entityInfo:entityInfo});
        }
    }

    public get isShow():boolean {
        return this.gameView != null && this.gameView.isShow();
    }

    private onTaskPlayerTaskUpdatedHandler():void {
        // if(!CacheManager.task.isHadEnd(TaskCodeConst.MaskTask)){
        if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MapMaskEnd, false)){
            if(!this.isMaskInit){
                this.showBgMask();
                this.isMaskInit = true;
            }
        }else{
            if(this.isMaskInit){
                this.maskLoader.removeFromParent();
            }
        }
    }

    private onPickUpCompleteHandler():void {
        if(CacheManager.copy.isInCopy) {
            for(let i:number = 0; i < this.dropInfos.length; i++) {
                let sItemData:any = this.dropInfos[i].sItemData;
                let count:number = sItemData.itemAmount_I;
                if(sItemData.itemCode_I == 41240002) {
                    count = 20;
                }
                
                if(ConfigManager.item.getByPk(sItemData.itemCode_I).category != 20) {
                    EventManager.dispatch(NetEventEnum.packBackAddItem, new ItemData(sItemData.itemCode_I), count);
                }
                else {
                    EventManager.dispatch(NetEventEnum.pickUpHeartMethond, new ItemData(sItemData.itemCode_I), count);
                }
            }
            this.dropInfos = [];
        }
        if(ControllerManager.scene.sceneReady && CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
            if(CacheManager.checkPoint.isChallengeSuccess && CacheManager.checkPoint.isCanAutoLeft) {
                if(!CacheManager.map.getNearestMonster()) {
                    //如果击杀boss后，掉落拾取已经结束，还未更新通关数，导致CacheManager.checkPoint.isChallengeSuccess的标识一直是true
                    //下次进关卡恰好拾取完的瞬间进关卡有可能会直接退出副本，该判断可预防这个bug
                    ProxyManager.copy.leftCopy();
                }
                CacheManager.checkPoint.isChallengeSuccess = false;
            }
        }
    }

    /**
     * 请求开始采集
     */
    private beginCollect(data: any): void {
        let sEntityId: any = data;
        let roleIndex:number = CacheManager.king.leaderIndex;
        ProxyManager.operation.beginCollect(sEntityId,roleIndex);
    }

    /**
     * 推送开始采集
     */
    private onBeginCollect(data: any): void {
        let toEntity = CacheManager.map.getEntity(EntityUtil.getEntityId(data.toEntitys.data[0]));
        EventManager.dispatch(LocalEventEnum.SceneCollectUpdate,data);
        if (EntityUtil.isMainPlayerOther(data.fromEntity) >= 0 && toEntity != null) {
            CacheManager.king.collectEntity = toEntity;
            let duration: number = toEntity.entityInfo.mana_I;
            let bossCode: number = toEntity.entityInfo.code_I;
            let title: string = ConfigManager.client.getByKey("collect_title")[bossCode];
            if(!this.collectView) {
                this.collectView = fairygui.UIPackage.createObject(PackNameEnum.Scene,"SceneCollectBarView") as SceneCollectBarView;
            }
            let isRescue: boolean = bossCode == 1200010 || bossCode == 1200019;//宠物和坐骑显示解救
            this.collectView.isRescue = isRescue;
            this.collectView.startCollect({ "duration": duration, "bossCode": bossCode});   

            // if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar)) {
            //     // if(this.fightView && this.fightView.isShow) {
            //     //     this.fightView.startCollect({ "duration": duration,bossCode:bossCode});
            //     // }
            // }
            // else {
            //     if(!this.collectView) {
            //         this.collectView = fairygui.UIPackage.createObject(PackNameEnum.Scene,"SceneCollectBarView") as SceneCollectBarView;
            //     }
            //     this.collectView.startCollect({ "duration": duration});   
            // }
        }
    }

    /**
     * 终止采集
     */
    private onCollectAbort(): void {
        if (EntityUtil.isCollectionMonster(CacheManager.bossNew.battleObj)) {
            CacheManager.bossNew.battleObj = null;
        }
        if(this.collectView && this.collectView.isCollecting) {
            this.collectView.stopCollect();
        }
        // if(this.fightView && this.fightView.isShow) {
        //     this.fightView.stopCollect();
        // }   
    }

    private showBgMask():void{
        this.maskLoader = ObjectPool.pop("GLoader");
        this.maskLoader.touchable = false;
        this.maskLoader.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.maskLoader.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
        LayerManager.Game_Mask.addChild(this.maskLoader);
        this.maskLoader.load("resource/assets/rpgGame/mask.png");
        this.maskLoader.addEventListener(GLoader.RES_READY, () => {
            this.maskBitmap = this.maskLoader.content as egret.Bitmap;
            this.maskBitmap.scale9Grid = new egret.Rectangle(292, 290, 360, 584);
            this.maskBitmap.width = fairygui.GRoot.inst.width;
            this.maskBitmap.height = fairygui.GRoot.inst.height;
        }, this);
    }
}