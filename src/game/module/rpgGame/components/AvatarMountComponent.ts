class AvatarMountComponent extends AvatarPartComponent 
{
	private maskMc:RpgMovieClip;
	/**是否上坐骑 */
	private onMount:boolean;
	// private isFirst:boolean = true;

	public constructor() 
	{
		super();
	}

	public start(): void 
	{
		super.start();
		this.maskMc = ObjectPool.pop("RpgMovieClip");
		this.maskMc.mountState = this.mc.mountState = true;
		// let _mountId:number = this.entity.entityInfo.weapons[EEntityAttribute.EAttributeMounts];
		// if(_mountId && _mountId > 0)
		// {
		// 	this.maskMc.setData(this.entity.rootPath + "mount/", _mountId + "_mask", AvatarType.Mount);
		// 	this.mc.setData(this.entity.rootPath + "mount/", _mountId + "", AvatarType.Mount);
		// }
		this.updateMount();
	}

	public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
		if(gotoAction == Action.Die)
		{
			this.maskMc.visible = false;
			this.mc.visible = false;
			return;
		}
		this.maskMc.visible = this.mc.visible = true;
		if(gotoAction == Action.Attack || gotoAction == Action.Jump) return;
		if (!this.maskMc || !this.maskMc.parent) return;
		
		super.playAction(gotoAction, gotoDir, compFun, attackNO);
		this.maskMc.gotoAction(gotoAction, gotoDir, compFun, attackNO);
    }

	public updateMount():void
	{
		let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
		if(!avatarComponent) return;
		// egret.Tween.removeTweens(this.mc);
		// egret.Tween.removeTweens(this.maskMc);
		let _mountId:number = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeMounts);
		if(_mountId && _mountId > 0)
		{
			this.maskMc.setData(this.entity.rootPath + "mount/", _mountId + "_mask", AvatarType.Mount, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSkill));//坐骑遮罩加载优先级低于坐骑
			this.mc.setData(this.entity.rootPath + "mount/", _mountId + "", AvatarType.Mount, LoaderPriority.getPriority(this.entity, ComponentType.AvatarMount));
			avatarComponent.mountDown.addChild(this.mc);
			avatarComponent.mountUp.addChild(this.maskMc);
			this.playAction(this.entity.action,this.entity.dir);
			// if(!this.isFirst)
			// {
			// 	// this.showMountTween();
			// 	// this.entity.situJump();
			// }
			avatarComponent.setMount(this);
		}
		else
		{
			if(this.maskMc.parent || this.mc.parent)
			{
				this.hideMountTween();
				avatarComponent.setMount(null);
				// this.entity.situJump();
			}
		}
		// this.isFirst = false;
	}

	public showMountTween():void
	{
		// let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
		// if(!avatarComponent) return;
		// avatarComponent.mountDown.addChild(this.mc);
		// avatarComponent.mountUp.addChild(this.maskMc);
		this.maskMc.alpha = this.mc.alpha = 1;
		// egret.Tween.get(this.mc).to({alpha:1},500);
		// egret.Tween.get(this.maskMc).to({alpha:1},500);
	}

	public hideMountTween(needCall:boolean = true):void
	{
		if(needCall) {
			this.mc.reset();
			this.maskMc.reset();
			App.DisplayUtils.removeFromParent(this.mc);
			App.DisplayUtils.removeFromParent(this.maskMc);
		}
		else {
			this.maskMc.alpha = this.mc.alpha = 0;
		}
		// this.playAction(Action.Move,this.entity.dir);
		// this.maskMc.alpha = this.mc.alpha = 1;
		// egret.Tween.get(this.mc).to({alpha:0},500);
		// if(needCall)
		// {
		// 	egret.Tween.get(this.maskMc).to({alpha:0},500)
		// 	.call(function (){
		// 		this.mc.reset();
		// 		this.maskMc.reset();
		// 		App.DisplayUtils.removeFromParent(this.mc);
		// 		App.DisplayUtils.removeFromParent(this.maskMc);
		// 	},this);
		// }
		// else egret.Tween.get(this.maskMc).to({alpha:0},500);
	}

	// public resetAlpha():void
	// {
		// if(this.entity.isOnMount)
		// {
		// 	egret.Tween.removeTweens(this.mc);
		// 	egret.Tween.removeTweens(this.maskMc);
		// 	this.mc.alpha = this.maskMc.alpha = 1;
		// }
	// }

	public stop(): void 
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(_avatarComponent) _avatarComponent.setMount(null);
		// egret.Tween.removeTweens(this.mc);
		// egret.Tween.removeTweens(this.maskMc);
		// this.mc.alpha = this.maskMc.alpha = 1;
        super.stop();
        this.maskMc.destroy();
        this.maskMc = null;
		// this.isFirst = true;
    }
}