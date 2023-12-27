class FriendModule extends BaseTabModule{
	private c1:fairygui.Controller; //全屏控制器
	private c2:fairygui.Controller; //按钮显示控制器

	//-----聊天输入内容
	private txtInput:fairygui.GTextField;
	private btnSend:fairygui.GButton;
	private btnFace:fairygui.GButton;
	private faceCnt:fairygui.GComponent;
    private faceView:ChatFaceView;

	public constructor(moduleId: ModuleEnum) {
		super(ModuleEnum.Friend, PackNameEnum.Friend, "Main", LayerManager.UI_Popup);
	}

	public initOptUI(): void{
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.className = {
			[PanelTabType.FriendContact]:["FriendContactPanel", FriendContactPanel], 
			[PanelTabType.Friend]:["FriendPanel", FriendPanel], 
			[PanelTabType.FriendApply]:["FriendApplyPanel", FriendApplyPanel], 
			[PanelTabType.FriendShield]:["FriendShieldPanel", FriendShieldPanel],
			[PanelTabType.FriendMail]:["FriendMailPanel", FriendMailPanel]
		};

		this.txtInput = this.getGObject("txt_input").asTextField;
        this.btnFace = this.getGObject("btn_face").asButton;
        this.btnSend = this.getGObject("btn_send").asButton;
		this.faceCnt = this.getGObject("face_cnt").asCom;
		this.faceView = new ChatFaceView(this.faceCnt);

		this.btnFace.addClickListener(this.onGUIBtnClick, this);	
        this.btnSend.addClickListener(this.onGUIBtnClick, this);
		this.txtInput.addEventListener(egret.Event.CHANGE,this.onInputChange,this);	
		this.addClickListener(this.clickWindow,this);
	}

	public updateAll(): void{
		this.updateBtnTips();
	}

	public friendListUpdate(): void{
		if(this.curPanel instanceof FriendPanel){
			this.curPanel.updateList();
		}else if(this.curPanel instanceof FriendShieldPanel){
			this.curPanel.updateList();
		}else if(this.curPanel instanceof FriendApplyPanel){
			this.curPanel.updateList();
		}else if(this.curPanel instanceof FriendContactPanel){
			this.curPanel.updateList();
		}
		this.updateFriendBtnTips();
	}

	public updateContactList(selectIndex:number=-1):void{
		if(this.curPanel instanceof FriendContactPanel){
			this.curPanel.updateList(selectIndex);
		}
	}

	/**更新私聊消息 */
	public updatePrivateChat():void{
		if(this.curPanel instanceof FriendContactPanel){
			this.curPanel.updateChatContent();
		}
	}
	/**是否选中某个联系人 */
	public isSelectPlayer(playerId:number):boolean{
		if(this.curPanel instanceof FriendContactPanel){
			return this.curPanel.isSelectPlayer(playerId);
		}
		return false;
	}

	/**更新邮件数据 */
	public updateMail(): void{
		if(this.curPanel instanceof FriendMailPanel){
			this.curPanel.updateMailList();
		}
		this.updateMailBtnTips();
	}

	// /**更新邮件某一项数据 */
	// public updateMailItem(data: any): void{
	// 	if(this.curPanel instanceof FriendMailPanel){
	// 		this.curPanel.updateMailListItem(data);
	// 	}
	// }

	// /**更新附件状态 */
	// public updateAttachment(data: any): void{
	// 	if(this.curPanel instanceof FriendMailPanel){
	// 		this.curPanel.updateMailAttachment(data);
	// 	}
	// }

	public updateBtnTips():void {
		this.updateFriendBtnTips();
		this.updateMailBtnTips();
		this.updateContactBtnTips();
    }

	public updateFriendBtnTips():void {
        this.setBtnTips(PanelTabType.FriendApply, CacheManager.friend.isHasApplyPlayer());
    }

	/**邮件红点 */
	public updateMailBtnTips():void {
		this.setBtnTips(PanelTabType.FriendMail, CacheManager.friend.isShowMail);
	}

	public updateContactBtnTips():void{
		this.setBtnTips(PanelTabType.FriendContact, CacheManager.friend.isContactTip());
	}

	public appendText(text:string):void{
		var oldText:string = this.txtInput.text;		
		this.txtInput.text = this.txtInput.text + text;
		var b:boolean = this.checkOutLen();		
		if((ChatUtils.isItemStr(text) || ChatUtils.isFaceStr(text)) && b){
			this.txtInput.text = oldText;
		}
		var txt:egret.TextField = <egret.TextField>this.txtInput.displayObject;
		txt.setFocus();		

	}

	protected onInputChange(e:egret.Event):void{
		this.checkOutLen();		
	}
	protected checkOutLen():boolean{
		var b:boolean = ChatUtils.isMsgOutLen(this.txtInput.text);
		if(b){
			this.txtInput.text = this.txtInput.text.slice(0,ChatCache.MAX_INPUT);
			Tip.showTip(LangChat.L_OUT_LEN);
		}
		return b;
	}
	protected clickWindow(e:any):void{
		this.showFaceView(false);
	}
	protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnFace:
                e.stopPropagation();
				this.showFaceView(true);
                break;
            case this.btnSend:
                this.sendMsg();				
				break;

        }
    }
	private showFaceView(isShow:boolean):void{
		this.faceCnt.visible = isShow;
		if(isShow){
			this.faceView.show(); 
		}else{
			this.faceView.hide();
		}
		 
	}
	private sendMsg():void{
		if(!this.isTypePanel(PanelTabType.FriendContact)){
			return;
		}

		if(!App.StringUtils.isEmptyStr(this.txtInput.text)){
			let playerData:any = (this.curPanel as FriendContactPanel).getChatPlayer();
			if(!playerData){
				return;
			}
			let miniPlayer:any = playerData.player;
			let param:any = {toPlayerName_S:miniPlayer.name_S,toEntityId:miniPlayer.entityId};			
			var content:string = ChatUtils.checkSendMsg(this.txtInput.text);
			content = ConfigManager.chatFilter.replace(content);
			let chanel:number = EChatType.EChatTypePrivate;
			EventManager.dispatch(LocalEventEnum.ChatSendMsg, { content: content ,chatType:chanel,param:param});
			this.txtInput.text = "";		
		}else{
			Tip.showTip(LangChat.L_MSG_EMPTY);
		}
	}

	protected updateSubView():void{
		let idx:number = 0;
		if(this.isTypePanel(PanelTabType.FriendContact)){
			idx = 1;
			if(CacheManager.friend.offlineReqIds){	
				EventManager.dispatch(LocalEventEnum.FriendReqOfflineMsg);//请求私聊我的离线消息
			}			
		}else{
			this.c1.setSelectedIndex(0);
			this.showFaceView(false);
		}
		this.c2.setSelectedIndex(idx);
	}
	public hide():void {
		super.hide();
		this.c1.setSelectedIndex(0);
	}
	
}