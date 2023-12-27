class AvatarSpriteComponent extends AvatarPartComponent
{
	private START_POINT_X:number = -120;
	private START_POINT_Y:number = -140;

	private modelId:number;
	private gFollowSp:egret.Sprite;
	private gTurnSp:egret.Sprite;

	/**上半圈曲线控制点 */
	private upControllerPts:number[];
	/**下半圈曲线控制点 */
	private downControllerPts:number[];
	// private controllerPts:egret.Point[];
	// /**开始点 */
	// private startPt:egret.Point = new egret.Point(0,0);
	// /**结束点 */
	// private endPt:egret.Point = new egret.Point(0,0);
	private controllerPts:number[]
	private startX:number = 0;
	private startY:number = 0;
	private endX:number = 0;
	private endY:number = 0;

	/**触发围绕人物旋转的时间间隔 */
	private gTime:number;
	/**旋转持续时间 */
	private gTurnTime:number;
	/**是否正在旋转中 */
	private gIsTurn:boolean;
	/**前后显示层级改变 */
	private gChange:boolean = false;

	/**当前精灵朝向 */
	private gCurDir:Dir;
	public constructor() 
	{
		super();
		this.upControllerPts = [120,-140];
		this.downControllerPts = [120,80];
	}

	public start(): void 
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarComponent) return;
        super.start();

		this.gFollowSp = new egret.Sprite();
		// this.gFollowSp.graphics.beginFill(0xff0000,0.8);
		// this.gFollowSp.graphics.drawRect(0,0,200,100);
		this.gFollowSp.x = this.START_POINT_X;
		this.gFollowSp.y = this.START_POINT_Y;
		_avatarComponent.spriteLayer.addChild(this.gFollowSp);

		this.gTurnSp = new egret.Sprite();
		// this.gTurnSp.graphics.beginFill(0x00ff00,0.8);
		// this.gTurnSp.graphics.drawRect(0,0,100,50);
		this.gFollowSp.addChild(this.gTurnSp);
		this.gTurnSp.addChild(this.mc);
		_avatarComponent.attach(ComponentType.AvatarSprite,this);
		this.updateSprite();

		this.gTime = 0;
		this.gTurnTime = 0;
    }

	public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
		if(!this.modelId || this.gIsTurn) return;
		if(gotoDir == Dir.Top) gotoDir = Dir.TopRight;
		else if(gotoDir == Dir.Left) gotoDir = Dir.BottomLeft;
		else if(gotoDir == Dir.Right || gotoDir == Dir.Bottom) gotoDir = Dir.BottomRight;
		super.playAction(Action.Stand, gotoDir, compFun, attackNO);
	}

	public updateSprite():void
	{
		this.modelId = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeSpirit);
		if(this.modelId && this.modelId > 0)
		{
			this.gTurnSp.addChild(this.mc);
			this.mc.setData(this.entity.rootPath + "spirit/", this.modelId + "", AvatarType.Spirit, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSprite));
			this.playAction(Action.Stand,this.entity.dir);
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
		if(!this.modelId) return;
		if(!this.gIsTurn) 
		{
			this.gTime ++;
			if(this.gTime > 1800)
			{
				// this.startPt.x = this.gTurnSp.x;
				// this.startPt.y = this.gTurnSp.y;
				// this.endPt.x = 240;
				this.startX = this.gTurnSp.x;
				this.startY = this.gTurnSp.y;
				this.endX = 240;
				this.endY = 0;
				this.gTime = 0;
				this.controllerPts = this.upControllerPts;
				this.gIsTurn = true;
			}
		}
		else
		{
			this.startTurn();
		}
    }

	private startTurn():void
	{
		let _time:number = (this.gTurnTime % 500) + 1;
		let _pt:number[] = App.MathUtils.getBezierCurve(this.startX,this.startY,this.endX,this.endY,_time,500,this.controllerPts);
		//App.MathUtils.getBezierCurve(this.startPt,this.endPt,this.controllerPts,_time,500);
		this.gTurnSp.x = _pt[0];
		this.gTurnSp.y = _pt[1];
		this.gTurnTime ++;
		// let _sp:egret.Sprite = new egret.Sprite();
		// _sp.graphics.beginFill(0x0000ff);
		// _sp.graphics.drawRect(0,0,2,2);
		// _sp.x = _pt.x;
		// _sp.y = _pt.y;
		// this.gFollowSp.addChild(_sp);
		if(this.gTurnTime >= 1000)
		{
			this.gTurnTime = 0;
			this.setMcDir(Dir.BottomRight);
			this.gTime = 0;
			this.gIsTurn = false
			this.gChange = false;
		}
		else if(this.gTurnTime >= 750)
		{
			this.setMcDir(Dir.TopLeft);
		}
		else if(this.gTurnTime >= 500)
		{
			if(!this.gChange)
			{
				this.gChange = true;
				this.startX = this.gTurnSp.x;
				this.startY = this.gTurnSp.y;
				this.endX = 0;
				this.endY = 0;
				// this.startPt.x = this.gTurnSp.x;
				// this.startPt.y = this.gTurnSp.y;
				// this.endPt.x = 0;
				// this.endPt.y = 0;
				this.controllerPts = this.downControllerPts;
				this.setMcDir(Dir.BottomLeft);
			}
		}
		else if(this.gTurnTime >= 250)
		{
			this.setMcDir(Dir.BottomRight);
		}
		else if(this.gTurnTime >= 0)
		{
			this.setMcDir(Dir.TopRight);
		}
	}

	private setMcDir(dir:Dir):void
	{
		if(this.gCurDir == dir) return;
		this.gCurDir = dir;
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(_avatarComponent && _avatarComponent.body.parent)
		{
			if(dir == Dir.TopRight) _avatarComponent.mainLayer.setChildIndex(_avatarComponent.spriteLayer,0);
			else if(dir == Dir.BottomLeft) 
			{
				let _index:number = _avatarComponent.mainLayer.getChildIndex(_avatarComponent.effectUpLayer) - 1;
				_avatarComponent.mainLayer.setChildIndex(_avatarComponent.spriteLayer,_index);
			}
		}
		this.mc.gotoAction(Action.Stand,this.gCurDir);
	}

	public stop():void
	{
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(_avatarComponent) _avatarComponent.attach(ComponentType.AvatarSprite,null);
		super.stop();
		this.modelId = 0;

		this.gTurnSp.x = this.gTurnSp.y = 0;
		this.gIsTurn = false;
		this.gTime = 0;
		this.gTurnTime = 0;
		this.gChange = false;
	}
}