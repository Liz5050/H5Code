class ArrowComponent extends Component
{
	private gArrowMc:RpgMovieClip;
	private gTargetX:number = -1;
	private gTargetY:number = -1;
	private gDir:Dir;
	public constructor() 
	{
		super();
	}

	public start(): void 
	{
        super.start();
		let _avatarCom:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarCom) return;
		this.gArrowMc = ObjectPool.pop("RpgMovieClip");
		this.gArrowMc.setData(ResourcePathUtils.getRPGGameCommon(),"arrow", AvatarType.Player, LoaderPriority.getPriority(this.entity));
		_avatarCom.effectDownLayer.addChild(this.gArrowMc);
		this.gArrowMc.gotoAction(Action.Stand,this.entity.dir);
		this.updateTargetPos();
    }

	public updateTargetPos():void
	{
		if(CacheManager.copy.isInCopy)
		{
			this.gArrowMc.visible = false;
			this.gTargetX = this.gTargetY = -1;
			return;
		}
		
		let _playerTask:TaskBase = TaskUtil.getPlayerTask(CacheManager.task.currentTraceTask);
		if(_playerTask)
		{
			let _pt:TaskPoint = _playerTask.getCurTaskPoint();
			let _npc:any;
			if(_pt)
			{
				this.gArrowMc.visible = true;
				if(_pt.npcId > 0)
				{
					_npc = ConfigManager.map.getNpc(_pt.npcId);
					if(!_npc){
						return;
					}
					if(_npc.mapId == CacheManager.map.mapId)
					{
						this.gTargetX = _npc.point.x;
						this.gTargetY = _npc.point.y;
					}
					else
					{
						let _passPoint:any = ConfigManager.map.getPassPoint(CacheManager.map.mapId,_npc.mapId);
						if(_passPoint && _passPoint.mapId == CacheManager.map.mapId)
						{
							this.gTargetX = _passPoint.point.x;
							this.gTargetY = _passPoint.point.y;
						}
					}
				}
				else
				{
					this.gTargetX = _pt.x;
					this.gTargetY = _pt.y;
				}
			}
		}
		if(this.gTargetX == -1)
		{
			this.gArrowMc.visible = false;	
		}
	}

	public update(advancedTime: number): void 
	{
		if(this.gTargetX != -1)
		{
			if(this.updateArrowDir())
			{
				this.gArrowMc.gotoAction(Action.Stand,this.gDir);
			}
		}
		else if(this.gArrowMc.visible)
		{
			this.gArrowMc.visible = false;
		}
    }

	private updateArrowDir():boolean
	{
		let _col:number = this.entity.col;		
		let _row:number = this.entity.row;
		let _dir:Dir;
		if(_col < this.gTargetX)
		{
			if(_row > this.gTargetY)
			{
				_dir = Dir.TopRight;
			}
			else if(_row < this.gTargetY)
			{
				_dir = Dir.BottomRight;
			}
			else 
			{
				_dir = Dir.Right;
			}
		}
		else if(_col > this.gTargetX)
		{
			if(_row > this.gTargetY)
			{
				_dir = Dir.TopLeft;
			}
			else if(_row < this.gTargetY)
			{
				_dir = Dir.BottomLeft;
			}
			else 
			{
				_dir = Dir.Left;
			}
		}
		else
		{
			if(_row > this.gTargetY)
			{
				_dir = Dir.Top;
			}
			else if(_row < this.gTargetY)
			{
				_dir = Dir.Bottom;
			}
			else 
			{
				_dir = this.entity.dir;
			}
		}
		if(this.gDir == _dir) return false;
		this.gDir = _dir;
		return true;
	}

	public stop():void
	{
		super.stop();
		this.gTargetX = -1;
		this.gTargetY = -1;
		this.gDir = null;
		this.gArrowMc.destroy();
		this.gArrowMc = null;
	}
}