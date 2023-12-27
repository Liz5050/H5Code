
class RpgBackground extends egret.DisplayObjectContainer {
    private _mapId: number;
    private miniBg: egret.Bitmap;
    private tiles: RpgTiles;
    public mapWidth:number;
    public mapHeight:number;

    public constructor() {
        super();

        this.miniBg = new egret.Bitmap();
        this.addChild(this.miniBg);

        this.tiles = new RpgTiles();
        this.addChild(this.tiles);
    }

    public init() {
        this._mapId = CacheManager.map.getMapResId();

        let mapData: any = CacheManager.map.getCurMapData();//RES.getRes("map_" + mapId + "_data.json");
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;

        this.miniBg.texture = RES.getRes("map_" + this.mapId + "_mini.jpg");
        this.miniBg.width = this.mapWidth;
        this.miniBg.height = this.mapHeight;

        this.tiles.init(this.mapId);
    }

    public updateCameraPos($x: number, $y: number, $dir:number = -1): void {
        this.tiles.updateCameraPos($x, $y, $dir);
    }

    public destory(): void {
        this.tiles.destory();
        if (this.miniBg.texture) {
            if (this.isDisposeMini()) {
                this.miniBg.texture.dispose();
                App.LoaderManager.destroyRes("map_" + this.mapId + "_mini.jpg");
            }
            this.miniBg.texture = null;
        }
    }

    public get mapId():number {
        return this._mapId;
    }

    public isDisposeMini():boolean {
        /*let sceneData:any = ConfigManager.map.getSceneConfig(this.mapId);
        if (sceneData) {//关卡地图频繁使用，所以不作销毁
            return sceneData.instanceType != EMapInstanceType.EMapInstanceTypeCheckPoint;
        }*/
        return true;
    }
}