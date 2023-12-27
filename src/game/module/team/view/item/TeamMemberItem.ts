class TeamMemberItem extends ListRenderer
{
	private controller:fairygui.Controller;
	private headIcon:GLoader;
	private itemGroup:fairygui.GGroup;
	private matchingGroup:fairygui.GGroup;

	private matchingTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;

	private operateBtn:fairygui.GButton;
	private captainIcon:fairygui.GImage;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.itemGroup = this.getChild("group_item").asGroup;
		this.matchingGroup = this.getChild("group_matching").asGroup;

		this.matchingTxt = this.getChild("txt_matching").asTextField;
		this.nameTxt = this.getChild("txt_playername").asTextField;
		this.levelTxt = this.getChild("txt_playerlevel").asTextField;

		this.captainIcon = this.getChild("captain_icon").asImage;
		this.operateBtn = this.getChild("btn_teamOperate").asButton;
		this.operateBtn.addClickListener(this.onTeamOperateHandler,this);
	}

	public setData(data:any):void
	{
		this._data = data;
		if(!data)
		{
			this.itemGroup.visible = false;
			this.matchingGroup.visible = CacheManager.team.isMatching;
			this.matchingTxt.visible = CacheManager.team.isMatching;
			return;
		}
		this.matchingGroup.visible = this.itemGroup.visible = true;
		this.matchingTxt.visible = false;
		this.headIcon.url = URLManager.getPlayerHead(data.career_SH);
		this.nameTxt.text = data.name_S;
		this.levelTxt.text = "Lv." + data.level_SH;

		this.controller.selectedIndex = CacheManager.team.getMemberState(data);
		this.headIcon.grayed = data.online_BY == 0;
		
		this.operateBtn.visible = true;
		if(CacheManager.team.hasTeam)
		{
			this.captainIcon.visible = EntityUtil.isSame(data.entityId,CacheManager.team.teamInfo.captainId);
			if(EntityUtil.isMainPlayer(data.entityId))
			{
				this.operateBtn.text = "退出队伍";
			}
			else
			{
				if(CacheManager.team.captainIsMe)
				{
					this.operateBtn.text = "踢出队伍";
				}
				else
				{
					this.operateBtn.visible = false;
				}
			}
		}
		else
		{
			this.captainIcon.visible = false;
			this.operateBtn.visible = false;
		}
		
	}

	/**
	 * 踢人/退出操作
	 */
	private onTeamOperateHandler(evt:egret.Event):void
	{
		if(EntityUtil.isMainPlayer(this._data.entityId))
		{
			EventManager.dispatch(LocalEventEnum.ExitTeam);
		}
		else
		{
			EventManager.dispatch(LocalEventEnum.KickOutMember,this._data.entityId);
		}
		evt.stopImmediatePropagation();
	}
}