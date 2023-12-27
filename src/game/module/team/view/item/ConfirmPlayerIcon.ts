class ConfirmPlayerIcon extends ListRenderer
{
	private headIcon:GLoader;
	private levelTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private captainIcon:fairygui.GImage;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.captainIcon = this.getChild("n9").asImage;
		this.captainIcon.visible = false;
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.levelTxt = this.getChild("txt_PlayerLevel").asTextField;
		this.nameTxt = this.getChild("txt_PlayerName").asTextField;
		this.headIcon.grayed = true;
	}
	
	public setData(data:any):void
	{
		this._data = data;
		if(!data)
		{
			this.visible = false;
			return;
		}
		this.visible = true;
		this.captainIcon.visible = CacheManager.team.getEntityIsCaptain(data.entityId);
		this.headIcon.grayed = !this.captainIcon.visible;
		this.headIcon.url = URLManager.getPlayerHead(data.career_SH);
		this.nameTxt.text = data.name_S;
		let _baseLv:number = ConfigManager.const.getConstValue("DianFengBaseLevel");
		if(data.level_SH < _baseLv)
		{
			this.levelTxt.text = "Lv." + data.level_SH;
		}
		else
		{
			this.levelTxt.text = CacheManager.team.getLevelStr(data.level_SH)
		}
	}

	public setConfirmState(isAgree:boolean):void
	{
		this.headIcon.grayed = !isAgree;
	}
}