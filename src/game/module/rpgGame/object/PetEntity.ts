class PetEntity extends RpgGameObject
{
	public constructor() 
	{
		super();
        this.objType = RpgObjectType.Pet;
	}

	public init(data: EntityInfo):void
	{
		super.init(data);
		this.addComponent(ComponentType.Aoi);
		this.addComponent(ComponentType.Move);

		// //被创建时直接检测进入地图类型说话
		// //刚进入地图如有宠物必定创建宠物
		// this.updateTalk(PetTalkCondition.EnterMap);
        this._hasInit = true;
	}

	public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.AvatarMc);
			let _player:RpgGameObject;
			if(EntityUtil.isBelongToMine(this))
			{
				_player = CacheManager.king.leaderEntity;
				this.addComponent(ComponentType.Talk);
			}
			else
			{
				_player = CacheManager.map.getBelongEntity(this.entityInfo.entityId,EEntityType.EEntityTypePlayer);
				this.updateModelIsShow();
			}
			if(_player)
			{
				let isHide:boolean = _player.entityInfo.weapons[EEntityAttribute.EAttributeNotShowShapePet] == 1 || !_player.avatar || !_player.avatar.isShow;
				this.updateNotShow(isHide);
			}
        } 
		else 
		{
            this.removeComponent(ComponentType.AvatarMc);
			this.removeComponent(ComponentType.Talk);
        }
    }

	public updateModelIsShow():void
    {
        let _avatarComponent:AvatarLayerComponent = this.getComponent(ComponentType.AvatarMc) as AvatarLayerComponent;
        if(!_avatarComponent) return;
		if(EntityUtil.isBelongToMine(this)) 
		{
			return;
		}
		let _player:RpgGameObject = CacheManager.map.getBelongEntity(this.entityInfo.entityId,EEntityType.EEntityTypePlayer);
		if(_player && _player.entityInfo.weapons[EEntityAttribute.EAttributeNotShowShapePet] == 1) 
		{
			_avatarComponent.hide();
			return;
		}
        _avatarComponent.updateModelIsShow(LocalEventEnum.HideOther);
    }

	public updateNotShow(isHide:boolean):void
	{
		let _avatarComponent:AvatarLayerComponent = this.getComponent(ComponentType.AvatarMc) as AvatarLayerComponent;
        if(!_avatarComponent) return;
		if(CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther]) && !EntityUtil.isBelongToMine(this)) 
		{
			_avatarComponent.hide();
			return;
		}
		if(isHide)
		{
			_avatarComponent.hide();
		}
		else
		{
			_avatarComponent.show();
		}
	}

	public updateTalk(condition:PetTalkCondition):void
	{
		let _talkCom:TalkComponent = this.getComponent(ComponentType.Talk) as TalkComponent;
		if(_talkCom) 
		{
			let _talkData:PetTalkData = ConfigManager.petTalk.getRandomTalkData(condition);
			if(_talkData) _talkCom.talk(_talkData.content,_talkData.durationTime);
		}
	}

	public updatePet():void
	{
		let _avatarComponent:AvatarComponent = this.getComponent(ComponentType.AvatarMc) as AvatarComponent;
		if(!_avatarComponent) return;
		_avatarComponent.updateBody(true);
	}

	public get mcName():string
    {
		let modelId:number = this.entityInfo.getModelId(EEntityAttribute.EAttributeClothes);
        return modelId + "/" + modelId;
    }
}