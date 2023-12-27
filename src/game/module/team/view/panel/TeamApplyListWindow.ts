class TeamApplyListWindow extends BaseWindow
{
	private autoAgree:fairygui.GButton;
	private applyList:List;
	private allRejectBtn:fairygui.GButton;
	public constructor() 
	{
		super(PackNameEnum.Team,"ApplyListWindow");
	}

	public initOptUI():void
	{
		this.autoAgree = this.getGObject("check_auto").asButton;
		this.autoAgree.addClickListener(this.onChangeAutoHandler,this);
		this.allRejectBtn = this.getGObject("btn_refuse").asButton;
		this.allRejectBtn.addClickListener(this.onAllRejectHandler,this);

		this.applyList = new List(this.getGObject("list_apply").asList);
	}

	public updateAll():void
	{
		this.autoAgree.selected = CacheManager.team.autoEnter;
		this.updateApplyList();
	}

	public updateApplyList():void
	{
		let _list:any[] = CacheManager.team.applyDataList;
		this.applyList.data = _list;
	}

	public removeApplyItem(entityId:any):void
	{
		if(entityId == 0) return;
		let _list:any[] = CacheManager.team.applyDataList;
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
			this.applyList.deleteListItem(_index);
		}
	}

	/**自动同意入队申请状态设置 */
	private onChangeAutoHandler():void
	{
		EventManager.dispatch(LocalEventEnum.TeamAutoSettingChange,this.autoAgree.selected);
	}

	/**全部拒绝 */
	private onAllRejectHandler():void
	{
		this.applyList.data = null;
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,{id_I:0,type_BY:0,typeEx2_BY:0,typeEx_SH:0},"",false);
	}
}