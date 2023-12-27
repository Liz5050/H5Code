
class RpgMonster extends RpgGameObject {
    // private static highLightFilter1 = [new egret.ColorMatrixFilter(
    //     [0.3, 0, 0, 0, 209,
    //         0, 0.3, 0, 0, 180,
    //         0, 0, 0.3, 0, 97,
    //         0, 0, 0, 1, 0])];
    // private static highLightFilter2 = [new egret.ColorMatrixFilter(
    //     [0.3, 0, 0, 0, 87,
    //         0, 0.3, 0, 0, 114,
    //         0, 0, 0.3, 0, 192,
    //         0, 0, 0, 1, 0])];
    private static globalPt:egret.Point = new egret.Point();
    private static highLightFilter1 = [new egret.ColorMatrixFilter(
        [1, 1, 0, 0, -50,
        0.8, 1, 0, 0, -90,
        0, 0, 1, 0, -255,
        0, 0, 0, 1, 0])];
    private static highLightFilter2 = [new egret.ColorMatrixFilter(
        [1, 0, 0, 0, -255,
            0, 0.8, 1, 0, -100,
            0, 1, 1, 0, -40,
            0, 0, 0, 1, 0])];
    private static highLightFilter3 = [new egret.ColorMatrixFilter(
        [0.3, 0, 0, 0, 173,
            0, 0.3, 0, 0, 47,
            0, 0, 0.3, 0, 121,
            0, 0, 0, 1, 0])];
    /**受击高亮延迟函数索引 */
    private timeOutIndex: number = -1;
    /**死亡延迟函数索引*/
    private dieathIndex:number = -1;
    //死亡击飞高度
    private deathHight: number;
    //死亡击飞距离
    private deathDis: number;
    
    private deathOffsetX:number = NaN;
    private deathOffsetY:number = NaN;
    private _hasDeathDir:boolean = false;

    private gChangeHp:number;
    private gEffectListData:EffectListData;
    /**伤害来源 */
    private fromEntity:any;
    public isBoss:boolean;
    private beattackTime:number = 0;
    public constructor() {
        super();
        this.objType = RpgObjectType.Monster;
    }

    public init(data: EntityInfo): void {
        super.init(data);
        let _params: string[] = CacheManager.battle.battle_config.MonsterDeathParam.split(",");
        this.deathHight = Number(_params[0]);
        this.deathDis = Number(_params[1]);
        this.isBoss = EntityUtil.isBoss(this.entityInfo);
        this.addComponent(ComponentType.Aoi);
		this.addComponent(ComponentType.Move);
        if(this.isBoss || CopyUtils.isGuildDefenderEntity(data)) {
            this.addComponent(ComponentType.AvatarMc);
            this.updateLife();
        }

        // this.preLoadBossStandRes();
        this._hasInit = true;
    }

    public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (value) {
            if (this.action == Action.Die) return;
            this.addComponent(ComponentType.AvatarMc);
            this.addComponent(ComponentType.Head);
            this.addComponent(ComponentType.Buff);
            if(this.isBoss) {
                this.updateLife();
            }
            this.updateTitle();
            // this.addComponent(ComponentType.Talk);
            this.updateModelIsShow();  
        } else {
            !this.isBoss && this.removeComponent(ComponentType.AvatarMc);
            this.removeComponent(ComponentType.Head);
            this.removeComponent(ComponentType.Buff);
            // this.removeComponent(ComponentType.Talk);
            if(this.gameView.getLeaderPlayer() && this.gameView.getLeaderPlayer().battleObj == this) this.gameView.getLeaderPlayer().battleObj = null;
            if (this.isDead()) {
                this.gameView.removeEntity(this);
            }
        }
    }

    public updateModelIsShow():void
    {
        //特殊怪物不能屏蔽
        if(EntityUtil.isSpecificBossType(this.entityInfo)) return;
        let _avatarComponent:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
        if(!_avatarComponent) return;
        _avatarComponent.updateModelIsShow(LocalEventEnum.HideMonster);
    }

    public showHpChange(changeHp: number, fromEntity: any, hurtType: EHurtType = EHurtType.EHurtTypeNormal): void {
        this.fromEntity = fromEntity;
        if (!this.gameView || changeHp <= 0) return;
        if(!CacheManager.map.isMapRendering) {
            this.updateLife();
            return;
        }

        let mainRoleIndex:number = EntityUtil.isMainPlayerOther(fromEntity);
        if (EntityUtil.isPlayer(fromEntity) && mainRoleIndex == -1) {
            this.updateLife();
            return;
        }
        if (fromEntity.type_BY == EEntityType.EEntityTypePlayerMirror && CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            this.updateLife();
            return;
        }
        if (mainRoleIndex >= 0 && ControllerManager.test.switchTestMonHit) {
            let careerName:string = CareerUtil.getCareerName(CacheManager.role.getEntityInfo(mainRoleIndex).career_SH);
            ControllerManager.test.roleHurts[mainRoleIndex] += changeHp;
            Log.trace(Log.TEST_MONHIT, careerName + "_" + mainRoleIndex + "对怪物id=" + this.entityInfo.id, "伤害输出hp=-" + changeHp,"总伤害：",ControllerManager.test.roleHurts[mainRoleIndex]);
        }
        //宠物判断归属自己才看得到怪物受击飘血
        if(fromEntity.type_BY == EEntityType.EEntityTypePet)
        {
            let _entity:RpgGameObject = this.gameView.getEntityObject(fromEntity);
            if(!_entity || !EntityUtil.isBelongToMine(_entity)) {
                this.updateLife();
                return;
            }
        }
        
        if(!this._fromSkillId)
        {
            this.addTween(1, 1, changeHp,fromEntity,hurtType);
            return;
        }
        else
        {
            let _skillType = ConfigManager.skill.getSkill(this._fromSkillId).skillSet;
            if(_skillType == ESkillSet.ESkillSetSpirit)
            {
                this.faBaoHurt(changeHp);
                this.attackedEffect(this._fromSkillId);
                this.updateLife();
                return;
            }
        }
        let _skillId:number = this._fromSkillId;
        if(!this.gEffectListData) this.gEffectListData = ConfigManager.skill.getSkillEffectListVo(this._fromSkillId);
        if(!this.gEffectListData) 
        {
            if(this._fromSkillId == 1001) {
                egret.setTimeout(this.addTween,this,200, 0, 1, changeHp,fromEntity,hurtType,_skillId);
            }
            else {
                this.addTween(0, 1, changeHp,fromEntity,hurtType,this._fromSkillId);
            }
            return;
        }
        //飘血次数
        let _count:number = this.gEffectListData.effectHurts == null || CacheManager.role.roles.length > 1 ? 0 : this.gEffectListData.effectHurts.length;
        if(_count > 0)
        {
            this.gChangeHp = changeHp;
            if(changeHp / _count < 1) this.gChangeHp = _count;
            for(let i:number = 0; i < _count; i++)
            {
                let _hp:number;
                if(i == _count - 1)
                {
                    _hp = this.gChangeHp;
                }
                else
                {
                    _hp = Math.round(Math.random() * (this.gChangeHp/2)) + Math.floor(this.gChangeHp * 0.1);
                    this.gChangeHp -= _hp;
                }
                let randomDelay:number = Math.random() > 0.5 ? 0 : 100;
                let _delayTime:number = this.gEffectListData.effectHurts[i] + randomDelay;
                egret.setTimeout(this.addTween,this,_delayTime, i, _count, _hp,fromEntity,hurtType,_skillId);
            }
            this.gEffectListData = null;
            this._fromSkillId = 0;
        }
        else
        {
            this.addTween(0, 1, changeHp,fromEntity,hurtType,this._fromSkillId);
        }
    }

    private addTween(hurtIndex:number, hurtCount:number, changeHp: number, fromEntity: any, hurtType: EHurtType = EHurtType.EHurtTypeNormal,skillId:number = 0):void
    {
        if(!ControllerManager.scene.sceneReady || !this.entityInfo) return;
        this.updateLife();
        // let _randomTime:number = Math.round(Math.random() * 100);
        // egret.setTimeout(function(){
        //     App.SoundManager.playEffect("monster_beAttacked_ogg");
        // },this,_randomTime)
        let _type: EEntityType = fromEntity.type_BY;
        if (_type == EEntityType.EEntityTypePet) {
            this.normalHurt("-" + changeHp, FontType.MONSTER_FORM_PET, 200);
        }
        else 
        {
            let offsetY:number = 0;
            let fontType:string = FontType.MONSTER_NORMAL1;
            if(fromEntity) {
                let roleIndex:number = EntityUtil.isMainPlayerOther(fromEntity);
                //1战士 2法师 4道士
                if(roleIndex != -1) {
                    let career:number = CacheManager.role.getRoleCareerByIndex(roleIndex);
                    career = CareerUtil.getBaseCareer(career);
                    if(career == 2) {
                        fontType = FontType.FABAO_FONT;  
                        offsetY = -50;                    
                    }
                    else if(career == 4) {
                        fontType = FontType.MONSTER_NORMAL2;
                        offsetY = 50;
                    }
                }
                else if(EntityUtil.isMainPlayerOtherMirror(fromEntity)) {
                    let _entity:RpgGameObject = this.gameView.getEntityObject(fromEntity);
                    if(!_entity || !_entity.entityInfo) return;
                    let career:number = (_entity.entityInfo).career_SH;
                    career = CareerUtil.getBaseCareer(career);
                    if(career == 2) {
                        fontType = FontType.FABAO_FONT;   
                        offsetY = -50;                   
                    }
                    else if(career == 4) {
                        fontType = FontType.MONSTER_NORMAL2;
                        offsetY = 50;
                    }
                }
                else return;
            }
            if(CacheManager.role.roles.length <= 1) offsetY = 0;
            switch (hurtType) {
                case EHurtType.EHurtTypeNormal:
                    if(skillId == 9999) {
                        fontType = FontType.XpFont;
                        this.xpHurt("" + changeHp,fontType);
                    }
                    else {
                        this.normalHurt("" + changeHp,fontType,100,offsetY);
                    }
                    break;
                case EHurtType.EHurtTypeCrit:
                    if(skillId == 9999) {
                        this.xpHurt("" + changeHp,FontType.XpFont);
                    }
                    else {
                        this.critHurt("" + changeHp,fontType,100,offsetY);
                    }
                    break;
            }
            if (changeHp > 0) 
            {
                this.attackedEffect(skillId);
                if (skillId != SkillCache.SKILLID_CHARGE)
                    this.doAttackedShake(hurtIndex, hurtCount, EntityUtil.isMainPlayerOther(fromEntity));//怪物受创抖动
            }
        }
    }

    /**法宝飘字 */
    private faBaoHurt(changeHp: number):void
    {
        if(!this.gameView) return;
        let _text: RpgText = this.createHpText2("-" + changeHp,FontType.FABAO_FONT);
        _text.scaleX = _text.scaleY = 0.9;

        let _flyX: number = _text.x + 250 * this._hpTxtFlyDir;
        let _flyY: number = _text.y + 250 * this._hpTxtFlyDirY;
        let _posX:number = _text.x + 100 * this._hpTxtFlyDir;
        let _posY:number = _text.y + 100 * this._hpTxtFlyDirY;
        egret.Tween.get(_text).to({x:_posX, y:_posY,scaleX:0.6,scaleY:0.6},500)
        .wait(200).to({x:_flyX,y:_flyY,alpha:0.3},500)
        .wait(200).call(this.removeHpText2, this, [_text]);
    }

    /**普通攻击伤害飘字 */
    // private time:number = -1;
    private normalHurt(str: string, font: string, offsetX: number = 100,offsetY:number = 0): void {
        // if(this.time > 0 && egret.getTimer() - this.time <= 16) return;
        // this.time = egret.getTimer();
        let _text:RpgText = this.createHpText2(str, font);
        _text.scaleX = _text.scaleY = 0.5;
        let _flyX: number = this.x + offsetX * this._hpTxtFlyDir;
        let checkX:number = this._hpTxtFlyDir > 0 ? _flyX + _text.width + 50 : _flyX - _text.width - 50;
        if(!RpgGameUtils.inCamera(checkX,this.y) && CacheManager.role.roles.length == 1) {
            _flyX = this.x + offsetX * (this._hpTxtFlyDir*-1);
        }
        let randomY:number = (Math.random() * 20) - 10;
        let _posY:number = this.y - 300 - randomY + offsetY;
        _text.y += offsetY;
        if(font == FontType.MONSTER_FORM_PET) {
            _posY -= 100;
            _text.y -= 100;
        }
       
        // egret.Tween.get(_text).to({ scaleX: 0.7, scaleY: 0.7 }, 100).wait(200).to({ "y": _posY - randomY}, 300,egret.Ease.circOut)
        // .to({ y: _posY + 120, alpha: 0, scaleX: 0.1, scaleY: 0.1 }, 300).call(this.removeHpText2, this, [_text]);
        // egret.Tween.get(_text).wait(300).to({ x: _flyX - (25 * this._hpTxtFlyDir) }, 400).to({ x: _flyX }, 300);

        // egret.Tween.get(_text).wait(300).to({ scaleX: 0.6, scaleY: 0.6 }, 100).to({scaleX: 0.1, scaleY: 0.1 },1500);
        // // egret.Tween.get(_text).wait(300).to({ scaleX: 0.1, scaleY: 0.1 }, 2000);
        // egret.Tween.get(_text).to({ "y": _posY - randomY }, 500).to({ y: _posY + 120, alpha: 0}, 500);
        // egret.Tween.get(_text).to({ x: _flyX - (25 * this._hpTxtFlyDir) }, 600).to({ x: _flyX }, 600).call(this.removeHpText2, this, [_text]);

        egret.Tween.get(_text).to({ scaleX: 0.8, scaleY: 0.8 }, 100).wait(150).to({ scaleX: 0.4, scaleY: 0.4 }, 500);
        egret.Tween.get(_text).wait(250).to({alpha: 0 },400,egret.Ease.circIn);
        egret.Tween.get(_text).to({ "y": _posY + 50}, 70).wait(50).to({"y":_posY-50},800).call(this.removeHpText2, this, [_text]);
        egret.Tween.get(_text).to({ x: _flyX - (25 * this._hpTxtFlyDir) }, 1100).to({ x: _flyX }, 600);
        

        // let time:number = egret.getTimer();
        // let startX:number = _text.x;
        // let startY:number = _text.y;
        // let cX:number = _flyX > startX ? startX + Math.round((_flyX - startX) / 2) : _flyX + Math.round((startX - _flyX) / 2);
        // let cY:number = this.y - 250 - randomY;
        // egret.Tween.get(_text,{onChange:onChange,onChangeObj:this}).wait(300).to({alpha:0,scaleX:0.1,scaleY:0.1},300).call(this.removeHpText2, this, [_text]);
        // function onChange() {
        //     if(!_text.parent) return;
        //     let curTime:number = egret.getTimer() - time;
        //     let movePt:number[] = App.MathUtils.getBezierCurve(startX,startY,_flyX,startY,curTime,600,cX,cY);
        //     if(movePt) {
        //         _text.x = movePt[0];
        //         _text.y = movePt[1];
        //     }
        // }
    }

    /**暴击伤害飘字 */
    private critHurt(str: string,fontType:string,offsetX:number = 100,offsetY = 0): void {
        let _text:RpgText = this.createHpText2(str, fontType,true);
        _text.scaleX = _text.scaleY = 0.5;
        let _flyX: number = this.x + offsetX * this._hpTxtFlyDir * -1;
        let checkX:number = this._hpTxtFlyDir > 0 ? _flyX + _text.width + 50 : _flyX - _text.width - 50;
        if(!RpgGameUtils.inCamera(checkX,this.y) && CacheManager.role.roles.length == 1) {
            _flyX = this.x + offsetX * (this._hpTxtFlyDir);
        }
        let randomY:number = (Math.random() * 20) - 10;
        let _posY:number = this.y - 300 - randomY + offsetY;
        egret.Tween.get(_text).to({ scaleX: 1.2, scaleY: 1.2 }, 100).wait(250).to({ scaleX: 0.4, scaleY: 0.4 }, 450);
        egret.Tween.get(_text).wait(250).to({ alpha: 0 }, 400, egret.Ease.circIn);
        egret.Tween.get(_text).to({ "y": _posY + 50 }, 70).wait(50).to({ "y": _posY - 50 }, 800).call(this.removeHpText2, this, [_text]);
        egret.Tween.get(_text).to({ x: _flyX - (25 * this._hpTxtFlyDir) }, 1100).to({ x: _flyX }, 600);
    }

    /**必杀伤害飘字 */
    private xpHurt(str: string,fontType:string): void {
        let _text: RpgText = this.createHpText2(str, fontType);
        let targetScale:number = 1;
        if(fontType != FontType.XpFont) {
            targetScale = 0.8;
            _text.scaleX = _text.scaleY = 1.3;
        }
        else {
            _text.scaleX = _text.scaleY = 1.5;
        }

        let _flyX: number = this.x + 110 * this._hpTxtFlyDir;
        let checkX:number = this._hpTxtFlyDir > 0 ? _flyX + _text.width + 50 : _flyX - _text.width - 50;
        if(!RpgGameUtils.inCamera(checkX,this.y)) {
            _flyX = this.x + 110 * (this._hpTxtFlyDir*-1);
        }
        let randomY:number = (Math.random() * 100) - 50;
        egret.Tween.get(_text)
            .to({ scaleX: targetScale, scaleY: targetScale }, 300)
            .to({ "y": this.y - 250 - randomY, x: _flyX }, 300).wait(300)
            .to({ alpha: 0 }, 800)
            .call(this.removeHpText2, this, [_text]);
    }

    private attackedEffect(skillId:number = 0): void {
        if(CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideEffect])) {
            return;
        }
        let _avatar: AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
        if (!_avatar || !_avatar.bodyAll || !_avatar.bodyMc) return;
        let _offsetY:number = 80;
        let _headComponent:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(_headComponent) _offsetY = _headComponent.modelHeight;

        let skill:any = ConfigManager.skill.getSkill(skillId);
        if(!skill || !skill.attackedEffect) return;//没陪受击特效不显示受击，只飘血
        // if(skill.skillType == ESkillType.ESkillTypeNormal)
        // {
        //     App.SoundManager.playEffect(SoundName.Effect_MonsterBeAttacked);
        // }
        if(skill.skillSet != ESkillSet.ESkillSetSpirit && egret.getTimer() - this.beattackTime >= 200)
        {
            this.beattackTime = egret.getTimer();
            let effect: MovieClip = ObjectPool.pop("MovieClip");
            effect.y = -(_offsetY/2);
            _avatar.sceneEffectUpLayer.addChild(effect);
            effect.playFile(ResourcePathUtils.getRPGGameCommon() + skill.attackedEffect, 1, LoaderPriority.getPriority(this, ComponentType.AvatarSkill), function(){
                effect.destroy();
            });
            // let angleIndex:number = App.RandomUtils.limitInteger(0,3);
            // let range:number[] = CacheManager.battle.battle_config.beAttack_angle[angleIndex];
            let king:MainPlayer = CacheManager.king.leaderEntity;
            if(king) {
                let angle:number = App.MathUtils.getAngle(MathUtils.getPositiveAngle(Math.atan2((this.y - king.y), (this.x - king.x))));
                if((angle >= 0 && angle <= 90) || (angle >= 180 && angle <= 270)) {
                    effect.rotation = -45;
                }
                else {
                    effect.rotation = 45;
                }
            }
                // effect.rotation = 45;//App.RandomUtils.limitInteger(range[0],range[1]);
            // let roleIndex:number = 0;
            // if(this.fromEntity) {
            //     roleIndex = EntityUtil.isMainPlayerOther(this.fromEntity);
            // }
            // let roleInfo:EntityInfo = CacheManager.role.getEntityInfo(roleIndex);
            // if(roleInfo) {
            //     let career:number = CareerUtil.getBaseCareer(roleInfo.career_SH);
            //     if(career == 1)
            //     {
            //         _avatar.bodyMc.filters = RpgMonster.highLightFilter1;
            //     }
            //     else
            //     {
            //         _avatar.bodyMc.filters = RpgMonster.highLightFilter2;
            //     }
            // }
        }
        // else
        // {
        //     _avatar.bodyMc.filters = RpgMonster.highLightFilter3;
        // }
        // if (this.timeOutIndex == -1) {
        //     let _highLightTime: number = CacheManager.battle.battle_config.AttackHighLightTime;
        //     this.timeOutIndex = egret.setTimeout(this.timeOutHandler, this, _highLightTime, _avatar);
        // }
    }

    private timeOutHandler(component: AvatarComponent): void {
        this.timeOutIndex = -1;
        if (!!component && !!component.bodyMc) component.bodyMc.filters = null;
    }

    private doAttackedShake(hurtIndex:number, hurtCount:number, mainRoleIndex:number):void {
        if (hurtIndex == 0 && (hurtCount > 1 || !this.isDead())
            && mainRoleIndex == CacheManager.king.leaderIndex
            && this.objType == RpgObjectType.Monster
            && !EntityUtil.isBoss(this.entityInfo)) {
            this.avatar && this.avatar.shakeBody(1);
        }
    }

    private cleanAttackShake():void {
        this.avatar && this.avatar.cleanShake();
    }

    public updateDeathDir(entity: RpgGameObject): void {
        let _offsetX: number = 0;
        let _offsetY: number = 0;
        if (entity.col == this.col) {
            this._hpTxtFlyDir = -1;
            if (entity.row > this.row) {
                //上
                _offsetY = -this.deathDis * 2;
                this._deathDir = Dir.Top;
                this._hpTxtFlyDir = -0.5;
                this._hpTxtFlyDirY = -1;
            }
            else if (entity.row < this.row) {
                //下
                _offsetY = this.deathDis * 2;
                this._deathDir = Dir.Bottom;
                this._hpTxtFlyDirY = 1;
            }
            else {
                _offsetX = this.deathDis;
                _offsetY = this.deathDis;
                this._hpTxtFlyDirY = -1;
            }
        }
        else if (entity.col < this.col) {
            if (entity.row > this.row) {
                //右上
                _offsetX = this.deathDis;
                _offsetY = -this.deathDis;
                this._deathDir = Dir.TopRight;
                this._hpTxtFlyDirY = -1;
            }
            else if (entity.row == this.row) {
                //右
                _offsetX = this.deathDis;
                this._deathDir = Dir.Right;
                this._hpTxtFlyDirY = 1;
            }
            else if (entity.row < this.row) {
                //右下
                _offsetX = this.deathDis;
                _offsetY = this.deathDis;
                this._deathDir = Dir.BottomRight;
                this._hpTxtFlyDirY = 1;
            }
            this._hpTxtFlyDir = 1;
        }
        else if (entity.col > this.col) {
            if (entity.row < this.row) {
                //左下
                _offsetX = -this.deathDis;
                _offsetY = this.deathDis;
                this._deathDir = Dir.BottomLeft;
                this._hpTxtFlyDirY = 1;
            }
            else if (entity.row == this.row) {
                //左
                _offsetX = -this.deathDis;
                this._deathDir = Dir.Left;
                this._hpTxtFlyDirY = 1;
            }
            else if (entity.row > this.row) {
                //左上
                _offsetX = -this.deathDis;
                _offsetY = -this.deathDis;
                this._deathDir = Dir.TopLeft;
                this._hpTxtFlyDirY = -1;
            }
            this._hpTxtFlyDir = -1;
        }
        if(this.isDead()){
            this.deathOffsetX = _offsetX;
            this.deathOffsetY = _offsetY / 2;
            this._hasDeathDir = true;
        }
        else if(this.hasDeathOffset) {
            this.deathOffsetX = NaN;
            this.deathOffsetY = NaN;
            this._hasDeathDir = false;
        }
    }

    public death(): void 
    {
        let king:MainPlayer = CacheManager.king.kingEntity;
        if(king && king.battleObj == this) {
        	king.battleObj = null;
        }
        king = CacheManager.king.kingEntityII;
        if(king && king.battleObj == this) {
        	king.battleObj = null;
        }
        king = CacheManager.king.kingEntityIII;
        if(king && king.battleObj == this) {
        	king.battleObj = null;
        }
        let _delayTime:number = 0;
        if(this._fromSkillId && this._fromSkillId > 0)
        {
            if(!this.gEffectListData) this.gEffectListData = ConfigManager.skill.getSkillEffectListVo(this._fromSkillId);
            if(this.gEffectListData) _delayTime = this.gEffectListData.delayDie;
        }
        let bossInfo:any = this.entityInfo && ConfigManager.boss.getByPk(this.entityInfo.code_I);
        let isDeadFly:boolean = bossInfo && bossInfo.deadFly == 1;
        Log.trace(Log.FIGHT, "MonsterDeath:", EntityUtil.getEntityId(this.entityInfo.entityId), egret.getTimer());
        if (!isDeadFly) {//死亡不击飞
            this.action = Action.Die;
            _delayTime = 1500;
        }

        this.dieathIndex = egret.setTimeout(function(){
            // ControllerManager.sound.playDeath("03_Death_wav");
            this.dieathIndex = -1;
            // if(this.entityInfo) App.SoundManager.playEffect("death_" + this.entityInfo.code_I + "_wav");
			this.action = Action.Die;
            let _avatar: AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
            if (!!_avatar && !!_avatar.bodyAll) {
                _avatar.hideFootShadow();
                if(CacheManager.checkPoint.passPointNum >= 7) {
                    if(CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && !CacheManager.copy.isInCopy) {
                        let rate:number = Math.random();
                        if(this.fromEntity && EntityUtil.isMainPlayerOther(this.fromEntity) >= 0 || rate < 0.3) {
                            EventManager.dispatch(LocalEventEnum.ShowEnergyEffect,_avatar.mainLayer.localToGlobal(0,0,RpgMonster.globalPt));
                        }
                    }
                }
                else {
                    CacheManager.checkPoint.clientEnerge ++;
                }

                if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewExperience)){
                    EventManager.dispatch(LocalEventEnum.ShowGetExpEffect,_avatar.mainLayer.localToGlobal(0,0,RpgMonster.globalPt));
                }else if(this.isBoss && MapUtil.isShowExpEffect()){
                    EventManager.dispatch(LocalEventEnum.CopyShowExpEffect,_avatar.mainLayer.localToGlobal(0,0,RpgMonster.globalPt));
                }
                if (this.hasDeathOffset) {
                    if (!isDeadFly) {
                        this.gameView.removeEntity(this);
                    } else {
                        let _posX: number = _avatar.bodyAll.x + this.deathOffsetX;
                        let _posY: number = _avatar.bodyAll.y + this.deathOffsetY;

                        this.createDeathCurve(_avatar.bodyAll, _posX, _posY);
                        this.cleanAttackShake();
                    }
                }
            }
            else {
                this.gameView.removeEntity(this);
            }
        },this,_delayTime);

        if(this.entityInfo) {
            EventManager.dispatch(LocalEventEnum.MonsterDied, this.entityInfo.entityId);
        }
    }

    private createDeathCurve(disObj: egret.DisplayObjectContainer, endX:number,endY:number, dir?: number): void {
        egret.Tween.removeTweens(disObj);

        let _x: number = disObj.x;
        let _y: number = disObj.y;

        let _changeEndX: number = _x + (this.deathOffsetX * 0.7);
        let _changeEndY: number = _y + (this.deathOffsetY * 0.7);

        /**曲线弯曲度控制点 */
        let _height: number = this.deathHight;
        if (this._deathDir == Dir.Top || this._deathDir == Dir.Bottom) _height = 20;
        let _controllerPt: number[] = App.MathUtils.getMidperpendicularPoint(_x, _y, _changeEndX, _changeEndY, _height);

        let time:number = egret.getTimer();
        egret.Tween.get(disObj, { onChange: onChange, onChangeObj: disObj }).wait(380).call(onStepComplete);

        let this_ = this;
        function onStepComplete() {
            egret.Tween.get(disObj).to({ x: endX, y: endY }, 280).to({ alpha: 0 }, 450).call(allComplete);
        }

        function allComplete() {
            this_.gameView.removeEntity(this_);
        }

        function onChange() {
            let curTime:number = egret.getTimer() - time;
            let movePt:number[] = App.MathUtils.getBezierCurve(_x,_y,_changeEndX,_changeEndY,curTime,380,_controllerPt);
            //App.MathUtils.getBezierCurve(_startPt,_end,[_controllerPt],curTime,380);
            if(movePt)
            {
                disObj.x = movePt[0];//movePt.x;
                disObj.y = movePt[1];//movePt.y;
            }
        }
    }

    public isDead(): boolean {
        return !this.entityInfo || this.entityInfo.life_L64 <= 0 || super.isDead();
    }

    public get hasDeathOffset(): boolean {
        return this._hasDeathDir;
    }

    public destory(): void {
        if(this.entityInfo.code_I == 1200010 || this.entityInfo.code_I == 1200019) {//宠物和坐骑，延迟移除，等播放解救特效完成
            egret.setTimeout(this.doDestory, this, 1000);
        } else {
            this.doDestory();
        }
    }

    private doDestory(): void {
        this.fromEntity = null;
        this.deathOffsetX = NaN;
        this.deathOffsetY = NaN;
        this._hasDeathDir = false;

        super.destory();
        this.beattackTime = 0;
        if (this.timeOutIndex != -1) {
            egret.clearTimeout(this.timeOutIndex);
            this.timeOutIndex = -1;
        }
        if(this.dieathIndex != -1)
        {
            egret.clearTimeout(this.dieathIndex);
            this.dieathIndex = -1;
        }
        this.gEffectListData = null;
        this.gChangeHp = 0;
    }
    
    public get mcName():string
    {
        return ConfigManager.boss.getModelId(this.entityInfo.code_I);
    }

    public updateTitle():void {
        let head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(head) head.updateTitle();
    }

    public get titlePath():string {
        if(!this.entityInfo || !EntityUtil.isCollectionMonster(this)) {
            return ""
        }
        let titleId: number = ConfigManager.client.getBossTitle(this.entityInfo.code_I);
        if (titleId) {
            return ResourcePathUtils.getRPGGame() + "title/" + titleId;
        }
        return "";
    }

    private preLoadBossStandRes() {
        if(this.isBoss){
            let loadFile:string = this.mcPath + this.mcName + "_stand";
            // console.log("preLoadBossStandRes:", loadFile, App.DateUtils.getFormatMilisecs(egret.getTimer()))
            App.LoaderManager.getModelResByUrl(loadFile, /*()=>{
                console.log("BOSS--->", CacheManager.res.getModelCache(loadFile), App.DateUtils.getFormatMilisecs(egret.getTimer()))
            }*/null, this, ELoaderPriority.TOP);
        }
    }
}