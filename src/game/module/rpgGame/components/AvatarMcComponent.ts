class AvatarMcComponent extends AvatarLayerComponent
{
	private footShadow: egret.Bitmap;
	private footShadowLamp: egret.Bitmap;
	private selectSign: egret.Bitmap;
    private bossSign:MovieClip;//BOSS脚底特殊标识
	private mc: RpgMovieClip;
	private timeOutIndex:number = -1;

	protected needUpdateBody:boolean = false;
	private isTrapBoss:boolean = false;//是否是预警怪
	private attackComplete:boolean = false;//攻击动作是否完成
	public constructor()
	{
		super();
	}

	protected initUI():void
	{
		this.initBodyMc();
		this.initShadow();
        this.playSign();
	}

	private initShadow():void {
        this.footShadow = ObjectPool.pop("egret.Bitmap");
        let shadowUrl:string = this.getShadowUrl();
        App.LoaderManager.getResByUrl(shadowUrl,function(){
            if(this.footShadow) {
                this.footShadow.texture = App.LoaderManager.getCache(shadowUrl);
                AnchorUtil.setAnchor(this.footShadow, 0.5);
            }
        },this);
        this.entity.gameView.getGameGroundLayer().addChild(this.footShadow);

        if (this.isShowShadowLamp()) {//带光圈的放最下层
            this.footShadowLamp = ObjectPool.pop("egret.Bitmap");
            let shadowLampUrl:string = ResourcePathUtils.getRPGGame() + "shadow_lamp.png";
            App.LoaderManager.getResByUrl(shadowLampUrl,function(){
                if(this.footShadowLamp) {
                    this.footShadowLamp.texture = App.LoaderManager.getCache(shadowLampUrl);
                    this.footShadowLamp.blendMode = egret.BlendMode.ADD;
                    AnchorUtil.setAnchor(this.footShadowLamp, 0.5);
                }
            },this);
            this.entity.gameView.getGameGroundLayer().addChildAt(this.footShadowLamp, 0);
        }
	}

	private getShadowUrl():string {
        this.isTrapBoss = EntityUtil.checkMonsterType(this.entity.entityInfo,EBossType.EBossTypeTimeTrap);
        if(this.isTrapBoss) {
            return ResourcePathUtils.getRPGGame() + "trapBossShadow.png";
        }
		let shadowPicName:string = "shadow.png";
        return ResourcePathUtils.getRPGGame() + shadowPicName;
	}

	private isShowShadowLamp():boolean {
		return MapUtil.showShadowHalo() && this.entity.isLeaderRole;
	}

	protected initBodyMc():void
	{
		this.mc = ObjectPool.pop("RpgMovieClip");
		this.body.addChild(this.mc);
		this.updateBody(true);
        this.updateScale();
	}

    private playSign() {
		if (this.entity.objType != RpgObjectType.Monster)
			return;
		if(this.isTrapBoss) {
			this.bossSign = ObjectPool.pop("RpgMovieClip");
			this.bossSign["setData"](this.entity.mcPath, this.entity.mcName, AvatarType.Player, LoaderPriority.getPriority(this.entity, ComponentType.AvatarMc), this.ResType);
			this.bossSign["gotoAction"](Action.Stand, Dir.BottomLeft);
			this.bossSign.scaleX = this.body.scaleX * -1;
			this.bossSign.scaleY = this.body.scaleY;
			this.entity.gameView.getGameGroundLayer().addChild(this.bossSign);
		}
		else {
			let ePath:string;
			if (EntityUtil.isCheckPointBoss(this.entity.entityInfo)) {
				ePath = ResourcePathUtils.getRPGGameCommon() + "boss_cp";
			} else if (EntityUtil.isBoss(this.entity.entityInfo)) {
				ePath = ResourcePathUtils.getRPGGameCommon() + "boss_aura";
			} else if(EntityUtil.isEliteBoss(this.entity.entityInfo)) {//精英怪
				ePath = ResourcePathUtils.getRPGGameCommon() + "boss_elite";
			}
			if (ePath) {
				this.bossSign = ObjectPool.pop("MovieClip");
				this.bossSign.playFile(ePath, -1);
				this.entity.gameView.getGameGroundLayer().addChild(this.bossSign);
			}
		}
    }

	private updateScale(): void {
		if (this.entity.objType == RpgObjectType.Monster) {
            let _config:any = ConfigManager.boss.getByPk(this.entity.entityInfo.code_I);
            if(_config && _config.modelScale && _config.modelScale != 100)
            {
            	let modelScale:number = _config.modelScale / 100;
                this.body.scaleX = this.body.scaleY = modelScale;
                if (this.bossSign) this.bossSign.setScale(modelScale);
            }
		}
	}

	public update(advancedTime: number): void
	{
        super.update(advancedTime);
		this.setPos();
		if (this.entity.action != this.bodyMc.getCurrAction()
			|| this.attackComplete
			|| (this.entity.action != Action.Attack && this.entity.dir != this.bodyMc.getCurrDir())) {
            this.handleGotoAction();
			this.attackComplete = false;
        }
	}

	public setSelect(isSelect: boolean, selectType: number = 0): void
	{
        if (isSelect && EntityUtil.isNeedShowSelect(this.entity)) {
            if (!this.entity.gameView.getGameGroundLayer().contains(this.selectSign)) {
                if (!this.selectSign) {
                    this.selectSign = ObjectPool.pop("egret.Bitmap");
                    let imgUrl:string = ResourcePathUtils.getRPGGame() + "selectEntity.png";
                    App.LoaderManager.getResByUrl(imgUrl,() => {
						if (this.selectSign) {
							this.selectSign.texture = App.LoaderManager.getCache(imgUrl);
							AnchorUtil.setAnchor(this.selectSign, 0.5);
						}
                    },this);
                }
                this.entity.gameView.getGameGroundLayer().addChild(this.selectSign);
            }
        } else {
            App.DisplayUtils.removeFromParent(this.selectSign);
        }
    }

	/** 播放攻击 */
    public playAttack(skillId: number, targetObject: RpgGameObject): void
    {
        this.entity.battleObj = targetObject;

        if (targetObject)
            this.entity.dir = RpgGameUtils.computeGameObjDir(this.entity.x, this.entity.y, targetObject.x, targetObject.y);

        // this.setSpecifiedAttackNO(skillId);
		let skill:any = ConfigManager.skill.getSkill(skillId);
        if (!skill || skill.skillType != ESkillType.ESkillTypeRushForward) {
			if(this.entity.entityCareer == ECareer.ECareerWarrior && this.entity.objType == RpgObjectType.MainPlayer && skill && skill.skillType != ESkillType.ESkillTypePunch) {
				CacheManager.battle.nextAttack = true;
			}
        	this.entity.action = Action.Attack;//冲锋技能不播放攻击动作
		}
        this.entity.currentState = EntityModelStatus.Attack;
    }

	protected handleGotoAction():void
	{
		this.playAction(this.entity.action, this.entity.dir);
	}

	protected playAction(action:string,dir:Dir,attackNumber:number = 1):void {
		if(this.bodyMc.mountState && action == Action.Attack) {
			// this.actionComplete(0);
			this.bodyMc.mountState = false;
			this.bodyAll.y = 0;
			// return;
		}

		this.bodyMc.gotoAction(action, dir, null, attackNumber);
		if(action == Action.Attack) {
			let playTime:number = Math.floor(this.bodyMc.playTime);
        	if (playTime <= 0) playTime = 400;
            this.timeOutIndex = egret.setTimeout(this.actionComplete,this,playTime,playTime);
		}
	}

	private actionComplete(playTime:number):void {
		this.timeOutIndex = -1;
		if (this.bodyMc && this.bodyMc.getCurrAction() != Action.Die && !this.entity.isDead()) {
			this.playStand();
			this.attackComplete = true;
		}
	}

	protected playStand():void {
		this.entity.action = Action.Stand;
		if(this.needUpdateBody) {
			this.updateBody(false);
			this.needUpdateBody = false;
		}
	}

	/**隐藏脚底阴影 */
    public hideFootShadow():void
    {
        this.footShadow.visible = false;
        if (this.footShadowLamp) this.footShadowLamp.visible = false;
		if(this.bossSign) this.bossSign.visible = false;
    }

	public showFootShadow():void {
		this.footShadow.visible = true;
        if (this.footShadowLamp) this.footShadowLamp.visible = true;
	}

	public hide():void {
		super.hide();
		if(this.entity.objType == RpgObjectType.Pet) {
			App.DisplayUtils.removeFromParent(this.footShadow);
		}
	}

	public show():void {
		super.show();
		if(this.entity.objType == RpgObjectType.Pet) {
			this.entity.gameView.getGameGroundLayer().addChild(this.footShadow);
		}
	}

	protected setPos(): void
	{
		super.setPos();
		let entityX:number = this.entity.x;
		let entityY:number = this.entity.y;
        if (this.footShadow.x != entityX) {
            this.footShadow.x = entityX;
			if(this.bossSign) this.bossSign.x = entityX;
            if(this.footShadowLamp) this.footShadowLamp.x = entityX;
        }
        if (this.footShadow.y != entityY) {
            this.footShadow.y = entityY;
			if(this.bossSign) this.bossSign.y = entityY;
            if(this.footShadowLamp) this.footShadowLamp.y = entityY;
        }
        if (this.selectSign) {
            this.selectSign.x = entityX;
            this.selectSign.y = entityY;
		}
    }

	public get ResType(): string
	{
        let resType:string = "";
        if(this.entity.objType == RpgObjectType.MainPlayer || this.entity.objType == RpgObjectType.OtherPlayer)
        {
            resType = ResAvatarType.ResPlayer;
        }
        return resType;
    }

	public updateBody(needUpdate:boolean = false):void
    {
        this.mc.setData(this.entity.mcPath, this.entity.mcName, AvatarType.Player, LoaderPriority.getPriority(this.entity, ComponentType.AvatarMc), this.ResType);
		if(needUpdate) {
			this.mc.gotoAction(this.entity.action, this.entity.dir);
		}
	}

	/** 是否点击中了 */
    public isHit(x: number, y: number): boolean
	{
        // return this.body.hitTestPoint(x, y) ? true : false;
		let isMiningNpc:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining) && this.entity.objType == RpgObjectType.Npc;
		if (!isMiningNpc) {
			return this.bodyMc.hitTestPoint(x, y);
        }
		else {
			let headComp:HeadComponent = <HeadComponent>this.entity.getComponent(ComponentType.Head);
			return this.bodyMc.hitTestPoint(x, y) || (headComp && headComp.getTitleMc() && headComp.getTitleMc().hitTestPoint(x, y));
		}
    }

	public clearActionTimeOut():void {
		if(this.timeOutIndex != -1)
		{
			egret.clearTimeout(this.timeOutIndex);
			this.timeOutIndex = -1;
		}
	}

	public stop(): void
	{
		this.attackComplete = false;
		this.clearActionTimeOut();
		super.stop();

		if(this.mc)
		{
			this.mc.filters = null;
			this.mc.destroy();
			this.mc = null;
		}

		if(this.footShadow) {
			App.DisplayUtils.removeFromParent(this.footShadow);
			AnchorUtil.setAnchor(this.footShadow, 0);
			this.footShadow.x = this.footShadow.y = 0;
			this.footShadow.texture = null;
			this.footShadow.visible = true;
			ObjectPool.push(this.footShadow);
			this.footShadow = null;
		}

		if(this.footShadowLamp) {
			App.DisplayUtils.removeFromParent(this.footShadowLamp);
			AnchorUtil.setAnchor(this.footShadowLamp, 0);
			this.footShadowLamp.x = this.footShadowLamp.y = 0;
            this.footShadowLamp.blendMode = egret.BlendMode.NORMAL;
            this.footShadowLamp.texture = null;
            this.footShadowLamp.visible = true;
			ObjectPool.push(this.footShadowLamp);
			this.footShadowLamp = null;
		}

        if(this.bossSign) {
            this.bossSign.destroy();
            this.bossSign = null;
        }

        if (this.selectSign) {
			App.DisplayUtils.removeFromParent(this.selectSign);
			AnchorUtil.setAnchor(this.selectSign, 0);
			this.selectSign.x = this.selectSign.y = 0;
        	this.selectSign.texture = null;
			ObjectPool.push(this.selectSign);
            this.selectSign = null;
		}
		this.isTrapBoss = false;
	}

	public get bodyMc():RpgMovieClip
	{
		return this.mc;
	}
}