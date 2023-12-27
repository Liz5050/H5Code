class ChatModule extends BaseModule {
	public btn_extend: fairygui.GButton;
	public btn_sent: fairygui.GButton;
	public btn_lock: fairygui.GButton;
	public btn_copy: fairygui.GButton;
	public list_chat: List;
	public list_chat0: List;
	public list_chat1: List;
	public list_chat2: List;
	public list_chat3: List;
	public list_channel: List;
	public txt_input: fairygui.GTextField;
	public txt_tishi: fairygui.GTextField;
	public curChanel: number = 0;
	protected _isExtend:boolean;
	/**表情、装备列表等内容弹出面板 */
	public panel_tips:ChatExtendView;
	public panel_unread:fairygui.GComponent;
	public txt_unread:fairygui.GTextField;
	public group_input:fairygui.GGroup;
	/**当前复制的信息 */
	protected curCopyMsg:SChatMsg;
	//protected curSelectdChanelItem:ChatChanelItem;	
	protected curSelectdChanelItem:TabButtonItem;	
	/**是否读了当前频道的所有信息 */
	protected isReadAll:boolean = true;
	/**已经初始化的频道(打开过的) */
	//private channelInitDict:any;
	private isListInit:boolean=false;

	private preIndex:number = 0;
	private LIST_COUNT:number = 4;
	private framExc:FrameExecutor;
	
	public constructor() {
		super(ModuleEnum.Chat, PackNameEnum.Chat);
	}
	public initOptUI(): void {
		this.title = "Chat_0";
		this.list_channel = new List(this.getGObject("list_channel").asList);		
		this.btn_extend = this.getGObject("btn_extend").asButton;
		this.btn_sent = this.getGObject("btn_sent").asButton;
		this.btn_lock = this.getGObject("btn_lock").asButton;
		this.btn_copy = this.getGObject("btn_copy").asButton;
		this.btn_copy.visible = false;
		
		for(let i:number=0;i<this.LIST_COUNT;i++){
			let key:string = "list_chat"+i;
			this[key]=new List(this.getGObject(key).asList);
			this[key].name = key+"_"+i;
		}
	
		this.group_input = this.getGObject("group_input").asGroup;
		this.panel_unread = this.getGObject("panel_unread").asCom;
		this.panel_unread.visible = false;
		this.txt_unread = this.panel_unread.getChild("txt_unread").asTextField; 

		this.panel_tips = <ChatExtendView>this.getGObject("panel_tips").asCom;
		this.txt_tishi = this.getGObject("txt_tishi").asTextField;
		this.txt_tishi.visible = false;

		var InputMessage: fairygui.GComponent = this.getGObject("InputMessage").asCom;
		this.txt_input = InputMessage.getChild("txt_input").asTextField;
		
		this.txt_input.text = "";		
		this.btn_sent.addClickListener(this.onClickBtn, this);
		this.btn_extend.addClickListener(this.onClickBtn, this);
		this.btn_lock.addClickListener(this.onClickBtn, this);

		this.btn_copy.addClickListener(this.onClickBtn, this);
		this.panel_unread.addClickListener(this.onClickBtn,this);
		this.addClickListener(this.clickWindow,this);
		this.txt_input.addEventListener(egret.Event.CHANGE,this.onInputChange,this);		
		this.list_channel.list.addEventListener(fairygui.ItemEvent.CLICK, this.onTabChanged, this);		
		let chanelData:any[] = ChatUtils.getChatChanelInfos();
		this.list_channel.data = chanelData;
		//this.channelInitDict = {};

		this.framExc = new FrameExecutor(1);
	}
	
	protected onScrollEnd(e:any):void{
		this.checkRead();		
		this.btn_copy.visible = false;
	}

	protected onTabChanged(e:fairygui.ItemEvent):void{		
		var chanel:number = this.list_channel.data[this.list_channel.selectedIndex].chanel;
		if(chanel==EChatType.EChatTypeGuild && !CacheManager.guildNew.isJoinedGuild()){
			Tip.showLeftTip(LangGuildNew.L12);
			var item:TabButtonItem = <TabButtonItem>this.list_channel.list.getChildAt(this.list_channel.selectedIndex);
			item.btnSelected = false;
			this.list_channel.selectedIndex = this.preIndex;			
			return;
		}
		this.changeSelectChanel();		
		this.updateChanelList(true);		
		this.preIndex = this.list_channel.selectedIndex;
		
	}
	private checkRead():void{
		if(CacheManager.chat.isLock && !this.isReadAll){
			var n:number = this.getUnreadNum();
			this.isReadAll = n==0;
			EventManager.dispatch(LocalEventEnum.ChatUnreadUpdate,this.curChanel,n);
			this.showUnread();
		}
	}
	/**切换频道选择 */
	protected changeSelectChanel():void{
		if(this.curChanel>0){
			CacheManager.chat.delChanelItems(this.curChanel);
			CacheManager.chat.setUnreadCount(this.curChanel,0);
			this.isReadAll = true;
		}
		this.showUnread();
		var chanel:number = 0;
		if(this.list_channel.selectedIndex>-1){
			if(this.curSelectdChanelItem){
				this.curSelectdChanelItem.btnSelected = false;
			}
			var item:TabButtonItem = <TabButtonItem>this.list_channel.list.getChildAt(this.list_channel.selectedIndex);
			this.curSelectdChanelItem = item;
			this.curSelectdChanelItem.btnSelected = true;
			chanel = this.list_channel.data[this.list_channel.selectedIndex].chanel;
			var flag:boolean = ChatUtils.isCanInputShow(chanel);
			this.group_input.visible = flag;
			this.txt_tishi.visible = !flag;
			if(this._isExtend && !flag){
				this.changeExtendView(false);
			}
			//EventManager.dispatch(LocalEventEnum.ChatGetChanelCacheMsg,chanel);//打开界面请求数据
		}
		for(let i:number = 0;i<this.LIST_COUNT;i++){
			let chatList:List = this["list_chat"+i];
			chatList.list.visible = false;
			if(i==this.list_channel.selectedIndex){
				this.list_chat =chatList; 
				chatList.list.visible = true;
				this.list_chat.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onScrollEnd, this);
				this.list_chat.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onScrolling,this);
			}else{
				chatList.list.removeEventListener(fairygui.ScrollPane.SCROLL_END, this.onScrollEnd, this);
				chatList.list.removeEventListener(fairygui.ScrollPane.SCROLL, this.onScrolling,this);
			}
		}						
	}

	private onScrolling(e?:any):void{
		this.btn_copy.visible = false;
	}

	protected onInputChange(e:egret.Event):void{
		this.checkOutLen();		
	}

	protected checkOutLen():boolean{
		var b:boolean = ChatUtils.isMsgOutLen(this.txt_input.text);
		if(b){
			this.txt_input.text = this.txt_input.text.slice(0,ChatCache.MAX_INPUT);
			Tip.showTip(LangChat.L_OUT_LEN);
		}
		return b;
	}
	public updateAll(data?:any): void {
		App.TimerManager.doFrame(2,1,()=>{
			var chatType:number = data.chatType;
			this.changeChanel(chatType);
		},this);
				
	}
	public appendText(text:string):void{
		var oldText:string = this.txt_input.text;		
		this.txt_input.text = this.txt_input.text + text;
		var b:boolean = this.checkOutLen();		
		if((ChatUtils.isItemStr(text) || ChatUtils.isFaceStr(text)) && b){
			this.txt_input.text = oldText;
		}
		var txt:egret.TextField = <egret.TextField>this.txt_input.displayObject;
		txt.setFocus();		

	}
	public replaceText(text:string):void{
		this.txt_input.text = text;
		this.checkOutLen();	
	}
	public showCopyBtn(index:number):void{
		if(index<this.list_chat.data.length){
			this.curCopyMsg = this.list_chat.data[index];
			this.btn_copy.visible = true;
			this.list_chat.scrollToView(index,false);
			var cidx:number = this.list_chat.list.itemIndexToChildIndex(index);
			var itemObj:ChatItem = <ChatItem>this.list_chat.list.getChildAt(cidx);
			if(itemObj){
				var p:egret.Point = itemObj.getBubblePos();				
				this.btn_copy.x = p.x-this.btn_copy.width/2;
				this.btn_copy.y = p.y-this.btn_copy.height;
			}
		}
	}

	/**根据聊天频道改变列表显示 */
	public changeChanel(chatType: EChatType): void {
		var idx: number = ChatUtils.getChatTypeIndex(chatType);
		this.list_channel.selectedIndex = idx;
		this.list_channel.scrollToView(idx);		
		this.changeSelectChanel();
		this.updateChanelList(true);
	}

	/**显示当前频道的所有聊天记录 */
	public updateChanelList(isChangeChannel:boolean): void {
		this.framExc.clear();
		if(isChangeChannel){			
			if(this.btn_copy.visible){
				this.btn_copy.visible = false;
			}			
		}
		var idx: number = Math.max(0,this.list_channel.selectedIndex); //防止 打开还在延时中 就收到聊天消息，this.list_channel.selectedIndex 还是-1
		this.curChanel = this.list_channel.data[idx].chanel;
		this.isListInit = true;
		this.curMsgData = CacheManager.chat.getChanelMsgs(this.curChanel);		
		this.list_chat.setVirtual(this.curMsgData,this.setItemRenderer,this);
		if(!this.initItemList()){			
			this.scrollToEnd();
			this.list_chat.list.setBoundsChangedFlag();
			this.list_chat.list.refreshVirtualList();
		}
		
	}
	

	private initItemList():boolean{
		if(!this.itemIndexs){
			return false;						
		}
		if(!this.isListInit){ //this.channelInitDict[this.curChanel]
			this.list_chat.list.scrollPane.touchEffect = false;
			let perNum:number = this.curChanel==EChatType.EChatTypeSystem?2:1; //系统频道一帧3个 其他频道1帧一个
			let maxIdx:number = this.itemIndexs.length - this.itemIndexs.length%perNum+1;
			for(let i:number = 1;i<=this.itemIndexs.length;i++){
				let isLast:boolean = i>=maxIdx;
				if(i%perNum==0 || isLast){
					this.framExc.regist(()=>{
						if (this.itemIndexs) {
							let idxs:number[] = this.itemIndexs.splice(0,perNum); 
							let subItems:ChatItem[] = this.items.splice(0,perNum);
							for(let i:number = 0;i < idxs.length;i++){
								let index:number = idxs[i];
								let item:ChatItem = subItems[i];
								if(index<this.curMsgData.length){
									this.renderItem(item,this.curMsgData[index],index);			
									this.list_chat.list.refreshVirtualList();	
								}
														
							}
						}
					},this);
				}
				if(isLast){
					break;
				}				
			}			
			//注册最后一个函数 监听list初始化完成
			this.framExc.regist(()=>{
				this.isListInit = true;
				this.list_chat.list.scrollPane.touchEffect = true; //开启滚动
				this.itemIndexs = null;
				this.items = null;
				this.list_chat.list.setBoundsChangedFlag();				
				this.scrollToEnd();
			},this);
			this.framExc.execute();
			return true;
		}	
		return false;
	}

	private itemIndexs:number[];
	private items:ChatItem[];
	private curMsgData:any[];
	private setItemRenderer(index: number, item: ChatItem): void {				
		if(!this.isListInit){ //channelInitDict[this.curChanel]
			if(!this.itemIndexs){
				this.itemIndexs = [];
			}
			if(!this.items){
				this.items = [];				
			}
			this.itemIndexs.push(index);
			this.items.push(item);
							
		}else if(index < this.curMsgData.length){			
			this.renderItem(item,this.curMsgData[index],index);	
		}				
	}

	protected renderItem(item:ChatItem,data:ItemData,index:number):void{
		item.setData(data,index);		
	}
	/**判断聊天区域是否滚动条了 */
	public isScrollBar():boolean{
		var scrollPanel:fairygui.ScrollPane=this.list_chat.list.scrollPane;
		var maxDist:number = scrollPanel.contentHeight - scrollPanel.viewHeight; //最大滚动位置
		var chatData: Array<any> = CacheManager.chat.getChanelMsgs(this.curChanel);
		var lastIdx:number = chatData.length - 1;
		let firstIdx:number = this.list_chat.list.getFirstChildInView();
		let itemNum:number = this.list_chat.list.numItems-1;
		let total:number = firstIdx+itemNum;
		var b:boolean = scrollPanel.posY<maxDist && total>=lastIdx; 
		this.isReadAll = !b; 
		return b;
	}

	/**显示未读条数 */
	public showUnread():void{
		var unread:number = CacheManager.chat.getUnReadCount(this.curChanel);
		var flag:boolean = unread>0;
		this.panel_unread.visible = flag;
		if(CacheManager.chat.isLock && flag){			
			this.txt_unread.text = ""+App.StringUtils.substitude(LangChat.L_UNREAD,unread);
		}
	}

	public changeExtendView(show:boolean):void{
		this._isExtend = show;
		this.panel_tips.visible = this._isExtend; 
	}

	private getUnreadNum():number{
		var n:number = this.list_chat.getLastNotInViewChildNum();		
		return n;
	}
	
	protected scrollToEnd(isForce:boolean=false):void{		
		if(this.list_chat.data && this.list_chat.data.length>0){
			if(isForce || !CacheManager.chat.isLock){			
				let chatData: Array<any> = this.curMsgData;//CacheManager.chat.getChanelMsgs(this.curChanel);
				if(chatData && chatData.length>0){
					let total:number = chatData.length-1;				
					this.list_chat.list.scrollToView(total,false);		
				}
				
			}
		}
				
	}

	protected toggleExtendView():void{
		this._isExtend = !this._isExtend;
		this.panel_tips.visible = this._isExtend;
		if(this._isExtend){
			this.panel_tips.updateAll();
		}
	}

	protected onClickBtn(e:egret.TouchEvent): void {
		switch (e.target) {
			case this.btn_sent:
				if(!App.StringUtils.isEmptyStr(this.txt_input.text)){
					if(!CacheManager.chat.isInSendCd()){
						var content:string = ChatUtils.checkSendMsg(this.txt_input.text);
						content = ConfigManager.chatFilter.replace(content);
						EventManager.dispatch(LocalEventEnum.ChatSendMsg, { content: content ,chatType:this.curChanel});
						this.txt_input.text = "";
						
					}else{
						Tip.showTip(LangChat.L1);
					}
					
				}else{
					Tip.showTip(LangChat.L_MSG_EMPTY);
				}				
				break;
			case this.btn_extend:				
				this.toggleExtendView();
				this.setCopyOpt(false);
				e.stopPropagation();
				break;
			case this.btn_lock:
				CacheManager.chat.isLock = this.btn_lock.selected; 
				break;
			case this.btn_copy:
				this.setCopyOpt(true);
				break;
			case this.panel_unread:
				this.scrollToEnd(true);
				App.TimerManager.doDelay(300,this.checkRead,this);
				break;

		}
	}

	protected setCopyOpt(isSend:boolean):void{
		this.btn_copy.visible = false;
		if(this.curCopyMsg && isSend){
			this.appendText(this.curCopyMsg.content_S);
		}
		this.curCopyMsg = null;
	}

	protected clickWindow(e:any):void{
		this.changeExtendView(false);
		if(CacheManager.chat.isCopyMsgEnd){			
			this.setCopyOpt(false);
		}
		CacheManager.chat.isCopyMsgEnd = true;
	}

}