class WorldMapController extends BaseController {
    private module: WorldMapModule;

    public constructor() {
        super(ModuleEnum.WorldMap);
    }

    public initView(): BaseGUIView {
        this.module = new WorldMapModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addListen0(UIEventEnum.WorldMapShowRegionMap, this.showRegionMap, this);
        this.addListen0(UIEventEnum.WorldMapShowProposeMap, this.showProposeMap, this);
        
    }

    public addListenerOnShow(): void {
        this.addListen1(UIEventEnum.SceneMapUpdated, this.sceneMapUpdated, this);
        this.addListen1(LocalEventEnum.SceneFindPathNodes, this.onPathNodesUpdated, this);
        this.addListen1(LocalEventEnum.WorldMapGotoPropose, this.gotoPropose, this);
    }

    public afterModuleShow(data?: any): void {
        super.afterModuleShow(data);
        if (data != null) {
            this.module.updateRegionPanel(data);
        }
    }

    /**地图切换了 */
    private sceneMapUpdated(): void {
        this.hide();
    }

    /**
     * 人物寻路路径改变了
     */
    private onPathNodesUpdated(pathNodes: PathNode[]): void {
        this.module.updatePathNodes(pathNodes);
    }

    /**
     * 前往挂机点
     */
    private gotoPropose(propose: any): void {
        if (propose) {
            if (propose.mapId != CacheManager.map.mapId) {
                CacheManager.worldMap.targetPropose = propose;
                EventManager.dispatch(LocalEventEnum.SceneChangeMap, propose.mapId);
            } else {
                // let callBack: CallBack = new CallBack(this.arrivePropose, this);
                // EventManager.dispatch(LocalEventEnum.SceneRouteToGrid, { "mapId": propose.mapId, "x": propose.mapX, "y": propose.mapY, "callBack": callBack });
                EventManager.dispatch(LocalEventEnum.AIStart, {
                    "type": AIType.AutoFight,
                    "data": { "mapId": propose.mapId, "x": propose.mapX, "y": propose.mapY, "bossCode" : propose.bossCode}
                });
            }
        }
    }

    private arrivePropose(): void {
        EventManager.dispatch(LocalEventEnum.AutoStartFight);
    }

    private showRegionMap(data: any): void {
        let mapId: number = data;
        this.show(data);
    }

    private showProposeMap(): void{
        let bestPropose: any = ConfigManager.mgHookPropose.getBestPropose();
        if (bestPropose != null) {
            EventManager.dispatch(UIEventEnum.WorldMapShowRegionMap, bestPropose.mapId);
        }
    }
}