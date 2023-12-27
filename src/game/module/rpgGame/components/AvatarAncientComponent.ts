class AvatarAncientComponent extends Component {
	private modelId:number;
	private gTime:number = 0;
	protected mc:MovieClip;

	public constructor() {
		super();
	}
	public start(): void {
        super.start();

        this.mc = ObjectPool.pop("MovieClip");
		
        // this.mc.setComplateAction(this.complateAction, this);
		this.updateAncient();
    }

    public stop(): void {
        super.stop();
		App.TimerManager.remove(this.updateAncient,this);
        this.mc.destroy();
        this.mc = null;
    }

	public updateAncient():void
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarComponent) return;
		if(!this.mc){
			return;
		}
		this.mc.visible = true;
		this.modelId = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeForeverEquipSuit);
		if(this.modelId && this.modelId > 0)
		{
			let url:string = this.entity.rootPath + "ancient/"+ this.modelId + "";
			this.mc.playFile(url,2,ELoaderPriority.DEFAULT,this.onPlayComplete,true,this);
			_avatarComponent.ancientLayer.addChild(this.mc);
		}
		else
		{
			this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
		}
	}
	private onPlayComplete():void
	{
		this.gTime = egret.getTimer();
		this.mc.visible = false;
		App.TimerManager.doDelay(5000,this.updateAncient,this);
	}
}