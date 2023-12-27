class TeamMemberIconItem extends ListRenderer
{
	private controller:fairygui.Controller;
	private headIcon:GLoader;
	private levelTxt:fairygui.GTextField;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.levelTxt = this.getChild("level_txt").asTextField;
	}

	public setData(data:any):void
	{
		this._data = data;
		if(!data)
		{
			this.controller.selectedIndex = 3;
			return;
		}
		this.grayed = false;
		this.controller.selectedIndex = CacheManager.team.getMemberState(data);
		if(data.online_BY == 0)
		{
			this.grayed = true;
		}
		this.headIcon.url = URLManager.getPlayerHead(data.career_SH);
		this.levelTxt.text = "Lv." + data.level_SH;
	}
}