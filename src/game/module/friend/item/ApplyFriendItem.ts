class ApplyFriendItem extends ListRenderer{
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private refuseBtn: fairygui.GButton;
	private agreeBtn: fairygui.GButton;
	
	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.refuseBtn = this.getChild("btn_refuse").asButton;
		this.agreeBtn = this.getChild("btn_agree").asButton;
		this.addClickListener(this.clickIcon, this);
		this.refuseBtn.addClickListener(this.clickRefuseBtn, this);
		this.agreeBtn.addClickListener(this.clickAgreeBtn, this);
	}

	public setData(data: any): void{
		if(data != null) {
			this._data = data;
			this.iconLoader.load(URLManager.getPlayerHead(data.career));
			this.nameTxt.text = `${data.name}(${CareerUtil.getLevelName(data.level, data.career)})`;
		}
	}

	private clickRefuseBtn(e:egret.TouchEvent): void{
		ProxyManager.friend.friendReply(this._data.entityId.id_I, EFriendReplyResult.EFriendReplyResultReject);//拒绝
		e.stopPropagation();
	}

	private clickAgreeBtn(e:egret.TouchEvent): void{
		ProxyManager.friend.friendReply(this._data.entityId.id_I, EFriendReplyResult.EFriendReplyResultAccept);//同意
		e.stopPropagation();
	}

	private clickIcon(): void{
		EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.entityId});
	}

}