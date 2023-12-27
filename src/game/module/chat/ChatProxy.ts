class ChatProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**发送聊天消息 */
	public sendChatMsg(chatType: EChatType, content: string, param: any=null): void {
		param = param || {};
		var chatMsg:SChatMsg = new SChatMsg();
		chatMsg.chatType_I = chatType;				
		chatMsg.content_S = content;
		chatMsg.font_I = param.textColor || 0;
		chatMsg.crossFlag_B = param.crossFlag || false;
		chatMsg.toPlayerName_S = param.toPlayerName_S || "";
		chatMsg.playerItems = param.playerItems || {data:[]};
		if(param.toEntityId){
			chatMsg.toEntityId = param.toEntityId;
		}
		if(param.extend){
			chatMsg.extend = param.extend;
		}

		// 参考 E:\LuaScript-2D\MainGame\Module\Chat\ChatProxy.lua

		this.send("ECmdGameInteractiveChat", {chatMsg:chatMsg});
	}

	/**
	 * 修改常用语
	 */
	public sendChangeLang(phraseId_I:number,phrase_S:string):void{
		//C2S_SChangePhrase
		this.send("ECmdGameInteractiveChangeChatPhrase", {changePhrase:{phraseId_I:phraseId_I,phrase_S:phrase_S}});
	}
	/**
	 * 获取某个频道的离线消息
	 */
	public getChanelCacheMsg(chatType:EChatType,pageSize:number,pageIndex:number):void{
		this.send("ECmdGameGetCachedInteractiveMsgs", {type:chatType,pageSize:pageSize,pageIndex:pageIndex});
	}
	/**发送GM/客服报告 */
	public sendGmReport(content:string,reportType:number=99,title:string="问题反馈"):void{ //C2S_SSendGmReport
		 this.send("ECmdGameSendGmReport",{content:content,reportType:reportType,title:title});
	}

}