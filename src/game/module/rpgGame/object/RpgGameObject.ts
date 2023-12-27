/**
 * 这个记录实体的状态，跟动作Action区分开
 */
class EntityModelStatus {
    public static Prepare: string = "prepare";
    public static Attack: string = "attack";
    public static Attacked: string = "attacked";
    public static Die: string = "die";
    public static Move: string = "move";
    public static Stand: string = "stand";
    public static Rush: string = "rush";
    public static Jump: string = "jump";
    /**原地跳跃，用于区分跳跃中发生位移时的实体移速 */
    public static JumpUpDown:string = "jumpUpDown";
    public static Collection:string = "collection";
    public static ScaleTween:string = "scaleTween";
}

enum JoyStickState{
    OFF,
    ON
}

/**
 * 实体基类
 */
class RpgGameObject {
    protected _components: any;
    public objType:number;

    protected gPixelX: number;
    protected gPixelY: number;
    private _dir: Dir;
    public pathChange: boolean;
    private _action: string;
    public lastAction: string;
    protected gCurrentState: string;
    protected gJoyStickState: JoyStickState = JoyStickState.OFF;
    private _battleObj: RpgGameObject;
    private _sPoint:any;
    protected _pixPoint:egret.Point;
    protected _gridPoint:egret.Point;
    private _bodyHeartPos:egret.Point;

    /**角色实体信息,SEntityInfo */
    protected _entityInfo: EntityBaseInfo;
    // private _isTouchGround:boolean = false;
    private _entityCareer: number = 0;

    private _inCamera: boolean;
    private _path: PathNode[];
    private _gameView: RpgGameView;

    // protected _deathOffsetPt: egret.Point;
    protected _deathDir: number;
    protected _hpTxtFlyDir:number;
    protected _hpTxtFlyDirY:number;
    /**被攻击时的技能id */
    protected _fromSkillId:number;
    protected _selected:boolean;
    protected _controlComponent: ControlComponent;//控制组件

    private _currentSkillId: number = 0; //当前/本次攻击的技能ID
    private _avatarComponent: AvatarComponent;

    /**是否上下缓动中 */
    // private gStandTween:boolean = false;
    // private attackNO: number = 1;
    /**
     * 对于掉落实体指是否被拾取了
     * 对于玩家指是否正在拾取中
     */
    private gIsPickUp:boolean = false;
    private _moveType:EMoveType;
    /** 冲锋结束时间*/
    private _chargeEndTime:number;
    protected _hasInit:boolean;
    private _isJumping: boolean;
    protected rpgTxts:RpgText[] = [];
    public constructor() {
        this._components = {};
    }

    public init(data: EntityBaseInfo): void {
        
        this._dir = Dir.Bottom;
        if(data["direction_BY"])
        {
            if (data["direction_BY"] > 0 && data["direction_BY"] < 9) {
                this._dir = (data["direction_BY"] + 1) % 8;
            }
        }
        //实体应该也带上职业，不用每次重复(特别update频繁)做处理
        if (data["career_SH"]) {
            let baseCareer:number = CareerUtil.getBaseCareer(data["career_SH"]);
            this._entityCareer = baseCareer;
        }
        this._entityInfo = data;
        this._sPoint = { "x_SH": this.entityInfo.col, "y_SH": this.entityInfo.row };
        this._gridPoint = new egret.Point(this.entityInfo.col, this.entityInfo.row);
        var p: egret.Point = RpgGameUtils.convertCellToXY(this.col, this.row);
        this._pixPoint = new egret.Point(p.x, p.y);
        this.gPixelX = p.x;
        this.gPixelY = p.y;
        this.action = this.isDead() ? Action.Die : Action.Stand;
    }

    public addComponent(componentName: string): void {
        let _keyType:string = ComponentType.getComponentKey(componentName);
        if (this._components[_keyType]) {
            return;
        }

        var component: Component = ObjectPool.pop(componentName);
        component.type = _keyType;
        component.entity = this;
        ComponentSystem.addComponent(component);
        this._components[_keyType] = component;
        component.start();

    }

    public removeComponent(componentName: string): void {
        let _keyType:string = ComponentType.getComponentKey(componentName);
        var component: Component = this._components[_keyType];
        if (!component) {
            return;
        }
        ComponentSystem.removeComponent(component);

        component.stop();
        ObjectPool.push(component);
        
        if(this._avatarComponent == component) this._avatarComponent = null;
        if(this._controlComponent == component) this._controlComponent = null;
        this._components[_keyType] = null;
        delete this._components[_keyType];
    }

    public getComponent(componentName: string): Component {
        let _keyType:string = ComponentType.getComponentKey(componentName);
        let component: Component = this._components[_keyType];
        return component;
    }

    public resetPointData(posX: number, posY: number): void
    {
        if(/*ControllerManager.scene.sceneReady && */!this.gridPoint || (this.gridPoint.x == posX && this.gridPoint.y == posY)) {
            Log.trace(Log.RPG,"resetPointData无需重置位置：",this.entityInfo.selfIndex,posX,posY,CacheManager.map.mapId);
            return;
        }
        
        this.entityInfo.col = posX;
        this.entityInfo.row = posY;
        let p: egret.Point = RpgGameUtils.convertCellToXY(this.col, this.row);
        this.gPixelX = p.x;
        this.gPixelY = p.y;
        this.stopMove();
    }

    public get path(): PathNode[] {
        return this._path;
    }

    public set path(value: PathNode[]) {
        if (this._path == value) return;
        this._path = value;
        this.pathChange = true;
        //if (this.objType == RpgObjectType.MainPlayer) console.log("path:", this._path ? (this._path[0].x + "," + this._path[0].y): "null");
        if (this._path) {
            this.setMovePose();
            this.setMoveDir(this._path[0]);
            //主角的话，发送路径格子信息给地图更新
            if (this.isLeaderRole) {
                EventManager.dispatch(LocalEventEnum.SceneFindPathNodes, this._path);
                //主角如果不站立了，发送改变事件
                if (this.lastAction == Action.Stand || this.lastAction == Action.Move)
                    EventManager.dispatch(LocalEventEnum.SceneMainPlayerActionUpdate, {"currentAction": this.action, "lastAction": this.lastAction});
            }
        } else {
            if (this.action != Action.Die) {
                if (this.action == Action.Jump) {
                    this.resetJump();
                }
                this.playStand();
                //主角如果站立了，发送改变事件
                if (this.isLeaderRole) {
                    if (this.lastAction == Action.Stand || this.lastAction == Action.Move)
                        EventManager.dispatch(LocalEventEnum.SceneMainPlayerActionUpdate, {"currentAction": this.action, "lastAction": this.lastAction});
                }/* else if (this.entityInfo.selfIndex > 0) {
                    console.log("path null~~~~", this.entityInfo.selfIndex);
                }*/
            }
            if(this.isLeaderRole)
            {
                this.gameView.hideClickPointMc();
            }
            this.moveType=EMoveType.EMoveTypeNormal;
        }
    }

    private setMovePose():void{
        switch (this._moveType)
        {
            case EMoveType.EMoveTypeRush:
                this.action = Action.Rush;
                break;
            case EMoveType.EMoveTypeJump:
                this.action = Action.Jump;
                break;
            case EMoveType.EMoveTypeCharge:
                this.action = Action.Charge;
                break;
            case EMoveType.EMoveTypeSimple:
                break;
            default:
                this.action = Action.Move;
        }
    }

    private setMoveDir(node:PathNode):void {
        if (node && this.moveType != EMoveType.EMoveTypeSimple) {
            let pos:egret.Point = RpgGameUtils.convertCellToXY(node.x, node.y);
            this._dir = RpgGameUtils.computeGameObjDir(this.x, this.y, pos.x, pos.y);
        }
    }

    public setJumpPath(value: PathNode[]) {
        this._isJumping = true;
        this._path = value;
    }

    /** 实体信息，结构：message SEntityInfo */
    public get action(): string {
        return this._action;
    }

    public set action(value: string) {
        if (this.action == Action.Die && value != Action.Stand) {
            return;
        }
        if (this._action == value) {
            return;
        }
        this.lastAction = this._action;
        this._action = value;//if (this.objType == RpgObjectType.MainPlayer) console.log("setAction=", this.lastAction, this.action, App.TimerManager.curFrame);
        if(this.objType == RpgObjectType.MainPlayer || this.objType == RpgObjectType.OtherPlayer)
        {
            if(this.currentState == EntityModelStatus.ScaleTween || this._action == Action.Jump) return;
            if(this._action == Action.Stand && this.currentState != EntityModelStatus.Collection)
            {
                this.addUpDownTween();
            }
            else
            {
                this.removeUpDownTween();
            }
            if (this.lastAction == Action.Charge && this._action == Action.Stand)
            {
                this._chargeEndTime = egret.getTimer();
            }
        }
        if(this._action == Action.Die) {
            this.currentState = EntityModelStatus.Die;
        }
        //if (this.objType == RpgObjectType.MainPlayer) console.log("lastAction=", this.lastAction, "actyion=", this._action, egret.getTimer());
    }

    /** 实体信息，结构：message SEntityInfo */
    public get entityInfo(): any {
        return this._entityInfo;
    }

    public set battleObj(value: RpgGameObject) {
        if (this._battleObj == value) return;
        // this.isBeingAttacked = value != null;
        if (this.isLeaderRole)
            this._battleObj && this._battleObj.setSelect(false);
        this._battleObj = value;
        if (this.isLeaderRole){
            this._battleObj && this._battleObj.setSelect(true);
            EventManager.dispatch(LocalEventEnum.BattleObjChange,this._battleObj);
        }
    }

    public setSelect(isSelect: boolean, selectType: number = 0): void {
        this._selected = isSelect;
        let avatarComponent: AvatarComponent = <AvatarComponent>this.getComponent(ComponentType.Avatar);
        avatarComponent && avatarComponent.setSelect(isSelect, selectType);

        let _headComponent:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;     
        _headComponent && _headComponent.showSelect(isSelect);
        // this.setHeadShow(isSelect);
    }

    /** 实体坐标信息SPoint */
    public get sPoint(): any {
        this._sPoint.x_SH = this.col;
        this._sPoint.y_SH = this.row;
        return this._sPoint;
    }

    /** 实体像素坐标pixPoint */
    public get pixPoint(): egret.Point {
        this._pixPoint.x = this.x;
        this._pixPoint.y = this.y;
        return this._pixPoint;
    }

    /** 实体格子坐标gridPoint
     *  用col和row不能实现需求：冲刺的时候col,row不会实时更新
     * */
    public get gridPoint(): egret.Point {
        this._gridPoint.x = Math.floor(this.x / RpgGameData.GameCellWidth);
        this._gridPoint.y = Math.floor(this.y / RpgGameData.GameCellHeight);
        return this._gridPoint;
    }

    public isDead():boolean
    {
        return this.action == Action.Die;
    }

    /**
     * 客户端主动移动(格子) - 会同步至服务端
     */
    public gotoGrid(gridX: number, gridY: number, moveType:EMoveType = EMoveType.EMoveTypeNormal): void {
        let p: egret.Point = RpgGameUtils.convertCellToXY(gridX, gridY);
        this.goto(p.x, p.y, moveType);
    }

    /**
     * 客户端主动移动(像素) - 会同步至服务端
     */
    public goto(gotoX: number, gotoY: number, moveType:EMoveType = EMoveType.EMoveTypeNormal): void {
    }

    /**
     * 服务端同步移动 - 用于非客户端主动操作
     */
    public moveToServerPoint(serverPointX: number, serverPointY: number, moveType: EMoveType): void {
        this._moveType = moveType;
        let node:PathNode = new PathNode(serverPointX, serverPointY);
        node.isJump = moveType == EMoveType.EMoveTypeJump;
        let path: PathNode[] = [node];
        this.path = path;
    }

    /** 播放攻击 */
    public playAttack(skillId: number, targetObject: RpgGameObject): void {
        let avatarComponent: AvatarComponent = <AvatarComponent>this.getComponent(ComponentType.Avatar);
        avatarComponent && avatarComponent.playAttack(skillId, targetObject);
    }

    /** 播放站立 */
    public playStand(): void {
        if (this.gJoyStickState == JoyStickState.OFF && !this.isDead()) {
            this.action = Action.Stand;
        }
    }

    /** 播放移动 */
    public playMove(): void {
        this.action = Action.Move;
    }

    public stopMove():void {
        this.path = null;
        this.playStand();
    }

    protected createHpText2(str: string, font: string,isCrit:boolean = false): RpgText
    {
        let _text: RpgText = ObjectPool.pop("RpgText");
        _text.initView(str,font,this.x,this.y - 150,isCrit);
        this.gameView.getGameTipsLayer().addChild(_text.displayObj);
        this.rpgTxts.push(_text);
        return _text;
    }

    protected removeHpText2(text: RpgText): void 
    {
        text.destory();
        let index:number = this.rpgTxts.indexOf(text);
        if(index != -1) {
            this.rpgTxts.splice(index);
        }
        text = null;
    }
    
    public updateLifeShield():void{
        let bossBar:RpgBossInfView = ControllerManager.rpgGame.bossLifeBar;
        if(bossBar && EntityUtil.isSame(bossBar.entityId,this.entityInfo.entityId)) {
            bossBar.updateLifeShield();
        }
    }
    public updateLife():void
    {
        let _headComponent:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(_headComponent) {
            _headComponent.updateLife();
        }
        if(!this.entityInfo) {
            return;
        }
        EventManager.dispatch(NetEventEnum.EntityLifeUpdate,this);
    }

    public death(fromEntity:RpgGameObject = null): void 
    {
        this.action = Action.Die;
        if(!this.avatar || (this.objType != RpgObjectType.MainPlayer && this.objType != RpgObjectType.OtherPlayer)) return;
        this.avatar.updateOtherComponent();
        this.avatar.updateBodyAllPos();
    }

    public revive():void {
        this.action = Action.Stand;
        if(!this.avatar || (this.objType != RpgObjectType.MainPlayer && this.objType != RpgObjectType.OtherPlayer)) return;
        this.avatar.updateOtherComponent();
        this.avatar.updateBody(true);
    }

    /**更新外观 */
    public updateAvatarModel(type:EEntityAttribute):void
    {
        if(!this.entityInfo) return;
        let _pet:PetEntity = CacheManager.map.getBelongEntity(this.entityInfo.entityId,EEntityType.EEntityTypePet) as PetEntity;
        switch(type)
        {
            case EEntityAttribute.EAttributeMounts://坐骑
                //更新顺序 body -> wing -> weapon -> mount 
                if(!this.avatar) break;
                this.avatar.updateBody(true);
                let _wingComponent:AvatarWingComponent = this.getComponent(ComponentType.AvatarWing) as AvatarWingComponent;
                if(_wingComponent) _wingComponent.updateWing(true);
                let _weaponComponent:AvatarWeaponComponent = this.getComponent(ComponentType.AvatarWeapon) as AvatarWeaponComponent;
                if(_weaponComponent) _weaponComponent.updateWeapon(true);
                let _mountComponent:AvatarMountComponent = this.getComponent(ComponentType.AvatarMount) as AvatarMountComponent;
                if(_mountComponent) _mountComponent.updateMount();
                let _lawComponent1:AvatarLawComponent = this.getComponent(ComponentType.AvatarLaw) as AvatarLawComponent;
                if(_lawComponent1) _lawComponent1.updateLaw();
                break;
            case EEntityAttribute.EAttributeShapeLaw://法阵
                let _lawComponent:AvatarLawComponent = this.getComponent(ComponentType.AvatarLaw) as AvatarLawComponent;
                if(_lawComponent) _lawComponent.updateLaw();
                break;
            case EEntityAttribute.EAttributeShapeSpirit://法宝
                let _spiritComponent:AvatarSpiritComponent = this.getComponent(ComponentType.AvatarSpirit) as AvatarSpiritComponent;
                if(_spiritComponent) _spiritComponent.updateSpirit();
                break;
            case EEntityAttribute.EAttributeSpirit://小精灵
                let _spriteComponent:AvatarSpriteComponent = this.getComponent(ComponentType.AvatarSprite) as AvatarSpriteComponent;
                if(_spriteComponent) _spriteComponent.updateSprite();
                break;
            case EEntityAttribute.EAttributeWing://翅膀
                _wingComponent = this.getComponent(ComponentType.AvatarWing) as AvatarWingComponent;
                if(_wingComponent) _wingComponent.updateWing(true);
                break;
            case EEntityAttribute.EAttributeWeapon://武器
            case EEntityAttribute.EAttributeShapeMagic://神兵
                _weaponComponent = this.getComponent(ComponentType.AvatarWeapon) as AvatarWeaponComponent;
                if(_weaponComponent) _weaponComponent.updateWeapon(true);
                break;
            case EEntityAttribute.EAttributeClothes://衣服
            case EEntityAttribute.EAttributeFashion://时装
                if(this.avatar) this.avatar.updateBody(true);
                break;
            case EEntityAttribute.EAttributeSwordPool:
                let _soulComponent:AvatarSoulComponent = this.getComponent(ComponentType.AvatarSoul) as AvatarSoulComponent;
                if(_soulComponent) _soulComponent.updateSoul();
                break;
            case EEntityAttribute.EAttributeShapeBattle:
                let _shapeBattleComponet:AvatarLawComponent = this.getComponent(ComponentType.AvatarLaw) as AvatarLawComponent;
                if(_shapeBattleComponet) _shapeBattleComponet.updateLaw();
                break;
            case EEntityAttribute.EAttributeShapeSwordPool:
                let _swordPoolComponet:AvatarSwordPoolComponent = this.getComponent(ComponentType.AvatarSwordPool) as AvatarSwordPoolComponent;
                if(_swordPoolComponet) _swordPoolComponet.updateSoul();
                break;
            // case EEntityAttribute.EAttributeShapePet://宠物外形更新
			// 	if(_pet) 
            //     {
            //         _pet.entityInfo.modelId_I = _pet.entityInfo.weapons[EEntityAttribute.EAttributeClothes] = this.entityInfo.weapons[EEntityAttribute.EAttributeShapePet];
            //         _pet.updatePet();
            //     }
            //     break;
            case EEntityAttribute.EAttributeSpeed://速度更新
                if(_pet) 
                {
                    _pet.entityInfo.speed_SH = this.entityInfo.speed_SH;
                }
                break;
            case EEntityAttribute.EAttributeForeverEquipSuit:
                 let _ancientComponent:AvatarAncientComponent = this.getComponent(ComponentType.Ancient) as AvatarAncientComponent;
                if(_ancientComponent) _ancientComponent.updateAncient();
                break;
        }
    }

    /**检测是否可上坐骑 */
    public canGetOnMount():boolean
    {
        return this.action != Action.Attack && this.action != Action.Die && this.action != Action.Jump && this.currentState != EntityModelStatus.ScaleTween;
    }

    public get avatarBody():egret.DisplayObjectContainer
    {
        if (!this._avatarComponent)
            this._avatarComponent = <AvatarComponent>this.getComponent(ComponentType.Avatar);
        if (!this._avatarComponent) return null;
        return this._avatarComponent.bodyAll;
    }

    public get avatar():AvatarComponent
    {
        if (!this._avatarComponent)
            this._avatarComponent = <AvatarComponent>this.getComponent(ComponentType.Avatar);
        if (!this._avatarComponent) return null;
        return this._avatarComponent;
    }

    /** 原地起跳，这个没测，场景用 this.sceneJump()*/
    public situJump():void
    {
        if (this.action == Action.Jump) return;

        // Log.trace("原地起跳。。。:", CacheManager.battle.battle_config.JumpHeigh);
        if (this.avatarBody) {
            egret.Tween.removeTweens(this.avatarBody);
            egret.Tween.removeTweens(this.avatar.mountDown);
            let _posY:number = this.isOnMount ? -100 : 0;
            // this.avatar.bodyAll.y = 0;
            this.avatar.mountDown.y = 0;
            this.currentState = EntityModelStatus.JumpUpDown;
            this.action = Action.Jump;
            egret.Tween.get(this.avatarBody).to({y: -150}, 360, egret.Ease.circOut)
                .to({y: _posY}, 360, egret.Ease.circIn).call(this.onSituJumpComplete, this);
        }
    }
    /** 原地跳完后需要处理的函数 */
    private onSituJumpComplete():void
    {
        egret.Tween.removeTweens(this.avatarBody);
        if(this.isOnLaw) this.addUpDownTween();
        else this.removeUpDownTween();
        this.currentState = EntityModelStatus.Stand;
        if(this.lastAction == Action.Jump)
        {
            this.action = Action.Stand;
        }
        else this.action = this.lastAction;
        // Log.trace("原地结束。。。:", CacheManager.battle.battle_config.JumpHeigh);
    }

    /**
     * 地图跳跃
     */
    public sceneJump(upTime: number, downTime: number):void
    {
        if (this.action == Action.Jump && this.currentState == EntityModelStatus.Jump) return;

        // let halfDuration:number = Math.ceil(duration/2);
        let jumpHeigh:number = CacheManager.battle.battle_config.JumpHeigh;
        if (this.avatarBody) {
            this.avatar.hideFootShadow();
            egret.Tween.removeTweens(this.avatarBody);
            this.currentState = EntityModelStatus.Jump;
            this.action = Action.Jump;
            let bodyY:number = this.avatarBody.y;
            egret.Tween.get(this.avatarBody).to({y: jumpHeigh}, upTime, egret.Ease.circOut)
                .to({y: bodyY}, downTime, egret.Ease.circIn).call(this.onSceneJumpComplete, this);
        }
        let _mountComponent:AvatarMountComponent = this.getComponent(ComponentType.AvatarMount) as AvatarMountComponent;
        if(_mountComponent) _mountComponent.hideMountTween(false);

    }

    protected onSceneJumpComplete():void
    {
        this.currentState = EntityModelStatus.Stand;
        this._isJumping = false;
        this.action = Action.Stand;
        let _mountComponent:AvatarMountComponent = this.getComponent(ComponentType.AvatarMount) as AvatarMountComponent;
        if(_mountComponent) _mountComponent.showMountTween();
        this.avatar && this.avatar.showFootShadow();
    }

    private resetJump():void {
        if (this.avatarBody) {
            egret.Tween.removeTweens(this.avatarBody);
            if (this._isJumping) {
                this.onSceneJumpComplete();
            }
            this.avatarBody.y = 0;
            this.currentState = EntityModelStatus.Stand;
            this.action = Action.Stand;
            this._isJumping = false;
            // let _mountComponent:AvatarMountComponent = this.getComponent(ComponentType.AvatarMount) as AvatarMountComponent;
            // if(_mountComponent) _mountComponent.resetAlpha();
        }
    }

    public get currentState():string
    {
        return this.gCurrentState;
    }

    /**
     * 如有 currentState 是设置的lastAction。
     * 必须最优先设置currentState，否则在action中，lastAction会被覆盖
     */
    public set currentState(value:string)
    {
        if (this.gCurrentState != value)
            this.gCurrentState = value;
    }

    public get joyStickState():JoyStickState
    {
        return this.gJoyStickState;
    }

    public set joyStickState(value:JoyStickState)
    {
        if (this.gJoyStickState != value)
            this.gJoyStickState = value;
    }

    protected addUpDownTween():void
    {
        // if(!this.avatar || !this.isOnLaw) return;
        // if(this.gStandTween) return;
        // this.gStandTween = true;
        // egret.Tween.removeTweens(this.avatar.bodyAll);
        // egret.Tween.removeTweens(this.avatar.mountDown);
        // // let _posY:number = this.avatar.bodyAll.y;
        // this.avatar.bodyAll.y = 0;
        // egret.Tween.get(this.avatar.bodyAll,{loop:true}).to({y:- 15},5000,egret.Ease.quadInOut).to({y:0},5000,egret.Ease.quadInOut);
        // egret.Tween.get(this.avatar.mountDown,{loop:true}).to({y:- 15},5000,egret.Ease.quadInOut).to({y:0},5000,egret.Ease.quadInOut);
    }

    protected removeUpDownTween():void
    {
        // if(!this.avatar || !this.gStandTween) return;
        // this.gStandTween = false;
        // egret.Tween.removeTweens(this.avatar.bodyAll);
        // egret.Tween.removeTweens(this.avatar.mountDown);
        // if(!this.isOnMount)
        // {
        //     this.avatar.bodyAll.y = 0;
        // }
        // this.avatar.mountDown.y = 0;
    }

    public updateBuff(data:any):void {
        let _buffComponent:BuffComponent = this.getComponent(ComponentType.Buff) as BuffComponent;
        let typeArr:string[];
        let type:EBufferOp;
        if(typeof data.type == "number") {
            type = data.type
        }
        else {
            typeArr = data.type.split("#");
            type = Number(typeArr[0])
        }
        if(_buffComponent) _buffComponent.updateBuff(data.buffId,type);
    }

    public talk(content:string,time?:number):void
    {
        let _talkCom:TalkComponent = this.getComponent(ComponentType.Talk) as TalkComponent;
        if(_talkCom) _talkCom.talk(content,time);
    }

    public spiritPlayAttack():void
    {
        let _spiritComponent:AvatarSpiritComponent = this.getComponent(ComponentType.AvatarSpirit) as AvatarSpiritComponent;
        if (_spiritComponent) _spiritComponent.playAttack();
    }

    /**
     * 法宝位置
     */
    public get spiritPos():egret.Point
    {
        let _spiritComponent:AvatarSpiritComponent = this.getComponent(ComponentType.AvatarSpirit) as AvatarSpiritComponent;
        if (_spiritComponent) return _spiritComponent.centerPos;
        return RpgGameUtils.ZERO_POS;
    }

    /**
     * 身体中心位置
     */
    public get bodyHeartPos():egret.Point
    {
        let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!this._bodyHeartPos) {
            this._bodyHeartPos = new egret.Point(0,0);
        }
        if(_avatarComponent) {
            this._bodyHeartPos.y = -this.bodyHeight/2 + _avatarComponent.bodyAll.y + _avatarComponent.body.y + _avatarComponent.bodyMc.y;
        }
        else {
            this._bodyHeartPos.y = -this.bodyHeight/2;
        }
        return this._bodyHeartPos;
        // return _avatarComponent ? new egret.Point(0, -this.bodyHeight/2 + _avatarComponent.bodyAll.y + _avatarComponent.body.y + _avatarComponent.bodyMc.y) : new egret.Point(0, -this.bodyHeight/2);
    }

    public get bodyHeight():number
    {
        let _headComponent:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        return _headComponent ? _headComponent.modelHeight : 100;
    }

    /**设置仙盟名字 */
    public setGuildName():void{
        var head:HeadComponent = <HeadComponent>this.getComponent(ComponentType.Head);
        if(head){
            head.setGuildName();
        }
    }

    public showHpChange(changeHp: number, fromEntity:any,hurtType: EHurtType = EHurtType.EHurtTypeNormal,fightEntity:RpgGameObject = null): void
    {
    }

    public updateDeathDir(entity: RpgGameObject): void {
    }

    /**
     * 点击
     */
    public onClick(...params): void {
    }

    /**
     * 开始采集
     */
    public startCollect(entity:RpgGameObject):void
    {
    }

    /**
     * 开始采集
     */
    public isCollecting():boolean
    {
        return false;
    }
    /**
     * Npc对话
     */
    public npcDialogue():void
    {
    }
    /**
     * 传送
     */
    public passPointToMap():void
    {
    }

    public updateModelHeight():void
    {
        let buffCom:BuffComponent = this.getComponent(ComponentType.Buff) as BuffComponent;
        if(buffCom) buffCom.updateModelHeight();
    }
    /**
     * 更新实体模型显示与否
     */
    public updateModelIsShow():void
    {
    }
    /**更新时装外观显示或隐藏 */
    public updateNotShowFashion(type:string,isHide:boolean):void
    {
        if(type == ComponentType.AvatarSoul || type == ComponentType.AvatarSprite || 
        type == ComponentType.AvatarSpirit || type == ComponentType.AvatarLaw
        || type == ComponentType.AvatarMount || type == ComponentType.AvatarSwordPool) {
            //屏蔽坐骑、法宝、法阵、龙魂、精灵
            return;
        }
        if(isHide)
        {
            this.removeComponent(type);
        }
        else
        {
            this.addComponent(type);
        }
    }

    /**称号更新 */
    public updateTitle():void {
    }

    public get titlePath():string {
        return "";
    }
    /**更新阵营势力 */
    public updateForce():void {
        let head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(head) head.updateForce();
    }

    /**名称更新 */
    public updateName():void {
    }

    /**检测死亡 */
    public checkDeath():void {
    }

    /**
     * 更新实体状态 
     * EMoveStatus
     */
    public updateStatus():void {
    }

    public removeAllComponents():void {
        for (let componentName in this._components) {
            this.removeComponent(componentName);
        }
    }

    public checkOnMask():void {
        if (CacheManager.map.isMapPointType(this.gridPoint, EMapPointType.EMapPointTypeTransparent)) {
            let alpha:number = 0.5;
            if (this.action == Action.Jump) alpha = 1;
            this.avatarBody && (this.avatarBody.alpha = alpha);
        } else {
            this.avatarBody && (this.avatarBody.alpha = 1);
        }
    }

    public destory(): void {
        this.removeAllComponents();
        let _mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
        if(_mainPlayer)
        {
            if (_mainPlayer.battleObj == this) {
                _mainPlayer.battleObj = null;
            }
            if (CacheManager.bossNew.battleObj == this) {
                CacheManager.bossNew.battleObj = null;
            }

            if(CacheManager.king.collectEntity == this)
            {
                _mainPlayer.currentState = EntityModelStatus.Stand;
            }
        }
        if(this.entityInfo && this.entityInfo.entityId) {
            let entityId:any = this.entityInfo.entityId;
            CacheManager.map.removeFightPlayer(entityId);
            CacheManager.map.removeCanAttackPlayer(entityId);
            CacheManager.map.removeMurdererId(entityId);
            let bossBar:RpgBossInfView = ControllerManager.rpgGame.bossLifeBar;
            if(bossBar && EntityUtil.isSame(bossBar.entityId,entityId)) {
                EventManager.dispatch(LocalEventEnum.BossLifeViewHide);
            }
        }
        for(let i:number = 0; i < this.rpgTxts.length; i++) {
            this.rpgTxts[i].destory();
            this.rpgTxts[i] = null;
        }
        this.rpgTxts = [];
        
        this._path = null;
        this.battleObj = null;
        this._entityInfo = null;
        this._fromSkillId = 0;
        this._currentSkillId = 0;
        this.gIsPickUp = false;
        this._dir = Dir.Bottom;
        this.action = Action.Stand;
        this.currentState = EntityModelStatus.Stand;
        this._pixPoint = null;
        this._gridPoint = null;
        this._inCamera = false;
        this._hasInit = false;
        this._isJumping = false;
        ObjectPool.push(this);
    }

    public setInCamera(value: boolean) {
        this._inCamera = value;
    }

    public getInCamera(): boolean {
        return this._inCamera;
    }

    /**是否坐骑状态 */
    public get isOnMount():boolean
    {
        if(!this.entityInfo) return false
        return this.entityInfo.isOnMount;
    }

    public get isOnLaw():boolean
    {
        if(!this.entityInfo) return false;
        let _id:number = this.entityInfo.getModelId(EEntityAttribute.EAttributeShapeBattle);
        return _id && _id > 0;
    }

    public set currentSkillId(skillId: number) {
        this._currentSkillId = skillId;
    }
    public get currentSkillId(): number {
        return this._currentSkillId;
    }

    // public set isTouchGround(value: boolean) {
    //     this._isTouchGround = value;
    // }
    // public get isTouchGround(): boolean {
    //     return this._isTouchGround;
    // }

    public get battleObj(): RpgGameObject {
        return this._battleObj;
    }

    public set fromSkillId(value:number)
    {
        this._fromSkillId = value;
    }

    public set isPickUp(value:boolean)
    {
        this.gIsPickUp = value;
    }

    public get isPickUp():boolean
    {
        return this.gIsPickUp;
    }

    public get canPickUp():boolean
    {
        return false;
    }

    public get mcPath():string
    {
        return this.rootPath + EntityUtil.getEntityMcPathName(this.entityInfo.type) + "/";
    }

    public get mcName():string
    {
        //子类重写
        return "";
    }

    public get rootPath():string
    {
        return ResourcePathUtils.getRPGGame();
    }

    public set x(value:number)
    {
        this.gPixelX = value;
    }

    public set y(value:number)
    {
        this.gPixelY = value;
    }

    public get x():number
    {
        return this.gPixelX;
    }

    public get y():number
    {
        return this.gPixelY;
    }

    public get col():number
    {
        return this.entityInfo.col;
    }

    public get row():number
    {
        return this.entityInfo.row;
    }

    public get gameView():RpgGameView
    {
        if (!this._gameView) this._gameView = ControllerManager.rpgGame.view;
        return this._gameView;
    }

    public get hasDeathOffset(): boolean {
        return false;
    }

    public get moveType(): EMoveType {
        return this._moveType;
    }

    public set moveType(value: EMoveType) {
        this._moveType = value;
    }

    public get controlComponent():ControlComponent {
        return this._controlComponent;
    }

    public get isLeaderRole():boolean {
        return false;
    }

    public get isCharging():boolean {
        return egret.getTimer() - this._chargeEndTime < 500;
    }

    public get hasInit():boolean {
        return this._hasInit;
    }

    public isMoving():boolean{
        return this.path != null;
    }

    public get movingDir():number {
        return this.isMoving() ? this._dir : -1;
    }

    public get isJumping(): boolean {
        return this._isJumping;
    }
    
    /** 实体职业 */
    public get entityCareer(): number {
        return this._entityCareer;
    }

    public get dir(): Dir {
        return this._dir;
    }

    public set dir(value: Dir) {
        if (this._dir != value) {
            this._dir = value;
        }
    }
}