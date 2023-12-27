class TeamApplyPlayerItem extends ListRenderer
{
	private headIcon:GLoader;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;
	private yesBtn:fairygui.GButton;
	private noBtn:fairygui.GButton;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_PlayerName").asTextField;
		this.levelTxt = this.getChild("txt_PlayerLevel").asTextField;

		this.yesBtn = this.getChild("n6").asButton;
		this.noBtn = this.getChild("n9").asButton;
		this.yesBtn.addClickListener(this.onAgreeHandler,this);
		this.noBtn.addClickListener(this.onRejectHandler,this);
	}

	public setData(data:any,index:number):void
	{
		this._data = data;
		this.itemIndex = index;
		this.headIcon.url = URLManager.getPlayerHead(data.player.career_SH);
		this.nameTxt.text = data.player.name_S;
		this.levelTxt.text = "Lv." + data.player.level_SH;
	}

	private onAgreeHandler():void
	{
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,this._data.player.entityId,this._data.certId_S,true);
	}

	private onRejectHandler():void
	{
		EventManager.dispatch(LocalEventEnum.TeamApplyDeal,this._data.player.entityId,this._data.certId_S,false);
	}
}