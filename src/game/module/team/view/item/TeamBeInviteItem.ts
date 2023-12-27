class TeamBeInviteItem extends ListRenderer
{
	private agreeBtn:fairygui.GButton;
	private rejectBtn:fairygui.GButton;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_playerName").asTextField;
		this.levelTxt = this.getChild("txt_playerLevel").asTextField;

		this.agreeBtn = this.getChild("btn_agree").asButton;
		this.rejectBtn = this.getChild("btn_refuse").asButton;
		this.agreeBtn.addClickListener(this.onAgreeHandler,this);
		this.rejectBtn.addClickListener(this.onRejectHandler,this);
	}

	public setData(data:any):void
	{
		this._data = data;
		this.nameTxt.text = data.player.name_S;
		this.levelTxt.text = "Lv." + data.player.level_SH;
	}

	private onAgreeHandler():void
	{
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,this._data.player.entityId,this._data.certId_S,true,EGroupMsgType.EGroupMsgTypeInvite);
	}

	private onRejectHandler():void
	{
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,this._data.player.entityId,this._data.certId_S,false,EGroupMsgType.EGroupMsgTypeInvite);
	}
}