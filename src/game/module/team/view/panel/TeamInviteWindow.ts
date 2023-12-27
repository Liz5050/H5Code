class TeamInviteWindow extends BaseWindow
{
	private controller:fairygui.Controller;
	private inviteList:List;
	private teamType : number;


	public constructor() 
	{
		super(PackNameEnum.Team,"TeamInviteWindow");
	}

	public initOptUI():void
	{
		// this.controller = this.getController("c1");
		this.inviteList = new List(this.getGObject("list_Invite").asList);
		// this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onChangeIndexHandler,this);
	}

	public updateAll(teamType : number):void
	{
		this.teamType = teamType;
		let state = CacheManager.team2.curTeamCopyCfg.enterMinRoleState;
		this.inviteList.data = CacheManager.friend.getFriendList(state);
	}

	public updatePlayerList():void
	{
		if(this.controller.selectedIndex == 2)
		{
			this.inviteList.data = CacheManager.team.nearbyPlayerList;
		}
	}

	public removeInviteItem(entityId:any):void
	{
		if(!entityId) return;
		let _list:any[];
		if(this.controller.selectedIndex == 2)
		{
			_list = CacheManager.team.nearbyPlayerList;
		}
		if(!_list) return;
		let _index:number = -1;
		for(let i:number = 0; i < _list.length; i++)
		{
			if(EntityUtil.isSame(_list[i].entityId,entityId))
			{
				_index = i;
				break;
			}
		}
		if(_index != -1)
		{
			this.inviteList.deleteListItem(_index);
		}
	}

	private onChangeIndexHandler():void
	{
		let _index:number = this.controller.selectedIndex;
		this.inviteList.data = null;
		switch(_index)
		{
			case 0:
				//好友
				break;
			case 1:
				//仙盟
				break;
			case 2:
				//附近
				EventManager.dispatch(LocalEventEnum.GetNearbyPlayerList);
				break;
		}
	}
}