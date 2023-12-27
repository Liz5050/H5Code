/**
 * 寻路工具
 * @author Chris
 */
class PathUtils {
    /**
     * 获取最近一个能走的点
     */
    public static findClosePoint(startPos: egret.Point, endPos: egret.Point, range: number): egret.Point {
        let _a: number = Math.atan2((endPos.y - startPos.y), (endPos.x - startPos.x));
        let _dis: number = egret.Point.distance(startPos, endPos);
        let _offDis: number = _dis - range;
        let _targetPoint: egret.Point;
        if (_offDis > 0) {
            _targetPoint = new egret.Point(startPos.x + (_offDis * Math.cos(_a)), startPos.y + (_offDis * Math.sin(_a)));
        }

        if (_targetPoint && ControllerManager.rpgGame.view.astar.pixelXYCanWalk(_targetPoint.x, _targetPoint.y) == true) {
            // Log.trace(Log.FIGHT, "disPos=", _offDis, _dis, `${startPos}->${endPos}`, `${_targetPoint}`);
            return _targetPoint;
        }
        let revisePos: egret.Point = this.revisePoint(startPos, endPos, _offDis);
        if (revisePos) {
            return MathUtils.isInRange(startPos, revisePos, range) ? revisePos : null;
        }
        return null;
    }

    public static revisePoint(startPos: egret.Point, endPos: egret.Point, startDis:number): egret.Point {
        if (endPos == null) {
            return null;
        }
        let _astar: SilzAstar = ControllerManager.rpgGame.view.astar;
        if (startDis == 0 && _astar.pixelXYCanWalk(endPos.x, endPos.y) == true) {
            return endPos;
        }
        let _distance: number = egret.Point.distance(startPos, endPos);
        let _stepLength: number = Math.ceil((_distance / 30));
        let _stepIndex: number = Math.ceil(startDis * Math.SQRT2 / 2 / Math.abs(endPos.x - startPos.x) * _stepLength);
        if (_stepIndex < 1) _stepIndex = 1;
        else if (_stepIndex > _stepLength) _stepIndex = _stepLength;
        let _stepX: number;
        let _stepY: number;
        let _stepPoint: egret.Point;
        while (_stepIndex < _stepLength) {
            _stepX = (startPos.x + ((endPos.x - startPos.x) * (_stepIndex / _stepLength)));
            _stepY = (startPos.y + ((endPos.y - startPos.y) * (_stepIndex / _stepLength)));
            _stepPoint = new egret.Point(Math.floor(_stepX), Math.floor(_stepY));
            if (_astar.pixelXYCanWalk(_stepX, _stepY) == true) {
                return _stepPoint;
            }
            _stepIndex++;
        }

        return null;
    }

    /** 判断格子是否可以行走 */
    public static gridXYCanWalk(x: number, y: number): boolean {
        if (ControllerManager.rpgGame.view.astar) {
            return ControllerManager.rpgGame.view.astar.gridXYCanWalk(x, y);
        } else {
            return false;
        }
    }

    /** 判断像素坐标是否可以行走 */
    public static pixelXYCanWalk(x: number, y: number): boolean {
        if (ControllerManager.rpgGame.view.astar) {
            return ControllerManager.rpgGame.view.astar.pixelXYCanWalk(x, y);
        } else {
            return false;
        }
    }

    /** 判断是否可以冲刺 */
    public static canLineRush(x: number, y: number, tx:number, ty:number): boolean {
        if (ControllerManager.rpgGame.view.astar) {
            return ControllerManager.rpgGame.view.astar.canLineRush(x, y, tx, ty);
        } else {
            return false;
        }
    }

    /** 点击不可寻路点时，地图寻路到最接近的可行走点 */
    public static getNearestUnreachablePoint(x1: number, y1: number, x2: number, y2: number): egret.Point {
        if (this.gridXYCanWalk(x2, y2)) {
            return new egret.Point(x2, y2);
        }

        let walkPoints: Array<egret.Point> = App.MathUtils.getLineSegmentPoints(x1, y1, x2, y2);
        let point: egret.Point;
        for (let i: number = walkPoints.length - 1; i >= 0; i--) {
            point = walkPoints[i];
            if (this.gridXYCanWalk(point.x, point.y))
                return point;
        }
        return new egret.Point(x1, y1); //返回原点
    }

    /** 判断两个格子中间是否有阻挡 */
    public static checkBlock(fromPoint:egret.Point, toPoint:egret.Point):boolean
    {
        //X坐标相等
        let point:egret.Point = RpgGameUtils.point;
        if (fromPoint.x == toPoint.x)
        {
            let fromY = fromPoint.y < toPoint.y ? fromPoint.y : toPoint.y; //min
            let toY = fromPoint.y < toPoint.y ? toPoint.y : fromPoint.y;   //max
            point.x = fromPoint.x;
            for (point.y = fromY + 1; point.y < toY; point.y++)
            {
                if (this.gridXYCanWalk(point.x, point.y) == false)
                    return true;
            }
            return false;
        }

        if (fromPoint.y == toPoint.y)
        {
            let fromX = fromPoint.x < toPoint.x ? fromPoint.x : toPoint.x; //min
            let toX = fromPoint.x < toPoint.x ? toPoint.x : fromPoint.x;   //max
            point.y = fromPoint.y;
            for (point.x = fromX + 1; point.x < toX; point.x++)
            {
                if (this.gridXYCanWalk(point.x, point.y) == false)
                    return true;
            }
            return false;
        }

        let formPoint1;
        let toPoint1;
        {
            if (toPoint.x > fromPoint.x)
            {
                formPoint1 = fromPoint;
                toPoint1 = toPoint;
            }
            else
            {
                formPoint1 = toPoint;
                toPoint1 = fromPoint;
            }
            let tan:number = (toPoint1.y - formPoint1.y) / (toPoint1.x - formPoint1.x);

            //按X计算Y
            for (let x:number = formPoint1.x; x <= toPoint1.x; x++)
            {
                point.x = x;
                let addY:number = tan * (x - formPoint1.x);
                point.y = formPoint1.y + Math.floor(addY);
                if (this.gridXYCanWalk(point.x, point.y) == false)
                    return true;
                if (addY - Math.floor(addY) > 0)
                {
                    ++point.y;
                    if (this.gridXYCanWalk(point.x, point.y) == false)
                        return true;
                }
            }
        }
        {
            if (toPoint.y > fromPoint.y)
            {
                formPoint1 = fromPoint;
                toPoint1 = toPoint;
            }
            else
            {
                formPoint1 = toPoint;
                toPoint1 = fromPoint;
            }
            let ctan:number = (toPoint1.x - formPoint1.x) / (toPoint1.y - formPoint1.y);

            //按Y计算X
            for (let y:number = formPoint1.y; y <= toPoint1.y; y++)
            {
                point.y = y;
                let addX:number = ctan * (y - formPoint1.y);
                point.x = formPoint1.x + Math.floor(addX);
                if (this.gridXYCanWalk(point.x, point.y) == false)
                    return true;
                if (addX - Math.floor(addX) > 0)
                {
                    ++point.x;
                    if (this.gridXYCanWalk(point.x, point.y) == false)
                        return true;
                }
            }
        }
        return false;
    }

    /**
     * 是否在攻击范围内且中间无阻挡
     * @returns {boolean}
     */
    public static canAttackRange(grid1:egret.Point, grid2:egret.Point, range:number, ignoreBlock:boolean = false, offset:boolean = true):boolean
    {//Log.trace(Log.FIGHT, `${grid1}->${grid2}, range=${range}`, PathUtils.isInAttackRange(grid1, grid2, range), PathUtils.checkBlock(grid1, grid2) == false)
        return PathUtils.isInAttackRange(grid1, grid2, range, offset) && (ignoreBlock || PathUtils.checkBlock(grid1, grid2) == false);
    }

    /**
     * 是否在攻击范围内
     * @returns {boolean}
     */
    public static isInAttackRange(grid1:egret.Point, grid2:egret.Point, range:number, offset:boolean = true):boolean
    {//Log.trace(Log.FIGHT, "isInAttackRange=", PathUtils.pointDistance(grid1, grid2) * RpgGameData.GameCellBase * RpgGameData.GameCellBase, range * range)
        let ellipseRange:number = PathUtils.getEllipseRange(grid1, grid2, range);
        return PathUtils.pointDistance(grid1, grid2, offset) * RpgGameData.GameCellBase * RpgGameData.GameCellBase <= ellipseRange * ellipseRange;
    }

    private static pointDistance(grid1:egret.Point, grid2:egret.Point, offset:boolean = true):number
    {
        let dx:number = Math.abs(grid1.x - grid2.x);
        // if (dx > 0 && offset) dx++;
        let dy:number = Math.abs(grid1.y - grid2.y);
        // if (dy > 0 && offset) dy++;
        return dx * dx * RpgGameData.GameCellWMH * RpgGameData.GameCellWMH + dy * dy;
    }

    private static e_aMinusb:number = 1.1;//椭圆长直径a/椭圆短直径b
    /**
     * 根据a,b,两个点获取弦长
     */
    private static getEllipseRange(grid1:egret.Point, grid2:egret.Point, a:number):number
    {
        let b:number = a / PathUtils.e_aMinusb >> 0;
        if (grid1.x == grid2.x) return a;
        else if (grid1.y == grid2.y) return b;
        let p1:egret.Point = RpgGameUtils.convertCellToXY(grid1.x, grid1.y);
        let p2:egret.Point = RpgGameUtils.convertCellToXY(grid2.x, grid2.y);
        let k:number = (p2.y - p1.y) / (p2.x - p1.x);
        let x:number = Math.sqrt(a * a * b * b / (k * k * b * b + a * a));
        let y:number = k * x;
        let er:number = Math.sqrt(x * x + y * y);
        return er;
    }

    /*public static pointDistanceCanRush(grid1:egret.Point, grid2:egret.Point, range:number):boolean
    {
        let grid3:egret.Point = grid1.clone();
        let grid4:egret.Point = grid2.clone();
        let offx:number = grid3.x - grid4.x; 
        if (offx > 0) offx = 1;
        else if (offx < 0) offx = -1;
        let offy:number = grid3.y - grid4.y;
        if (offy > 0) offy = 1;
        else if (offy < 0) offy = -1;
        let dGrid:number = 0;
        while (PathUtils.isInAttackRange(grid3, grid4, range) == false)
        {
            if (grid3.x != grid4.x) grid3.x -= offx;
            if (grid3.y != grid4.y) grid3.y -= offy;
            dGrid++;
        }
        return dGrid > 2;
    }*/

    /**
     * 直线寻路：A*寻路之前使用
     */
    public static findBeelinePath(startPx:number,startPy:number,endPx:number,endPy:number):PathNode[] {
        if (startPx < 0 || startPy  < 0 || endPx  < 0 || endPy  < 0) {
            return null;
        }
        let _stepX:number;
        let _stepY:number;
        let _stepGX:number;
        let _stepGY:number;
        let _stepPoint:PathNode;
        let _path:PathNode[] = [];
        let _distance:number = Math.sqrt((startPx - endPx) * (startPx - endPx) + (startPy - endPy) * (startPy - endPy));
        let _stepLength:number = Math.ceil((_distance / 30));
        let _stepIndex:number = 1;
        let _lastStepPoint:PathNode;
        while (_stepIndex <= _stepLength) {
            _stepX = Math.floor(startPx + ((endPx - startPx) * (_stepIndex / _stepLength)));
            _stepY = Math.floor(startPy + ((endPy - startPy) * (_stepIndex / _stepLength)));
            _stepGX = Math.floor(_stepX / RpgGameData.GameCellWidth);
            _stepGY = Math.floor(_stepY / RpgGameData.GameCellHeight);
            if (this.gridXYCanWalk(_stepGX, _stepGY) == false) {
                return null;
            }
            if (_lastStepPoint && (_lastStepPoint.x == _stepGX && _lastStepPoint.y == _stepGY)) {//跟上一个点是同一个格子
                _stepIndex++;
                continue;
            }
            _stepPoint = new PathNode(_stepGX, _stepGY);
            _stepPoint.setSPos(_stepX,_stepY);
            _path.push(_stepPoint);
            _lastStepPoint = _stepPoint;
            _stepIndex++;
        }
        if (_path.length == 0) {
            return null;
        }
        let startPoint:PathNode = new PathNode(Math.floor(startPx / RpgGameData.GameCellWidth), Math.floor(startPy / RpgGameData.GameCellHeight));
        _path.unshift(startPoint);
        let _endPoint:PathNode;
        if(_path.length>=3) {
            let _index:number = 0;
            let _newPath:PathNode[] = [];
            _endPoint = _path.pop();
            while(_index<_path.length) {
                _newPath.push(_path[_index]);
                _index+=2;
            }

            _newPath.push(_endPoint);
            return _newPath;
        }

        return _path;
    }

    /**
     * 主角是否在范围内
     * @param targetX 格子坐标
     * @param targetY 格子坐标
     * @param distance 距离目标点的距离(格子)
     */
    public static isInRange(targetX: number, targetY: number, distance: number = 3): boolean {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntity != null) {
            let x: number = kingEntity.col;
            let y: number = kingEntity.row;
            let d:number = App.MathUtils.getDistance(x ,y , targetX, targetY);
            if(d <= distance){
                return true;
            }
        }
        return false;
    }

    /**
     * 主角是否在范围内
     * @param targetX 格子坐标
     * @param targetY 格子坐标
     * @param distance 距离目标点的距离(像素)
     */
    public static isInPixRange(targetX: number, targetY: number, pixDistance: number = 0): boolean {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntity != null) {
            let targetPos:egret.Point = RpgGameUtils.convertCellToXY(targetX, targetY);
            let d:number = egret.Point.distance(kingEntity.pixPoint , targetPos);
            if(d <= pixDistance){
                return true;
            }
        }
        return false;
    }

    public static printPath(path:PathNode[]):string {
        let pathStr:string = "";
        for (let node of path) {
            pathStr += `(${node.x}, ${node.y})->`;
        }
        return pathStr;
    }
}