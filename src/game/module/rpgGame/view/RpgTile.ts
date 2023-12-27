/**
 * 地图格子基类
 */
class RpgTile extends egret.Bitmap {
    public col: number;
    public row: number;
    public tileResKey: string;

    public constructor() {
        super();
    }

    public init(mapId: number, col: number, row: number) {
        this.col = col;
        this.row = row;
        this.x = this.col * RpgGameData.GameTileWidth;
        this.y = this.row * RpgGameData.GameTileHeight;

        var tileResName: string = row + "_" + col + ".jpg";
        var tileResPath: string = ResourcePathUtils.getRPGGameMap() + mapId + "/" + mapId + "_" + tileResName;
        // var tileResPath: string = "resource/assets/rpgGame/map/" + mapId + "/" + tileResName;
        this.tileResKey = "map_" + mapId + "_" + tileResName;

        //异步加载
        App.ResourceUtils.createResource(this.tileResKey, "image", tileResPath);
        App.LoaderManager.getMapResAsync(this.tileResKey, this.loadComp, this, ELoaderPriority.MAP);
    }

    private loadComp(): void {
        this.texture = App.LoaderManager.getCache(this.tileResKey);
    }

    public destory(): void {
        App.DisplayUtils.removeFromParent(this);
        App.LoaderManager.removeMapResLoad(this.tileResKey, this.loadComp, this);
        App.LoaderManager.destroyRes(this.tileResKey);
        this.texture = null;
    }

}