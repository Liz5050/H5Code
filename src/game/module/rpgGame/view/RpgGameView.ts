/**
 * 场景相当于一个很特殊的UI
 */
class RpgGameView extends BaseSpriteView {
    private gameLayer:egret.DisplayObjectContainer;
    private background: RpgBackground;
    private gameObjcetLayer: egret.DisplayObjectContainer;
    private gameObjectTxtLayer:egret.DisplayObjectContainer;
    private gameObjectUILayer:egret.DisplayObjectContainer;
    private gameEffectDownLayer: egret.DisplayObjectContainer;
    private gameGroundLayer: egret.DisplayObjectContainer;
    private gameEffectUpLayer: egret.DisplayObjectContainer;
    private gameEffectUpBottomLayer: egret.DisplayObjectContainer;
    private gameTipsLayer:egret.DisplayObjectContainer;
    private gameTalkLayer:egret.DisplayObjectContainer;
    /**仅用于主角对中心点缩放 */
    private gameSelfTweenLayer:egret.Sprite;
    private blocksData: number[][];
    // private mainPlayer: MainPlayer;//等于KingCache.kingEntity
    // private leaderPlayer: MainPlayer;//等于KingCache.leaderEntity
    private entitys:{[entityId:string]:RpgGameObject};
    private sceneEffects:UIMovieClip[];

    public astar:SilzAstar;
    private gPointMc:MovieClip;
    private gForbidIcon:GLoader;
    private gTimeOutIndex:number = -1;
    private executor:FrameExecutor;
    private viewShowTime:number;

    public constructor($controller: BaseController, $parent: egret.DisplayObjectContainer) {
        super($controller, $parent);

        this.executor = new FrameExecutor(5);
        this.entitys = {};
        this.sceneEffects = [];
        this.astar = new SilzAstar();
        CacheManager.map.entitys = this.entitys;
        this.initUI();
    }

    public initUI(): void {
        super.initUI();
        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);

        this.background = new RpgBackground();
        this.gameLayer.addChild(this.background);

        this.gameGroundLayer = new egret.DisplayObjectContainer();
		this.gameGroundLayer.name = "gameGroundLayer";
        this.gameLayer.addChild(this.gameGroundLayer);

        this.gameEffectDownLayer = new egret.DisplayObjectContainer();
		this.gameEffectDownLayer.name = "gameEffectDownLayer";
        this.gameLayer.addChild(this.gameEffectDownLayer);

        this.gameObjcetLayer = new egret.DisplayObjectContainer();
		this.gameObjcetLayer.name = "gameObjcetLayer";
        this.gameLayer.addChild(this.gameObjcetLayer);

        this.gameObjectUILayer = new egret.DisplayObjectContainer();
        this.gameObjectUILayer.name = "gameObjectUILayer";
        this.gameLayer.addChild(this.gameObjectUILayer);

        this.gameObjectTxtLayer = new egret.DisplayObjectContainer();
        this.gameObjectTxtLayer.name = "gameObjectTxtLayer";
        this.gameLayer.addChild(this.gameObjectTxtLayer);
        // this.gameObjectTxtLayer.cacheAsBitmap = true;

        this.gameEffectUpLayer = new egret.DisplayObjectContainer();
		this.gameEffectUpLayer.name = "gameEffectUpLayer";
        this.gameLayer.addChild(this.gameEffectUpLayer);

        this.gameEffectUpBottomLayer = new egret.DisplayObjectContainer();
		this.gameEffectUpBottomLayer.name = "gameEffectUpBottomLayer";
        this.gameEffectUpLayer.addChild(this.gameEffectUpBottomLayer);

        this.gameTipsLayer = new egret.DisplayObjectContainer();
		this.gameTipsLayer.name = "gameTipsLayer";
        this.gameLayer.addChild(this.gameTipsLayer);

        this.gameTalkLayer = new egret.DisplayObjectContainer();
        this.gameTalkLayer.name = "gameTalkLayer";
        this.gameLayer.addChild(this.gameTalkLayer);

        this.gameSelfTweenLayer = new egret.Sprite();
        this.gameSelfTweenLayer.anchorOffsetX = 250;
        this.gameSelfTweenLayer.anchorOffsetY = 250;
        this.gameSelfTweenLayer.width = 500;
        this.gameSelfTweenLayer.height = 500;
        this.gameLayer.addChild(this.gameSelfTweenLayer);
    }

    public show(): void {
        ResourceManager.load(PackNameEnum.Scene, UIManager.getPackNum(PackNameEnum.Scene));
        Log.trace(Log.RPG, "场景更新流程-------->>>>>>显示场景",SceneStateEnum[ControllerManager.scene.sceneState]);
        this.addToParent();
        this.initMap();
        this.moveGameLayer();
        EventManager.dispatch(LocalEventEnum.GameViewOpen);
        this.viewShowTime = egret.getTimer();
    }

    /**
     * 切换地图UI
     * data结构: mapId: number, pos_x: number, pos_y: number, reason: number = -1
     */
    public changeMapView(): void {
        this.clearMapView();
        this.initMap();
        this.moveGameLayer();
    }

    public initMap():void {
        Log.trace(Log.RPG, "场景更新流程-------->>>>>>初始化地图格子","地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
        this.initBackground();
        this.initBlocks();
        this.initSceneEffect();
        this.touchEnabled = this.touchChildren = CacheManager.map.getMapCanHandOperate();

        this.initEntity();
    }   

    private initBackground(): void {
        this.background.init();
    }

    private initBlocks(): void {
        let mapData: any = CacheManager.map.getCurMapData();//RES.getRes("map_" + mapId + "_data.json");
        this.blocksData = mapData.blocks;
        this.astar.makeGrid(this.blocksData);

        Log.trace(Log.RPG, "进入地图id: " + CacheManager.map.mapId);
    }

    /**
     * 初始化场景特效
     */
    private initSceneEffect():void {
        let mapSpecial:any = CacheManager.map.getCurMapSpecial();
        if(mapSpecial && mapSpecial.sceneEffect) {
            for(let i:number = 0; i < mapSpecial.sceneEffect.length; i++) {
                // let mc:MovieClip = ObjectPool.pop("MovieClip");
                let effectCfg:any = mapSpecial.sceneEffect[i];
                let resName:string = "MCSceneEffect" + effectCfg.resId;
                let mc:UIMovieClip = UIMovieManager.get(resName);
                let pt:egret.Point = RpgGameUtils.convertCellToXY(effectCfg.gridX,effectCfg.gridY);
                mc.x = pt.x + effectCfg.offsetX;
                mc.y = pt.y + effectCfg.offsetY;
                mc.setPlaySettings(0,-1,-1);
                mc.setDouble(effectCfg.double);
                mc.playing = true;
                // mc.playFile(ResourcePathUtils.getRPGGame() + "sceneEffect/" + mapSpecial.sceneEffect[i].resId);
                this.gameEffectDownLayer.addChild(mc.displayObject);
                this.sceneEffects.push(mc);
            }
        }
    }

    public initEntity():void {
        Log.trace(Log.RPG, "场景更新流程-------->>>>>>初始化所有实体","地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
        this.initAllEntity();
        this.createSelfEntity();
        this.updateMainPlayer();
    }

    private updateMainPlayer():void {
        let sceneUpdate:boolean = false;
        if(this.leaderPlayer) {
            // this.resetMainPlayerPoint(CacheManager.role.pos[this.leaderPlayer.roleIndex]);
            //这里设置主角需要用到的地图跳跃点
            // this.leaderPlayer.setJumpData();
            this.leaderPlayer.updateTaskArrow();

            if(this.leaderPlayer.currentState != EntityModelStatus.ScaleTween)
            {
                if(!ControllerManager.scene.sceneReady) {
                    ControllerManager.scene.sceneState = SceneStateEnum.AllReady;
                    sceneUpdate = true;
                }
            }
            if(this.background) this.background.updateCameraPos(this.leaderPlayer.x,this.leaderPlayer.y,this.leaderPlayer.movingDir);
        }
        else {
            let playerPos:any = CacheManager.role.pos[CacheManager.king.leaderIndex];
            if(!playerPos) {
                playerPos = CacheManager.role.pos[0];
            }
            let pt:egret.Point = RpgGameUtils.convertCellToXY(playerPos.posX_I,playerPos.posY_I);
            this.background.updateCameraPos(pt.x,pt.y);
        }
        if(!sceneUpdate && (!this.leaderPlayer || this.leaderPlayer.currentState == EntityModelStatus.ScaleTween)) {
            Log.trace(Log.RPG,"场景准备完毕，但主控制角色还未就绪",SceneStateEnum[ControllerManager.scene.sceneState]);
            ControllerManager.scene.setOnlyState(SceneStateEnum.AllReady);
        }
    }


    /**
     * 清理实体、场景特效
     */
    public clearEntity():void {
        this.executor.clear();
        //记录上一个场景的方向
        CacheManager.king.updateLastDirs();
        //清理其他实体
        for(let entityKey in this.entitys)
        {
            this.entitys[entityKey].destory();
            this.entitys[entityKey] = null;
            delete this.entitys[entityKey];
        }
        // if(this.mainPlayer) {
        //     this.mainPlayer.destory();
        //     this.mainPlayer = null;
        // }
        // this.leaderPlayer = null;
        CacheManager.king.clear();

        //清理技能特效
        Effect.disposeAll();
        MoveEffect.disposeAll();
        BaseSkillPlayer.disposeAll();
        //清理震屏
        App.ShakeUtils.cleanShake();
        //清理通用特效
        ControllerManager.effect.clearEffects();
        //特效播放日志
        CacheManager.effect.log();
    }

    private clearMapView(): void {
        
        // this.clearEntity();无需清理实体，收到切图已经清理干净
        //清理地图块和格子
        this.background && this.background.destory();
        //清理场景特效
        for(let i:number = 0; i < this.sceneEffects.length; i++) {
            this.sceneEffects[i].displayObject
            this.gameEffectDownLayer.removeChild(this.sceneEffects[i].displayObject);
            UIMovieManager.push(this.sceneEffects[i]);
            this.sceneEffects[i] = null;
        }
        this.sceneEffects = [];

        //清理待加载队列
        App.LoaderManager.clear();
        Log.trace(Log.RPG, "场景更新流程-------->>>>>>清理地图块","地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
    }

    public moveGameLayer():void {
        let pixelX:number;
        let pixelY:number;
        if(this.leaderPlayer) {
            pixelX = this.leaderPlayer.x;
            pixelY = this.leaderPlayer.y;
        }
        else {
            let playerPos:any = CacheManager.role.pos[CacheManager.king.leaderIndex];
            if(!playerPos) {
                playerPos = CacheManager.role.pos[0];
            }
            let pixelPt:egret.Point = RpgGameUtils.convertCellToXY(playerPos.posX_I,playerPos.posY_I);
            pixelX = pixelPt.x;
            pixelY = pixelPt.y;
        }
        let left: number = Math.max(pixelX - App.StageUtils.getWidth() * 0.5, 0);
        let top: number = Math.max(pixelY - App.StageUtils.getHeight() * 0.5 - 90, 0);

        left = Math.min(this.background.mapWidth - App.StageUtils.getWidth(), left);
        top = Math.min(this.background.mapHeight - App.StageUtils.getHeight(), top);

        this.gameLayer.x = -left;
        this.gameLayer.y = -top;
        // console.log(this.background.mapId
        //     , pixelX, pixelY
        //     , this.background.mapWidth, this.background.mapHeight
        //     , App.StageUtils.getWidth(), App.StageUtils.getHeight()
        //     , "===>", left, top)
    }   

    /**创建单个实体 */
    public createSingleEntity(param:EntityBaseInfo):void
    {
        let index:number = CacheManager.map.deleteList.indexOf(param.id);
        if(index != -1) {
            CacheManager.map.deleteList.splice(index,1);
            return;
        }
        let _entity:RpgGameObject = this.entitys[param.id];
        if (!_entity) {
            _entity = ObjectPool.pop(param.className);
            _entity.init(param);
            this.entitys[param.id] = _entity;
            if(param.type == EEntityType.EEntityTypePlayerMirror){
                EventManager.dispatch(LocalEventEnum.ScenePlayerMirrorAdd, _entity);
            }
        }
    }

    /**
     * 批量创建实体
     */
    public createBatchEntity(dataList:EntityBaseInfo[]):void
    {
        if(dataList.length == 0) return;
        let isEncounter:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter);
        for(let i:number = 0; i < dataList.length; i++)
        {
            let data:EntityBaseInfo = dataList[i];
            let index:number = CacheManager.map.deleteList.indexOf(data.id);
            if(index != -1) {
                CacheManager.map.deleteList.splice(index,1);
                continue;
            }
            if(isEncounter) {
                //遭遇战不分帧
                let _entity:RpgGameObject = this.entitys[data.id];
                if (_entity) _entity.destory();
                _entity = ObjectPool.pop(data.className);
                _entity.init(data);
                this.entitys[data.id] = _entity;
            }
            else {
                this.executor.regist(function () {
                    index = CacheManager.map.deleteList.indexOf(data.id);
                    if(index != -1) {
                        CacheManager.map.deleteList.splice(index,1);
                        return;
                    }
                    let _entity:RpgGameObject = this.entitys[data.id];
                    if (!_entity) {
                        _entity = ObjectPool.pop(data.className);
                        _entity.init(data);
                        this.entitys[data.id] = _entity;
                        if(data.type == EEntityType.EEntityTypePlayerMirror) {
                            EventManager.dispatch(LocalEventEnum.ScenePlayerMirrorAdd, _entity);
                        }
                    }
                }, this);
            }
        }
        this.executor.execute();
    }

    /**
     * 初始化所有实体
     */
    private initAllEntity():void
    {
        let _list:{[entityId:string]:EntityBaseInfo} = CacheManager.map.allInfos;
        let isEncounter:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter);
        for(let _entityId in _list)
        {
            if(!this.entitys[_entityId])
            {
                let _entityInfo:EntityBaseInfo = _list[_entityId];
                let index:number = CacheManager.map.deleteList.indexOf(_entityInfo.id);
                if(index != -1) {
                    CacheManager.map.deleteList.splice(index,1);
                    continue;
                }
                if(isEncounter) {
                    //遭遇战不分帧
                    if(!this.entitys[_entityInfo.id]) {
                        let _entity:RpgGameObject = ObjectPool.pop(_entityInfo.className);
                        _entity.init(_entityInfo);
                        this.entitys[_entityInfo.id] = _entity;
                    }
                }
                else {
                    this.executor.regist(function () {
                        let index:number = CacheManager.map.deleteList.indexOf(_entityInfo.id);
                        if(index != -1) {
                            CacheManager.map.deleteList.splice(index,1);
                            return;
                        }
                        if(!this.entitys[_entityInfo.id]) {
                            let _entity:RpgGameObject = ObjectPool.pop(_entityInfo.className);
                            _entity.init(_entityInfo);
                            this.entitys[_entityInfo.id] = _entity;
                        }
                    }, this);
                }
            }
        }
        this.executor.execute();
    }

    /**
     * 创建主角实体
     */
    public createSelfEntity():void
    {
        if(this.mainPlayer) {
            return;
        }
        let _entityInfo:EntityInfo = CacheManager.role.entityInfo;
        if(!_entityInfo.selfInit) return;
        CacheManager.king.kingEntity = ObjectPool.pop("MainPlayer");
        // this.mainPlayer = ObjectPool.pop("MainPlayer");
        this.mainPlayer.init(_entityInfo);

        // if(!this.mainPlayer) 
        // {
        //     if(!_entityInfo.selfInit) return;
        //     this.mainPlayer = new MainPlayer();
        //     this.mainPlayer.init(_entityInfo);
        //     // EventManager.dispatch(NetEventEnum.entityInfoMyselfUpdate);
        // }
        // else {
        //     this.resetMainPlayerPoint({ posX_I: _entityInfo.col, posY_I: _entityInfo.row });
        //     this.mainPlayer.isPickUp = false;
        // }
    }

    /**
     * 移动玩家，SEntityMoveInfo
     * 获取唯一id:string.format("%d_%d_%d_%d", entityId.id_I, entityId.type_BY, entityId.typeEx_SH, entityId.typeEx2_BY)
     * @param isFlash 是否瞬移
     */
    public moveOtherPlayer(param: any,isFlash:boolean = false): void {
        if (param.entityId == null || param.points == null|| param.points.data[0] == null) {
            return;
        }

        let _key:string = EntityUtil.getEntityId(param.entityId);
        let _entity:RpgGameObject = this.entitys[_key];
        if(_entity) 
        {
            if(isFlash)
            {
                _entity.path = null;
                _entity.resetPointData(param.points.data[0].x_SH, param.points.data[0].y_SH);
            }
            else
            {
                _entity.moveToServerPoint(param.points.data[0].x_SH, param.points.data[0].y_SH, param.moveType);
            }
        }
    }

    /** 
     * 移除玩家，SEntityLeft
     */
    public removeLeftPlayer(param: any): void {
        if (!param || param.entityId == null) {
            return;
        }
        // if(param.entityId.type_BY == EEntityType.EEntityTypePlayer) {
        //     //主角的附属角色不给移除
        //     if(EntityUtil.isMainPlayerOther(param.entityId) != -1) return;
        // }
        let _key:string = EntityUtil.getEntityId(param.entityId);
        let _entity:RpgGameObject = this.entitys[_key];

        if(!_entity){
            //因为实体创建有延迟，防止实体还未创建，服务端就发了移除协议，导致实体移除不成功的bug（2018年4月8日13:51:44 lizhi）
            CacheManager.map.deleteList.push(_key);
        }
        if(_entity)
        {
            if(_entity.objType != RpgObjectType.Monster || !_entity.hasDeathOffset) {
                this.removeEntity(_entity);
            }
        }
    }

    public removeEntityById(entityId:string):void {
        let delObj:RpgGameObject = CacheManager.map.getEntity(entityId);
        this.removeEntity(delObj);
    }

    /**移除实体 */
    public removeEntity(entity:RpgGameObject):void
    {
        if (!entity || !entity.entityInfo) return;
        
        let isRemoveKingBattleObj:boolean = this.leaderPlayer && this.leaderPlayer.battleObj == entity;
        // let _key:string = EntityUtil.getEntityId(entity.entityInfo.entityId);
        if (isRemoveKingBattleObj)
        {
            this.leaderPlayer.battleObj = null;
            // EventManager.dispatch(LocalEventEnum.CheckBattleObj);
        }
        let _key:string = entity.entityInfo.id;
        if(this.leaderPlayer && this.leaderPlayer.entityInfo && this.leaderPlayer.entityInfo.id == _key) {
            Log.trace(Log.RPG, `移除主控制角色->${this.leaderPlayer.roleIndex}`);
            CacheManager.king.setLeaderEntity(null);
        }
        delete this.entitys[_key];
        CacheManager.map.deleteEntity(_key);
        if(entity.objType == RpgObjectType.DropPublic && entity.isPickUp)
        {
            (entity as DropPublicEntity).pickUpDestory();
        }
        else entity.destory();
        entity = null;
    }

    public removePrivateDrop(key:string):void {
        this.entitys[key] = null;
        delete this.entitys[key];
        CacheManager.map.deleteEntity(key);
    }

    /** 
     * 移除多个玩家，SEntityLeftArray
     */
    public removeLeftPlayers(param: any): void {
        if (param.entityLeftSeq == null || param.entityLeftSeq.data == null) {
            return;
        }
        var leftArrayLen:number = param.entityLeftSeq.data instanceof Array ? param.entityLeftSeq.data.length : 0;
        // Log.trace(">>>> LeftArray移除玩家的长度：", leftArrayLen);
        for (var i = 0; i < leftArrayLen; i++) {
            var SEntityLeft = param.entityLeftSeq.data[i];
            // Log.trace(">>>> LeftArray移除玩家[:" + i + "]:", SEntityLeft);
            this.removeLeftPlayer(SEntityLeft);
        }
    }

    // /**
    //  * 更新单个实体信息
    //  */
    // public sEntityUpdate(SEntityUpdate: any): void {
    //     let entityObject: RpgGameObject = CacheManager.map.getEntity(EntityUtil.getEntityId(SEntityUpdate.entityId));
    //     entityObject && entityObject.propertyUpdates(SEntityUpdate);
    // }

    /** 
     * 重置玩家自己位置，SMovePoint，0: 未知，1：传送，2：拉回
     */
    public resetMainPlayerPoint(param: any): void {
        if (param.posX_I == null || param.posY_I == null) {
            return;
        }
        if(!param.index_I) {
            if(CacheManager.king.kingEntity) CacheManager.king.kingEntity.resetPointData(param.posX_I, param.posY_I);
        }
        else if(param.index_I == 1) {
            if(CacheManager.king.kingEntityII) CacheManager.king.kingEntityII.resetPointData(param.posX_I, param.posY_I);
        }
        else if(param.index_I == 2) {
            if(CacheManager.king.kingEntityIII) CacheManager.king.kingEntityIII.resetPointData(param.posX_I, param.posY_I);
        }
    }

    public resize(): void {
        if (!this.leaderPlayer || ControllerManager.scene.sceneState != SceneStateEnum.AllReady) {
            return;
        }
        this.moveGameLayer();
        this.background.updateCameraPos(this.leaderPlayer.x,this.leaderPlayer.y, this.leaderPlayer.movingDir);
    }

    /**
     * 获取实体
     */
    public getEntityObject(entityId:any): RpgGameObject {
        let _key:string = EntityUtil.getEntityId(entityId);
        if (this.mainPlayer && this.mainPlayer.entityInfo) {
            let _mainPlayerKey:string = EntityUtil.getEntityId(this.mainPlayer.entityInfo.entityId);
            if(_key == _mainPlayerKey) return this.mainPlayer;
        }
        return this.entitys[_key];
    }

    /**
     * 更新实体说话
     * SEntityId entityId;
     * int configId;
     * int talkId;
     */
    public updateEntityTalk(data:any):void
    {
        let _id:string = EntityUtil.getEntityId(data.entityId); 
        let _entity:RpgGameObject = this.entitys[_id];
        if(_entity) 
        {
            let _talkConfig:any;
            let _content:string = "";
            let _time:number = 5;
            if(_entity.objType == RpgObjectType.Pet)
            {
                _talkConfig = ConfigManager.petTalk.getByPk(data.configId_I);
            }
            else if(_entity.objType == RpgObjectType.Monster)
            {
                _talkConfig = ConfigManager.bossTalk.getByPk(data.configId_I);
            }
            if(!_talkConfig) return;
            _time = _talkConfig.timeDuration;
            _talkConfig = ConfigManager.talkContent.getByPk(data.talkId_I);
            if(_talkConfig) _content = _talkConfig.content;
            else _content = "config error talkId:" + data.talkId_I;
            _entity.talk(_content,_time);
        }
    }

    /**显示地面特效 */
    public showClickPointMc(x:number,y:number):void
    {
        if(!this.gPointMc)
        {
            this.gPointMc = ObjectPool.pop("MovieClip");
        }
        this.gameGroundLayer.addChild(this.gPointMc);
        this.gPointMc.x = x;
        this.gPointMc.y = y;
        this.gPointMc.playFile(ResourcePathUtils.getRPGGameCommon() + "click_ground",-1, ELoaderPriority.UI_EFFECT);
        if(this.gForbidIcon && this.gForbidIcon.displayObject.parent)
        {
            if(this.gTimeOutIndex != -1) {
                egret.clearTimeout(this.gTimeOutIndex);
                this.gTimeOutIndex = -1;
            }
            this.gForbidIcon.clear();
            App.DisplayUtils.removeFromParent(this.gForbidIcon.displayObject);
            this.gForbidIcon = null;
        }
    }

    public hideClickPointMc():void
    {
        if(this.gPointMc)
        {
            this.gPointMc.reset();
            App.DisplayUtils.removeFromParent(this.gPointMc);
        }
    }

    /**显示禁止通行图标 */
    public showForbidIcon(x:number,y:number):void
    {
        this.hideClickPointMc();
        if(!this.gForbidIcon)
        {
            this.gForbidIcon = ObjectPool.pop("GLoader");
            this.gForbidIcon.width = 50;
            this.gForbidIcon.height = 43;
            this.gameGroundLayer.addChild(this.gForbidIcon.displayObject);
            this.gForbidIcon.load(ResourcePathUtils.getRPGGameCommon() + "forbidIcon.png");
            this.gForbidIcon.setPivot(0.5,0.5,true);
        }
        this.gForbidIcon.x = x;
        this.gForbidIcon.y = y;
        if(this.gTimeOutIndex != -1)
        {
            egret.clearTimeout(this.gTimeOutIndex);
        }
        this.gTimeOutIndex = egret.setTimeout(function(){
            this.gForbidIcon.clear();
            App.DisplayUtils.removeFromParent(this.gForbidIcon.displayObject);
            this.gForbidIcon = null;
            this.gTimeOutIndex = -1;
        },this,1000);
    }

    public updateModelIsShow(type:RpgObjectType[]):void
    {
        for(let id in this.entitys)
        {
            let _entity:RpgGameObject = this.entitys[id];
            if(type.indexOf(_entity.objType) == -1 || EntityUtil.isSpecificBossType(_entity.entityInfo)) continue;
            _entity.updateModelIsShow();
        }
    }

    // public setLeaderPlayer(player:MainPlayer): void {
    //     let bUpdate:boolean = !this.leaderPlayer;
    //     this.leaderPlayer = player;
    //     bUpdate && this.updateMainPlayer();
    // }

    public setRender(renderLv:ERpgRenderLevel):void {
        let vis:boolean;
        let idx:number;
        if (renderLv == ERpgRenderLevel.NONE) {
            vis = false;
            idx = 0;
        } else if (renderLv == ERpgRenderLevel.ONLY_MAP) {
            vis = false;
            idx = 1;
        } else {
            vis = true;
            idx = 0;
        }
        while (idx < this.gameLayer.numChildren) {
            this.gameLayer.getChildAt(idx).visible = vis;
            idx++;
        }
        LayerManager.UI_XP_SKILL_DOWN.visible = vis;
        LayerManager.UI_XP_SKILL_UP.visible = vis;

        if (renderLv != ERpgRenderLevel.FULL) {
            //清理技能特效
            // Effect.disposeAll();
            // MoveEffect.disposeAll();
            BaseSkillPlayer.disposeAll();
            //清理震屏
            App.ShakeUtils.cleanShake();
        }
    }

    public getRenderLevel():ERpgRenderLevel {
        if (this.background.visible) {
            return this.gameTipsLayer.visible ? ERpgRenderLevel.FULL : ERpgRenderLevel.ONLY_MAP;
        }
        return ERpgRenderLevel.NONE;
    }

    public getBlocksData(): number[][] {
        return this.blocksData;
    }

    public getGameLayer():egret.DisplayObjectContainer {
        return this.gameLayer;
    }

    public getGameGroundLayer(): egret.DisplayObjectContainer {
        return this.gameGroundLayer;
    }

    public getGameObjcetLayer(): egret.DisplayObjectContainer {
        return this.gameObjcetLayer;
    }

    public getGameObjectUILayer():egret.DisplayObjectContainer {
        return this.gameObjectUILayer;
    }

    public getGameObjectTxtLayer():egret.DisplayObjectContainer {
        return this.gameObjectTxtLayer;
    }

    public getGameEffectDownLayer(): egret.DisplayObjectContainer {
        return this.gameEffectDownLayer;
    }

    public getGameEffectUpLayer(): egret.DisplayObjectContainer {
        return this.gameEffectUpLayer;
    }

    public getGameEffectUpBottomLayer(): egret.DisplayObjectContainer {
        return this.gameEffectUpBottomLayer;
    }

    public getGameTipsLayer():egret.DisplayObjectContainer
    {
        return this.gameTipsLayer;
    }

    public getGameTalkLayer():egret.DisplayObjectContainer {
        return this.gameTalkLayer;
    }

    public getGameTweenLayer():egret.Sprite
    {
        return this.gameSelfTweenLayer;
    }

    public getBackground(): RpgBackground {
        return this.background;
    }

    public getMainPlayer(): MainPlayer {
        return this.mainPlayer;
    }

    public getLeaderPlayer(): MainPlayer {
        return this.leaderPlayer;
    }

    public get isMainPlayerCreate(): boolean {
        return this.mainPlayer ? true : false;
    }

    public get leaderPlayer():MainPlayer {
        return CacheManager.king.leaderEntity;
    }

    public get mainPlayer():MainPlayer {
        return CacheManager.king.kingEntity;
    }

    public getEntitys():{[entityId:string]:RpgGameObject}
    {
        return this.entitys;
    }

    public cacheAsBitmapLayer(value:boolean):void {
        this.gameObjectTxtLayer.cacheAsBitmap = value;
    }
}