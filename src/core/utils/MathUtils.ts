/**
 * 数学计算工具类
 */
class MathUtils extends BaseClass {

    /** 180度除以PI*/
    public static PIDIVIDED_BY_180: number = 180 / Math.PI;
    /** PI除以180度*/
    public static PIDIVIDE_180: number = Math.PI / 180;
    /** 0度角弧度*/
    public static ZEOR_RADIAN: number = Math.atan2(-1, 0);

    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    public getAngle(radian: number): number {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param angle
     */
    public getRadian(angle: number): number {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public getRadian2(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
        var xdis: number = p2X - p1X;
        var ydis: number = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    }

    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
        var disX: number = p2X - p1X;
        var disY: number = p2Y - p1Y;
        var disQ: number = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    }
    /**
     * 获取范围随机数
     */
    public getRandom(min:number,max:number):number{
        let ret:number = min + Math.random()*(max-min+1);
        return ret;
    }

    /**
     * 已知2个点，求中垂线上的固定距离的点。一般有2个，内部已经指定取朝上的点。有需要再分离
     * 目前用于怪物受击
     */
    private targetPos:number[] = [];
    public getMidperpendicularPoint(x1: number, y1: number, x2: number, y2: number, high: number = 0): number[] {
        // let targetPoint: egret.Point = new egret.Point();
        this.targetPos = [];
        let posX:number;
        let posY:number;
        //中间的点
        let midX: number = (x1 + x2) / 2;
        let midY: number = (y1 + y2) / 2;

        let disY1Y2: number = y1 - y2;
        let disX2X1: number = x2 - x1;

        var disQ: number = disY1Y2 * disY1Y2 + disX2X1 * disX2X1;
        let sqrtValue: number = high / Math.sqrt(disQ);

        let dirction: number = this.getAngle(this.getRadian2(x1, y1, x2, y2));
        if (Math.abs(dirction) < 90) {
            posX = midX - sqrtValue * disY1Y2;
            posY = midY - sqrtValue * disX2X1;
        } else {
            posX = midX + sqrtValue * disY1Y2;
            posY = midY + sqrtValue * disX2X1;
        }
        this.targetPos.push(posX,posY);
        return this.targetPos;
    }

    /**
     * 判断一个数是否为整数
     */
    public isInteger(originNum: number): boolean {
        return Math.floor(originNum) === originNum;
    }

    /**
     * 给定线段的2个点，求出线段上说有的点(整型)
     */
    public getLineSegmentPoints(x1: number, y1: number, x2: number, y2: number): Array<egret.Point> {
        let pointStart: egret.Point = new egret.Point(x1, y1);
        let pointEnd: egret.Point = new egret.Point(x2, y2);
        let linePoint: Array<egret.Point> = [];

        if (pointStart.x == pointEnd.x) {
            if (pointStart.y <= pointEnd.y) {
                for (let i: number = pointStart.y; i <= pointEnd.y; i++) { //包含线段2点
                    linePoint.push(new egret.Point(pointStart.x, i));
                }
            } else {
                for (let i: number = pointStart.y; i >= pointEnd.y; i--) { //包含线段2点
                    linePoint.push(new egret.Point(pointStart.x, i));
                }
            }
        } else {

            if (pointStart.x <= pointEnd.x) {
                for (let i: number = pointStart.x; i <= pointEnd.x; i++) { //包含线段2点
                    let k: number = (pointStart.y - pointEnd.y) / (pointStart.x - pointEnd.x);// 计算斜率
                    let y: number = k * (i - pointStart.x) + pointStart.y;
                    if (App.MathUtils.isInteger(y)) {
                        linePoint.push(new egret.Point(i, Math.floor(y)));
                    }
                }
            } else {
                for (let i: number = pointStart.x; i >= pointEnd.x; i--) { //包含线段2点
                    let k: number = (pointStart.y - pointEnd.y) / (pointStart.x - pointEnd.x);// 计算斜率
                    let y: number = k * (i - pointStart.x) + pointStart.y;
                    if (App.MathUtils.isInteger(y)) {
                        linePoint.push(new egret.Point(i, Math.floor(y)));
                    }
                }
            }
        }
        return linePoint;
    }

    /**
     * 数字格式化（万、亿为单位）
     * @param from
     * @param isInt 输出是否整数
     * @param numFixYi 亿要保留的小数点
     * @param minW     保留万字的最小数值(默认10000)
     * @returns {string}
     */
    public formatNum(from: number, isInt: boolean = true,numFixYi:number=0,minW:number=10000): string {
        var to: string = from.toString();;
        var format: string;
        if (isInt) {
            format = "^[0-9]+";
        }
        else {
            format = "^[0-9]+(\.[0-9]{0,2})?";
        }

        if (from >= 1000000000000) {
            var tmp: string = (from / 1000000000000).toString();
            var res = tmp.match(format);
            to = res[0] + "万亿";
        }
        else if (from >= 100000000) {
            if(numFixYi>0){
                format = "^[0-9]+(\.[0-9]{0,1})?";
            }
            var tmp: string = (from / 100000000).toString();
            var res = tmp.match(format);
            
            to = res[0] + "亿";
        }
        else if (from >= minW) {
            var tmp: string = (from / 10000).toString();
            var res = tmp.match(format);
            to = res[0] + "万";
        }
        return to;
    }

    public formatNum2(value:number):string {
        let result:number = Number(value);
        let radixPoint:number = 0;
        let unitStr:string = "";
        let range:number = 0;
        if(value >= 1000000000000) {
            //万亿以上保留三位小数;
            radixPoint = 3;
            range = 1000000000000;
            if(value >= 1000000000000000) {
                //千万亿不留小数
                radixPoint = 0;
                range = 1000000000000000;
            }
            else if(value >= 100000000000000) {
                //百万亿留1位小数
                radixPoint = 1;
                range = 100000000000000;
            }
            else if(value >= 10000000000000) {
                //十万亿留两位小数
                radixPoint = 2;
                range = 10000000000000;
            }
            unitStr = "万亿";
        }
        else if(value >= 100000000) {
            //亿以上保留3位小数
            radixPoint = 3;
            range = 100000000;
            if(value >= 100000000000) {
                //千亿不留小数
                radixPoint = 0;
                range = 100000000000;
            }
            else if(value >= 10000000000) {
                //百亿保留1位小数
                radixPoint = 1;
                range = 10000000000;
            }
            else if(value >= 1000000000) {
                //十亿保留2位小数
                radixPoint = 2;
                range = 1000000000;
            }
            unitStr = "亿";
        }
        else if(value >= 100000) {
            //十万以上保留2位小数
            radixPoint = 2;
            range = 100000;
            if(value >= 10000000) {
                //千万以上不留小数
                radixPoint = 0;
                range = 10000000;
            }
            else if(value >= 1000000) {
                //百万以上保留1位小数
                radixPoint = 1;
                range = 1000000;
            }
            unitStr = "万";
        }
        if(range > 0) {
            let pointStr:string = "1";
            while(radixPoint > 0) {
                pointStr += "0";
                radixPoint --;
            }
            result = Math.floor(value / range * 1000) / Number(pointStr);
        }
        return result + unitStr;
    }

    /**
     * 64位数字格式化（万、亿为单位）
     * @param value_L64 协议里的64位数值
     * @returns {string}
     */
    public formatNum64(value_L64: any,isInit:boolean=true): string {
        let to: string;
        let divRes:string;
        let fixNum:number = isInit?0:3; //与 formatNum 一致保持小数点后两位
        if (MathUtils.rightShiftDecimal(value_L64, 1000000000000).indexOf("0.") != 0) {
            divRes = MathUtils.rightShiftDecimal(value_L64, 1000000000000);
            to = divRes.substring(0, divRes.indexOf(".")+fixNum) + "万亿";
        }
        else if (MathUtils.rightShiftDecimal(value_L64, 100000000).indexOf("0.") != 0) {
            divRes = MathUtils.rightShiftDecimal(value_L64, 100000000);
            to = divRes.substring(0, divRes.indexOf(".")+fixNum) + "亿";
        }
        else if (MathUtils.rightShiftDecimal(value_L64, 100000).indexOf("0.") != 0) {
            divRes = MathUtils.rightShiftDecimal(value_L64, 10000);
            to = divRes.substring(0, divRes.indexOf(".")+fixNum) + "万";
        } else {
            to = value_L64.toString();
        }

        return to;
    }

    /**
     * 10进制右移操作
     * @param value_L64 协议里的64位数值
     * @param divisor 除数
     * */
    public static rightShiftDecimal(value_L64:any, divisor): string {
        let valueStr:string = value_L64.toString();
        let times:number = 0;
        while (divisor >= 10)
        {
            divisor /= 10;
            times++;
        }
        if (times > 0)
        {
            let len:number = valueStr.length;
            if (len > times)
            {
                let tailStr:string = valueStr.substr(len - times, times);
                valueStr = valueStr.replace(tailStr, "."+tailStr);
            }
            else
            {
                let zeroStr:string = "";
                for (let i:number = 0; i < times - len; i++)
                {
                    zeroStr+="0";
                }
                valueStr = "0." + zeroStr + valueStr;
            }
        }
        return valueStr;
    }

    /**
     * 判断点是否在多边形内
     * @param points 多边形顶点
     * @param p 目标点
     */
    public insidePolygon(points: Array<egret.Point>, p: egret.Point): Boolean {
        let inside: Boolean = false;
        let n: number = points.length;
        let p1: egret.Point;
        let p2: egret.Point;

        //角度和的方式判断
        let radian: number;
        let totalRadian: number = 0;

        for (let i: number = 0; i < n; i++) {
            p1 = points[i];
            p2 = points[(i + 1) % n];

            if (this.isOnLine(p, p1, p2)) {
                //三点共线
                inside = true;
                break;
            }

            radian = Math.abs(Math.atan2(p1.y - p.y, p1.x - p.x) - Math.atan2(p2.y - p.y, p2.x - p.x));
            if (radian > Math.PI)
                radian = 2 * Math.PI - radian;
            totalRadian += radian;
        }

        if (Math.abs(2 * Math.PI - totalRadian) < Math.pow(10, -10)) {
            inside = true;
        }
        return inside;
    }

    /**
     * 判断三点是否共线
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    public isInLine(p1: egret.Point, p2: egret.Point, p3: egret.Point): Boolean {
        var a: egret.Point = new egret.Point(p1.x - p2.x, p1.y - p2.y);
        var b: egret.Point = new egret.Point(p1.x - p3.x, p1.y - p3.y);
        return this.isInLine2(a, b);
    }

    /**
     * 判断两个向量是否共线
     * @param a 向量1
     * @param b 向量2
     */
    public isInLine2(a: egret.Point, b: egret.Point): Boolean {
        return a.x * b.y == a.y * b.x;
    }
    /**
     * 判断点p是否在线段ab上 
     * @param p 点p
     * @param a 线段顶点a
     * @param b 线段顶点b
     */
    public isOnLine(p: egret.Point, a: egret.Point, b: egret.Point): Boolean {
        var result: Boolean = this.isInLine(p, a, b);
        if (result) {
            //如果三点共线
            var minX: Number = Math.min(a.x, b.x);
            var maxX: Number = Math.max(a.x, b.x);

            var minY: Number = Math.min(a.y, b.y);
            var maxY: Number = Math.max(a.y, b.y);
            result = (minX <= p.x && maxX >= p.x && minY <= p.y && maxY >= p.y);
        }
        return result;
    }

    /**
     * 弧度角取正
     * @param {number} angle
     * @returns {number}
     */
    public static getPositiveAngle(angle:number):number
    {
        while (angle > 2 * Math.PI)
        {
            angle -= 2 * Math.PI;
        }
        while (angle < 0)
        {
            angle += 2 * Math.PI;
        }
        return angle;
    }

    /**
     * 获取时间为t时 任意阶贝塞尔曲线上的一点
     * @param startPt 开始点
     * @param endPt 结束点
     * @param controllerPts 控制点
     * @param t 当前时间
     * @param totalTime 总时长
     */
    private bezierPos:number[] = [];
    public getBezierCurve(startX:number,startY:number,endX:number,endY:number,t:number,totalTime:number,...controllerPts):number[]
    {
        this.bezierPos = [];
        let _time:number = t/totalTime;
        if(_time > 1) return null;
        // let _pts:egret.Point[] = [startPt];
        // _pts = _pts.concat(controllerPts);
        // _pts.push(endPt);
        let _pts:number[] = [startX,startY];
        let argPts:number[];
        if(controllerPts && controllerPts.length == 1 && controllerPts[0] instanceof Array) {
            argPts = controllerPts[0] as number[];
        }
        else {
            argPts = controllerPts;
        }
        if(argPts && argPts.length > 0) {
            _pts = _pts.concat(argPts);
        }
        _pts.push(endX,endY);

        let _bpx:number = 0;
        let _bpy:number = 0;

        let _n:number = _pts.length/2 - 1;
        let len:number = _pts.length / 2;
        for(let i:number = 0; i < len; i++)
        {
            let _ptX:number = _pts.shift();//_pts[i].x;
            let _ptY:number = _pts.shift();//_pts[i].y;

            let _num:number = 1;
            for(let k = 1; k <= i; k++)
            {
                _num = _num * (_n - k + 1) / k;
            }
            _bpx += _num * _ptX * Math.pow((1 - _time),_n - i) * Math.pow(_time,i);
            _bpy += _num * _ptY * Math.pow((1 - _time),_n - i) * Math.pow(_time,i);
        }
        this.bezierPos.push(_bpx,_bpy);
        return this.bezierPos;//new egret.Point(_bpx,_bpy);
    }

    /**
     * 获取一个点周围多少格内的全部点
     */
    public getAroundPoints(targetPoint: egret.Point, grid:number = 1): Array<egret.Point> 
    {
        let allPoint: Array<egret.Point> = [];
        for (let i: number = 0; i < grid; i++) {
            let j:number = 0;
            let dis:number = grid-i;
            let step:number = dis*2;

            let startX:number = targetPoint.x - dis;
            let startY:number = targetPoint.y - dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX+j, startY));
            }

            startX = targetPoint.x + dis;
            startY = targetPoint.y - dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX, startY+j));
            }
            
            startX = targetPoint.x + dis;
            startY = targetPoint.y + dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX-j, startY));
            }

            startX = targetPoint.x - dis;
            startY = targetPoint.y + dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX, startY-j));
            }
        }
        return allPoint;
    }

    /**
     * 获取一个点周围多少格内的全部点，只一圈，不包括里面
     */
    public getAroundPointsNew(targetPoint: egret.Point, grid:number = 1): Array<egret.Point> 
    {
        let allPoint: Array<egret.Point> = [];
            let j:number = 0;
            let dis:number = grid;
            let step:number = dis*2;
            let startX:number = targetPoint.x - dis;
            let startY:number = targetPoint.y - dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX+j, startY));
            }
            startX = targetPoint.x + dis;
            startY = targetPoint.y - dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX, startY+j));
            }
            startX = targetPoint.x + dis;
            startY = targetPoint.y + dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX-j, startY));
            }
            startX = targetPoint.x - dis;
            startY = targetPoint.y + dis;
            for (j = 0; j < step; j++) {
                allPoint.push(new egret.Point(startX, startY-j));
            }
        return allPoint;
    }

    /**
     * 获取一个点周围最外圈的可走点
     */
    private dropPosition:number[] = [];
    public getDropPts(centerX: number,centerY:number, count:number): Array<number>
    {
        this.dropPosition = [];
        // let allPoint: Array<number>[] = [];
        for(let i:number = 1; i < 11; i ++) {
            let j:number = 0;
            let step:number = i*2;
            let startX:number = centerX - i;
            let startY:number = centerY - i*2;
            if(startX < 0 || startY < 0) break;
            let posX:number;
            let posY:number;
            for (j = 0; j < step; j++) {
                posX = startX + j;
                posY = startY;
                if(ControllerManager.rpgGame.view.astar.gridXYCanWalk(posX,posY)) {
                    this.dropPosition.push(posX, posY);
                    // allPoint.push([posX, posY]);
                    if(this.dropPosition.length / 2 >= count) return this.dropPosition;
                }
            }
            
            startX = centerX + i;
            startY = centerY - i*2;
            for (j = 0; j < step; j++) {
                posX = startX;
                posY = startY + j*2;
                if(ControllerManager.rpgGame.view.astar.gridXYCanWalk(posX,posY)) {
                    this.dropPosition.push(posX, posY);
                    if(this.dropPosition.length / 2 >= count) return this.dropPosition;
                    // allPoint.push([posX, posY]);
                    // if(allPoint.length >= count) return allPoint;
                }
            }
            
            startX = centerX + i;
            startY = centerY + i*2;
            for (j = 0; j < step; j++) {
                posX = startX - j;
                posY = startY;
                if(ControllerManager.rpgGame.view.astar.gridXYCanWalk(posX,posY)) {
                    this.dropPosition.push(posX, posY);
                    if(this.dropPosition.length / 2 >= count) return this.dropPosition;
                    // allPoint.push([posX, posY]);
                    // if(allPoint.length >= count) return allPoint;
                }
            }

            startX = centerX - i;
            startY = centerY + i*2;
            for (j = 0; j < step; j++) {
                posX = startX;
                posY = startY - j*2;
                if(ControllerManager.rpgGame.view.astar.gridXYCanWalk(posX,posY)) {
                    this.dropPosition.push(posX, posY);
                    if(this.dropPosition.length / 2 >= count) return this.dropPosition;
                    // allPoint.push([posX, posY]);
                    // if(allPoint.length >= count) return allPoint;
                }
            }
        }
        return this.dropPosition;
    }

    public static isInRange(startPos:egret.Point, targetPos:egret.Point, distance:number):boolean
    {
        let disX = targetPos.x - startPos.x;
        let disY = targetPos.y - startPos.y;
        return (disX * disX + disY * disY <= distance * distance);
    }

    /**
     * 获取圆周围的一个随机点
     * @aparam cx 圆心x
     * @aparam cy 圆心y
     * @aparam radius  半径
     */
    public getRoundRandPoint(cx:number,cy:number,radius:number):egret.Point{
        let p:egret.Point = new egret.Point(cx,cy);
        let angle:number = Math.random()*360;
        let radian:number = App.MathUtils.getRadian(angle);
        p.x = cx + Math.sin(radian)*radius;
        p.y = cy + Math.cos(radian)*radius;
        return p;
    }

    /**
     * 格式化物品数量
     */
    public formatItemNum(num: number): string {
        let s:string = "";
        let divisor: number = 10000;
        if(num >= 1){
            if(num < divisor){
                s = num.toString();
            }else{
                let tmp:number = num / divisor;
                let k:number = 0;
                if(tmp.toString().indexOf(".") != -1){
                    k = Number(tmp.toString().split(".")[1].substr(0, 1));//千位数
                }
                if(k == 0){
                    s = Math.floor(tmp) + "万";
                }else{
                    s = `${Math.floor(tmp)}.${k}万`;
                }
            }
        }
        return s;
    }

    // /**
    //  * 根据中心点获取掉落物顺时针分布散开点坐标
    //  */
    // private maxCount:number = 1000;
    // public getDropPts(centerX:number,centerY:number,count:number):egret.Point[]
    // {
    //     let _result:egret.Point[] = [new egret.Point(centerX,centerY)];
    //     let _dict:{[pos:string]:boolean} = {};
    //     _dict[centerX + "_" + centerY] = true;

    //     let _centerX:number = centerX;
    //     let _centerY:number = centerY;
    //     let _dir:number = 0;
    //     while(_result.length < count && this.maxCount > 0)
    //     {
    //         this.maxCount --
    //         let _moveX:number = _centerX;
    //         let _moveY:number = _centerY;
    //         if(_dir == 0)
    //         {
    //             //向下2格
    //             _moveY += 2;
    //         }
    //         else if(_dir == 1)
    //         {
    //             //左移一格
    //             _moveX -= 2;
    //         }
    //         else if(_dir == 2)
    //         {
    //             //上移2格
    //             _moveY -= 2;
    //         }
    //         else if(_dir == 3)
    //         {
    //             //右移一格
    //             _moveX += 2;
    //         }
    //         let canWalk:boolean = ControllerManager.rpgGame.view.astar.gridXYCanWalk(_moveX,_moveY);
    //         console.log("是否可走",canWalk,_moveX,_moveY);
    //         if(canWalk && !_dict[_moveX + "_" + _moveY])
    //         {
    //             _dict[_moveX + "_" + _moveY] = true;
    //             let _pt:egret.Point = new egret.Point(_moveX,_moveY);
    //             _centerX = _moveX;
    //             _centerY = _moveY;
    //             _dir ++;
    //             _dir = _dir%4;
    //             _result.push(_pt);
    //         }
    //         else
    //         {
    //             if(_dir == 0) _dir = 3;
    //             else _dir --;
    //         }
    //     }
    //     return _result;
    // }
}