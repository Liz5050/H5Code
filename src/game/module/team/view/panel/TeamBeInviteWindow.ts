class TeamBeInviteWindow extends BaseWindow
{
	private beinviteList:List;
	private ignoreBtn:fairygui.GButton;
	public constructor() 
	{
		super(PackNameEnum.Team,"TeamBeinviteWindow");
	}

	public initOptUI():void
	{
		this.beinviteList = new List(this.getGObject("list_beInvite").asList);
		this.ignoreBtn = this.getGObject("btn_allIgnore").asButton;
		this.ignoreBtn.addClickListener(this.onIgnoreHandler,this);
	}

	public updateAll():void
	{
		this.updateInviteList();
	}

	public updateInviteList():void
	{
		this.beinviteList.data = CacheManager.team.inviteMeTeamList;
	}

	public removeBeInviteItem(entityId:any):void
	{
		if(entityId == 0) return;
		let _list:any[] = CacheManager.team.inviteMeTeamList;
		let _index:number = -1;
		for(let i:number = 0; i < _list.length; i++)
		{
			if(EntityUtil.isSame(_list[i].player.entityId,entityId))
			{
				_index = i;
				break;
			}
		}
		if(_index != -1)
		{
			this.beinviteList.deleteListItem(_index);
		}
	}

	private onIgnoreHandler():void
	{
		this.beinviteList.data = null;
		CacheManager.team.inviteMeTeamList = [];
		// EventManager.dispatch(LocalEventEnum.TeamAllIgnoreInvite);
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,{id_I:0,type_BY:0,typeEx2_BY:0,typeEx_SH:0},"",false);
	}
}