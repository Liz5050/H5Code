
class AvatarWeaponComponent extends AvatarPartComponent {
    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.updateWeapon(true);
        // this.mc.setData(this.entity.rootPath + "weapon/", this.entity.weaponName, AvatarType.Weapon, ResAvatarType.ResWeapon);
    }

    public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
        if (gotoAction == Action.Attack && this.entity.entityInfo) {
            let career:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
            if(CacheManager.battle.hasCareerAttackNumber(career, attackNO) == false) {
                Log.trace(Log.FATAL, "播放不存在的武器资源id：" + this.mc.resID, "动作：" + gotoAction, "序列：" + attackNO,"职业：" + career);
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

    public updateWeapon(needUpdate:boolean = false):void
    {
        let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
        if(!avatarComponent) return;
        this.mc.mountState = this.entity.isOnMount;
        this.mc.lawState = this.entity.isOnLaw;
        let _id:number = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeWeapon);
        if(_id && _id > 0)
        {
            this.mc.setData(this.entity.rootPath + "weapon/", _id + "", AvatarType.Weapon, LoaderPriority.getPriority(this.entity, ComponentType.AvatarWeapon), ResAvatarType.ResWeapon);
            avatarComponent.setWeapon(this);
            // let _layer:number = avatarComponent.getIndexLayer(ComponentType.AvatarWeapon);
            avatarComponent.bodyWeapon.addChild(this.mc);
            if(needUpdate && (!this.mc.refMovieClipData || this.entity.action == Action.Stand || this.entity.action == Action.Move))  {
                this.playAction(this.entity.action,this.entity.dir,null,avatarComponent.bodyAttackNum);
            }
        }
        else
        {
            avatarComponent.setWeapon(null);
            this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
        }
    }

    public stop():void
    {
        let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(_avatarComponent) _avatarComponent.setWeapon(null);
        super.stop();
    }
}