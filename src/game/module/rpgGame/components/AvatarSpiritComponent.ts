class AvatarSpiritComponent extends AvatarPartComponent
{
	/**
	 * 法宝相对人物起始位置 
	 */		
	private START_POINT_X:number = 120;
	private START_POINT_Y:number = -150;
		
	private gOwnerLastX:number;
	private gOwnerLastY:number;

	private gTurnSp:egret.Sprite;
	private gFollowSp:egret.Sprite;

	private modelId:number;

	/**上半圈曲线控制点 */
	private upControllerPts:number[];
	/**下半圈曲线控制点 */
	private downControllerPts:number[];
	// private controllerPts:egret.Point[];
	/**开始点 */
	// private startPt:egret.Point = new egret.Point(0,0);
	// /**结束点 */
	// private endPt:egret.Point = new egret.Point(0,0);
	private controllerPts:number[]
	private startX:number = 0;
	private startY:number = 0;
	private endX:number = 0;
	private endY:number = 0;

	/**触发法宝围绕人物旋转的时间间隔 */
	private gTime:number;
	/**法宝旋转持续时间 */
	private gTurnTime:number;
	/**是否正在旋转中 */
	private gIsTurn:boolean;
	/**前后显示层级改变 */
	private gChange:boolean = false;
	/**改变层级的时间点 */
	private gChangeIndexTime:number = -1;
	/**停留时间*/
	private gStopTime:number=0;
	public constructor() 
	{
		super();
		this.upControllerPts = [-160,-130];
		this.downControllerPts = [-100,100];
	}

	public start(): void 
	{
		let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
		if(!avatarComponent) return;
		super.start();

		this.gFollowSp = new egret.Sprite();
		// this.gFollowSp.graphics.beginFill(0xff0000,0.8);
		// this.gFollowSp.graphics.drawRect(0,0,200,100);
		this.gFollowSp.x = this.START_POINT_X;
		this.gFollowSp.y = this.START_POINT_Y;
		avatarComponent.faBaoLayer.addChild(this.gFollowSp);

		this.gTurnSp = new egret.Sprite();
		// this.gTurnSp.graphics.beginFill(0x00ff00,0.8);
		// this.gTurnSp.graphics.drawRect(0,0,100,50);
		this.gFollowSp.addChild(this.gTurnSp);
		this.gTurnSp.addChild(this.mc);

		this.updateSpirit();

		this.gOwnerLastX = this.entity.x;
		this.gOwnerLastY = this.entity.y;
		this.gTime = 0;
		this.gTurnTime = 0;
		this.gStopTime = 0;
	}

	public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void
	{
	}

	public updateSpirit():void
	{
		this.modelId = this.entity.entityInfo.getModelId(EEntityAttribute.EAttributeShapeSpirit);
		if(this.modelId && this.modelId > 0)
		{
			this.gTurnSp.addChild(this.mc);
			this.mc.setData(this.entity.rootPath + "spirit/", this.modelId + "", AvatarType.Spirit, LoaderPriority.getPriority(this.entity, ComponentType.AvatarSpirit));
			this.mc.gotoAction(Action.Stand,Dir.Bottom);
		}
		else
		{
			this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
		}
	}

	public update(advancedTime: number): void {
        super.update(advancedTime);
		if(!this.modelId) return;
		if(egret.getTimer()<this.gStopTime)return;
		let _changePosX:number = this.entity.x - this.gOwnerLastX;
		let _changePosY:number = this.entity.y - this.gOwnerLastY;
		if(_changePosX == 0 && _changePosY == 0)
		{
			if(!this.gIsTurn) 
			{
				this.gTime ++;
				if(this.gTime > 250)
				{
					this.startX = this.gTurnSp.x;
					this.startY = this.gTurnSp.y;
					this.endX = -220;
					this.endY = 40;
					// this.startPt.x = this.gTurnSp.x;
					// this.startPt.y = this.gTurnSp.y;
					// this.endPt.x = -220;
					// this.endPt.y = 40;
					this.gTime = 0;
					this.controllerPts = this.upControllerPts;
					this.gIsTurn = true;
				}
			}
		}
		else
		{
			this.gFollowSp.x -= _changePosX;
			this.gFollowSp.y -= _changePosY;
			if(this.gFollowSp.x > this.START_POINT_X + 40) this.gFollowSp.x = this.START_POINT_X + 40;
			if(this.gFollowSp.x < -this.START_POINT_X - 60) this.gFollowSp.x = -this.START_POINT_X - 60;
			if(this.gFollowSp.y < this.START_POINT_Y - 20) this.gFollowSp.y = this.START_POINT_Y - 20;
			if(this.gFollowSp.y > this.START_POINT_Y + 20) this.gFollowSp.y = this.START_POINT_Y + 20;
		}

		if(this.gFollowSp.x != this.START_POINT_X || this.gFollowSp.y != this.START_POINT_Y)
		{
			this.moveToStart();
		}
		this.gOwnerLastX = this.entity.x;
		this.gOwnerLastY = this.entity.y;

		if(this.gIsTurn)
		{
			this.startTurn();
		}
    }

	private startTurn():void
	{
		let _time:number = (this.gTurnTime % 500) + 1;
		let _pt:number[] = App.MathUtils.getBezierCurve(this.startX,this.startY,this.endX,this.endY,_time,500,this.controllerPts);
		//App.MathUtils.getBezierCurve(this.startPt,this.endPt,this.controllerPts,_time,500);
		if(_pt) {
			this.gTurnSp.x = _pt[0];
			this.gTurnSp.y = _pt[1];
		}
		this.gTurnTime ++;
		if(this.gTurnTime >= 1000)
		{
			this.gTurnTime = 0;
			this.gTime = 0;
			this.gIsTurn = false
			this.gChange = false;
			this.gChangeIndexTime = -1;
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
				this.changeChildIndex(500);
			}
		}
		else if(this.gTurnTime >= 0)
		{
			this.changeChildIndex(0);
		}
	}

	private moveToStart():void
	{
		let _dirX:number = 0;
		let _dirY:number = 0;
		if(this.gFollowSp.x < this.START_POINT_X) _dirX = 1;
		if(this.gFollowSp.x > this.START_POINT_X) _dirX = -1;
		if(this.gFollowSp.y < this.START_POINT_Y) _dirY = 1;
		if(this.gFollowSp.y > this.START_POINT_Y) _dirY = -1;
		this.gFollowSp.x += 1 * _dirX;
		this.gFollowSp.y += 1 * _dirY;
	}

	private changeChildIndex(time:number):void
	{
		if(this.gChangeIndexTime == time) return;
		this.gChangeIndexTime = time;
		let _avatarComponent:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarComponent || !_avatarComponent.body.parent) return;
		if(time == 0) _avatarComponent.mainLayer.setChildIndex(_avatarComponent.faBaoLayer,0);
		else if(time == 500) 
		{
			let _index:number = _avatarComponent.mainLayer.getChildIndex(_avatarComponent.effectUpLayer) - 1;
			_avatarComponent.mainLayer.setChildIndex(_avatarComponent.faBaoLayer,_index);
		}
	}

	// private getTestSp(color:number = 0x00ff00):egret.Sprite
	// {
	// 	let _sp:egret.Sprite = new egret.Sprite();
	// 	_sp.graphics.beginFill(color);
	// 	_sp.graphics.drawRect(0,0,2,2);
	// 	return _sp;
	// }

	public stop():void
	{
		super.stop();
		this.modelId = 0;

		this.gFollowSp.x = this.START_POINT_X;
		this.gFollowSp.y = this.START_POINT_Y;

		this.gTurnSp.x = this.gTurnSp.y = 0;
		this.gIsTurn = false;
		this.gChangeIndexTime = -1;
		this.gTurnTime = 0;
		this.gTime = 0;
		this.gChange = false;
		this.gStopTime = 0;
	}

	public get centerPos():egret.Point
	{
		return new egret.Point(this.gFollowSp.x + this.gTurnSp.x + this.mc.x, this.gFollowSp.y + this.gTurnSp.y + this.mc.y);
	}

	public playAttack(time:number = 1500):void
    {
        this.gStopTime = egret.getTimer() + time;
    }
}