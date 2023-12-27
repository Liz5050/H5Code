class AvatarLawComponent extends AvatarPartComponent
{
	// private isFirst:boolean = true;
	public constructor() 
	{
		super();
	}

	public start(): void 
	{
		super.start();
		// this.mc.setData(this.entity.rootPath + "law/", this.entity.mountName, AvatarType.Mount);
		this.updateLaw();
	}

	public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
		if(gotoAction == Action.Die)
		{
			this.mc.visible = false;
			return;
		}
		this.mc.visible = true;
	}

	public updateLaw():void
	{
		let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
		if(!avatarComponent) return;
		egret.Tween.removeTweens(this.mc);
		let _lawId:number = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeShapeBattle);
		if(_lawId && _lawId > 0)
		{
			this.mc.setData(this.entity.rootPath + "shapeBattle/", _lawId + "", AvatarType.Law, LoaderPriority.getPriority(this.entity, ComponentType.AvatarLaw));
			avatarComponent.mountDown.addChild(this.mc);
			// if(!this.isFirst)
			// {
			// 	this.showLawTween();
			// }
			this.mc.gotoAction(Action.Stand,Dir.Bottom);
			this.playAction(this.entity.action,this.entity.dir);
		}
		else
		{
			this.hideLawTween();
		}
		// this.isFirst = false;
	}

	private showLawTween():void
	{
		this.mc.alpha = 0;
		egret.Tween.get(this.mc).to({alpha:1},500);
	}

	private hideLawTween():void
	{
		if(!this.mc.parent) return;
		this.mc.reset();
		App.DisplayUtils.removeFromParent(this.mc);
		// this.mc.alpha = 1;
		// egret.Tween.get(this.mc).to({alpha:0},500)
		// .call(function (){
		// 	this.mc.reset();
		// 	App.DisplayUtils.removeFromParent(this.mc);
		// },this);
	}

	public stop(): void 
	{
		// egret.Tween.removeTweens(this.mc);
		super.stop();
		// this.isFirst = true;
	}
}