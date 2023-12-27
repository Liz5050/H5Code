
class RpgTiles extends egret.DisplayObjectContainer {

    private mapId: number;
    private tiles: any = [];
    private screenTiles: string[] = [];
    private cols: number;
    private rows: number;

    public constructor() {
        super();
    }

    public init(mapId: number): void {
        this.mapId = mapId;
        let mapData: any = RES.getRes("map_" + mapId + "_data.json");

        this.cols = Math.floor(mapData.width / RpgGameData.GameTileWidth);
        this.rows = Math.floor(mapData.height / RpgGameData.GameTileHeight);
    }

    public updateCameraPos($x: number, $y: number, $dir:number): void {
        if(!this.mapId) return;
        let currCol: number = $x / RpgGameData.GameTileWidth >> 0;
        let currRow: number = $y / RpgGameData.GameTileHeight >> 0;

        let screenCols: number = Math.ceil(App.StageUtils.getWidth() / RpgGameData.GameTileWidth);
        let screenRows: number = Math.ceil(App.StageUtils.getHeight() / RpgGameData.GameTileHeight);

        let halfScreenCols: number = Math.ceil(screenCols / 2);
        let halfScreenRows: number = Math.ceil(screenRows / 2);

        let minCol: number = currCol - halfScreenCols;
        let maxCol: number = currCol + halfScreenCols;
        if (minCol < 0) {
            //maxCol += -minCol;
            minCol = 0;
        }
        if (maxCol >= this.cols) {
            //minCol -= (maxCol - this.cols);
            if (minCol > 0) minCol--; //边缘优化
            maxCol = this.cols - 1;
        }
        let minRow: number = currRow - halfScreenRows;
        let maxRow: number = currRow + halfScreenRows;
        if (minRow < 0) {
            //maxRow += -minRow;
            minRow = 0;
        }
        if (maxRow >= this.rows) {
            //minRow -= (maxRow - this.rows);
            if (minRow > 0) minRow--; //边缘优化
            maxRow = this.rows - 1;
        }

        let screenTiles = RpgTiles.makeDirTileKeys(this.mapId, currCol, minCol, maxCol, minRow, maxRow, $dir);
        for (let key of screenTiles) {
            let tile: RpgTile = this.tiles[key];
            let sp:string[] = key.split('_');
            if (!tile) {
                let row:number = Number(sp[1]);
                let col:number = Number(sp[2]);
                if (row < minRow || row > maxRow)
                    continue;
                if (col < minCol || col > maxCol)
                    continue;

                tile = ObjectPool.pop("RpgTile");
                tile.init(Number(sp[0]), col, row);
                this.tiles[key] = tile;
            }
            if (!tile.parent) {
                this.addChild(tile);
            }
        }
        // for (let i = minCol; i <= maxCol; i++) {
        //     for (let j = minRow; j <= maxRow; j++) {
        //         let tileKey: string = this.mapId + "_" + j + "_" + i;
        //         let tile: RpgTile = this.tiles[tileKey];
        //         if (!tile) {
        //             tile = ObjectPool.pop("RpgTile")//new RpgTile();
        //             tile.init(this.mapId, i, j);
        //             this.tiles[tileKey] = tile;
        //         }
        //         if (!tile.parent) {
        //             this.addChild(tile);
        //         }
        //         screenTiles.push(tileKey);
        //     }
        // }

        //移除不在屏幕内的格子
        for (let k:number = 0; k < this.screenTiles.length; k++)
        {
            let tileKey:string = this.screenTiles[k];
            if (screenTiles.indexOf(tileKey) == -1) {
                let tile: RpgTile = this.tiles[tileKey];
                tile && App.DisplayUtils.removeFromParent(tile);
            }
        }
        this.screenTiles = screenTiles;

        /*console.log(">>>>>>>>>>>>>>resId= ", this.mapId, "mapId= ", CacheManager.map.mapId);
        console.log("curCol= " + currCol, "curRow= " + currRow
            , "screenCols= " + screenCols, "screenRows= " + screenRows
            , "halfScreenCols= " + halfScreenCols, "halfScreenRows= " + halfScreenRows
            , "rows= " + minRow + " - " + maxRow
            , "cols= " + minCol + " - " + maxCol
        );
        console.log("tiles to show--->");
        let str:string = "";
        for (let i = 0; i <screenTiles.length; i++) {
            str += screenTiles[i] + ',';
        }
        str += ("len="+screenTiles.length);
        console.log(str);

        console.log("tiles current--->");
        str = "";
        let len:number = 0;
        let tkey:string;
        for (tkey in this.tiles) {
            str += this.tiles[tkey].tileResKey + '|texture=' + (this.tiles[tkey].texture != null) + ', ';
            len++;
        }
        str+=("\nlen="+len);
        console.log(str);
        console.log("<<<<<<<<<<<<<<");*/
    }

    /**
     * 根据方向生成格子队列
     */
    public static makeDirTileKeys(mapId:number, currCol: number, minCol: number, maxCol: number, minRow: number, maxRow: number, dir: number) :string[]{
        let tileKeys:string[] = [];
        switch (dir)
        {
            case -1:
                for (let j = minRow; j <= maxRow; j++)
                    tileKeys.push(mapId + "_" + j + "_" + currCol);
                let leftCol:number = currCol - 1;
                let rightCol:number = currCol + 1;
                let total:number = (maxCol - minCol + 1) * (maxRow - minRow + 1);
                let maxCount:number = 0;
                while (tileKeys.length < total && maxCount < 100) {
                    if (leftCol >= minCol) {
                        for (let j = minRow; j <= maxRow; j++)
                            tileKeys.push(mapId + "_" + j + "_" + leftCol);
                        leftCol--;
                    }
                    if (rightCol <= maxCol) {
                        for (let j = minRow; j <= maxRow; j++)
                            tileKeys.push(mapId + "_" + j + "_" + rightCol);
                        rightCol++;
                    }
                    maxCount++;
                }
                if (maxCount >= 100) Log.trace(Log.FATAL, "-1计算地图格子有误!!!");
                break;
            case Dir.Left:
                for (let i = minCol; i <= maxCol; i++)
                    for (let j = minRow; j <= maxRow; j++)
                        tileKeys.push(mapId + "_" + j + "_" + i);
                break;
            case Dir.Right:
                for (let i = maxCol; i >= minCol; i--)
                    for (let j = minRow; j <= maxRow; j++)
                        tileKeys.push(mapId + "_" + j + "_" + i);
                break;
            case Dir.Top:
                for (let j = minRow; j <= maxRow; j++)
                    for (let i = minCol; i <= maxCol; i++)
                        tileKeys.push(mapId + "_" + j + "_" + i);
                break;
            case Dir.Bottom:
                for (let j = maxRow; j >= minRow; j--)
                    for (let i = minCol; i <= maxCol; i++)
                        tileKeys.push(mapId + "_" + j + "_" + i);
                break;
            case Dir.TopLeft:
                tileKeys = other4DirTiles(minCol, minRow, 1, 1);
                break;
            case Dir.TopRight:
                tileKeys = other4DirTiles(maxCol, minRow, -1, 1);
                break;
            case Dir.BottomLeft:
                tileKeys = other4DirTiles(minCol, maxRow, 1, -1);
                break;
            case Dir.BottomRight:
                tileKeys = other4DirTiles(maxCol, maxRow, -1, -1);
                break;
        }

        function other4DirTiles(col:number, row:number, colInc:number, rowInc:number) :string[] {
            let tileKeys:string[] = [];
            let tileKeyDic:{[key:string]:number} = {};
            let curKeys:number[][] = [[row, col]];
            let total:number = (maxCol - minCol + 1) * (maxRow - minRow + 1);
            let maxCount:number = 0;
            while (tileKeys.length < total && maxCount < 100) {
                let grid:any;
                let newKeys:number[][] = [];
                for (grid of curKeys) {
                    let roww:number = grid[0];
                    let coll:number = grid[1];
                    if (!tileKeyDic[roww+"_"+coll]) {
                        tileKeyDic[roww+"_"+coll] = 1;
                        tileKeys.push(mapId + "_" + roww + "_" + coll);
                        if ((roww + rowInc >= minRow && roww + rowInc <= maxRow)
                            && (coll + colInc >= minCol && coll + colInc <= maxCol)) {
                            newKeys.push([roww + rowInc, coll + colInc]);
                        }
                        if (roww + rowInc >= minRow && roww + rowInc <= maxRow) {
                            newKeys.push([roww + rowInc, coll]);
                        }
                        if (coll + colInc >= minCol && coll + colInc <= maxCol) {
                            newKeys.push([roww, coll + colInc]);
                        }
                    }
                }
                curKeys = newKeys;
                maxCount++;
            }
            if (maxCount >= 100) Log.trace(Log.FATAL, "计算地图格子有误!!!");
            return tileKeys;
        }
        return tileKeys;
    }

    public destory(): void {
        let mapKey:string;
        for (mapKey in this.tiles) {
            let tile: RpgTile = this.tiles[mapKey];
            tile.destory();
            ObjectPool.push(tile);
        }
        this.tiles = {};
        this.screenTiles.length = 0;//console.log("-----------map destory----------")
    }

}