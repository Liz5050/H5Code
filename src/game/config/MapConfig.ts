/**
 * 地图配置
 * 701001_scene.json
 * 
 */
class MapConfig {
    private mapInfoDict: any = {};
    /**地图网，主要用于记录地图间的传送关联 */
    private mapNet: any = {};
    /**保存所有npc信息 */
    private npcDict: any = {};
    /** 全部场景配置*/
    private sceneConfig:any;

    public constructor() {
        this.sceneConfig = ConfigManager.Data["scene_config"];
        let scene:any;
        for (let mapKey in this.sceneConfig) {
            scene = this.sceneConfig[mapKey];
            let mapId:number = scene.mapId;
            let mapMaping:any = ConfigManager.mapMaping.getByPk(mapId);
            let resMapId:number = mapId;
            if(mapMaping) resMapId = mapMaping.toMapId;
            let mapInfo: MapInfo = new MapInfo(resMapId, this.getSceneConfig(resMapId));
            this.mapInfoDict[resMapId] = mapInfo;
        }

        this.initMapNet();
        this.initNpc();
    }

    public getMapInfo(mapId: number): MapInfo {
        let mapMaping:any = ConfigManager.mapMaping.getByPk(mapId);
        let resMapId:number = mapId;
        if(mapMaping) resMapId = mapMaping.toMapId;
        if(this.mapInfoDict[resMapId] == null){
            this.mapInfoDict[resMapId] = new MapInfo(resMapId, this.getSceneConfig(resMapId));
        }
        return this.mapInfoDict[resMapId];
    }

    /**
     * 获取传送点
     * @returns null表示2个地图之间不关联
     */
    public getPassPoint(fromMapId: number, toMapId: number): any {
        let dict: any = this.mapNet[fromMapId];
        if (dict != null) {
            return dict[toMapId];
        }
        return null;
    }

    /**
     * 通过传送点id获取传送点
     * @returns 传送点
     */
    public getPassPointById(mapId: number, passPointId: number): any {
        let mapMaping: any = ConfigManager.mapMaping.getByPk(mapId);
        let toMapId: number = mapMaping ? mapMaping.toMapId : mapId;
        let mapInfo: MapInfo = this.mapInfoDict[toMapId];
        if (mapInfo != null) {
            return mapInfo.getPassPoint(passPointId);
        }
        return null;
    }

    /**
     * 获取npc配置信息
     */
    public getNpc(npcId: number): any {
        return this.npcDict[npcId];
    }

    public getMapNameByNpcId(npcId:number):string{
        let mapName:string = "";
        let npc:any = this.getNpc(npcId);
        if(npc != null){
            let mapInfo:MapInfo = this.getMapInfo(npc.mapId);
            if(mapInfo){
                mapName = mapInfo.getByKey("name");
            }
        }
        return mapName;
    }

     /**
     * 初始化地图网，{mapId: {toMapId1: 下一个必经过的传送阵, toMapId2: 下一个必经过的传送阵}}
     */
    private initMapNet(): void {
        for (let mapId in this.mapInfoDict) {
            this.mapNet[mapId] = this.getPassPointDictByMapId(Number(mapId));
        }

        // let dict: any = { "701001": this.mapNet["701001"], "702001": this.mapNet["702001"], "700001": this.mapNet["700001"] };
        let processDict:any;//当前正在处理的
        for (let mapId in  this.mapNet) {//缥缈峰
            let ppDict: any = this.mapNet[mapId];
            processDict = ppDict;
            while (processDict != null) {
                let nextPPDict: any;
                for (let toMapId in ppDict) {
                    let passPoint: any = ppDict[toMapId];//传送点青云剑宗
                    let toMapPPDict: any = this.getPassPointDictByMapId(Number(toMapId));//青云剑宗地图内的所有的传送点
                    for (let ppMapId in toMapPPDict) {
                        let pp: any = toMapPPDict[ppMapId];//传送点
                        for (let passTo of pp.passTo) {
                            let passToMapId: number = passTo.mapId;
                            if (ppDict[passToMapId] == null && passToMapId != Number(mapId)) {
                                ppDict[passToMapId] = passPoint;
                                if(nextPPDict == null){
                                    nextPPDict = {};
                                }
                                nextPPDict[passToMapId] = passPoint;
                            }
                        }
                    }
                }
                processDict = nextPPDict;
            }
        }
    }

    /**
     * 获取指定地图的所有传送阵字典
     * @returns {mapId: {toMapId1: 传送阵, toMapId2: 传送阵}}
     */
    private getPassPointDictByMapId(mapId: number): any {
        let dict: any = {};
        let mapInfo: MapInfo = this.mapInfoDict[mapId];
        if (mapInfo != null) {
            let passPoints: Array<any> = mapInfo.getPassPoints();
            for (let passPoint of passPoints) {
                for (let passTo of passPoint.passTo) {//一个传送点只能传送一个图
                    dict[passTo.mapId] = passPoint;
                }
            }
        }else{
            // console.log(`地图${mapId}_scene未配置数据`);
        }
        return dict;
    }

    /**
     * 初始化所有npc
     */
    private initNpc(): void {
        let mapInfo: MapInfo;
        for (let mapId in this.mapInfoDict) {
            mapInfo = this.mapInfoDict[mapId];
            for (let npc of mapInfo.getNpcs()) {
                this.npcDict[npc.npcId] = npc;
            }
        }
    }

    public getSceneConfig(resId:number):any {
        return this.sceneConfig[resId + "_scene"];
    }
}