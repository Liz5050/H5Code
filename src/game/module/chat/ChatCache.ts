/**
 * 服务器的聊天数据缓存
 */
class ChatCache {
	/**每个频道最多可以显示多少条聊天消息 */
	public static MAX_LINE:number = 50; 
	/**主界面最多显示的条数 */
	public static HOME_MAX:number = 3;
	/**聊天最大输入字符数 */
	public static MAX_INPUT:number = 30;
	
	
	/**所有的聊天消息(综合频道) */
	private _totalMsgArr:Array<any>;
	/**主界面显示的聊天消息内容 */
	private _homeMsgArr:Array<any>;
	private _faceData:Array<any>;
	/**是否锁定聊天区域不滚动 */
	public isLock:boolean;
	public isCopyMsgEnd:boolean = true;
	/**是否点击主界面的链接 */
	public isClickLink:boolean = false;
	/**各个频道要发送的物品数据 */
	private _chanelItems:any;
	private _chanelUnRead:any;
	/**所有频道的消息 */
	private _chanelMsg:any;
	/**聊天常用语 */
	private _chatPhrase:any;
	private _msgBroadMsg:any;

	/**上次发送的世界频道消息的时间戳 */
	private _nextSendCDTime:number = 0;
	/**已经请求缓存数据的频道 */
	private _reqChanelDict:any;
	private _gmReportDict:any;
	/**私聊消息字典 */
	private _privateMsgDict:any;
	/**守卫副本的广播日志 */
	private _dfCopyLog:any[];

	/**仙盟频道是否有红点 */
	public isGuildTip:boolean=false;
	/**是否打开过仙盟 */
	public isClickGuild:boolean = false;
	
	/**当前编辑的常用语id */
	private _curEditeId:number = 0;
	
	public constructor() {
		this._chanelMsg = {};
		this._totalMsgArr = [];
		this._homeMsgArr = [];
		this._dfCopyLog = [];
		this._chanelItems = {};
		this._chatPhrase = {};
		this._chanelUnRead = {};
		this._msgBroadMsg = {};
		this._reqChanelDict = {};
		this._gmReportDict = {};
		this._privateMsgDict = {};
		
		this.createFaceData();
		var data:any = ConfigManager.chatPhrase.getDict();
		for(var key in data){
			this._chatPhrase[key] = {phraseId_I:data[key].id,phrase_S:data[key].phrase};
		}	
	}

	protected createFaceData():void{
		this._faceData = [];
		var len:number = ChatEnum.CHAT_FACE_MAX;

		for(var i:number = 1;i<=len;i++){
			this._faceData.push({id:i});
		}

	}
	/**
	 * 保存各个区域的消息
	 */
	public setBroadMsg(data:any,areaType:EShowArea,isFirst:boolean=false):void{
		var arr:any[] = this._msgBroadMsg[areaType];
		if(!arr){
			arr = [];
			this._msgBroadMsg[areaType] = arr;
		}
		if(isFirst){ //插入开头
			ArrayUtils.insert(data,0,arr);
		}else{
			arr.push(data);
			if(areaType==EShowArea.EShowAreaMiddle || areaType==EShowArea.EShowAreaMiddleTop){
				//跑马灯和场景广播都需要排序			
				App.ArrayUtils.sortOn(arr,"createDt",true); //先按时间排序				
				let maxNum:number = ConfigManager.const.getConstValue("ClientBroadcastCachedMaxNum");
				if(maxNum>0 && arr.length>maxNum){ //广播太多 截取掉最旧的			
					arr.splice(maxNum,arr.length-maxNum);
				}
				this.sortBroadMsg(arr);
			}
		}		
	}

	/**
	 * 根据显示位置获取第一个广播消息
	 * 
	 */
	public shiftBroadMsg(areaType:EShowArea):any{
		var arr:any[] = this._msgBroadMsg[areaType];
		if(arr && arr.length>0){
			return arr.shift();
		}
		return null;
	}

	private sortBroadMsg(arr:any[]):void{
		arr.sort(function (a:any,b:any):number{			
			let infA: any = ConfigManager.propertiesMsg.getByPk(a.msgKey_S);
			let infB: any = ConfigManager.propertiesMsg.getByPk(b.msgKey_S);
			let lvA:number = infA && infA.broadcastLevel?infA.broadcastLevel:0;
			let lvB:number = infB && infB.broadcastLevel?infB.broadcastLevel:0;
			if(lvA>lvB){
				return -1;
			}else if(lvA<lvB){
				return 1;
			}
			return 0;
		});
	}

	public setCurEditeId(id:number):void{
		this._curEditeId = id;
	}

	/**是否当前编辑的常用语id */
	public isCurEditeId(id:number):boolean{
		return this._curEditeId == id;
	}

	/**当前编辑的常用语id */
	public get curEditeId():number{
		return this._curEditeId;
	}

	/**保存聊天消息 */
	public setChatMsg(data:any,isUpdateHome:boolean=true,isPrivateEvt:boolean=false):void{
		var msg:SChatMsg = new SChatMsg();
		SChatMsg.parseData(data,msg);		
		if(msg.chatType_I==EChatType.EChatTypePrivate){
			this.setPrivateMsg(msg);
			if(isPrivateEvt){
				EventManager.dispatch(LocalEventEnum.ChatPrivateUpdate,{entityId:msg.fromPlayer.entityId,talkDt:msg.chatDt});
			}			
			return;
		}

		let isBattle:boolean = msg.chatType_I==EChatType.EChatTypeBattleFiled;
		if(isBattle){//血战五洲战场的，强制改成系统
			msg.chatType_I = EChatType.EChatTypeSystem;
		}

		let chanel:number = msg.chatType_I;
		if(msg.chatType_I==EChatType.EChatTypeCrossEx){ //跨服广播消息,修改为添加到系统频道(2018年11月22日11:27:23)		
			chanel = EChatType.EChatTypeSystem;
		}
		this.addChanelMsg(chanel,msg);

		if(msg.chatType_I==EChatType.EChatTypeTrumpet){ //喇叭需要显示在世界频道
			this.addChanelMsg(EChatType.EChatTypeWorld,msg);
			EventManager.dispatch(LocalEventEnum.ChatAddToBroad,msg,EShowArea.EShowAreaMiddle)	
		}		
		this._totalMsgArr.push(msg);
		let maxLen:number = (ChatUtils.getChatChanelInfos().length-1) * ChatCache.MAX_LINE;
		this.spliceData(this._totalMsgArr,maxLen);

		//战场消息 要马上更新到缩略框
		if(isUpdateHome && (isBattle || msg.chatType_I!=EChatType.EChatTypeSystem)){			
			this.setHomeMsg();
			EventManager.dispatch(NetEventEnum.ChatHomeMsgUpdate);	
		}
	}
	/**
	 * 删除某个人的聊天消息
	 *  */
	public delPlayerMsg(entityId:any):void{
		this.delPlayerChanelMsg(EChatType.EChatTypeGuild,entityId);
		this.delPlayerChanelMsg(EChatType.EChatTypeWorld,entityId);
		this.delPlayerChanelMsg(EChatType.EChatTypeCross,entityId);
		this.delChatData(entityId,this._totalMsgArr);
		this.delChatData(entityId,this._homeMsgArr);
		Log.trace(Log.TEST,`成功删除了玩家id=${entityId.id_I} 的所有私聊消息`);
		this.removePrivateMsg(entityId.id_I);
	}
	
	private delPlayerChanelMsg(chatType:number,entityId:any):boolean{
		let flag:boolean = false;
		let chanelData:Array<any> =  this.getChanelMsgs(chatType);		
		if(!chanelData || chanelData.length<=0){
			return flag;
		}
		flag = this.delChatData(entityId,chanelData);
		if(flag){
			Log.trace(Log.TEST,`成功删除了玩家id=${entityId.id_I} 的 ${ChatUtils.getChanelName(chatType)} 频道`);
		}
		return flag;
	}

	private delChatData(entityId:any,chanelData:any[]):boolean{
		let flag:boolean = false;
		let c:number = 0;
		for(let i:number=0;i<chanelData.length;i++){
			if(chanelData[i].fromPlayer && chanelData[i].fromPlayer.entityId && chanelData[i].fromPlayer.entityId.id_I==entityId.id_I){
				chanelData.splice(i,1);
				i--;
				flag = true;
				c++;
			}
		}
		return flag;
	}

	private setPrivateMsg(msg:any):void{
		if(!msg.toEntityId || !msg.fromPlayer){
			return;
		}
		let keyId:number = 0;
		if(EntityUtil.isSame(msg.fromPlayer.entityId,CacheManager.role.entityInfo.entityId)){
			keyId = msg.toEntityId.id_I;
		}else{
			keyId = msg.fromPlayer.entityId.id_I;
		}
		
		if(!this._privateMsgDict[keyId]){
			this._privateMsgDict[keyId] = [];
		}
		this._privateMsgDict[keyId].push(msg);
	}
	/**获取某个玩家和我私聊的信息 */
	public getPrivateMsgs(playerId:number):any[]{
		return this._privateMsgDict[playerId];
	}
	/**删除某个人的聊天消息 */
	public removePrivateMsg(playerId:number):void{
		delete this._privateMsgDict[playerId];
	}
	/**守护神剑的获得物品广播记录 */
	public addDfCopyLog(msg:any):void{
		this._dfCopyLog.push(msg);
		this._dfCopyLog = this._dfCopyLog.slice(0,4);
	}

	public get dfCopyLog():any[]{
		return this._dfCopyLog;
	}

	/**
	 * 判断下一个广播是否和数据一样
	 */
	public isSameBroadMsg(data:any,areaType:EShowArea):boolean{
		var arr:any[] = this._msgBroadMsg[areaType];
		if(arr && arr.length>0 && arr[0].content_S==data.content_S){
			return true;
		}	
		return false;
	}

	public saveSendTimeStamp():void{
		//CacheManager.serverTime.getServerTime()
		let now:number = egret.getTimer();
		this._nextSendCDTime = now + ConfigManager.const.getChatIntervalTime()*1000;
	}
	/**发送消息cd中 */
	public isInSendCd():boolean{
		let now:number = egret.getTimer();
		return this._nextSendCDTime > now;
	}

	public isChanelReq(chatType:number):boolean{
		return this._reqChanelDict[chatType];
	}

	public setChanelReq(chatType:number):void{
		this._reqChanelDict[chatType] = true;
	}
	/**主界面的聊天消息栏是否满 */
	public isHomeFullMsg():boolean{
		return this._homeMsgArr.length>=ChatCache.HOME_MAX;
	}
	/**把登录请求的离线聊天信息设置到缩略栏 */
	public setLoginHomeMsg(data:any):void{
		if(!this.isHomeFullMsg()){ //登录这段时间都没有消息
			let seqCacheData:any = data.msgs.msgs;
			let isData:boolean = seqCacheData.data.length; 
			for(let msg of seqCacheData.data){
				//SCachedInteractiveMsg
				let schat:any;
				switch(msg.msgType_I){ //timpstamp_I
					case ECachedInteractiveMsgType.ECachedInteractiveMsgTypeChat:
						schat = msg;
						break;
					case ECachedInteractiveMsgType.ECachedInteractiveMsgTypePublicNotice:
						msg = ChatUtils.fmtBroadMsg(msg);
						schat = ChatUtils.noticeToChatMsg(msg);
						break;
				}
				if(this.isHomeFullMsg()){
					break;
				}else if(schat){
					this._homeMsgArr.push(schat);
				}
			}
			EventManager.dispatch(NetEventEnum.ChatHomeMsgUpdate);
		}
	}

	/**
	 * 处理返回的离线聊天内容(有数据返回true)
	 * S2C_SGetCachedInteractiveMsgs
	 */
	public setChanelCacheMsg(data:any):boolean{
		//SSeqCachedInteractiveMsg ; SeqCachedInteractiveMsg
		let seqCacheData:any = data.msgs.msgs;
		let msgArr:any[]=seqCacheData.data;
		msgArr.reverse();
		let isData:boolean = msgArr.length>0; 
		for(let msg of msgArr){
			//SCachedInteractiveMsg
			switch(msg.msgType_I){ //timpstamp_I
				case ECachedInteractiveMsgType.ECachedInteractiveMsgTypeChat:
					msg.chatMsg.content_S = ConfigManager.chatFilter.replace(msg.chatMsg.content_S);
					this.setChatMsg(msg.chatMsg,false);
					break;
				case ECachedInteractiveMsgType.ECachedInteractiveMsgTypePublicNotice:
					let notice:any = ChatUtils.fmtBroadMsg(msg.notice);					
					let schat:SChatMsg = ChatUtils.noticeToChatMsg(notice);
					schat.content_S = ConfigManager.chatFilter.replace(schat.content_S);				
					this.setChatMsg(schat,false);
					break;
			}
		}
		/*
		if(isData && data.type!=EChatType.EChatTypeSystem){ //有数据，并且不是系统消息，更新主界面
			EventManager.dispatch(NetEventEnum.ChatHomeMsgUpdate);
		}
		*/
		return isData;
		
	}

	public clearBroadMsg(areaType:EShowArea):void{
		var arr:any[] = this._msgBroadMsg[areaType];
		if(arr && arr.length>0){
			arr.splice(0,arr.length);
		}
	}

	/**增加未读信息数量 */
	public addUnReadCount(chanel:number):void{
		if(!this._chanelUnRead[chanel]){
			this._chanelUnRead[chanel] = 0;
		}
		this._chanelUnRead[chanel]++;
	}
	public setReportInfo(data:any):void{		
		this._gmReportDict = {todayNum:data.intSeq.data_I[0],maxNum:data.intSeq.data_I[1]}; 
	}
	/**是否还有客服报告次数 */
	public isHasReportNum():boolean{
		return this._gmReportDict.todayNum<this._gmReportDict.maxNum;
	}

	public setUnreadCount(chanel:number,num:number):void{
		this._chanelUnRead[chanel] = num;
	}

	public getUnReadCount(chanel:number):number{
		var n:number = 0;
		if(this._chanelUnRead[chanel]){
			n = this._chanelUnRead[chanel];
		}
		return n;
	}
	/**把消息添加进频道 */
	public addChanelMsg(chatType:number,msg:any):void{
		var chanelData:Array<any> =  this.getChanelMsgs(chatType);		
		chanelData.push(msg);
		this.spliceData(chanelData,ChatCache.MAX_LINE);
	}
	/**获取某个频道的聊天记录 */
	public getChanelMsgs(chatType:EChatType):Array<any>{
		if(chatType==EChatType.EChatTypeTotal){
			if(!CopyUtils.isInCrossChat()){
				let arr:any[] = this._totalMsgArr.concat();
				for(let i:number= 0;i<arr.length;i++){
					if(arr[i].crossFlag_B && arr[i].chatType_I!=EChatType.EChatTypeTeam){ //删除跨服消息
						arr.splice(i,1);
						i--;
					}
				}
				return arr;
			}
			return this._totalMsgArr;
		}
		var chanelData:Array<any> =  this._chanelMsg[chatType];
		if(!chanelData){
			chanelData = [];
			this._chanelMsg[chatType] = chanelData;
		}
		return chanelData;
	}
	/**
	 * 清空某个频道的消息
	 */
	public clearChanelMsg(chatType:EChatType):void{
		delete this._chanelMsg[chatType];
	}

	/**记录聊天频道中输入的物品 */
	public addChanelItem(chanel:number,itemData:ItemData):void{
		var items:any[] = this.getChanelItems(chanel);
		items.push(ItemsUtil.itemToSPlayerItem(itemData));
	}

	public getChanelItems(chanel:number):Array<any>{
		var items:Array<any> = this._chanelItems[chanel];
		if(!items){
			items = [];
			this._chanelItems[chanel] = items;
		}
		return items;
	}

	/**删除单个频道的聊天输入物品 */
	public delChanelItems(chanel:number):void{
		var items:any[] = this.getChanelItems(chanel);
		while(items.length>0){
			items.splice(0,1);
		}
	}

	/**
	 * 对比聊天物品和聊天字符串是否一致不一致的删掉
	 */
	public compChanelItem(itemName:string,chanel:number,idx:number):boolean{
		var b:boolean = false;
		var items:any[] = this.getChanelItems(chanel);
		if(items && idx<items.length){
			var spitem:any = items[idx];
			var flag:boolean = ItemsUtil.checkName(spitem.itemCode_I,itemName);
			if(!flag){
				items.splice(idx,1);
				b = true;
			}
		}
		return b;
	}
	/**在线修改更新常用语 */
	public updateChatPhrase(sphrase:any):void{
		this._chatPhrase[sphrase.phraseId_I]=sphrase;
	}
	/**初始化常用语 */
	public initChatPhrase(data:any):void{
		for(var key in data){
			this.updateChatPhrase(data[key]);
		}
	}

	/**清空所有频道的聊天输入物品 */
	public clearChanelItems():void{
		for(var chanel in this._chanelItems){
			this.delChanelItems(Number(chanel));
		}
	}
	/**
	 * 根据聊天数据和下标获取物品 SPlayerItem
	 */
	public getChatItem(msg:SChatMsg,idx:number):any{
		return msg.playerItems && msg.playerItems.data?msg.playerItems.data[idx]:null;
	}

	/**判断聊天数据中是否是有效物品 */
	public isHasChatItem(msg:SChatMsg,idx:number):boolean{
		var item:any = this.getChatItem(msg,idx);
		return item!=null;
	}
	
	/**获取主界面要显示的聊天信息内容 */
	public get homeMsgArr():Array<any>{
		return this._homeMsgArr;
	}
	/**设置主界面的聊天消息 */
	public setHomeMsg():void{
		let arr:any[] = this.getChanelMsgs(EChatType.EChatTypeTotal);
		let stIdx:number = arr.length - ChatCache.HOME_MAX;
		this._homeMsgArr = arr.slice(stIdx,arr.length);		
	}

	public isHomeNewMsg(schat:any):boolean{
		if(this._homeMsgArr && this._homeMsgArr.length>0){
			let msgs:any[] =this._homeMsgArr.concat();
			App.ArrayUtils.sortOn(msgs,"chatDt",true);
			return msgs[0]==schat;
		}		
		return false;
	}

	/**表情数据 */
	public get faceData():Array<any>{
		return this._faceData;
	}

	public get chatPhrase():any[]{
		var phrases:any[] = [];
		for(var key in this._chatPhrase){
			phrases.push(this._chatPhrase[key]);
		}
		phrases.sort( function (a:any,b:any):number{
			var ret:number = 0;
			if(a.phraseId_I < b.phraseId_I){
				ret = -1;
			}else if(a.phraseId_I > b.phraseId_I){
				ret = 1;
			}
			return ret;
		});
		return phrases;
	}

	/**剔除超出最大数的记录 */
	private spliceData(dataArr:Array<any>,maxNum:number):void{
		if(dataArr.length>maxNum){
			var st:number = dataArr.length -  maxNum;
			dataArr.splice(0,st);
		}
		
	}



}