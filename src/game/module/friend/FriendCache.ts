class FriendCache implements ICache{
	/**最大联系人数量 */
	public static MAX_CONTACT:number = 20;

	public applyPlayers: Array<any> = [];
	public friendList: Array<any> = [];
	public blackList: Array<any> = [];

	private mails: Array<any>;
	public isShowMail: boolean = false;
	private _maxFriendAmount: number = 0;
	/**最近联系人列表 {player:miniPlayer,talkDt:lastTalkDt_DT} */
	private _friendContacts:any[];
	private _isNeedContactSort:boolean=false;
	/**离线消息的玩家id SSeqInt */
	private _offlineMsgIds:any;
	/**离线消息的玩家id(请求用的) SSeqInt */
	private _offlineReqIds:any;
	/**在线收到未读的玩家私聊信息 */
	private _onlineMsgIds:number[];

	/**跨服场景临时黑名单(entityId.id_I) */
	private _crossShieldList:number[];

	// private friendInfo: Array<any> = [];
	public constructor() {
		this._friendContacts = [];
		this._onlineMsgIds = [];
	}

	public updateList(info: Array<any>): void{
		let contacts:any[] = []; //最近联系人列表
		let friendDatas: Array<any> = [];
		let data: any = {};
		let flag: number = 0;
		for(let d of info){
			let friendPlayer: any = d.friendPlayer;//SFriendRecord
			data = {"entityId": friendPlayer.entityId, 
					"name": friendPlayer.name_S, 
					"level": friendPlayer.level_SH, 
					"career": friendPlayer.career_SH, 
					"online": friendPlayer.online_BY,
					"lastLogout": d.lastLogoutDt_DT
				};
			friendDatas.push(data);			
			if(flag == 0){
				flag = d.flag_I;
			}
			if(flag==EFriendFlag.EFriendFlagFriend && d.lastTalkDt_DT>0){ //初始化好友列表
				contacts.push({player:d.friendPlayer,talkDt:d.lastTalkDt_DT});
			}
		}
		
		if(flag==EFriendFlag.EFriendFlagFriend){
			this.setFriendContacts(contacts);
		}		
		this.setFriends(flag, friendDatas);
	}
	/**
	 * 设置联系人列表 [{player:miniPlayer,talkDt:}]
	 */
	public setFriendContacts(value:any[]):void{
		App.ArrayUtils.sortOn(value,"talkDt",true);
		value = value.slice(0,FriendCache.MAX_CONTACT);
		this._friendContacts = value;
	}

	/**设置一个需要置顶显示的联系人 */
	public setTempContactInfo(info:any):void{
		this.swapContactsTop(info);
	}

	public setContactOnline(playerId:number,talkDt:number):void{
		let isIn:boolean = false;
		for(let info of this._friendContacts){
			if(info.player.entityId.id_I==playerId){
				info.talkDt = talkDt;
				isIn = true;
				this._isNeedContactSort = true;
				break;
			}
		}
		//在线和一个还没私聊过的人私聊
		if(!isIn && this.friendList && this.friendList.length>0){
			let retFriend:any;
			for(let friend of this.friendList){
				if(friend.entityId.id_I==playerId){
					retFriend = friend;
					break; 
				}
			}
			if(retFriend){
				// name_S,career_SH,online_BY 
				this._isNeedContactSort = true;
				let player:any = {name_S:retFriend.name,
					career_SH:retFriend.career,
					online_BY:retFriend.online,entityId:retFriend.entityId};
				let contactInfo:any = {player:player,talkDt:talkDt};
				this._friendContacts.push(contactInfo);
			}			
		}

	}

	/**添加联系人 {player:miniPlayer,talkDt:} */
	private swapContactsTop(info:any):void{
		if(!info){
			return;
		}
		let posIdx:number = -1;
		for(let i:number=0;i<this._friendContacts.length;i++){
			let v:any = this._friendContacts[i];			
			if( v.player.entityId.id_I==info.player.entityId.id_I ){
				posIdx = i;
				break;
			}
		}
		if(posIdx==-1){
			this._friendContacts.unshift(info);
		}else{
			this._friendContacts.splice(posIdx,1);
			this._friendContacts.unshift(info);
		}
	}
	
	/**添加跨服场景聊天临时黑名单 */
	public addCrossShield(id:number):void{
		if(!this._crossShieldList){
			this._crossShieldList = [];
		}
		if(this._crossShieldList.indexOf(id)<=-1){
			this._crossShieldList.push(id);
		}
	}
	/**是否跨服场景临时黑名单 */
	public isCrossShield(playerId:number):boolean{
		return this._crossShieldList && this._crossShieldList.indexOf(playerId)>-1; 
	}
	/**清空跨服场景聊天临时黑名单 */
	public clearCrossShield():void{
		if(this._crossShieldList){
			App.ArrayUtils.emptyArr(this._crossShieldList);
		}
	}

	public sortContact():void{
		if(this._friendContacts && this._isNeedContactSort ){
			this._isNeedContactSort = false;
			App.ArrayUtils.sortOn(this._friendContacts,"talkDt",true);
		}		
	}

	public get friendContacts():any[]{
		return this._friendContacts;
	}

	public set offlineMsgIds(value:any){
		this._offlineMsgIds = value;
		this._offlineReqIds = value;
	}
	/**有给我发送离线消息的玩家id列表 */
	public get offlineMsgIds():any{
		return this._offlineMsgIds;
	}

	public clearOfflineReqIds(){
		this._offlineReqIds = null;
	}
	public get offlineReqIds():any{
		return this._offlineReqIds;
	}

	/**是否有离线消息 */
	public isHasOfflineMsg():boolean{
		let intSeq:any = this._offlineMsgIds?this._offlineMsgIds.intSeq:null;
		return intSeq && intSeq.data_I && intSeq.data_I.length>0;
	}
	/**删除一个离线消息的玩家id(已读该消息) */
	public removeOfflineMsgId(playerId:number):void{
		let intSeq:any = this._offlineMsgIds?this._offlineMsgIds.intSeq:null;
		if(intSeq && intSeq.data_I){
			let idx:number = intSeq.data_I.indexOf(playerId);
			if(idx>-1){
				intSeq.data_I.splice(idx,1);
			}
		}
	}
	
	/**是否有离线消息 */
	public isPlayerHasOfflineMsg(playerId:number):boolean{
		let idx:number = -1;
		let intSeq:any = this._offlineMsgIds?this._offlineMsgIds.intSeq:null;
		if(intSeq && intSeq.data_I){
			idx = intSeq.data_I.indexOf(playerId);			
		}
		return idx>-1;
	}
	/**是否有在线收到的未读私聊信息 */
	public isHasOnlineMsg():boolean{
		return this._onlineMsgIds.length>0;
	}
	/**最近联系人页签是否红点 */
	public isContactTip():boolean{
		return this.isHasOfflineMsg() || this.isHasOnlineMsg();
	}
	
	public isPlayerOnlineMsg(playerId:number):boolean{
		return this._onlineMsgIds.indexOf(playerId)>-1;
	}
	/**处理在线未读的私聊玩家id */
	public dealOnlineMsgId(playerId:number,isAdd:boolean):void{
		let idx:number = this._onlineMsgIds.indexOf(playerId);
		if(isAdd){			
			idx==-1?this._onlineMsgIds.push(playerId):"";
		}else{
			
			if(idx>-1){
				this._onlineMsgIds.splice(idx,1);
			}
		}
	}

	public isMyFriend(playerId:number):boolean{
		let flag:boolean = false;
		if(this.friendList){
			for(let info of this.friendList){
				if(info.entityId.id_I==playerId){
					flag = true;
					break;
				}
			}
		}
		return flag;
	}

	// public addFriend(friendPlayer: any): void{
	// 	let data: any = {};
	// 	// let playerId: number = friendPlayer.entityId.id;
	// 	let friendDatas: Array<any> = this.getFriends(EFriendFlag.EFriendFlagFriend);
	// 	data = {"entityId": friendPlayer.entityId, 
	// 			"name": friendPlayer.name_S, 
	// 			"level": this.getName(friendPlayer), 
	// 			"career": friendPlayer.career_SH, 
	// 			"online": friendPlayer.online_BY};
	// 	friendDatas.push(data);
	// 	this.setFriends(EFriendFlag.EFriendFlagFriend, friendDatas);
	// }

	/**
	 * @param friendRecord SFriendRecord
	 */
	public updateFriend(type: EUpdateType, friendRecord: any): void{
		let friendPlayer: any = friendRecord.friendPlayer;
		let friendDatas: Array<any> = this.getFriends(friendRecord.flag_I);
		let data: any = {};
		let index: number = -1;
		data = {"entityId": friendPlayer.entityId, 
				"name": friendPlayer.name_S, 
				"level": friendPlayer.level_SH, 
				"career": friendPlayer.career_SH, 
				"online": friendPlayer.online_BY,
				"lastLogout": friendRecord.lastLogoutDt_DT
			};

		for(let d of friendDatas){
			if(d.entityId.id_I == data.entityId.id_I){
				index = friendDatas.indexOf(d);
				break;
			}
		}

		if(type == EUpdateType.EUpdateTypeAdd){
			friendDatas.push(data);
		}else if(type == EUpdateType.EUpdateTypeDel){
			if(index != -1){
				friendDatas.splice(index, 1);
			}
			CacheManager.chat.removePrivateMsg(friendPlayer.entityId.id_I);

		}else if(type == EUpdateType.EUpdateTypeUpdate){
			if(index != -1){
				friendDatas[index] = data;
			}
		}
		this.setFriends(friendRecord.flag_I, friendDatas);
	}

	public updateFriendOnlineStatus(flag: EFriendFlag, playerId: number, online: boolean): void{
		let friendDatas: Array<any> = this.getFriends(flag);
		for(let d of friendDatas){
			if(d.entityId.id_I == playerId){
				d.online = online;
				d.lastLogout = Date.now()/1000;
			}
		}
		
		if(this._friendContacts){
			for(let i:number=0;i<this._friendContacts.length;i++){
				if(this._friendContacts[i].player && this._friendContacts[i].player.entityId.id_I == playerId){
					this._friendContacts[i].player.online_BY = online?1:0;
				}
			}
		}

		this.sortFriends();
	}

	public getFriends(flag: EFriendFlag): Array<any>{
		if(flag == EFriendFlag.EFriendFlagFriend){
			return this.friendList;
		}else if(flag == EFriendFlag.EFriendFlagBlackList){
			return this.blackList;
		}
		return [];
	}

	public setFriends(flag: EFriendFlag, friendArr: Array<any>): void{
		if(flag == EFriendFlag.EFriendFlagFriend){
			// friendArr.sort((a: any, b:any): number =>{
			// 	return this.getFriendSort(a,b);
			// });
			this.friendList = friendArr;
			this.sortFriends();
		}else if(flag == EFriendFlag.EFriendFlagBlackList){
			this.blackList = friendArr;
		}
	}

	public isFriendOnline(entityId:any):boolean {
		for (let f of this.friendList) {
			if (EntityUtil.isSame(entityId, f.entityId)) {
				return f.online;
			}
		}
		return false;
	}

	private sortFriends(): void{
		this.friendList.sort((a: any, b:any): number =>{
			return this.getFriendSort(a,b);
		});
	}

	private getFriendSort(a:any, b:any):number{
		if(a.online){
			return -1;
		}else if(b.online){
			return 1;
		}else{
			let aRebirthTimes: number = CareerUtil.getRebirthTimes(a.career);
			let bRebirthTimes: number = CareerUtil.getRebirthTimes(b.career);
			if(aRebirthTimes > bRebirthTimes){
				return -1;
			}else if(aRebirthTimes < bRebirthTimes){
				return 1;
			}else{
				if(a.level > b.level){
					return -1;
				}else if(a.level < b.level){
					return 1;
				}
			}
		}
		return 0;
	}

	public setApplyPlayers(info: any): void{
		let players: Array<any> = [];
		let data: any = {};
		for(let d of info){
			let fromPlayer: any = d.fromPlayer;//SApplyMsg
			data = {"entityId": fromPlayer.entityId, 
					"name": fromPlayer.name_S, 
					"level": fromPlayer.level_SH, 
					"career": fromPlayer.career_SH
				};
			players.push(data);
		}
		this.applyPlayers = players;
	}

	public getApplyPlayers(): Array<any>{
		return this.applyPlayers;
	}

	public addApplyPlayer(fromPlayer: any): void{
		let data: any = {};
		data = {"entityId": fromPlayer.entityId, 
				"name": fromPlayer.name_S, 
				"level": fromPlayer.level_SH, 
				"career": fromPlayer.career_SH
			};
		for(let d of this.applyPlayers){
			if(d.entityId.id_I == data.entityId.id_I){
				return;
			}
		}
		this.applyPlayers.push(data);
	}

	public delApplyPlayer(id: number): void{
		for(let d of this.applyPlayers){
			if(id == d.entityId.id_I){
				let index: number = this.applyPlayers.indexOf(d);
				if(index != -1){
					this.applyPlayers.splice(index, 1);
				}
			}
		}
	}

	// private getLevelStr(miniPlayer: any): string{
	// 	let str: string = "(";
	// 	let rebirthTimes: number = CareerUtil.getRebirthTimes(miniPlayer.career_SH);
	// 	if(rebirthTimes > 0) {
	// 		str += rebirthTimes + "转";
	// 	}
	// 	str += miniPlayer.level_SH + "级";
	// 	str += ")";
	// 	return str;
	// }

	public get maxFriendAmount(): number{
		if(this._maxFriendAmount == 0){
			this._maxFriendAmount = ConfigManager.const.getConstValue("MaxFriendAmount");
		}
		return this._maxFriendAmount;
	}

	public isMaxFriend(): boolean{
		if(this.getFriends(EFriendFlag.EFriendFlagFriend).length >= this.maxFriendAmount){
			return true;
		}
		return false;
	}

	public checkTips():boolean{
		return this.isHasApplyPlayer() || this.isContactTip();
	}

	public isHasApplyPlayer(): boolean{
		if(this.applyPlayers.length > 0){
			return true;
		}
		return false;
	}

	public updateMailIcon(): void{
		this.isShowMail = false;
		for(let mail of this.mailsInfo){
			if(mail.hadAttachment_I == EMailAttach.EMailAttachYes || mail.status_I == EMailStatus.EMailStatusUnRead){
				this.isShowMail = true;
				break;
			}
		}
	}

	public set mailsInfo(info: Array<any>){
		this.mails = info;
	}

	public get mailsInfo(): Array<any>{
		if(this.mails){
			return this.mails;
		}
		return [];
	}

	public clear(): void{

	}

	public getFriendList(state : number) {
		var list: Array<any> = [];
		for(let i = 0;i<this.friendList.length;i++) {
			let st:number = CareerUtil.getRebirthTimes(this.friendList[i].career);
			if(st >= state) {
				list.push(this.friendList[i]);
			}
		}
		return list;
	}
}