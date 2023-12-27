/**玩家实体Avatar */
class AvatarComponent extends AvatarMcComponent {
    /** 战士普攻动作序列*/
    private static CAREER1_NORMAL_ACTIONS: number[];
    private static AvatarLayerIndex: number[]   = [0,0,1,1,1,1,1,0];
    private static WeaponLayerIndex: number[]   = [1,1,2,2,2,2,2,1];
    private static WingLayerIndex: number[]     = [2,2,0,0,0,0,0,2];
    private static AvatarLayerIndex2: number[]  = [0,0,1,1,1,1,1,0];
    private static WeaponLayerIndex2: number[]  = [1,1,2,2,2,2,2,1];
    private static WingLayerIndex2: number[]    = [2,2,0,0,0,0,0,2];
    private attackNO: number = 0;
    private attackNOIdx: number = 0;
    private attackSpecifiedNO: number = 0;
    private attackDaoguang:boolean;

    private jumpNO: number = 1;

    private attachedList: { [key: string]: AvatarPartComponent; };    // 挂载组件
    private indexArr:{[type:string]:number[]};

    /** 当前残影集合 */
    private gShadowDic: Array<any> = [];
    /** 残影创建间隔（帧） */
    private gShadowDelay: number = 0;
    private updateCount:number = 0;
    private attackNumber:number;
    private lastPlaySoundTime:number = 0;

    public constructor() {
        super();
        this.attachedList = {};
        this.indexArr = {};
        AvatarComponent.CAREER1_NORMAL_ACTIONS = CacheManager.battle.getCareerActions(1);
    }

    public start(): void {
        this.indexArr[ComponentType.Avatar] = AvatarComponent.AvatarLayerIndex;
        if (this.entity && this.entity.entityInfo) {
            let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
            // if(baseCareer == 4 || baseCareer == 2) {//法师、道士
            if(baseCareer == 4) {//法师、道士
                this.indexArr[ComponentType.Avatar] = AvatarComponent.AvatarLayerIndex2;
            }
        }
        super.start();
        this.handleBodyHierarchy();
    }

    public update(advancedTime: number): void 
    {
        super.update(advancedTime);
        this.updateCount++;
        this.setPhantom();
        this.playSound();
        // this.mc.runAction(advancedTime);
    }

    public setWeapon(weapon: AvatarWeaponComponent): void {
        this.attach(ComponentType.AvatarWeapon, weapon);
        // this.weapon = weapon;
    }

    public setWing(wing: AvatarWingComponent): void {
        this.attach(ComponentType.AvatarWing, wing);
        // this.wing = wing;
    }

    public setSkill(skill: AvatarSkillComponent): void {
        this.attach(ComponentType.AvatarSkill, skill);
        // this.skill = skill;
    }
    public setMount(mount:AvatarMountComponent):void
    {
        this.attach(ComponentType.AvatarMount,mount);
    }

    public attach(type: string, comp: AvatarPartComponent): void {
        this.attachedList[type] = comp;
        if(!comp) 
        {
            delete this.indexArr[type];
            return;
        }
        let _index:number[];
        let _isNewLayerIndex:boolean = true;
        if (this.entity && this.entity.entityInfo) {
            let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
            // if(baseCareer == 4 || baseCareer == 2) {//法师、道士
            if(baseCareer == 4) {//法师、道士
                _isNewLayerIndex = false;
            }
        }

        switch(type)
        {     //Avatar = [0,0,2,2,2,2,2,0];
            case ComponentType.AvatarWeapon:
                _index = _isNewLayerIndex ? AvatarComponent.WeaponLayerIndex : AvatarComponent.WeaponLayerIndex2;
                break;
            case ComponentType.AvatarWing:
                _index = _isNewLayerIndex ? AvatarComponent.WingLayerIndex : AvatarComponent.WingLayerIndex2;
                break;
        }
        if(_index) this.indexArr[type] = _index;
    }

    protected handleGotoAction(): void 
    {
        let self = this;
        let action:string = self.entity.action;
        let dir:Dir = self.entity.dir;

        if (action == Action.Attack) {
            this.attackNumber = self.getAttackNO();
        } else if (action == Action.Jump) {
            this.attackNumber = self.getJumpNO();
        } else {
            this.attackNumber = 0;
        }

        //战士连贯测试
        if(this.entity.objType == RpgObjectType.MainPlayer && this.entity.entityCareer == ECareer.ECareerWarrior) {
            if (action == Action.Stand && CacheManager.king.isAutoFighting 
                && this.entity.battleObj && !this.entity.battleObj.isDead() && CacheManager.battle.nextAttack
                && this.entity.lastAction == Action.Attack) {
                    this.bodyMc.setCurrAction(Action.Stand);
                    CacheManager.battle.nextAttack = false;
                    return;
            }
            CacheManager.battle.nextAttack = false;
        }
        self.playAction(action,dir,this.attackNumber);
        this.updateOtherComponent();
    }

    protected playStand():void {
        super.playStand();
        // this.updateOtherComponent();
    }

    public updateOtherComponent():void {
        let self = this;
        let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
        let action:string = self.entity.action;
        //部分动作隐藏部件
        self.setPartCompontVisible([ComponentType.AvatarWeapon, ComponentType.AvatarWing], !Action.isActionNoPlayPart(action));
        //冲刺动作暂时只有人物模型和坐骑才需要
        for (let key in self.attachedList) {
            let comp = self.attachedList[key];
            if(comp==null) continue;
            if((key == ComponentType.AvatarWing || key == ComponentType.AvatarWeapon) && !comp.movieClip.visible) continue;
            if(key == ComponentType.AvatarSkill && !self.canPlayDaoguang())  {
                if(comp.movieClip) comp.movieClip.visible = false;
                continue;
            }
            if(comp.movieClip && comp.movieClip.parent)
            {
                comp.playAction(action, self.entity.dir, null, this.attackNumber);
            }
        }
        self.handleBodyHierarchy();
    }

    /**
     * 设置部件的mc的visible
     */
    private setPartCompontVisible(comTypes: Array<string>, value: boolean): void {
        for (let comT of comTypes) {
            let comp = this.attachedList[comT];
            if (comp && comp.movieClip && comp.movieClip.refMovieClipData && comp.movieClip.visible != value) {
                comp.movieClip.visible = value;
            }
        }
    }

    /**
     * 更新部件显示层级
     */
    private handleBodyHierarchy(): void {
        if(!this.body.parent) return;
        for(let type in this.indexArr)
        {
            let _component:AvatarPartComponent = this.attachedList[type];
            let _movieClip:RpgMovieClip;
            let layer:egret.DisplayObjectContainer;
            if(type == ComponentType.Avatar)
            {
                _movieClip = this.bodyMc;
            }
            else if(type == ComponentType.AvatarWeapon) {
                layer = this.weaponLayer;
            }
            else if(type == ComponentType.AvatarWing) {
                layer = this.wingLayer;
            }
            let _index:number;
            if(this.entity.action != Action.Die)
            {
                _index = this.indexArr[type][this.entity.dir];
            }
            else
            {
                //死亡无视方向，固定最上，人物中间，武器最下
                if(type == ComponentType.AvatarWing) _index = 2;
                if(type == ComponentType.Avatar) _index = 1;
                if(type == ComponentType.AvatarWeapon) _index = 0;
            }
            if(_movieClip) {
                this.body.setChildIndex(_movieClip,_index);
            }
            else {
                this.body.setChildIndex(layer,_index);
            }
        }
    }

    /** 播放攻击 */
    public playAttack(skillId: number, targetObject: RpgGameObject): void 
    {
        if(this.entity.objType == RpgObjectType.MainPlayer) {
            EventManager.dispatch(UIEventEnum.HomeSwitchMount,MountEnum.DownMount);
        }
        this.setSpecifiedAttackNO(skillId);
        if(this.attackSpecifiedNO == -1) return;
        super.playAttack(skillId,targetObject);
    }

    private playSound():void
    {
        let now:number = egret.getTimer();
        if (this.entity.isLeaderRole
            && (this.entity.action == Action.Move)
            && now - this.lastPlaySoundTime > 350)
        {
            this.lastPlaySoundTime = now;
            App.SoundManager.playEffect(SoundName.Effect_Run);
        }
    }

    private setSpecifiedAttackNO(skillId:number):void
    {
        this.attackSpecifiedNO = 0;
        let skill:any = ConfigManager.skill.getSkill(skillId);
        if (skill)
        {
            if(skill.useType > 0) {
                //非主动技能 不播攻击动作
                this.attackSpecifiedNO = -1;
                return;
            }
            this.attackSpecifiedNO = skill.skillAction ? skill.skillAction : 0;
            if (skill.skillId == 9999) { //必杀的动作特殊处理
                if (this.entity && this.entity.entityInfo) {
                    let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
                    if(baseCareer == 4 || baseCareer == 2) {
                        //法师、道士 攻击1对应翅膀动作6 攻击2对应翅膀动作5，必杀的话，都是对应5
                        this.attackSpecifiedNO = 5;
                    }
                }
            }
            this.attackDaoguang = skill.noDaoguang == undefined;
        }
        else if(skillId != 0){
            //skillId 为0是循环播放攻击动作
            this.attackSpecifiedNO = -1;
        }
    }

    protected getAttackNO(): number {
        if (this.entity.objType != RpgObjectType.MainPlayer && this.entity.objType != RpgObjectType.OtherPlayer) return 0;
        if (this.attackSpecifiedNO > 0) return this.attackSpecifiedNO;

        let careerAttackNO: number;
        let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
        if (baseCareer == 1) {
            careerAttackNO = AvatarComponent.CAREER1_NORMAL_ACTIONS.length;
            if(this.attackNO == careerAttackNO) {
                this.attackNO = 0;
            }
            let attNO:number = AvatarComponent.CAREER1_NORMAL_ACTIONS[this.attackNO];
            this.attackNO++;
            return attNO;
        }
        else {
            careerAttackNO = 6;
            if(this.attackNO == 6 || this.attackNO == 0) {
                this.attackNO = 4;
            }
        }
        if (this.attackNO < careerAttackNO) {
            this.attackNO ++;
        }
        return this.attackNO;
    }

    private canPlayDaoguang():boolean
    {
        return this.attackDaoguang
            && (this.entity.isLeaderRole
            || !CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOtherEffect])) &&!CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideEffect]) ;
    }

    protected getJumpNO(): number {
        if (this.jumpNO < 3) {
            this.jumpNO++;
        } else {
            this.jumpNO = 1;
        }
        return this.jumpNO;
    }

    public setJumpNO(no: number): void {
        if (no > 0 && no < 4)
            this.jumpNO = no - 1;
    }

    private setPhantom(): void 
    {
        let action:string = this.entity.action;
        if (action != Action.Rush && action != Action.Jump/*|| this.updateCount % 2 != 0*/) return;
        this.createPhantom(CacheManager.battle.battle_config.RushPhantomTime, action == Action.Rush ? 1 : 2, false, CacheManager.battle.battle_config.RushPhantomDelay);
    }

    /**
     * 产生残影函数.
     * **/
    private createPhantom(cusTweenTime: number, cusFilterType: number = 1, cusDraw: Boolean = false, cusDelay: number = 6): void {
        if (this.entity == null || this.bodyMc == null || this.bodyMc.stage == null || this.bodyMc.visible == false || this.bodyMc.movieClipData == null) {
            return;
        }
        /*if (this.bodyMc.getCurrAction() != Action.Rush) {
            return;
        }*/
        this.gShadowDelay++;
        if ((this.gShadowDelay % cusDelay) != 0 && cusDraw == false) {
            return;
        }
        let _shadow: egret.Bitmap = this.createBitmap(this.bodyMc);
        if (null == _shadow) {
            return;
        }
        if (!this.gShadowDic) {
            this.gShadowDic = [];
        }
        this.gShadowDic.push(_shadow);

        this.entity.gameView.getGameEffectUpLayer().addChild(_shadow);
        let beginAlpha:number = cusFilterType == 1 ? 1 : 0.8;
        egret.Tween.get(_shadow).to({alpha: beginAlpha}, 120).to({ alpha: 0 }, cusTweenTime).call(this.onShadowPlayComplete, this, [_shadow]);
    }

    /**
     * 单独影子生命周期到了，alpha减少为0了.
     * **/
    private onShadowPlayComplete(copyShadow: egret.Bitmap): void {
        this.removePhantom(copyShadow);
    }

    /**
     * 释放影子，存放到对象池.
     */
    private removePhantom(cusPhantom: egret.Bitmap): void {
        if (!cusPhantom) return;

        App.DisplayUtils.removeFromParent(cusPhantom);
        cusPhantom.x = 0;
        cusPhantom.y = 0;
        // AnchorUtil.setAnchorX(cusPhantom, 0);
        // AnchorUtil.setAnchorY(cusPhantom, 0);
        cusPhantom.scaleX = 1;
        cusPhantom.scaleY = 1;
        cusPhantom.filters = null;
        cusPhantom.alpha = 1;
        cusPhantom.$bitmapData = null;
        cusPhantom.texture = null;
        egret.Tween.removeTweens(cusPhantom);
        if (this.gShadowDic)
            App.ArrayUtils.remove(this.gShadowDic, cusPhantom);
        ObjectPool.push(cusPhantom);
    }

    /**
     * 进行快照
     * **/
    private createBitmap(cusSource: RpgMovieClip): egret.Bitmap {
        let _bitmap: egret.Bitmap = ObjectPool.pop("egret.Bitmap");
        if (cusSource == null || cusSource.movieClipData == null || cusSource.movieClipData.mcData == null || cusSource.movieClipData.numFrames < 1) {
            return null;
        }

        let frame:any = cusSource.movieClipData.frames[cusSource.currentFrame - 1];
        if (!frame) return null;

        _bitmap.texture = cusSource.movieClipData.getTextureByFrame(cusSource.currentFrame);
        _bitmap.scaleX = cusSource.scaleX;
        _bitmap.scaleY = cusSource.scaleY;

        // AnchorUtil.setAnchorX(_bitmap, 0.5);
        // AnchorUtil.setAnchorY(_bitmap, 0.5);
        _bitmap.x = this.mainLayer.x;
        _bitmap.x -= _bitmap.texture.textureWidth/2;
        _bitmap.y = this.mainLayer.y + this.bodyAll.y;
        if (this.entity.dir == Dir.Right) {
            _bitmap.y -= _bitmap.texture.textureHeight;
        } else if (this.entity.dir == Dir.Left) {
            _bitmap.x += _bitmap.texture.textureWidth;
            _bitmap.y -= _bitmap.texture.textureHeight;
        } else if (this.entity.dir == Dir.TopRight || this.entity.dir == Dir.BottomRight) {
            _bitmap.y -= _bitmap.texture.textureHeight;
        } else if (this.entity.dir == Dir.TopLeft) {
            _bitmap.x += _bitmap.texture.textureWidth;
            _bitmap.y -= _bitmap.texture.textureHeight;
        } else if (this.entity.dir == Dir.BottomLeft) {
            _bitmap.x += _bitmap.texture.textureWidth;
            _bitmap.y -= _bitmap.texture.textureHeight;
        } else {
            _bitmap.y -= _bitmap.texture.textureHeight/2;
        }
        // _bitmap.filters = AvatarComponent.blurFliter;
        _bitmap.alpha = 0;
        return _bitmap;
    }

    /**
     * 释放当前所有影子
     */
    private removeAllPhantom(): void {
        if (this.gShadowDic) {
            let arrLen: number = this.gShadowDic.length;
            for (let i = 0; i < arrLen; i++) {
                this.removePhantom(this.gShadowDic[i]);
            }
        }
        this.gShadowDic = null;
    }

    /**
     * 更新模型资源（资源有变动才调用）
     */
    public updateBody(needUpdate:boolean = false):void
    {
        if(!this.entity.entityInfo) return;
        if(!Action.isLoopAction(this.entity.action)) {
            //非站立和移动状态不更换模型，等当前动作播放结束再更新最新模型
            this.needUpdateBody = true;
            if(!this.bodyMc.resID) {
                this.bodyMc.setData(this.entity.mcPath, this.entity.mcName, AvatarType.Player, LoaderPriority.getPriority(this.entity, ComponentType.AvatarMc), this.ResType);
            }
            return;
        }
        let _action:string = this.entity.action;

        this.bodyMc.setData(this.entity.mcPath, this.entity.mcName, AvatarType.Player, LoaderPriority.getPriority(this.entity, ComponentType.AvatarMc), this.ResType);
        this.bodyMc.mountState = this.entity.isOnMount;
        this.bodyMc.lawState = this.entity.isOnLaw;
        let _layer:number = this.getIndexLayer(ComponentType.Avatar);
        this.body.addChildAt(this.bodyMc,_layer);
        if(needUpdate) this.bodyMc.gotoAction(_action, this.entity.dir);
        this.updateBodyAllPos();
        this.updateOtherComponent();
    }

    public updateBodyAllPos():void {
        let _action:string = this.entity.action;
        if(this.entity.isOnMount && _action != Action.Attack && _action != Action.Die && _action != Action.Jump) {
            this.bodyAll.y = -100;
        }
        else {
            this.bodyAll.y = 0;
        }
    }

    public getIndexLayer(comType:string,dir:number = -1):number
    {
        if(dir == -1) dir = this.entity.dir;
        if(this.indexArr[comType]) return this.indexArr[comType][dir];
        return 0;
    }

    public get bodyAttackNum():number {
        return this.attackNumber;
    }

    public stop(): void 
    {
        super.stop();
        this.indexArr = {};
        this.attachedList = {};
		this.attackNO = 0;
        this.attackNOIdx = 0;
		this.attackSpecifiedNO = 0;
		this.attackDaoguang = false;
        this.removeAllPhantom();
        this.updateCount = 0;
        this.lastPlaySoundTime = 0;
        this.attackNumber = 0;
    }

}