
class ControlComponent extends Component {
    public astar: SilzAstar;
    /** 移动相关*/
    public lastNode:egret.Point = new egret.Point();

    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.astar = ControllerManager.rpgGame.view.astar;
    }

    public stop(): void {
        super.stop();
        this.lastNode.x = this.lastNode.y = -1;
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
    }

    public setLastNode(gotoX: number, gotoY: number): void {
        this.lastNode.x = gotoX;
        this.lastNode.y = gotoY;
    }

    /**
     * 同步点
     */
    public moveNode2Server(gotoX: number, gotoY: number, moveType: EMoveType = EMoveType.EMoveTypeNormal): void {
        if (this.entity == null || this.entity.action == Action.Die) return;
        if (this.lastNode.x == gotoX && this.lastNode.y == gotoY) return;
        this.lastNode.x = gotoX;
        this.lastNode.y = gotoY;

        //发消息给服务器
        let msg: any = {};
        let selfIndex:number = this.entity.entityInfo.selfIndex;
        msg.cmd = ECmdGame[ECmdGame.ECmdGameMove];
        msg.body = {
            "moveType": moveType,
            "x": gotoX,
            "y": gotoY,
            "index" : selfIndex
        };//Log.trace(Log.RPG, "同步坐标--->mapId：" + CacheManager.map.mapId, "selfIndex：" + selfIndex, "移动move类型：", moveType,":  node.x: ", gotoX, ",  node.y: ", gotoY);
        App.Socket.send(msg); //发送
    }

    /**
     * 返回是否需要寻路
     */
    public moveTo(gotoX: number, gotoY: number, moveType: EMoveType = EMoveType.EMoveTypeNormal, isClickGround:boolean = false): boolean {
        if(!this.entity || this.entity.action == Action.Jump || this.entity.currentState == EntityModelStatus.ScaleTween)
            return false;
        let currX: number = this.entity.x;
        let currY: number = this.entity.y;

        // if (moveType == EMoveType.EMoveTypeSimple) {
        //     this.moveSimple(gotoX, gotoY, 500);
        //     return true;
        // }

        let path: PathNode[] = this.astar.find(currX, currY, gotoX, gotoY, moveType);
        if (path && path.length > 1) {
            path.shift();
            this.entity.path = path;
        } else {
            this.entity.path = null;
        }
        if (this.entity.isLeaderRole && this.entity.path && !isClickGround) {
            EventManager.dispatch(LocalEventEnum.LeaderRoleMove, {
                sx:currX
                , sy:currY
                , tx:gotoX
                , ty:gotoY
                , path:path
                , follow:isClickGround
                , endRadius:CacheManager.king.followEndRadius
                , battleObj:this.entity.battleObj});
        }
        return this.entity.path != null;
    }

    /**
     * 返回普通行走路径点
     */
    public normalPathNodes(gotoX: number, gotoY: number, moveType: EMoveType = EMoveType.EMoveTypeNormal): PathNode[]  {
        let currX: number = this.entity.x;
        let currY: number = this.entity.y;
        let path: PathNode[] = this.astar.find(currX, currY, gotoX, gotoY, moveType);
        if (path && path.length > 1) {
            return path;
        } else {
            return null;
        }
    }

    /**
     * 简单移动
     */
    public moveSimple(gotoX:number, gotoY:number, moveTime:number):void
    {
        this.entity.path = null;
        let cellPos:egret.Point = RpgGameUtils.convertXYToCell(gotoX, gotoY);
        this.entity.entityInfo.col = cellPos.x;
        this.entity.entityInfo.row = cellPos.y;
        egret.Tween.get(this.entity).to({x:gotoX,y:gotoY}, moveTime, egret.Ease.circOut);
    }
}