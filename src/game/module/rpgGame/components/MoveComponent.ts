
class MoveComponent extends Component {
    private endX: number;
    private endY: number;
    private radian: number;
    private distance: number;
    /** 行走时的格子间的固定距离，算出固定时间，不跟distance在update中变化 */
    private nodeDistance: number;
    private node: PathNode;
    /** 是主角自己的话，额外控制 */
    private controlComponent: ControlComponent;
    private avatarComponent: AvatarComponent;
    private updateTime: number = 17;

    private _jumpTime: number;
    private _jumpUpTime: number;
    private _jumpDownTime: number;

    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        let compType:string = this.entity.isLeaderRole ? ComponentType.MainControl : ComponentType.OtherControl;
        this.controlComponent = <ControlComponent>this.entity.getComponent(compType);
        this.avatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);

        this.setJumpTime(0);
    }

    public stop(): void {
        super.stop();

        this.endX = null;
        this.endY = null;
        this.radian = null;
        this.distance = null;
        this.node = null;
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
        let self = this;
        self.updateTime = advancedTime;

        if (self.entity.pathChange) {
            self.entity.pathChange = false;
            if (self.node) {
                self.entity.entityInfo.col = self.node.x;
                self.entity.entityInfo.row = self.node.y;
            }
            self.node = null;
        }

        if (!self.node) {
            if (!self.entity.path) {
                return;
            }

            if (!self.entity.path.length) {
                self.entity.path = null;
                return;
            }

            self.nextNode();
            //修复行走过程中抖动问题
            if (self.node) {
                self.move(advancedTime);
            }
        }
        else {
            self.move(advancedTime);
        }
    }

    private move(advancedTime: number): void {
        if(this.entity.currentState != EntityModelStatus.Jump && 
        this.entity.currentState != EntityModelStatus.JumpUpDown && 
        this.entity.currentState != EntityModelStatus.ScaleTween)
        {
            this.entity.currentState = EntityModelStatus.Move;
        }
        // var useSpeed: number = this.entity.speed / (1000 / 60) * advancedTime;
        let useSpeed: number = this.getMoveSpeed(advancedTime);

        if (this.distance > useSpeed) {
            var speedX: number = Math.cos(this.radian) * useSpeed;
            var speedY: number = Math.sin(this.radian) * useSpeed;
            this.entity.x += speedX;
            this.entity.y += speedY;
            this.distance -= useSpeed;
        }
        else {
            this.entity.x = this.endX;
            this.entity.y = this.endY;
            this.entity.entityInfo.col = this.node.x;
            this.entity.entityInfo.row = this.node.y;
            this.controlComponent && this.checkSceneJump(this.node.x, this.node.y);
            this.node = null;
            // console.log("走完了：", this.entity.col, this.entity.row);
        }
    }

    private getMoveSpeed(advancedTime: number): number {
        let useSpeed: number = this.entity.entityInfo.speed_SH / 1000 * advancedTime;

        if (this.entity.action == Action.Rush) {
            useSpeed *= CacheManager.battle.battle_config.RushSpeedRatio;
        } else if (this.entity.action == Action.Jump && this.entity.currentState != EntityModelStatus.JumpUpDown) {
            // useSpeed *= CacheManager.battle.battle_config.JumpSpeedRatio;
            if (this.nodeDistance > 0 && this._jumpTime > 0)
                useSpeed = this.nodeDistance / this._jumpTime * advancedTime;
        } else if (this.entity.moveType == EMoveType.EMoveTypeSimple) {
            useSpeed = this.nodeDistance / 250 * advancedTime;
        } else if (this.entity.action == Action.Charge) {
            useSpeed *= CacheManager.battle.battle_config.ChargeSpeedRatio;
        }
        return useSpeed;
    }

    private nextNode(): void {
        this.node = this.entity.path.shift();
        var p: egret.Point;
        if (!this.node.pX) {
            p = RpgGameUtils.convertCellToXY(this.node.x, this.node.y);
        } else {
            p = RpgGameUtils.point;
            p.x = this.node.pX;
            p.y = this.node.pY;
        }
        this.endX = p.x;
        this.endY = p.y;
        this.radian = App.MathUtils.getRadian2(this.entity.x, this.entity.y, this.endX, this.endY);
        this.distance = App.MathUtils.getDistance(this.entity.x, this.entity.y, this.endX, this.endY);
        this.nodeDistance = this.distance;
        if (this.entity.moveType != EMoveType.EMoveTypeSimple && this.entity.moveType != EMoveType.EMoveTypeRush)//被冲锋的单位不改变方向，冲刺不改变方向
            this.entity.dir = RpgGameUtils.computeGameObjDir(this.entity.x, this.entity.y, this.endX, this.endY);
    
        if (this.node.isJump && (this.entity.objType == RpgObjectType.OtherPlayer || this.entity.objType == RpgObjectType.MainPlayer)) {
            if (this.node.role_dir != -1) {
                this.entity.dir = this.node.role_dir;
            }
            // Log.trace("this.node is jump：", this.node);
            this.entity.action = Action.Jump;
            let useSpeed: number = this.getMoveSpeed(this.updateTime);
            let jumpTime: number = this.distance/useSpeed*this.updateTime;
            if (this.avatarComponent && this.avatarComponent.bodyMc) {
                this.avatarComponent.bodyMc.setCurrDir(null);
                this.avatarComponent.setJumpNO(this.node.specialNo);
            }
            this.entity.sceneJump(this._jumpUpTime, this._jumpDownTime);
            this.node.isJump = false;
        }

        if (this.controlComponent) {
            //测试主角行走打印的点
            // if (this.entity.gameView.getGameGroundLayer()) {
            //     let footShadow: egret.Bitmap = ObjectPool.pop("egret.Bitmap");
            //     footShadow.texture = RES.getRes("shadow_png");
            //     footShadow.x = p.x;
            //     footShadow.y = p.y;
            //     footShadow.anchorOffsetX = footShadow.width * .5;
            //     footShadow.anchorOffsetY = footShadow.height * .5;
            //     this.entity.gameView.getGameGroundLayer().addChild(footShadow);
            //     egret.setTimeout(function () {
            //         App.DisplayUtils.removeFromParent(footShadow);
            //         ObjectPool.push(footShadow);
            //     }, this, 150000);
            // }

            this.controlComponent.moveNode2Server(this.node.x, this.node.y, MoveComponent.getMoveType(this.entity.action));

            //测试地图跳跃
            // Log.trace(Log.TEST, "AI的长度：", AI.aiListLength, ", AI:", AI.aiListArr);
            // this.checkSceneJump(this.node.x. this.node.y);
        }
        else {
            // Log.trace("Try to move, but mainControlComponent is null or undefined.");
        }
        // console.log(angle, this._gameEntity.dir);
    }

    public static getMoveType(action: Action):EMoveType {
        switch (action) {
            case Action.Rush:
                return EMoveType.EMoveTypeRush;
            case Action.Jump:
                return EMoveType.EMoveTypeJump;
            default :
                return EMoveType.EMoveTypeNormal;
        }
    }

    public checkSceneJump(nodeX:number, nodeY:number) {
        let jp: any = CacheManager.map.getJumpPoint(nodeX, nodeY);
        if (jp) {
            // if (jp.dir.indexOf(this.entity.dir) != -1 || !ConfigManager.client.getJumpDirConfig()) {
            Log.trace(Log.JUMP, "角色[" + this.entity.entityInfo.selfIndex + "]经过跳跃点 (", nodeX, nodeY, ")，人物朝向：", this.entity.dir);
            let path: PathNode[] = this.controlComponent.astar.findJumpPath(jp.toX, jp.toY);
            Log.trace(Log.JUMP, "path:", path);

            if (path && path.length > 0) {
                Log.trace(Log.JUMP, "有跳跃！！！path.length：", path.length, "，第一个是：", path[0]
                    , "距离=", egret.Point.distance(this.entity.pixPoint, RpgGameUtils.convertCellToXY(path[0].x, path[0].y)));
                let p:egret.Point = RpgGameUtils.convertCellToXY(path[0].x, path[0].y);
                this.setJumpTime((this.entity.pixPoint.x - p.x)*(this.entity.pixPoint.x - p.x) + (this.entity.pixPoint.y - p.y) * (this.entity.pixPoint.y - p.y));
                let isEndJump:boolean = CacheManager.map.getJumpPoint(nodeX, nodeY, true) != null;
                if (isEndJump == false)
                    this.entity.setJumpPath(path);
                else
                    egret.setTimeout(()=>{if(this.entity)this.entity.setJumpPath(path);}, this, 50);
            }
        }
    }

    private setJumpTime(jumpDisPow:number):void {
        if (jumpDisPow < 700*700) {
            this._jumpUpTime = CacheManager.battle.battle_config.JumpUpTime;
            this._jumpDownTime = CacheManager.battle.battle_config.JumpDownTime;
        } else {
            this._jumpUpTime = CacheManager.battle.battle_config.JumpUpTime2;
            this._jumpDownTime = CacheManager.battle.battle_config.JumpDownTime2;
        }
        this._jumpTime = this._jumpUpTime + this._jumpDownTime;
    }

}