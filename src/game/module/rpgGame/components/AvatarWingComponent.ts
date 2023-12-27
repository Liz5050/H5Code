
class AvatarWingComponent extends AvatarPartComponent {
    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.updateWing(true);
    }

    public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
        if (gotoAction == Action.Attack && this.entity.entityInfo) {
            let career:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
            if(CacheManager.battle.hasCareerAttackNumber(career, attackNO) == false) {
                Log.trace(Log.FATAL, "播放不存在的翅膀资源id：" + this.mc.resID, "动作：" + gotoAction, "序列：" + attackNO);
                return;
            }
        }
        this.mc.mountState = this.entity.isOnMount;
        this.mc.lawState = this.entity.isOnLaw;
        if((this.mc.mountState && gotoAction == Action.Attack)) {// || Action.isActionNoPlayPart(gotoAction)
            this.mc.mountState = false;
        }

		super.playAction(gotoAction, gotoDir, compFun, attackNO);
    }

    public updateWing(needUpdate:boolean = false):void
    {
        let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarComponent) return;
        this.mc.mountState = this.entity.isOnMount;
        this.mc.lawState = this.entity.isOnLaw;
        let _id:number = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeWing);
        if(_id && _id > 0)
        {
            this.mc.setData(this.entity.rootPath + "wing/", _id + "", AvatarType.Wing, LoaderPriority.getPriority(this.entity, ComponentType.AvatarWing), ResAvatarType.ResWing);
            _avatarComponent.setWing(this);
            // let _layer:number = _avatarComponent.getIndexLayer(ComponentType.AvatarWing);
            _avatarComponent.bodyWing.addChild(this.mc);
            if(needUpdate && (!this.mc.refMovieClipData || this.entity.action == Action.Stand || this.entity.action == Action.Move)) {
                this.playAction(this.entity.action,this.entity.dir,null,_avatarComponent.bodyAttackNum);
            }
        }
        else
        {
            _avatarComponent.setWing(null);
            this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
        }
    }
    
    public stop():void
    {
        let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(_avatarComponent) _avatarComponent.setWing(null);
        super.stop();
    }
}