
class AvatarSkillComponent extends AvatarPartComponent {
    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        let mcName: string = "10100"; //保证有刀光
        // if (this.entity && this.entity.entityInfo) {
        //     let baseCareer:number = CareerUtil.getBaseCareer(this.entity.entityInfo.career_SH);
        //     if (baseCareer != 1)
        //         mcName = "10200";
        // }
        this.mc.setData(ResourcePathUtils.getRPGGameAttack(), mcName, AvatarType.Attack, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSkill), ResAvatarType.ResAttack);

        let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
        avatarComponent.setSkill(this);
        avatarComponent.sceneEffectUpLayer.addChild(this.mc);
    }

    public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void {
        if (!this.mc || attackNO == 6) {
            if(this.mc) this.mc.visible = false;
            return;
        }
        if (gotoAction == Action.Attack) {
            super.playAction(gotoAction, gotoDir, compFun, attackNO);
            if(attackNO == 3) {
                if(this.mc.scaleX <= 0) this.mc.scaleX = -1.2;
                else this.mc.scaleX = 1.2;
                this.mc.scaleY = 1.2;
            }
            else {
                if(this.mc.scaleX <= 0) this.mc.scaleX = -1.1;
                else this.mc.scaleX = 1.1;
                this.mc.scaleY = 1.1;
            }
            // this.mc.visible = true;
        }
        else {
            this.mc.visible = false;
        }
    }

    public stop():void
    {
        let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(_avatarComponent) _avatarComponent.setSkill(null);
        super.stop();
    }
}