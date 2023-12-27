/**
 * 场景控制
 */
class SceneController extends BaseController {
    private mapId: number;
    private mapGroupKey: string;

    private _isGlobalJump: boolean = false;

    private complateAction: Function;
    private complateActionObj: any;

    private loginInfo: any;

    private gSceneState:SceneStateEnum = SceneStateEnum.None;
    public constructor() {
        super(ModuleEnum.Scene);
    }

    // public get isLoadingMap(): boolean {
    //     return this._isLoadingMap;
    // }

    public get sceneReady():boolean
    {
        return this.sceneState == SceneStateEnum.AllReady;
    }

    public set sceneState(value:SceneStateEnum)
    {
        if(value == this.gSceneState) return;
        this.gSceneState = value;
        if(value == SceneStateEnum.AllReady) {
            Log.trace(Log.RPG, "场景更新流程-------->>>>>>派发SceneMapUpdated","地图状态：",SceneStateEnum[ControllerManager.scene.sceneState]);
            EventManager.dispatch(UIEventEnum.SceneMapUpdated);
        }
    }

    /**仅设置地图状态，不发事件 */
    public setOnlyState(value:SceneStateEnum):void {
        if(this.gSceneState == value) {
            return;
        }
        this.gSceneState = value;
        Log.trace(Log.RPG,"设置地图状态不发事件",SceneStateEnum[value]);
    }

    public get sceneState():SceneStateEnum
    {
        return this.gSceneState;
    }

    public get isGlobalJump(): boolean {
        return this._isGlobalJump;
    }
    public set isGlobalJump(value: boolean) {
        if (value) {
            Tips.show("设置全局跳跃");
        } else {
            Tips.show("取消全局跳跃");
        }
        this._isGlobalJump = value;
    }

    // public converyMap(mapId: number, pos_x: number, pos_y: number, otherObj: any = null): void {
    //     // this.controller.applyFunc(GameConst.Remove_Enemy, this);

    //     // (ControllerManager.rpgGame.getModel() as RpgGameModel).playerData.propertyData.playerId;

    //     Log.trace("map::::, mapId:",  mapId);
    //     Log.trace("map::::, pos_x:",  pos_x);
    //     Log.trace("map::::, pos_y:",  pos_y);
    //     Log.trace("map::::, playerId:",  (ControllerManager.rpgGame.getModel() as RpgGameModel).playerData.propertyData.playerId);

    //     this.mapId = mapId;
    //     this.loginInfo = {
    //         name: (ControllerManager.rpgGame.getModel() as RpgGameModel).playerData.propertyData.name,
    //         playerId: (ControllerManager.rpgGame.getModel() as RpgGameModel).playerData.propertyData.playerId,
    //         pos: {x_I: pos_x, y_I: pos_y}};

	// 	this.preloadMapRes(mapId, function (mapId: number, loginInfo: any):void {
	// 		App.SceneManager.runScene(SceneConsts.RpgGame, this.mapId, this.loginInfo);
    //     }, this);
    // }

    public preloadMapRes(mapId: number, complateAction: Function, complateActionObj: any): void {
        // this._isLoadingMap = true;
        // this.gSceneReady = false;
        if(this.complateAction) {
            this.complateAction = null;
            this.complateActionObj = null;
        }
        this.complateAction = complateAction;
        this.complateActionObj = complateActionObj;

        Log.trace(Log.RPG, "场景更新流程-------->>>>>>加载地图配置: 资源id" + mapId,"实际地图id : ",CacheManager.map.mapId,"地图状态：",SceneStateEnum[ControllerManager.scene.sceneState],"当前时间：",egret.getTimer());
        this.mapId = mapId;//1193
        // this.mapGroupKey = "map_" + this.mapId;
        // this.initMapResource();

        //loading模块第一个就需要初始化
        //ControllerManager.initLoading();

        //加载资源
        var groupName: string = "map_res_" + this.mapId;
        // var subGroups: Array<string> = [this.mapGroupKey];
        // App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
        let resCfgs:any[] = ResourceManager.genResourcesMap(this.mapId, ConfigManager.client.getSpecialMapIds().indexOf(this.mapId) != -1);
        App.LoaderManager.loadGroup(groupName, resCfgs, this.onResourceLoadComplete, this, ELoaderPriority.TOP, [groupName], this.onResourceLoadProgress);
    }

    private initMapResource(): void {
        let mapResPath: string = ResourcePathUtils.getRPGGameMap() + this.mapId + "/" + this.mapId + "_";
        let mapResKey: string = this.mapGroupKey + "_";
        let mapResKeys: string[] = [];
        let mapRes: any[];

        if (ConfigManager.client.getSpecialMapIds().indexOf(this.mapId) == -1) {
            mapRes = [
                {
                    name: "data.json",
                    type: "json"
                },
                {
                    name: "mini.jpg",
                    type: "image"
                }
            ];
        } else {
            mapRes = [
                {
                    name: "data.json",
                    type: "json"
                },
                {
                    name: "mini.jpg",
                    type: "image"
                },
                {
                    name: "special.json",
                    type: "json"
                }
            ];
        }

        let res:any;
        for(let i:number = 0; i < mapRes.length; i ++)
        {
            res = mapRes[i];
            let resKey: string = mapResKey + res.name;
            App.ResourceUtils.createResource(resKey, res.type, mapResPath + res.name);
            mapResKeys.push(resKey);
        }
        App.ResourceUtils.createGroup(this.mapGroupKey, mapResKeys);
    }

    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(data:any): void {
        // this._isLoadingMap = false;
        CacheManager.map.parseCurrentMapData();
        this.complateAction && this.complateAction.apply(this.complateActionObj,[data]);
        // this.complateAction = null;
        // this.complateActionObj = null;
        // this.gSceneReady = true;
    }

    /**
     * 资源组加载进度
     */
    private onResourceLoadProgress(itemsLoaded: number, itemsTotal: number): void {
        EventManager.dispatch(LocalEventEnum.LoadingProgressUpdate, itemsLoaded, itemsTotal);
    }
}