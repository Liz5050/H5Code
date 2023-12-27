
class RpgGameUtils {
    public static ZERO_POS:egret.Point = new egret.Point(0, 0);
    public static MIDDLE_HEIGHT:number = 673 / 1166;

    private static pointIdx:number = 0;
    private static pointQueue:egret.Point[] = [];
    /**
     * 游戏内通用50个点循环使用，不再多new
     * 调用此方法获得到Point后，最好立刻用临时变量保存起来再使用 e.g. let px = pt.x;let py = pt.y;
     * @returns {egret.Point}
     */
    public static get point(): egret.Point {
        let point:egret.Point = RpgGameUtils.pointQueue[RpgGameUtils.pointIdx];
        if (!point)
            point = RpgGameUtils.pointQueue[RpgGameUtils.pointIdx] = new egret.Point();
        RpgGameUtils.pointIdx %= 50;
        RpgGameUtils.pointIdx++;
        return point;
    }

    public static convertCellToXY(col: number, row: number, resultPoint?: egret.Point): egret.Point {
        if (!resultPoint) resultPoint = RpgGameUtils.point;
        resultPoint.x = col * RpgGameData.GameCellWidth + RpgGameData.GameCellWidth * 0.5;
        resultPoint.y = row * RpgGameData.GameCellHeight + RpgGameData.GameCellHeight * 0.5;
        return resultPoint;
    }

    public static convertXYToCell(x: number, y: number, resultPoint?: egret.Point): egret.Point {
        if (!resultPoint) resultPoint = RpgGameUtils.point;
        resultPoint.x = Math.floor(x / RpgGameData.GameCellWidth);
        resultPoint.y = Math.floor(y / RpgGameData.GameCellHeight);
        return resultPoint;
    }

    public static convertXYToAoi(x: number, y: number, resultPoint?: egret.Point): egret.Point {
        if (!resultPoint) resultPoint = RpgGameUtils.point;
        resultPoint.x = Math.floor(x / RpgGameData.GameAoiWidth);
        resultPoint.y = Math.floor(y / RpgGameData.GameAoiHeight);
        return resultPoint;
    }

    public static computeGameObjDir(currX: number, currY: number, gotoX: number, gotoY: number): Dir {
        let radian: number = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);

        let angle: number = App.MathUtils.getAngle(radian);
        return RpgGameUtils.computeDir4(angle);
    }

    public static inCamera(posX:number,posY:number):boolean {
        if(!ControllerManager.scene.sceneReady) return false;
        if(!ControllerManager.rpgGame.view) return false;
        let gameLayer: egret.DisplayObject = ControllerManager.rpgGame.view.getGameLayer();
        if(!gameLayer) return false;
        let minX: number = -gameLayer.x;
        let minY: number = -gameLayer.y;
        let maxX: number = minX + App.StageUtils.getWidth();
        let maxY: number = minY + App.StageUtils.getHeight();

        let minAoiPoint: egret.Point = RpgGameUtils.convertXYToAoi(minX, minY);
        let maxAoiPoint: egret.Point = RpgGameUtils.convertXYToAoi(maxX, maxY);
        let entityAoiPoint: egret.Point = RpgGameUtils.convertXYToAoi(posX, posY);
        return (entityAoiPoint.x >= minAoiPoint.x && entityAoiPoint.x <= maxAoiPoint.x) && (entityAoiPoint.y >= minAoiPoint.y && entityAoiPoint.y <= maxAoiPoint.y)
    }

    /** 8方向的 */
    public static computeDir8(angle: number): Dir {
        let dir: Dir;
        if (angle > -22.5 && angle <= 22.5) {
            dir = Dir.Right;
        }
        else if (angle > 22.5 && angle <= 67.5) {
            dir = Dir.BottomRight;
        }
        else if (angle > 67.5 && angle <= 90) {
            dir = Dir.Bottom;
        }
        else if (angle > 90 && angle <= 157.5) {
            dir = Dir.BottomLeft;
        }
        else if (angle > 157.5 || angle <= -157.5) {
            dir = Dir.Left;
        }
        else if (angle > -157.5 && angle <= -112.5) {
            dir = Dir.TopLeft;
        }
        else if (angle > -112.5 && angle <= -67.5) {
            dir = Dir.Top;
        }
        else {
            dir = Dir.TopRight;
        }
        return dir;
    }

    /** 4方向的 */
    public static computeDir(angle: number): Dir {
        let dir: Dir;
        if (angle > -2.5 && angle <= 22.5) {
            dir = Dir.Right;
        }
        else if (angle > 22.5 && angle <= 67.5) {
            dir = Dir.BottomRight;
        }
        else if (angle > 67.5 && angle <= 90) {
            dir = Dir.Bottom;
        }
        else if (angle > 90 && angle <= 157.5) {
            dir = Dir.BottomLeft;
        }
        else if (angle > 157.5 || angle <= -177.5) {
            dir = Dir.Left;
        }
        else if (angle > -177.5 && angle <= -92.5) {
            dir = Dir.TopLeft;
        }
        else if (angle > -92.5 && angle <= -67.5) {
            dir = Dir.Top;
        }
        else {
            dir = Dir.TopRight;
        }
        return dir;
    }

    /** 4方向的 */
    public static computeDir4(angle: number): Dir {
        let dir: Dir;
        if (angle > -22.5 && angle <= 22.5) {
            dir = Dir.Right;
        }
        else if (angle > 22.5 && angle <= 75.5) {
            dir = Dir.BottomRight;
        }
        else if (angle > 75.5 && angle <= 102.5) {
            dir = Dir.Bottom;
        }
        else if (angle > 102.5 && angle <= 157.5) {
            dir = Dir.BottomLeft;
        }
        else if (angle > 157.5 || angle <= -157.5) {
            dir = Dir.Left;
        }
        else if (angle > -157.5 && angle <= -90) {
            dir = Dir.TopLeft;
        }
        else if (angle > -102.5 && angle <= -77.5) {
            dir = Dir.Top;
        }
        else {
            dir = Dir.TopRight;
        }
        return dir;
    }

    /**
     * 获取目标方向dis距离格子
     * @param tile
     * @param {number} dir
     * @returns {any}
     */
    private static dirCell:any = {"x_SH":0, "y_SH":0};
    public static getToDirCell(tile:any, dir:number, dis:number = 1):any
    {
        let toCell:any = RpgGameUtils.dirCell;
        toCell.x_SH = tile.x_SH;
        toCell.y_SH = tile.y_SH;
        switch (dir)
        {
            case Dir.Top:
                toCell.y_SH-=dis;
                break;
            case Dir.TopRight:
                toCell.x_SH+=dis;
                toCell.y_SH-=dis;
                break;
            case Dir.Right:
                toCell.x_SH+=dis;
                break;
            case Dir.BottomRight:
                toCell.x_SH+=dis;
                toCell.y_SH+=dis;
                break;
            case Dir.Bottom:
                toCell.y_SH+=dis;
                break;
            case Dir.BottomLeft:
                toCell.x_SH-=dis;
                toCell.y_SH+=dis;
                break;
            case Dir.Left:
                toCell.x_SH-=dis;
                break;
            case Dir.TopLeft:
                toCell.x_SH-=dis;
                toCell.y_SH-=dis;
                break;
        }
        return toCell;
    }

    public static checkInScreen(pos:egret.Point):boolean
    {
        let stageWidth:number = App.StageUtils.getWidth() >> 1;
        let stageHeight:number = App.StageUtils.getHeight() >> 1;
        let centerX:number = CacheManager.king.leaderEntity.x;
        let centerY:number = CacheManager.king.leaderEntity.y;
        return Math.abs(centerX - pos.x) <= stageWidth && Math.abs(centerY - pos.y) <= stageHeight;
    }

    private static attackTargetPoint:any = {"x_SH":0, "y_SH":0};
    public static getAttackTargetPoint(entity:RpgGameObject) :any
    {
        let targetPoint:any = RpgGameUtils.attackTargetPoint;
        if (entity.battleObj)
        {
            let pixPos:egret.Point = entity.battleObj.pixPoint;
            let cellPos:egret.Point = RpgGameUtils.convertXYToCell(pixPos.x, pixPos.y);
            targetPoint.x_SH = cellPos.x;
            targetPoint.y_SH = cellPos.y;
        }
        else
        {
            targetPoint = RpgGameUtils.getToDirCell(entity.sPoint, entity.dir);
        }
        return targetPoint;
    }

}