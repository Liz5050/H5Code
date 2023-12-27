class AvatarSwordPoolComponent extends AvatarPartComponent {
    
 	private modelId:number;
	private gTime:number = 0;
	private gNum : number = 0;
	private cdTime : number = 3000;//间隔时间
	private cdNum : number = 3;//间隔次数
	private startTime : number = 0;

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
		if(gotoAction == Action.Die)
		{
			this.mc.visible = false;
			return;
		}
		this.mc.visible = true;
	}

	public updateSoul():void
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarComponent) return;
		this.modelId = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeShapeSwordPool);
		if(this.modelId && this.modelId > 0)
		{
			this.mc.setComplateAction(this.onPlayComplete,this);
			this.mc.setData(this.entity.rootPath + "swordPool/", this.modelId + "", AvatarType.SwordPool, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSwordPool));
			this.mc.gotoAction(Action.Stand,Dir.Bottom,null);
			this.startTime = egret.getTimer();
			_avatarComponent.swordLayer.addChild(this.mc);
			this.playAction(this.entity.action,this.entity.dir);
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
		if(!this.modelId) {
			return;
		}
		if(this.startTime != 0) {
			if(egret.getTimer() - this.startTime > this.cdNum * this.mc.playTime) {
				this.hideTween();
				this.gTime = egret.getTimer();
				this.startTime = 0;
			}
			return;
		}
		if(this.gTime != 0 ) {
			if(egret.getTimer() - this.gTime > this.cdTime) {
				this.showTween();
				this.gTime = 0;
				this.startTime = egret.getTimer();
			}
			return;
		}

		

	}

	private onPlayComplete():void
	{

	}

	public stop():void
	{
		this.mc.visible = true;
		super.stop();
		this.modelId = 0;
		this.gTime = 0;
	}

	private showTween():void
	{
		this.mc.alpha = 0;
		egret.Tween.get(this.mc).to({alpha:1},500);
	}

	private hideTween():void
	{
		this.mc.alpha = 1;
		egret.Tween.get(this.mc).to({alpha:0},500);
	}
}