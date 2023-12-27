
class MainPlayer extends RpgGameObject {
    public isCopyTween:boolean;
    private tweenEffect:MovieClip;
    private gRoleIndex:number;
    private gIsLeader:boolean;
    public constructor() {
        super();
        this.objType = RpgObjectType.MainPlayer;
    }

    public init(data: EntityInfo): void {
        super.init(data);
        this.gRoleIndex = data.selfIndex;
        if (data.selfIndex >= 0 && CacheManager.king.getLastDir(data.selfIndex) != -1) {
            this.dir = CacheManager.king.getLastDir(data.selfIndex);
        }
        this.initRoleLeader();
        Log.trace(Log.RPG, `创建主角色${data.selfIndex}，是否主控制->${this.gIsLeader}`);
        if(this.gRoleIndex == 0) {
            CacheManager.king.kingEntity = this;
        } else if(this.gRoleIndex == 1) {
            CacheManager.king.kingEntityII = this;
        } else if(this.gRoleIndex == 2) {
            CacheManager.king.kingEntityIII = this;
        }
        this._hasInit = true;
        if (this.gIsLeader) {
            if(ControllerManager.scene.sceneState == SceneStateEnum.AllReady) {
                Log.trace(Log.RPG,"场景已准备就绪，派发SceneMapUpdated")
                EventManager.dispatch(UIEventEnum.SceneMapUpdated);
            }
        }
        this.checkDeath();
        EventManager.dispatch(NetEventEnum.entityInfoMyselfUpdate);
        
    }

    public initRoleLeader():void {
        this.gIsLeader = CacheManager.king.isLeaderRole(this.gRoleIndex);
        this.initComponent();
        if (this.gIsLeader) {
            CacheManager.king.setLeaderEntity(this);
        }
    }

    protected initComponent():void {
        if (this._hasInit) {
            // for (let componentName in this._components) {//显示模型组件不重新创建
            //     if (componentName != ComponentType.Avatar
            //         && componentName != ComponentType.AvatarSkill
            //         && componentName != ComponentType.AvatarWeapon
            //         && componentName != ComponentType.AvatarSprite 
            //         && componentName != ComponentType.Head
            //         && componentName != ComponentType.Buff
            //         && componentName != ComponentType.SkillTalk){
            //         this.removeComponent(componentName);
            //     }
            // }
            this.addOrRemoveCamera(false);
            this.removeComponent(ComponentType.Sort);
            this.removeComponent(ComponentType.MainControl);
            this.removeComponent(ComponentType.OtherControl);
            this.removeComponent(ComponentType.Follow2);
            this.removeComponent(ComponentType.AutoFight);
            this.removeComponent(ComponentType.Move);
        }
        else {
            this.addComponent(ComponentType.Avatar);
            this.addComponent(ComponentType.AvatarWeapon);
            if(!this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowWing]) this.addComponent(ComponentType.AvatarWing);
            if(!this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowShapeSpirit])this.addComponent(ComponentType.AvatarSpirit);
            this.addComponent(ComponentType.AvatarLaw);
            this.addComponent(ComponentType.Head);
            this.addComponent(ComponentType.Buff);
            this.addComponent(ComponentType.SkillTalk);
            this.addComponent(ComponentType.Ancient);
            this.addComponent(ComponentType.AvatarMount);
            this.addComponent(ComponentType.AvatarSwordPool);
            this.addSkillComponent();
        }
        if (this.gIsLeader) {
            this.initLeaderRoleComponent();
        } else {
            this.initRoleComponent();
        }
        this.addComponent(ComponentType.Move);//最后加移动组件，move依赖control组件
        this.updateTitle();
        this.addUpDownTween();
    }

    private initLeaderRoleComponent():void {
        this.addComponent(ComponentType.MainControl);
        this.addOrRemoveCamera(true);
        this.addComponent(ComponentType.Sort);
        // this.setJumpData();
        this._controlComponent = <ControlComponent>this.getComponent(ComponentType.MainControl);
    }

    private initRoleComponent():void {
        this.addComponent(ComponentType.OtherControl);
        this.addComponent(ComponentType.Follow2);
        this.addComponent(ComponentType.AutoFight);
        this.setInCamera(true);
        this.setFollowEntity(CacheManager.king.leaderEntity);
        this._controlComponent = <ControlComponent>this.getComponent(ComponentType.OtherControl);
    }

    private addSkillComponent():void {
        if(!this.entityInfo || CareerUtil.getBaseCareer(this.entityInfo.career_SH) != 1) {
            return;
        }
        this.addComponent(ComponentType.AvatarSkill);
    }

    private addOrRemoveCamera(isAdd:boolean):void {
        if (isAdd) {
            if (!this.hasInit || !KingCache.isSpecifyZeroRole2()) {
                this.addComponent(ComponentType.Camera);
            }
        } else {
            if (this.hasInit && !KingCache.isSpecifyZeroRole2()) {
                this.removeComponent(ComponentType.Camera);
            }
        }
    }

    public setFollowEntity(entity:RpgGameObject):void {
        let followComp:FollowComponent2 = this.getComponent(ComponentType.Follow2) as FollowComponent2;
        followComp && followComp.setFollowEntity(entity, true);
    }

    public updateTitle():void {
        let head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(head) head.updateTitle();
    }

    public updateName():void {
        let head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(head) head.updateName();
    }

    public get titlePath():string {
        if(this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowTitle] == 1 ||
            CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideTitle])) return "";

        // let titleCode:string;
        // if (this.gRoleIndex == 0) {
        //     let useTitle:any = CacheManager.title.useTitle;
        //     if(!useTitle) return "";
        //     titleCode = useTitle.titleCode_I;
        // } else {
        //     let mainTitleIdx:number = this.entityInfo.titles.key_I.indexOf(EEntityAttribute.EAttributeTitleMain);
        //     if(mainTitleIdx == -1) return "";
        //     titleCode = this.entityInfo.titles.value_S[mainTitleIdx];
        // }
        // if(!titleCode || titleCode == "") return "";

        let useTitle:any = CacheManager.title.getUseTitle(this.roleIndex);
        if(!useTitle) return "";
        let titleCfg:any = ConfigManager.title.getByPk(Number(useTitle.titleCode_I));
        if(!titleCfg || !titleCfg.icon || titleCfg.icon == "") return "";
        return ResourcePathUtils.getRPGGame() + "title/" + titleCfg.icon;
    }   

    public removeArrowComponent():void
    {
        // this.removeComponent(ComponentType.Arrow);
    }

    public goto(gotoX: number, gotoY: number, moveType:EMoveType = EMoveType.EMoveTypeNormal): boolean {
        this.moveType = moveType;
        return this.controlComponent.moveTo(gotoX, gotoY, moveType);
        /*if (this.gIsLeader) {
            this.gameView && this.gameView.showClickPointMc(gotoX,gotoY);
        }*/
    }

    public showHpChange(changeHp: number, fromEntity:any,hurtType: EHurtType = EHurtType.EHurtTypeNormal,fightEntity:RpgGameObject = null):void
    {
        if(changeHp > 0 && fightEntity && fightEntity.entityInfo) {
            if(!this.isDead()) {
                CacheManager.map.addFightPlayerId(fightEntity.entityInfo.entityId);
            }
        }
        if(!this.gameView) return;
        if(changeHp > 0)
        {
            let _text:RpgText = this.createHpText2("-" + changeHp,FontType.PLAYER_LOSE_HP);
            _text.scaleX = _text.scaleY = 0.6;

            let _flyX:number = _text.x + Math.random()*20;
            let _flyY:number = _text.y - 100 + Math.random()*20;
            egret.Tween.get(_text)
                .to({scaleX:0.4,scaleY:0.4},200).to({scaleX:0.6,scaleY:0.6},200)
                .to({scaleX:0.5,scaleY:0.5},200).to({scaleX:0.6,scaleY:0.6},200);

            let _waitTime:number = Math.random()*100;
            egret.Tween.get(_text).wait(_waitTime).to({y:_flyY,x:_flyX}, 400).wait(400)
                .to({y:_flyY - 60},300)
                .to({alpha: 0 },900)
                .call(this.removeHpText2, this, [_text]);
        }
        let specialStr:string = "";
        // this.joukHurt();
        if(hurtType == EHurtType.EHurtTypeJouk)
        {
            specialStr = "闪";
        }
        else if(hurtType == EHurtType.EHurtTypeSuck)
        {
            specialStr = "吸";
        }
        else if(hurtType == EHurtType.EHurtTypeInvincible)
        {
            specialStr = "敌";
        }
        if(specialStr != "")
        {
            this.specialHurt(specialStr);
        }
    }

    /**闪避飘字 */
    private specialHurt(str:string):void
    {
        let _text: RpgText = this.createHpText2(str, FontType.FIGHT_SPECIAL);
        _text.x = this.x + 100;
        _text.y = this.y - 50;
        _text.scaleX = _text.scaleY = 0.1;
        let _flyX:number = _text.x - 50;
        let _flyY:number = _text.y - 90;
        egret.Tween.get(_text).to({y:_flyY,scaleX:0.8,scaleY:0.8},800,egret.Ease.circOut)
            .wait(300).to({y:_flyY - 40,alpha:0},400).call(this.removeHpText2, this, [_text]);
        egret.Tween.get(_text).to({x:_flyX},800);
        // .wait(300).to({alpha:0},400);
    }

    /**检测主角死亡状态*/
    public checkDeath(): void {
        if (this.entityInfo) {
            let updateModel:boolean = false;
            if (this.entityInfo.life_L64 <= 0) {
                this.death();
                updateModel = true;
            }
            else if (this.action == Action.Die) {
                //复活
                this.revive();
                updateModel = true;
            }
            if(updateModel) {
                this.updateAvatarModel(EEntityAttribute.EAttributeShapeSwordPool);
                this.updateAvatarModel(EEntityAttribute.EAttributeShapeLaw);
            }
        }
    }

    public death(): void {
        super.death();
        this.path = null;
        this.battleObj = null;
        this.stopMainCtrl();
        EventManager.dispatch(NetEventEnum.kingDie,this.roleIndex);//角色死亡在这里发事件
    }

    public revive():void {
        super.revive();
        this.restartMainCtrl();
        if (this.isLeaderRole) {
            CacheManager.battle.revivalWait(500);
        }
    }

    public stopMainCtrl():void{
        this.battleObj = null;
        this.controlComponent && this.controlComponent.stop();
    }

    public restartMainCtrl():void{
        this.path = null;
        this.controlComponent.entity = this;
        this.controlComponent.start();
    }

    public get mcName():string
    {
        let modelId:number = this.entityInfo.getModelId(EEntityAttribute.EAttributeClothes);
        return modelId + "/" + modelId;
    }
    
    public moveToServerPoint(serverPointX: number, serverPointY: number, moveType: EMoveType): void {
        this.controlComponent.setLastNode(serverPointX, serverPointY);
        super.moveToServerPoint(serverPointX, serverPointY, moveType);//console.log("moveTo:", this.roleIndex, serverPointX, serverPointY);
    }

    public stopMove(syncNode:boolean = true):void {
        //Log.trace(Log.FIGHT, "stopMove");
        this.path = null;
        let lastNode:egret.Point;
        if (syncNode &&
            (this.action == Action.Rush
            || ((lastNode = this.controlComponent.lastNode)
            && (this.gridPoint.equals(lastNode) == false || lastNode.x != this.col || lastNode.y != this.row)))
        )
        {//冲刺时被停止/服务器同步格子与当前格子不一致时
            // Log.trace(Log.FIGHT, "node=", this.mainControlComponent.lastNode.x, this.mainControlComponent.lastNode.y, "colrow=", this.col, this.row, "grid=", this.gridPoint.x, this.gridPoint.y)
            this.controlComponent.moveNode2Server(this.gridPoint.x, this.gridPoint.y, MoveComponent.getMoveType(this.action));
            this.entityInfo.col = this.gridPoint.x;
            this.entityInfo.row = this.gridPoint.y;
        }
        this.playStand();
    }

    protected onSceneJumpComplete():void
    {
        CacheManager.battle.resetRushTime();
        super.onSceneJumpComplete();
        if (this.isLeaderRole) {//当前只发送主控制角色的跳跃结束事件
            Log.trace(Log.JUMP, "主角跳跃结束");
            EventManager.dispatch(LocalEventEnum.RoleJumpComplete, this.roleIndex);
        }
    }

    public isDead():boolean
    {
        return !this.entityInfo || this.entityInfo.life_L64 <= 0 || super.isDead();
    }

    public clearActionTimeOut():void {
        if(this.avatar) {
            this.avatar.clearActionTimeOut();
        }
    }

    public getPathNodesInSameMap(gridX: number, gridY: number): PathNode[] {
        let p: egret.Point = RpgGameUtils.convertCellToXY(gridX, gridY);
        return this.controlComponent.normalPathNodes(p.x, p.y);
    }

    public startCollect(entity:RpgGameObject):void
    {
        if(this.currentState == EntityModelStatus.Collection) return;
        this.currentState = EntityModelStatus.Collection;
        CacheManager.king.stopKingEntity();
        let sEntityId:any = entity.entityInfo.entityId;
        EventManager.dispatch(LocalEventEnum.SceneBeginCollect, sEntityId);
    }

    public talk(content:string,time:number):void
    {
        let _talkCom:SkillTalkComponent = this.getComponent(ComponentType.SkillTalk) as SkillTalkComponent;
        _talkCom && _talkCom.talk(content);
    }

    public set currentState(value:string)
    {
        if(this.gCurrentState == value) return;
        if(this.gCurrentState == EntityModelStatus.Collection && value != EntityModelStatus.Collection) {
            // this.stopCollect();
            EventManager.dispatch(LocalEventEnum.SceneAbortCollect);
        }
        if(this.gCurrentState == EntityModelStatus.ScaleTween && value != EntityModelStatus.Stand) return;
        if(this.gCurrentState == EntityModelStatus.ScaleTween || value == EntityModelStatus.ScaleTween) {
            this.path = null;
        }
        this.gCurrentState = value;
    }

    public get currentState():string{
        return this.gCurrentState;
    }

    public updateStatus():void {
        if(this.entityInfo.status_BY != EMoveStatus.EMoveStatusCollect && this.currentState == EntityModelStatus.Collection) {
            this.currentState = EntityModelStatus.Stand;
        }
    }


    /**
     * 采集中
     */
    public isCollecting():boolean
    {
        return this.currentState == EntityModelStatus.Collection;
    }

    public showTween():void
    {
        if(this.currentState != EntityModelStatus.ScaleTween) return;
        let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarComponent) return;

        let _tweenLayer:egret.Sprite = this.changeParent(_avatarComponent.mainLayer);
        egret.Tween.removeTweens(_tweenLayer);
        _tweenLayer.scaleY = _tweenLayer.scaleX = 0.1;
        _avatarComponent.mainLayer.alpha = 1;
        _tweenLayer.alpha = 0;
        let _time:number = 1200;
        if(this.isCopyTween) 
        {
            this.isCopyTween = false;
            _tweenLayer.y = this.y - 380 - 125;
            this.showHeadEffect();
            egret.Tween.get(_tweenLayer).wait(200).to({y:this.y - 125},_time,egret.Ease.circOut);
        }
        else
        {
            this.showFootEffect();
        }
        egret.Tween.get(_tweenLayer).wait(200).to({scaleX:1,scaleY:1,alpha:1},_time,egret.Ease.circOut)
        .call(function(){
            _avatarComponent.mainLayer.x = this.x;
            _avatarComponent.mainLayer.y = this.y;
            _avatarComponent.mainLayer.alpha = _tweenLayer.alpha = 1;
            this.gameView.getGameObjcetLayer().addChild(_avatarComponent.mainLayer);
            this.currentState = EntityModelStatus.Stand;
            if(ControllerManager.scene.sceneReady) {
                Log.trace(Log.RPG,"场景已准备就绪，派发SceneMapUpdated")
                EventManager.dispatch(UIEventEnum.SceneMapUpdated);
            }
            this.removeHeadEffect();
        },this);
    }

    public hideTween(complete:Function,caller:any):void
    {
        if(this.currentState == EntityModelStatus.ScaleTween) return;
        let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarComponent) return;
        this.currentState = EntityModelStatus.ScaleTween;
        let _tweenLayer:egret.Sprite = this.changeParent(_avatarComponent.mainLayer);
        egret.Tween.removeTweens(_tweenLayer);
        egret.Tween.get(_tweenLayer).to({scaleX:0,scaleY:0,alpha:0},1200,egret.Ease.circOut)
        .call(function (){
            if(complete) complete.call(caller);
            _avatarComponent.mainLayer.x = this.x;
            _avatarComponent.mainLayer.y = this.y;
            _avatarComponent.mainLayer.alpha = 0;
            this.gameView.getGameObjcetLayer().addChild(_avatarComponent.mainLayer);
        },this);
    }

    public hideCopyTween(complete:Function,caller:any):void
    {
        if(this.currentState == EntityModelStatus.ScaleTween) return;
        let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarComponent) return;
        this.isCopyTween = true;
        
        this.currentState = EntityModelStatus.ScaleTween;
        let _tweenLayer:egret.Sprite = this.changeParent(_avatarComponent.mainLayer);
        egret.Tween.removeTweens(_tweenLayer);
        this.showHeadEffect();
        let _posY:number = this.y - 380;
        egret.Tween.get(_tweenLayer).wait(200).to({y:_posY,scaleX:0,scaleY:0,alpha:0},1200,egret.Ease.circOut)
        .call(function(){
            if(complete) complete.call(caller);
            this.removeHeadEffect();
            _avatarComponent.mainLayer.x = this.x;
            _avatarComponent.mainLayer.y = this.y;
            _avatarComponent.mainLayer.alpha = 0;
            this.gameView.getGameObjcetLayer().addChild(_avatarComponent.mainLayer);
        },this);
    }

    /**暂时改变mainLayer父容器 */
    private changeParent(mainLayer:egret.DisplayObjectContainer):egret.Sprite
    {
        let _tweenLayer:egret.Sprite = this.gameView.getGameTweenLayer();
        _tweenLayer.x = this.x;
        _tweenLayer.y = this.y - 125;
        mainLayer.x = 250;
        mainLayer.y = 375;
        _tweenLayer.addChild(mainLayer);
        _tweenLayer.scaleX = _tweenLayer.scaleY = 1;
        _tweenLayer.alpha = 1;
        return _tweenLayer;
    }

    /**进出副本头顶法宝特效 */
    private showHeadEffect():void
    {
        let _posY:number = this.y - 300;
        if(!this.tweenEffect)
        {
            this.tweenEffect = ObjectPool.pop("MovieClip");
            this.gameView.getGameEffectUpLayer().addChild(this.tweenEffect);
            this.tweenEffect.playFile(ResourcePathUtils.getRPGGameCommon() + "enter_copy",-1, ELoaderPriority.UI_EFFECT);
        }
        egret.Tween.removeTweens(this.tweenEffect);
        this.tweenEffect.x = this.x;
        this.tweenEffect.y = _posY + 100;
        this.tweenEffect.alpha = 0;
        this.tweenEffect.scaleX = this.tweenEffect.scaleY = 0.1;
        egret.Tween.get(this.tweenEffect).to({scaleX:1,scaleY:1,y:_posY,alpha:1},500,egret.Ease.circOut);
    }

    private removeHeadEffect():void
    {
        if(this.tweenEffect)
        {
            this.tweenEffect.destroy();
            this.tweenEffect = null;
        }
    }

    /**
     * 进出传送阵脚底特效
     */
    private showFootEffect():void
    {
        let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarComponent) return;
        let _effect:MovieClip = ObjectPool.pop("MovieClip");
        _effect.x = this.x;
        _effect.y = this.y;
        this.gameView.getGameGroundLayer().addChild(_effect);
        _effect.playFile(ResourcePathUtils.getRPGGameCommon() + "pass_effect",1, ELoaderPriority.UI_EFFECT, function(){
            _effect.destroy();
            _effect = null;
        });
    }

    /**公有掉落拾取 */
    public pickUpDrop(entityIds:any[] = null):void
    {
        let _entityId:any[];
        if(entityIds) {
            _entityId = entityIds;
        }
        else {
            _entityId = this.getCanDropEntity(true);
        }
        if(_entityId && _entityId.length > 0)
        {
            this.sendPickUp(_entityId);
        }
    }

    //私有掉落拾取
    public pickUpPrivateDrop():void
    {
        let _entity:any[] = this.getCanDropEntity();
        if(!_entity) return;
        for(let i:number = 0; i < _entity.length; i++)
        {
            (_entity[i] as DropEntity).pickUpDestory();
            _entity[i] = null;
        }
        _entity = null;
    }

    /**
     * 获取可拾取的掉落entityId 
     * @param hasSprite 是否小助手拾取
     * @param isPublic 是否拾取公有掉落
     */
    private getCanDropEntity(isPublic:boolean = false):any[]
    {
        let _drops:RpgGameObject[] = CacheManager.map.privateDrops;
        if(isPublic)
        {
           _drops = CacheManager.map.publicDrops;
        }
        let _entityIds:any[] = [];
        for(let i:number = 0 ; i < _drops.length; i++)
        {
            /**服务器拾取上限一次最多5个 */
            if(_entityIds.length >= 5 && isPublic) break;
            if(!_drops[i].canPickUp) continue;
            if(isPublic)
            {
                //没佩戴小助手，一次捡一个
                if(!this.hasSprite && _entityIds.length > 0) break;
                //公有掉落取实体对象的entityId发送给服务端
                _drops[i].isPickUp = true;
                _entityIds.push(_drops[i].entityInfo.entityId);
            }
            else
            {
                /**私有掉落直接取实体对象客户端做表现 */
                _entityIds.push(_drops[i]);
            }
        }
        return _entityIds;
    }


    private sendPickUp(drop:any[]):void
    {
        let msg: any = {};
        msg.cmd = "ECmdGamePickUpDropItem";
        msg.body = {
            "dropEntityIds": {data:drop},
            "bySelf": !this.hasSprite,
        };
        App.Socket.send(msg); //发送
    }

    public updateTaskArrow():void
    {
        // let _arrowCom:ArrowComponent = this.getComponent(ComponentType.Arrow) as ArrowComponent;
        // if(_arrowCom) _arrowCom.updateTargetPos();
    }

    /**是否装备了小助手 */
    public get hasSprite():boolean
    {
        let _spriteId:number = this.entityInfo.getModelId(EEntityAttribute.EAttributeSpirit);
        return _spriteId && _spriteId == 500001;
    }

    public get roleIndex():number
    {
        return this.gRoleIndex;
    }

    public get isLeaderRole():boolean {
        return this.gIsLeader;
    }

}