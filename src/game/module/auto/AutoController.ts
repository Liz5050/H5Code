/**
 * 自动挂机控制器
 * modify by Chris@180404
 */
class AutoController extends BaseController {
    public constructor() {
        super(ModuleEnum.Auto);
    }

    public addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.AutoStartFight, this.autoStartFight, this);//开始自动挂机
        // this.addListen0(LocalEventEnum.AutoStopFight, this.autoStopFight, this);//停止自动挂机
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
    }

    private autoStartFight(data: any): void {        
        EventManager.dispatch(LocalEventEnum.AIStart, {
            "type": AIType.AutoFight,
            "data": data
        });
    }

    // private autoStopFight(): void {
    //     EventManager.dispatch(LocalEventEnum.AIStop);
    // }

    private onSceneMapUpdated():void {//地图加载完抛挂机事件
        // Log.trace(Log.RPG, "---场景准备完毕，进入自动挂机处理---");
        console.log("【场景】 ---场景准备完毕，进入自动挂机处理---");
        
        let isCheckPointMap:boolean = CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && !CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter);
        if (isCheckPointMap) {//关卡挂机
            ControllerManager.checkPoint.autoCheckPoint();
        } else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)){ //矿洞
        } else if(CacheManager.copy.isInCopy && !CopyUtils.isNotAutoCopy(CacheManager.copy.curCopyType)){ //副本挂机
            this.autoStartFight(null);
        } else {
            Log.trace(Log.RPG, "当前地图不符合自动挂机条件----地图ID：", CacheManager.map.mapId);
        }
    }
}