class AvatarSoulComponent extends AvatarPartComponent
{
	private modelId:number;
	private gTime:number = 0;
	public constructor() 
	{
		super();
	}

	public start(): void 
	{
        super.start();
		this.updateSoul();
	}

	public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
		
	}

	public updateSoul():void
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarComponent) return;
		this.modelId = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeSwordPool);
		if(this.modelId && this.modelId > 0)
		{
			this.mc.setComplateAction(this.onPlayComplete,this);
			this.mc.setData(this.entity.rootPath + "show/soul/", this.modelId + "", AvatarType.Soul, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSoul));
			this.mc.gotoAction(Action.Stand,Dir.Bottom,null,0,1);
			_avatarComponent.soulLayer.addChild(this.mc);
		}
		else
		{
			this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
		}
	}

	public update(advancedTime: number): void 
	{
        super.update(advancedTime);
		if(this.gTime == 0 || !this.modelId) return;
		if(egret.getTimer() - this.gTime > 5000)
		{
			this.mc.gotoAction(Action.Stand,Dir.Bottom,null,0,1);
			this.mc.visible = true;
			this.gTime = 0;
		}
	}

	private onPlayComplete():void
	{
		this.gTime = egret.getTimer();
		this.mc.visible = false;
	}

	public stop():void
	{
		this.mc.visible = true;
		super.stop();
		this.modelId = 0;
		this.gTime = 0;
	}
}