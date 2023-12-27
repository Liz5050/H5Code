class TeamInvitePlayerItem extends ListRenderer
{
	private headIcon:GLoader;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;
	private inviteBtn:fairygui.GButton;
    private stateTxt: fairygui.GTextField;
    private c1: fairygui.Controller;
	private cdTime : number = 10000;
	private sendTime : number = 0;

	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.c1 = this.getController('c1');
		this.headIcon = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_PlayerName").asTextField;
		this.levelTxt = this.getChild("txt_PlayerLevel").asTextField;
		this.stateTxt = this.getChild("txt_state").asTextField;

		this.inviteBtn = this.getChild("btn_invite").asButton;
		this.inviteBtn.addClickListener(this.onInviteHandler,this);
	}

	public setData(data:any,index:number):void
	{
		this._data = data;
		this.itemIndex = index;
		this.headIcon.load(URLManager.getPlayerHead(data.career));
		this.nameTxt.text = data.name;
		this.levelTxt.text = "Lv." + data.level;
		let state:number = CareerUtil.getRebirthTimes(data.career);
		this.stateTxt.text = state > 0 ? state + "转" : "";
		this.c1.selectedIndex = data.online ? 1 : 0;
		this.headIcon.grayed = !this._data.online;
	}

	private onInviteHandler():void
	{
		if (!this._data.online) {
			Tip.showTip(LangLegend.LANG32);
			return;
        }
		let timestamp = new Date().getTime();
        if(timestamp - this.sendTime < this.cdTime) {
            let leftTime = 10 - Math.floor((timestamp - this.sendTime)/1000);
            Tip.showTip(App.StringUtils.substitude(LangLegend.LANG33, leftTime ));
            return;
        }
        this.sendTime = timestamp;
		if(CacheManager.team2.captainIsMe) {
			EventManager.dispatch(LocalEventEnum.TeamCrossInviteFriend, this._data.entityId);
			Tip.showTip(LangTeam2.LANG22);
		}
		else {
			EventManager.dispatch(LocalEventEnum.TeamInvitePlayer,this._data.entityId);//发送邀请链接
		}
	}
}