/**聊天消息结构体 */
class SChatMsg {

	/**发言玩家 Message::Public::SPublicMiniPlayer*/
	public fromPlayer: any;
	/** 发言玩家服务器名称 */
	public showServerName_S:string;
	/**发言玩家是否GM */
	public gmFlag_B: boolean;
	/**发言玩家是否新手指导员*/
	public guideFlag_B: boolean;
	/**是否是跨服聊天*/
	public crossFlag_B: boolean;
	/**势力 */
	public force_I: number;
	/** 对方玩家名*/
	public toPlayerName_S:string;
	/** 对方entityId Message::Public::SEntityId  */
	public toEntityId: any;
	/**聊天类型 */
	public chatType_I: number;
	/**聊天内容 */
	public content_S: string;
	/**字体 */
	public font_I: number;
	/**聊天时间 */
	public chatDt: any;
	/**语音id */
	public soundId: string;
	/**语音时长（秒） */
	public soundTime_I: number;
	/**扩展字符串数组（职位、称号等） Message::Public::SeqString */
	public extend: any;
	/**玩家物品 Message::Public::SeqPlayerItem  */
	public playerItems: any; // 
	/**玩家宠物 Message::Game::SeqSPetInfo  */
	public petInfos: any;
	/**广播消息 SeqSPublicNotice */
	public notices:any;
	
	public constructor() {
	}

	public static parseData(data:any,tar:SChatMsg):void{
		tar.fromPlayer = data.fromPlayer;
		tar.showServerName_S = data.showServerName_S;
		tar.gmFlag_B = data.gmFlag_B;
		tar.guideFlag_B = data.guideFlag_B;
		tar.crossFlag_B = data.crossFlag_B;
		tar.force_I = data.force_I;
		tar.toPlayerName_S = data.toPlayerName_S;
		tar.toEntityId = data.toEntityId;
		tar.chatType_I = data.chatType_I;
		tar.content_S = data.content_S;
		tar.font_I =  data.font_I
		tar.chatDt = data.chatDt_DT;
		tar.soundId = data.soundId_S;
		tar.soundTime_I = data.soundTime_I;
		tar.extend = data.extend;
		tar.playerItems = data.playerItems;
		tar.petInfos = data.petInfos;
		tar.notices = data.notices;
	}

	public copyByData(data:any): SChatMsg {
		var msg: SChatMsg = new SChatMsg();
		SChatMsg.parseData(data,msg);
		return msg;
	}

	public isPrivateNotice():boolean{
		return this.notices && this.notices.data && this.notices.data.length>0; 
	}


}