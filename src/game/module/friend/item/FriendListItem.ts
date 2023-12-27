class FriendListItem extends ListRenderer{
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private statusTxt: fairygui.GRichTextField;
	private deleteBtn: fairygui.GButton;
	private iconImage: fairygui.GImage;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.statusTxt = this.getChild("txt_status").asRichTextField;
		this.deleteBtn = this.getChild("btn_delete").asButton;
		this.iconImage = this.getChild("image_icon").asImage;
		this.addClickListener(this.clickIcon, this);
		this.deleteBtn.addClickListener(this.clickDeleteBtn, this);
	}

	public setData(data: any): void{
		this._data = data;
		this.iconLoader.load(URLManager.getPlayerHead(data.career));
		this.nameTxt.text = `${data.name}(${CareerUtil.getLevelName(data.level, data.career)})`;
		// App.TimerManager.remove(this.onCountTime, this);
		if(data.online){
			this.statusTxt.text = `<font color = ${Color.GreenCommon}>在线</font>`;
			this.iconImage.grayed = false;
			this.iconLoader.grayed = false;
		}else{
			// this.onCountTime();
			// App.TimerManager.doTimer(1000*60, 0, this.onCountTime, this);
			let time: number = Date.now()/1000 - this._data.lastLogout;
			let timeStr: string = App.DateUtils.getFormatBySecond(time, 4);
			if(time < 60){
				this.statusTxt.text = `<font color = "#ffffff">1分钟前</font>`;
			}else{
				this.statusTxt.text = `<font color = "#ffffff">${timeStr}</font>`;
			}
			this.iconImage.grayed = true;
			this.iconLoader.grayed = true;
		}
	}

	private clickDeleteBtn(e:egret.TouchEvent): void{
		AlertII.show(`确定要删除${this._data.name}吗？`, null, function (type: AlertType){
			if(type == AlertType.YES){
				EventManager.dispatch(LocalEventEnum.FriendRemove, this._data.entityId.id_I, EFriendFlag.EFriendFlagFriend);//删好友
			}
		}, this);
		e.stopPropagation();
		// EventManager.dispatch(LocalEventEnum.FriendRemove, this._data.entityId.id_I, EFriendFlag.EFriendFlagFriend);//删好友
	}

	private clickIcon(): void{
		EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.entityId});
	}

	// private onCountTime(): void{
	// 	let time: number = Date.now()/1000 - this._data.lastLogout;
	// 	let timeStr: string = App.DateUtils.getFormatBySecond(time, 4);
	// 	if(time < 60){
	// 		this.statusTxt.text = `<font color = ${Color.GreenCommon}>在线</font>`;
	// 	}else{
	// 		this.statusTxt.text = `<font color = "#ffffff">${timeStr}</font>`;
	// 	}
	// }
}