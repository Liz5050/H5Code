/**
 * 新聊天界面
 * @author zhh
 * @time 2018-08-14 15:34:55
 */
class ChatModule2 extends BaseModule {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private txtInput:fairygui.GTextField;
    private txtTishi:fairygui.GTextField;
    private txtKftip:fairygui.GTextField;
	private groupInput:fairygui.GGroup;
    private btnFace:fairygui.GButton;
    private btnSend:fairygui.GButton;
	private LIST_COUNT:number = 5;
    private listChat:List;
    private listChat0:List;
	private listChat1: List;
	private listChat2: List;
	private listChat3: List;
    private listChanel:List;
    private chanelData:any[];
    private preIndex:number = 0;    
    private curMsgData:any[];
    public curChanel:number = 0;
    protected curSelectdChanelItem:TabButtonItem;
    private faceCnt:fairygui.GComponent;
    //private faceView:ChatFaceView;
	private extendView:ChatExtendView;
	private kfCom:fairygui.GComponent;
	private txtKfInput:fairygui.GTextField;
    private _isExtend:boolean = false;
	private btnLeft:fairygui.GButton;
	private btnRight:fairygui.GButton;
	private btnExtend:fairygui.GButton;
	/**是否第一次打开 */
	private _isFirst:boolean = true; 

	public constructor() {
		super(ModuleEnum.Chat,PackNameEnum.Chat,"ChatModule",LayerManager.UI_Popup);
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.txtInput = this.getGObject("txt_input").asTextField;
        this.btnFace = this.getGObject("btn_face").asButton;
        this.btnSend = this.getGObject("btn_send").asButton;
        this.btnLeft = this.getGObject("btn_left").asButton;
        this.btnRight = this.getGObject("btn_right").asButton;
        this.btnExtend = this.getGObject("btn_extend").asButton;
        this.listChat0 = new List(this.getGObject("list_chat0").asList);
        this.listChanel = new List(this.getGObject("list_chanel").asList);
		this.groupInput = this.getGObject("group_input").asGroup;
        this.txtTishi = this.getGObject("txt_tishi").asTextField;
        this.txtKftip = this.getGObject("txt_kftip").asTextField;
		this.faceCnt = this.getGObject("face_cnt").asCom;
		//this.faceView = new ChatFaceView(this.faceCnt);
		this.extendView = new ChatExtendView(this.faceCnt);
		this.faceCnt.addChild(this.extendView);

		this.kfCom = this.getGObject("kfCom").asCom;
		this.txtKfInput = this.kfCom.getChild("txt_inputKf").asTextField;
        this.btnFace.addClickListener(this.onGUIBtnClick, this);	
        this.btnSend.addClickListener(this.onGUIBtnClick, this);
        this.btnLeft.addClickListener(this.onGUIBtnClick, this);
        this.btnRight.addClickListener(this.onGUIBtnClick, this);
        this.btnExtend.addClickListener(this.onGUIBtnClick, this);
        //this.listChat0.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listChanel.list.addEventListener(fairygui.ItemEvent.CLICK,this.onTabChanged,this);
		this.txtInput.addEventListener(egret.Event.CHANGE,this.onInputChange,this);	
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onExtendChange,this);
		this.listChanel.setSrcollStatus(5,this.setBtnShow,this);
        //---- script make end ----

		for(let i:number=0;i<this.LIST_COUNT;i++){
			let key:string = "list_chat"+i;
			let key1:string = "listChat"+i;
			let isChatTypeTotal:boolean = i==0;
			this[key1]=new List(this.getGObject(key).asList,{isChatTypeTotal:isChatTypeTotal});			
			this[key1].name = key+"_"+i;
		}
        this.listChat = this.listChat0;        
        this.c1.setSelectedIndex(0);
        this.addClickListener(this.clickWindow,this);


	}   
	private setBtnShow(status:number):void{
        let isMid:boolean = status==List.SCROLL_MIDDLE;
        this.btnLeft.visible = status==List.SCROLL_LEFT || isMid; 
        this.btnRight.visible = status==List.SCROLL_RIGHT || isMid; 
    }

	public updateAll(data?:any):void{
		this.setChanelList();		
		if(this._isFirst){
			this._isFirst = false;
			this.curChanel = data && data.chatType?data.chatType:EChatType.EChatTypeTotal; //第一次打开综合 以后打开保留上次的
			App.TimerManager.doFrame(2,1,this.frameCall,this);
		}else{
			this.curChanel = data && data.chatType?data.chatType:this.curChanel; 
			this.changeChanel(this.curChanel);
		}        
	}

	private setChanelList():void{
		this.chanelData = ChatUtils.getChatChanelInfos().concat();
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.ChatCross],false) || !CopyUtils.isInCrossChat() ){
			this.delChanel(EChatType.EChatTypeCross);
		}

		if(!ChatUtils.isShowTeamChanel()){
			this.delChanel(EChatType.EChatTypeTeam);
		}
		this.listChanel.setVirtual(this.chanelData);
		if(this.listChanel.selectedIndex==-1){
			this.listChanel.selectedIndex = 0;
		}
	}

	private delChanel(chanel:number):void{
		if(this.curChanel==chanel){
			this.curChanel = EChatType.EChatTypeTotal;
		}
		for(let i:number = 0;i<this.chanelData.length;i++){
			if(this.chanelData[i].chanel==chanel){
				this.chanelData.splice(i,1);
				break;
			}
		}
	}

	private setChanelTip(chanel:number,isTip:boolean):void{
		let index:number = this.getIndexByChanel(chanel);
		let btn:fairygui.GButton = this.listChanel.list.getChildAt(index) as fairygui.GButton;
		if(btn) {
			CommonUtils.setBtnTips(btn,isTip);
		}
	}
	private frameCall():void{
		this.changeChanel(this.curChanel);
	}
    /**根据聊天频道改变列表显示 */
	public changeChanel(chatType: EChatType): void {
		var idx: number = this.getIndexByChanel(chatType);
		this.listChanel.selectedIndex = idx;
		this.listChanel.scrollToView(idx);		
		this.changeSelectChanel();
		this.updateChanelList(true);
	}

    /**显示当前频道的所有聊天记录 */
	public updateChanelList(isChangeChannel:boolean): void {		
        this.curChanel = this.getCurChanel();
		this.curMsgData = CacheManager.chat.getChanelMsgs(this.curChanel);		
		this.listChat.setVirtual(this.curMsgData,this.setItemRenderer,this);
		this.scrollToEnd();
		this.setChanelTip(EChatType.EChatTypeGuild,CacheManager.chat.isGuildTip);				        
	}

	private getIndexByChanel(chanel:number):number{
		let idx:number = -1;
		if(this.chanelData){
			for(let i:number = 0;i<this.chanelData.length;i++){
				if(this.chanelData[i].chanel==chanel){
					idx = i;
					break;
				}
			}
		}
			
		if(idx==-1){
			idx = ChatUtils.getChatTypeIndex(chanel);
		}
		return idx;
	}

	private setItemRenderer(index: number, item:ChatMsgItem): void {
		if (!item || item["setData"] == undefined || !this.curMsgData || !this.curMsgData[index]) return;
		item.isChatTypeTotal = this.curChanel==EChatType.EChatTypeTotal;
		item.setData(this.curMsgData[index],index);
		item.setSize(item.width,item.getHeight());		
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
    public changeExtendView(show:boolean):void{
		this._isExtend = show;
		this.faceCnt.visible = show;	
		if(show){
			if (!this.extendView.isShow) {
				this.extendView.show();
			}
		}else{
			if (this.extendView.isShow) {
				this.extendView.hide();
			}
		}
	}

	public updatePhrase():void{
		if(this.extendView && this.extendView.isShow){
			this.extendView.updatePhrase();
		}
	}

	public replaceText(text:string):void{
		this.txtInput.text = text;
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
    private scrollToEnd(autoRefresh:boolean=true):void{
        if(this.curMsgData.length>0){
            let idx:number = this.curMsgData.length -1;
            this.listChat.scrollToView(idx);			
        }
		if(autoRefresh){
			this.listChat.list.setBoundsChangedFlag();
			this.listChat.list.refreshVirtualList();
		}
		
    }


    /**获取当前频道 */
    private getCurChanel():number{
        let idx:number = Math.max(0,this.listChanel.selectedIndex);
        return this.chanelData[idx].chanel;
    }
    protected onTabChanged(e:fairygui.ItemEvent):void{		
        var chanel:number = this.getCurChanel();
		if(chanel==EChatType.EChatTypeGuild && !CacheManager.guildNew.isJoinedGuild()){
			Tip.showLeftTip(LangGuildNew.L12);
			var item:TabButtonItem = <TabButtonItem>this.listChanel.list.getChildAt(this.listChanel.selectedIndex);
			item.btnSelected = false;
			this.listChanel.selectedIndex = this.preIndex;			
			return;
		}
        this.changeExtendView(false);
        this.changeSelectChanel();
		this.updateChanelList(true);		
		this.preIndex = this.listChanel.selectedIndex;
		
	}
    protected changeSelectChanel():void{		
		var chanel:number = 0;
		if(this.listChanel.selectedIndex>-1){
			if(this.curSelectdChanelItem){
				this.curSelectdChanelItem.btnSelected = false;
			}
			var item:TabButtonItem = <TabButtonItem>this.listChanel.list.getChildAt(this.listChanel.selectedIndex);
			this.curSelectdChanelItem = item;
			this.curSelectdChanelItem.btnSelected = true;
			chanel = this.listChanel.data[this.listChanel.selectedIndex].chanel;			
		}       
		let isGuild:boolean = chanel==EChatType.EChatTypeGuild;
		if(!CacheManager.chat.isClickGuild){
			CacheManager.chat.isClickGuild=isGuild;			
		}	
		if(isGuild && CacheManager.chat.isGuildTip){
			CacheManager.chat.isGuildTip = false;
		}

		let isKf:boolean = chanel==EChatType.EChatTypeKF;
		var flag:boolean = ChatUtils.isCanInputShow(chanel);
		this.kfCom.visible = isKf;
		if(isKf){
			this.btnSend.visible = true;
			this.txtTishi.visible = false;
			this.groupInput.visible = false;
			this.txtKftip.visible = true;
		}else{
			this.groupInput.visible = flag;
			this.btnSend.visible = flag;
			this.txtTishi.visible = !flag;
			this.txtKftip.visible = false;
		}		

        if(this._isExtend && !flag){
            this.changeExtendView(false);
        }
		for(let i:number = 0;i<this.LIST_COUNT;i++){
			let key:string = "listChat"+i;
			let chatList:List = this[key];
			chatList.list.visible = false;			
			if(i==this.listChanel.selectedIndex){
				this.listChat =chatList; 
				chatList.list.visible = true;
			}else{
				chatList.setVirtual([]);
			}
		}
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
			case this.btnExtend:
				e.stopPropagation();
				break;
            case this.btnFace:
                e.stopPropagation();
				this.changeExtendView(!this._isExtend);
                break;
            case this.btnSend:
                this.clickSend();				
				break;
			case this.btnLeft:
				this.listChanel.changPage(false);
				break;
			case this.btnRight:
				this.listChanel.changPage(true);
				break;

        }
    }

	private sendKf():void{
		var content:string = ChatUtils.checkSendMsg(this.txtKfInput.text);
		if(!App.StringUtils.isEmptyStr(content) && content.length>=2){
			if(!CacheManager.chat.isHasReportNum()){
				Tip.showTip(LangChat.L2);
				return;
			}			
			EventManager.dispatch(LocalEventEnum.ChatSendKf, { content: content});
			this.txtKfInput.text = "";
			Tip.showTip(LangChat.L4);
		}else{
			Tip.showTip(LangChat.L3);
		}
	}

	private sendMsg():void{
		if(!App.StringUtils.isEmptyStr(this.txtInput.text)){
			if (this.txtInput.text == LangChat.Test_L1)
				EventManager.dispatch(LocalEventEnum.ShowLog);
			else if (this.txtInput.text == LangChat.Test_L2)
                EventManager.dispatch(LocalEventEnum.ShowLoadLog);
            else if (this.txtInput.text == LangChat.Test_L3) {
				App.DebugUtils.onDisplayFPS();
                ControllerManager.test.showMemDisplay(true);
            }
			else if (this.txtInput.text == LangChat.Test_L4)
                App.DebugUtils.onOpenGM();
			else if(!CacheManager.chat.isInSendCd() || this.curChanel==EChatType.EChatTypeGuild){
				var content:string = ChatUtils.checkSendMsg(this.txtInput.text);
				content = ConfigManager.chatFilter.replace(content);
				let chanel:number = this.getSendChanel();
				let crossFlag:boolean = this.curChanel==EChatType.EChatTypeCross || this.curChanel==EChatType.EChatTypeTeam || (CopyUtils.isInCrossChat() && this.curChanel==EChatType.EChatTypeTotal);
				let param:any = {};
				param.crossFlag = crossFlag;
				if(this.curChanel==EChatType.EChatTypeTeam && CacheManager.team2.teamInfo){
					let codeStr:string = CacheManager.team2.teamInfo.copyCode_I+"";
					param.extend = {data_S:[codeStr]};
				}				
				EventManager.dispatch(LocalEventEnum.ChatSendMsg, { content: content ,chatType:chanel,param:param});
				this.txtInput.text = "";	
			}else{
				Tip.showTip(LangChat.L1);
			}			
		}else{
			Tip.showTip(LangChat.L_MSG_EMPTY);
		}
	}

	private getSendChanel():number{
		let chanel:number = this.curChanel;
		if(this.curChanel==EChatType.EChatTypeTotal || chanel == EChatType.EChatTypeCross){ //综合、跨服频道的特殊处理
			chanel = EChatType.EChatTypeWorld;		
		}
		return chanel;
	}

	private onExtendChange(e:any):void{
		this.scrollToEnd();
	}
	protected onInputChange(e:egret.Event):void{
		this.checkOutLen();		
	}

    protected clickWindow(e:any):void{
		this.changeExtendView(false);
	}
	public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
		this.changeExtendView(false);
		App.TimerManager.remove(this.frameCall,this);
		this.txtKfInput.text = "";
		if(this.curChanel==EChatType.EChatTypeKF || this.curChanel==EChatType.EChatTypeSystem){
			this.curChanel=EChatType.EChatTypeTotal;
		}

	}

	public clickSend(): void {
		if(this.curChanel==EChatType.EChatTypeKF){
			this.sendKf();
		}else{
			this.sendMsg();
		}
	}

}