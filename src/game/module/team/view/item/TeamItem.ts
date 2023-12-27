class TeamItem extends ListRenderer
{
	private headIcon:GLoader;
	private memberNumTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;
	private applyBtn:fairygui.GButton;
	
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.memberNumTxt = this.getChild("txt_number").asTextField;
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_playername").asTextField;
		this.levelTxt = this.getChild("txt_playerlevel").asTextField;
		this.applyBtn = this.getChild("btn_apply").asButton;
		this.applyBtn.addClickListener(this.onApplyTeamHandler,this);
	}

	/**
	 * ::Message::Public::SPublicMiniPlayer captain;
         SEntityId groupId;          //队伍ID
         int playerNum;
         int maxNum;
	 */
	public setData(data:any):void
	{
		this._data = data;
		this.memberNumTxt.text = data.playerNum_I + "/" + data.maxNum_I;
		this.headIcon.url = URLManager.getPlayerHead(data.captain.career_SH);
		this.nameTxt.text = data.captain.name_S;
		this.levelTxt.text = "Lv." + data.captain.level_SH;
	}

	/**申请入队 */
	private onApplyTeamHandler():void
	{
		if(this._data.maxNum_I == this._data.playerNum_I)
		{
			Tip.showTip("队伍已满");
			return;
		}
		EventManager.dispatch(LocalEventEnum.ApplyEnterTeam,this._data.captain.entityId);
	}
}