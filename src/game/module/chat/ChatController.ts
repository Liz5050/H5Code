class ChatController extends BaseController {
	private chatModule:ChatModule2;
	private toolTipData:ToolTipData;
	/**编辑常用语的窗口 */
	private langWin:ChatLanguageWindow;

	private _isTick:boolean = false;
	private _isLoginReq:boolean = false;
	/**登录需要请求的频道消息 */
	private _loginReqChanels:number[];

	public constructor() {
		super(ModuleEnum.Chat);	
	}
	public initView():BaseGUIView{
		if(!this.chatModule){
			this.chatModule = new ChatModule2();
		}
		return this.chatModule;
	}

	public addListenerOnInit():void{
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateChatMsg],this.onChatMsg,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateChatMsgPrivate],this.onPrivateChatMsg,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateChatMsgGuild],this.onChatMsg,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePlayerChatPhraseUpdate],this.onPhraseUpdate,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePlayerChatPhraseList],this.onPhraseList,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetCachedInteractiveMsgs],this.onChatChanelCahceMsg,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerGmReportNum],this.onGmReportNum,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgDeletePlayerMsg],this.onDelPlayerMsg,this);		
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossTeamChat],this.onChatMsg,this);		
		
		this.addListen0(LocalEventEnum.ChatAddChanelMsg,this.onAddMsg,this);
		//this.addListen0(LocalEventEnum.ChatGetChanelCacheMsg,this.onReqChatCacheMsg,this);
		this.addListen0(UIEventEnum.ChatClickLink,this.onChatLink,this);
		this.addListen0(UIEventEnum.HomeOpened,this.onHomeOpen,this);
		this.addListen0(UIEventEnum.SceneMapUpdated,this.onCheckHomeMsg,this);
		this.addListen0(LocalEventEnum.ChatSendMsg,this.onSendMsghandler,this);
	}

	public addListenerOnShow():void{
		this.addListen1(LocalEventEnum.ChatSendPos,this.onSendPos,this);
		this.addListen1(LocalEventEnum.ChatAppendText,this.onAppendText,this);
		this.addListen1(LocalEventEnum.ChatReplaceText,this.onReplaceText,this);
		this.addListen1(LocalEventEnum.ChatAddItem,this.onAddChatItem,this);
		this.addListen1(LocalEventEnum.ChatUnreadUpdate,this.onUnreadUpdate,this);
		this.addListen1(LocalEventEnum.TeamCrossInfoUpdate,this.onCrossTeamInfo,this);
		this.addListen1(UIEventEnum.ChatShowCopyMsg,this.onShowCopyBtn,this);		
		//this.addListen1(UIEventEnum.ChatEditLang,this.onEditLang,this);		
		this.addListen1(UIEventEnum.ChatSaveLang,this.onSaveLang,this);		
		this.addListen1(LocalEventEnum.ChatSendKf,this.onSendKfhandler,this);
		this.addListen1(UIEventEnum.ChatClickSend,this.clickSend,this);
		this.addListen1(UIEventEnum.ChatEditeChange,this.onEditeChange,this);

	}

	private onHomeOpen():void{
		if(!this._isTick){
			this._isTick = true;
			App.TimerManager.doTimer(300000,0,this.onCheckHomeMsg,this); //5分钟检查一次，更新系统消息到主界面显示 
			
			this._loginReqChanels = [EChatType.EChatTypeSystem,EChatType.EChatTypeWorld,EChatType.EChatTypeGuild];						
			let delaySec:number = 5; //登录后 延时一定秒数自动请求消息
			App.TimerManager.doDelay(delaySec*1000,this.onLoginReqChat,this);		
			
		}
	}
	/**登录后 请求聊天数据 */
	private onLoginReqChat():void{
		if(this._loginReqChanels && this._loginReqChanels.length>0){
			this._isLoginReq = true;
			let chatType:number = this._loginReqChanels.shift();			
			this.onReqChatCacheMsg(chatType);
		}		
	}
	/**通知刷新主界面消息 */
	private onCheckHomeMsg():void{
		CacheManager.chat.setHomeMsg();
		EventManager.dispatch(NetEventEnum.ChatHomeMsgUpdate);
	}
	/** SPhrase */
	private onPhraseUpdate(data:any):void{
		CacheManager.chat.updateChatPhrase(data);
		if(this.isShow){
			this.chatModule.updatePhrase();
		}
	}
	/**SPhraseList */
	private onPhraseList(data:any):void{
		CacheManager.chat.initChatPhrase(data.phrases.data);
	}
	/***
	 *获取某个频道的信息返回 
	  S2C_SGetCachedInteractiveMsgs
	 */
	private onChatChanelCahceMsg(data:any):void{

		/*
		let seqCacheData:any = data.msgs.msgs;
		let isData:boolean = seqCacheData.data.length; 
		if(this._isLoginReq){ //是登录请求 并且没有数据 继续请求
			if(!isData){
				this.onLoginReqChat();
			}else{
				//保存到主界面显示
				CacheManager.chat.setLoginHomeMsg(data);
			}
			this._isLoginReq = false;
			return;
		}
		*/
		Log.trace(Log.TEST,"----离线聊天数据------:",data);
		let isHasData:boolean = CacheManager.chat.setChanelCacheMsg(data);		
		if(this.isModuleNeedRefresh(data.type)){
			this.chatModule.updateChanelList(false);
		}
		if((isHasData && data.type==EChatType.EChatTypeGuild) || (this._loginReqChanels && this._loginReqChanels.length==0)){ //自动同步消息到缩略栏
			this.onCheckHomeMsg();
		}
		this.onLoginReqChat();
	}
	/**请求离线的聊天消息 */
	private onReqChatCacheMsg(chatType:EChatType,pageSize:number=ChatCache.MAX_LINE,pageIndex:number=0):void{
		if(chatType==EChatType.EChatTypeGuild && !CacheManager.guildNew.isJoinedGuild()){
			if(!this._loginReqChanels || (this._loginReqChanels && this._loginReqChanels.length==0)){
				this.onCheckHomeMsg();
			}
			return;
		}
		if(!CacheManager.chat.isChanelReq(chatType)){
			CacheManager.chat.setChanelReq(chatType);
			ProxyManager.chat.getChanelCacheMsg(chatType,pageSize,pageIndex);
		}		
	}
	
	/**客服报告次数 */
	private onGmReportNum(data:any):void{
		CacheManager.chat.setReportInfo(data);
	}
	private onAddMsg(data:any):void{
		this.dealChatMsg(data);
	}
	//私聊消息
	private onPrivateChatMsg(data:any):void{		
		if(data.notices && data.notices.data && data.notices.data.length>0){ //发送给私聊的广播(例如组队邀请)
			if(data.fromPlayer && CacheManager.team2.isIgnoreInvite(data.fromPlayer.entityId)){//设置了忽略的好友邀请消息
				return;
			}
			let spn:any = ChatUtils.fmtBroadMsg(data.notices.data[0]);
			data.content_S = spn.content_S;
		}
		this.onChatMsg(data);
	}
	/** SChatMsg 客户端定义了该结构体的类 因为字段太多了 */
	private onChatMsg(data:any):void{	
		if(data.chatType_I!=EChatType.EChatTypeGuild && data.fromPlayer && EntityUtil.isSame(data.fromPlayer.entityId,CacheManager.role.entityInfo.entityId)){
			CacheManager.chat.saveSendTimeStamp();
		}		
		CacheManager.chat.isGuildTip = !CacheManager.chat.isClickGuild && data.chatType_I==EChatType.EChatTypeGuild;
		this.dealChatMsg(data);				
	}

	private dealChatMsg(data:any):void{
		var msg:SChatMsg = data;//new SChatMsg();		
		//msg = data;		
		let isCrossMsg:boolean = msg.crossFlag_B && msg.chatType_I!=EChatType.EChatTypeTeam; //跨服频道的消息;组队消息也是跨服消息 但是不是跨服频道
		if(isCrossMsg && msg.fromPlayer && msg.fromPlayer.entityId && CacheManager.friend.isCrossShield(msg.fromPlayer.entityId.id_I)){
			return;//不处理跨服场景的临时黑名单
		}
		if(!ChatUtils.isSysChanel(msg)){ //非系统消息 都要检测敏感词
			msg.content_S = ConfigManager.chatFilter.replace(msg.content_S);
		}		
		if(isCrossMsg){ //跨服聊天
			msg.chatType_I=EChatType.EChatTypeCross;
		}
		CacheManager.chat.setChatMsg(msg,true,true);
		if(this.isModuleNeedRefresh(msg.chatType_I)){			
			this.chatModule.updateChanelList(false);		
		}
	}
	/**收到删除玩家消息 */
	public onDelPlayerMsg(entityId:any):void{
		CacheManager.chat.delPlayerMsg(entityId);
		if(this.isShow){
			this.chatModule.updateChanelList(false);
		}
		EventManager.dispatch(LocalEventEnum.ChatDelPlayerMsg,{entityId:entityId});
		this.onCheckHomeMsg();
	}

	private isModuleNeedRefresh(chatType:EChatType):boolean{
		return this.isShow && (this.chatModule.curChanel==chatType || this.chatModule.curChanel==EChatType.EChatTypeTotal)
	}

	/**
	 * 发送消息
	 * @param data {content:,chatType:}
	 */
	private onSendMsghandler(data:any):void{
		var content:string = data.content;		
		var chatType:number = data.chatType;
		//已经不需要发送物品了
		//ChatUtils.checkContentItem(content,chatType);		
		var param:any = {};
		//param.playerItems = {data:CacheManager.chat.getChanelItems(chatType)};
		if(data.param){
			/*
			//私聊,必须的参数
			param.toPlayerName_S = data.param.toPlayerName_S;
			param.toEntityId = data.param.toEntityId;
			//跨服参数
			param.crossFlag = data.param.crossFlag;
			*/
			ObjectUtil.copyProToRef(data.param,param,true);
		}
		ProxyManager.chat.sendChatMsg(chatType,content,param);
		CacheManager.chat.delChanelItems(chatType);
		
	}

	private onSendKfhandler(data:any):void{
		var content:string = ConfigManager.chatFilter.replace(data.content);
		ProxyManager.chat.sendGmReport(content);
	}

	/**发送坐标 */
	private onSendPos():void{
		if(this.chatModule){
			if(CacheManager.copy.isInCopy){
				Tip.showTip(LangChat.L_COPY_POS);
				return;
			}
			let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
			if (kingEntity != null) {			
				var mapid:number = CacheManager.map.mapId;
				let scene: any = CacheManager.map.getCurMapScene();
				if(scene){					
					var s:string = `<${scene.name}|${mapid}|${kingEntity.col}|${kingEntity.row}>`;
					this.onSendMsghandler({content:s,chatType:this.chatModule.curChanel})
				}
			}
		}		
	}
	private onAppendText(text:string):void{
		if(this.chatModule){
			this.chatModule.appendText(text);		
		}
	}
	private onReplaceText(text:string):void{
		if(this.chatModule){
			this.chatModule.replaceText(text);
		}
	}

	private onAddChatItem(itemData:ItemData):void{
		if(this.chatModule){
			CacheManager.chat.addChanelItem(this.chatModule.curChanel,itemData);
			this.onAppendText(`[${itemData.getName()}]`);
		}		
	}

	private onUnreadUpdate(chatType:number,unreadNum:number):void{
		if(CacheManager.chat.isLock){			
			CacheManager.chat.setUnreadCount(chatType,unreadNum);			
		}
	}

	private onCrossTeamInfo():void{
		this.chatModule.updateAll();
	}

	protected onShowCopyBtn(index:number):void{
		if(this.chatModule){
			//this.chatModule.showCopyBtn(index);
		}
	}

	private onSaveLang(data:any):void{
		ProxyManager.chat.sendChangeLang(data.id,data.phrase);
	}

	/*
	protected onEditLang(data:any):void{
		if(!this.langWin){
			this.langWin = new ChatLanguageWindow();
		}
		this.langWin.show(data);
	}
	*/
	protected onChatLink(text:string):void{
		var arr:string[] = text.split("|");
		var linkType:string = arr[0];	
		text = arr.slice(1,arr.length).join("|");
		switch(linkType){
			case ChatEnum.CHAT_LINK_ITEM:
				this.onShowItemLink(text);
				break;
			case ChatEnum.CHAT_LINK_POS:
				this.onRouteLink(text); //点击
				break;
			case ChatEnum.CHAT_LINK_PLAYER:				
				let param:any = ChatUtils.strToEntityId(text); //{toEntityId:ChatUtils.strToEntityId(text)};				
				EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,param);	
				break;
			case ChatEnum.CHAT_LINK_BOSS:
				var copyCode:number = Number(arr[1]);
				var map_id:number = Number(arr[2]);
				var boss_code:number = Number(arr[3]);
				break;
			case ChatEnum.CHAT_LINK_APPLY_GUILD:
				var guildId:number = Number(arr[1]); //请求快速加入仙盟
				EventManager.dispatch(LocalEventEnum.GuildNewReqAplyJoin,guildId);
				break;
			case ChatEnum.CHAT_LINK_OPEN_MODULE:
				this.dealModuleLink(arr);				
				break;
			case ChatEnum.CHAT_LINK_APPLY_TEAM:
            	let groupId:any = {type_BY:Number(arr[1]), typeEx_SH:Number(arr[2]), typeEx2_BY:Number(arr[3]), id_I:Number(arr[4]), roleIndex_BY:0}; //请求快速加入队伍
				let cCode:number = Number(arr[5]);
				if (CacheManager.team.hasTeam) {
					Tip.showTip(LangLegend.LANG30);
					return;
				}
                EventManager.dispatch(LocalEventEnum.ApplyExEnterTeam,groupId, cCode);
                break;
			case ChatEnum.CHAT_LINK_APPLY_TEAM_CROSS:
            	groupId = {type_BY:Number(arr[1]), typeEx_SH:Number(arr[2]), typeEx2_BY:Number(arr[3]), id_I:Number(arr[4]), roleIndex_BY:0}; //请求快速加入跨服队伍
				cCode = Number(arr[5]);
				ChatUtils.applyTeam(cCode,groupId);
                break;
			case ChatEnum.CHAT_GAME_PLAY_OPEN:
				let gamePlayCfg:any = ConfigManager.gamePlay.getByPk(Number(arr[1]));
				if(gamePlayCfg) {
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GamePlay,gamePlayCfg);
				}
				break;
			case ChatEnum.CHAT_FAKE_RECHARGE:
				if(CacheManager.recharge.isFirstRecharge()){
					Tip.showLeftTip("您已领取首充礼包");
				}else{
					HomeUtil.openRecharge();
				}
				break;
			case ChatEnum.CHAT_GOLDCARD_OPEN:
				EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Welfare2, { "tabType": PanelTabType.GoldCard });
				break;
			case ChatEnum.CHAT_PRIVILEGECARD_OPEN:
				EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Welfare2, { "tabType": PanelTabType.PrivilegeCard });
				break;
			case ChatEnum.CHAT_COPY_ASSIT:
				this.dealAssit(Number(arr[1]),Number(arr[2]));
				break;
		}
		
	}

	private dealAssit(copyCode:number,mapId:number):void{
		if(!CacheManager.copy.isInCopy){
			let copyInfo:any = ConfigManager.copy.getByPk(copyCode);
			switch(copyInfo.copyType){
				case ECopyType.ECopyMgQiongCangAttic://穹苍阁
					ProxyManager.boss.reqEnterBossCopy(copyCode,mapId);
					break;
				case ECopyType.ECopyNewCrossBoss: //跨服boss 神兽岛
					ProxyManager.cross.reqEnterCrossBoss(copyCode,mapId);
					break;
			}
		}else{
			Tip.showLeftTip("在副本中无法传送");
		}
	}

	private dealModuleLink(arr:string[]):void{
		var mId:number = Number(arr[1]);
		if(mId==ModuleEnum.OpenRole){
			HomeUtil.open(ModuleEnum.OpenRole,false,{},ViewIndex.One);
			return;
		}
		if(mId==ModuleEnum.RechargeFirst){
			if(CacheManager.recharge.isFirstRecharge()){
				//已经首充,跳到每日充值
				if(CacheManager.recharge.isDayRechargeGetReward()){
					Tip.showLeftTip(LangActivity.L25);
				}else{
					EventManager.dispatch(LocalEventEnum.OpenDayRecharge);
				}
			}else{
				HomeUtil.openRecharge();
			}
			return;
		}

		if(arr[2]){
			let tabType:number = Number(arr[2]); //标签
			if(mId==ModuleEnum.Activity && ESpecialConditonType[PanelTabType[tabType]]){
				HomeUtil.openActivityByType(ESpecialConditonType[PanelTabType[tabType]]);
			}else{
				HomeUtil.open(mId,false,{tabType:tabType});
			}
			
		}else{
			HomeUtil.open(mId);
		}
	}

	protected onRouteLink(text:string):void{			
		var data:any = App.StringUtils.strToObj(text,"mapId,x,y");
		EventManager.dispatch(LocalEventEnum.SceneRouteToGrid,data);
	}
	protected onShowItemLink(text:string):void{
		if (!this.toolTipData) {
			this.toolTipData = new ToolTipData();
		}
		var spItem:any = ItemsUtil.strToSPlayerItem(text);
		var itemData:ItemData = new ItemData(spItem);
		this.toolTipData.isEnableOptList = false;
		this.toolTipData.data = itemData;
		this.toolTipData.type = ItemsUtil.getToolTipType(itemData);
		ToolTipManager.show(this.toolTipData);
	}

	public show(data?: any): void {
		super.show(data);
	}
	public hide(data?: any): void {
		super.hide(data);
		EventManager.dispatch(LocalEventEnum.ChatHomePanelVisible,true);
	}

	private clickSend(): void {
		this.chatModule.clickSend();
	}

	private onEditeChange(id:number,isEdite:boolean):void{
		let oldId:number = CacheManager.chat.curEditeId;
		if(isEdite){			
			CacheManager.chat.setCurEditeId(id);
		}else{			
			CacheManager.chat.setCurEditeId(0);
		}
		
	}

}