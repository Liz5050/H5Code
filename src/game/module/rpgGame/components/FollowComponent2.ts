class FollowComponent2 extends Component{

    private pathInfo:any;
    private moveTimeoutId:number = -1;
    private isMoving:boolean;
    private followEntity: RpgGameObject;
    private targetPos: egret.Point = new egret.Point();
    private followEndRadius: number;//寻路结束半径
    private followStartRadius: number;//寻路开始半径

    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
        this.followEndRadius = CacheManager.battle.getFollowEndRadius(baseCareer);
        this.followStartRadius = CacheManager.battle.getFollowStartRadius(baseCareer);
        EventManager.addListener(LocalEventEnum.LeaderRoleMove, this.onFollowLeaderMove, this);//console.log("addListen:", egret.getTimer(), App.TimerManager.curFrame)
        EventManager.addListener(LocalEventEnum.SceneClickGroundPos, this.onLeaderClickGround, this);
    }

    public stop():void {
        super.stop();
        this.clearMoveData();
        EventManager.removeListener(LocalEventEnum.LeaderRoleMove, this.onFollowLeaderMove, this);
        EventManager.removeListener(LocalEventEnum.SceneClickGroundPos, this.onLeaderClickGround, this);
    }

    public update(advancedTime: number): void {
        if (this.entity == null || this.entity.isDead()) {
            if (this.pathInfo) this.clearMoveData();
            return;
        }
        if (CacheManager.buff.hasInterruptMoveBuff(this.entity.entityInfo.selfIndex) || this.entity.currentState == EntityModelStatus.Jump || this.entity.isJumping)
            return;//无法移动
        if (this.isMoving && this.targetPos) {
            if (this.isSameTargetPos()) {
                if (!this.pathInfo || !this.pathInfo.endRadius)
                    this.checkCanStop(this.targetPos) && this.stopMove();
            } else {
                this.doFollow();
            }
        } else if (!this.isMoving && this.pathInfo && this.checkCanFollow()) {
            this.doFollow();
        }
    }

    public setFollowEntity(target:RpgGameObject, needFollowNow:boolean = false) {
        if (this.followEntity == target) return;
        this.followEntity = target;
        if (target == null) {
            if (CacheManager.buff.hasInterruptMoveBuff(this.entity.entityInfo.selfIndex) || this.entity.currentState == EntityModelStatus.Jump || this.entity.isJumping)
                return;
            this.stopMove();
        } else if (needFollowNow) {
            let targetNode:PathNode = target.path && target.path[target.path.length - 1];
            if (targetNode) {
                let targetPos:egret.Point = RpgGameUtils.convertCellToXY(targetNode.x, targetNode.y);
                this.onFollowLeaderMove({sx:0,sy:0,tx:targetPos.x,ty:targetPos.y,path:target.path, follow:false, endRadius:CacheManager.king.followEndRadius});
            }
        }
    }

    private onFollowLeaderMove(pathInfo:any): void {
        if (!this.followEntity)
            return;//console.log("targetpos=", pathInfo.tx, pathInfo.ty)
        let tp:egret.Point = RpgGameUtils.point;
        tp.x = pathInfo.tx;
        tp.y = pathInfo.ty;
        if (this.checkCanStop(tp) || (this.targetPos && this.targetPos.equals(tp)))
            return;
        this.pathInfo = pathInfo;
        this.clearMoveTimeout();

        // this.moveTimeoutId = egret.setTimeout(()=>{
        //     this.doFollow();
        // }, this, 10);
    }

    private onLeaderClickGround(pathInfo:any): void {
        this.stopMove();
        this.onFollowLeaderMove(pathInfo);
    }

    private isSameTargetPos():boolean {
        return this.targetPos && this.pathInfo && this.targetPos.x == this.pathInfo.tx && this.targetPos.y == this.pathInfo.ty;
    }

    private clearMoveTimeout():void {
        if (this.moveTimeoutId != -1) {
            egret.clearTimeout(this.moveTimeoutId);
            this.moveTimeoutId = -1;
        }
    }

    private doFollow(): void {
        this.moveTimeoutId = -1;
        //if (!this.checkCanFollow()) return;
        let pathInfo:any = this.pathInfo;
        if (pathInfo) {
            let entity:MainPlayer = this.entity as MainPlayer;
            this.targetPos.x = pathInfo.tx;
            this.targetPos.y = pathInfo.ty;
            let startGrid:egret.Point = RpgGameUtils.convertXYToCell(pathInfo.sx, pathInfo.sy);
            if (!entity.gridPoint.equals(startGrid)) {
                let controlComp:ControlComponent = entity.controlComponent;
                this.isMoving = controlComp.moveTo(pathInfo.tx, pathInfo.ty);
            } else {
                entity.path = pathInfo.path.concat();
                this.isMoving = true;
            }
        }
    }

    private stopMove():void {
        this.entity.stopMove();
        this.isMoving = false;
        this.targetPos.x = this.targetPos.y = 0;
        this.pathInfo = null;
        this.clearMoveTimeout();//console.log("stopMove=")
    }

    private checkCanStop(targetPos:egret.Point):boolean {
        let curPos:egret.Point = this.entity.pixPoint;
        let dis:number = egret.Point.distance(curPos, targetPos);//console.log("checkCanStop=", targetPos.x, targetPos.y, dis)
        /*if (this.pathInfo && this.pathInfo.endRadius > 0) {
            return dis <= this.pathInfo.endRadius;
        }
        else */
        if (this.pathInfo && EntityUtil.isCollectionMonster(this.pathInfo.battleObj) && dis < 80) {
            return true;
        } else if (dis <= this.followEndRadius) {
            return true;
        }
        return false;
    }

    private checkCanFollow():boolean {
        if (!this.followEntity || !this.followEntity.hasInit) return false;
        let curPos:egret.Point = this.entity.pixPoint;
        let targetPos:egret.Point = this.followEntity.pixPoint;
        let dis:number = egret.Point.distance(curPos, targetPos);//console.log("checkCanStop=", targetPos.x, targetPos.y, dis)
        if (dis > this.followStartRadius || !this.pathInfo.follow) {
            return true;
        }
        return false;
    }

    private clearMoveData() {
        this.clearMoveTimeout();
        this.pathInfo = null;
        this.isMoving = false;
        this.followEntity = null;
        this.targetPos.x = this.targetPos.y = 0;
    }
}