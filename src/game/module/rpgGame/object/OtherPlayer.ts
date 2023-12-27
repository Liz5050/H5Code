
class OtherPlayer extends RpgGameObject {

    private gChangeHp:number;
    private gEffectListData:EffectListData;
    /**伤害来源 */
    private fromEntity:any;
    public constructor() {
        super();
        this.objType = RpgObjectType.OtherPlayer;
    }

    public init(data: EntityInfo): void {
        super.init(data);
        if(data.reserveJs_S && data.reserveJs_S != ""){
            var obj:any = JSON.parse(data.reserveJs_S);
        }        
        this.addComponent(ComponentType.Aoi);
		this.addComponent(ComponentType.Move);
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)) {
            this.addComponent(ComponentType.Avatar);
        }
        this._hasInit = true;
        CacheManager.map.addCanAttackPlayer(this.entityInfo.entityId);
    }

    public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.Avatar);
            this.addSkillComponent();
            this.addComponent(ComponentType.AvatarWeapon);
            if(!this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowWing]) this.addComponent(ComponentType.AvatarWing);
            this.addComponent(ComponentType.AvatarMount);
            this.addComponent(ComponentType.AvatarLaw);
            if(!this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowShapeSpirit]) this.addComponent(ComponentType.AvatarSpirit);
            // this.addComponent(ComponentType.AvatarSprite);
            // if(!this.entityInfo.weapons[EEntityAttribute.EAttributeNotShowShapeSoul]) this.addComponent(ComponentType.AvatarSoul);
            //this.addComponent(ComponentType.AvatarLaw);
            this.addComponent(ComponentType.AvatarSwordPool);
            if(!this.isDead()) {
                this.addComponent(ComponentType.Head);
            }
            this.addComponent(ComponentType.Buff);
            this.addComponent(ComponentType.Ancient);
            this.updateModelIsShow();
            this.updateTitle();
            this.addUpDownTween();
            if(this.avatar.isShow) {
                CacheManager.map.addPlayerShowId(this.entityInfo.id);
            }
        }
        else {
            CacheManager.map.deletePlayerShowId(this.entityInfo.id);
            this.removeComponent(ComponentType.Avatar);
            this.removeComponent(ComponentType.AvatarSkill);
            this.removeComponent(ComponentType.AvatarWeapon);
            this.removeComponent(ComponentType.AvatarWing);
            this.removeComponent(ComponentType.Ancient);
            this.removeComponent(ComponentType.AvatarMount);
            this.removeComponent(ComponentType.AvatarLaw);
            this.removeComponent(ComponentType.AvatarSwordPool);
            this.removeComponent(ComponentType.AvatarSpirit);
            // this.removeComponent(ComponentType.AvatarSprite);
            // this.removeComponent(ComponentType.AvatarSoul);
            this.removeComponent(ComponentType.Head);
            this.removeComponent(ComponentType.Buff);
        }
    }

    private addSkillComponent():void {
        if(!this.entityInfo || CareerUtil.getBaseCareer(this.entityInfo.career_SH) != 1) {
            return;
        }
        this.addComponent(ComponentType.AvatarSkill);
    }

    public updateModelIsShow():void
    {
        let _avatarComponent:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
        if(!_avatarComponent) return;
        _avatarComponent.updateModelIsShow(LocalEventEnum.HideOther);
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
            CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideTitle]) ||
            CacheManager.map.playerFull) return "";
            
        let mainTitleIdx:number = this.entityInfo.titles.key_I.indexOf(EEntityAttribute.EAttributeTitleMain);
        if(mainTitleIdx == -1) return "";
        let titleCode:string = this.entityInfo.titles.value_S[mainTitleIdx];
        if(!titleCode || titleCode == "") return "";
        let titleCfg:any = ConfigManager.title.getByPk(Number(titleCode));
        if(!titleCfg || !titleCfg.icon || titleCfg.icon == "") return "";
        return ResourcePathUtils.getRPGGame() + "title/" + titleCfg.icon;
    } 

    public updateDeathDir(entity:RpgGameObject):void
    {
        if(entity.col == this.col)
        {
            this._hpTxtFlyDir = -1;
            if(entity.row > this.row)
            {
                this._hpTxtFlyDir = -0.5;
            }
        }
        else if(entity.col < this.col)
        {
            this._hpTxtFlyDir = 1;
        }
        else if(entity.col > this.col)
        {
            this._hpTxtFlyDir = -1;
        }
    }

    public showHpChange(changeHp: number, fromEntity:any,hurtType: EHurtType = EHurtType.EHurtTypeNormal):void
    {
        this.fromEntity = fromEntity;
        if (!this.gameView || changeHp <= 0) return;
        if(!CacheManager.map.isMapRendering) {
            this.updateLife();
            return;
        }

        let mainRoleIndex:number = EntityUtil.isMainPlayerOther(fromEntity);
        if ((EntityUtil.isPlayer(fromEntity) && mainRoleIndex == -1) || fromEntity.type_BY == EEntityType.EEntityTypeBoss) {
            this.updateLife();
            return;
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
            this.addTween(changeHp,fromEntity,hurtType);
            return;
        }
        else
        {
            let _skillType = ConfigManager.skill.getSkill(this._fromSkillId).skillSet;
            if(_skillType == ESkillSet.ESkillSetSpirit)
            {
                this.faBaoHurt(changeHp);
                return;
            }
        }
        if(!this.gEffectListData) this.gEffectListData = ConfigManager.skill.getSkillEffectListVo(this._fromSkillId);
        if(!this.gEffectListData) 
        {
            this.addTween(changeHp,fromEntity,hurtType,this._fromSkillId);
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
                    _hp = Math.round(Math.random() * (this.gChangeHp/2));
                    this.gChangeHp -= _hp;
                }
                let _delayTime:number = this.gEffectListData.effectHurts[i];
                let _skillId:number = this._fromSkillId;
                egret.setTimeout(this.addTween,this,_delayTime, _hp,fromEntity,hurtType,_skillId);
            }
            this.gEffectListData = null;
            this._fromSkillId = 0;
        }
        else
        {
            this.addTween(changeHp,fromEntity,hurtType,this._fromSkillId);
        }
    }

    private addTween(changeHp: number, fromEntity: any, hurtType: EHurtType = EHurtType.EHurtTypeNormal,skillId:number = 0):void
    {
        if(!ControllerManager.scene.sceneReady) return;
        this.updateLife();
        let _type: EEntityType = fromEntity.type_BY;
        if (_type == EEntityType.EEntityTypePet) {
            this.normalHurt("-" + changeHp, FontType.MONSTER_FORM_PET, 50);
        }
        else 
        {
            let offsetY:number = 0;
            let fontType:string = FontType.CRIT_FONT;
            if(this.fromEntity) {
                let roleIndex:number = EntityUtil.isMainPlayerOther(this.fromEntity);
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
            }
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

    private normalHurt(str: string, font: string, offsetX: number = 100,offsetY:number = 0): void {
        let _text:RpgText = this.createHpText2(str, font);
        _text.scaleX = _text.scaleY = 0.5;
        let _flyX: number = this.x + offsetX * this._hpTxtFlyDir;
        let checkX:number = this._hpTxtFlyDir > 0 ? _flyX + _text.width + 50 : _flyX - _text.width - 50;
        if(!RpgGameUtils.inCamera(checkX,this.y) && CacheManager.role.roles.length == 1) {
            _flyX = this.x + offsetX * (this._hpTxtFlyDir*-1);
        }
        let randomY:number = (Math.random() * 20) - 10;
        let _posY:number = this.y - 300 - randomY + offsetY;
        if(font == FontType.MONSTER_FORM_PET) {
            _posY -= 100;
            _text.y -= 100;
        }

        egret.Tween.get(_text).to({ scaleX: 0.8, scaleY: 0.8 }, 100).wait(150).to({ scaleX: 0.4, scaleY: 0.4 }, 500);
        egret.Tween.get(_text).wait(250).to({alpha: 0 },400,egret.Ease.circIn);
        egret.Tween.get(_text).to({ "y": _posY + 50}, 70).wait(50).to({"y":_posY-50},800).call(this.removeHpText2, this, [_text]);
        egret.Tween.get(_text).to({ x: _flyX - (25 * this._hpTxtFlyDir) }, 1100).to({ x: _flyX }, 600);
    }

    private critHurt(str: string,fontType:string,offsetX:number = 100,offsetY = 0): void {
        let _text:RpgText = this.createHpText2(str, fontType,true);
        _text.scaleX = _text.scaleY = 0.5;
        let _flyX: number = this.x + offsetX * this._hpTxtFlyDir;
        let checkX:number = this._hpTxtFlyDir > 0 ? _flyX + _text.width + 50 : _flyX - _text.width - 50;
        if(!RpgGameUtils.inCamera(checkX,this.y) && CacheManager.role.roles.length == 1) {
            _flyX = this.x + offsetX * (this._hpTxtFlyDir*-1);
        }
        let randomY:number = (Math.random() * 20) - 10;
        let _posY:number = this.y - 300 - randomY + offsetY;
        egret.Tween.get(_text).to({ scaleX: 1.2, scaleY: 1.2 }, 100).wait(250).to({ scaleX: 0.4, scaleY: 0.4 }, 350);
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
    
    public isDead():boolean
    {
        return !this.entityInfo || this.entityInfo.life_L64 <= 0 || super.isDead();
    }

    public get mcName():string
    {
        let modelId:number = this.entityInfo.getModelId(EEntityAttribute.EAttributeClothes);
        return modelId + "/" + modelId;
    }

    public death(fromEntity:RpgGameObject = null):void {
        super.death(fromEntity);
        if(this.entityInfo) {
            let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
            if(mainPlayer && mainPlayer.battleObj == this) {
                mainPlayer.battleObj = null;
            }
            CacheManager.map.removeFightPlayer(this.entityInfo.entityId);
            if(fromEntity && fromEntity.entityInfo && EntityUtil.isMainPlayerOther(fromEntity.entityInfo.entityId) >= 0) {
                CacheManager.map.removeMurdererId(this.entityInfo.entityId);
            }
            EventManager.dispatch(LocalEventEnum.OtherPlayerDied,this.entityInfo.entityId);
            this.removeComponent(ComponentType.Head);
        }
        this.updateAvatarModel(EEntityAttribute.EAttributeShapeSwordPool);
        this.updateAvatarModel(EEntityAttribute.EAttributeShapeLaw);
    }

    public revive():void {
        super.revive();
        if(this.getInCamera()) {
            let avatar:AvatarComponent = this.getComponent(ComponentType.Avatar) as AvatarComponent;
            if(avatar) {
                //head组件必须在avatar之后添加
                this.addComponent(ComponentType.Head);
            }
            this.updateAvatarModel(EEntityAttribute.EAttributeShapeSwordPool);
            this.updateAvatarModel(EEntityAttribute.EAttributeShapeLaw);
        }
    }

    public destory(): void {
        super.destory();
        this.gEffectListData = null;
        this.gChangeHp = 0;
        this.fromEntity = null;
    }
}