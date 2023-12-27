class MapController extends BaseController {

    // private collectView:SceneCollectBarView;
    public constructor() {
        super(ModuleEnum.Map);
    }

    public initView(): BaseModule {
        return null;
    }

    public addListenerOnInit(): void {
        // this.addMsgListener(ECmdGame[ECmdGame.ECmdGameConvey], this.onConveySuccess, this);

        this.addListen0(LocalEventEnum.AIStart, this.startAI, this);
        this.addListen0(LocalEventEnum.AIStop, this.stopAI, this);
        this.addListen0(LocalEventEnum.AIAdd, this.addAI, this);
        this.addListen0(LocalEventEnum.AutoStopFight, this.stopFightAI, this);

        this.addListen0(LocalEventEnum.SceneConvey, this.convey, this);
        this.addListen0(LocalEventEnum.SceneRouteToGrid, this.routeToGrid, this);
        this.addListen0(LocalEventEnum.SceneRouteToNpc, this.routeToNpc, this);
        this.addListen0(LocalEventEnum.SceneClickGround, this.clickGround, this);
        this.addListen0(LocalEventEnum.SceneChangeMap, this.changeMap, this);
        this.addListen0(UIEventEnum.SceneMapUpdated, this.sceneMapUpdated, this);
        this.addListen0(LocalEventEnum.SceneConveyComplete, this.sceneConveyComplete, this);

        this.addListen0(LocalEventEnum.ConveyToMainCity, this.conveyToMainCity, this);
        this.addListen0(LocalEventEnum.ConveyToCheckpoint, this.conveyToCheckpoint, this);
    }

    /**
     * 开启新AI，停止自动战斗
     */
    private startAI(param: any): void {
        AI.start(param.type, param.data);
    }

    private stopAI(param: any): void {
        AI.stop();
        this.clearBattleObj();
    }

    private stopFightAI(): void {
        AI.stopFightAI();
        this.clearBattleObj();
    }

    private addAI(param: any): void {
        AI.addAI(param.type, param.data);
    }

    private clearBattleObj(): void {
        CacheManager.bossNew.battleObj = null;
    }

    /**
     * 传送
     */
    private convey(data: any): void {
        if (CacheManager.map.mapId == data.mapId && egret.Point.distance(CacheManager.king.leaderEntity.gridPoint, data.point) < 20) {
            Tip.showTip(LangCommon.LANG3);
            if (!data.npc)
                this.routeToGrid({ "mapId": data.mapId, "x": data.point.x, "y": data.point.y, "callBack": data.callBack });
            else
                this.routeToNpc(data.npc);
            return;
        }
        if (CacheManager.king.leaderEntity.action == Action.Jump) {
            return;
        }
        let count: number = CacheManager.pack.backPackCache.getItemCountByFun(ItemsUtil.isConvey, ItemsUtil);
        if (count == 0 && CacheManager.vip.vipLevel < 1) {
            Tip.showTip(LangCommon.LANG4, Color.Red);
            if (!data.npc)
                this.routeToGrid({ "mapId": data.mapId, "x": data.point.x, "y": data.point.y, "callBack": data.callBack });
            else
                this.routeToNpc(data.npc);
            return;
        }
        CacheManager.map.conveyCallBack = data.callBack;
        ProxyManager.operation.convey(data.mapId, data.conveyType, data.point);
    }

    /**
     * 寻路到指定格子
     */
    private routeToGrid(data: any): void {
        //上坐骑
        EventManager.dispatch(UIEventEnum.HomeSwitchMount, MountEnum.UpMount);
        let mapId: number = data.mapId;
        let gridX: number = data.x;
        let gridY: number = data.y;
        let autoFight: boolean = data.autoFight ? data.autoFight : false;
        if (mapId == null) {
            mapId = CacheManager.map.mapId;
        }
        EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.Route, "data": { "mapId": mapId, "x": gridX, "y": gridY, autoFight: autoFight, "callBack": data.callBack } });
    }

    /**
     * 寻路到指定npc
     */
    private routeToNpc(data: any): void {
        //上坐骑
        EventManager.dispatch(UIEventEnum.HomeSwitchMount, MountEnum.UpMount);
        let npcId: number = data.npcId;
        EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.MoveToNpc, "data": { "npcId": data.npcId, "callBack": data.callBack } });
    }

    /**
     * 点击地面，清空人物相关状态
     */
    private clickGround(): void {
        EventManager.dispatch(LocalEventEnum.AIStop);
    }

    /**
     * 切换地图，使用的也是传送
     */
    private changeMap(data: any): void {
        let mapId: number = data;
        let mapInfo: MapInfo = ConfigManager.map.getMapInfo(mapId);
        if (mapInfo != null) {
            if (CacheManager.role.getRoleLevel() < mapInfo.getByKey("needLevel")) {
                Tip.showTip("等级不符合要求，无法传送");
                return;
            }
            ProxyManager.operation.convey(mapId, EConveyType.EConveyTypeNormal, { "x": 0, "y": 0 });
        } else {
            Tip.showTip("地图不存在");
        }
    }

    /**
     * 切换地图成功
     */
    private sceneMapUpdated(data: any): void {
        if (AI.aiListLength <= 0)
            EventManager.dispatch(LocalEventEnum.TaskGoto);
        let targetPropose: any = CacheManager.worldMap.targetPropose;
        if (targetPropose != null && targetPropose.mapId == CacheManager.map.mapId) {
            let callBack: CallBack = new CallBack(this.arrivePropose, this);
            EventManager.dispatch(LocalEventEnum.SceneRouteToGrid, { "mapId": targetPropose.mapId, "x": targetPropose.mapX, "y": targetPropose.mapY, "callBack": callBack });
        }

        this.sceneConveyComplete();
    }

    /**到达推荐挂机点，开启自动挂机 */
    private arrivePropose(): void {
        EventManager.dispatch(LocalEventEnum.AutoStartFight);
        CacheManager.worldMap.targetPropose = null;
    }

    /**
     * 小飞鞋传送完成
     */
    private sceneConveyComplete(): void {
        if (CacheManager.map.conveyCallBack != null) {
            CacheManager.map.conveyCallBack.fun.call(CacheManager.map.conveyCallBack.caller);
        }
        CacheManager.map.conveyCallBack = null;
    }

    private conveyToMainCity(): void {
        ProxyManager.operation.convey(MapUtil.MainCityMapId);
    }

    private conveyToCheckpoint(): void {
        let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
        let checkPointCfg: any = ConfigManager.checkPoint.getCheckPoint(floor + 1);
        if (checkPointCfg) {
            ProxyManager.operation.convey(checkPointCfg.mapId);
        }
    }
}