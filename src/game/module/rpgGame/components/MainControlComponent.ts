
class MainControlComponent extends ControlComponent {

    /** 点击相关*/
    private clickGroundLockTime:number=0;
    private clickGroundSavePoint:egret.Point;
    /** 若不为0，则到此时间自动开启挂机*/
    private clickAutoFightTime:number = 0;
    /** 进出安全区相关*/
    private isInSafeZone: boolean;
    private curMapId:number;
    /** 摇杆相关*/
    private touchState:number=TouchState.TOUCH_END;
    private touchBeginTime:number;
    private stagePos:egret.Point=new egret.Point();
    private joystick:JoyStick;
    private touchToGrid:egret.Point=new egret.Point();
    private lastTouchDir:Dir;
    public constructor() {
        super();
    }

    public start(): void {
        if(this.isRuning) return;
        super.start();
        this.dealInterval = 100;
        // this.entity.gameView.touchEnabled = this.entity.gameView.touchChildren = CacheManager.map.getMapCanHandOperate();
        this.entity.gameView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        // this.entity.gameView.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    }

    public stop(): void {
        
        if(!this.isRuning) return;
        this.clickGroundSavePoint = null;
        this.clickAutoFightTime = 0;
        // this.onTouchEnd();
        // this.entity.gameView.touchEnabled = false;
        this.entity.gameView.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        // this.entity.gameView.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);

        super.stop();
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
        let self = this;
        let now:number = egret.getTimer();
        if (self.clickGroundSavePoint && self.entity.action == Action.Stand){
            self.clickGround(self.clickGroundSavePoint.x, self.clickGroundSavePoint.y);
            self.clickGroundSavePoint = null;
        }
        if (self.clickAutoFightTime > 0 && now - self.clickAutoFightTime > 0) {
            if (!CacheManager.king.isAutoFighting && !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){ //在守护仙盟不自动切换挂机
                EventManager.dispatch(LocalEventEnum.AutoStartFight);
            }
            self.clickAutoFightTime = 0;
        }
        /*if (now - self.lastCheckBattleObjTime > 500)
        {
            self.lastCheckBattleObjTime = now;
            EventManager.dispatch(LocalEventEnum.CheckBattleObj);
        }
        if (self.touchState == TouchState.TOUCH_BEGIN && now - self.touchBeginTime > 500)
        {
            self.initJoystick();
            self.touchState = TouchState.TOUCH_CAN_MOVE;
        }
        if (self.touchState == TouchState.TOUCH_MOVE && self.entity.joyStickState == JoyStickState.ON && self.entity.action != Action.Jump)
        {
            self.touchMove();
        }*/
        self.checkInOutSafeZone();
    }

    private onClick(evt: egret.TouchEvent): void {
        if(!ControllerManager.scene.sceneReady) return;
        if(this.joystick && egret.getTimer() - this.joystick.closeTime < 34) return;
        if(this.entity.currentState == EntityModelStatus.ScaleTween) return;
        if (this.entity.action == Action.Die) {
            Tips.show("请复活后再操作");
            // EventManager.dispatch(NetEventEnum.kingDie);
            return;
        }
        if (CacheManager.buff.hasInterruptMoveBuff(0)) {
            Tip.showRollTip("眩晕状态下无法操作");
            return;
        }
        
        if (Action.isActionNoPlayPart(this.entity.action)) {
            Tips.show("当前状态下无法操作");
            return;
        }

        let clickX: number = evt.stageX + (-this.entity.gameView.getGameLayer().x);
        let clickY: number = evt.stageY + (-this.entity.gameView.getGameLayer().y);
        if (ControllerManager.battle.isLockLeader() && this.entity.action != Action.Move)
        {
            this.saveClick(clickX, clickY);
            return;
        }

        let _clickEntity:RpgGameObject = this.getClickEntity(evt.stageX, evt.stageY);
        if(_clickEntity)
        {
            EventManager.dispatch(LocalEventEnum.SceneClickEntity, _clickEntity, false, true, true);
            this.entity.gameView.hideClickPointMc();
        }
        else
        {
            if (this.entity.action == Action.Attack)
            {
                this.saveClick(clickX, clickY);
                return;
            }
            this.clickGround(clickX, clickY);
        }
    }

    private saveClick(clickX: number, clickY: number):void {
        if (!this.clickGroundSavePoint) {
            this.clickGroundSavePoint = new egret.Point(clickX, clickY);
        } else {
            this.clickGroundSavePoint.x = clickX;
            this.clickGroundSavePoint.y = clickY;
        }
        if(!ControllerManager.battle.isLockLeader()) {
            EventManager.dispatch(LocalEventEnum.LockAttack, 1000);
        }
        // console.log("clickGroundSavePoint:", clickX, clickY)
    }

    public clickGround(gotoX:number, gotoY:number):void{// 点击地面
        let _moveType:EMoveType = EMoveType.EMoveTypeNormal;
        if (ControllerManager.scene.isGlobalJump) 
        {
            _moveType = EMoveType.EMoveTypeJump;
        }
        if(this.moveTo(gotoX, gotoY, _moveType, true))
        {
            this.entity.gameView.showClickPointMc(gotoX,gotoY);
        }
        else
        {
            // this.entity.gameView.showForbidIcon(gotoX,gotoY);
        }
        if (MapUtil.showAutoFight()) {
            this.clickAutoFightTime = egret.getTimer() + 3000;
        }
        this.entity.battleObj = null;
        EventManager.dispatch(LocalEventEnum.SceneClickGround);
        EventManager.dispatch(LocalEventEnum.SceneClickGroundPos, {sx:this.entity.x, sy:this.entity.y, tx:gotoX, ty:gotoY, path:this.entity.path, follow:true});
    }

    /** 判断像素坐标是否可以行走 */
    public pixelXYCanWalk(x: number, y: number): boolean {
        if (!this.astar) return false;
        return this.astar.pixelXYCanWalk(x, y);
    }

    /** 判断格子坐标是否可以行走 */
    public gridXYCanWalk(x: number, y: number): boolean {
        if (!this.astar) return false;
        return this.astar.gridXYCanWalk(x, y);
    }

    /**根据点击位置，获取点击到的实体对象 */
    private getClickEntity(stageX:number,stageY:number):RpgGameObject
    {
        let types:RpgObjectType[] = MapUtil.getCanClickEntityTypes();
        if(!types || !types.length) {
            return null; 
        }
        let _entitys = this.entity.gameView.getEntitys();
        for(let _key in _entitys)
        {   
            let entity:RpgGameObject = _entitys[_key];
            if(types.indexOf(entity.objType) == -1) continue;
            if(!EntityUtil.canClick(entity)) continue;
            let avatarComponent: AvatarLayerComponent = <AvatarLayerComponent>entity.getComponent(ComponentType.Avatar);
            if (avatarComponent && avatarComponent.isHit(stageX, stageY)) 
            {
                return _entitys[_key];
            }
        }
        return null;
    }

    /**
     * 检查进入/退出安全区
     */
    private checkInOutSafeZone():void
    {
        let roleGrid:egret.Point = this.entity.gridPoint;
        if (this.curMapId != CacheManager.map.mapId)
        {
            this.curMapId = CacheManager.map.mapId;
            this.isInSafeZone = CacheManager.map.isMapPointType(roleGrid, EMapPointType.EMapPointTypeSafe);
        }
        let sceneData:any = CacheManager.map.getCurMapScene();
        if (sceneData && sceneData.mapEntityFightMode == EMapEntityFightMode.EMapEntityFightModePeaceOnly)
            return;
        if (CacheManager.map.isMapPointType(roleGrid, EMapPointType.EMapPointTypeSafe) && !this.isInSafeZone)
        {
            Tip.showTip(LangCommon.LANG1);
            this.isInSafeZone = true;
            EventManager.dispatch(LocalEventEnum.SafeZoneChange, this.isInSafeZone);
        }
        else if (CacheManager.map.isMapPointType(roleGrid, EMapPointType.EMapPointTypeSafe) == false && this.isInSafeZone)
        {
            Tip.showTip(LangCommon.LANG2);
            this.isInSafeZone = false;
            EventManager.dispatch(LocalEventEnum.SafeZoneChange, this.isInSafeZone);
        }
    }

    private onTouchBegin(e:egret.TouchEvent):void{
        if (this.touchState == TouchState.TOUCH_END && this.entity.action != Action.Jump && this.entity.currentState != EntityModelStatus.ScaleTween) {
            this.touchState = TouchState.TOUCH_BEGIN;//console.log("onTouchBegin");
            this.touchBeginTime = egret.getTimer();
            this.stagePos.x = e.stageX;
            this.stagePos.y = e.stageY;
            this.entity.gameView.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }
    }

    private onTouchMove(e:egret.TouchEvent):void{
        if (this.touchState == TouchState.TOUCH_CAN_MOVE || this.touchState == TouchState.TOUCH_MOVE) {
            this.touchState = TouchState.TOUCH_MOVE;
            LayerManager.UI_Home.touchable = false;//关掉输入事件

            this.stagePos.x = e.stageX;
            this.stagePos.y = e.stageY;
            this.joystick && this.joystick.touchMove(this.stagePos);
        }
    }

    private onTouchEnd(e?:egret.TouchEvent):void{
        this.touchState = TouchState.TOUCH_END;//console.log("onTouchEnd");
        LayerManager.UI_Home.touchable = true;
        this.entity.joyStickState = JoyStickState.OFF;

        if (this.joystick && this.joystick.parent) {
            this.joystick.close();
            this.joystick.removeFromParent();

            if (this.entity.action != Action.Jump && this.entity.currentState != EntityModelStatus.ScaleTween)
                this.entity.stopMove();
            this.touchToGrid.x = this.touchToGrid.y = 0;
        }
        this.lastTouchDir = null;
        this.entity.gameView.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        App.StageUtils.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private initJoystick() {
        if (!this.joystick) {
            this.joystick = new JoyStick;
        }
        if (this.joystick.parent == null) {
            let gameView:RpgGameView = this.entity.gameView;
            let addX:number = this.stagePos.x - gameView.x;
            let addY:number = this.stagePos.y - gameView.y;
            this.joystick.x = addX;
            this.joystick.y = addY;
            LayerManager.UI_Main.addChild(this.joystick);
            this.entity.joyStickState = JoyStickState.ON;
            CacheManager.king.stopKingEntity();
        }
    }

    private touchMove() {
        let angle:number = this.joystick.touchAngle;
        if (angle != null) {
            let roundAng:number = App.MathUtils.getAngle(angle);
            let dir:Dir = RpgGameUtils.computeDir4(roundAng);
            if (dir == this.lastTouchDir) {
                let curEndNode:PathNode = this.entity.path ? this.entity.path[this.entity.path.length - 1] : null;
                if (curEndNode && this.touchToGrid.x != 0 && this.touchToGrid.y != 0
                    && (Math.abs(curEndNode.x - this.entity.gridPoint.x)>1||Math.abs(curEndNode.y - this.entity.gridPoint.y)>1))
                {
                    //console.log("curEndNode=", curEndNode.x, curEndNode.y, "grid=", `${this.entity.gridPoint}`)
                    return;
                }
            }
            this.lastTouchDir = dir;
            let toGrid:any = RpgGameUtils.getToDirCell(this.entity.sPoint, dir, 3);
            if (this.gridXYCanWalk(toGrid.x_SH, toGrid.y_SH) == false)
                toGrid = RpgGameUtils.getToDirCell(this.entity.sPoint, dir);
            if (this.gridXYCanWalk(toGrid.x_SH, toGrid.y_SH)) {
                if (toGrid.x_SH != this.touchToGrid.x || toGrid.y_SH != this.touchToGrid.y) {
                    this.touchToGrid.x = toGrid.x_SH;
                    this.touchToGrid.y = toGrid.y_SH;
                    let pixPos: egret.Point = RpgGameUtils.convertCellToXY(this.touchToGrid.x, this.touchToGrid.y);
                    this.moveTo(pixPos.x, pixPos.y, EMoveType.EMoveTypeNormal);//console.log("touchMove=", egret.getTimer(), this.entity.sPoint.x_SH, this.entity.sPoint.y_SH, "->", `${this.touchToGrid}`)
                }
            } else if (this.entity.action != Action.Move || this.entity.dir != dir) {
                this.entity.dir = dir;
                this.entity.playMove();
            }
        }
    }

}
